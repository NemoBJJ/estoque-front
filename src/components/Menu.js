import React from "react";
import { Link } from "react-router-dom";
import "./Menu.css";

const Menu = () => {
  return (
    <div className="estoque-home">
      <div className="estoque-hero">
        <span className="estoque-badge">GesteX</span>
        <h1>ESTOQUE</h1>
        <p>Controle de produtos, vendas e histórico operacional.</p>
      </div>

      <div className="estoque-cards">
        <Link to="/produtos/listar" className="estoque-card produtos-card">
          <div className="card-icon">📦</div>
          <h2>Produtos</h2>
          <p>Visualizar produtos cadastrados, gerenciar CRUD e usar código de barras.</p>
          <span>Acessar →</span>
        </Link>

        <Link to="/historico-vendas" className="estoque-card historico-card">
          <div className="card-icon">📊</div>
          <h2>Histórico de Vendas</h2>
          <p>Consultar vendas realizadas, totais, filtros e resumo financeiro.</p>
          <span>Acessar →</span>
        </Link>
      </div>
    </div>
  );
};

export default Menu;