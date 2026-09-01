import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ChartColumn,
  LogOut,
  House
} from "lucide-react";
import "./Menu.css";

const AUTH_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8087"
    : "https://auth.neemindev.com";

const Menu = () => {
  const [saindo, setSaindo] = useState(false);

  const voltarAoGestex = () => {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      window.location.href = "/";
    } else {
      window.location.href = "https://gestex.neemindev.com";
    }
  };

  const logout = async () => {
    try {
      setSaindo(true);

      await fetch(`${AUTH_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Erro ao encerrar sessão:", error);
    } finally {
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        window.location.href = "/";
      } else {
        window.location.href =
          "https://gestex.neemindev.com/login?redirect=estoque";
      }
    }
  };

  return (
    <div className="estoque-home">

      <div
        style={{
          position: "absolute",
          top: "24px",
          right: "24px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button
          type="button"
          onClick={voltarAoGestex}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.06)",
            color: "#ffffff",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          <House size={18} />
          Voltar ao GesteX
        </button>

        <button
          type="button"
          onClick={logout}
          disabled={saindo}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.06)",
            color: "#ffffff",
            cursor: saindo ? "default" : "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          <LogOut size={18} />
          {saindo ? "Saindo..." : "Sair"}
        </button>
      </div>

      <div className="estoque-hero">
        <span className="estoque-badge">GesteX</span>

        <h1>ESTOQUE</h1>

        <p>Controle de produtos, vendas e histórico operacional.</p>
      </div>

      <div className="estoque-cards">

        <Link
          to="/produtos/listar"
          className="estoque-card produtos-card"
        >
          <div className="card-icon">
            <Package size={48} strokeWidth={2} />
          </div>

          <h2>Produtos</h2>
        </Link>

        <Link
          to="/historico-vendas"
          className="estoque-card historico-card"
        >
          <div className="card-icon">
            <ChartColumn size={48} strokeWidth={2} />
          </div>

          <h2>Histórico de Vendas</h2>
        </Link>

      </div>
    </div>
  );
};

export default Menu;