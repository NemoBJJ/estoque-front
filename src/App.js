import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Produtos from './components/Produtos';
import Vendas from './components/Vendas';
import LeitorCodigoBarras from './components/LeitorCodigoBarras';
import HistoricoVendas from './components/HistoricoVendas';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />

        <Route path="/produtos" element={<Produtos />} />
        <Route path="/produtos/listar" element={<Produtos />} />
        <Route path="/produtos/criar" element={<Produtos />} />
        <Route path="/produtos/buscar" element={<Produtos />} />
        <Route path="/produtos/editar" element={<Produtos />} />
        <Route path="/produtos/deletar" element={<Produtos />} />
        <Route path="/produtos/moeda" element={<Produtos />} />

        <Route
          path="/produtos/ler-codigo-barras"
          element={
            <LeitorCodigoBarras
              onProdutoEncontrado={(produto) => {
                console.log('Produto encontrado:', produto);
              }}
              onClose={() => {
                window.location.href = '/produtos/listar';
              }}
            />
          }
        />

        <Route
          path="/leitor-codigo-barras"
          element={
            <LeitorCodigoBarras
              onProdutoEncontrado={(produto) => {
                console.log('Produto encontrado:', produto);
              }}
              onClose={() => {
                window.location.href = '/produtos/listar';
              }}
            />
          }
        />

        <Route path="/vendas" element={<Vendas />} />
        <Route path="/vendas/sincronizar" element={<Vendas />} />
        <Route path="/vendas/simular-pagamento" element={<Vendas />} />
        <Route path="/vendas/calcular-frete" element={<Vendas />} />
        <Route path="/historico-vendas" element={<HistoricoVendas />} />

        <Route path="/auth/*" element={<Menu />} />
        <Route path="/currency/*" element={<Menu />} />

        <Route path="*" element={<Menu />} />
      </Routes>
    </Router>
  );
}

export default App;