import api from "./api";

export function listarCidades() {
    return api.get("/cidades");
}

export function listarMotivos() {
    return api.get("/motivos");
}

export function listarMeiosTransporte() {
    return api.get("/meios-transporte");
}

// Não existe endpoint de status no Controller.txt enviado.
// Manter esta função apenas quando o endpoint /api/status-viagem for criado.
export function listarStatusViagem() {
    return api.get("/status-viagem");
}

export async function carregarCatalogosViagem() {
    const [cidades, motivos, meiosTransporte] = await Promise.all([
        listarCidades(),
        listarMotivos(),
        listarMeiosTransporte()
    ]);

    return {
        cidades,
        motivos,
        meiosTransporte
    };
}
