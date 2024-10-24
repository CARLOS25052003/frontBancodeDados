const salaryForm = document.getElementById('salaryForm');
const expenseForm = document.getElementById('expenseForm');
const salaryList = document.getElementById('salaryList');
const expenseList = document.getElementById('expenseList');
const balanceDisplay = document.getElementById('balance');

let totalBalance = 0;

// Adicionar Salário
salaryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const salaryAmount = document.getElementById('salaryAmount').value;

    try {
        const response = await fetch('http://localhost:8080/salaries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: parseFloat(salaryAmount) }),
        });

        if (response.ok) {
            const salary = await response.json();
            totalBalance += salary.amount;
            updateBalance();
            displaySalary(salary);
            salaryForm.reset();
        } else {
            console.error('Erro ao adicionar salário:', response.statusText);
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
            headers: {
                'Content-Type': 'application/json',
            },
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
        } else {
            console.error('Erro ao adicionar despesa:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao adicionar despesa:', error);
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
    salaryList.appendChild(li);
}

// Função para exibir a despesa na lista
function displayExpense(expense) {
    const li = document.createElement('li');
    li.textContent = `${expense.description}: R$ ${expense.amount.toFixed(2)}`;
    expenseList.appendChild(li);
}

// Função para carregar salários e despesas ao iniciar a página
async function loadData() {
    // Carregar salários
    try {
        const salaryResponse = await fetch('http://localhost:8080/salaries');
        if (salaryResponse.ok) {
            const salaries = await salaryResponse.json();
            salaries.forEach(displaySalary);
            totalBalance += salaries.reduce((sum, salary) => sum + salary.amount, 0);
        } else {
            console.error('Erro ao carregar salários:', salaryResponse.statusText);
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
        } else {
            console.error('Erro ao carregar despesas:', expenseResponse.statusText);
        }
    } catch (error) {
        console.error('Erro ao carregar despesas:', error);
    }

    // Atualizar saldo
    updateBalance();
}

// Carregar dados ao iniciar a página
window.onload = loadData;
