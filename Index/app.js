document.getElementById('expenseForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);

    const expense = { description, amount };

    // Enviar a despesa para o backend
    try {
        const response = await fetch('http://localhost:8080/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expense)
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar despesa');
        }

        // Limpar os campos do formulário
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';

        // Atualizar a lista de despesas
        await loadExpenses();
        await loadTotalExpenses();

    } catch (error) {
        console.error('Erro:', error);
    }
});

// Função para carregar despesas
async function loadExpenses() {
    try {
        const response = await fetch('http://localhost:8080/expenses');
        const expenses = await response.json();
        const expenseList = document.getElementById('expenseList');

        // Limpar a lista antes de adicionar as despesas
        expenseList.innerHTML = '';

        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.textContent = `${expense.description}: R$ ${expense.amount.toFixed(2)}`;
            expenseList.appendChild(li);
        });

    } catch (error) {
        console.error('Erro ao carregar despesas:', error);
    }
}

// Função para carregar o total de despesas
async function loadTotalExpenses() {
    try {
        const response = await fetch('http://localhost:8080/expenses/total');
        const total = await response.json();
        document.getElementById('totalExpenses').textContent = total.toFixed(2);
    } catch (error) {
        console.error('Erro ao carregar total de despesas:', error);
    }
}

// Carregar despesas e total ao inicializar
loadExpenses();
loadTotalExpenses();
