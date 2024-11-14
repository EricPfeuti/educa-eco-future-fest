document.addEventListener('DOMContentLoaded', () => {
    fetch('/meuscursos')
        .then(response => response.json())
        .then(cursosComprados => {
            const container = document.getElementById('cursosComprado');

            if (cursosComprados.message) {
                container.innerHTML = `<p>${cursosComprados.message}</p>`;
                return;
            }

            container.innerHTML = `
                ${cursosComprados.map(curso => `
                    <div class="box">
                        <img src="${curso.urlImage}" alt="Imagem do Curso">
                        <h3>${curso.assuntoCurso}</h3>
                        <p>${curso.nomeProf}</p>
                        <a href="/video"><button id="btn-cadastro">ASSISTIR CURSO</button></a>
                    </div>
                `).join('')}
            `;
        })
        .catch(error => console.error('Erro ao carregar cursos comprados:', error));
});
