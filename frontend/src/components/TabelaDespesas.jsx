function formatarValorInicial(valor) {
    if (
        valor === "" ||
        valor === null ||
        valor === undefined
    ) {
        return "";
    }

   
    if (typeof valor === "string") {
        const somenteNumeros =
            valor.replace(/\D/g, "");

        if (!somenteNumeros) {
            return "";
        }

        return formatarCentavosParaReal(
            somenteNumeros
        );
    }


    if (typeof valor === "number") {
        return valor.toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    }

    return "";
}


function formatarCentavosParaReal(digitos) {

    if (!digitos) {
        return "0,00";
    }

    const somenteNumeros =
        digitos.replace(/\D/g, "");

    if (!somenteNumeros) {
        return "0,00";
    }

    const valorEmCentavos =
        Number(somenteNumeros);

    const valorEmReais =
        valorEmCentavos / 100;

    return valorEmReais.toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}


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


    function alterarValor(
        id,
        valorDigitado
    ) {

        
        const somenteNumeros =
            valorDigitado.replace(/\D/g, "");

        
        if (somenteNumeros === "") {

            alterarDespesa(
                id,
                "valor",
                ""
            );

            return;
        }

        const valorFormatado =
            formatarCentavosParaReal(
                somenteNumeros
            );

        alterarDespesa(
            id,
            "valor",
            valorFormatado
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

                <div>

                    <h3>
                        Despesas
                    </h3>

                    <p className="texto-suave">
                        Informe os valores previstos
                        para a viagem.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={adicionarDespesa}
                >
                    + Adicionar despesa
                </button>

            </div>


            <div className="despesas-table">

                <table>

                    <thead>

                        <tr>

                            <th>
                                Tipo
                            </th>

                            <th>
                                Valor
                            </th>

                            <th>
                                Ações
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {despesas.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="3"
                                    className="despesas-vazias"
                                >
                                    Nenhuma despesa adicionada.
                                    Clique em{" "}
                                    <strong>
                                        "+ Adicionar despesa"
                                    </strong>
                                    {" "}para começar.
                                </td>

                            </tr>

                        ) : (

                            despesas.map(
                                (despesa) => (

                                    <tr
                                        key={
                                            despesa.id
                                        }
                                    >

                                        <td>

                                            <select
                                                value={
                                                    despesa.tipo
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    alterarDespesa(
                                                        despesa.id,
                                                        "tipo",
                                                        event.target.value
                                                    )
                                                }
                                            >

                                                <option value="">
                                                    Selecione o tipo
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

                                            <div className="campo-valor">

                                                <span className="simbolo-moeda">
                                                    R$
                                                </span>

                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    placeholder="0,00"
                                                    value={
                                                        formatarValorInicial(
                                                            despesa.valor
                                                        )
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        alterarValor(
                                                            despesa.id,
                                                            event.target.value
                                                        )
                                                    }
                                                />

                                            </div>

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
                                                title="Excluir despesa"
                                            >
                                                🗑
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )

                        )}

                    </tbody>

                </table>

            </div>

        </section>
    );
}

export default TabelaDespesas;