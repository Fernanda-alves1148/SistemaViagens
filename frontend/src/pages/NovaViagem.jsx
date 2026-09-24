import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar";

import {
    criarViagem,
    buscarViagemPorId,
    atualizarViagem,
    solicitarViagem
} from "../services/viagemService";

import "../styles/viagens.css";


/*
 * ============================================================
 * CADASTROS EXISTENTES NO BANCO
 * ============================================================
 *
 * Como o backend atualmente recebe os IDs desses cadastros,
 * usamos aqui os mesmos IDs criados pelo seu SQL.
 */

const CIDADES = [
    {
        id: 1,
        nome: "Foz do Iguaçu",
        uf: "PR"
    },
    {
        id: 2,
        nome: "Curitiba",
        uf: "PR"
    },
    {
        id: 3,
        nome: "Joinville",
        uf: "SC"
    },
    {
        id: 4,
        nome: "Guarulhos",
        uf: "SP"
    },
    {
        id: 5,
        nome: "São Paulo",
        uf: "SP"
    }
];


const MEIOS_TRANSPORTE = [
    {
        id: 1,
        nome: "Avião"
    },
    {
        id: 2,
        nome: "Carro"
    },
    {
        id: 3,
        nome: "Ônibus"
    },
    {
        id: 4,
        nome: "Trem"
    }
];


const MOTIVOS = [
    {
        id: 1,
        nome: "Reunião com Clientes"
    },
    {
        id: 2,
        nome: "Treinamento"
    },
    {
        id: 3,
        nome: "Evento"
    },
    {
        id: 4,
        nome: "Congresso"
    },
    {
        id: 5,
        nome: "Visita Técnica"
    }
];


/*
 * ============================================================
 * USUÁRIOS DE TESTE
 * ============================================================
 *
 * Seu banco possui estes usuários de exemplo.
 *
 * Caso o login do frontend ainda não esteja fornecendo
 * o id_usuario, usamos esta tabela apenas como fallback.
 *
 * Quando o sistema de login estiver pronto, o localStorage
 * terá prioridade.
 */

const USUARIOS_TESTE = {
    "0001-1": {
        idUsuario: 1,
        nome: "WILLIAN SILVA"
    },

    "0002-2": {
        idUsuario: 2,
        nome: "ANA PAULA DIAS"
    },

    "0003-3": {
        idUsuario: 3,
        nome: "JOÃO MENEZES"
    },

    "0004-4": {
        idUsuario: 4,
        nome: "MARIA COSTA"
    },

    "0005-5": {
        idUsuario: 5,
        nome: "CARLOS OLIVEIRA"
    }
};


/*
 * Matrícula usada quando ainda não existe
 * informação do usuário no localStorage.
 *
 * Estou deixando ANA como padrão porque ela é
 * um usuário colaborador no banco de exemplo.
 *
 * Depois, quando o login estiver funcionando,
 * essa parte deixa de ser necessária.
 */
const MATRICULA_PADRAO = "0002-2";


/*
 * ============================================================
 * FUNÇÕES AUXILIARES
 * ============================================================
 */

function obterUsuarioSalvo() {

    const chavesPossiveis = [
        "usuario",
        "usuarioLogado",
        "user"
    ];

    for (const chave of chavesPossiveis) {

        const valor =
            localStorage.getItem(chave);

        if (!valor) {
            continue;
        }

        try {

            const usuario =
                JSON.parse(valor);

            if (usuario && typeof usuario === "object") {
                return usuario;
            }

        } catch {
            /*
             * Não é JSON.
             * Continuamos procurando.
             */
        }
    }

    return null;
}


function obterMatriculaInicial() {

    const usuarioSalvo =
        obterUsuarioSalvo();

    if (usuarioSalvo) {

        const matricula =
            usuarioSalvo.matricula ||
            usuarioSalvo.matriculaUsuario ||
            usuarioSalvo.matriculaEmpregado ||
            usuarioSalvo.empregado?.matricula;

        if (matricula) {
            return matricula;
        }
    }


    const chavesMatricula = [
        "matricula",
        "matriculaUsuario",
        "matriculaEmpregado"
    ];

    for (const chave of chavesMatricula) {

        const valor =
            localStorage.getItem(chave);

        if (valor) {
            return valor;
        }
    }


    return MATRICULA_PADRAO;
}


function obterIdUsuarioResponsavel(
    matricula
) {

    const usuarioSalvo =
        obterUsuarioSalvo();

    if (usuarioSalvo) {

        const idSalvo =
            usuarioSalvo.idUsuario ??
            usuarioSalvo.id_usuario ??
            usuarioSalvo.id;

        const idNumerico =
            Number(idSalvo);

        if (
            Number.isInteger(idNumerico) &&
            idNumerico > 0
        ) {
            return idNumerico;
        }
    }


    const usuario =
        USUARIOS_TESTE[matricula];

    if (usuario) {
        return usuario.idUsuario;
    }


    return null;
}


function normalizarTexto(valor) {

    return String(valor || "")
        .trim()
        .toLowerCase();
}


function extrairMensagemErro(erro) {

    if (erro?.message) {
        return erro.message;
    }

    return "Não foi possível concluir a operação.";
}


function formatarCidade(cidade) {

    return `${cidade.nome} - ${cidade.uf}`;
}


/*
 * ============================================================
 * COMPONENTE
 * ============================================================
 */

function NovaViagem() {

    const navigate = useNavigate();
    const location = useLocation();


    /*
     * --------------------------------------------------------
     * IDENTIFICAÇÃO DO MODO
     * --------------------------------------------------------
     */

    const parametros =
        new URLSearchParams(
            location.search
        );

    const idEdicao =
        parametros.get("editar");

    const modoEdicao =
        Boolean(idEdicao);


    /*
     * --------------------------------------------------------
     * ESTADOS DO FORMULÁRIO
     * --------------------------------------------------------
     */

    const [dataInicio, setDataInicio] =
        useState("");

    const [dataFim, setDataFim] =
        useState("");

    const [origemId, setOrigemId] =
        useState("");

    const [destinoId, setDestinoId] =
        useState("");

    const [meioTransporteId, setMeioTransporteId] =
        useState("");

    const [motivoId, setMotivoId] =
        useState("");

    const [matriculaSolicitante, setMatriculaSolicitante] =
        useState(
            obterMatriculaInicial()
        );


    /*
     * --------------------------------------------------------
     * CONTROLE DA TELA
     * --------------------------------------------------------
     */

    const [carregando, setCarregando] =
        useState(modoEdicao);

    const [salvando, setSalvando] =
        useState(false);

    const [erro, setErro] =
        useState("");


    /*
     * ========================================================
     * CARREGAR VIAGEM QUANDO FOR EDIÇÃO
     * ========================================================
     */

    useEffect(() => {

        if (!modoEdicao) {
            return;
        }


        async function carregarViagem() {

            setCarregando(true);
            setErro("");


            try {

                const viagem =
                    await buscarViagemPorId(
                        Number(idEdicao)
                    );


                /*
                 * Datas
                 */
                setDataInicio(
                    viagem.dataInicio || ""
                );

                setDataFim(
                    viagem.dataFim || ""
                );


                /*
                 * Origem
                 *
                 * Procuramos a cidade pelo nome
                 * + UF que vieram da API.
                 */

                const cidadeOrigem =
                    CIDADES.find(
                        (cidade) =>

                            normalizarTexto(
                                cidade.nome
                            ) ===
                            normalizarTexto(
                                viagem.origem
                            )

                            &&

                            normalizarTexto(
                                cidade.uf
                            ) ===
                            normalizarTexto(
                                viagem.ufOrigem
                            )
                    );


                if (cidadeOrigem) {

                    setOrigemId(
                        String(
                            cidadeOrigem.id
                        )
                    );
                }


                /*
                 * Destino
                 */

                const cidadeDestino =
                    CIDADES.find(
                        (cidade) =>

                            normalizarTexto(
                                cidade.nome
                            ) ===
                            normalizarTexto(
                                viagem.destino
                            )

                            &&

                            normalizarTexto(
                                cidade.uf
                            ) ===
                            normalizarTexto(
                                viagem.ufDestino
                            )
                    );


                if (cidadeDestino) {

                    setDestinoId(
                        String(
                            cidadeDestino.id
                        )
                    );
                }


                /*
                 * Motivo
                 */

                const motivoEncontrado =
                    MOTIVOS.find(
                        (motivo) =>
                            normalizarTexto(
                                motivo.nome
                            ) ===
                            normalizarTexto(
                                viagem.motivo
                            )
                    );


                if (motivoEncontrado) {

                    setMotivoId(
                        String(
                            motivoEncontrado.id
                        )
                    );
                }


                /*
                 * Meio de transporte
                 *
                 * O backend atual possui respostas diferentes
                 * dependendo da versão:
                 *
                 * meioTransporte -> string
                 * meiosTransporte -> array
                 *
                 * Aceitamos os dois formatos.
                 */

                let nomeMeio =
                    viagem.meioTransporte;


                if (
                    Array.isArray(
                        viagem.meiosTransporte
                    )
                ) {

                    nomeMeio =
                        viagem.meiosTransporte[0];
                }


                const meioEncontrado =
                    MEIOS_TRANSPORTE.find(
                        (meio) =>
                            normalizarTexto(
                                meio.nome
                            ) ===
                            normalizarTexto(
                                nomeMeio
                            )
                    );


                if (meioEncontrado) {

                    setMeioTransporteId(
                        String(
                            meioEncontrado.id
                        )
                    );
                }


                /*
                 * Caso a viagem já tenha solicitante
                 * conhecido pelo nosso cadastro de teste,
                 * podemos preencher a matrícula.
                 */
                const usuarioEncontrado =
                    Object.entries(
                        USUARIOS_TESTE
                    ).find(
                        ([, usuario]) =>
                            normalizarTexto(
                                usuario.nome
                            ) ===
                            normalizarTexto(
                                viagem.solicitante
                            )
                    );


                if (usuarioEncontrado) {

                    setMatriculaSolicitante(
                        usuarioEncontrado[0]
                    );
                }


            } catch (error) {

                console.error(
                    "Erro ao carregar viagem:",
                    error
                );

                setErro(
                    extrairMensagemErro(
                        error
                    )
                );

            } finally {

                setCarregando(false);
            }
        }


        carregarViagem();

    }, [idEdicao, modoEdicao]);


    /*
     * ========================================================
     * VALIDAÇÃO
     * ========================================================
     */

    function validarFormulario() {

        setErro("");


        if (!dataInicio) {

            alert(
                "Informe a data de início."
            );

            return false;
        }


        if (!dataFim) {

            alert(
                "Informe a data de fim."
            );

            return false;
        }


        const hoje =
            new Date()
                .toISOString()
                .split("T")[0];


        if (dataInicio < hoje) {

            alert(
                "A data de início não pode estar no passado."
            );

            return false;
        }


        if (dataFim < dataInicio) {

            alert(
                "A data de fim deve ser igual ou posterior à data de início."
            );

            return false;
        }


        if (!origemId) {

            alert(
                "Selecione a cidade de origem."
            );

            return false;
        }


        if (!destinoId) {

            alert(
                "Selecione a cidade de destino."
            );

            return false;
        }


        if (origemId === destinoId) {

            alert(
                "A origem e o destino não podem ser iguais."
            );

            return false;
        }


        if (!meioTransporteId) {

            alert(
                "Selecione um meio de transporte."
            );

            return false;
        }


        if (!motivoId) {

            alert(
                "Selecione o motivo da viagem."
            );

            return false;
        }


        if (!matriculaSolicitante.trim()) {

            alert(
                "Informe a matrícula do solicitante."
            );

            return false;
        }


        if (
            !USUARIOS_TESTE[
                matriculaSolicitante
            ]
        ) {

            /*
             * Quando houver login real, essa validação
             * poderá ser removida porque o usuário virá
             * da sessão.
             */

            const usuarioSalvo =
                obterUsuarioSalvo();

            const matriculaSalva =
                usuarioSalvo?.matricula ||
                usuarioSalvo?.matriculaUsuario ||
                usuarioSalvo?.matriculaEmpregado ||
                usuarioSalvo?.empregado?.matricula;

            if (
                matriculaSalva !==
                matriculaSolicitante
            ) {

                alert(
                    "A matrícula informada não corresponde a um usuário conhecido no ambiente de teste."
                );

                return false;
            }
        }


        return true;
    }


    /*
     * ========================================================
     * MONTAR PAYLOAD PARA O BACKEND
     * ========================================================
     */

    function montarPayload() {

        return {

            dataInicio,

            dataFim,

            idOrigem:
                Number(origemId),

            idDestino:
                Number(destinoId),

            idMotivo:
                Number(motivoId),

            matriculaSolicitante:
                matriculaSolicitante.trim(),

            idMeioTransporte:
                Number(meioTransporteId)

        };
    }


    /*
     * ========================================================
     * SALVAR / ATUALIZAR
     * ========================================================
     */

    async function salvarNoBackend() {

        const payload =
            montarPayload();


        if (modoEdicao) {

            return await atualizarViagem(
                Number(idEdicao),
                payload
            );
        }


        return await criarViagem(
            payload
        );
    }


    /*
     * ========================================================
     * SALVAR COMO RASCUNHO
     * ========================================================
     */

    async function salvarRascunho() {

        if (!validarFormulario()) {
            return;
        }


        setSalvando(true);
        setErro("");


        try {

            await salvarNoBackend();


            alert(
                modoEdicao
                    ? "Rascunho atualizado com sucesso!"
                    : "Viagem salva como rascunho!"
            );


            navigate("/");


        } catch (error) {

            console.error(
                "Erro ao salvar rascunho:",
                error
            );


            setErro(
                extrairMensagemErro(
                    error
                )
            );


            alert(
                extrairMensagemErro(
                    error
                )
            );

        } finally {

            setSalvando(false);
        }
    }


    /*
     * ========================================================
     * ENVIAR PARA ANÁLISE
     * ========================================================
     *
     * Fluxo:
     *
     * 1. Cria ou atualiza a viagem.
     * 2. A viagem fica inicialmente como Rascunho.
     * 3. Depois chamamos /solicitar.
     */

    async function enviarParaAnalise() {

        if (!validarFormulario()) {
            return;
        }


        const idUsuarioResponsavel =
            obterIdUsuarioResponsavel(
                matriculaSolicitante.trim()
            );


        if (!idUsuarioResponsavel) {

            alert(
                "Não foi possível identificar o usuário responsável pela solicitação."
            );

            return;
        }


        setSalvando(true);
        setErro("");


        try {

            const viagemSalva =
                await salvarNoBackend();


            /*
             * Quando criamos uma viagem nova,
             * o backend retorna o ID.
             *
             * Em edição, já temos o ID pela URL.
             */

            const idViagem =
                viagemSalva?.id ||
                Number(idEdicao);


            if (!idViagem) {

                throw new Error(
                    "A viagem foi salva, mas o backend não retornou o ID da viagem."
                );
            }


            /*
             * Agora mudamos:
             *
             * Rascunho -> Solicitada
             */

            await solicitarViagem(
                Number(idViagem),
                {
                    idNovoStatus: 2,
                    idUsuarioResponsavel
                }
            );


            alert(
                modoEdicao
                    ? "Viagem atualizada e reenviada para análise!"
                    : "Viagem enviada para análise!"
            );


            navigate("/");


        } catch (error) {

            console.error(
                "Erro ao enviar viagem:",
                error
            );


            setErro(
                extrairMensagemErro(
                    error
                )
            );


            alert(
                extrairMensagemErro(
                    error
                )
            );

        } finally {

            setSalvando(false);
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
                                    CARREGANDO
                                </span>

                                <h2>
                                    Carregando viagem...
                                </h2>

                                <p>
                                    Aguarde enquanto os
                                    dados da viagem são
                                    carregados.
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
                                navigate(-1)
                            }
                            disabled={salvando}
                        >
                            ← Voltar
                        </button>

                    </div>


                    <section className="welcome">

                        <div>

                            <span className="welcome-small">

                                {modoEdicao
                                    ? "EDITAR VIAGEM"
                                    : "NOVA VIAGEM"}

                            </span>


                            <h2>

                                {modoEdicao
                                    ? "Alterar viagem"
                                    : "Planejar nova viagem"}

                            </h2>


                            <p>

                                Informe os dados da
                                viagem e escolha como
                                deseja finalizar o planejamento.

                            </p>

                        </div>

                    </section>


                    {
                        erro && (

                            <div className="info-aviso">

                                <strong>
                                    Não foi possível concluir a operação.
                                </strong>

                                <p>
                                    {erro}
                                </p>

                            </div>

                        )
                    }


                    <section className="formulario-viagem">


                        {/* =====================================================
                            DADOS PRINCIPAIS
                            ===================================================== */}

                        <div className="form-section">


                            <div className="form-section-title">

                                <h3>
                                    01 — Informações da viagem
                                </h3>

                                <p>
                                    Informe o período,
                                    origem, destino e
                                    solicitante.
                                </p>

                            </div>


                            <div className="grid-formulario">


                                {/* DATA INÍCIO */}

                                <div className="campo-viagem">

                                    <label htmlFor="dataInicio">
                                        Data de início
                                    </label>


                                    <input
                                        id="dataInicio"
                                        type="date"
                                        value={dataInicio}
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        onChange={(event) =>
                                            setDataInicio(
                                                event.target.value
                                            )
                                        }
                                        disabled={salvando}
                                    />

                                </div>


                                {/* DATA FIM */}

                                <div className="campo-viagem">

                                    <label htmlFor="dataFim">
                                        Data de fim
                                    </label>


                                    <input
                                        id="dataFim"
                                        type="date"
                                        min={
                                            dataInicio ||
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        value={dataFim}
                                        onChange={(event) =>
                                            setDataFim(
                                                event.target.value
                                            )
                                        }
                                        disabled={salvando}
                                    />

                                </div>


                                {/* ORIGEM */}

                                <div className="campo-viagem">

                                    <label htmlFor="origem">

                                        Origem

                                    </label>


                                    <select
                                        id="origem"
                                        value={origemId}
                                        onChange={(event) =>
                                            setOrigemId(
                                                event.target.value
                                            )
                                        }
                                        disabled={salvando}
                                    >

                                        <option value="">
                                            Selecione a origem
                                        </option>


                                        {CIDADES.map(
                                            (cidade) => (

                                                <option
                                                    key={cidade.id}
                                                    value={cidade.id}
                                                >
                                                    {formatarCidade(
                                                        cidade
                                                    )}
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                {/* DESTINO */}

                                <div className="campo-viagem">

                                    <label htmlFor="destino">

                                        Destino

                                    </label>


                                    <select
                                        id="destino"
                                        value={destinoId}
                                        onChange={(event) =>
                                            setDestinoId(
                                                event.target.value
                                            )
                                        }
                                        disabled={salvando}
                                    >

                                        <option value="">
                                            Selecione o destino
                                        </option>


                                        {CIDADES.map(
                                            (cidade) => (

                                                <option
                                                    key={cidade.id}
                                                    value={cidade.id}
                                                >
                                                    {formatarCidade(
                                                        cidade
                                                    )}
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                {/* MATRÍCULA */}

                                <div className="campo-viagem">

                                    <label htmlFor="matriculaSolicitante">

                                        Matrícula do solicitante

                                    </label>


                                    <input
                                        id="matriculaSolicitante"
                                        type="text"
                                        placeholder="Ex.: 0002-2"
                                        maxLength={6}
                                        value={
                                            matriculaSolicitante
                                        }
                                        onChange={(event) =>
                                            setMatriculaSolicitante(
                                                event.target.value
                                            )
                                        }
                                        disabled={
                                            salvando ||
                                            modoEdicao
                                        }
                                    />


                                    <small>
                                        Usuário responsável pelo cadastro da viagem.
                                    </small>

                                </div>


                            </div>

                        </div>



                        {/* =====================================================
                            TRANSPORTE
                            ===================================================== */}

                        <div className="form-section">


                            <div className="form-section-title">

                                <h3>
                                    02 — Meio de transporte
                                </h3>


                                <p>
                                    Selecione o meio que será utilizado.
                                </p>

                            </div>


                            <div className="transportes-viagem">


                                {MEIOS_TRANSPORTE.map(
                                    (transporte) => {

                                        const selecionado =
                                            String(
                                                transporte.id
                                            ) ===
                                            String(
                                                meioTransporteId
                                            );


                                        return (

                                            <button
                                                key={transporte.id}
                                                type="button"
                                                className={
                                                    selecionado
                                                        ? "transporte-opcao selecionado"
                                                        : "transporte-opcao"
                                                }
                                                onClick={() =>
                                                    setMeioTransporteId(
                                                        selecionado
                                                            ? ""
                                                            : String(
                                                                transporte.id
                                                            )
                                                    )
                                                }
                                                disabled={salvando}
                                            >

                                                {transporte.nome}

                                            </button>

                                        );

                                    }
                                )}

                            </div>


                            <p className="texto-ajuda">

                                O cadastro atual do banco registra
                                um meio de transporte por viagem.

                            </p>

                        </div>



                        {/* =====================================================
                            MOTIVO
                            ===================================================== */}

                        <div className="form-section">


                            <div className="form-section-title">

                                <h3>
                                    03 — Motivo da viagem
                                </h3>


                                <p>
                                    Selecione o motivo do deslocamento.
                                </p>

                            </div>


                            <div className="campo-viagem">

                                <label htmlFor="motivo">

                                    Motivo

                                </label>


                                <select
                                    id="motivo"
                                    value={motivoId}
                                    onChange={(event) =>
                                        setMotivoId(
                                            event.target.value
                                        )
                                    }
                                    disabled={salvando}
                                >

                                    <option value="">
                                        Selecione o motivo
                                    </option>


                                    {MOTIVOS.map(
                                        (motivo) => (

                                            <option
                                                key={motivo.id}
                                                value={motivo.id}
                                            >
                                                {motivo.nome}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>



                        {/* =====================================================
                            AVISO FINANCEIRO
                            ===================================================== */}

                        <div className="info-aviso">

                            <strong>
                                Despesas não são registradas nesta etapa.
                            </strong>


                            <p>
                                Depois que a viagem for aprovada,
                                você poderá registrar os gastos
                                realizados durante o deslocamento.
                            </p>

                        </div>



                        {/* =====================================================
                            AÇÕES
                            ===================================================== */}

                        <div className="form-footer-viagem">


                            <p>

                                Você pode salvar a viagem
                                como rascunho e continuar depois,
                                ou enviá-la para análise quando
                                o planejamento estiver concluído.

                            </p>


                            <div className="form-acoes">


                                <button
                                    type="button"
                                    className="botao-secundario"
                                    onClick={
                                        salvarRascunho
                                    }
                                    disabled={
                                        salvando
                                    }
                                >

                                    {salvando
                                        ? "Salvando..."
                                        : "Salvar como rascunho"}

                                </button>


                                <button
                                    type="button"
                                    className="botao-destaque"
                                    onClick={
                                        enviarParaAnalise
                                    }
                                    disabled={
                                        salvando
                                    }
                                >

                                    {salvando
                                        ? "Enviando..."
                                        : "Enviar para análise"}

                                </button>


                            </div>


                        </div>


                    </section>


                </main>

            </div>

        </div>
    );
}


export default NovaViagem;