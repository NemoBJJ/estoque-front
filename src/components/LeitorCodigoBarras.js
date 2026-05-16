import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../api';
import './LeitorCodigoBarras.css';

const LeitorCodigoBarras = ({ onProdutoEncontrado, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [cameraSelecionada, setCameraSelecionada] = useState('');
  const html5QrCodeRef = useRef(null);
  const containerId = "scanner-container";

  useEffect(() => {
    const listarCameras = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        setCameras(devices);
        if (devices.length > 0) {
          const iriun = devices.find(d => 
            d.label.toLowerCase().includes('iriun') || 
            d.label.toLowerCase().includes('mobile') ||
            d.label.toLowerCase().includes('phone')
          );
          setCameraSelecionada(iriun ? iriun.id : devices[0].id);
        }
      } catch (err) {
        console.error("Erro ao listar câmeras:", err);
      }
    };
    listarCameras();
  }, []);

  const buscarProduto = async (codigo) => {
    try {
      const response = await api.get(`/produtos/buscar/codigo-barras/${codigo}`);
      const produtoEncontrado = response.data;
      
      // Fecha o leitor e passa o produto encontrado para o componente pai
      pararScanner();
      onClose();
      
      if (onProdutoEncontrado) {
        onProdutoEncontrado(produtoEncontrado);
      }
    } catch (error) {
      console.error("Produto não encontrado:", error);
      alert(`Código ${codigo} não encontrado!`);
    }
  };

  const pararScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      await html5QrCodeRef.current.stop();
      html5QrCodeRef.current.clear();
      setScanning(false);
    }
  };

  const iniciarScanner = async () => {
    if (!cameraSelecionada) {
      alert("Nenhuma câmera disponível!");
      return;
    }

    setScanning(true);
    
    setTimeout(async () => {
      const element = document.getElementById(containerId);
      if (!element) {
        console.error("Elemento não encontrado!");
        setScanning(false);
        return;
      }
      
      if (html5QrCodeRef.current) {
        await pararScanner();
      }
      
      html5QrCodeRef.current = new Html5Qrcode(containerId);
      
      try {
        await html5QrCodeRef.current.start(
          { deviceId: { exact: cameraSelecionada } },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText) => {
            console.log("✅ Código lido:", decodedText);
            await buscarProduto(decodedText);
          },
          (errorMessage) => {
            // Ignora erros de leitura
          }
        );
      } catch (err) {
        console.error("Erro ao iniciar scanner:", err);
        alert("Erro ao acessar a câmera.");
        setScanning(false);
      }
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="leitor-modal">
      <div className="leitor-content">
        <div className="leitor-header">
          <h3>📷 Leitor de Código de Barras</h3>
          <button className="close-btn" onClick={() => {
            pararScanner();
            onClose();
          }}>✖</button>
        </div>
        <div className="leitor-body">
          {!scanning ? (
            <div className="leitor-start">
              <p>Aponte a câmera para o código de barras</p>
              
              <div className="camera-selector">
                <label>📷 Selecione a câmera:</label>
                <select 
                  value={cameraSelecionada} 
                  onChange={(e) => setCameraSelecionada(e.target.value)}
                  disabled={scanning}
                >
                  {cameras.map(cam => (
                    <option key={cam.id} value={cam.id}>
                      {cam.label || `Câmera ${cam.id.substring(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>
              
              <button className="btn-scan" onClick={iniciarScanner}>
                ▶ Iniciar Leitura
              </button>
            </div>
          ) : (
            <div>
              <div id={containerId} style={{ width: "100%", height: "auto", borderRadius: "8px", overflow: "hidden" }}></div>
              <button className="btn-stop" onClick={pararScanner}>
                ⏹ Parar Leitura
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeitorCodigoBarras;