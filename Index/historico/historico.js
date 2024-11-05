// Função para buscar meses
async function fetchMeses() {
    try {
        const response = await fetch('http://localhost:8080/mes'); // URL correta da sua API
        if (!response.ok) {
            throw new Error('Erro ao buscar os meses');
        }
        const meses = await response.json();
        renderizarMeses(meses);
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para renderizar meses no HTML
function renderizarMeses(meses) {
    const listaMeses = document.getElementById('lista-meses'); // Certifique-se de que este elemento exista no seu HTML
    listaMeses.innerHTML = ''; // Limpa a lista antes de adicionar os novos meses

    meses.forEach(mes => {
        const li = document.createElement('li');
        li.textContent = `Mês: ${mes.mes}`;
        listaMeses.appendChild(li);
    });
}

// Chama a função fetchMeses quando a página carregar
document.addEventListener('DOMContentLoaded', fetchMeses);
