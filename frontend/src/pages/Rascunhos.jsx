import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar";

import {
    viagensRascunho as dadosIniciais,
    viagensSolicitadas
} from "../data/viagensMock";

function formatarData(data) {
    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
}

function obterStatus(status) {

    switch (status) {

        case "RASCUNHO":
            return {
                texto: "Rascunho",
                classe: "rascunho"
            };

        case "SOLICITADA":
            return {
                texto: "Em análise",
                classe: "analise"
            };

        case "AJUSTES_SOLICITADOS":
            return {
                texto: "Ajustes solicitados",
                classe: "ajustes"
            };

        case "APROVADA":
            return {
                texto: "Aprovada",
                classe: "aceita"
            };

        case "REJEITADA":
            return {
                texto: "Rejeitada",
                classe: "rejeitada"
            };

        case "CANCELADA":
            return {
                texto: "Cancelada",
                classe: "cancelada"
            };

        default:
            return {
                texto: status,
                classe: "rascunho"
            };
    }
}

function Rascunhos() {
    const navigate = useNavigate();

    const [filtro, setFiltro] = useState("TODAS");

    /*
     * Mantemos os rascunhos como estado porque
     * o usuário pode excluir uma viagem.
     */
    const [rascunhos, setRascunhos] =
        useState(dadosIniciais);

    /*
     * Unimos temporariamente os dados mockados
     * de rascunhos e solicitações para permitir
     * uma consulta única nesta tela.
     */
    const todasAsViagens = [
    ...rascunhos,
    ...viagensSolicitadas
];

const quantidadeRascunhos =
    todasAsViagens.filter(
        (viagem) =>
            viagem.status === "RASCUNHO"
    ).length;

const quantidadeAnalise =
    todasAsViagens.filter(
        (viagem) =>
            viagem.status === "SOLICITADA"
    ).length;

const quantidadeAprovadas =
    todasAsViagens.filter(
        (viagem) =>
            viagem.status === "APROVADA"
    ).length;

const quantidadeRejeitadas =
    todasAsViagens.filter(
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

        setRascunhos(
            rascunhos.filter(
                (viagem) =>
                    viagem.id !== id
            )
        );
    }

    function filtrarViagens(viagens) {
        if (filtro === "TODAS") {
            return viagens;
        }

        return viagens.filter(
            (viagem) => {
                if (
                    filtro === "RASCUNHO"
                ) {
                    return (
                        viagem.status ===
                        "EM_RASCUNHO"
                    );
                }

                if (
                    filtro === "ANALISE"
                ) {
                    return (
                        viagem.status ===
                        "EM_ANALISE"
                    );
                }

                if (
                    filtro === "APROVADA"
                ) {
                    return (
                        viagem.status ===
                        "ACEITA"
                    );
                }

                if (
                    filtro === "REJEITADA"
                ) {
                    return (
                        viagem.status ===
                        "REJEITADA"
                    );
                }

                return true;
            }
        );
    }

    const viagensFiltradas =
    filtro === "TODAS"
        ? todasAsViagens
        : todasAsViagens.filter(
            (viagem) => {

                if (
                    filtro === "RASCUNHO"
                ) {
                    return viagem.status ===
                        "RASCUNHO";
                }

                if (
                    filtro === "ANALISE"
                ) {
                    return viagem.status ===
                        "SOLICITADA";
                }

                if (
                    filtro === "APROVADA"
                ) {
                    return viagem.status ===
                        "APROVADA";
                }

                if (
                    filtro === "REJEITADA"
                ) {
                    return viagem.status ===
                        "REJEITADA";
                }

                return true;
            }
        );

    function obterTextoFiltro() {
        switch (filtro) {
            case "RASCUNHO":
                return "Rascunhos";

            case "ANALISE":
                return "Viagens em análise";

            case "APROVADA":
                return "Viagens aprovadas";

            case "REJEITADA":
                return "Viagens rejeitadas";

            default:
                return "Todas as viagens";
        }
    }

    return (
        <div className="app">

            <Navbar />

            <div className="main-area">

                <Header />

                <main className="content">

                    {/* ==============================
                        CABEÇALHO
                    ============================== */}

                    <section className="welcome">

                        <div>

                            <span className="welcome-small">
                                MINHAS VIAGENS
                            </span>

                            <h2>
                                Olá, Fernanda!
                            </h2>

                            <p>
                                Acompanhe suas viagens,
                                solicitações e gastos.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="botao-destaque"
                            onClick={() =>
                                navigate(
                                    "/nova-viagem"
                                )
                            }
                        >
                            + Nova viagem
                        </button>

                    </section>


                    {/* ==============================
                        INDICADORES
                    ============================== */}

                    <section className="cards">

                        <div
                            className="summary-card"
                            onClick={() =>
                                setFiltro("RASCUNHO")
                            }
                        >

                            <div className="summary-icon olive">
                                📝
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


                        <div
                            className="summary-card"
                            onClick={() =>
                                setFiltro("ANALISE")
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
                            className="summary-card"
                            onClick={() =>
                                setFiltro("APROVADA")
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
                            className="summary-card"
                            onClick={() =>
                                setFiltro("REJEITADA")
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


                    {/* ==============================
                        CONSULTA
                    ============================== */}

                    <section className="section">

                        <div className="section-header">

                            <div>

                                <h3>
                                    {obterTextoFiltro()}
                                </h3>

                                <p>
                                    Consulte suas viagens
                                    e acompanhe a situação
                                    de cada solicitação.
                                </p>

                            </div>

                        </div>


                        {/* ==============================
                            FILTROS
                        ============================== */}

                        <div className="filtros-viagens">

                            <button
                                type="button"
                                className={
                                    filtro === "TODAS"
                                        ? "filtro-viagem ativo"
                                        : "filtro-viagem"
                                }
                                onClick={() =>
                                    setFiltro("TODAS")
                                }
                            >
                                Todas
                            </button>

                            <button
                                type="button"
                                className={
                                    filtro === "RASCUNHO"
                                        ? "filtro-viagem ativo"
                                        : "filtro-viagem"
                                }
                                onClick={() =>
                                    setFiltro("RASCUNHO")
                                }
                            >
                                Rascunhos
                            </button>

                            <button
                                type="button"
                                className={
                                    filtro === "ANALISE"
                                        ? "filtro-viagem ativo"
                                        : "filtro-viagem"
                                }
                                onClick={() =>
                                    setFiltro("ANALISE")
                                }
                            >
                                Em análise
                            </button>

                            <button
                                type="button"
                                className={
                                    filtro === "APROVADA"
                                        ? "filtro-viagem ativo"
                                        : "filtro-viagem"
                                }
                                onClick={() =>
                                    setFiltro("APROVADA")
                                }
                            >
                                Aprovadas
                            </button>

                            <button
                                type="button"
                                className={
                                    filtro === "REJEITADA"
                                        ? "filtro-viagem ativo"
                                        : "filtro-viagem"
                                }
                                onClick={() =>
                                    setFiltro("REJEITADA")
                                }
                            >
                                Rejeitadas
                            </button>

                        </div>


                        {/* ==============================
                            TABELA
                        ============================== */}

                        <div className="table-container">

                            {viagensFiltradas.length > 0 ? (

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Viagem
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
                                                Ações
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {viagensFiltradas.map(
                                            (viagem) => {

                                                const status =
                                                    obterStatus(
                                                        viagem.status
                                                    );

                                                const podeExcluir =
                                                    viagem.status ===
                                                    "EM_RASCUNHO";

                                                return (

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

                                                            {viagem.destino}

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

                                                            {viagem.transportes &&
                                                            viagem.transportes.length > 0
                                                                ? viagem.transportes.join(
                                                                    ", "
                                                                )
                                                                : "Não informado"
                                                            }

                                                        </td>


                                                        <td>

                                                            <span
                                                                className={`status ${status.classe}`}
                                                            >
                                                                {status.texto}
                                                            </span>

                                                        </td>


                                                        <td>

                                                            {podeExcluir ? (

                                                                <button
                                                                    type="button"
                                                                    className="botao-excluir"
                                                                    title="Excluir viagem"
                                                                    onClick={(
                                                                        event
                                                                    ) =>
                                                                        excluirViagem(
                                                                            viagem.id,
                                                                            event
                                                                        )
                                                                    }
                                                                >
                                                                    🗑
                                                                </button>

                                                            ) : (

                                                                <button
                                                                    type="button"
                                                                    className="botao-link"
                                                                    onClick={(
                                                                        event
                                                                    ) => {
                                                                        event.stopPropagation();

                                                                        navigate(
                                                                            `/viagem/${viagem.id}`
                                                                        );
                                                                    }}
                                                                >
                                                                    Visualizar
                                                                </button>

                                                            )}

                                                        </td>

                                                    </tr>

                                                );

                                            }
                                        )}

                                    </tbody>

                                </table>

                            ) : (

                                <div className="empty-state">

                                    <h3>
                                        Nenhuma viagem encontrada
                                    </h3>

                                    <p>
                                        Não existem viagens
                                        para o filtro selecionado.
                                    </p>

                                    <button
                                        type="button"
                                        className="botao-destaque"
                                        onClick={() =>
                                            navigate(
                                                "/nova-viagem"
                                            )
                                        }
                                    >
                                        + Nova viagem
                                    </button>

                                </div>

                            )}

                        </div>


                        <p className="texto-ajuda">
                            Clique em uma viagem para
                            visualizar seus detalhes.
                        </p>

                    </section>

                </main>

            </div>

        </div>
    );
}

export default Rascunhos;