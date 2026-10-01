import api from "./api";

export function listarTiposDespesa() {
    return api.get("/tipos-despesa");
}

export function listarDespesasPorViagem(idViagem) {
    return api.get(`/viagens/${idViagem}/despesas`);
}

export function registrarDespesa(idViagem, dados) {
    return api.post(`/viagens/${idViagem}/despesas`, dados);
}

export function excluirDespesa(idDespesa) {
    return api.delete(`/despesas/${idDespesa}`);
}

export function buscarCustosViagem(idViagem) {
    return api.get(`/viagens/${idViagem}/custos`);
}

export function buscarDashboard() {
    return api.get("/dashboard");
}
