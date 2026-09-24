import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar";

import "../styles/viagens.css";



function NovaViagem() {
    const navigate = useNavigate();
    const location = useLocation();

    const parametros =
        new URLSearchParams(location.search);

    const idEdicao =
        parametros.get("editar");

    const modoEdicao =
        Boolean(idEdicao);

    const [dataInicio, setDataInicio] =
        useState("");

    const [dataFim, setDataFim] =
        useState("");

    const [origem, setOrigem] =
        useState("");

    const [destino, setDestino] =
        useState("");

    const [transportes, setTransportes] =
        useState([]);

    const [motivo, setMotivo] =
        useState("");

    function alternarTransporte(transporte) {
        if (transportes.includes(transporte)) {

            setTransportes(
                transportes.filter(
                    (item) =>
                        item !== transporte
                )
            );

            return;
        }

        setTransportes([
            ...transportes,
            transporte
        ]);
    }

    function montarViagem(status) {
        return {
            id: idEdicao
                ? Number(idEdicao)
                : undefined,

            dataInicio,

            dataFim,

            origem,

            destino,

            transportes,

            motivo,

            status
        };
    }

    function validarFormulario() {

        if (!dataInicio) {
            alert(
                "Informe a data de início."
            );
            return false;
        }

        if (!dataFim) {
            alert(
                "Informe a data de fim."
            );
            return false;
        }

        const hoje =
            new Date()
                .toISOString()
                .split("T")[0];

        if (dataInicio < hoje) {
            alert(
                "A data de início não pode estar no passado."
            );
            return false;
        }

        if (dataFim < dataInicio) {
            alert(
                "A data de fim deve ser igual ou posterior à data de início."
            );
            return false;
        }

        if (!origem.trim()) {
            alert(
                "Informe a origem da viagem."
            );
            return false;
        }

        if (!destino.trim()) {
            alert(
                "Informe o destino da viagem."
            );
            return false;
        }

        if (transportes.length === 0) {
            alert(
                "Selecione pelo menos um meio de transporte."
            );
            return false;
        }

        if (!motivo.trim()) {
            alert(
                "Informe o motivo da viagem."
            );
            return false;
        }

        return true;
    }

    function salvarRascunho() {
        const viagem =
            montarViagem(
                "EM_RASCUNHO"
            );

        console.log(
            "Salvar rascunho:",
            viagem
        );

        alert(
            modoEdicao
                ? "Rascunho atualizado com sucesso!"
                : "Viagem salva como rascunho!"
        );

        navigate("/");
    }

    function enviarParaAnalise() {

        if (!validarFormulario()) {
            return;
        }

        const viagem =
            montarViagem(
                "EM_ANALISE"
            );

        console.log(
            "Enviar para análise:",
            viagem
        );

        alert(
            modoEdicao
                ? "Viagem reenviada para análise!"
                : "Viagem enviada para análise!"
        );

        navigate("/");
    }

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
                                navigate(-1)
                            }
                        >
                            ← Voltar
                        </button>

                    </div>


                    <section className="welcome">

                        <div>

                            <span className="welcome-small">
                                {modoEdicao
                                    ? "EDITAR VIAGEM"
                                    : "NOVA VIAGEM"}
                            </span>

                            <h2>
                                {modoEdicao
                                    ? "Alterar viagem"
                                    : "Planejar nova viagem"}
                            </h2>

                            <p>
                                Informe os dados da
                                viagem e escolha como
                                deseja finalizar o planejamento.
                            </p>

                        </div>

                    </section>


                    <section className="formulario-viagem">

                        {/* DADOS PRINCIPAIS */}

                        <div className="form-section">

                            <div className="form-section-title">

                                <h3>
                                    01 — Informações da viagem
                                </h3>

                                <p>
                                    Informe o período,
                                    origem e destino.
                                </p>

                            </div>


                            <div className="grid-formulario">

                                <div className="campo-viagem">

                                    <label htmlFor="dataInicio">
                                        Data de início
                                    </label>

                                    <input
                                        id="dataInicio"
                                        type="date"
                                        value={dataInicio}
                                        onChange={(event) =>
                                            setDataInicio(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="campo-viagem">

                                    <label htmlFor="dataFim">
                                        Data de fim
                                    </label>

                                    <input
                                        id="dataFim"
                                        type="date"
                                        min={dataInicio || undefined}
                                        value={dataFim}
                                        onChange={(event) =>
                                            setDataFim(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="campo-viagem">

                                    <label htmlFor="origem">
                                        Origem
                                    </label>

                                    <input
                                        id="origem"
                                        type="text"
                                        placeholder="Ex.: Foz do Iguaçu - PR"
                                        value={origem}
                                        onChange={(event) =>
                                            setOrigem(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="campo-viagem">

                                    <label htmlFor="destino">
                                        Destino
                                    </label>

                                    <input
                                        id="destino"
                                        type="text"
                                        placeholder="Ex.: Curitiba - PR"
                                        value={destino}
                                        onChange={(event) =>
                                            setDestino(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>

                        </div>


                        {/* TRANSPORTE */}

                        <div className="form-section">

                            <div className="form-section-title">

                                <h3>
                                    02 — Meio de transporte
                                </h3>

                                <p>
                                    Selecione os meios que
                                    serão utilizados.
                                </p>

                            </div>


                            <div className="transportes-viagem">

                                {[
                                    "Avião",
                                    "Carro",
                                    "Ônibus",
                                    "Trem"
                                ].map(
                                    (transporte) => (

                                        <button
                                            key={transporte}
                                            type="button"
                                            className={
                                                transportes.includes(
                                                    transporte
                                                )
                                                    ? "transporte-opcao selecionado"
                                                    : "transporte-opcao"
                                            }
                                            onClick={() =>
                                                alternarTransporte(
                                                    transporte
                                                )
                                            }
                                        >
                                            {transporte}
                                        </button>

                                    )
                                )}

                            </div>

                        </div>


                        {/* MOTIVO */}

                        <div className="form-section">

                            <div className="form-section-title">

                                <h3>
                                    03 — Motivo da viagem
                                </h3>

                                <p>
                                    Explique o motivo da
                                    viagem corporativa.
                                </p>

                            </div>


                            <div className="campo-viagem">

                                <label htmlFor="motivo">
                                    Motivo
                                </label>

                                <textarea
                                    id="motivo"
                                    placeholder="Ex.: Reunião com clientes, treinamento, congresso..."
                                    value={motivo}
                                    onChange={(event) =>
                                        setMotivo(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>


                        {/* AVISO FINANCEIRO */}

                        <div className="info-aviso">
                            <strong>
                                Despesas não são registradas nesta etapa.
                            </strong>

                            <p>
                                Depois que a viagem for aprovada,
                                você poderá registrar os gastos
                                realizados durante o deslocamento.
                            </p>
                        </div>


                        {/* AÇÕES */}

                        <div className="form-footer-viagem">

                            <p>
                                Você pode salvar a viagem
                                como rascunho e continuar depois,
                                ou enviá-la para análise quando
                                o planejamento estiver concluído.
                            </p>

                            <div className="form-acoes">

                                <button
                                    type="button"
                                    className="botao-secundario"
                                    onClick={
                                        salvarRascunho
                                    }
                                >
                                    Salvar como rascunho
                                </button>

                                <button
                                    type="button"
                                    className="botao-destaque"
                                    onClick={
                                        enviarParaAnalise
                                    }
                                >
                                    Enviar para análise
                                </button>

                            </div>

                        </div>

                    </section>

                </main>

            </div>

        </div>
    );
}

export default NovaViagem;