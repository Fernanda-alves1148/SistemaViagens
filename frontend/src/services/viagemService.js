import api from "./api";

export function listarViagens(filtros = {}) {
    return api.get("/viagens", filtros);
}

export function buscarViagemPorId(id) {
    return api.get(`/viagens/${id}`);
}

export function criarViagem(dados) {
    return api.post("/viagens", dados);
}

export function atualizarViagem(id, dados) {
    return api.put(`/viagens/${id}`, dados);
}

export function solicitarViagem(id, dados = {}) {
    return api.patch(`/viagens/${id}/solicitar`, dados);
}

export function cancelarViagem(id, dados = {}) {
    return api.patch(`/viagens/${id}/cancelar`, dados);
}

export function solicitarAjustesViagem(id, dados = {}) {
    return api.patch(`/viagens/${id}/solicitar-ajustes`, dados);
}

export function aprovarViagem(id, dados = {}) {
    return api.patch(`/viagens/${id}/aprovar`, dados);
}

export function rejeitarViagem(id, dados) {
    return api.patch(`/viagens/${id}/rejeitar`, dados);
}

export function listarHistoricoViagem(id) {
    return api.get(`/viagens/${id}/historico`);
}

// O Controller.txt não possui DELETE /api/viagens/{id}.
// Esta função fica preparada para quando esse endpoint for criado no back end.
export function excluirViagem(id) {
    return api.delete(`/viagens/${id}`);
}
