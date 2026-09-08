import {
    useNavigate,
    useParams
} from "react-router-dom";

import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar";

import {
    viagensRascunho,
    viagensSolicitadas
} from "../data/viagensMock";

import "../styles/viagens.css";

function formatarData(data) {
    if (!data) {
        return "-";
    }

    const [ano, mes, dia] =
        data.split("-");

    return `${dia}/${mes}/${ano}`;
}

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

function obterStatus(status) {

    switch (status) {

        case "EM_RASCUNHO":
            return {
                texto: "Rascunho",
                classe: "rascunho"
            };

        case "EM_ANALISE":
            return {
                texto: "Em análise",
                classe: "analise"
            };

        case "ACEITA":
            return {
                texto: "Aprovada",
                classe: "aceita"
            };

        case "REJEITADA":
            return {
                texto: "Rejeitada",
                classe: "rejeitada"
            };

        default:
            return {
                texto: status,
                classe: "rascunho"
            };
    }
}

function obterHistorico(viagem) {

    if (viagem.historico?.length) {
        return viagem.historico;
    }

    const historico = [];

    if (viagem.status === "EM_RASCUNHO") {

        historico.push({
            status: "Rascunho",
            data: viagem.dataCriacao || viagem.dataInicio,
            descricao:
                "Viagem criada e salva como rascunho."
        });

    } else {

        historico.push({
            status: "Rascunho",
            data: viagem.dataCriacao || viagem.dataInicio,
            descricao:
                "Viagem criada inicialmente como rascunho."
        });

        historico.push({
            status: "Em análise",
            data: viagem.dataSolicitacao || viagem.dataInicio,
            descricao:
                "Viagem enviada para análise."
        });

        if (viagem.status === "ACEITA") {

            historico.push({
                status: "Aprovada",
                data: viagem.dataAprovacao || viagem.dataFim,
                descricao:
                    "Viagem aprovada pelo gestor."
            });

        }

        if (viagem.status === "REJEITADA") {

            historico.push({
                status: "Rejeitada",
                data: viagem.dataRejeicao || viagem.dataFim,
                descricao:
                    viagem.justificativa ||
                    "Viagem rejeitada pelo gestor."
            });

        }
    }

    return historico;
}

function DetalhesViagem() {

    const { id } = useParams();

    const navigate = useNavigate();

    const viagemRascunho =
        viagensRascunho.find(
            (item) =>
                item.id === Number(id)
        );

    const viagemSolicitada =
        viagensSolicitadas.find(
            (item) =>
                item.id === Number(id)
        );

    const viagem =
        viagemRascunho ||
        viagemSolicitada;

    if (!viagem) {

        return (

            <div className="app">

                <Navbar />

                <div className="main-area">

                    <Header />

                    <main className="content">

                        <div className="empty-state">

                            <h2>
                                Viagem não encontrada
                            </h2>

                            <p>
                                A viagem solicitada
                                não foi localizada.
                            </p>

                            <button
                                type="button"
                                className="botao-destaque"
                                onClick={() =>
                                    navigate("/")
                                }
                            >
                                Voltar para minhas viagens
                            </button>

                        </div>

                    </main>

                </div>

            </div>
        );
    }

    const status =
        obterStatus(
            viagem.status
        );

    const despesas =
        viagem.despesas || [];

    const totalDespesas =
        despesas.reduce(
            (total, despesa) =>
                total +
                Number(
                    despesa.valor || 0
                ),
            0
        );

    const podeAlterar =
        viagem.status !== "ACEITA";

    const podeRegistrarDespesas =
        viagem.status === "ACEITA";

    const historico =
        obterHistorico(viagem);

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


                    {/* CABEÇALHO */}

                    <section className="detail-header">

                        <div>

                            <span className="welcome-small">
                                VIAGEM #{viagem.id}
                            </span>

                            <h2>
                                {viagem.origem}
                                {" → "}
                                {viagem.destino}
                            </h2>

                            <p>
                                Acompanhe os dados,
                                situação e histórico
                                da viagem.
                            </p>

                        </div>


                        <div className="detail-actions">

                            <span
                                className={`status ${status.classe}`}
                            >
                                {status.texto}
                            </span>

                            {podeAlterar && (

                                <button
                                    type="button"
                                    className="botao-destaque"
                                    onClick={() =>
                                        navigate(
                                            `/nova-viagem?editar=${viagem.id}`
                                        )
                                    }
                                >
                                    ✎ Alterar viagem
                                </button>

                            )}

                        </div>

                    </section>


                    {/* DADOS */}

                    <section className="detail-card">

                        <div className="route-highlight">

                            <div>

                                <span>
                                    ORIGEM
                                </span>

                                <strong>
                                    {viagem.origem}
                                </strong>

                                <small>
                                    {formatarData(
                                        viagem.dataInicio
                                    )}
                                </small>

                            </div>


                            <div className="route-arrow">
                                →
                            </div>


                            <div>

                                <span>
                                    DESTINO
                                </span>

                                <strong>
                                    {viagem.destino}
                                </strong>

                                <small>
                                    {formatarData(
                                        viagem.dataFim
                                    )}
                                </small>

                            </div>

                        </div>


                        <div className="info-grid-viagem">

                            <div className="info-item-viagem">

                                <span>
                                    PERÍODO
                                </span>

                                <strong>
                                    {formatarData(
                                        viagem.dataInicio
                                    )}
                                    {" – "}
                                    {formatarData(
                                        viagem.dataFim
                                    )}
                                </strong>

                            </div>


                            <div className="info-item-viagem">

                                <span>
                                    TRANSPORTE
                                </span>

                                <strong>
                                    {viagem.transportes?.join(
                                        ", "
                                    ) || "Não informado"}
                                </strong>

                            </div>


                            <div className="info-item-viagem">

                                <span>
                                    SITUAÇÃO
                                </span>

                                <strong>
                                    {status.texto}
                                </strong>

                            </div>

                        </div>


                        {viagem.motivo && (

                            <div className="motivo">

                                <span>
                                    MOTIVO DA VIAGEM
                                </span>

                                <p>
                                    {viagem.motivo}
                                </p>

                            </div>

                        )}


                        {viagem.justificativa && (

                            <div className="justificativa-box">

                                <span>
                                    JUSTIFICATIVA DA REJEIÇÃO
                                </span>

                                <p>
                                    {viagem.justificativa}
                                </p>

                            </div>

                        )}

                    </section>


                    {/* HISTÓRICO */}

                    <section className="section">

                        <div className="section-header">

                            <div>

                                <h3>
                                    Histórico da viagem
                                </h3>

                                <p>
                                    Acompanhe todas as
                                    mudanças de situação.
                                </p>

                            </div>

                        </div>


                        <div className="detail-card">

                            <div className="historico">

                                {historico.map(
                                    (item, index) => (

                                        <div
                                            className="historico-item"
                                            key={`${item.status}-${index}`}
                                        >

                                            <div className="historico-ponto" />

                                            <div className="historico-linha" />

                                            <div className="historico-conteudo">

                                                <strong>
                                                    {item.status}
                                                </strong>

                                                <span>
                                                    {item.data
                                                        ? formatarData(item.data)
                                                        : "Data não informada"}
                                                </span>

                                                <p>
                                                    {item.descricao}
                                                </p>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    </section>


                    {/* FINANCEIRO */}

                    <section className="section">

                        <div className="section-header">

                            <div>

                                <h3>
                                    Resumo financeiro
                                </h3>

                                <p>
                                    Acompanhe os gastos
                                    relacionados à viagem.
                                </p>

                            </div>

                        </div>


                        <div className="detail-card">

                            <div className="resumo-financeiro">

                                <span>
                                    Total gasto
                                </span>

                                <strong>
                                    {formatarMoeda(
                                        totalDespesas
                                    )}
                                </strong>

                            </div>


                            {podeRegistrarDespesas ? (

                                <button
                                    type="button"
                                    className="botao-destaque"
                                    onClick={() =>
                                        navigate(
                                            `/viagem/${viagem.id}/despesas`
                                        )
                                    }
                                >
                                    + Registrar despesas
                                </button>

                            ) : (

                                <p className="texto-ajuda">
                                    As despesas poderão ser
                                    registradas somente após
                                    a aprovação da viagem.
                                </p>

                            )}

                        </div>

                    </section>

                </main>

            </div>

        </div>
    );
}

export default DetalhesViagem;