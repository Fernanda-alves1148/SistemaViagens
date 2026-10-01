import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import RotaProtegida from "./components/RotaProtegida";
import Login from "./pages/Login";
import Rascunhos from "./pages/Rascunhos";
import NovaViagem from "./pages/NovaViagem";
import DetalhesViagem from "./pages/DetalhesViagem";
import ViagensSolicitadas from "./pages/ViagensSolicitadas";
import GestaoViagens from "./pages/GestaoViagens";
import DespesasViagem from "./pages/DespesasViagem";
import DetalhesGestaoViagem from "./pages/DetalhesGestaoViagem";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/"
                    element={
                        <RotaProtegida perfil="COLABORADOR">
                            <Rascunhos />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/nova-viagem"
                    element={
                        <RotaProtegida perfil="COLABORADOR">
                            <NovaViagem />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/viagem/:id"
                    element={
                        <RotaProtegida perfil="COLABORADOR">
                            <DetalhesViagem />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/viagens-solicitadas"
                    element={
                        <RotaProtegida perfil="COLABORADOR">
                            <ViagensSolicitadas />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/viagem/:id/despesas"
                    element={
                        <RotaProtegida perfil="COLABORADOR">
                            <DespesasViagem />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/gestao"
                    element={
                        <RotaProtegida perfil="GESTOR">
                            <GestaoViagens />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/gestao/viagem/:id"
                    element={
                        <RotaProtegida perfil="GESTOR">
                            <DetalhesGestaoViagem />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <RotaProtegida perfil="GESTOR">
                            <Dashboard />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;