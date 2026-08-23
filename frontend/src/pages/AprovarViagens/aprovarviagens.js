import React, { useState } from 'react';

function AprovarViagem() {
  const [viagens, setViagens] = useState([
    { id: 1, destino: 'São Paulo', solicitante: 'João Silva', dataInicio: '2026-09-15', dataFim: '2026-09-18', orcamento: 2500, motivo: 'Reunião com cliente', status: 'Aprovada' },
    { id: 2, destino: 'Rio de Janeiro', solicitante: 'Maria Oliveira', dataInicio: '2026-09-22', dataFim: '2026-09-25', orcamento: 3200, motivo: 'Conferência Tech', status: 'Pendente' },
    { id: 3, destino: 'Belo Horizonte', solicitante: 'Carlos Souza', dataInicio: '2026-10-01', dataFim: '2026-10-03', orcamento: 1800, motivo: 'Treinamento', status: 'Pendente' },
    { id: 4, destino: 'Curitiba', solicitante: 'Ana Paula', dataInicio: '2026-10-10', dataFim: '2026-10-12', orcamento: 2100, motivo: 'Auditoria', status: 'Rejeitada' },
  ]);

  const aprovar = (id) => {
    setViagens(viagens.map(v => 
      v.id === id ? { ...v, status: 'Aprovada' } : v
    ));
  };

  const rejeitar = (id) => {
    setViagens(viagens.map(v => 
      v.id === id ? { ...v, status: 'Rejeitada' } : v
    ));
  };

  const pendentes = viagens.filter(v => v.status === 'Pendente');

  return (
    <div>
      <h2 className="page-title">✅ Aprovar Viagem</h2>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>⏳ Viagens Pendentes de Aprovação ({pendentes.length})</h3>
        {pendentes.length === 0 ? (
          <p style={{ color: '#7f8c8d', padding: '20px', textAlign: 'center' }}>
            🎉 Nenhuma viagem pendente de aprovação!
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Solicitante</th>
                <th>Destino</th>
                <th>Período</th>
                <th>Orçamento</th>
                <th>Motivo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pendentes.map(v => (
                <tr key={v.id}>
                  <td>#{v.id}</td>
                  <td>{v.solicitante}</td>
                  <td>{v.destino}</td>
                  <td>{v.dataInicio} → {v.dataFim}</td>
                  <td>R$ {v.orcamento.toLocaleString('pt-BR')}</td>
                  <td>{v.motivo}</td>
                  <td>
                    <button 
                      className="btn btn-success" 
                      onClick={() => aprovar(v.id)}
                      style={{ marginRight: '8px' }}
                    >
                      ✅ Aprovar
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => rejeitar(v.id)}
                    >
                      ❌ Rejeitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3>📋 Todas as Viagens</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Solicitante</th>
              <th>Destino</th>
              <th>Orçamento</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {viagens.map(v => (
              <tr key={v.id}>
                <td>#{v.id}</td>
                <td>{v.solicitante}</td>
                <td>{v.destino}</td>
                <td>R$ {v.orcamento.toLocaleString('pt-BR')}</td>
                <td>
                  <span className={`status status-${v.status.toLowerCase()}`}>
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AprovarViagem;