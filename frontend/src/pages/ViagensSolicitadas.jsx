import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";

import {
    viagensSolicitadas
} from "../data/viagensMock";

import "../styles/viagens.css";

function formatarData(data) {

    if (!data) {
        return "-";
    }

    const [ano, mes, dia] =
        data.split("-");

    return `${dia}/${mes}/${ano}`;
}

function ViagensSolicitadas() {

    const navigate = useNavigate();

    const [
        justificativaSelecionada,
        setJustificativaSelecionada
    ] = useState(null);

    const viagensEmAnalise =
        viagensSolicitadas.filter(
            (viagem) =>
                viagem.status ===
                "EM_ANALISE"
        );

    const outrasSolicitacoes =
        viagensSolicitadas.filter(
            (viagem) =>
                viagem.status !==
                "EM_ANALISE"
        );

    return (

        <div className="app">

            <Navbar />

            <div className="main-area">

                <Header />

                <main className="content">

                    <div className="page-back">

                        <button
                            type="button"
                            className="botao-voltar"
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            ← Minhas viagens
                        </button>

                    </div>


                    <section className="welcome">

                        <div>

                            <span className="welcome-small">
                                SOLICITAÇÕES
                            </span>

                            <h2>
                                Viagens em análise
                            </h2>

                            <p>
                                Acompanhe as viagens
                                enviadas para aprovação.
                            </p>

                        </div>

                    </section>


                    {/* EM ANÁLISE */}

                    <section className="section">

                        <div className="section-header">

                            <div>

                                <h3>
                                    Em análise
                                </h3>

                                <p>
                                    Solicitações aguardando
                                    avaliação do gestor.
                                </p>

                            </div>

                            <span className="contador-secundario">
                                {viagensEmAnalise.length}
                            </span>

                        </div>


                        <div className="table-container">

                            {viagensEmAnalise.length === 0 ? (

                                <div className="empty-state">

                                    <h3>
                                        Nenhuma viagem em análise
                                    </h3>

                                    <p>
                                        No momento não existem
                                        solicitações aguardando
                                        aprovação.
                                    </p>

                                </div>

                            ) : (

                                <table>

                                    <thead>

                                        <tr>
                                            <th>Viagem</th>
                                            <th>Período</th>
                                            <th>Transporte</th>
                                            <th>Situação</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {viagensEmAnalise.map(
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
                                                                    Viagem #{viagem.id}
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
                                                        {viagem.transportes?.join(
                                                            ", "
                                                        ) || "Não informado"}
                                                    </td>


                                                    <td>

                                                        <span className="status analise">
                                                            Em análise
                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            )}

                        </div>

                    </section>


                    {/* HISTÓRICO DE SOLICITAÇÕES */}

                    <section className="section">

                        <div className="section-header">

                            <div>

                                <h3>
                                    Histórico das solicitações
                                </h3>

                                <p>
                                    Viagens que já receberam
                                    uma decisão.
                                </p>

                            </div>

                        </div>


                        <div className="table-container">

                            {outrasSolicitacoes.length === 0 ? (

                                <div className="empty-state">

                                    <p>
                                        Nenhuma solicitação
                                        finalizada.
                                    </p>

                                </div>

                            ) : (

                                <table>

                                    <thead>

                                        <tr>
                                            <th>Viagem</th>
                                            <th>Período</th>
                                            <th>Transporte</th>
                                            <th>Situação</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {outrasSolicitacoes.map(
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

                                                        <strong>
                                                            {viagem.origem}
                                                            {" → "}
                                                            {viagem.destino}
                                                        </strong>

                                                        <span className="texto-suave">
                                                            Viagem #{viagem.id}
                                                        </span>

                                                    </td>


                                                    <td>

                                                        {formatarData(
                                                            viagem.dataInicio
                                                        )}

                                                        {" até "}

                                                        {formatarData(
                                                            viagem.dataFim
                                                        )}

                                                    </td>


                                                    <td>
                                                        {viagem.transportes?.join(
                                                            ", "
                                                        ) || "Não informado"}
                                                    </td>


                                                    <td>

                                                        {viagem.status ===
                                                        "ACEITA" ? (

                                                            <span className="status aceita">
                                                                Aprovada
                                                            </span>

                                                        ) : (

                                                            <button
                                                                type="button"
                                                                className="status rejeitada status-button"
                                                                onClick={(event) => {

                                                                    event.stopPropagation();

                                                                    setJustificativaSelecionada(
                                                                        viagem.justificativa ||
                                                                        "Nenhuma justificativa informada."
                                                                    );
                                                                }}
                                                            >
                                                                Rejeitada
                                                            </button>

                                                        )}

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            )}

                        </div>

                    </section>

                </main>

            </div>


            {justificativaSelecionada && (

                <Modal
                    titulo="Justificativa da rejeição"
                    onClose={() =>
                        setJustificativaSelecionada(
                            null
                        )
                    }
                >

                    <p>
                        {justificativaSelecionada}
                    </p>

                </Modal>

            )}

        </div>
    );
}

export default ViagensSolicitadas;