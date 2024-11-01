document.addEventListener('DOMContentLoaded', () => {
    const historicoTable = document.getElementById('historicoTable');

    // Função para gerar meses passados
    const gerarHistorico = (quantidade) => {
        const dadosHistorico = [];
        const dataAtual = new Date();

        for (let i = 0; i < quantidade; i++) {
            const mesAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - i, 1);
            dadosHistorico.push({
                ano: mesAtual.getFullYear(),
                mes: mesAtual.toLocaleString('pt-BR', { month: 'long' })
            });
        }

        return dadosHistorico;
    };

    // Gerar dados para os últimos 12 meses
    const dadosHistorico = gerarHistorico(12);

    dadosHistorico.forEach(dado => {
        const row = document.createElement('tr'); // Correção de "tra" para "tr"
        row.innerHTML = `
            <td>${dado.ano}</td>
            <td>${dado.mes.charAt(0).toUpperCase() + dado.mes.slice(1)}</td>
            <td><button onclick="acessarHistorico(${dado.ano}, '${dado.mes}')">Acessar</button></td>
        `;
        historicoTable.appendChild(row);
    });
});

// Função para acessar o histórico de um mês específico
function acessarHistorico(ano, mes) {
    // Aqui você pode redirecionar para outra página ou carregar os dados do histórico para exibir
    alert(`Acessando histórico de ${mes} de ${ano}`);
    // Exemplo: redireciona para a página de histórico detalhado
    // window.location.href = `historicoDetalhado.html?ano=${ano}&mes=${mes}`;
}
