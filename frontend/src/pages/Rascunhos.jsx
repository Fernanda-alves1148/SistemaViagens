import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import { viagensRascunho as dadosIniciais } from "../data/viagensMock";

function Rascunhos() {

    const navigate = useNavigate();

    const [viagens, setViagens] = useState(dadosIniciais);

    function excluirViagem(id, event) {

        event.stopPropagation();

        const confirmacao = window.confirm(
            "Deseja realmente excluir esta viagem?"
        );

        if (!confirmacao) {
            return;
        }

        setViagens(
            viagens.filter((viagem) => viagem.id !== id)
        );
    }

    return (
        <>
            <Header />

            <Navbar />

            <main className="container">

                <div className="pagina-cabecalho">

                    <h2>Viagens em rascunho</h2>

                    <button
                        onClick={() => navigate("/nova-viagem")}
                    >
                        Nova viagem
                    </button>

                </div>

                <table>

                    <thead>
                        <tr>
                            <th>Data de início</th>
                            <th>Data de fim</th>
                            <th>Origem</th>
                            <th>Destino</th>
                            <th>Meio de transporte</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>

                        {viagens.map((viagem) => (

                            <tr
                                key={viagem.id}
                                className="linha-clicavel"
                                onClick={() =>
                                    navigate(`/viagem/${viagem.id}`)
                                }
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
                                    {viagem.transportes.join(", ")}
                                </td>

                                <td>
                                    Em rascunho
                                </td>

                                <td>

                                    <button
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

                        ))}

                    </tbody>

                </table>

            </main>
        </>
    );
}

export default Rascunhos;