import React, { useState } from 'react';

function RegistrarDespesas() {
  const [form, setForm] = useState({
    viagemId: '',
    descricao: '',
    categoria: '',
    valor: '',
    data: ''
  });

  const [despesas, setDespesas] = useState([
    { id: 1, viagem: 'São Paulo', descricao: 'Passagem aérea', categoria: 'Transporte', valor: 850, data: '2026-09-15' },
    { id: 2, viagem: 'São Paulo', descricao: 'Hotel Ibis', categoria: 'Hospedagem', valor: 1200, data: '2026-09-15' },
    { id: 3, viagem: 'Rio de Janeiro', descricao: 'Almoço cliente', categoria: 'Alimentação', valor: 180, data: '2026-09-22' },
  ]);

  const viagens = [
    { id: 1, destino: 'São Paulo' },
    { id: 2, destino: 'Rio de Janeiro' },
    { id: 3, destino: 'Belo Horizonte' },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const viagem = viagens.find(v => v.id === parseInt(form.viagemId));
    const novaDespesa = {
      id: despesas.length + 1,
      viagem: viagem ? viagem.destino : 'Desconhecido',
      descricao: form.descricao,
      categoria: form.categoria,
      valor: parseFloat(form.valor),
      data: form.data
    };
    setDespesas([...despesas, novaDespesa]);
    setForm({ viagemId: '', descricao: '', categoria: '', valor: '', data: '' });
    alert('✅ Despesa registrada com sucesso!');
  };

  const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0);

  return (
    <div>
      <h2 className="page-title">💰 Registrar Despesas</h2>

      <div className="grid-2">
        <div className="card">
          <h3>📝 Nova Despesa</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Viagem</label>
              <select name="viagemId" value={form.viagemId} onChange={handleChange} required>
                <option value="">Selecione uma viagem</option>
                {viagens.map(v => (
                  <option key={v.id} value={v.id}>{v.destino}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <input
                type="text"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Ex: Passagem aérea"
                required
              />
            </div>
            <div className="form-group">
              <label>Categoria</label>
              <select name="categoria" value={form.categoria} onChange={handleChange} required>
                <option value="">Selecione</option>
                <option value="Transporte">🚗 Transporte</option>
                <option value="Hospedagem">🏨 Hospedagem</option>
                <option value="Alimentação">🍽️ Alimentação</option>
                <option value="Material">📦 Material</option>
                <option value="Outros">📋 Outros</option>
              </select>
            </div>
            <div className="form-group">
              <label>Valor (R$)</label>
              <input
                type="number"
                name="valor"
                value={form.valor}
                onChange={handleChange}
                placeholder="0,00"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>Data</label>
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">
              💾 Registrar Despesa
            </button>
          </form>
        </div>

        <div className="card">
          <h3>📋 Despesas Registradas</h3>
          <div style={{ marginBottom: '16px', padding: '12px', background: '#e8f5e9', borderRadius: '8px' }}>
            <strong>Total em Despesas: </strong>
            <span style={{ fontSize: '20px', color: '#27ae60', fontWeight: '700' }}>
              R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Viagem</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {despesas.map(d => (
                <tr key={d.id}>
                  <td>{d.viagem}</td>
                  <td>{d.descricao}</td>
                  <td>{d.categoria}</td>
                  <td>R$ {d.valor.toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RegistrarDespesas;