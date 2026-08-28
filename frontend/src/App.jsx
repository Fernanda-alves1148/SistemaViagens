import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Rascunhos from "./pages/Rascunhos";
import NovaViagem from "./pages/NovaViagem";
import DetalhesViagem from "./pages/DetalhesViagem";
import ViagensSolicitadas from "./pages/ViagensSolicitadas";

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

            </Routes>

        </BrowserRouter>
    );
}

export default App;