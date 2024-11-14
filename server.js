const express = require('express');
const { MongoClient, ObjectId } = require('mongodb')
const session = require('express-session');
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const app = express();
const port = 3001;
const MODEL_NAME = "gemini-pro";
const API_KEY = "AIzaSyD9_Z8R1ZUpAtHeXOiNuGEJzFnB95Ozs18";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'segredo-super-seguro',
    resave: false,
    saveUninitialized: true,
}));

const url = 'mongodb://127.0.0.1:27017/';
const EducaEco = 'EducaEco';
const collectionPublicacoes = 'publicações';
const collectionCursos = 'cursos';

// VOLTAR PÁGINA INDEX
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// PÁGINA ESCOLHA
app.get('/option', (req, res) => {
    res.sendFile(__dirname + '/pages/option.html');
});

// PÁGINA ERRO ALUNO
app.get('/erro', (req, res) => {
    res.sendFile(__dirname + '/pages/erroAluno.html');
});

// LOGIN ALUNO
app.get('/loginAluno', (req, res) => {
    res.sendFile(__dirname + '/pages/loginAluno.html');
});

// CADASTRO ALUNO
app.get('/signupAluno', (req, res) => {
    res.sendFile(__dirname + '/pages/cadastroAluno.html');
});

app.post('/signupAluno', async (req, res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    
    try{
        await client.connect();
        const banco = client.db(EducaEco);
        const collectionAlunos = banco.collection('alunos');

        const alunoExistente = await collectionAlunos.findOne({ nomeAluno: req.body.nomeAluno });

        if(alunoExistente) {
            res.send('Aluno já existe! Tente outro nome de usuário.');
        } else {
            const senhaCriptografa = await bcrypt.hash(req.body.senhaAluno, 10);

            await collectionAlunos.insertOne({
                nomeAluno: req.body.nomeAluno,
                senhaAluno: senhaCriptografa
            });
            res.redirect('/loginAluno');
        }
    } catch (erro) {
        res.send('Erro ao registrar o aluno.')
    } finally {
        client.close();
    }
});

app.post('/loginAluno', async (req,res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });

    try{
        await client.connect();
        const banco = client.db(EducaEco);
        const collectionAlunos = banco.collection('alunos');

        const aluno = await collectionAlunos.findOne({ nomeAluno: req.body.nomeAluno });

        if (aluno && await bcrypt.compare(req.body.senhaAluno, aluno.senhaAluno)){
            req.session.nomeAluno = req.body.nomeAluno;
            res.redirect('/aluno');
        } else {
            res.redirect('/erro');
        }
    } catch (erro) {
        res.send('Erro ao realizar login.');
    } finally {
        client.close();
    }
});

// PROTEGER ROTA ALUNO
function protegerRotaAluno(req, res, proximo){
    if (req.session.nomeAluno) {
        proximo();
    } else {
        res.redirect('/loginAluno');
    }
}

// PÁGINA ALUNO
app.get('/aluno', protegerRotaAluno, (req, res) => {
    res.sendFile(__dirname + '/pages/aluno.html');
});

// SAIR ALUNO
app.get('/sairAluno', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Erro ao sair!');
        }
        res.redirect('/loginAluno')
    })
});

// PÁGINA ERRO PROF
app.get('/erroProf', (req, res) => {
    res.sendFile(__dirname + '/pages/erroProf.html');
});

// LOGIN PROF
app.get('/loginProf', (req, res) => {
    res.sendFile(__dirname + '/pages/loginProf.html');
});

// CADASTRO PROF
app.get('/signupProf', (req, res) => {
    res.sendFile(__dirname + '/pages/cadastroProf.html');
});

app.post('/signupProf', async (req, res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    
    try{
        await client.connect();
        const banco = client.db(EducaEco);
        const collectionProfessores = banco.collection('professores');

        const professorExistente = await collectionProfessores.findOne({ nomeProf: req.body.nomeProf });

        if(professorExistente) {
            res.send('Professor já existe! Tente outro nome de usuário.');
        } else {
            const senhaCriptografa = await bcrypt.hash(req.body.senhaProf, 10);

            await collectionProfessores.insertOne({
                nomeProf: req.body.nomeProf,
                senhaProf: senhaCriptografa
            });
            res.redirect('/loginProf');
        }
    } catch (erro) {
        res.send('Erro ao registrar o professor.')
    } finally {
        client.close();
    }
});

// LOGIN PROF
app.post('/loginProf', async (req,res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });

    try{
        await client.connect();
        const banco = client.db(EducaEco);
        const collectionProfessores = banco.collection('professores');

        const professor = await collectionProfessores.findOne({ nomeProf: req.body.nomeProf });

        if (professor && await bcrypt.compare(req.body.senhaProf, professor.senhaProf)){
            req.session.nomeProf = req.body.nomeProf;
            res.redirect('/prof');
        } else {
            res.redirect('/erroProf');
        }
    } catch (erro) {
        res.send('Erro ao realizar login.');
    } finally {
        client.close();
    }
});

// PROTEGER ROTA PROFESSOR
function protegerRotaProf(req, res, proximo){
    if (req.session.nomeProf) {
        proximo();
    } else {
        res.redirect('/loginProf');
    }
}

// PÁGINA PROF
app.get('/prof', protegerRotaProf, (req, res) => {
    res.sendFile(__dirname + '/pages/prof.html');
});

// SAIR PROFESSOR
app.get('/sairProf', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Erro ao sair!');
        }
        res.redirect('/loginProf')
    })
});

// ALUNOS
app.get('/alunoconta', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const banco = client.db(EducaEco);
        const collectionAlunos = banco.collection('alunos');

        const aluno = await collectionAlunos.findOne({ nomeAluno: req.session.nomeAluno });

        if (!aluno) {
            return res.status(404).send('Aluno não encontrado.');
        }

        res.json(aluno);

    } catch (erro) {
        console.error('Erro ao buscar aluno:', erro);
        res.status(500).send('Erro ao buscar aluno. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

// PROFESSORES
app.get('/profconta', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const banco = client.db(EducaEco);
        const collectionProfessores = banco.collection('professores');

        const prof = await collectionProfessores.findOne({ nomeProf: req.session.nomeProf });

        if (!prof) {
            return res.status(404).send('Professor não encontrado.');
        }

        res.json(prof);

    } catch (erro) {
        console.error('Erro ao buscar professor:', erro);
        res.status(500).send('Erro ao buscar professor. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

// COMUNIDADE
app.get('/comunidade', protegerRotaProf, (req, res) => {
    res.sendFile(__dirname + '/pages/comunidade.html');
});

// COMUNIDADE
app.get('/comunidadeAluno', protegerRotaAluno, (req, res) => {
    res.sendFile(__dirname + '/pages/comunidadeAluno.html');
});

// CADASTRAR PUBLICACAO
app.get('/cadastroPublicacao', protegerRotaProf, (req, res) => {
    res.sendFile(__dirname + '/pages/cadastroPost.html');
});

// CADASTRAR PUBLICACAO
app.post('/cadastroPublicacao', async (req, res) => {
    const novoPost = {        
        assuntoNome: req.body.assuntoNome,
        urlImagePubli: req.body.urlImagePubli,
        textoPubli: req.body.textoPubli,
        nomeProf: req.session.nomeProf,
    };

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(EducaEco);
        const collection = db.collection(collectionPublicacoes);

        const result = await collection.insertOne(novoPost);
        console.log(`Post cadastro com sucesso. ID: ${result.insertedId}`);

        res.redirect('/comunidade');
    } catch (err) {
        console.error('Erro ao cadastrar o post:', err);
        res.status(500).send('Erro ao cadastrar o post. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

// PUBLICACOES
app.get('/publicacoes', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(EducaEco);
        const collection = db.collection(collectionPublicacoes);

        const publicacoes = await collection.find({}, { projection: { _id: 1, assuntoNome: 1, nomeProf: 1, urlImagePubli: 1, textoPubli: 1 } }).toArray();

        const postComPropriedade = publicacoes.map(publicacao => ({
            ...publicacao,
            isOwner: publicacao.nomeProf === req.session.nomeProf,
        }));

        res.json(postComPropriedade);

    } catch (err) {
        console.error('Erro ao buscar publicacoes:', err);
        res.status(500).send('Erro ao buscar publicacoes. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

// ATUALIZAR PUBLICACAO
app.get('/atualizarpublicacao', protegerRotaProf, (req, res) => {
    res.sendFile(__dirname + '/pages/atualizarPost.html');
});

// ATUALIZAR PUBLICACAO
app.post('/atualizarpublicacao', async (req, res) => {
    const { id, assuntoNome, urlImagePubli, textoPubli } = req.body;
    const nomeProfLogado = req.session.nomeProf;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(EducaEco);
        const collection = db.collection(collectionPublicacoes);

        const publicacao = await collection.findOne({ _id: new ObjectId(id), nomeProf: nomeProfLogado });

        if (!publicacao) {
            return res.status(403).send('Você não tem permissão para atualizar esta publicação.');
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { assuntoNome, urlImagePubli, textoPubli } }
        );

        if (result.modifiedCount > 0) {
            console.log(`Publicacao com ID: ${id} atualizado com sucesso.`);
            res.redirect('/comunidade');
        } else {
            res.status(404).send('Publicacao não encontrado.')
        }
    } catch (err) {
        console.error('Erro ao atualizar publicacao:', err);
        res.status(500).send('Erro ao atualizar publicacao. Por favor, tente novamente mais tarde.')
    } finally {
        client.close();
    }

});

// PUBLICACAO ID
app.get('/publicar/:id', async (req, res) => {
    const { id } = req.params;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(EducaEco);
        const collection = db.collection(collectionPublicacoes);

        const publicar = await collection.findOne({ _id: new ObjectId(id) });

        if (!publicar) {
            return res.status(404).send('Publicacao não encontrado.');
        }

        res.json(publicar);
    } catch (err) {
        console.error('Erro ao buscar publicacao:', err);
        res.status(500).send('Erro ao buscar publicacao. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }

});

// DELETAR PUBLICACAO
app.post('/deletarpublicacao', async (req, res) => {
    const { id } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(EducaEco);
        const collection = db.collection(collectionPublicacoes);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            console.log(`Publicacao com ID: ${id} deletado com sucesso.`);
            res.redirect('/comunidade');
        } else {
            res.status(404).send('Publicacao não encontrado.');
        }
    } catch (err) {
        console.error('Erro ao deletar publicacao', err);
        res.status(500).send('Erro ao deletar publicacao. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }

});

// CADASTRO CURSO
app.get('/cadastrarCurso', protegerRotaProf, async (req, res) => {
    res.sendFile(__dirname + '/pages/cadastroCurso.html');
});

// CADASTRAR CURSO
app.post('/cadastrarCurso', async (req, res) => {
    const novoCurso = {
        assuntoCurso: req.body.assuntoCurso,
        nomeProf: req.session.nomeProf,
        price: req.body.price,
        urlImage: req.body.urlImage,
    };

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(EducaEco);
        const collection = db.collection(collectionCursos);

        const result = await collection.insertOne(novoCurso);
        console.log(`Curso cadastrado com sucesso. ID: ${result.insertedId}`);

        res.redirect('/prof');
    } catch (err) {
        console.error('Erro ao cadastrar o curso:', err);
        res.status(500).send('Erro ao cadastrar o curso. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

// CURSOS
app.get('/cursos', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(EducaEco);
        const collection = db.collection(collectionCursos);

        const cursos = await collection.find({}, { projection: { _id: 1, assuntoCurso: 1, nomeProf: 1, price: 1, urlImage: 1 } }).toArray();

        const cursosComPropriedade = cursos.map(curso => ({
            ...curso,
            isOwner: curso.nomeProf === req.session.nomeProf,
        }));

        res.json(cursosComPropriedade);
    } catch (err) {
        console.error('Erro ao buscar cursos:', err);
        res.status(500).send('Erro ao buscar cursos. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

// ATUALIZAR CURSOS
app.get('/atualizarCurso', protegerRotaProf, (req, res) => {
    res.sendFile(__dirname + '/pages/atualizarCurso.html');
});

// ATUALIZAR CURSO
app.post('/atualizarcurso', async (req, res) => {
    const { id, assuntoCurso, price, urlImage } = req.body;
    const nomeProfLogado = req.session.nomeProf;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(EducaEco);
        const collection = db.collection(collectionCursos);

        const curso = await collection.findOne({ _id: new ObjectId(id), nomeProf: nomeProfLogado });

        if (!curso) {
            return res.status(403).send('Você não tem permissão para atualizar este curso.');
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { assuntoCurso, price, urlImage } }
        );

        if (result.modifiedCount > 0) {
            console.log(`Curso com ID: ${id} atualizado com sucesso.`);
            res.redirect('/prof');
        } else {
            res.status(404).send('Curso não encontrado.');
        }
    } catch (err) {
        console.error('Erro ao atualizar curso:', err);
        res.status(500).send('Erro ao atualizar curso. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});


// CURSO ID
app.get('/cursoEditar/:id', protegerRotaProf, async (req, res) => {
    const { id } = req.params;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(EducaEco);
        const collection = db.collection(collectionCursos);

        const cursoEditar = await collection.findOne({ _id: new ObjectId(id) });

        if (!cursoEditar) {
            return res.status(404).json({ error: 'Curso não encontrado.' });
        }

        res.json(cursoEditar);
    } catch (err) {
        console.error('Erro ao buscar curso:', err);
        res.status(500).json({ error: 'Erro ao buscar curso. Por favor, tente novamente mais tarde.' });
    } finally {
        client.close();
    }
});

// DELETAR CURSO
app.post('/deletarcurso', async (req, res) => {
    const { id } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(EducaEco);
        const collection = db.collection(collectionCursos);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            console.log(`Curso com ID: ${id} deletado com sucesso.`);
            res.redirect('/prof');
        } else {
            res.status(404).send('Curso não encontrado.');
        }
    } catch (err) {
        console.error('Erro ao deletar curso', err);
        res.status(500).send('Erro ao deletar curso. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }

});

// FILTRAR PUBLICAÇÃO
app.get('/dadosCursoProf', protegerRotaProf, async (req, res) => {
    res.sendFile(__dirname + '/pages/dadosCursoProf.html');
});

app.get('/filtrarCurso', async (req, res) => {
    const { assuntoCurso } = req.query;
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(EducaEco);
        const collection = db.collection(collectionCursos);

        const cursos = await collection.find({ assuntoCurso: new RegExp(assuntoCurso, 'i') }).toArray();

        res.json(cursos);
    } catch (err) {
        console.error('Erro ao buscar curso:', err);
        res.status(500).send('Erro ao buscar curso. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.get('/dadosCursoAluno', protegerRotaAluno, async (req, res) => {
    res.sendFile(__dirname + '/pages/dadosCursoAluno.html');
});

// PÁGINA B-CORP ALUNO
app.get('/b-corpAluno', async (req, res) => {
    res.sendFile(__dirname + '/pages/b-corp.html');
});

// PÁGINA B-CORP PROF
app.get('/b-corpProf', async (req, res) => {
    res.sendFile(__dirname + '/pages/b-corpProf.html');
});

// PÁGINA CARRINHO
app.get('/cart', protegerRotaAluno, (req, res) => {
    res.sendFile(__dirname + '/pages/cart.html');
});

// PÁGINA VÍDEO (TESTE)
app.get('/video', protegerRotaAluno, (req, res) => {
    res.sendFile(__dirname + '/pages/videoteste.html');
});

// PÁGINA MEUS CURSOS
app.get('/cursosAluno', protegerRotaAluno, (req, res) => {
    res.sendFile(__dirname + '/pages/meuscursos.html');
});

// ADICIONAR ITEM AO CARRINHO
app.post('/addCart', protegerRotaAluno, async (req, res) => {
    const client = new MongoClient(url);
    const { cursoId } = req.body;

    try {
        await client.connect();
        const db = client.db(EducaEco);
        const collectionAlunos = db.collection('alunos');

        const aluno = await collectionAlunos.findOne({ nomeAluno: req.session.nomeAluno });
        if (aluno && aluno.cursosComprados && aluno.cursosComprados.includes(cursoId)) {
            return res.status(400).json({ message: 'Curso já comprado.' });
        }

        await collectionAlunos.updateOne(
            { nomeAluno: req.session.nomeAluno },
            { $addToSet: { carrinho: cursoId } }
        );

        res.redirect('/cart');
    } catch (err) {
        console.error('Erro ao adicionar ao carrinho:', err);
        res.status(500).send('Erro ao adicionar ao carrinho. Por favor, tente novamente.');
    } finally {
        client.close();
    }
});

// EXIBIR CARRINHO
app.get('/carrinho', protegerRotaAluno, async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(EducaEco);
        const collectionAlunos = db.collection('alunos');
        const collectionCursos = db.collection('cursos');
        
        const aluno = await collectionAlunos.findOne({ nomeAluno: req.session.nomeAluno });
        
        if (!aluno || !aluno.carrinho) {
            return res.json({ message: 'Carrinho vazio.' });
        }

        const cursosCarrinho = await collectionCursos.find({ _id: { $in: aluno.carrinho.map(id => new ObjectId(id)) } }).toArray();

        res.json(cursosCarrinho);
    } catch (err) {
        console.error('Erro ao exibir carrinho:', err);
        res.status(500).send('Erro ao exibir o carrinho.');
    } finally {
        client.close();
    }
});

// REMOVER ITEM DO CARRINHO
app.post('/removerItemCarrinho', async (req, res) => {
    const { cursoId } = req.body;
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(EducaEco);
        const collectionAlunos = db.collection('alunos');

        const result = await collectionAlunos.updateOne(
            { nomeAluno: req.session.nomeAluno },
            { $pull: { carrinho: cursoId } }
        );

        if (result.modifiedCount > 0) {
            console.log(`Curso deletado do carrinho com sucesso.`);
            res.redirect('/cart');
        }
    } catch (err) {
        console.error('Erro ao remover item do carrinho:', err);
        res.status(500).json({ message: 'Erro ao remover item do carrinho.' });
    } finally {
        await client.close();
    }
});

// COMPRAR CURSOS NO CARRINHO
app.post('/comprar', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(EducaEco);
        const collectionAlunos = db.collection('alunos');

        const aluno = await collectionAlunos.findOne({ nomeAluno: req.session.nomeAluno });

        if (!aluno || !aluno.carrinho || aluno.carrinho.length === 0) {
            return res.status(400).json({ message: 'Carrinho vazio. Não há itens para comprar.' });
        }

        await collectionAlunos.updateOne(
            { nomeAluno: req.session.nomeAluno },
            {
                $push: { cursosComprados: { $each: aluno.carrinho } },
                $set: { carrinho: [] }
            }
        );

        res.redirect('/meuscursos');
    } catch (err) {
        console.error('Erro ao concluir a compra:', err);
        res.status(500).json({ message: 'Erro ao concluir a compra.' });
    } finally {
        client.close();
    }
});

// EXIBIR CURSOS COMPRADOS
app.get('/meuscursos', protegerRotaAluno, async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(EducaEco);
        const collectionAlunos = db.collection('alunos');
        const collectionCursos = db.collection('cursos');

        const aluno = await collectionAlunos.findOne({ nomeAluno: req.session.nomeAluno });

        if (!aluno || !aluno.cursosComprados) {
            return res.json({ message: 'Nenhum curso adquirido.' });
        }

        const cursosComprados = await collectionCursos.find({
            _id: { $in: aluno.cursosComprados.map(id => new ObjectId(id)) }
        }).toArray();

        res.json(cursosComprados);
    } catch (err) {
        console.error('Erro ao exibir cursos comprados:', err);
    } finally {
        client.close();
    }
});

//CHAT

//FUNÇÃO PAFA BUSCAR OS CURSOS 
async function buscarCursosRecomendados(palavraChave) {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db(EducaEco);
        const collection = db.collection(collectionCursos);


        const cursosRecomendados = await collection.find({
            assuntoCurso: { $regex: palavraChave, $options: 'i' }
        }).toArray();

        return cursosRecomendados;
    } catch (err) {
        console.error('Erro ao buscar cursos recomendados:', err);
        return [];
    } finally {
        client.close();
    }
}

//FUNÇÃO DO GEMINI
async function runChat(userInput, chatHistory) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.7,
        topK: 5,
        topP: 0.9,
        maxOutputTokens: 500,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    //BUSCA AS PAVRAS CHAVES E VERIFICA SE O ALUNO INSERIU ALGUMA DELAS

    const interesseMatch = userInput.match(/energia renovável|consumo sustentável|mobilidade sustentável|engenharia ambiental|economia circular|mudanças climáticas|gestão de resíduos|alimentação sustentável/i);
    let cursosRecomendadosTexto = '';

    if (interesseMatch) {
        const palavraChave = interesseMatch[0];
        const cursosRecomendados = await buscarCursosRecomendados(palavraChave);

        if (cursosRecomendados.length > 0) {
            cursosRecomendadosTexto = cursosRecomendados.map(curso => 
                `- ${curso.assuntoCurso} por ${curso.nomeProf}, preço: R$${curso.price}`
            ).join('\n\n');
        } else {
            cursosRecomendadosTexto = "Desculpe, não encontramos cursos com esse tema no momento.";
        }
    }

    const initialPrompt = [
        {
            role: "user",
            parts: [{ 
                text: "Você é um assistente da EducaEco, uma plataforma para conscientização em sustentabilidade. " +
                      "Se o usuário mencionar cursos, você deve recomendar cursos relevantes da EducaEco."
            }]
        },
        {
            role: "model",
            parts: [{ text: "Olá! Sou seu assistente virtual na EducaEco. Qual é o seu nome?" }]
        }
    ];

    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: chatHistory || initialPrompt,
    });


    if (cursosRecomendadosTexto) {
        return `Aqui estão alguns cursos que podem interessar:\n${cursosRecomendadosTexto}`;
    }

    
    const result = await chat.sendMessage(userInput);

    return result.response.text();
}

app.get('/chat', protegerRotaAluno, (req, res) => {
    res.sendFile(__dirname + '/pages/chat.html');
});

app.get('/chatProf', protegerRotaProf, (req, res) => {
    res.sendFile(__dirname + '/pages/chatProf.html');
});

app.get('/loader.gif', (req, res) => {
    res.sendFile(__dirname + '/loader.gif');
});

app.post('/chatbot', async (req, res) => {
    try {
      const userInput = req.body?.userInput;
      if (!userInput) {
        return res.status(400).json({ error: 'Invalid request body' });
      }
  
      const chatHistory = req.body?.chatHistory || [];
      const response = await runChat(userInput, chatHistory);
  
      res.json({ response });
    } catch (error) {
      console.error('Error in chat endpoint:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Servidor Node.js em execução em http://localhost:${port}`);
});