import { useState } from "react";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";

import {
    viagensSolicitadas
} from "../data/viagensMock";

function ViagensSolicitadas() {

    const [
        justificativaSelecionada,
        setJustificativaSelecionada
    ] = useState(null);

    return (
        <>
            <Header />

            <Navbar />

            <main className="container">

                <h2>
                    Viagens solicitadas
                </h2>

                <table>

                    <thead>

                        <tr>
                            <th>Data de início</th>
                            <th>Data de fim</th>
                            <th>Origem</th>
                            <th>Destino</th>
                            <th>Meio de transporte</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody>

                        {viagensSolicitadas.map(
                            (viagem) => (

                                <tr
                                    key={viagem.id}
                                >

                                    <td>
                                        {viagem.dataInicio}
                                    </td>

                                    <td>
                                        {viagem.dataFim}
                                    </td>

                                    <td>
                                        {viagem.origem}
                                    </td>

                                    <td>
                                        {viagem.destino}
                                    </td>

                                    <td>
                                        {viagem.transportes.join(
                                            ", "
                                        )}
                                    </td>

                                    <td>

                                        {viagem.status ===
                                        "REJEITADA" ? (

                                            <button
                                                className="status rejeitada"
                                                onClick={() =>
                                                    setJustificativaSelecionada(
                                                        viagem.justificativa
                                                    )
                                                }
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

            </main>

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

        </>
    );
}

export default ViagensSolicitadas;