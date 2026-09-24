import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar";

import {
    listarViagens,
    excluirViagem
} from "../services/viagemService";

import "../styles/viagens.css";


/*
 * ============================================================
 * FUNÇÕES AUXILIARES
 * ============================================================
 */


/*
 * Formata:
 *
 * 2026-09-30
 *
 * para:
 *
 * 30/09/2026
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
 * O backend trabalha com nomes como:
 *
 * Rascunho
 * Solicitada
 * Ajustes
 * Aprovada
 * Rejeitada
 * Cancelada
 *
 * O frontend utiliza internamente:
 *
 * RASCUNHO
 * SOLICITADA
 * AJUSTES_SOLICITADOS
 * APROVADA
 * REJEITADA
 * CANCELADA
 *
 * Esta função converte os dois formatos.
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
        case "ajustes solicitados":
        case "ajuste":
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
 * Define o texto e a classe visual do status.
 */
function obterStatus(status) {

    const statusNormalizado =
        normalizarStatus(status);

    switch (statusNormalizado) {

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


/*
 * O backend atual possui uma resposta com:
 *
 * meioTransporte
 *
 * Algumas versões do frontend usavam:
 *
 * meiosTransporte
 *
 * Então aceitamos os dois.
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


/*
 * ============================================================
 * COMPONENTE
 * ============================================================
 */

function Rascunhos() {

    const navigate =
        useNavigate();


    /*
     * Filtro atualmente selecionado.
     */
    const [filtro, setFiltro] =
        useState("TODAS");


    /*
     * Viagens vindas do backend.
     */
    const [viagens, setViagens] =
        useState([]);


    /*
     * Controle de carregamento.
     */
    const [carregando, setCarregando] =
        useState(true);


    /*
     * Controle de exclusão.
     */
    const [excluindoId, setExcluindoId] =
        useState(null);


    /*
     * Mensagem de erro.
     */
    const [erro, setErro] =
        useState("");


    /*
     * ========================================================
     * BUSCAR VIAGENS
     * ========================================================
     */

    async function carregarViagens() {

        setCarregando(true);

        setErro("");


        try {

            const resposta =
                await listarViagens();


            /*
             * Garantimos que sempre teremos
             * um array para trabalhar.
             */
            const lista =
                Array.isArray(resposta)
                    ? resposta
                    : [];


            /*
             * Normalizamos os dados para o formato
             * que a interface já utiliza.
             */
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
                "Erro ao carregar viagens:",
                error
            );


            setErro(
                error?.message ||
                "Não foi possível carregar as viagens."
            );


        } finally {

            setCarregando(false);
        }
    }


    /*
     * Ao entrar na página,
     * busca os dados reais.
     */
    useEffect(() => {

        carregarViagens();

    }, []);


    /*
     * ========================================================
     * INDICADORES
     * ========================================================
     */

    const quantidadeRascunhos =
        viagens.filter(
            (viagem) =>
                viagem.status ===
                "RASCUNHO"
        ).length;


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
     * ========================================================
     * EXCLUIR VIAGEM
     * ========================================================
     */

    async function excluirViagemDaLista(
        id,
        event
    ) {

        /*
         * Evita que o clique no botão
         * abra a página da viagem.
         */
        event.stopPropagation();


        const confirmacao =
            window.confirm(
                "Deseja realmente excluir esta viagem?"
            );


        if (!confirmacao) {
            return;
        }


        setExcluindoId(id);

        setErro("");


        try {

            /*
             * Agora a exclusão é feita
             * de verdade no backend.
             */
            await excluirViagem(id);


            /*
             * Removemos a viagem da interface
             * somente depois que o backend confirmou.
             */
            setViagens(
                (viagensAtuais) =>
                    viagensAtuais.filter(
                        (viagem) =>
                            viagem.id !== id
                    )
            );


        } catch (error) {

            console.error(
                "Erro ao excluir viagem:",
                error
            );


            setErro(
                error?.message ||
                "Não foi possível excluir a viagem."
            );


            alert(
                error?.message ||
                "Não foi possível excluir a viagem."
            );


        } finally {

            setExcluindoId(null);
        }
    }


    /*
     * ========================================================
     * FILTRO
     * ========================================================
     */

    const viagensFiltradas =
        filtro === "TODAS"

            ? viagens

            : viagens.filter(
                (viagem) =>
                    viagem.status ===
                    filtro
            );


    /*
     * ========================================================
     * TEXTO DO FILTRO
     * ========================================================
     */

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
                                    MINHAS VIAGENS
                                </span>

                                <h2>
                                    Carregando viagens...
                                </h2>

                                <p>
                                    Buscando suas viagens
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
     * TELA PRINCIPAL
     * ========================================================
     */

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
                        ERRO
                    ============================== */}

                    {erro && (

                        <div className="info-aviso">

                            <strong>
                                Não foi possível concluir a operação.
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



                    {/* ==============================
                        INDICADORES
                    ============================== */}

                    <section className="cards">


                        <div
                            className="summary-card"
                            onClick={() =>
                                setFiltro(
                                    "RASCUNHO"
                                )
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
                                setFiltro(
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
                            className="summary-card"
                            onClick={() =>
                                setFiltro(
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
                            className="summary-card"
                            onClick={() =>
                                setFiltro(
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
                                    setFiltro(
                                        "TODAS"
                                    )
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
                                    setFiltro(
                                        "RASCUNHO"
                                    )
                                }
                            >
                                Rascunhos
                            </button>



                            <button
                                type="button"
                                className={
                                    filtro === "SOLICITADA"
                                        ? "filtro-viagem ativo"
                                        : "filtro-viagem"
                                }
                                onClick={() =>
                                    setFiltro(
                                        "SOLICITADA"
                                    )
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
                                    setFiltro(
                                        "APROVADA"
                                    )
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
                                    setFiltro(
                                        "REJEITADA"
                                    )
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
                                                    "RASCUNHO";


                                                const transportes =
                                                    viagem.transportes ||
                                                    [];


                                                const excluindo =
                                                    excluindoId ===
                                                    viagem.id;


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


                                                                    <span>

                                                                        Viagem #
                                                                        {viagem.id}

                                                                    </span>

                                                                </div>


                                                            </div>

                                                        </td>



                                                        {/* DESTINO */}

                                                        <td>

                                                            {viagem.destino}

                                                            {viagem.ufDestino
                                                                ? ` - ${viagem.ufDestino}`
                                                                : ""
                                                            }

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

                                                            {
                                                                transportes.length > 0

                                                                    ?

                                                                    transportes.join(
                                                                        ", "
                                                                    )

                                                                    :

                                                                    "Não informado"
                                                            }

                                                        </td>



                                                        {/* STATUS */}

                                                        <td>

                                                            <span
                                                                className={
                                                                    `status ${status.classe}`
                                                                }
                                                            >

                                                                {status.texto}

                                                            </span>

                                                        </td>



                                                        {/* AÇÕES */}

                                                        <td>


                                                            {podeExcluir ? (


                                                                <button
                                                                    type="button"
                                                                    className="botao-excluir"
                                                                    title="Excluir viagem"
                                                                    disabled={
                                                                        excluindo
                                                                    }
                                                                    onClick={(
                                                                        event
                                                                    ) =>
                                                                        excluirViagemDaLista(
                                                                            viagem.id,
                                                                            event
                                                                        )
                                                                    }
                                                                >

                                                                    {excluindo
                                                                        ? "..."
                                                                        : "🗑"
                                                                    }

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