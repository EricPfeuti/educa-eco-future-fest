let aluno = [];

async function fetchAlunoInfo() {
    try {
        const response = await fetch('/alunoconta');  
        
        aluno = await response.json()
        displayAlunoInfo(aluno);
    } catch (error) {
        document.getElementById('btn-conta').innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

function displayAlunoInfo(aluno) {
    const alunoInfoDiv = document.getElementById('btn-conta');
    alunoInfoDiv.innerHTML = `
        <a href="/sairAluno">${aluno.nomeAluno}</a>
     `;
}

fetchAlunoInfo();