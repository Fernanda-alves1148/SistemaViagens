function TabelaDespesas({
    despesas,
    setDespesas
}) {

    function adicionarDespesa() {

        const novaDespesa = {
            id: Date.now(),
            tipo: "",
            valor: ""
        };

        setDespesas([
            ...despesas,
            novaDespesa
        ]);
    }

    function alterarDespesa(
        id,
        campo,
        valor
    ) {

        setDespesas(
            despesas.map((despesa) =>
                despesa.id === id
                    ? {
                        ...despesa,
                        [campo]: valor
                    }
                    : despesa
            )
        );
    }

    function removerDespesa(id) {

        setDespesas(
            despesas.filter(
                (despesa) =>
                    despesa.id !== id
            )
        );
    }

    return (
        <section className="despesas">

            <div className="secao-cabecalho">

                <h3>Despesas</h3>

                <button
                    type="button"
                    onClick={adicionarDespesa}
                >
                    + Adicionar despesa
                </button>

            </div>

            <table>

                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Valor</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>

                    {despesas.map((despesa) => (

                        <tr key={despesa.id}>

                            <td>

                                <select
                                    value={despesa.tipo}
                                    onChange={(event) =>
                                        alterarDespesa(
                                            despesa.id,
                                            "tipo",
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Selecione
                                    </option>

                                    <option value="ALIMENTACAO">
                                        Alimentação
                                    </option>

                                    <option value="TRANSPORTE">
                                        Transporte
                                    </option>

                                    <option value="HOTEL">
                                        Hotel
                                    </option>

                                    <option value="COMBUSTIVEL">
                                        Combustível
                                    </option>

                                    <option value="OUTROS">
                                        Outros
                                    </option>

                                </select>

                            </td>

                            <td>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={despesa.valor}
                                    onChange={(event) =>
                                        alterarDespesa(
                                            despesa.id,
                                            "valor",
                                            event.target.value
                                        )
                                    }
                                />

                            </td>

                            <td>

                                <button
                                    type="button"
                                    className="botao-excluir"
                                    onClick={() =>
                                        removerDespesa(
                                            despesa.id
                                        )
                                    }
                                >
                                    🗑
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </section>
    );
}

export default TabelaDespesas;