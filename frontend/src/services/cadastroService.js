import api from "./api";

export function listarAreas() {
    return api.get("/areas");
}

export function cadastrarArea(nome) {
    return api.post("/areas", { nome });
}

export function listarCargos() {
    return api.get("/cargos");
}

export function cadastrarCargo(nome) {
    return api.post("/cargos", { nome });
}

export function listarEnderecos() {
    return api.get("/enderecos");
}

export function listarEmpregados() {
    return api.get("/empregados");
}

export function cadastrarEmpregado(dados) {
    return api.post("/empregados", dados);
}

export function alterarVinculoEmpregado(
    matricula,
    dados
) {
    return api.put(
        `/empregados/${matricula}/vinculo`,
        dados
    );
}