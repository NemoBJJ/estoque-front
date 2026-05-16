import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

const Menu = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📦 Estoque </h1>
      <div className="cards-grid">
        <Link to="/produtos" className="card">
          <div className="card-icon">📦</div>
          <h2>Produtos</h2>
          <p></p>
        </Link>
        
        <Link to="/vendas" className="card">
          <div className="card-icon">💰</div>
          <h2>Vendas / Frete</h2>
          <p></p>
        </Link>
        
        <Link to="/historico" className="card">
          <div className="card-icon">📜</div>
          <h2>Histórico de Vendas</h2>
          <p></p>
        </Link>
      </div>
    </div>
  );
};

export default Menu;