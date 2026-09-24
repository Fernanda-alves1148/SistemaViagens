import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar";

import {
    buscarViagemPorId,
    listarHistoricoViagem
} from "../services/viagemService";

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
                texto: status || "Não informado",
                classe: "rascunho"
            };
    }
}


function DetalhesViagem() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [viagem, setViagem] =
        useState(null);

    const [historico, setHistorico] =
        useState([]);

    const [carregando, setCarregando] =
        useState(true);

    const [erro, setErro] =
        useState("");


    /*
     * ==========================================
     * CARREGAR VIAGEM
     * ==========================================
     */

    useEffect(() => {

        async function carregarDados() {

            try {

                setCarregando(true);
                setErro("");

                const dadosViagem =
                    await buscarViagemPorId(id);

                setViagem(dadosViagem);


                /*
                 * O histórico possui um endpoint
                 * separado no backend.
                 */

                try {

                    const dadosHistorico =
                        await listarHistoricoViagem(id);

                    setHistorico(
                        dadosHistorico || []
                    );

                } catch (erroHistorico) {

                    console.error(
                        "Erro ao carregar histórico:",
                        erroHistorico
                    );

                    /*
                     * Se o histórico falhar,
                     * ainda conseguimos mostrar
                     * os dados principais da viagem.
                     */

                    setHistorico([]);

                }

            } catch (error) {

                console.error(
                    "Erro ao carregar viagem:",
                    error
                );

                setErro(
                    error.message ||
                    "Não foi possível carregar a viagem."
                );

                setViagem(null);

            } finally {

                setCarregando(false);

            }

        }

        if (id) {
            carregarDados();
        }

    }, [id]);


    /*
     * ==========================================
     * CARREGANDO
     * ==========================================
     */

    if (carregando) {

        return (

            <div className="app">

                <Navbar />

                <div className="main-area">

                    <Header />

                    <main className="content">

                        <div className="empty-state">

                            <h2>
                                Carregando viagem...
                            </h2>

                            <p>
                                Aguarde enquanto buscamos
                                os dados da viagem.
                            </p>

                        </div>

                    </main>

                </div>

            </div>
        );
    }


    /*
     * ==========================================
     * ERRO
     * ==========================================
     */

    if (erro || !viagem) {

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
                                {erro ||
                                    "A viagem solicitada não foi localizada."}
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


    /*
     * ==========================================
     * STATUS
     * ==========================================
     */

    const status =
        obterStatus(
            viagem.status
        );


    /*
     * ==========================================
     * DESPESAS
     * ==========================================
     *
     * As despesas ainda não fazem parte
     * do ViagemResponse.
     *
     * Essa parte será conectada ao endpoint
     * de despesas quando adaptarmos essa tela.
     */

    const despesas = [];


    const totalDespesas =
        despesas.reduce(
            (total, despesa) =>
                total +
                Number(
                    despesa.valor || 0
                ),
            0
        );


    /*
     * ==========================================
     * PERMISSÕES DA TELA
     * ==========================================
     */

    const podeAlterar =
        viagem.status !== "APROVADA";


    const podeRegistrarDespesas =
        viagem.status === "APROVADA";


    return (

        <div className="app">

            <Navbar />

            <div className="main-area">

                <Header />

                <main className="content">


                    {/* ===============================
                        VOLTAR
                    =============================== */}

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


                    {/* ===============================
                        CABEÇALHO
                    =============================== */}

                    <section className="detail-header">

                        <div>

                            <span className="welcome-small">
                                VIAGEM #
                                {viagem.id}
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


                    {/* ===============================
                        DADOS DA VIAGEM
                    =============================== */}

                    <section className="detail-card">


                        <div className="route-highlight">

                            <div>

                                <span>
                                    ORIGEM
                                </span>

                                <strong>
                                    {viagem.origem}

                                    {viagem.ufOrigem &&
                                        ` - ${viagem.ufOrigem}`}
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

                                    {viagem.ufDestino &&
                                        ` - ${viagem.ufDestino}`}
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

                                    {
                                        viagem.meiosTransporte
                                            ?.join(", ")
                                    }

                                    {!viagem.meiosTransporte?.length &&
                                        "Não informado"}

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


                        {/* ===============================
                            MOTIVO
                        =============================== */}

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


                        {/* ===============================
                            JUSTIFICATIVA
                        =============================== */}

                        {viagem.justificativa && (

                            <div className="justificativa-box">

                                <span>
                                    JUSTIFICATIVA
                                </span>

                                <p>
                                    {viagem.justificativa}
                                </p>

                            </div>

                        )}

                    </section>


                    {/* ===============================
                        HISTÓRICO
                    =============================== */}

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

                                {historico.length === 0 ? (

                                    <div className="empty-state">

                                        <p>
                                            Nenhum histórico
                                            disponível.
                                        </p>

                                    </div>

                                ) : (

                                    historico.map(
                                        (item, index) => (

                                            <div
                                                className="historico-item"
                                                key={
                                                    `${item.status}-${index}`
                                                }
                                            >

                                                <div className="historico-ponto" />

                                                <div className="historico-linha" />

                                                <div className="historico-conteudo">

                                                    <strong>
                                                        {
                                                            item.status
                                                        }
                                                    </strong>

                                                    <span>
                                                        {item.data
                                                            ? formatarData(
                                                                item.data
                                                            )
                                                            : "Data não informada"}
                                                    </span>

                                                    <p>
                                                        {
                                                            item.descricao
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )

                                )}

                            </div>

                        </div>

                    </section>


                    {/* ===============================
                        FINANCEIRO
                    =============================== */}

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