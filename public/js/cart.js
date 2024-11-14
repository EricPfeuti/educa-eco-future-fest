document.addEventListener('DOMContentLoaded', () => {
    fetch('/carrinho')
        .then(response => response.json())
        .then(cursos => {
            const carrinhoContainer = document.getElementById('cartItems');

            if (cursos.message) {
                carrinhoContainer.innerHTML = `<p>${cursos.message}</p>`;
                return;
            }

            carrinhoContainer.innerHTML = cursos.map(curso => `
                <div class="box">
                    <img src="${curso.urlImage}" alt="Card Image" class="card-image">
                    <h3>${curso.assuntoCurso}</h3>
                    <h4>${curso.nomeProf}</h4>
                    <p>R$${curso.price} <form action="/removerItemCarrinho" method="post" onsubmit="return confirm('Tem certeza que deseja excluir este curso do carrinho?');" style="display:inline;">
                    <input type="hidden" id="cursoId" name="cursoId" value="${curso._id}">
                    <button type="submit" id="btnDelete"><i class='bx bxs-trash-alt'></i></button>
                    </form></p>
                </div>
            `).join('');
        })
        .catch(error => console.error('Erro ao carregar o carrinho:', error));
});

function handleCheckout() {
    fetch('/comprar', { method: 'POST' })
        .then(response => {
            if (response.redirected) {
                window.location.pathname = '/cursosAluno';
            } else {
                alert('Erro ao finalizar a compra. Por favor, tente novamente.');
            }
        })
        .catch(error => console.error('Erro ao finalizar a compra:', error));
}