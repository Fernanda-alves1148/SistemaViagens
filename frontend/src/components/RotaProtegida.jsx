import { Navigate } from "react-router-dom";
import {
    obterUsuarioLogado
} from "../auth/auth";

function RotaProtegida({
    children,
    perfil
}) {
    const usuario =
        obterUsuarioLogado();

    if (!usuario) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (
        perfil &&
        usuario.perfil !== perfil
    ) {
        return (
            <Navigate
                to={
                    usuario.perfil === "GESTOR"
                        ? "/gestao"
                        : "/"
                }
                replace
            />
        );
    }

    return children;
}

export default RotaProtegida;