import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Vendas.css';

const Vendas = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState('');
  const [cep, setCep] = useState('');
  const [freteResultado, setFreteResultado] = useState(null);
  const [pagamentoResultado, setPagamentoResultado] = useState(null);
  const [sincronizando, setSincronizando] = useState(false);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const calcularFrete = async () => {
    if (!produtoId || !cep) {
      alert('Selecione um produto e informe o CEP');
      return;
    }
    try {
      const response = await api.get(`/vendas/calcular-frete/${produtoId}?cep=${cep}`);
      setFreteResultado(response.data);
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      alert('Erro ao calcular frete. Verifique o CEP.');
    }
  };

  const simularPagamento = async () => {
    if (!produtoId) {
      alert('Selecione um produto');
      return;
    }
    try {
      const response = await api.get(`/vendas/simular-pagamento/${produtoId}`);
      setPagamentoResultado(response.data);
    } catch (error) {
      console.error('Erro ao simular pagamento:', error);
    }
  };

  const sincronizarProdutos = async () => {
    setSincronizando(true);
    try {
      const response = await api.get('/vendas/sincronizar');
      alert('Produtos sincronizados com sucesso!');
      console.log(response.data);
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      alert('Erro ao sincronizar produtos');
    } finally {
      setSincronizando(false);
    }
  };

  const produtoSelecionado = produtos.find(p => p.id === parseInt(produtoId));

  return (
    <div className="vendas-container">
      <h2>💰 Vendas / Frete / Pagamento</h2>

      <div className="frete-section">
        <h3>🚚 Calcular Frete</h3>
        <select value={produtoId} onChange={(e) => setProdutoId(e.target.value)}>
          <option value="">Selecione um produto</option>
          {produtos.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="CEP (ex: 01001000)"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
        />
        <button onClick={calcularFrete}>Calcular Frete</button>
        {freteResultado && (
          <div className="resultado">
            <strong>Resultado:</strong><br />
            Produto: {freteResultado.produto}<br />
            Frete: R$ {parseFloat(freteResultado.frete).toFixed(2)}<br />
            Distância: {freteResultado.distancia_km} km<br />
            CEP: {freteResultado.cep}
          </div>
        )}
      </div>

      <div className="pagamento-section">
        <h3>💳 Simular Pagamento</h3>
        {produtoSelecionado && <p>Produto: {produtoSelecionado.nome}</p>}
        <button onClick={simularPagamento}>Simular Pagamento</button>
        {pagamentoResultado && (
          <div className="resultado">
            <strong>Resultado:</strong><br />
            Produto: {pagamentoResultado.produto}<br />
            Preço Original: R$ {parseFloat(pagamentoResultado.preco_original).toFixed(2)}<br />
            Valor Final (com taxa 10%): R$ {parseFloat(pagamentoResultado.valor_final).toFixed(2)}
          </div>
        )}
      </div>

      <div className="sincronizar">
        <button onClick={sincronizarProdutos} disabled={sincronizando}>
          {sincronizando ? 'Sincronizando...' : '🔄 Sincronizar Produtos'}
        </button>
      </div>

      <div>
        <Link to="/">
          <button className="back-button">← Voltar ao Menu</button>
        </Link>
      </div>
    </div>
  );
};

export default Vendas;
