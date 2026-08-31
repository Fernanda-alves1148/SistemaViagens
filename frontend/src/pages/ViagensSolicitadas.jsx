import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";

import {
    viagensSolicitadas
} from "../data/viagensMock";

function formatarData(data) {
    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
}

function ViagensSolicitadas() {

    const navigate = useNavigate();

    const [
        justificativaSelecionada,
        setJustificativaSelecionada
    ] = useState(null);

    return (
        <div className="app">

            <Navbar />

            <div className="main-area">

                <Header />

                <main className="content">

                    <section className="welcome">

                        <div>

                            <span className="welcome-small">
                                SOLICITAÇÕES
                            </span>

                            <h2>
                                Minhas viagens solicitadas
                            </h2>

                            <p>
                                Acompanhe o andamento
                                das suas solicitações.
                            </p>

                        </div>

                    </section>


                    <section className="section">

                        <div className="section-header">

                            <div>

                                <h3>
                                    Solicitações
                                </h3>

                                <p>
                                    Consulte o status
                                    das viagens enviadas.
                                </p>

                            </div>

                        </div>


                        <div className="table-container">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Viagem
                                        </th>

                                        <th>
                                            Período
                                        </th>

                                        <th>
                                            Transporte
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {viagensSolicitadas.map(
                                        (viagem) => (

                                            <tr
                                                key={
                                                    viagem.id
                                                }

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
                                                                {
                                                                    viagem.origem
                                                                }

                                                                {" → "}

                                                                {
                                                                    viagem.destino
                                                                }
                                                            </strong>

                                                            <span>
                                                                Viagem #
                                                                {
                                                                    viagem.id
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td>

                                                    <strong>
                                                        {
                                                            formatarData(
                                                                viagem.dataInicio
                                                            )
                                                        }
                                                    </strong>

                                                    <span className="texto-suave">
                                                        {" "}até{" "}
                                                        {
                                                            formatarData(
                                                                viagem.dataFim
                                                            )
                                                        }
                                                    </span>

                                                </td>


                                                <td>
                                                    {
                                                        viagem.transportes.join(
                                                            ", "
                                                        )
                                                    }
                                                </td>


                                                <td>

                                                    {viagem.status ===
                                                    "REJEITADA" ? (

                                                        <button
                                                            type="button"
                                                            className="status rejeitada status-button"
                                                            onClick={(event) => {

                                                                /*
                                                                 * O botão de rejeitada
                                                                 * não deve abrir os detalhes.
                                                                 */

                                                                event.stopPropagation();

                                                                setJustificativaSelecionada(
                                                                    viagem.justificativa
                                                                );
                                                            }}
                                                        >
                                                            Rejeitada
                                                        </button>

                                                    ) : viagem.status ===
                                                      "ACEITA" ? (

                                                        <span className="status aceita">
                                                            Aceita
                                                        </span>

                                                    ) : (

                                                        <span className="status analise">
                                                            Em análise
                                                        </span>

                                                    )}

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>


                        <p className="texto-ajuda">
                            Clique em uma viagem para visualizar
                            seus detalhes.
                        </p>

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