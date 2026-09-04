import { useState } from "react";
import "../styles/gestao.css";

function GestaoViagens() {
const [filtro, setFiltro] = useState("Todas");

// Dados temporários apenas para montar a interface.
// Depois vamos substituir pelos dados vindos do backend.
const viagens = [
{
id: 1,
colaborador: "Ana Paula Dias",
origem: "Foz do Iguaçu - PR",
destino: "Curitiba - PR",
dataInicio: "10/09/2026",
dataFim: "12/09/2026",
status: "Solicitada",
},
{
id: 2,
colaborador: "João Menezes",
origem: "Foz do Iguaçu - PR",
destino: "Joinville - SC",
dataInicio: "15/09/2026",
dataFim: "17/09/2026",
status: "Aprovada",
},
{
id: 3,
colaborador: "Maria Silva",
origem: "Foz do Iguaçu - PR",
destino: "São Paulo - SP",
dataInicio: "20/09/2026",
dataFim: "22/09/2026",
status: "Rejeitada",
},
{
id: 4,
colaborador: "Carlos Oliveira",
origem: "Foz do Iguaçu - PR",
destino: "Guarulhos - SP",
dataInicio: "25/09/2026",
dataFim: "27/09/2026",
status: "Rascunho",
},
];

const viagensFiltradas =
filtro === "Todas"
? viagens
: viagens.filter((viagem) => viagem.status === filtro);

function obterClasseStatus(status) {
switch (status) {
case "Solicitada":
return "status solicitada";
case "Aprovada":
return "status aprovada";
case "Rejeitada":
return "status rejeitada";
case "Rascunho":
return "status rascunho";
default:
return "status";
}
}

return ( <div className="gestao-container"> <div className="gestao-cabecalho"> <div> <h2>Gestão de Viagens</h2> <p>Consulte e gerencie as viagens dos colaboradores.</p> </div> </div>


  <div className="filtros">
    <button
      className={filtro === "Todas" ? "filtro ativo" : "filtro"}
      onClick={() => setFiltro("Todas")}
    >
      Todas
    </button>

    <button
      className={filtro === "Solicitada" ? "filtro ativo" : "filtro"}
      onClick={() => setFiltro("Solicitada")}
    >
      Em análise
    </button>

    <button
      className={filtro === "Aprovada" ? "filtro ativo" : "filtro"}
      onClick={() => setFiltro("Aprovada")}
    >
      Aprovadas
    </button>

    <button
      className={filtro === "Rejeitada" ? "filtro ativo" : "filtro"}
      onClick={() => setFiltro("Rejeitada")}
    >
      Rejeitadas
    </button>

    <button
      className={filtro === "Rascunho" ? "filtro ativo" : "filtro"}
      onClick={() => setFiltro("Rascunho")}
    >
      Rascunhos
    </button>
  </div>

  <div className="tabela-container">
    <table className="tabela-viagens">
      <thead>
        <tr>
          <th>Viagem</th>
          <th>Colaborador</th>
          <th>Origem</th>
          <th>Destino</th>
          <th>Período</th>
          <th>Situação</th>
          <th>Ação</th>
        </tr>
      </thead>

      <tbody>
        {viagensFiltradas.length > 0 ? (
          viagensFiltradas.map((viagem) => (
            <tr key={viagem.id}>
              <td>#{String(viagem.id).padStart(3, "0")}</td>

              <td>{viagem.colaborador}</td>

              <td>{viagem.origem}</td>

              <td>{viagem.destino}</td>

              <td>
                {viagem.dataInicio}
                <br />
                <span className="data-fim">
                  até {viagem.dataFim}
                </span>
              </td>

              <td>
                <span className={obterClasseStatus(viagem.status)}>
                  {viagem.status === "Solicitada"
                    ? "Em análise"
                    : viagem.status}
                </span>
              </td>

              <td>
                <button className="botao-visualizar">
                  Visualizar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="sem-resultados">
              Nenhuma viagem encontrada.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


);
}

export default GestaoViagens;
