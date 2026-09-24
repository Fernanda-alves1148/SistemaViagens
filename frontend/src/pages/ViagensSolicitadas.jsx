import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";

import {
    listarViagens
} from "../services/viagemService";

import "../styles/viagens.css";


/*
 * ============================================================
 * FUNÇÕES AUXILIARES
 * ============================================================
 */

function formatarData(data) {

    if (!data) {
        return "-";
    }

    const partes =
        String(data).split("-");

    if (partes.length !== 3) {
        return data;
    }

    const [
        ano,
        mes,
        dia
    ] = partes;

    return `${dia}/${mes}/${ano}`;
}


/*
 * O banco/backend trabalha com:
 *
 * Rascunho
 * Solicitada
 * Ajustes
 * Aprovada
 * Rejeitada
 * Cancelada
 *
 * O frontend usa nomes padronizados.
 */
function normalizarStatus(status) {

    if (!status) {
        return "";
    }

    const valor =
        String(status)
            .trim()
            .toLowerCase();

    switch (valor) {

        case "rascunho":
            return "RASCUNHO";

        case "solicitada":
            return "SOLICITADA";

        case "ajustes":
        case "ajuste":
        case "ajustes solicitados":
            return "AJUSTES_SOLICITADOS";

        case "aprovada":
            return "APROVADA";

        case "rejeitada":
            return "REJEITADA";

        case "cancelada":
            return "CANCELADA";

        default:
            return String(status).toUpperCase();
    }
}


/*
 * O backend atual usa "meioTransporte".
 *
 * Mantemos compatibilidade com versões que possam
 * retornar "meiosTransporte".
 */
function obterTransportes(viagem) {

    if (
        Array.isArray(
            viagem.meiosTransporte
        )
        &&
        viagem.meiosTransporte.length > 0
    ) {

        return viagem.meiosTransporte;
    }


    if (viagem.meioTransporte) {

        return [
            viagem.meioTransporte
        ];
    }


    return [];
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

        default:
            return "status rascunho";
    }
}


function obterTextoStatus(status) {

    switch (status) {

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

        case "RASCUNHO":
            return "Rascunho";

        default:
            return status || "Não informado";
    }
}


/*
 * ============================================================
 * COMPONENTE
 * ============================================================
 */

function ViagensSolicitadas() {

    const navigate =
        useNavigate();


    /*
     * Lista real vinda do backend.
     */
    const [viagens, setViagens] =
        useState([]);


    /*
     * Modal da justificativa.
     */
    const [
        justificativaSelecionada,
        setJustificativaSelecionada
    ] = useState(null);


    /*
     * Controle de carregamento.
     */
    const [carregando, setCarregando] =
        useState(true);


    /*
     * Erro de comunicação com a API.
     */
    const [erro, setErro] =
        useState("");


    /*
     * ========================================================
     * CARREGAR VIAGENS
     * ========================================================
     */

    async function carregarViagens() {

        setCarregando(true);

        setErro("");


        try {

            const resposta =
                await listarViagens();


            const lista =
                Array.isArray(resposta)
                    ? resposta
                    : [];


            const viagensNormalizadas =
                lista.map(
                    (viagem) => ({

                        ...viagem,

                        status:
                            normalizarStatus(
                                viagem.status
                            ),

                        transportes:
                            obterTransportes(
                                viagem
                            )

                    })
                );


            setViagens(
                viagensNormalizadas
            );


        } catch (error) {

            console.error(
                "Erro ao carregar solicitações:",
                error
            );


            setErro(
                error?.message ||
                "Não foi possível carregar as solicitações."
            );


        } finally {

            setCarregando(false);
        }
    }


    /*
     * Executa quando a tela abre.
     */
    useEffect(() => {

        carregarViagens();

    }, []);


    /*
     * ========================================================
     * SEPARAÇÃO DAS VIAGENS
     * ========================================================
     *
     * Em análise:
     *
     * SOLICITADA
     *
     * Histórico:
     *
     * qualquer viagem que já tenha saído de
     * SOLICITADA e não seja RASCUNHO.
     *
     * Assim incluímos:
     *
     * APROVADA
     * REJEITADA
     * AJUSTES_SOLICITADOS
     * CANCELADA
     */

    const viagensEmAnalise =
        viagens.filter(
            (viagem) =>
                viagem.status ===
                "SOLICITADA"
        );


    const outrasSolicitacoes =
        viagens.filter(
            (viagem) =>
                viagem.status !==
                "SOLICITADA"
                &&
                viagem.status !==
                "RASCUNHO"
        );


    /*
     * ========================================================
     * MODAL DE JUSTIFICATIVA
     * ========================================================
     */

    function abrirJustificativa(
        viagem,
        event
    ) {

        event.stopPropagation();


        setJustificativaSelecionada(
            viagem.justificativa ||
            "Nenhuma justificativa informada."
        );
    }


    /*
     * ========================================================
     * CARREGAMENTO
     * ========================================================
     */

    if (carregando) {

        return (
            <div className="app">

                <Navbar />

                <div className="main-area">

                    <Header />

                    <main className="content">

                        <section className="welcome">

                            <div>

                                <span className="welcome-small">
                                    SOLICITAÇÕES
                                </span>

                                <h2>
                                    Carregando solicitações...
                                </h2>

                                <p>
                                    Buscando as viagens
                                    no servidor.
                                </p>

                            </div>

                        </section>

                    </main>

                </div>

            </div>
        );
    }


    /*
     * ========================================================
     * TELA
     * ========================================================
     */

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
                                navigate("/")
                            }
                        >
                            ← Minhas viagens
                        </button>

                    </div>


                    <section className="welcome">

                        <div>

                            <span className="welcome-small">
                                SOLICITAÇÕES
                            </span>

                            <h2>
                                Viagens em análise
                            </h2>

                            <p>
                                Acompanhe as viagens
                                enviadas para aprovação.
                            </p>

                        </div>

                    </section>


                    {/* =================================================
                        ERRO
                    ================================================= */}

                    {erro && (

                        <div className="info-aviso">

                            <strong>
                                Não foi possível carregar as viagens.
                            </strong>

                            <p>
                                {erro}
                            </p>

                            <button
                                type="button"
                                className="botao-secundario"
                                onClick={
                                    carregarViagens
                                }
                            >
                                Tentar novamente
                            </button>

                        </div>

                    )}


                    {/* =================================================
                        EM ANÁLISE
                    ================================================= */}

                    <section className="section">

                        <div className="section-header">

                            <div>

                                <h3>
                                    Em análise
                                </h3>

                                <p>
                                    Solicitações aguardando
                                    avaliação do gestor.
                                </p>

                            </div>

                            <span className="contador-secundario">
                                {viagensEmAnalise.length}
                            </span>

                        </div>


                        <div className="table-container">

                            {viagensEmAnalise.length === 0 ? (

                                <div className="empty-state">

                                    <h3>
                                        Nenhuma viagem em análise
                                    </h3>

                                    <p>
                                        No momento não existem
                                        solicitações aguardando
                                        aprovação.
                                    </p>

                                </div>

                            ) : (

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Viagem
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

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {viagensEmAnalise.map(
                                            (viagem) => (

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

                                                    {/* VIAGEM */}

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


                                                    {/* PERÍODO */}

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


                                                    {/* TRANSPORTE */}

                                                    <td>

                                                        {viagem.transportes?.join(
                                                            ", "
                                                        )
                                                            ||
                                                            "Não informado"
                                                        }

                                                    </td>


                                                    {/* STATUS */}

                                                    <td>

                                                        <span className="status analise">

                                                            Em análise

                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            )}

                        </div>

                    </section>


                    {/* =================================================
                        HISTÓRICO
                    ================================================= */}

                    <section className="section">

                        <div className="section-header">

                            <div>

                                <h3>
                                    Histórico das solicitações
                                </h3>

                                <p>
                                    Viagens que já receberam
                                    uma decisão ou passaram
                                    por outra etapa do fluxo.
                                </p>

                            </div>

                        </div>


                        <div className="table-container">

                            {outrasSolicitacoes.length === 0 ? (

                                <div className="empty-state">

                                    <p>
                                        Nenhuma solicitação
                                        finalizada.
                                    </p>

                                </div>

                            ) : (

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Viagem
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

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {outrasSolicitacoes.map(
                                            (viagem) => {

                                                const classeStatus =
                                                    obterClasseStatus(
                                                        viagem.status
                                                    );

                                                const textoStatus =
                                                    obterTextoStatus(
                                                        viagem.status
                                                    );


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

                                                        {/* VIAGEM */}

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

                                                                    <span className="texto-suave">

                                                                        Viagem #
                                                                        {viagem.id}

                                                                    </span>

                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* PERÍODO */}

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


                                                        {/* TRANSPORTE */}

                                                        <td>

                                                            {viagem.transportes?.join(
                                                                ", "
                                                            )
                                                                ||
                                                                "Não informado"
                                                            }

                                                        </td>


                                                        {/* SITUAÇÃO */}

                                                        <td>


                                                            {viagem.status ===
                                                            "REJEITADA" ? (


                                                                <button
                                                                    type="button"
                                                                    className={`${classeStatus} status-button`}
                                                                    onClick={(
                                                                        event
                                                                    ) =>
                                                                        abrirJustificativa(
                                                                            viagem,
                                                                            event
                                                                        )
                                                                    }
                                                                >

                                                                    {textoStatus}

                                                                </button>


                                                            ) : (


                                                                <span
                                                                    className={
                                                                        classeStatus
                                                                    }
                                                                >

                                                                    {textoStatus}

                                                                </span>

                                                            )}


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


            {/* =====================================================
                MODAL DE REJEIÇÃO
            ===================================================== */}

            {justificativaSelecionada && (

                <Modal

                    titulo="Justificativa da rejeição"

                    onClose={() =>
                        setJustificativaSelecionada(
                            null
                        )
                    }

                >

                    <p>
                        {justificativaSelecionada}
                    </p>

                </Modal>

            )}

        </div>
    );
}


export default ViagensSolicitadas;