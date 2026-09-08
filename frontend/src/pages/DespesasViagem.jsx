import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar";

import {
    viagensSolicitadas
} from "../data/viagensMock";

import "../styles/viagens.css";

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

function obterHoje() {
    return new Date()
        .toISOString()
        .split("T")[0];
}

function DespesasViagem() {

    const { id } = useParams();

    const navigate = useNavigate();

    const viagem =
        viagensSolicitadas.find(
            (item) =>
                item.id === Number(id)
        );

    const [data, setData] =
        useState(obterHoje());

    const [tipo, setTipo] =
        useState("");

    const [descricao, setDescricao] =
        useState("");

    const [valor, setValor] =
        useState("");

    const [despesas, setDespesas] =
        useState(
            viagem?.despesas || []
        );

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
                                className="botao-destaque"
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

    if (viagem.status !== "ACEITA") {

        return (
            <div className="app">

                <Navbar />

                <div className="main-area">

                    <Header />

                    <main className="content">

                        <div className="empty-state">

                            <h2>
                                Despesas indisponíveis
                            </h2>

                            <p>
                                As despesas só podem ser
                                registradas depois que a
                                viagem for aprovada.
                            </p>

                            <button
                                type="button"
                                className="botao-destaque"
                                onClick={() =>
                                    navigate(
                                        `/viagem/${viagem.id}`
                                    )
                                }
                            >
                                Voltar para viagem
                            </button>

                        </div>

                    </main>

                </div>

            </div>
        );
    }

    const total =
        despesas.reduce(
            (soma, despesa) =>
                soma +
                Number(
                    despesa.valor || 0
                ),
            0
        );

    function registrarDespesa() {

        if (!data) {
            alert(
                "Informe a data da despesa."
            );
            return;
        }

        if (data > obterHoje()) {
            alert(
                "A data da despesa não pode ser futura."
            );
            return;
        }

        if (!tipo) {
            alert(
                "Selecione o tipo da despesa."
            );
            return;
        }

        if (!descricao.trim()) {
            alert(
                "Informe uma descrição."
            );
            return;
        }

        const valorNumerico =
            Number(
                String(valor)
                    .replace(",", ".")
            );

        if (
            Number.isNaN(valorNumerico) ||
            valorNumerico <= 0
        ) {
            alert(
                "O valor deve ser maior que zero."
            );
            return;
        }

        const novaDespesa = {
            id:
                Date.now(),
            data,
            tipo,
            descricao,
            valor: valorNumerico
        };

        setDespesas([
            ...despesas,
            novaDespesa
        ]);

        setData(obterHoje());
        setTipo("");
        setDescricao("");
        setValor("");
    }

    function excluirDespesa(idDespesa) {

        setDespesas(
            despesas.filter(
                (despesa) =>
                    despesa.id !== idDespesa
            )
        );
    }

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
                                navigate(
                                    `/viagem/${viagem.id}`
                                )
                            }
                        >
                            ← Voltar para viagem
                        </button>

                    </div>


                    <section className="welcome">

                        <div>

                            <span className="welcome-small">
                                VIAGEM #{viagem.id}
                            </span>

                            <h2>
                                Despesas da viagem
                            </h2>

                            <p>
                                {viagem.origem}
                                {" → "}
                                {viagem.destino}
                            </p>

                        </div>

                    </section>


                    <section className="form-section">

                        <div className="form-section-title">

                            <h3>
                                Registrar despesa
                            </h3>

                            <p>
                                Informe os gastos realizados
                                durante a viagem.
                            </p>

                        </div>


                        <div className="grid-formulario">

                            <div className="campo-viagem">

                                <label htmlFor="dataDespesa">
                                    Data
                                </label>

                                <input
                                    id="dataDespesa"
                                    type="date"
                                    max={obterHoje()}
                                    value={data}
                                    onChange={(event) =>
                                        setData(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="campo-viagem">

                                <label htmlFor="tipoDespesa">
                                    Tipo
                                </label>

                                <select
                                    id="tipoDespesa"
                                    value={tipo}
                                    onChange={(event) =>
                                        setTipo(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Selecione
                                    </option>

                                    <option value="Hospedagem">
                                        Hospedagem
                                    </option>

                                    <option value="Alimentação">
                                        Alimentação
                                    </option>

                                    <option value="Transporte">
                                        Transporte
                                    </option>

                                    <option value="Combustível">
                                        Combustível
                                    </option>

                                    <option value="Pedágios">
                                        Pedágios
                                    </option>

                                    <option value="Outras">
                                        Outras despesas
                                    </option>
                                </select>

                            </div>


                            <div className="campo-viagem">

                                <label htmlFor="descricao">
                                    Descrição
                                </label>

                                <input
                                    id="descricao"
                                    type="text"
                                    placeholder="Ex.: Hotel, almoço, combustível..."
                                    value={descricao}
                                    onChange={(event) =>
                                        setDescricao(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="campo-viagem">

                                <label htmlFor="valor">
                                    Valor gasto
                                </label>

                                <input
                                    id="valor"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0,00"
                                    value={valor}
                                    onChange={(event) =>
                                        setValor(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>


                        <div className="form-acoes despesas-acoes">

                            <button
                                type="button"
                                className="botao-destaque"
                                onClick={
                                    registrarDespesa
                                }
                            >
                                + Adicionar despesa
                            </button>

                        </div>

                    </section>


                    <section className="section">

                        <div className="section-header">

                            <div>

                                <h3>
                                    Resumo financeiro
                                </h3>

                                <p>
                                    Total das despesas
                                    registradas.
                                </p>

                            </div>

                        </div>


                        <div className="detail-card">

                            <div className="resumo-financeiro">

                                <span>
                                    Total gasto
                                </span>

                                <strong>
                                    {formatarMoeda(total)}
                                </strong>

                            </div>


                            {despesas.length === 0 ? (

                                <div className="empty-state">

                                    <p>
                                        Nenhuma despesa
                                        registrada.
                                    </p>

                                </div>

                            ) : (

                                <div className="table-container">

                                    <table>

                                        <thead>

                                            <tr>
                                                <th>Data</th>
                                                <th>Tipo</th>
                                                <th>Descrição</th>
                                                <th>Valor</th>
                                                <th>Ação</th>
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
                                                            {despesa.data}
                                                        </td>

                                                        <td>
                                                            {despesa.tipo}
                                                        </td>

                                                        <td>
                                                            {despesa.descricao}
                                                        </td>

                                                        <td>
                                                            {formatarMoeda(
                                                                despesa.valor
                                                            )}
                                                        </td>

                                                        <td>

                                                            <button
                                                                type="button"
                                                                className="botao-excluir"
                                                                onClick={() =>
                                                                    excluirDespesa(
                                                                        despesa.id
                                                                    )
                                                                }
                                                            >
                                                                🗑
                                                            </button>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </section>

                </main>

            </div>

        </div>
    );
}

export default DespesasViagem;