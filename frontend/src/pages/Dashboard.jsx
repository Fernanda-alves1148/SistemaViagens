import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import NavbarGestao from "../components/NavbarGestao.jsx";

import {
    viagensRascunho,
    viagensSolicitadas
} from "../data/viagensMock";

import "../styles/dashboard.css";

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

/*
 * Os mocks atuais usam dois padrões de status
 * (ex.: "ACEITA" nas telas do colaborador e
 * "APROVADA" nas telas de gestão).
 *
 * Normalizamos aqui para calcular os indicadores.
 * Quando o backend estiver pronto, convém unificar
 * o enum de status e remover esta função.
 */
function normalizarStatus(status) {

    switch (status) {

        case "EM_RASCUNHO":
        case "RASCUNHO":
            return "RASCUNHO";

        case "EM_ANALISE":
        case "SOLICITADA":
            return "SOLICITADA";

        case "ACEITA":
        case "APROVADA":
            return "APROVADA";

        case "REJEITADA":
            return "REJEITADA";

        case "CANCELADA":
            return "CANCELADA";

        default:
            return "RASCUNHO";
    }
}

function somarDespesas(despesas) {
    return (despesas || []).reduce(
        (total, despesa) =>
            total +
            Number(despesa.valor || 0),
        0
    );
}

function agruparSomar(itens, chave) {

    const mapa = new Map();

    itens.forEach((item) => {
        const nome = item[chave];
        const atual = mapa.get(nome) || 0;
        mapa.set(
            nome,
            atual + Number(item.valor || 0)
        );
    });

    return [...mapa.entries()]
        .map(([nome, total]) => ({
            nome,
            total
        }))
        .sort((a, b) => b.total - a.total);
}

function Dashboard() {

    const navigate = useNavigate();

    /*
     * Enquanto o backend não estiver conectado,
     * calculamos os indicadores a partir dos mocks.
     * Depois, basta trocar por buscarIndicadores()
     * do services/viagensService.
     */
    const indicadores = useMemo(() => {

        const viagens = [
            ...viagensRascunho,
            ...viagensSolicitadas
        ].map((viagem) => ({
            ...viagem,
            status: normalizarStatus(
                viagem.status
            )
        }));

        const despesas = viagens.flatMap(
            (viagem) =>
                (viagem.despesas || []).map(
                    (despesa) => ({
                        ...despesa,
                        viagemId: viagem.id,
                        destino: viagem.destino
                    })
                )
        );

        const totalGasto = despesas.reduce(
            (total, despesa) =>
                total +
                Number(despesa.valor || 0),
            0
        );

        const viagensComDespesa =
            viagens.filter(
                (viagem) =>
                    (viagem.despesas || [])
                        .length > 0
            );

        const custoMedio =
            viagensComDespesa.length > 0
                ? totalGasto /
                  viagensComDespesa.length
                : 0;

        const contagemDestinos =
            new Map();

        viagens.forEach((viagem) => {
            const atual =
                contagemDestinos.get(
                    viagem.destino
                ) || 0;

            contagemDestinos.set(
                viagem.destino,
                atual + 1
            );
        });

        const rankingDestinos = [
            ...contagemDestinos.entries()
        ]
            .map(([destino, quantidade]) => ({
                destino,
                quantidade
            }))
            .sort(
                (a, b) =>
                    b.quantidade - a.quantidade
            );

        const maioresGastos = viagens
            .map((viagem) => ({
                ...viagem,
                total: somarDespesas(
                    viagem.despesas
                )
            }))
            .filter(
                (viagem) => viagem.total > 0
            )
            .sort(
                (a, b) => b.total - a.total
            )
            .slice(0, 5);

        return {
            quantidadeTotal: viagens.length,
            quantidadeAnalise:
                viagens.filter(
                    (v) =>
                        v.status ===
                        "SOLICITADA"
                ).length,
            quantidadeAprovadas:
                viagens.filter(
                    (v) =>
                        v.status ===
                        "APROVADA"
                ).length,
            quantidadeRejeitadas:
                viagens.filter(
                    (v) =>
                        v.status ===
                        "REJEITADA"
                ).length,
            totalGasto,
            custoMedio,
            destinoMaisVisitado:
                rankingDestinos[0] || null,
            rankingDestinos,
            gastosPorTipo: agruparSomar(
                despesas,
                "tipo"
            ),
            gastosPorDestino: agruparSomar(
                despesas,
                "destino"
            ).slice(0, 5),
            maioresGastos
        };
    }, []);

    const {
        quantidadeTotal,
        quantidadeAnalise,
        quantidadeAprovadas,
        quantidadeRejeitadas,
        totalGasto,
        custoMedio,
        destinoMaisVisitado,
        gastosPorTipo,
        gastosPorDestino,
        maioresGastos
    } = indicadores;

    /*
     * Dados do gráfico de rosca (situação).
     */
    const baseCalculo =
        Math.max(quantidadeTotal, 1);

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

    percentuais.rascunhos = Math.max(
        100 -
            percentuais.aprovadas -
            percentuais.analise -
            percentuais.rejeitadas,
        0
    );

    const CORES = {
        aprovadas: "#7c8b63",
        analise: "#d9a45b",
        rejeitadas: "#b96a6a",
        rascunhos: "#b9bdb0"
    };

    const gradienteRosca = [
        `${CORES.aprovadas} 0 ${percentuais.aprovadas}%`,
        `${CORES.analise} ${percentuais.aprovadas}% ${percentuais.aprovadas + percentuais.analise}%`,
        `${CORES.rejeitadas} ${percentuais.aprovadas + percentuais.analise}% ${percentuais.aprovadas + percentuais.analise + percentuais.rejeitadas}%`,
        `${CORES.rascunhos} ${percentuais.aprovadas + percentuais.analise + percentuais.rejeitadas}% 100%`
    ].join(", ");

    const maximoTipo = Math.max(
        ...gastosPorTipo.map(
            (item) => item.total
        ),
        1
    );

    const maximoDestino = Math.max(
        ...gastosPorDestino.map(
            (item) => item.total
        ),
        1
    );

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
                                        background: `conic-gradient(${gradienteRosca})`
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
                                            {Math.max(
                                                quantidadeTotal -
                                                    quantidadeAprovadas -
                                                    quantidadeAnalise -
                                                    quantidadeRejeitadas,
                                                0
                                            )}
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
                                                            height: `${Math.max(
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
                                                            width: `${Math.max(
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
                                                    key={viagem.id}
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
                                                            className={`status ${viagem.status === "APROVADA"
                                                                ? "aceita"
                                                                : viagem.status === "REJEITADA"
                                                                    ? "rejeitada"
                                                                    : viagem.status === "SOLICITADA"
                                                                        ? "analise"
                                                                        : "rascunho"
                                                                }`}
                                                        >
                                                            {
                                                                viagem.status ===
                                                                "APROVADA"
                                                                    ? "Aprovada"
                                                                    : viagem.status ===
                                                                        "REJEITADA"
                                                                        ? "Rejeitada"
                                                                        : viagem.status ===
                                                                            "SOLICITADA"
                                                                            ? "Em análise"
                                                                            : "Rascunho"
                                                            }
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