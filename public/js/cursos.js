document.addEventListener('DOMContentLoaded', () => {
    fetch('/cursos')
        .then(response => response.json())
        .then(cursos => {
            const cardCurso = document.getElementById('cursoCard');
            cardCurso.innerHTML = cursos.map(curso => `
                <div class="box">
                    <img src="${curso.urlImage}" alt="Imagem do Curso" class="card-image">
                    <h3>${curso.assuntoCurso}</h3>
                    <h4>${curso.nomeProf}</h4>
                    <p>R$${curso.price}</p>
                    <button type="button" id="btn-cadastro">ADICIONAR ao CARRINHO
                    </button>
                </div>
            `).join('');
        })
        .catch(error => console.error('Erro ao carregar cursos:', error));
});