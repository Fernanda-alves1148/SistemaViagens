const CHAVE_USUARIO = "usuarioLogado";

export const USUARIOS_DEMO = [
    {
        idUsuario: 1,
        login: "willian",
        matricula: "0001-1",
        nome: "WILLIAN SILVA",
        perfil: "GESTOR"
    },
    {
        idUsuario: 2,
        login: "ana",
        matricula: "0002-2",
        nome: "ANA PAULA DIAS",
        perfil: "COLABORADOR"
    },
    {
        idUsuario: 3,
        login: "joao",
        matricula: "0003-3",
        nome: "JOÃO MENEZES",
        perfil: "COLABORADOR"
    },
    {
        idUsuario: 4,
        login: "maria",
        matricula: "0004-4",
        nome: "MARIA COSTA",
        perfil: "GESTOR"
    },
    {
        idUsuario: 5,
        login: "carlos",
        matricula: "0005-5",
        nome: "CARLOS OLIVEIRA",
        perfil: "COLABORADOR"
    }
];

export function entrar(usuario) {
    localStorage.setItem(
        CHAVE_USUARIO,
        JSON.stringify(usuario)
    );
}

export function obterUsuarioLogado() {
    try {
        return JSON.parse(
            localStorage.getItem(CHAVE_USUARIO)
        );
    } catch {
        return null;
    }
}

export function sair() {
    localStorage.removeItem(CHAVE_USUARIO);
}

export function usuarioEhGestor() {
    return obterUsuarioLogado()?.perfil === "GESTOR";
}