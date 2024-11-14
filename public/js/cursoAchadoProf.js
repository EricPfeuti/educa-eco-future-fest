document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const assuntoCurso = urlParams.get('assuntoCurso');
   
    if (assuntoCurso) {
        try {
            const response = await fetch(`/filtrarCurso?assuntoCurso=${encodeURIComponent(assuntoCurso)}`);
            const cursos = await response.json();
            const card = document.getElementById('card-achado');
            const h1 = document.getElementById('titulo');

            if (cursos.length > 0) {
                h1.innerHTML = `CURSO ENCONTRADO<span>.</span>`
                card.innerHTML = cursos.map(curso => `
                <div class="card">
                    <img src="${curso.urlImage}" alt="Card Image" class="card-image">
                    <h3>${curso.assuntoCurso}</h3>
                    <h4>${curso.nomeProf}</h4>
                    <p>R$${curso.price}</p>
                    <a href="/prof" id="btn-cadastro"><button>VER MAIS</button></a>
                </div><br>
                `).join('');
            } else {
                h1.innerHTML = `CURSO NÃO ENCONTRADO<span>.</span>`
            }
        } catch (error) {
            console.error('Erro ao buscar curso:', error);
            document.getElementById('card-achado').innerHTML = '<p>Erro ao buscar curso. Tente novamente mais tarde.</p>';
        }
    }
});