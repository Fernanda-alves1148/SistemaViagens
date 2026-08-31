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

function formatarData(data) {
    const [ano, mes, dia] =
        data.split("-");

    return `${dia}/${mes}/${ano}`;
}

function formatarMoeda(valor) {
    return Number(valor).toLocaleString(
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
                texto: "Aceita",
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

function DetalhesViagem() {

    const {
        id
    } = useParams();

    const navigate =
        useNavigate();

    /*
     * Procuramos primeiro nos rascunhos
     * e depois nas viagens solicitadas.
     */

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

    /*
     * Caso o ID não exista.
     */

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

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/")
                                }
                            >
                                Voltar
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
                    despesa.valor
                ),
            0
        );

    /*
     * Apenas rascunhos podem ser alterados.
     */

    const podeAlterar =
        viagem.status ===
        "EM_RASCUNHO";

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


                    {/* =================================
                        CABEÇALHO
                    ================================= */}

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
                                Detalhes da solicitação
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


                    {/* =================================
                        INFORMAÇÕES PRINCIPAIS
                    ================================= */}

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


                        <div className="info-grid">

                            <div className="info-item">

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


                            <div className="info-item">

                                <span>
                                    TRANSPORTE
                                </span>

                                <strong>
                                    {viagem.transportes.join(
                                        ", "
                                    )}
                                </strong>

                            </div>


                            <div className="info-item">

                                <span>
                                    STATUS
                                </span>

                                <div>

                                    <span
                                        className={`status ${status.classe}`}
                                    >
                                        {status.texto}
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* MOTIVO */}

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


                        {/* JUSTIFICATIVA */}

                        {viagem.justificativa && (

                            <div className="motivo justificativa">

                                <span>
                                    JUSTIFICATIVA DA REJEIÇÃO
                                </span>

                                <p>
                                    {viagem.justificativa}
                                </p>

                            </div>

                        )}

                    </section>


                    {/* =================================
                        DESPESAS
                    ================================= */}

                    <section className="section">

                        <div className="section-header">

                            <div>

                                <h3>
                                    Despesas
                                </h3>

                                <p>
                                    Valores previstos
                                    para esta viagem.
                                </p>

                            </div>


                            {despesas.length > 0 && (

                                <div className="total-despesas">

                                    <span>
                                        Total estimado
                                    </span>

                                    <strong>
                                        {formatarMoeda(
                                            totalDespesas
                                        )}
                                    </strong>

                                </div>

                            )}

                        </div>


                        {despesas.length > 0 ? (

                            <div className="table-container">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Tipo
                                            </th>

                                            <th>
                                                Valor
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {despesas.map(
                                            (despesa) => (

                                                <tr
                                                    key={
                                                        despesa.id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            despesa.tipo
                                                        }
                                                    </td>

                                                    <td>
                                                        {formatarMoeda(
                                                            despesa.valor
                                                        )}
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <div className="empty-state despesas-vazias">

                                <p>
                                    Nenhuma despesa
                                    cadastrada para
                                    esta viagem.
                                </p>

                            </div>

                        )}

                    </section>

                </main>

            </div>

        </div>
    );
}

export default DetalhesViagem;