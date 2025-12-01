import React, { useState } from "react";
import api from "../services/api";
import "../styles/Login.css";
import LogoEmpresa from "../assets/LogoEmpresa.png";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/usuarios/auth", {
        nombreUsuario: username,
        contrasenia: password,
      });

      // Log para verificar la respuesta del backend
      console.log("Login response:", res.data);

      // Acceso explícito al token y rol
      const token = res.data.token;
      const rol = res.data.rol;

      console.log("Token:", token, "Rol:", rol);

      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);

      onLogin(token, rol);
    } catch (err) {
      console.error("Error de login:", err);
      if (err.response) {
        if (err.response.status === 401) {
          setError("Usuario o contraseña incorrectos");
        } else {
          setError(`Error del servidor: ${err.response.status}`);
        }
      } else if (err.request) {
        setError("No se pudo conectar con el servidor. Verifique su conexión.");
      } else {
        setError("Error inesperado: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="login-container">
        <div className="login-background"></div>
        <div className="login-box">
          <div className="login-logo-container">
            <img src={LogoEmpresa} alt="Logo Empresa" className="login-logo" />
          </div>
          <h2 className="login-title">ElectroAndes</h2>
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
            <button
                type="submit"
                className="button login-button"
                disabled={isLoading}
            >
              {isLoading ? "Cargando..." : "Entrar"}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
  );
}
