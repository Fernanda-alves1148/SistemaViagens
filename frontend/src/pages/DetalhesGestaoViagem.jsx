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
    buscarViagemPorId
} from "../services/viagemService";

import "../styles/gestao.css";


function formatarData(data) {

    if (!data) {
        return "-";
    }

    const [ano, mes, dia] =
        data.split("-");

    return `${dia}/${mes}/${ano}`;
}


function formatarDataHora(data) {

    if (!data) {
        return "-";
    }

    return data;
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
            return status || "Não informado";
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


function DetalhesGestaoViagem() {

    const { id } =
        useParams();

    const navigate =
        useNavigate();


    /*
     * Viagem recebida do backend.
     */
    const [viagem, setViagem] =
        useState(null);


    /*
     * Controla a tela de carregamento.
     */
    const [carregando, setCarregando] =
        useState(true);


    /*
     * Guarda possíveis erros da requisição.
     */
    const [erro, setErro] =
        useState("");


    /*
     * Estados relacionados à decisão
     * do gestor.
     */
    const [acao, setAcao] =
        useState(null);

    const [observacao, setObservacao] =
        useState("");

    const [mensagem, setMensagem] =
        useState("");


    /*
     * Busca a viagem real no backend.
     *
     * GET /api/viagens/{id}
     */
    useEffect(() => {

        async function carregarViagem() {

            try {

                setCarregando(true);

                setErro("");

                const dados =
                    await buscarViagemPorId(id);

                setViagem(dados);

            } catch (error) {

                console.error(
                    "Erro ao buscar viagem:",
                    error
                );

                setErro(
                    "Não foi possível carregar a viagem."
                );

            } finally {

                setCarregando(false);

            }
        }

        carregarViagem();

    }, [id]);


    /*
     * Enquanto o backend responde,
     * mostramos uma mensagem de carregamento.
     */
    if (carregando) {

        return (

            <div className="app">

                <Navbar />

                <div className="main-area">

                    <Header />

                    <main className="content">

                        <div className="empty-state">

                            <p>
                                Carregando viagem...
                            </p>

                        </div>

                    </main>

                </div>

            </div>
        );
    }


    /*
     * Caso a requisição tenha falhado
     * ou o backend não tenha encontrado
     * a viagem.
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
                                {erro ||
                                    "Viagem não encontrada"}
                            </h2>

                            <p>
                                A viagem solicitada
                                não foi localizada.
                            </p>

                            <button
                                type="button"
                                className="botao-destaque"
                                onClick={() =>
                                    navigate(
                                        "/gestao"
                                    )
                                }
                            >
                                Voltar para gestão
                            </button>

                        </div>

                    </main>

                </div>

            </div>
        );
    }


    /*
     * Somente viagens solicitadas
     * podem receber uma decisão
     * do gestor.
     */
    const podeDecidir =
        viagem.status === "SOLICITADA";


    /*
     * IMPORTANTE:
     *
     * O ViagemResponse NÃO possui histórico.
     *
     * O histórico será buscado posteriormente
     * pelo endpoint:
     *
     * GET /api/viagens/{id}/historico
     *
     * Por enquanto deixamos vazio.
     */
    const historico = [];


    function iniciarAcao(tipo) {

        setMensagem("");

        setObservacao("");

        setAcao(tipo);
    }


    function cancelarAcao() {

        setAcao(null);

        setObservacao("");

        setMensagem("");
    }


    /*
     * POR ENQUANTO:
     *
     * Esta função ainda não envia a decisão
     * para o backend.
     *
     * O backend exige:
     *
     * idUsuarioResponsavel
     *
     * Ainda precisamos descobrir de onde
     * o frontend obtém o ID do gestor logado.
     */
    function confirmarAcao() {

        if (
            acao === "rejeitar" ||
            acao === "ajustes"
        ) {

            if (!observacao.trim()) {

                setMensagem(
                    acao === "rejeitar"
                        ? "Informe a justificativa da rejeição."
                        : "Informe quais ajustes o colaborador deverá realizar."
                );

                return;
            }
        }


        if (acao === "aprovar") {

            setMensagem(
                "A aprovação será conectada ao backend na próxima etapa."
            );

        } else if (acao === "rejeitar") {

            setMensagem(
                "A rejeição será conectada ao backend na próxima etapa."
            );

        } else if (acao === "ajustes") {

            setMensagem(
                "A solicitação de ajustes será conectada ao backend na próxima etapa."
            );
        }

        setAcao(null);

        setObservacao("");
    }


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
                                navigate(
                                    "/gestao"
                                )
                            }
                        >
                            ← Voltar para gestão
                        </button>

                    </div>


                    {/* ===============================
                        CABEÇALHO
                    =============================== */}

                    <section className="detail-header">

                        <div>

                            <span className="welcome-small">
                                ANÁLISE DE VIAGEM
                            </span>

                            <h2>
                                Viagem #
                                {String(
                                    viagem.id
                                ).padStart(
                                    3,
                                    "0"
                                )}
                            </h2>

                            <p>
                                Revise os dados da
                                solicitação antes de
                                tomar uma decisão.
                            </p>

                        </div>


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

                    </section>


                    {mensagem && (

                        <div className="mensagem-sucesso">

                            {mensagem}

                        </div>

                    )}


                    {/* ===============================
                        SOLICITANTE
                    =============================== */}

                    <section className="detail-card">

                        <div className="section-header">

                            <div>

                                <h3>
                                    Solicitante
                                </h3>

                                <p>
                                    Informações do empregado
                                    no momento da solicitação.
                                </p>

                            </div>

                        </div>


                        <div className="info-grid-viagem">


                            <div className="info-item-viagem">

                                <span>
                                    NOME
                                </span>

                                <strong>
                                    {
                                        viagem.solicitante ||
                                        "Não informado"
                                    }
                                </strong>

                            </div>


                            <div className="info-item-viagem">

                                <span>
                                    MATRÍCULA
                                </span>

                                <strong>
                                    Não informada
                                </strong>

                            </div>


                            <div className="info-item-viagem">

                                <span>
                                    CARGO
                                </span>

                                <strong>
                                    {
                                        viagem.cargoNoMomento ||
                                        "Não informado"
                                    }
                                </strong>

                            </div>


                            <div className="info-item-viagem">

                                <span>
                                    ÁREA
                                </span>

                                <strong>
                                    {
                                        viagem.areaNoMomento ||
                                        "Não informada"
                                    }
                                </strong>

                            </div>

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
                                </strong>

                                <small>
                                    {viagem.ufOrigem
                                        ? `${viagem.ufOrigem} • `
                                        : ""}
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
                                    {viagem.ufDestino
                                        ? `${viagem.ufDestino} • `
                                        : ""}
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
                                        viagem.meiosTransporte?.join(
                                            ", "
                                        ) ||
                                        "Não informado"
                                    }

                                </strong>

                            </div>


                            <div className="info-item-viagem">

                                <span>
                                    SITUAÇÃO
                                </span>

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

                            </div>

                        </div>


                        <div className="motivo">

                            <span>
                                MOTIVO DA VIAGEM
                            </span>

                            <p>
                                {
                                    viagem.motivo ||
                                    "Não informado."
                                }
                            </p>

                        </div>


                        {viagem.justificativa && (

                            <div className="motivo">

                                <span>
                                    JUSTIFICATIVA
                                </span>

                                <p>
                                    {
                                        viagem.justificativa
                                    }
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
                                    Registro das mudanças
                                    de situação.
                                </p>

                            </div>

                        </div>


                        <div className="detail-card">

                            {historico.length === 0 ? (

                                <div className="empty-state">

                                    <p>
                                        Nenhum histórico
                                        disponível.
                                    </p>

                                </div>

                            ) : (

                                <div className="historico">

                                    {historico.map(
                                        (item, index) => (

                                            <div
                                                className="historico-item"
                                                key={
                                                    item.id ||
                                                    index
                                                }
                                            >

                                                <div className="historico-ponto" />

                                                <div className="historico-linha" />

                                                <div className="historico-conteudo">

                                                    <strong>
                                                        {
                                                            obterTextoStatus(
                                                                item.status
                                                            )
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            formatarDataHora(
                                                                item.data
                                                            )
                                                        }
                                                    </span>

                                                    <p>
                                                        Responsável:{" "}
                                                        {
                                                            item.responsavel
                                                        }
                                                    </p>

                                                    {item.observacao && (

                                                        <p>
                                                            {
                                                                item.observacao
                                                            }
                                                        </p>

                                                    )}

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </section>


                    {/* ===============================
                        DECISÃO
                    =============================== */}

                    {podeDecidir && !acao && (

                        <section className="gestao-decisao">

                            <h3>
                                Decisão
                            </h3>

                            <p>
                                Escolha o resultado
                                da análise desta viagem.
                            </p>


                            <div className="decisoes">


                                <button
                                    type="button"
                                    className="botao-cancelar"
                                    onClick={() =>
                                        iniciarAcao(
                                            "rejeitar"
                                        )
                                    }
                                >
                                    Rejeitar
                                </button>


                                <button
                                    type="button"
                                    className="botao-ajustes"
                                    onClick={() =>
                                        iniciarAcao(
                                            "ajustes"
                                        )
                                    }
                                >
                                    Solicitar ajustes
                                </button>


                                <button
                                    type="button"
                                    className="botao-aprovar"
                                    onClick={() =>
                                        iniciarAcao(
                                            "aprovar"
                                        )
                                    }
                                >
                                    Aprovar viagem
                                </button>

                            </div>

                        </section>

                    )}


                    {/* ===============================
                        FORMULÁRIO DA DECISÃO
                    =============================== */}

                    {acao && (

                        <section className="detail-card">


                            <div className="form-section-title">

                                <h3>

                                    {acao === "rejeitar"
                                        ? "Rejeitar viagem"
                                        : acao === "ajustes"
                                            ? "Solicitar ajustes"
                                            : "Aprovar viagem"}

                                </h3>


                                <p>

                                    {acao === "rejeitar"
                                        ? "Informe a justificativa que ficará registrada no histórico."
                                        : acao === "ajustes"
                                            ? "Informe ao colaborador quais informações devem ser corrigidas."
                                            : "Confirme a aprovação desta viagem."}

                                </p>

                            </div>


                            {acao !== "aprovar" && (

                                <textarea
                                    className="campo-textarea-gestao"
                                    rows="6"
                                    placeholder={
                                        acao === "rejeitar"
                                            ? "Digite a justificativa da rejeição..."
                                            : "Descreva os ajustes que precisam ser realizados..."
                                    }
                                    value={
                                        observacao
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setObservacao(
                                            event.target.value
                                        )
                                    }
                                />

                            )}


                            {acao === "aprovar" && (

                                <div className="confirmacao-aprovacao">

                                    <div className="confirmacao-icone">
                                        ✓
                                    </div>

                                    <p>
                                        Ao confirmar,
                                        a viagem será
                                        considerada
                                        aprovada e o
                                        colaborador poderá
                                        registrar suas
                                        despesas.
                                    </p>

                                </div>

                            )}


                            {mensagem && (

                                <p className="mensagem-erro">
                                    {mensagem}
                                </p>

                            )}


                            <div className="form-acoes">


                                <button
                                    type="button"
                                    className="botao-secundario"
                                    onClick={
                                        cancelarAcao
                                    }
                                >
                                    Cancelar
                                </button>


                                <button
                                    type="button"
                                    className={
                                        acao ===
                                        "rejeitar"
                                            ? "botao-cancelar"
                                            : "botao-destaque"
                                    }
                                    onClick={
                                        confirmarAcao
                                    }
                                >

                                    {acao === "rejeitar"
                                        ? "Confirmar rejeição"
                                        : acao === "ajustes"
                                            ? "Enviar para ajustes"
                                            : "Confirmar aprovação"}

                                </button>

                            </div>

                        </section>

                    )}


                    {/* ===============================
                        FLUXO ENCERRADO
                    =============================== */}

                    {!podeDecidir && (

                        <section className="gestao-decisao">

                            <h3>
                                Fluxo encerrado
                            </h3>

                            <p>
                                Esta viagem não está
                                aguardando uma decisão
                                do gestor.
                            </p>

                        </section>

                    )}

                </main>

            </div>

        </div>
    );
}


export default DetalhesGestaoViagem;