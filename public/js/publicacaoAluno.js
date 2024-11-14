document.addEventListener('DOMContentLoaded', () => {
    fetch('/publicacoes')
        .then(response => response.json())
        .then(publicacoes => {
            const card = document.getElementById('comunidadeCard');
            card.innerHTML = publicacoes.map(publicacao => `
            <div class="card">
                <img src="${publicacao.urlImagePubli}" alt="Card Image" class="card-image">
                <h3>${publicacao.assuntoNome}</h3>
                <h4>${publicacao.nomeProf}</h4>
                <p>${publicacao.textoPubli}</p>
            </div><br>
            `).join('');
        })
        .catch(error => console.error('Erro ao carregar publicações:', error));
});