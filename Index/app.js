const salaryForm = document.getElementById('salaryForm');
const expenseForm = document.getElementById('expenseForm');
const rendaFixaForm = document.getElementById('rendaFixaForm');
const salaryList = document.getElementById('salaryList');
const expenseList = document.getElementById('expenseList');
const rendaFixaList = document.getElementById('rendaFixaList');
const balanceDisplay = document.getElementById('balance');

let totalBalance = 0;

// Adicionar Salário
salaryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const salaryAmount = document.getElementById('salaryAmount').value;

    try {
        const response = await fetch('http://localhost:8080/salaries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: parseFloat(salaryAmount) }),
        });
        if (response.ok) {
            const salary = await response.json();
            totalBalance += salary.amount;
            updateBalance();
            displaySalary(salary);
            salaryForm.reset();
        }
    } catch (error) {
        console.error('Erro ao adicionar salário:', error);
    }
});

// Adicionar Despesa
expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const expenseDescription = document.getElementById('expenseDescription').value;
    const expenseAmount = document.getElementById('expenseAmount').value;

    try {
        const response = await fetch('http://localhost:8080/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: expenseDescription,
                amount: parseFloat(expenseAmount),
            }),
        });
        if (response.ok) {
            const expense = await response.json();
            totalBalance -= expense.amount;
            updateBalance();
            displayExpense(expense);
            expenseForm.reset();
        }
    } catch (error) {
        console.error('Erro ao adicionar despesa:', error);
    }
});

// Adicionar Renda Fixa
rendaFixaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rendaFixaDescription = document.getElementById('rendaFixaDescription').value;
    const rendaFixaAmount = document.getElementById('rendaFixaAmount').value;

    try {
        const response = await fetch('http://localhost:8080/renda_fixa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: rendaFixaDescription,
                amount: parseFloat(rendaFixaAmount),
            }),
        });
        if (response.ok) {
            const rendaFixa = await response.json();
            totalBalance += rendaFixa.amount;
            updateBalance();
            displayRendaFixa(rendaFixa);
            rendaFixaForm.reset();
        }
    } catch (error) {
        console.error('Erro ao adicionar renda fixa:', error);
    }
});

// Função para atualizar o saldo na tela
function updateBalance() {
    balanceDisplay.textContent = `Saldo Total: R$ ${totalBalance.toFixed(2)}`;
}

// Função para exibir o salário na lista
function displaySalary(salary) {
    const li = document.createElement('li');
    li.textContent = `Salário: R$ ${salary.amount.toFixed(2)}`;

    // Botão de deletar
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.addEventListener('click', () => deleteSalary(salary.id, salary.amount));
    li.appendChild(deleteButton);

    salaryList.appendChild(li);
}

// Função para exibir a despesa na lista
function displayExpense(expense) {
    const li = document.createElement('li');
    li.textContent = `${expense.description}: R$ ${expense.amount.toFixed(2)}`;

    // Botão de deletar
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.addEventListener('click', () => deleteExpense(expense.id, expense.amount));
    li.appendChild(deleteButton);

    expenseList.appendChild(li);
}

// Função para exibir a renda fixa na lista
function displayRendaFixa(rendaFixa) {
    const li = document.createElement('li');
    li.textContent = `${rendaFixa.description}: R$ ${rendaFixa.amount.toFixed(2)}`;

    // Botão de deletar
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.addEventListener('click', () => deleteRendaFixa(rendaFixa.id, rendaFixa.amount));
    li.appendChild(deleteButton);

    rendaFixaList.appendChild(li);
}

// Funções para deletar salário, despesa, renda fixa
async function deleteSalary(id, amount) {
    try {
        const response = await fetch(`http://localhost:8080/salaries/${id}`, { method: 'DELETE' });
        if (response.ok) {
            totalBalance -= amount;
            updateBalance();
            loadData();
        }
    } catch (error) {
        console.error('Erro ao deletar salário:', error);
    }
}

async function deleteExpense(id, amount) {
    try {
        const response = await fetch(`http://localhost:8080/expenses/${id}`, { method: 'DELETE' });
        if (response.ok) {
            totalBalance += amount;
            updateBalance();
            loadData();
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
        }
    } catch (error) {
        console.error('Erro ao deletar renda fixa:', error);
    }
}

// Função para carregar dados ao iniciar a página
async function loadData() {
    salaryList.innerHTML = '';
    expenseList.innerHTML = '';
    rendaFixaList.innerHTML = '';
    totalBalance = 0;

    // Carregar salários
    try {
        const salaryResponse = await fetch('http://localhost:8080/salaries');
        if (salaryResponse.ok) {
            const salaries = await salaryResponse.json();
            salaries.forEach(displaySalary);
            totalBalance += salaries.reduce((sum, salary) => sum + salary.amount, 0);
        }
    } catch (error) {
        console.error('Erro ao carregar salários:', error);
    }

    // Carregar despesas
    try {
        const expenseResponse = await fetch('http://localhost:8080/expenses');
        if (expenseResponse.ok) {
            const expenses = await expenseResponse.json();
            expenses.forEach(displayExpense);
            totalBalance -= expenses.reduce((sum, expense) => sum + expense.amount, 0);
        }
    } catch (error) {
        console.error('Erro ao carregar despesas:', error);
    }

    // Carregar rendas fixas
    try {
        const rendaFixaResponse = await fetch('http://localhost:8080/renda_fixa');
        if (rendaFixaResponse.ok) {
            const rendasFixas = await rendaFixaResponse.json();
            rendasFixas.forEach(displayRendaFixa);
            totalBalance += rendasFixas.reduce((sum, rendaFixa) => sum + rendaFixa.amount, 0);
        }
    } catch (error) {
        console.error('Erro ao carregar rendas fixas:', error);
    }

    updateBalance();
}

window.onload = loadData;
