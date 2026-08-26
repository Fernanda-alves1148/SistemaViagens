import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
import TabelaDespesas from "../components/TabelaDespesas";

function NovaViagem() {

    const navigate = useNavigate();

    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");

    const [origem, setOrigem] = useState("");
    const [destino, setDestino] = useState("");

    const [transportes, setTransportes] = useState([]);

    const [despesas, setDespesas] = useState([]);

    const [motivo, setMotivo] = useState("");

    function alternarTransporte(
        transporte
    ) {

        if (
            transportes.includes(transporte)
        ) {

            setTransportes(
                transportes.filter(
                    (item) =>
                        item !== transporte
                )
            );

        } else {

            setTransportes([
                ...transportes,
                transporte
            ]);

        }
    }

    function montarViagem(status) {

        return {
            dataInicio,
            dataFim,
            origem,
            destino,
            transportes,
            despesas,
            motivo,
            status
        };
    }

    function cadastrarViagem() {

        const viagem = montarViagem(
            "SOLICITADA"
        );

        console.log(
            "Enviar para o backend:",
            viagem
        );

        alert(
            "Viagem cadastrada com sucesso!"
        );

        navigate("/");
    }

    function salvarRascunho() {

        const viagem = montarViagem(
            "EM_RASCUNHO"
        );

        console.log(
            "Enviar para o backend:",
            viagem
        );

        alert(
            "Viagem salva como rascunho!"
        );

        navigate("/");
    }

    return (
        <>
            <Header />

            <Navbar />

            <main className="container">

                <h2>Nova viagem</h2>

                <div className="formulario">

                    <div className="grid-formulario">

                        <div className="campo">

                            <label>
                                Data de início
                            </label>

                            <input
                                type="date"
                                value={dataInicio}
                                onChange={(event) =>
                                    setDataInicio(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="campo">

                            <label>
                                Data de fim
                            </label>

                            <input
                                type="date"
                                value={dataFim}
                                onChange={(event) =>
                                    setDataFim(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                    <div className="grid-formulario">

                        <div className="campo">

                            <label>
                                Origem da viagem
                            </label>

                            <input
                                type="text"
                                value={origem}
                                onChange={(event) =>
                                    setOrigem(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="campo">

                            <label>
                                Destino da viagem
                            </label>

                            <input
                                type="text"
                                value={destino}
                                onChange={(event) =>
                                    setDestino(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                    <div className="campo">

                        <label>
                            Meio(s) de transporte utilizado(s)
                        </label>

                        <div className="transportes">

                            {[
                                "Avião",
                                "Carro",
                                "Ônibus",
                                "Trem"
                            ].map((transporte) => (

                                <label
                                    key={transporte}
                                >

                                    <input
                                        type="checkbox"
                                        checked={transportes.includes(
                                            transporte
                                        )}
                                        onChange={() =>
                                            alternarTransporte(
                                                transporte
                                            )
                                        }
                                    />

                                    {transporte}

                                </label>

                            ))}

                        </div>

                    </div>

                    <TabelaDespesas
                        despesas={despesas}
                        setDespesas={setDespesas}
                    />

                    <div className="campo">

                        <label>
                            Motivo da viagem
                        </label>

                        <textarea
                            rows="5"
                            value={motivo}
                            onChange={(event) =>
                                setMotivo(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                    <div className="acoes">

                        <button
                            onClick={cadastrarViagem}
                        >
                            Cadastrar viagem
                        </button>

                        <button
                            className="botao-secundario"
                            onClick={salvarRascunho}
                        >
                            Salvar como rascunho
                        </button>

                    </div>

                </div>

            </main>
        </>
    );
}

export default NovaViagem;