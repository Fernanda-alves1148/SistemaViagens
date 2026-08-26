const API_URL = "http://localhost:8080/api";

export async function buscarViagens() {

    const response = await fetch(
        `${API_URL}/viagens`
    );

    if (!response.ok) {
        throw new Error(
            "Erro ao buscar viagens."
        );
    }

    return response.json();
}

export async function buscarViagemPorId(id) {

    const response = await fetch(
        `${API_URL}/viagens/${id}`
    );

    if (!response.ok) {
        throw new Error(
            "Erro ao buscar viagem."
        );
    }

    return response.json();
}

export async function criarViagem(viagem) {

    const response = await fetch(
        `${API_URL}/viagens`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify(viagem)
        }
    );

    if (!response.ok) {
        throw new Error(
            "Erro ao criar viagem."
        );
    }

    return response.json();
}

export async function excluirViagem(id) {

    const response = await fetch(
        `${API_URL}/viagens/${id}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error(
            "Erro ao excluir viagem."
        );
    }
}