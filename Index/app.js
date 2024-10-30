const rendaExtraForm = document.getElementById('rendaExtraForm');
const despesaForm = document.getElementById('despesaForm');
const rendaFixaForm = document.getElementById('rendaFixaForm');
const rendaExtraList = document.getElementById('rendaExtraList');
const despesaList = document.getElementById('despesaList');
const rendaFixaList = document.getElementById('rendaFixaList');
const balanceDisplay = document.getElementById('balance');

let totalBalance = 0;

// Função para formatar a data para o formato desejado (dia/mês/ano)
function formatDateToDMY(date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}

// Adicionar Renda Extra
rendaExtraForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rendaExtraDescription = document.getElementById('rendaExtraDescription').value.trim();
    const rendaExtraAmount = document.getElementById('rendaExtraAmount').value.replace(",", ".");
    const rendaExtraDate = formatDateToDMY(document.getElementById('rendaExtraDate').value); // Formata a data

    try {
        const response = await fetch('http://localhost:8080/renda-extra', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: rendaExtraDescription,
                amount: parseFloat(rendaExtraAmount),
                date_added: rendaExtraDate // Usa a data já no formato correto
            }),
        });

        if (response.ok) {
            const rendaExtra = await response.json();
            totalBalance += rendaExtra.amount;
            updateBalance();
            displayRendaExtra(rendaExtra);
            rendaExtraForm.reset();
        } else {
            console.error('Erro ao adicionar renda extra:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao adicionar renda extra:', error);
    }
});

// Adicionar Renda Fixa
rendaFixaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rendaFixaDescription = document.getElementById('rendaFixaDescription').value;
    const rendaFixaAmount = document.getElementById('rendaFixaAmount').value.replace(",", ".");
    const rendaFixaDate = formatDateToDMY(document.getElementById('rendaFixaDate').value); // Formata a data

    try {
        const response = await fetch('http://localhost:8080/renda_fixa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: rendaFixaDescription,
                amount: parseFloat(rendaFixaAmount),
                date_added: rendaFixaDate // Usa a data já no formato correto
            }),
        });

        if (response.ok) {
            const rendaFixa = await response.json();
            totalBalance += rendaFixa.amount;
            updateBalance();
            displayRendaFixa(rendaFixa);
            rendaFixaForm.reset();
        } else {
            console.error('Erro ao adicionar renda fixa:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao adicionar renda fixa:', error);
    }
});

// Adicionar Despesa
despesaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const despesaDescription = document.getElementById('despesaDescription').value;
    const despesaAmount = document.getElementById('despesaAmount').value.replace(",", ".");
    const despesaDate = formatDateToDMY(document.getElementById('despesaDate').value); // Formata a data

    try {
        const response = await fetch('http://localhost:8080/despesas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: despesaDescription,
                amount: parseFloat(despesaAmount),
                date_added: despesaDate // Usa a data já no formato correto
            }),
        });

        if (response.ok) {
            const despesa = await response.json();
            totalBalance -= despesa.amount;
            updateBalance();
            displayDespesa(despesa);
            despesaForm.reset();
        } else {
            console.error('Erro ao adicionar despesa:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao adicionar despesa:', error);
    }
});

// Adicionar Despesa Fixa
despesaFixaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const despesaFixaDescription = document.getElementById('despesaFixaDescription').value;
    const despesaFixaAmount = document.getElementById('despesaFixaAmount').value.replace(",", ".");
    const despesaFixaDate = formatDateToDMY(document.getElementById('despesaFixaDate').value); // Formata a data

    try {
        const response = await fetch('http://localhost:8080/despesas-fixas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: despesaFixaDescription,
                amount: parseFloat(despesaFixaAmount),
                date_added: despesaFixaDate // Usa a data já no formato correto
            }),
        });

        if (response.ok) {
            const despesaFixa = await response.json();
            totalBalance -= despesaFixa.amount;
            updateBalance();
            displayDespesaFixa(despesaFixa);
            despesaFixaForm.reset();
        } else {
            console.error('Erro ao adicionar despesa fixa:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao adicionar despesa fixa:', error);
    }
});

// Função para atualizar o saldo na tela
function updateBalance() {
    balanceDisplay.textContent = `Saldo Total: R$ ${totalBalance.toFixed(2)}`;
}

// Função para exibir a renda extra na lista
function displayRendaExtra(rendaExtra) {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';

    li.textContent = `Renda Extra: R$ ${rendaExtra.amount.toFixed(2)}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => deleteRendaExtra(rendaExtra.id, rendaExtra.amount));
    li.appendChild(deleteButton);

    rendaExtraList.appendChild(li);
}

// Função para exibir a despesa na lista
function displayDespesa(despesa) {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';

    li.textContent = `${despesa.description}: R$ ${despesa.amount.toFixed(2)}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => deleteDespesa(despesa.id, despesa.amount));
    li.appendChild(deleteButton);

    despesaList.appendChild(li);
}

// Função para exibir a renda fixa na lista
function displayRendaFixa(rendaFixa) {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';

    li.textContent = `${rendaFixa.description}: R$ ${rendaFixa.amount.toFixed(2)}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => deleteRendaFixa(rendaFixa.id, rendaFixa.amount));
    li.appendChild(deleteButton);

    rendaFixaList.appendChild(li);
}

// Funções para deletar renda extra, despesa, renda fixa
async function deleteRendaExtra(id, amount) {
    try {
        const response = await fetch(`http://localhost:8080/renda-extra/${id}`, { method: 'DELETE' });
        if (response.ok) {
            totalBalance -= amount;
            updateBalance();
            loadData();
        } else {
            console.error('Erro ao deletar renda extra:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao deletar renda extra:', error);
    }
}

async function deleteDespesa(id, amount) {
    try {
        const response = await fetch(`http://localhost:8080/despesas/${id}`, { method: 'DELETE' });
        if (response.ok) {
            totalBalance += amount;
            updateBalance();
            loadData();
        } else {
            console.error('Erro ao deletar despesa:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao deletar despesa:', error);
    }
}

async function deleteRendaFixa(id, amount) {
    try {
        const response = await fetch(`http://localhost:8080/renda_fixa/${id}`, { method: 'DELETE' });
        if (response.ok) {
            totalBalance -= amount;
            updateBalance();
            loadData();
        } else {
            console.error('Erro ao deletar renda fixa:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao deletar renda fixa:', error);
    }
}

// Função para carregar os dados
async function loadData() {
    // Limpa as listas
    rendaExtraList.innerHTML = '';
    despesaList.innerHTML = '';
    rendaFixaList.innerHTML = '';

    // Carregar Renda Extra
    const responseRendaExtra = await fetch('http://localhost:8080/renda-extra');
    if (responseRendaExtra.ok) {
        const rendaExtraItems = await responseRendaExtra.json();
        rendaExtraItems.forEach(displayRendaExtra);
    }

    // Carregar Despesas
    const responseDespesas = await fetch('http://localhost:8080/despesas');
    if (responseDespesas.ok) {
        const despesaItems = await responseDespesas.json();
        despesaItems.forEach(displayDespesa);
    }

    // Carregar Renda Fixa
    const responseRendaFixa = await fetch('http://localhost:8080/renda_fixa');
    if (responseRendaFixa.ok) {
        const rendaFixaItems = await responseRendaFixa.json();
        rendaFixaItems.forEach(displayRendaFixa);
    }
}

// Carrega os dados ao iniciar
loadData();
