import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import NavbarGestao from "../components/NavbarGestao.jsx";

import { listarViagens } from "../services/viagemService";

import "../styles/Dashboard.css";

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

function obterTextoStatus(status) {

    switch (status) {

        case "RASCUNHO":
            return "Rascunho";

        case "SOLICITADA":
            return "Em análise";

        case "APROVADA":
            return "Aprovada";

        case "REJEITADA":
            return "Rejeitada";

        case "CANCELADA":
            return "Cancelada";

        case "AJUSTES_SOLICITADOS":
            return "Ajustes solicitados";

        default:
            return status || "-";
    }
}

function obterClasseStatus(status) {

    switch (status) {

        case "APROVADA":
            return "status aceita";

        case "REJEITADA":
            return "status rejeitada";

        case "SOLICITADA":
            return "status analise";

        case "AJUSTES_SOLICITADOS":
            return "status ajustes";

        case "CANCELADA":
            return "status cancelada";

        case "RASCUNHO":
            return "status rascunho";

        default:
            return "status rascunho";
    }
}

function Dashboard() {

    const navigate = useNavigate();

    const [viagens, setViagens] =
        useState([]);

    const [carregando, setCarregando] =
        useState(true);

    const [erro, setErro] =
        useState("");


    useEffect(() => {

        async function carregarViagens() {

            try {

                setCarregando(true);
                setErro("");

                const resposta =
                    await listarViagens();

                setViagens(
                    resposta || []
                );

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
     * As despesas ainda não estão disponíveis
     * no ViagemResponse do backend.
     *
     * Por isso, estes indicadores permanecem
     * zerados até implementarmos o módulo
     * de despesas no backend.
     */

    const totalGasto = 0;

    const custoMedio = 0;

    const destinoMaisVisitado =
        viagens.length > 0
            ? (() => {

                const contagem =
                    new Map();

                viagens.forEach(
                    (viagem) => {

                        const destino =
                            viagem.destino;

                        const atual =
                            contagem.get(
                                destino
                            ) || 0;

                        contagem.set(
                            destino,
                            atual + 1
                        );
                    }
                );

                return [
                    ...contagem.entries()
                ]
                    .map(
                        ([
                            destino,
                            quantidade
                        ]) => ({
                            destino,
                            quantidade
                        })
                    )
                    .sort(
                        (a, b) =>
                            b.quantidade -
                            a.quantidade
                    )[0] || null;

            })()
            : null;


    /*
     * Ainda não temos despesas vindas
     * do backend.
     */
    const gastosPorTipo = [];

    const gastosPorDestino = [];

    const maioresGastos = [];


    /*
     * Dados do gráfico de rosca.
     */

    const baseCalculo =
        Math.max(
            quantidadeTotal,
            1
        );


    const percentuais = {

        aprovadas:
            (quantidadeAprovadas /
                baseCalculo) *
            100,

        analise:
            (quantidadeAnalise /
                baseCalculo) *
            100,

        rejeitadas:
            (quantidadeRejeitadas /
                baseCalculo) *
            100
    };


    const quantidadeRascunhos =
        Math.max(
            quantidadeTotal -
                quantidadeAprovadas -
                quantidadeAnalise -
                quantidadeRejeitadas,
            0
        );


    percentuais.rascunhos =
        (quantidadeRascunhos /
            baseCalculo) *
        100;


    const CORES = {

        aprovadas:
            "#7c8b63",

        analise:
            "#d9a45b",

        rejeitadas:
            "#b96a6a",

        rascunhos:
            "#b9bdb0"
    };


    const gradienteRosca = [

        `${CORES.aprovadas} 0 ${percentuais.aprovadas}%`,

        `${CORES.analise} ${percentuais.aprovadas}% ${percentuais.aprovadas + percentuais.analise}%`,

        `${CORES.rejeitadas} ${percentuais.aprovadas + percentuais.analise}% ${percentuais.aprovadas + percentuais.analise + percentuais.rejeitadas}%`,

        `${CORES.rascunhos} ${percentuais.aprovadas + percentuais.analise + percentuais.rejeitadas}% 100%`

    ].join(", ");


    const maximoTipo =
        Math.max(
            ...gastosPorTipo.map(
                (item) =>
                    item.total
            ),
            1
        );


    const maximoDestino =
        Math.max(
            ...gastosPorDestino.map(
                (item) =>
                    item.total
            ),
            1
        );


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
                                    Carregando dashboard...
                                </h3>

                                <p>
                                    Aguarde enquanto
                                    buscamos os dados
                                    das viagens.
                                </p>

                            </div>

                        </section>

                    </main>

                </div>

            </div>
        );
    }


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
                                    Não foi possível
                                    carregar o dashboard
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
                                PAINEL GERENCIAL
                            </span>

                            <h2>
                                Dashboard de viagens
                            </h2>

                            <p>
                                Visão consolidada das
                                viagens corporativas
                                e dos gastos registrados.
                            </p>

                        </div>

                    </section>


                    {/* ===============================
                        INDICADORES
                    =============================== */}

                    <section className="cards indicadores-dashboard">


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


                        <div className="summary-card">

                            <div className="summary-icon green">
                                ✓
                            </div>

                            <div>

                                <strong>
                                    {quantidadeAprovadas}
                                </strong>

                                <span>
                                    Viagens aprovadas
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
                                    Viagens rejeitadas
                                </span>

                            </div>

                        </div>


                        <div className="summary-card">

                            <div className="summary-icon orange">
                                R$
                            </div>

                            <div>

                                <strong className="valor-indicador">
                                    {formatarMoeda(
                                        totalGasto
                                    )}
                                </strong>

                                <span>
                                    Valor total gasto
                                </span>

                            </div>

                        </div>


                        <div className="summary-card">

                            <div className="summary-icon olive">
                                Ø
                            </div>

                            <div>

                                <strong className="valor-indicador">
                                    {formatarMoeda(
                                        custoMedio
                                    )}
                                </strong>

                                <span>
                                    Custo médio por viagem
                                </span>

                            </div>

                        </div>


                        <div className="summary-card">

                            <div className="summary-icon green">
                                ✈
                            </div>

                            <div>

                                <strong className="destino-indicador">

                                    {destinoMaisVisitado
                                        ? destinoMaisVisitado.destino
                                        : "-"}

                                </strong>

                                <span>

                                    {destinoMaisVisitado

                                        ? `Destino mais visitado (${destinoMaisVisitado.quantidade}x)`

                                        : "Destino mais visitado"}

                                </span>

                            </div>

                        </div>

                    </section>


                    {/* ===============================
                        GRÁFICOS
                    =============================== */}

                    <section className="dashboard-grid">


                        {/* ---- Rosca: situação ---- */}

                        <div className="grafico-card">

                            <div className="grafico-titulo">

                                <h3>
                                    Viagens por situação
                                </h3>

                                <p>
                                    Distribuição das
                                    viagens cadastradas.
                                </p>

                            </div>


                            <div className="grafico-corpo">

                                <div
                                    className="rosca"
                                    style={{
                                        background:
                                            `conic-gradient(${gradienteRosca})`
                                    }}
                                >

                                    <div className="rosca-centro">

                                        <strong>
                                            {quantidadeTotal}
                                        </strong>

                                        <span>
                                            viagens
                                        </span>

                                    </div>

                                </div>


                                <ul className="rosca-legenda">


                                    <li>

                                        <span
                                            className="legenda-cor"
                                            style={{
                                                background:
                                                    CORES.aprovadas
                                            }}
                                        />

                                        Aprovadas

                                        <strong>
                                            {quantidadeAprovadas}
                                        </strong>

                                    </li>


                                    <li>

                                        <span
                                            className="legenda-cor"
                                            style={{
                                                background:
                                                    CORES.analise
                                            }}
                                        />

                                        Em análise

                                        <strong>
                                            {quantidadeAnalise}
                                        </strong>

                                    </li>


                                    <li>

                                        <span
                                            className="legenda-cor"
                                            style={{
                                                background:
                                                    CORES.rejeitadas
                                            }}
                                        />

                                        Rejeitadas

                                        <strong>
                                            {quantidadeRejeitadas}
                                        </strong>

                                    </li>


                                    <li>

                                        <span
                                            className="legenda-cor"
                                            style={{
                                                background:
                                                    CORES.rascunhos
                                            }}
                                        />

                                        Rascunhos

                                        <strong>
                                            {quantidadeRascunhos}
                                        </strong>

                                    </li>

                                </ul>

                            </div>

                        </div>


                        {/* ---- Barras: gastos por tipo ---- */}

                        <div className="grafico-card">

                            <div className="grafico-titulo">

                                <h3>
                                    Gastos por tipo de despesa
                                </h3>

                                <p>
                                    Total registrado em
                                    cada categoria.
                                </p>

                            </div>


                            {gastosPorTipo.length === 0 ? (

                                <div className="empty-state">

                                    <p>
                                        Nenhuma despesa
                                        registrada até o momento.
                                    </p>

                                </div>

                            ) : (

                                <div className="barras-verticais">

                                    {gastosPorTipo.map(
                                        (item) => (

                                            <div
                                                className="barra-coluna"
                                                key={item.nome}
                                            >

                                                <span className="barra-valor">

                                                    {formatarMoeda(
                                                        item.total
                                                    )}

                                                </span>

                                                <div className="barra-area">

                                                    <div
                                                        className="barra-preenchimento"
                                                        style={{
                                                            height:
                                                                `${Math.max(
                                                                    (item.total /
                                                                        maximoTipo) *
                                                                    100,
                                                                    3
                                                                )}%`
                                                        }}
                                                    />

                                                </div>

                                                <span className="barra-rotulo">

                                                    {item.nome}

                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </section>


                    {/* ===============================
                        RANKING DE DESTINOS
                    =============================== */}

                    <section className="section">

                        <div className="section-header">

                            <div>

                                <h3>
                                    Maiores gastos por destino
                                </h3>

                                <p>
                                    Destinos que mais
                                    consumiram recursos.
                                </p>

                            </div>

                        </div>


                        <div className="grafico-card">

                            {gastosPorDestino.length === 0 ? (

                                <div className="empty-state">

                                    <p>
                                        Nenhum gasto
                                        registrado por destino.
                                    </p>

                                </div>

                            ) : (

                                <div className="lista-barras">

                                    {gastosPorDestino.map(
                                        (item) => (

                                            <div
                                                className="item-barra"
                                                key={item.nome}
                                            >

                                                <div className="item-barra-info">

                                                    <strong>
                                                        {item.nome}
                                                    </strong>

                                                    <span>
                                                        {formatarMoeda(
                                                            item.total
                                                        )}
                                                    </span>

                                                </div>


                                                <div className="item-barra-trilho">

                                                    <div
                                                        className="item-barra-preenchimento"
                                                        style={{
                                                            width:
                                                                `${Math.max(
                                                                    (item.total /
                                                                        maximoDestino) *
                                                                    100,
                                                                    3
                                                                )}%`
                                                        }}
                                                    />

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </section>


                    {/* ===============================
                        VIAGENS COM MAIORES GASTOS
                    =============================== */}

                    <section className="section">

                        <div className="section-header">

                            <div>

                                <h3>
                                    Viagens com maiores gastos
                                </h3>

                                <p>
                                    As cinco viagens que
                                    mais geraram despesas.
                                </p>

                            </div>

                        </div>


                        <div className="table-container">

                            {maioresGastos.length === 0 ? (

                                <div className="empty-state">

                                    <h3>
                                        Nenhum gasto registrado
                                    </h3>

                                    <p>
                                        Os gastos aparecerão
                                        aqui após o registro
                                        das despesas.
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
                                                Destino
                                            </th>

                                            <th>
                                                Situação
                                            </th>

                                            <th>
                                                Total de despesas
                                            </th>

                                            <th>
                                                Ação
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {maioresGastos.map(
                                            (viagem) => (

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

                                                        <div className="celula-rota">

                                                            <strong>
                                                                {
                                                                    viagem.destino
                                                                }
                                                            </strong>

                                                            <span>

                                                                de{" "}

                                                                {
                                                                    viagem.origem
                                                                }

                                                            </span>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                obterClasseStatus(
                                                                    viagem.status
                                                                )
                                                            }
                                                        >
                                                            {obterTextoStatus(
                                                                viagem.status
                                                            )}
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <strong>
                                                            {formatarMoeda(
                                                                viagem.total
                                                            )}
                                                        </strong>

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

                                            )
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

export default Dashboard;