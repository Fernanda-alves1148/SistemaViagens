import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar";
import TabelaDespesas from "../components/TabelaDespesas";

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

const [despesas, setDespesas] =
    useState([]);

const [motivo, setMotivo] =
    useState("");

function alternarTransporte(
    transporte
) {

    if (
        transportes.includes(
            transporte
        )
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
        id: idEdicao
            ? Number(idEdicao)
            : undefined,

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

    if (
        transportes.length === 0
    ) {
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

function salvarViagem() {

    if (!validarFormulario()) {
        return;
    }

    const viagem =
        montarViagem(
            modoEdicao
                ? "EM_RASCUNHO"
                : "SOLICITADA"
        );

    console.log(
        modoEdicao
            ? "Atualizar viagem:"
            : "Criar viagem:",
        viagem
    );

    alert(
        modoEdicao
            ? "Alterações salvas com sucesso!"
            : "Viagem cadastrada com sucesso!"
    );

    navigate("/");
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
                                : "Nova viagem"}
                        </h2>

                        <p>
                            {modoEdicao
                                ? "Atualize as informações da sua viagem."
                                : "Preencha as informações para cadastrar uma nova viagem."}
                        </p>

                    </div>

                </section>


                <section className="formulario">

                    <div className="form-section">

                        <div className="form-section-title">

                            

                            <div>
                                <h3>
                                    01 - Informações da viagem
                                </h3>

                                <p>
                                    Informe os dados principais da viagem.
                                </p>
                            </div>

                        </div>


                        <div className="grid-formulario">

                            <div className="campo">

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


                            <div className="campo">

                                <label htmlFor="dataFim">
                                    Data de fim
                                </label>

                                <input
                                    id="dataFim"
                                    type="date"
                                    value={dataFim}
                                    onChange={(event) =>
                                        setDataFim(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="campo">

                                <label htmlFor="origem">
                                    Origem da viagem
                                </label>

                                <input
                                    id="origem"
                                    type="text"
                                    placeholder="Ex.: São Paulo - SP"
                                    value={origem}
                                    onChange={(event) =>
                                        setOrigem(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="campo">

                                <label htmlFor="destino">
                                    Destino da viagem
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


                    <div className="form-section">

                        <div className="form-section-title">

                            

                            <div>
                                <h3>
                                    02 - Meio de transporte
                                </h3>

                                <p>
                                    Selecione todos os meios utilizados.
                                </p>
                            </div>

                        </div>


                        <div className="campo">

                            <div className="transportes">

                                {[
                                    "Avião",
                                    "Carro",
                                    "Ônibus",
                                    "Trem"
                                ].map(
                                    (transporte) => (

                                        <label
                                            key={
                                                transporte
                                            }
                                            className={
                                                transportes.includes(
                                                    transporte
                                                )
                                                    ? "transporte-selecionado"
                                                    : ""
                                            }
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

                                            <span>
                                                {transporte}
                                            </span>

                                        </label>

                                    )
                                )}

                            </div>

                        </div>

                    </div>


                    <div className="form-section">

                        <div className="form-section-title">

                            

                            <div>
                                <h3>
                                    03 - Despesas
                                </h3>

                                <p>
                                    Adicione as despesas previstas para a viagem.
                                </p>
                            </div>

                        </div>


                        <TabelaDespesas
                            despesas={
                                despesas
                            }
                            setDespesas={
                                setDespesas
                            }
                        />

                    </div>


                    <div className="form-section">

                        <div className="form-section-title">

                            

                            <div>
                                <h3>
                                    04 - Motivo da viagem
                                </h3>

                                <p>
                                    Explique o motivo da solicitação.
                                </p>
                            </div>

                        </div>


                        <div className="campo">

                            <label htmlFor="motivo">
                                Motivo da viagem
                            </label>

                            <textarea
                                id="motivo"
                                rows="5"
                                placeholder="Descreva o motivo da viagem..."
                                value={motivo}
                                onChange={(event) =>
                                    setMotivo(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    <div className="form-footer">

                        <div>

                                
                            

                            <span className="form-footer-text">
                                Pronto para finalizar? Você poderá salvar como rascunho
                                e continuar depois.
                            </span>

                        </div>


                        <div className="acoes">

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
                                    salvarViagem
                                }
                            >
                                {modoEdicao
                                    ? "Salvar alterações"
                                    : "Cadastrar viagem"}
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
