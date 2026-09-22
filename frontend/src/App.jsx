import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Rascunhos from "./pages/Rascunhos";
import NovaViagem from "./pages/NovaViagem";
import DetalhesViagem from "./pages/DetalhesViagem";
import ViagensSolicitadas from "./pages/ViagensSolicitadas";
import GestaoViagens from "./pages/GestaoViagens";
import DespesasViagem from "./pages/DespesasViagem";
import DetalhesGestaoViagem from "./pages/DetalhesGestaoViagem";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Rascunhos />}
                />

                <Route
                    path="/nova-viagem"
                    element={<NovaViagem />}
                />

                <Route
                    path="/viagem/:id"
                    element={<DetalhesViagem />}
                />

                <Route
                    path="/viagens-solicitadas"
                    element={<ViagensSolicitadas />}
                />

                <Route
                    path="/gestao"
                    element={<GestaoViagens />}
                />


                <Route
                    path="/viagem/:id/despesas"
                    element={<DespesasViagem />}
                />

                <Route
                path="/gestao/viagem/:id"
                    element={
                        <DetalhesGestaoViagem />
                             }
                />

                 <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;