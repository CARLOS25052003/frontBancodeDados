// Seletores do DOM
const rendaExtraForm = document.getElementById('rendaExtraForm');

const despesaForm = document.getElementById('despesaForm');

const rendaFixaForm = document.getElementById('rendaFixaForm');

const despesaFixaForm = document.getElementById('despesaFixaForm');

const rendaExtraList = document.getElementById('rendaExtraList');

const despesaList = document.getElementById('despesaList');

const rendaFixaList = document.getElementById('rendaFixaList');

const despesaFixaList = document.getElementById('despesaFixaList');

const balanceDisplay = document.getElementById('balance');

let totalBalance = 0;

// Função para formatar a data para o formato desejado (dia/mês/ano)
function formatDateToDMY(date) {
    const [day, month, year] = date.split('/');
    return `${day}/${month}/${year}`;
}
// Adiciona uma renda extra
rendaExtraForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rendaExtraDescription = document.getElementById('rendaExtraDescription').value.trim();
    const rendaExtraAmount = document.getElementById('rendaExtraAmount').value.replace(",", ".");
    const rendaExtraDate = document.getElementById('rendaExtraDate').value;
    const month = getCurrentMonth(); // Obtém mês atual

    try {
        const response = await fetch('http://localhost:8080/renda-extra', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: rendaExtraDescription,
                amount: parseFloat(rendaExtraAmount),
                dateAdded: rendaExtraDate,
                month: month
            }),
        });

        if (response.ok) {
            const rendaExtra = await response.json();
            totalBalance += rendaExtra.amount;
            updateBalance();
            displayRendaExtra(rendaExtra);
            rendaExtraForm.reset();
            await calculateTotalBalance(); // Chama a função que atualiza o saldo e o gráfico
        } else {
            console.error('Erro ao adicionar renda extra:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao adicionar renda extra:', error);
    }
});

// Adiciona uma renda fixa
rendaFixaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rendaFixaDescription = document.getElementById('rendaFixaDescription').value;
    const rendaFixaAmount = document.getElementById('rendaFixaAmount').value.replace(",", ".");
    const rendaFixaDate = document.getElementById('rendaFixaDate').value;
    const month = getCurrentMonth(); // Obtém mês atual

    try {
        const response = await fetch('http://localhost:8080/renda_fixa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: rendaFixaDescription,
                amount: parseFloat(rendaFixaAmount),
                dateAdded: rendaFixaDate,
                month: month
            }),
        });

        if (response.ok) {
            const rendaFixa = await response.json();
            totalBalance += rendaFixa.amount;
            updateBalance();
            displayRendaFixa(rendaFixa);
            rendaFixaForm.reset();
            await calculateTotalBalance(); // Chama a função que atualiza o saldo e o gráfico
        } else {
            console.error('Erro ao adicionar renda fixa:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao adicionar renda fixa:', error);
    }
});


// Adiciona uma despesa
despesaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const despesaDescription = document.getElementById('despesaDescription').value;
    const despesaAmount = document.getElementById('despesaAmount').value.replace(",", ".");
    const despesaDate = document.getElementById('despesaDate').value;
    const metodoPagamento = document.querySelector('input[name="metodoPagamento"]:checked')?.value; // Atualizado para pegar o valor do rádio selecionado
    const month = getCurrentMonth(); // Obtém mês atual
    if (!metodoPagamento) {
        alert('Por favor, selecione um método de pagamento.'); // Exibe alerta se nenhum método for selecionado
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/despesas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: despesaDescription,
                amount: parseFloat(despesaAmount),
                dateAdded: despesaDate,
                metodoPagamento: metodoPagamento, // Adiciona o método de pagamento
                month: month
            }),
        });

        if (response.ok) {
            const despesa = await response.json();
            totalBalance -= despesa.amount;
            updateBalance();
            displayDespesa(despesa);
            despesaForm.reset();
            await atualizaGraficoMetodoPagamento();
            await calculateTotalBalance(); // Chama a função que atualiza o saldo e o gráfico
        } else {
            console.error('Erro ao adicionar despesa:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao adicionar despesa:', error);
    }
});


// Adiciona uma despesa fixa
despesaFixaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const despesaFixaDescription = document.getElementById('despesaFixaDescription').value;
    const despesaFixaAmount = document.getElementById('despesaFixaAmount').value.replace(",", ".");
    const despesaFixaDate = document.getElementById('despesaFixaDate').value;
    const month = getCurrentMonth(); // Obtém mês atual

    const metodoPagamento = document.querySelector('input[name="metodoPagamentoFixo"]:checked')?.value;
    if (!metodoPagamento) {
        alert('Por favor, selecione um método de pagamento.'); // Exibe alerta se nenhum método for selecionado
        return;
    }
    try {
        const response = await fetch('http://localhost:8080/despesas-fixas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: despesaFixaDescription,
                amount: parseFloat(despesaFixaAmount),
                dateAdded: despesaFixaDate,
                metodoPagamento: metodoPagamento,
                month: month
            }),
        });

        if (response.ok) {
            const despesaFixa = await response.json();
            totalBalance -= despesaFixa.amount;
            updateBalance();
            displayDespesaFixa(despesaFixa);
            despesaFixaForm.reset();
            await atualizaGraficoMetodoPagamento();
            await calculateTotalBalance(); // Chama a função que atualiza o saldo e o gráfico
        } else {
            console.error('Erro ao adicionar despesa fixa:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao adicionar despesa fixa:', error);
    }
});


// Função para exibir a renda extra na lista
function displayRendaExtra(rendaExtra) {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.color = 'green';
    li.textContent = `${rendaExtra.description}: R$ ${rendaExtra.amount.toFixed(2)} - ${rendaExtra.dateAdded}`;

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
    li.style.color="red";
    li.textContent = `${despesa.description}: R$ ${despesa.amount.toFixed(2)} - ${despesa.dateAdded} - Pagamento: ${despesa.metodoPagamento}`;

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
    li.style.color='blue';
    li.textContent = `${rendaFixa.description}: R$ ${rendaFixa.amount.toFixed(2)} - ${rendaFixa.dateAdded}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => deleteRendaFixa(rendaFixa.id, rendaFixa.amount));
    li.appendChild(deleteButton);

    rendaFixaList.appendChild(li);
}

// Função para exibir a despesa fixa na lista
function displayDespesaFixa(despesaFixa) {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.color='#FFA700';
    li.textContent = `${despesaFixa.description}: R$ ${despesaFixa.amount.toFixed(2)} - ${despesaFixa.dateAdded} - Pagamento: ${despesaFixa.metodoPagamento}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => deleteDespesaFixa(despesaFixa.id, despesaFixa.amount));
    li.appendChild(deleteButton);

    despesaFixaList.appendChild(li);
}

// Funções para deletar renda extra, despesa, renda fixa e despesa fixa
async function deleteRendaExtra(id, amount) {
    try {
        const response = await fetch(`http://localhost:8080/renda-extra/${id}`, { method: 'DELETE' });
        if (response.ok) {
            totalBalance -= amount; // Subtrai a renda extra ao excluir
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
            totalBalance += amount; // Adiciona a despesa ao excluir
            updateBalance();
            loadData();
            atualizaGraficoMetodoPagamento();
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
            totalBalance -= amount; // Subtrai a renda fixa ao excluir
            updateBalance();
            loadData();
        } else {
            console.error('Erro ao deletar renda fixa:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao deletar renda fixa:', error);
    }
}

async function deleteDespesaFixa(id, amount) {
    try {
        const response = await fetch(`http://localhost:8080/despesas-fixas/${id}`, { method: 'DELETE' });
        if (response.ok) {
            totalBalance += amount; // Adiciona a despesa fixa ao excluir
            updateBalance();
            loadData();
            atualizaGraficoMetodoPagamento();
        } else {
            console.error('Erro ao deletar despesa fixa:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao deletar despesa fixa:', error);
    }
}

// Função para carregar os dados
async function loadData() {
    // Limpa as listas
    rendaExtraList.innerHTML = '';
    despesaList.innerHTML = '';
    rendaFixaList.innerHTML = '';
    despesaFixaList.innerHTML = '';

    // Carregar e exibir Renda Extra
    const responseRendaExtra = await fetch('http://localhost:8080/renda-extra');
    if (responseRendaExtra.ok) {
        const rendaExtraItems = await responseRendaExtra.json();
        rendaExtraItems.forEach(displayRendaExtra);
    }

    // Carregar e exibir Despesas
    const responseDespesas = await fetch('http://localhost:8080/despesas');
    if (responseDespesas.ok) {
        const despesaItems = await responseDespesas.json();
        despesaItems.forEach(displayDespesa);
    }

    // Carregar e exibir Renda Fixa
    const responseRendaFixa = await fetch('http://localhost:8080/renda_fixa');
    if (responseRendaFixa.ok) {
        const rendaFixaItems = await responseRendaFixa.json();
        rendaFixaItems.forEach(displayRendaFixa);
    }

    // Carregar e exibir Despesas Fixas
    const responseDespesaFixa = await fetch('http://localhost:8080/despesas-fixas');
    if (responseDespesaFixa.ok) {
        const despesaFixaItems = await responseDespesaFixa.json();
        despesaFixaItems.forEach(displayDespesaFixa);
    }

    // Calcular o saldo total
    await calculateTotalBalance();
}

// Configuração inicial do gráfico de pizza
const pieChartData = {
    labels: ['Renda Extra', 'Despesas', 'Renda Fixa', 'Despesas Fixas'],
    datasets: [{
        label: 'Distribuição Financeira',
        data: [0, 0, 0, 0], // Inicialmente zeros
        backgroundColor: ['#28a745', '#dc3545', '#007bff', '#ffc107'],
        hoverOffset: 4
    }]
};

const pieChartConfig = {
    type: 'pie',
    data: pieChartData,
    options: {
        responsive: false,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.label}: R$ ${context.raw.toFixed(2)}`
                }
            }
        }
    }
};

let metodoPagamentoChart; // Variável global para armazenar a instância do gráfico

async function gerarGraficoMetodoPagamento() {
    // Pega as despesas fixas e variáveis do backend
    const despesasFixaResponse = await fetch('http://localhost:8080/despesas-fixas');
    const despesasVariavelResponse = await fetch('http://localhost:8080/despesas');
    const despesasFixa = await despesasFixaResponse.json();
    const despesasVariavel = await despesasVariavelResponse.json();

    // Agrupa por método de pagamento
    const pagamentosTotais = {};

    [...despesasFixa, ...despesasVariavel].forEach(despesa => {
        const metodo = despesa.metodoPagamento;
        const amount = parseFloat(despesa.amount);

        if (pagamentosTotais[metodo]) {
            pagamentosTotais[metodo] += amount;
        } else {
            pagamentosTotais[metodo] = amount;
        }
    });

    // Prepara os dados para o gráfico
    const labels = Object.keys(pagamentosTotais);
    const data = Object.values(pagamentosTotais);

    // Cria o gráfico de pizza
    const ctx = document.getElementById('metodoPagamentoPieChart').getContext('2d');
    if (!metodoPagamentoChart) {
        metodoPagamentoChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Metodos de Pagamento',
                data: data,
                backgroundColor: ['#4CAF50', '#FFC107', '#2196F3', '#FF5722'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.label}: R$ ${context.raw.toFixed(2)}`
                    }
                }
            }
        }
    });
} else {
        // Atualiza os dados do gráfico existente
        metodoPagamentoChart.data.labels = labels;
        metodoPagamentoChart.data.datasets[0].data = data;
        metodoPagamentoChart.update();
    }
}

// Chama a função para gerar o gráfico
gerarGraficoMetodoPagamento();

async function atualizaGraficoMetodoPagamento(){
    await gerarGraficoMetodoPagamento();
}

const myPieChart = new Chart(document.getElementById('myPieChart'), pieChartConfig);

// Função para atualizar o gráfico de pizza com dados reais
function atualizarGrafico(rendaExtra, despesas, rendaFixa, despesasFixas) {
    myPieChart.data.datasets[0].data = [rendaExtra, despesas, rendaFixa, despesasFixas];
    myPieChart.update();
}

// Atualiza o saldo na tela
function updateBalance() {
    balanceDisplay.textContent = `Saldo Total: R$ ${totalBalance.toFixed(2)}`;

}

// Função para calcular o saldo total e atualizar o gráfico de pizza
async function calculateTotalBalance() {
    const responseRendaExtra = await fetch('http://localhost:8080/renda-extra');
    const responseDespesas = await fetch('http://localhost:8080/despesas');
    const responseRendaFixa = await fetch('http://localhost:8080/renda_fixa');
    const responseDespesaFixa = await fetch('http://localhost:8080/despesas-fixas');

    let rendaExtraTotal = 0;
    let despesasTotal = 0;
    let rendaFixaTotal = 0;
    let despesaFixaTotal = 0;

    // Calcular a soma das rendas extras
    if (responseRendaExtra.ok) {
        const rendaExtraItems = await responseRendaExtra.json();
        rendaExtraTotal = rendaExtraItems.reduce((sum, item) => sum + item.amount, 0);
    }

    // Calcular a soma das despesas
    if (responseDespesas.ok) {
        const despesaItems = await responseDespesas.json();
        despesasTotal = despesaItems.reduce((sum, item) => sum + item.amount, 0);
    }

    // Calcular a soma das rendas fixas
    if (responseRendaFixa.ok) {
        const rendaFixaItems = await responseRendaFixa.json();
        rendaFixaTotal = rendaFixaItems.reduce((sum, item) => sum + item.amount, 0);
    }

    // Calcular a soma das despesas fixas
    if (responseDespesaFixa.ok) {
        const despesaFixaItems = await responseDespesaFixa.json();
        despesaFixaTotal = despesaFixaItems.reduce((sum, item) => sum + item.amount, 0);
    }

    // Calcular o saldo total
    totalBalance = rendaExtraTotal + rendaFixaTotal - (despesasTotal + despesaFixaTotal);
    updateBalance(); // Atualiza o saldo na tela

    // Atualiza o gráfico com os novos valores
    atualizarGrafico(rendaExtraTotal, despesasTotal, rendaFixaTotal, despesaFixaTotal);
}
// Carrega os dados ao iniciar
loadData();
