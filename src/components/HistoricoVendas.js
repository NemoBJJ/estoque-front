import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './HistoricoVendas.css';

const HistoricoVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtroProduto, setFiltroProduto] = useState('');
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [vendasRes, resumoRes, produtosRes] = await Promise.all([
        api.get('/vendas/historico'),
        api.get('/vendas/resumo'),
        api.get('/produtos')
      ]);
      setVendas(vendasRes.data);
      setResumo(resumoRes.data);
      setProdutos(produtosRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const vendasFiltradas = filtroProduto
    ? vendas.filter(v => v.produtoId === parseInt(filtroProduto))
    : vendas;

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  if (loading) {
    return <div className="loading">Carregando histórico de vendas...</div>;
  }

  return (
    <div className="historico-container">
      <h2>📊 Histórico de Vendas</h2>

      {/* Cards de Resumo */}
      <div className="resumo-cards">
        <div className="card total-vendas">
          <h3>Total de Vendas</h3>
          <p>{resumo?.totalVendas || 0}</p>
        </div>
        <div className="card vendas-hoje">
          <h3>Vendas Hoje</h3>
          <p>{resumo?.vendasHoje || 0}</p>
          <small>{formatarMoeda(resumo?.faturamentoHoje)}</small>
        </div>
        <div className="card vendas-semana">
          <h3>Vendas (7 dias)</h3>
          <p>{resumo?.vendasSemana || 0}</p>
          <small>{formatarMoeda(resumo?.faturamentoSemana)}</small>
        </div>
        <div className="card vendas-mes">
          <h3>Vendas no Mês</h3>
          <p>{resumo?.vendasMes || 0}</p>
          <small>{formatarMoeda(resumo?.faturamentoMes)}</small>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros">
        <label>Filtrar por produto:</label>
        <select value={filtroProduto} onChange={(e) => setFiltroProduto(e.target.value)}>
          <option value="">Todos os produtos</option>
          {produtos.map(produto => (
            <option key={produto.id} value={produto.id}>
              {produto.nome}
            </option>
          ))}
        </select>
        <button onClick={carregarDados} className="btn-atualizar">🔄 Atualizar</button>
      </div>

      {/* Tabela de Vendas */}
      <div className="tabela-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço Unit.</th>
              <th>Total</th>
              <th>Data/Hora</th>
              <th>Vendedor</th>
            </tr>
          </thead>
          <tbody>
            {vendasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="7" className="nenhuma-venda">
                  Nenhuma venda registrada ainda.
                </td>
              </tr>
            ) : (
              vendasFiltradas.map((venda) => (
                <tr key={venda.id}>
                  <td>{venda.id}</td>
                  <td>{venda.produtoNome}</td>
                  <td>{venda.quantidade}</td>
                  <td>{formatarMoeda(venda.precoUnitario)}</td>
                  <td className="total-destaque">{formatarMoeda(venda.total)}</td>
                  <td>{formatarData(venda.dataVenda)}</td>
                  <td>{venda.vendedor || 'Sistema'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Botão Voltar */}
      <div className="back-button-container">
        <Link to="/">
          <button className="back-button">← Voltar ao Menu</button>
        </Link>
      </div>
    </div>
  );
};

export default HistoricoVendas;
