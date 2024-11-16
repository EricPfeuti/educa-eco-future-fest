# ♻️ EducaEco - O Saber que Constrói um Amanhã Verde
- Feito por: Eric Pfeuti, Leonardo Duarte, Emanuel Domingues e Rafael Sá;
- Eric Pfeuti: responsável pelo backend e frontend;
- Leonardo Duarte: responsável pelo chatbot;
- Rafael Sá: responsável pelo design, estilização e figma do site;
- Emanuel Domingues: responsável pelo design, estilização e figma do site;

## 📝 DESCRIÇÃO:

- ### 🎯 Objetivo:
  A EducaEco é uma plataforma de ensino online dedicada a promover práticas sustentáveis para indivíduos, empresas e instituições. Seu objetivo é fornecer conteúdos aplicáveis que incentivem ações sustentáveis, ajudando a capacitar os usuários a tomar decisões mais responsáveis e reduzir seu impacto ambiental;
- ### ⚙️ Principais Funcionalidades:
  - Catálogo de cursos diversas categorias como: Economia Circular, Energia Renovável, Consumo Consciente, entre outros;
  - Carrinho de compras de cada usuário, onde é possível adicionar cursos do interesse do usuário e concluir a compra;
  - Área de comunidade desenvolvido para instrutores compartilharem conselhos e soluções de problemas sobre sustentabilidade;
  - Plataforma que pode ser adotada para empresas e instituições que buscam treinamentos personalizados para seus colaboradores e interessados;
  - Chatbot que oferece ao usuário um bate-papo sobre o que ele precisa, quais seriam os interesses do usuário para apresentar os melhores cursos da área que o usuário deseja;
- ### 👨‍💻 Linguagens Utilizadas:
  [![My Skills](https://skillicons.dev/icons?i=js,nodejs,html,css,mongo,bots)](https://skillicons.dev)
- ### 💡 Problemas Resolvidos:
  - A EducaEco facilita o acesso a cursos focados em sustentabilidade, possibilitando a capacitação em práticas ecológicas e sociais;
  - Pessoas querem adotar práticas sustentáveis em sua vida, a EducaEco oferece conhecimento sobre práticas sustentáveis, simplificando o processo de aprendizado;
  - A sustentabilidade parece complexa para muitas pessoas, com os cursos e exemplos reais, a EducaEco oferece estratégias que simplificam a implementação de práticas sustentáveis no cotidiano;

## 🛠️ INSTALAÇÃO:
  Para instalar as dependências do projeto, utilize os seguintes comandos:
  - npm init -y
  - npm install express
  - npm install mongodb
  - npm install express-session
  - npm install bcrypt
  - npm install @google/generative-ai chalk ora prompt-sync
  - npm install method-override

  - ### adicionar sua chave API em "const API_KEY":
    - Para isso, crie um projeto no Google Cloud para poder criar uma chave no Google AI Studio em https://cloud.google.com/
   
    ![consoleGEMINI](https://github.com/user-attachments/assets/351a5dd3-0aa7-4919-b467-0194a5e59a54)

    - Criar o projeto:
   
    ![crieUmProjeto](https://github.com/user-attachments/assets/e3bed1e1-90ba-4c22-9b61-32d3da3d2e40)

    - Criando o projeto:
   
    ![CriandoProjeto](https://github.com/user-attachments/assets/5f3f822a-e1d3-42cf-95dd-7c20828974b8)

    - Agora vincule seu projeto no Google AI Studio para gerar uma chave API em https://ai.google.dev/aistudio?hl=pt-br
   
    ![GoogleAiStudioTela](https://github.com/user-attachments/assets/46b37568-396c-4feb-a775-017d7092d5d8)

    ![EtapasGEMINI](https://github.com/user-attachments/assets/13407ef7-5d72-49d9-9828-73768241b9c5)

    ![ChaveAPIGemini](https://github.com/user-attachments/assets/37d71d64-5a82-4917-ab00-a0b8774c391c)

    - Por fim adicione a sua chave API no lugar de "SuaAPIKey":

    ![imgAPIKEY](https://github.com/user-attachments/assets/a9ede9d5-defa-41a6-9718-cbddedf31c79)
  
  - ### node server.js


## ☘️ USO e ROTAS:
  - Para fazer com que o site funcione basta instalar as requisições acima;
  - Após isso cadastre-se como professor e cadastre cursos;
  - Depois logue-se como aluno, adicione um curso de seu interesse no carrinho, dentro do carrinho compre o curso e vá em "MEUS CURSOS" lá você terá todos os cursos que você "comprou";
  - Ao clicar em assistir curso aparecerá o vídeo deste curso (porém como ainda não é algo funcional é apenas um vídeo com tela preta);
  - Para mais informações veja os vídeos abaixo:
  - #### ROTAS:
    - /aluno
    - /prof
    - /comunidade
    - /comunidadeAluno
    - /option
    - /cart
    - /atualizarpublicacao
    - /cadastroPublicacao
    - /cadastrarCurso
    - /atualizarCurso
    - /dadosCursoProf
    - /dadosCursoAluno
    - /video
    - /cursosAluno
    - /carrinho
    - /meuscursos
    - /chat
    - /chatProf

## 🎥 VÍDEOS do USO do SITE:
  - Instalando extensões: https://youtu.be/7cxhKOe_G-A?si=QFG9dBPWi90g6Ku9
  - EducaEco: https://youtu.be/OaROZjGL46U?si=yzQDc5xcduNHME2
