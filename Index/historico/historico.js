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
});

// Função para acessar o histórico de um mês específico
function acessarHistorico(ano, mes) {
    // Aqui você pode redirecionar para outra página ou carregar os dados do histórico para exibir
    alert(`Acessando histórico de ${mes} de ${ano}`);
    // Exemplo: redireciona para a página de histórico detalhado
    // window.location.href = `historicoDetalhado.html?ano=${ano}&mes=${mes}`;
}
