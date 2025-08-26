import React, { useState } from "react";
import "../styles/Login.css";
import LogoEmpresa from "../assets/LogoEmpresa.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Usuario: ${username}\nContraseña: ${password}`);
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      <div className="login-box">
        <div className="login-logo-container">
          <img src={LogoEmpresa} alt="Logo Empresa" className="login-logo" />
        </div>
        <form onSubmit={handleLogin}>
          <input
            className="input"
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="button login-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
