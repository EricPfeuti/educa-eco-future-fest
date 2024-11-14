document.addEventListener('DOMContentLoaded', () => {
    fetch('/cursos')
        .then(response => response.json())
        .then(cursos => {
            const cardCurso = document.getElementById('cursoCard');
            cardCurso.innerHTML = cursos.map(curso => `
                <div class="box">
                    <img src="${curso.urlImage}" alt="Card Image" class="card-image">
                    <h3>${curso.assuntoCurso}</h3>
                    <h4>${curso.nomeProf}</h4>
                    <p>R$${curso.price}</p>
                    <button type="submit" id="btn-cadastro" style="margin-bottom: 10px;" onclick="addToCart('${curso.assuntoCurso}', ${curso.price})">ADICIONAR ao CARRINHO</button>

                    ${curso.isOwner ? `
                        <a href="/atualizarCurso?id=${curso._id}"><button id="btnEdit"><i class='bx bxs-edit'></i></button></a>
                        <form action="/deletarcurso" method="post" onsubmit="return confirm('Tem certeza que deseja excluir este curso?');" style="display:inline;">
                            <input type="hidden" id="id" name="id" value="${curso._id}">
                            <button type="submit" id="btnDelete"><i class='bx bxs-trash-alt'></i></button>
                        </form>
                    ` : ''}
                </div>
            `).join('');
        })
        .catch(error => console.error('Erro ao carregar cursos:', error));
});
