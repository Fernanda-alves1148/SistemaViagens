import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import NavbarGestao from "../components/NavbarGestao";

import { listarViagens } from "../services/viagemService";

import "../styles/gestao.css";

function formatarData(data) {
    if (!data) {
        return "-";
    }

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
}

function obterTextoStatus(status) {
    switch (status) {
        case "RASCUNHO":
            return "Rascunho";

        case "SOLICITADA":
            return "Em análise";

        case "AJUSTES_SOLICITADOS":
            return "Ajustes solicitados";

        case "APROVADA":
            return "Aprovada";

        case "REJEITADA":
            return "Rejeitada";

        case "CANCELADA":
            return "Cancelada";

        default:
            return status || "-";
    }
}

function obterClasseStatus(status) {
    switch (status) {
        case "SOLICITADA":
            return "status analise";

        case "AJUSTES_SOLICITADOS":
            return "status ajustes";

        case "APROVADA":
            return "status aceita";

        case "REJEITADA":
            return "status rejeitada";

        case "CANCELADA":
            return "status cancelada";

        case "RASCUNHO":
            return "status rascunho";

        default:
            return "status rascunho";
    }
}

function GestaoViagens() {
    const navigate = useNavigate();

    const [viagens, setViagens] = useState([]);

    const [carregando, setCarregando] = useState(true);

    const [erro, setErro] = useState("");

    const [filtroStatus, setFiltroStatus] =
        useState("TODAS");

    const [destinoBusca, setDestinoBusca] =
        useState("");

    const [dataInicioBusca, setDataInicioBusca] =
        useState("");

    const [dataFimBusca, setDataFimBusca] =
        useState("");


    /*
     * ==========================================
     * CARREGAR VIAGENS DO BACKEND
     * ==========================================
     */

    useEffect(() => {
        async function carregarViagens() {
            try {
                setCarregando(true);
                setErro("");

                const resposta = await listarViagens();

                setViagens(resposta || []);

            } catch (error) {
                console.error(
                    "Erro ao carregar viagens:",
                    error
                );

                setErro(
                    error.message ||
                    "Não foi possível carregar as viagens."
                );

                setViagens([]);

            } finally {
                setCarregando(false);
            }
        }

        carregarViagens();

    }, []);


    /*
     * ==========================================
     * INDICADORES
     * ==========================================
     */

    const quantidadeTotal =
        viagens.length;

    const quantidadeAnalise =
        viagens.filter(
            (viagem) =>
                viagem.status ===
                "SOLICITADA"
        ).length;

    const quantidadeAprovadas =
        viagens.filter(
            (viagem) =>
                viagem.status ===
                "APROVADA"
        ).length;

    const quantidadeRejeitadas =
        viagens.filter(
            (viagem) =>
                viagem.status ===
                "REJEITADA"
        ).length;


    /*
     * ==========================================
     * FILTROS
     * ==========================================
     */

    const viagensFiltradas =
        viagens.filter(
            (viagem) => {

                const correspondeStatus =
                    filtroStatus === "TODAS" ||
                    viagem.status ===
                        filtroStatus;


                const destino =
                    viagem.destino || "";


                const correspondeDestino =
                    destinoBusca.trim() === "" ||
                    destino
                        .toLowerCase()
                        .includes(
                            destinoBusca
                                .trim()
                                .toLowerCase()
                        );


                const correspondeDataInicio =
                    dataInicioBusca === "" ||
                    (
                        viagem.dataInicio &&
                        viagem.dataInicio >=
                            dataInicioBusca
                    );


                const correspondeDataFim =
                    dataFimBusca === "" ||
                    (
                        viagem.dataFim &&
                        viagem.dataFim <=
                            dataFimBusca
                    );


                return (
                    correspondeStatus &&
                    correspondeDestino &&
                    correspondeDataInicio &&
                    correspondeDataFim
                );
            }
        );


    /*
     * ==========================================
     * LIMPAR FILTROS
     * ==========================================
     */

    function limparFiltros() {
        setFiltroStatus("TODAS");
        setDestinoBusca("");
        setDataInicioBusca("");
        setDataFimBusca("");
    }


    /*
     * ==========================================
     * TELA DE CARREGAMENTO
     * ==========================================
     */

    if (carregando) {
        return (
            <div className="app">

                <NavbarGestao />

                <div className="main-area">

                    <Header />

                    <main className="content">

                        <section className="section">

                            <div className="empty-state">

                                <h3>
                                    Carregando viagens...
                                </h3>

                                <p>
                                    Aguarde enquanto buscamos
                                    as viagens no sistema.
                                </p>

                            </div>

                        </section>

                    </main>

                </div>

            </div>
        );
    }


    /*
     * ==========================================
     * ERRO AO CARREGAR
     * ==========================================
     */

    if (erro) {
        return (
            <div className="app">

                <NavbarGestao />

                <div className="main-area">

                    <Header />

                    <main className="content">

                        <section className="section">

                            <div className="empty-state">

                                <h3>
                                    Não foi possível carregar
                                    as viagens
                                </h3>

                                <p>
                                    {erro}
                                </p>

                                <button
                                    type="button"
                                    className="botao-secundario"
                                    onClick={() =>
                                        window.location.reload()
                                    }
                                >
                                    Tentar novamente
                                </button>

                            </div>

                        </section>

                    </main>

                </div>

            </div>
        );
    }


    return (
        <div className="app">

            <NavbarGestao />

            <div className="main-area">

                <Header />

                <main className="content">

                    {/* ===============================
                        CABEÇALHO
                    =============================== */}

                    <section className="welcome">

                        <div>

                            <span className="welcome-small">
                                ÁREA DO GESTOR
                            </span>

                            <h2>
                                Gestão de viagens
                            </h2>

                            <p>
                                Consulte as viagens
                                dos colaboradores e
                                acompanhe as solicitações
                                que aguardam análise.
                            </p>

                        </div>

                    </section>


                    {/* ===============================
                        INDICADORES
                    =============================== */}

                    <section className="cards">

                        <div className="summary-card">

                            <div className="summary-icon olive">
                                ∑
                            </div>

                            <div>

                                <strong>
                                    {quantidadeTotal}
                                </strong>

                                <span>
                                    Total de viagens
                                </span>

                            </div>

                        </div>


                        <div
                            className="summary-card clickable"
                            onClick={() =>
                                setFiltroStatus(
                                    "SOLICITADA"
                                )
                            }
                        >

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


                        <div
                            className="summary-card clickable"
                            onClick={() =>
                                setFiltroStatus(
                                    "APROVADA"
                                )
                            }
                        >

                            <div className="summary-icon green">
                                ✓
                            </div>

                            <div>

                                <strong>
                                    {quantidadeAprovadas}
                                </strong>

                                <span>
                                    Aprovadas
                                </span>

                            </div>

                        </div>


                        <div
                            className="summary-card clickable"
                            onClick={() =>
                                setFiltroStatus(
                                    "REJEITADA"
                                )
                            }
                        >

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


                    {/* ===============================
                        FILTROS
                    =============================== */}

                    <section className="section">

                        <div className="section-header">

                            <div>

                                <h3>
                                    Consultar viagens
                                </h3>

                                <p>
                                    Pesquise por destino,
                                    período ou situação.
                                </p>

                            </div>

                        </div>


                        <div className="filtros-gestao">

                            <div className="campo-filtro">

                                <label htmlFor="destinoBusca">
                                    Destino
                                </label>

                                <input
                                    id="destinoBusca"
                                    type="text"
                                    placeholder="Ex.: Curitiba"
                                    value={
                                        destinoBusca
                                    }
                                    onChange={(event) =>
                                        setDestinoBusca(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="campo-filtro">

                                <label htmlFor="dataInicioBusca">
                                    A partir de
                                </label>

                                <input
                                    id="dataInicioBusca"
                                    type="date"
                                    value={
                                        dataInicioBusca
                                    }
                                    onChange={(event) =>
                                        setDataInicioBusca(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="campo-filtro">

                                <label htmlFor="dataFimBusca">
                                    Até
                                </label>

                                <input
                                    id="dataFimBusca"
                                    type="date"
                                    value={
                                        dataFimBusca
                                    }
                                    onChange={(event) =>
                                        setDataFimBusca(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="campo-filtro">

                                <label htmlFor="filtroStatus">
                                    Situação
                                </label>

                                <select
                                    id="filtroStatus"
                                    value={
                                        filtroStatus
                                    }
                                    onChange={(event) =>
                                        setFiltroStatus(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="TODAS">
                                        Todas
                                    </option>

                                    <option value="RASCUNHO">
                                        Rascunhos
                                    </option>

                                    <option value="SOLICITADA">
                                        Em análise
                                    </option>

                                    <option value="AJUSTES_SOLICITADOS">
                                        Ajustes solicitados
                                    </option>

                                    <option value="APROVADA">
                                        Aprovadas
                                    </option>

                                    <option value="REJEITADA">
                                        Rejeitadas
                                    </option>

                                    <option value="CANCELADA">
                                        Canceladas
                                    </option>

                                </select>

                            </div>


                            <div className="campo-filtro acao-filtro">

                                <button
                                    type="button"
                                    className="botao-secundario"
                                    onClick={
                                        limparFiltros
                                    }
                                >
                                    Limpar filtros
                                </button>

                            </div>

                        </div>

                    </section>


                    {/* ===============================
                        RESULTADOS
                    =============================== */}

                    <section className="section">

                        <div className="section-header">

                            <div>

                                <h3>
                                    Viagens cadastradas
                                </h3>

                                <p>
                                    {viagensFiltradas.length}
                                    {" "}
                                    viagem(ns)
                                    encontrada(s).
                                </p>

                            </div>

                        </div>


                        <div className="table-container">

                            {viagensFiltradas.length === 0 ? (

                                <div className="empty-state">

                                    <h3>
                                        Nenhuma viagem encontrada
                                    </h3>

                                    <p>
                                        Tente modificar os
                                        filtros da pesquisa.
                                    </p>

                                </div>

                            ) : (

                                <table className="tabela-viagens">

                                    <thead>

                                        <tr>

                                            <th>
                                                Viagem
                                            </th>

                                            <th>
                                                Colaborador
                                            </th>

                                            <th>
                                                Destino
                                            </th>

                                            <th>
                                                Período
                                            </th>

                                            <th>
                                                Transporte
                                            </th>

                                            <th>
                                                Situação
                                            </th>

                                            <th>
                                                Ação
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {viagensFiltradas.map(
                                            (viagem) => {

                                                const transporte =
                                                    viagem.meiosTransporte
                                                        ?.join(", ") ||
                                                    "Não informado";

                                                return (
                                                    <tr
                                                        key={
                                                            viagem.id
                                                        }
                                                    >

                                                        <td>

                                                            #
                                                            {String(
                                                                viagem.id
                                                            ).padStart(
                                                                3,
                                                                "0"
                                                            )}

                                                        </td>


                                                        <td>

                                                            <strong>
                                                                {
                                                                    viagem.solicitante ||
                                                                    "Não informado"
                                                                }
                                                            </strong>

                                                            <span className="texto-suave">
                                                                {
                                                                    viagem.areaNoMomento ||
                                                                    "Área não informada"
                                                                }
                                                            </span>

                                                        </td>


                                                        <td>

                                                            <div className="celula-rota">

                                                                <strong>
                                                                    {
                                                                        viagem.destino
                                                                    }
                                                                    {viagem.ufDestino
                                                                        ? ` - ${viagem.ufDestino}`
                                                                        : ""}
                                                                </strong>

                                                                <span>
                                                                    de{" "}
                                                                    {
                                                                        viagem.origem
                                                                    }
                                                                    {viagem.ufOrigem
                                                                        ? ` - ${viagem.ufOrigem}`
                                                                        : ""}
                                                                </span>

                                                            </div>

                                                        </td>


                                                        <td>

                                                            <strong>
                                                                {formatarData(
                                                                    viagem.dataInicio
                                                                )}
                                                            </strong>

                                                            <span className="data-fim">
                                                                até{" "}
                                                                {formatarData(
                                                                    viagem.dataFim
                                                                )}
                                                            </span>

                                                        </td>


                                                        <td>
                                                            {
                                                                transporte
                                                            }
                                                        </td>


                                                        <td>

                                                            <span
                                                                className={
                                                                    obterClasseStatus(
                                                                        viagem.status
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    obterTextoStatus(
                                                                        viagem.status
                                                                    )
                                                                }
                                                            </span>

                                                        </td>


                                                        <td>

                                                            <button
                                                                type="button"
                                                                className="botao-visualizar"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/gestao/viagem/${viagem.id}`
                                                                    )
                                                                }
                                                            >
                                                                Visualizar
                                                            </button>

                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            )}

                        </div>

                    </section>

                </main>

            </div>

        </div>
    );
}

export default GestaoViagens;