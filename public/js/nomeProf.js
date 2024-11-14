let prof = [];

async function fetchProfInfo() {
    try {
        const response = await fetch('/profconta');  
        
        prof = await response.json()
        displayProfInfo(prof);
    } catch (error) {
        document.getElementById('btn-conta').innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

function displayProfInfo(prof) {
    const profInfoDiv = document.getElementById('btn-conta');
    profInfoDiv.innerHTML = `
        <a href="/sairProf">${prof.nomeProf}</a>
    `;
}

fetchProfInfo();