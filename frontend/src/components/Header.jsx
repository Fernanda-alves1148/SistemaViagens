import {
    obterUsuarioLogado
} from "../auth/auth";

function Header() {
    const usuario =
        obterUsuarioLogado();

    const iniciais = usuario?.nome
        ?.split(" ")
        .slice(0, 2)
        .map(parte => parte[0])
        .join("") || "US";

    return (
        <header className="topbar">
            <div className="topbar-title">
                <h1>
                    Sistema de Gerenciamento de Viagens
                </h1>

                <span>
                    Portal corporativo
                </span>
            </div>

            <div className="usuario">
                <div className="avatar">
                    {iniciais}
                </div>

                <div className="usuario-info">
                    <strong>
                        {usuario?.nome || "Usuário"}
                    </strong>

                    <span>
                        {usuario?.perfil === "GESTOR"
                            ? "Gestor"
                            : "Colaborador"}
                    </span>
                </div>
            </div>
        </header>
    );
}

export default Header;
