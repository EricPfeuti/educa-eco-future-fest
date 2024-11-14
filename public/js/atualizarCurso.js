document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cursoId = urlParams.get('id');

    if (cursoId) {
        fetch(`/cursoEditar/${cursoId}`)
            .then(response => response.json())
            .then(cursoEditar => {
                document.getElementById('id').value = cursoEditar._id;
                document.getElementById('assuntoCurso').value = cursoEditar.assuntoCurso;
                document.getElementById('nomeProf').value = cursoEditar.nomeProf;
                document.getElementById('price').value = cursoEditar.price;
                document.getElementById('urlImage').value = cursoEditar.urlImage;
            })
            .catch(error => console.error('Erro ao carregar dados do curso:', error));
    }
});