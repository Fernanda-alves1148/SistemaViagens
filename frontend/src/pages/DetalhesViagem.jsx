import {
    useNavigate,
    useParams
} from "react-router-dom";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import {
    viagensRascunho
} from "../data/viagensMock";

function DetalhesViagem() {

    const { id } = useParams();

    const navigate = useNavigate();

    const viagem = viagensRascunho.find(
        (item) =>
            item.id === Number(id)
    );

    if (!viagem) {
        return (
            <p>Viagem não encontrada.</p>
        );
    }

    return (
        <>
            <Header />

            <Navbar />

            <main className="container">

                <button
                    className="botao-voltar"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    ← Voltar
                </button>

                <h2>
                    Detalhes da viagem
                </h2>

                <div className="card">

                    <div className="detalhes-grid">

                        <div>
                            <strong>
                                Data de início
                            </strong>

                            <p>
                                {viagem.dataInicio}
                            </p>
                        </div>

                        <div>
                            <strong>
                                Data de fim
                            </strong>

                            <p>
                                {viagem.dataFim}
                            </p>
                        </div>

                        <div>
                            <strong>
                                Origem
                            </strong>

                            <p>
                                {viagem.origem}
                            </p>
                        </div>

                        <div>
                            <strong>
                                Destino
                            </strong>

                            <p>
                                {viagem.destino}
                            </p>
                        </div>

                        <div>
                            <strong>
                                Meio de transporte
                            </strong>

                            <p>
                                {viagem.transportes.join(
                                    ", "
                                )}
                            </p>
                        </div>

                        <div>
                            <strong>
                                Status
                            </strong>

                            <p>
                                Em rascunho
                            </p>
                        </div>

                    </div>

                    <div>

                        <strong>
                            Motivo da viagem
                        </strong>

                        <p>
                            {viagem.motivo}
                        </p>

                    </div>

                </div>

                <h3>
                    Despesas
                </h3>

                <table>

                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Valor</th>
                        </tr>
                    </thead>

                    <tbody>

                        {viagem.despesas.map(
                            (despesa) => (

                                <tr
                                    key={despesa.id}
                                >

                                    <td>
                                        {despesa.tipo}
                                    </td>

                                    <td>
                                        R$ {
                                            Number(
                                                despesa.valor
                                            ).toFixed(2)
                                        }
                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </main>
        </>
    );
}

export default DetalhesViagem;