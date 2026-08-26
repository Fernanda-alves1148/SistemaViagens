import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">

            <NavLink to="/">
                Viagens em rascunho
            </NavLink>

            <NavLink to="/viagens-solicitadas">
                Viagens solicitadas
            </NavLink>

        </nav>
    );
}

export default Navbar;