import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [dados, setDados] = useState({
    totalViagens: 0,
    viagensAprovadas: 0,
    viagensPendentes: 0,
    totalDespesas: 0
  });

  useEffect(() => {
    // Dados mockados - simulando chamada a API
    const mockData = {
      totalViagens: 12,
      viagensAprovadas: 8,
      viagensPendentes: 3,
      totalDespesas: 15420.50
    };
    setDados(mockData);
  }, []);

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div>
      <h2 className="page-title">📊 Dashboard</h2>
      
      <div className="grid-4">
        <div className="kpi-card">
          <div className="icone">✈️</div>
          <div className="valor">{dados.totalViagens}</div>
          <div className="label">Total de Viagens</div>
        </div>
        <div className="kpi-card">
          <div className="icone">✅</div>
          <div className="valor" style={{ color: '#27ae60' }}>{dados.viagensAprovadas}</div>
          <div className="label">Viagens Aprovadas</div>
        </div>
        <div className="kpi-card">
          <div className="icone">⏳</div>
          <div className="valor" style={{ color: '#f39c12' }}>{dados.viagensPendentes}</div>
          <div className="label">Viagens Pendentes</div>
        </div>
        <div className="kpi-card">
          <div className="icone">💰</div>
          <div className="valor" style={{ color: '#e74c3c' }}>{formatarMoeda(dados.totalDespesas)}</div>
          <div className="label">Total em Despesas</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '24px' }}>
        <div className="card">
          <h3>📋 Últimas Viagens</h3>
          <table>
            <thead>
              <tr>
                <th>Destino</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>São Paulo</td>
                <td>15/09/2026</td>
                <td><span className="status status-aprovada">Aprovada</span></td>
              </tr>
              <tr>
                <td>Rio de Janeiro</td>
                <td>22/09/2026</td>
                <td><span className="status status-pendente">Pendente</span></td>
              </tr>
              <tr>
                <td>Belo Horizonte</td>
                <td>01/10/2026</td>
                <td><span className="status status-planejada">Planejada</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>💸 Últimas Despesas</h3>
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Viagem</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Passagem aérea</td>
                <td>São Paulo</td>
                <td>R$ 850,00</td>
              </tr>
              <tr>
                <td>Hospedagem</td>
                <td>Rio de Janeiro</td>
                <td>R$ 1.200,00</td>
              </tr>
              <tr>
                <td>Alimentação</td>
                <td>São Paulo</td>
                <td>R$ 320,00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;