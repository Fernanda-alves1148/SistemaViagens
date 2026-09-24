import { NavLink } from "react-router-dom";

function NavbarGestao() {
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
                    PRINCIPAL
                </div>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `menu-item ${isActive ? "active" : ""}`
                    }
                >
                    <span className="menu-icon">▤</span>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/gestao"
                    className={({ isActive }) =>
                        `menu-item ${isActive ? "active" : ""}`
                    }
                >
                    <span className="menu-icon">≡</span>
                    <span>Gestão de viagens</span>
                </NavLink>

                <div className="menu-separador" />

                <div className="menu-label">
                    CONTA
                </div>

                <button
                    type="button"
                    className="menu-item menu-button"
                >
                    <span className="menu-icon">⚙</span>
                    <span>Configurações</span>
                </button>

                <button
                    type="button"
                    className="menu-item menu-button"
                >
                    <span className="menu-icon">⇥</span>
                    <span>Sair</span>
                </button>

            </nav>

        </aside>
    );
}

export default NavbarGestao;