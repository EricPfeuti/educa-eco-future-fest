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
                <div class="btns-comunidade">
                    ${publicacao.isOwner ? `
                        <a href="/atualizarpublicacao?id=${publicacao._id}"><button id="btnEdit"><i class='bx bxs-edit'></i></button></a>
                        <form action="/deletarpublicacao" method="post" onsubmit="return confirm('Tem certeza que deseja excluir este curso?');" style="border:none;">
                            <input type="hidden" id="id" name="id" value="${publicacao._id}">
                            <button type="submit" id="btnDelete"><i class='bx bxs-trash-alt'></i></button>
                        </form>
                    ` : ''}
                </div>
            </div><br>
            `).join('');
        })
        .catch(error => console.error('Erro ao carregar publicações:', error));
});