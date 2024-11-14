document.addEventListener('DOMContentLoaded', () => {
    fetch('/cursos')
        .then(response => response.json())
        .then(cursos => {
        const cardCurso = document.getElementById('cursoCard');

        cardCurso.innerHTML = cursos.map(curso => {
            return `
                <div class="box">
                    <img src="${curso.urlImage}" alt="Imagem do Curso" class="card-image">
                    <h3>${curso.assuntoCurso}</h3>
                    <h4>${curso.nomeProf}</h4>
                    <p>R$${curso.price}</p>
                    <button type="button" id="btn-cadastro" onclick="addToCart('${curso._id}')">ADICIONAR ao CARRINHO
                    </button>
                </div>
            `;
        }).join('');
    })
    .catch(error => console.error('Erro ao carregar cursos:', error));
});

function addToCart(cursoId) {
    const cart = document.querySelector(".carAnimation");
    fetch('/addCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cursoId })
    })
    .then(response => {
        if (response.ok) {
            cart.style.animation = "";
            setTimeout(() => cart.style.animation = "tremer 0.4s linear", 5);
        } else {
            alert('Curso já comprado!');
        }
    })
    .catch(error => console.error('Erro ao adicionar curso:', error));
}