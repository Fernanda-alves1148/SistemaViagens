import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import {
viagensRascunho as dadosIniciais,
viagensSolicitadas
} from "../data/viagensMock";

function formatarData(data) {
const [ano, mes, dia] = data.split("-");


return `${dia}/${mes}/${ano}`;


}

function Rascunhos() {
const navigate = useNavigate();


const [viagens, setViagens] =
    useState(dadosIniciais);

const quantidadeRascunhos =
    viagens.length;

const quantidadeAnalise =
    viagensSolicitadas.filter(
        (viagem) =>
            viagem.status === "EM_ANALISE"
    ).length;

const quantidadeAceitas =
    viagensSolicitadas.filter(
        (viagem) =>
            viagem.status === "ACEITA"
    ).length;

const quantidadeRejeitadas =
    viagensSolicitadas.filter(
        (viagem) =>
            viagem.status === "REJEITADA"
    ).length;

function excluirViagem(id, event) {
    event.stopPropagation();

    const confirmacao = window.confirm(
        "Deseja realmente excluir esta viagem?"
    );

    if (!confirmacao) {
        return;
    }

    setViagens(
        viagens.filter(
            (viagem) =>
                viagem.id !== id
        )
    );
}

return (
    <div className="app">

        <Navbar />

        <div className="main-area">

            <Header />

            <main className="content">

                <section className="welcome">

                    <div>
                        <span className="welcome-small">
                            PAINEL PRINCIPAL
                        </span>

                        <h2>
                            Olá, Fernanda!
                        </h2>

                        <p>
                            Acompanhe suas viagens,
                            solicitações e despesas.
                        </p>
                    </div>

                    <button
                        className="botao-destaque"
                        onClick={() =>
                            navigate("/nova-viagem")
                        }
                    >
                        + Nova viagem
                    </button>

                </section>


                <section className="cards">

                    <div className="summary-card">

                        <div className="summary-icon olive">
                            ◫
                        </div>

                        <div>
                            <strong>
                                {quantidadeRascunhos}
                            </strong>

                            <span>
                                Rascunhos
                            </span>
                        </div>

                    </div>


                    <div className="summary-card">

                        <div className="summary-icon orange">
                            ◷
                        </div>

                        <div>
                            <strong>
                                {quantidadeAnalise}
                            </strong>

                            <span>
                                Em análise
                            </span>
                        </div>

                    </div>


                    <div className="summary-card">

                        <div className="summary-icon green">
                            ✓
                        </div>

                        <div>
                            <strong>
                                {quantidadeAceitas}
                            </strong>

                            <span>
                                Aceitas
                            </span>
                        </div>

                    </div>


                    <div className="summary-card">

                        <div className="summary-icon red">
                            !
                        </div>

                        <div>
                            <strong>
                                {quantidadeRejeitadas}
                            </strong>

                            <span>
                                Rejeitadas
                            </span>
                        </div>

                    </div>

                </section>


                <section className="section">

                    <div className="section-header">

                        <div>
                            <h3>
                                Viagens em rascunho
                            </h3>

                            <p>
                                Solicitações que ainda
                                não foram enviadas.
                            </p>
                        </div>

                        <button
                            className="botao-link"
                            onClick={() =>
                                navigate(
                                    "/viagens-solicitadas"
                                )
                            }
                        >
                            Ver solicitações →
                        </button>

                    </div>


                    <div className="table-container">

                        <table>

                            <thead>
                                <tr>
                                    <th>Viagem</th>
                                    <th>Período</th>
                                    <th>Transporte</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>

                                {viagens.map(
                                    (viagem) => (

                                        <tr
                                            key={viagem.id}
                                            className="linha-clicavel"
                                            onClick={() =>
                                                navigate(
                                                    `/viagem/${viagem.id}`
                                                )
                                            }
                                        >

                                            <td>

                                                <div className="viagem-cell">

                                                    <div className="viagem-icon">
                                                        →
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {viagem.origem}
                                                            {" → "}
                                                            {viagem.destino}
                                                        </strong>

                                                        <span>
                                                            Viagem #
                                                            {viagem.id}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>

                                            <td>

                                                <strong>
                                                    {formatarData(
                                                        viagem.dataInicio
                                                    )}
                                                </strong>

                                                <span className="texto-suave">
                                                    {" "}até{" "}
                                                    {formatarData(
                                                        viagem.dataFim
                                                    )}
                                                </span>

                                            </td>

                                            <td>
                                                {viagem.transportes.join(
                                                    ", "
                                                )}
                                            </td>

                                            <td>

                                                <span className="status rascunho">
                                                    Rascunho
                                                </span>

                                            </td>

                                            <td>

                                                <button
                                                    type="button"
                                                    className="botao-excluir"
                                                    onClick={(event) =>
                                                        excluirViagem(
                                                            viagem.id,
                                                            event
                                                        )
                                                    }
                                                >
                                                    🗑
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

            </main>

        </div>

    </div>
);


}

export default Rascunhos;
