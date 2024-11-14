document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const publicacaoId = urlParams.get('id');

    if (publicacaoId) {
        fetch(`/publicar/${publicacaoId}`)
            .then(response => response.json())
            .then(publicar => {
                document.getElementById('id').value = publicar._id;
                document.getElementById('assuntoNome').value = publicar.assuntoNome;
                document.getElementById('textoPubli').value = publicar.textoPubli;
                document.getElementById('nomeProf').value = publicar.nomeProf;
                document.getElementById('urlImagePubli').value = publicar.urlImagePubli;
            })
            .catch(error => console.error('Erro ao carregar dados da publicacao:', error));
    }
});