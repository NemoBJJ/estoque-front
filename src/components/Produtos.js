import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import LeitorCodigoBarras from './LeitorCodigoBarras';
import './Produtos.css';

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({ 
    nome: '', 
    preco: '', 
    quantidade: '', 
    estoqueMinimo: '',
    categoria: '',
    codigoInterno: '',
    codigoBarras: ''
  });
  const [editandoId, setEditandoId] = useState(null);
  const [moeda, setMoeda] = useState('BRL');
  const [vendaModal, setVendaModal] = useState({ show: false, produto: null, quantidade: 1 });
  const [showLeitor, setShowLeitor] = useState(false);

  useEffect(() => {
    carregarProdutos();
  }, [moeda]);

  const carregarProdutos = async () => {
    try {
      const response = await api.get(`/produtos${moeda !== 'BRL' ? `/com-moeda?currency=${moeda}` : ''}`);
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const precoFormatado = parseFloat(String(novoProduto.preco).replace(',', '.'));
      
      if (editandoId) {
        await api.put(`/produtos/${editandoId}`, {
          nome: novoProduto.nome,
          preco: precoFormatado,
          quantidade: parseInt(novoProduto.quantidade),
          estoqueMinimo: parseInt(novoProduto.estoqueMinimo),
          categoria: novoProduto.categoria,
          codigoInterno: novoProduto.codigoInterno,
          codigoBarras: novoProduto.codigoBarras
        });
        alert('Produto atualizado com sucesso!');
      } else {
        await api.post('/produtos', {
          nome: novoProduto.nome,
          preco: precoFormatado,
          quantidade: parseInt(novoProduto.quantidade),
          estoqueMinimo: parseInt(novoProduto.estoqueMinimo),
          categoria: novoProduto.categoria,
          codigoInterno: novoProduto.codigoInterno,
          codigoBarras: novoProduto.codigoBarras
        });
        alert('Produto adicionado com sucesso!');
      }
      resetForm();
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/produtos/${id}`);
        carregarProdutos();
        alert('Produto excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto.');
      }
    }
  };

  const handleEdit = (produto) => {
    setEditandoId(produto.id);
    setNovoProduto({
      nome: produto.nome,
      preco: produto.preco,
      quantidade: produto.quantidade || 0,
      estoqueMinimo: produto.estoqueMinimo || 0,
      categoria: produto.categoria || '',
      codigoInterno: produto.codigoInterno || '',
      codigoBarras: produto.codigoBarras || ''
    });
  };

  const resetForm = () => {
    setEditandoId(null);
    setNovoProduto({ 
      nome: '', 
      preco: '', 
      quantidade: '', 
      estoqueMinimo: '',
      categoria: '',
      codigoInterno: '',
      codigoBarras: ''
    });
  };

  const realizarVenda = async () => {
    const { produto, quantidade } = vendaModal;
    if (!produto || quantidade < 1) return;
    
    const novaQuantidade = produto.quantidade - quantidade;
    if (novaQuantidade < 0) {
      alert(`Estoque insuficiente! Disponível: ${produto.quantidade}`);
      return;
    }
    
    try {
      const response = await api.get(`/produtos/${produto.id}`);
      const produtoCompleto = response.data;
      
      const produtoAtualizado = {
        ...produtoCompleto,
        quantidade: novaQuantidade
      };
      
      await api.put(`/produtos/${produto.id}`, produtoAtualizado);
      alert(`✅ Venda de ${quantidade}x ${produto.nome} realizada com sucesso!`);
      setVendaModal({ show: false, produto: null, quantidade: 1 });
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      alert('❌ Erro ao registrar venda. Verifique o console.');
    }
  };

  const handleProdutoEncontrado = (produto) => {
    setShowLeitor(false);
    setVendaModal({ show: true, produto, quantidade: 1 });
  };

  return (
    <div className="produtos-container">
      <h2>📋 Lista de Produtos</h2>

      {/* Controle de Moeda e Botão Leitor */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <label>Moeda: </label>
          <select value={moeda} onChange={(e) => setMoeda(e.target.value)}>
            <option value="BRL">Real (BRL)</option>
            <option value="USD">Dólar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>
        <button 
          onClick={() => setShowLeitor(true)} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          📷 Ler Código de Barras
        </button>
      </div>

      {/* TABELA DE PRODUTOS (AGORA EM CIMA) */}
      <div className="tabela-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th>Estoque Mínimo</th>
              <th>Categoria</th>
              <th>Cód. Interno</th>
              <th>Cód. Barras</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.id}</td>
                <td>{produto.nome}</td>
                <td>{moeda === 'BRL' ? `R$ ${produto.preco}` : `${moeda} ${produto.preco}`}</td>
                <td>{produto.quantidade !== undefined && produto.quantidade !== null ? produto.quantidade : '0'}</td>
                <td>{produto.estoqueMinimo !== undefined && produto.estoqueMinimo !== null ? produto.estoqueMinimo : '0'}</td>
                <td>{produto.categoria || '-'}</td>
                <td>{produto.codigoInterno || '-'}</td>
                <td>{produto.codigoBarras || '-'}</td>
                <td>
                  <button onClick={() => handleEdit(produto)} style={{ marginRight: '5px', backgroundColor: '#ffc107' }}>✏️</button>
                  <button onClick={() => handleDelete(produto.id)} style={{ backgroundColor: '#dc3545' }}>🗑️</button>
                  <button onClick={() => setVendaModal({ show: true, produto, quantidade: 1 })} style={{ marginLeft: '5px', backgroundColor: '#28a745' }}>💰 Vender</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORMULÁRIO DE PRODUTO (AGORA EM BAIXO) */}
      <div className="add-section">
        <h3>{editandoId ? '✏️ Editar Produto' : '➕ Novo Produto'}</h3>
        <input
          type="text"
          placeholder="Nome"
          value={novoProduto.nome}
          onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Preço"
          value={novoProduto.preco}
          onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={novoProduto.quantidade}
          onChange={(e) => setNovoProduto({ ...novoProduto, quantidade: e.target.value })}
        />
        <input
          type="number"
          placeholder="Estoque Mínimo"
          value={novoProduto.estoqueMinimo}
          onChange={(e) => setNovoProduto({ ...novoProduto, estoqueMinimo: e.target.value })}
        />
        <input
          type="text"
          placeholder="Categoria"
          value={novoProduto.categoria}
          onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}
        />
        <input
          type="text"
          placeholder="Código Interno"
          value={novoProduto.codigoInterno}
          onChange={(e) => setNovoProduto({ ...novoProduto, codigoInterno: e.target.value })}
        />
        <input
          type="text"
          placeholder="Código de Barras"
          value={novoProduto.codigoBarras}
          onChange={(e) => setNovoProduto({ ...novoProduto, codigoBarras: e.target.value })}
        />
        <button onClick={handleSubmit}>{editandoId ? 'Atualizar' : 'Adicionar'}</button>
        {editandoId && <button onClick={resetForm}>Cancelar</button>}
      </div>

      {/* Modal de Venda */}
      {vendaModal.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>💰 Vender Produto</h3>
            <p><strong>Produto:</strong> {vendaModal.produto?.nome}</p>
            <p><strong>Estoque atual:</strong> {vendaModal.produto?.quantidade}</p>
            <label>Quantidade:</label>
            <input
              type="number"
              min="1"
              max={vendaModal.produto?.quantidade}
              value={vendaModal.quantidade}
              onChange={(e) => setVendaModal({ ...vendaModal, quantidade: parseInt(e.target.value) || 1 })}
            />
            <button onClick={realizarVenda} style={{ backgroundColor: '#28a745' }}>Confirmar Venda</button>
            <button onClick={() => setVendaModal({ show: false, produto: null, quantidade: 1 })}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal do Leitor de Código de Barras */}
      {showLeitor && (
        <LeitorCodigoBarras
          onProdutoEncontrado={handleProdutoEncontrado}
          onClose={() => setShowLeitor(false)}
        />
      )}

      <div>
        <Link to="/">
          <button className="back-button">← Voltar ao Menu</button>
        </Link>
      </div>
    </div>
  );
};

export default Produtos;