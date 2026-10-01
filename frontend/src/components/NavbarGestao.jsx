import {
    NavLink,
    useNavigate
} from "react-router-dom";

import {
    sair
} from "../auth/auth";

function NavbarGestao() {
    const navigate = useNavigate();

    function encerrarSessao() {
        sair();
        navigate("/login");
    }

    return (
        <aside className="sidebar">
            <div className="logo-area">
                <div className="logo-icon">
                    GV
                </div>

                <div className="logo-text">
                    <strong>Gestão</strong>
                    <span>de Viagens</span>
                </div>
            </div>

            <nav className="menu">
                <div className="menu-label">
                    GESTOR
                </div>

                <NavLink
                    to="/gestao"
                    className={({ isActive }) =>
                        `menu-item ${
                            isActive ? "active" : ""
                        }`
                    }
                >
                    <span className="menu-icon">✓</span>
                    <span>Gestão de viagens</span>
                </NavLink>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `menu-item ${
                            isActive ? "active" : ""
                        }`
                    }
                >
                    <span className="menu-icon">▤</span>
                    <span>Dashboard</span>
                </NavLink>

                <div className="menu-separador" />

                <div className="menu-label">
                    CONTA
                </div>

                <button
                    type="button"
                    className="menu-item menu-button"
                    onClick={encerrarSessao}
                >
                    <span className="menu-icon">⇥</span>
                    <span>Sair</span>
                </button>
            </nav>
        </aside>
    );
}

export default NavbarGestao;