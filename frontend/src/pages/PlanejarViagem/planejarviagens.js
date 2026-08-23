import React, { useState } from 'react';

function PlanejarViagem() {
  const [form, setForm] = useState({
    destino: '',
    dataInicio: '',
    dataFim: '',
    motivo: '',
    orcamento: ''
  });

  const [viagens, setViagens] = useState([
    { id: 1, destino: 'São Paulo', dataInicio: '2026-09-15', dataFim: '2026-09-18', motivo: 'Reunião com cliente', orcamento: 2500, status: 'Aprovada' },
    { id: 2, destino: 'Rio de Janeiro', dataInicio: '2026-09-22', dataFim: '2026-09-25', motivo: 'Conferência', orcamento: 3200, status: 'Pendente' },
  ]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const novaViagem = {
      id: viagens.length + 1,
      ...form,
      orcamento: parseFloat(form.orcamento),
      status: 'Planejada'
    };
    setViagens([...viagens, novaViagem]);
    setForm({ destino: '', dataInicio: '', dataFim: '', motivo: '', orcamento: '' });
    alert('✅ Viagem planejada com sucesso!');
  };

  return (
    <div>
      <h2 className="page-title">✈️ Planejar Viagem</h2>

      <div className="grid-2">
        <div className="card">
          <h3>📝 Nova Viagem</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Destino</label>
              <input
                type="text"
                name="destino"
                value={form.destino}
                onChange={handleChange}
                placeholder="Ex: São Paulo"
                required
              />
            </div>
            <div className="form-group">
              <label>Data de Início</label>
              <input
                type="date"
                name="dataInicio"
                value={form.dataInicio}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Data de Término</label>
              <input
                type="date"
                name="dataFim"
                value={form.dataFim}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Motivo</label>
              <textarea
                name="motivo"
                value={form.motivo}
                onChange={handleChange}
                rows="3"
                placeholder="Descreva o motivo da viagem"
                required
              />
            </div>
            <div className="form-group">
              <label>Orçamento Previsto (R$)</label>
              <input
                type="number"
                name="orcamento"
                value={form.orcamento}
                onChange={handleChange}
                placeholder="0,00"
                step="0.01"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              💾 Salvar Viagem
            </button>
          </form>
        </div>

        <div className="card">
          <h3>📋 Viagens Planejadas</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Destino</th>
                <th>Período</th>
                <th>Orçamento</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {viagens.map(v => (
                <tr key={v.id}>
                  <td>#{v.id}</td>
                  <td>{v.destino}</td>
                  <td>{v.dataInicio} → {v.dataFim}</td>
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
    </div>
  );
}

export default PlanejarViagem;