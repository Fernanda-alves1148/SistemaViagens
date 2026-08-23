import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import Dashboard from './pages/dashboard/dashboard';
import PlanejarViagem from './pages/PlanejarViagem/planejarviagens';
import RegistrarDespesas from './pages/RegistrarDespesas/registrardespesas';
import AprovarViagem from './pages/AprovarViagens/aprovarviagens';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="planejar" element={<PlanejarViagem />} />
          <Route path="despesas" element={<RegistrarDespesas />} />
          <Route path="aprovar" element={<AprovarViagem />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;