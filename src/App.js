import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Produtos from './components/Produtos';
import Vendas from './components/Vendas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/vendas" element={<Vendas />} />
      </Routes>
    </Router>
  );
}

export default App;
