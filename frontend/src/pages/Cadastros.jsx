import { useEffect, useState } from "react";

import Header from "../components/Header";
import NavbarGestao from "../components/NavbarGestao";

import {
    alterarVinculoEmpregado,
    cadastrarArea,
    cadastrarCargo,
    cadastrarEmpregado,
    listarAreas,
    listarCargos,
    listarEmpregados,
    listarEnderecos
} from "../services/cadastroService";

import "../styles/cadastros.css";

const hoje = new Date().toISOString().slice(0, 10);

function Cadastros() {
    const [areas, setAreas] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [enderecos, setEnderecos] = useState([]);
    const [empregados, setEmpregados] = useState([]);

    const [nomeArea, setNomeArea] = useState("");
    const [nomeCargo, setNomeCargo] = useState("");

    const [empregado, setEmpregado] = useState({
        matricula: "",
        nome: "",
        cpf: "",
        idEndereco: "",
        idCargo: "",
        idArea: "",
        dataInicio: hoje
    });

    const [vinculo, setVinculo] = useState({
        matricula: "",
        idCargo: "",
        idArea: "",
        dataInicio: hoje
    });

    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [processando, setProcessando] = useState(false);

    async function carregarDados() {
        const [
            dadosAreas,
            dadosCargos,
            dadosEnderecos,
            dadosEmpregados
        ] = await Promise.all([
            listarAreas(),
            listarCargos(),
            listarEnderecos(),
            listarEmpregados()
        ]);

        setAreas(dadosAreas || []);
        setCargos(dadosCargos || []);
        setEnderecos(dadosEnderecos || []);
        setEmpregados(dadosEmpregados || []);
    }

    useEffect(() => {
        carregarDados().catch((error) => {
            setErro(
                error.message ||
                "Não foi possível carregar os cadastros."
            );
        });
    }, []);

    function limparMensagens() {
        setMensagem("");
        setErro("");
    }

    async function enviarArea(event) {
        event.preventDefault();
        limparMensagens();

        try {
            setProcessando(true);
            await cadastrarArea(nomeArea.trim());
            setNomeArea("");
            await carregarDados();
            setMensagem("Área cadastrada com sucesso.");
        } catch (error) {
            setErro(error.message);
        } finally {
            setProcessando(false);
        }
    }

    async function enviarCargo(event) {
        event.preventDefault();
        limparMensagens();

        try {
            setProcessando(true);
            await cadastrarCargo(nomeCargo.trim());
            setNomeCargo("");
            await carregarDados();
            setMensagem("Cargo cadastrado com sucesso.");
        } catch (error) {
            setErro(error.message);
        } finally {
            setProcessando(false);
        }
    }

    async function enviarEmpregado(event) {
        event.preventDefault();
        limparMensagens();

        if (!/^\d{4}-\d$/.test(empregado.matricula)) {
            setErro("A matrícula deve possuir o formato XXXX-X.");
            return;
        }

        try {
            setProcessando(true);

            await cadastrarEmpregado({
                ...empregado,
                idEndereco: Number(empregado.idEndereco),
                idCargo: Number(empregado.idCargo),
                idArea: Number(empregado.idArea)
            });

            setEmpregado({
                matricula: "",
                nome: "",
                cpf: "",
                idEndereco: "",
                idCargo: "",
                idArea: "",
                dataInicio: hoje
            });

            await carregarDados();
            setMensagem("Empregado cadastrado com sucesso.");
        } catch (error) {
            setErro(error.message);
        } finally {
            setProcessando(false);
        }
    }

    function selecionarEmpregado(event) {
        const matricula = event.target.value;
        const selecionado = empregados.find(
            (item) => item.matricula === matricula
        );

        if (!selecionado) {
            setVinculo({
                matricula: "",
                idCargo: "",
                idArea: "",
                dataInicio: hoje
            });
            return;
        }

        const cargo = cargos.find(
            (item) => item.nome === selecionado.cargo
        );

        const area = areas.find(
            (item) => item.nome === selecionado.area
        );

        setVinculo({
            matricula,
            idCargo: cargo?.id || "",
            idArea: area?.id || "",
            dataInicio: hoje
        });
    }

    async function enviarVinculo(event) {
        event.preventDefault();
        limparMensagens();

        try {
            setProcessando(true);

            await alterarVinculoEmpregado(
                vinculo.matricula,
                {
                    idCargo: Number(vinculo.idCargo),
                    idArea: Number(vinculo.idArea),
                    dataInicio: vinculo.dataInicio
                }
            );

            await carregarDados();

            setVinculo({
                matricula: "",
                idCargo: "",
                idArea: "",
                dataInicio: hoje
            });

            setMensagem(
                "Cargo e área atualizados. O histórico anterior foi preservado."
            );
        } catch (error) {
            setErro(error.message);
        } finally {
            setProcessando(false);
        }
    }

    return (
        <div className="app">
            <NavbarGestao />

            <div className="main-area">
                <Header />

                <main className="content cadastros-pagina">
                    <div className="cadastros-cabecalho">
                        <span>ADMINISTRAÇÃO</span>
                        <h2>Cadastros</h2>
                        <p>
                            Gerencie áreas, cargos e empregados.
                        </p>
                    </div>

                    {mensagem && (
                        <div className="cadastro-sucesso">
                            {mensagem}
                        </div>
                    )}

                    {erro && (
                        <div className="cadastro-erro">
                            {erro}
                        </div>
                    )}

                    <div className="cadastros-grade">
                        <form
                            className="cadastro-card"
                            onSubmit={enviarArea}
                        >
                            <h3>Nova área</h3>

                            <input
                                required
                                maxLength="80"
                                placeholder="Nome da área"
                                value={nomeArea}
                                onChange={(event) =>
                                    setNomeArea(event.target.value)
                                }
                            />

                            <button disabled={processando}>
                                Cadastrar área
                            </button>

                            <ul>
                                {areas.map((area) => (
                                    <li key={area.id}>
                                        {area.nome}
                                    </li>
                                ))}
                            </ul>
                        </form>

                        <form
                            className="cadastro-card"
                            onSubmit={enviarCargo}
                        >
                            <h3>Novo cargo</h3>

                            <input
                                required
                                maxLength="80"
                                placeholder="Nome do cargo"
                                value={nomeCargo}
                                onChange={(event) =>
                                    setNomeCargo(event.target.value)
                                }
                            />

                            <button disabled={processando}>
                                Cadastrar cargo
                            </button>

                            <ul>
                                {cargos.map((cargo) => (
                                    <li key={cargo.id}>
                                        {cargo.nome}
                                    </li>
                                ))}
                            </ul>
                        </form>
                    </div>

                    <form
                        className="cadastro-card cadastro-largo"
                        onSubmit={enviarEmpregado}
                    >
                        <h3>Novo empregado</h3>

                        <div className="formulario-grade">
                            <label>
                                Matrícula
                                <input
                                    required
                                    placeholder="0000-0"
                                    maxLength="6"
                                    pattern="\d{4}-\d"
                                    value={empregado.matricula}
                                    onChange={(event) =>
                                        setEmpregado({
                                            ...empregado,
                                            matricula: event.target.value
                                        })
                                    }
                                />
                            </label>

                            <label>
                                Nome
                                <input
                                    required
                                    value={empregado.nome}
                                    onChange={(event) =>
                                        setEmpregado({
                                            ...empregado,
                                            nome: event.target.value
                                        })
                                    }
                                />
                            </label>

                            <label>
                                CPF
                                <input
                                    required
                                    placeholder="000.000.000-00"
                                    maxLength="14"
                                    value={empregado.cpf}
                                    onChange={(event) =>
                                        setEmpregado({
                                            ...empregado,
                                            cpf: event.target.value
                                        })
                                    }
                                />
                            </label>

                            <label>
                                Endereço
                                <select
                                    required
                                    value={empregado.idEndereco}
                                    onChange={(event) =>
                                        setEmpregado({
                                            ...empregado,
                                            idEndereco: event.target.value
                                        })
                                    }
                                >
                                    <option value="">
                                        Selecione
                                    </option>

                                    {enderecos.map((endereco) => (
                                        <option
                                            key={endereco.id}
                                            value={endereco.id}
                                        >
                                            {endereco.descricao}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Cargo
                                <select
                                    required
                                    value={empregado.idCargo}
                                    onChange={(event) =>
                                        setEmpregado({
                                            ...empregado,
                                            idCargo: event.target.value
                                        })
                                    }
                                >
                                    <option value="">
                                        Selecione
                                    </option>

                                    {cargos.map((cargo) => (
                                        <option
                                            key={cargo.id}
                                            value={cargo.id}
                                        >
                                            {cargo.nome}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Área
                                <select
                                    required
                                    value={empregado.idArea}
                                    onChange={(event) =>
                                        setEmpregado({
                                            ...empregado,
                                            idArea: event.target.value
                                        })
                                    }
                                >
                                    <option value="">
                                        Selecione
                                    </option>

                                    {areas.map((area) => (
                                        <option
                                            key={area.id}
                                            value={area.id}
                                        >
                                            {area.nome}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Início do vínculo
                                <input
                                    required
                                    type="date"
                                    value={empregado.dataInicio}
                                    onChange={(event) =>
                                        setEmpregado({
                                            ...empregado,
                                            dataInicio: event.target.value
                                        })
                                    }
                                />
                            </label>
                        </div>

                        <button disabled={processando}>
                            Cadastrar empregado
                        </button>
                    </form>

                    <form
                        className="cadastro-card cadastro-largo"
                        onSubmit={enviarVinculo}
                    >
                        <h3>Alterar cargo ou área</h3>

                        <div className="formulario-grade">
                            <label>
                                Empregado
                                <select
                                    required
                                    value={vinculo.matricula}
                                    onChange={selecionarEmpregado}
                                >
                                    <option value="">
                                        Selecione
                                    </option>

                                    {empregados.map((item) => (
                                        <option
                                            key={item.matricula}
                                            value={item.matricula}
                                        >
                                            {item.matricula} — {item.nome}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Novo cargo
                                <select
                                    required
                                    value={vinculo.idCargo}
                                    onChange={(event) =>
                                        setVinculo({
                                            ...vinculo,
                                            idCargo: event.target.value
                                        })
                                    }
                                >
                                    <option value="">
                                        Selecione
                                    </option>

                                    {cargos.map((cargo) => (
                                        <option
                                            key={cargo.id}
                                            value={cargo.id}
                                        >
                                            {cargo.nome}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Nova área
                                <select
                                    required
                                    value={vinculo.idArea}
                                    onChange={(event) =>
                                        setVinculo({
                                            ...vinculo,
                                            idArea: event.target.value
                                        })
                                    }
                                >
                                    <option value="">
                                        Selecione
                                    </option>

                                    {areas.map((area) => (
                                        <option
                                            key={area.id}
                                            value={area.id}
                                        >
                                            {area.nome}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Início do novo vínculo
                                <input
                                    required
                                    type="date"
                                    value={vinculo.dataInicio}
                                    onChange={(event) =>
                                        setVinculo({
                                            ...vinculo,
                                            dataInicio: event.target.value
                                        })
                                    }
                                />
                            </label>
                        </div>

                        <button disabled={processando}>
                            Atualizar vínculo
                        </button>
                    </form>

                    <section className="cadastro-card cadastro-largo">
                        <h3>Empregados cadastrados</h3>

                        <div className="tabela-responsiva">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Matrícula</th>
                                        <th>Nome</th>
                                        <th>Cargo</th>
                                        <th>Área</th>
                                        <th>Início</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {empregados.map((item) => (
                                        <tr key={item.matricula}>
                                            <td>{item.matricula}</td>
                                            <td>{item.nome}</td>
                                            <td>{item.cargo}</td>
                                            <td>{item.area}</td>
                                            <td>{item.dataInicio}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default Cadastros;