import React, { useState, useEffect } from "react";
import Login from "./pages/Login.jsx";
import MenuAdministrador from "./pages/MenuAdministrador.jsx";
import MenuComprador from "./pages/MenuComprador.jsx";
import MenuContador from "./pages/MenuContador.jsx";
import React from "react";
import DemoUI from "./pages/AltaUsuario.jsx";

function App() {
  const [token, setToken] = useState(null);
  const [rol, setRol] = useState("");

  // Al iniciar, leemos localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRol = localStorage.getItem("rol");

    if (storedToken) setToken(storedToken);
    if (storedRol) setRol(storedRol.trim().toUpperCase());
  }, []);

  const handleLogin = (newToken, newRol) => {
    console.log("Login recibido:", newToken, newRol);
    localStorage.setItem("token", newToken);
    localStorage.setItem("rol", newRol);
    setToken(newToken);
    setRol(newRol.trim().toUpperCase()); // normalizamos
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    setToken(null);
    setRol("");
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  console.log("Token:", token, "Rol normalizado:", rol);

  switch (rol) {
    case "ADMINISTRADOR":
      return <MenuAdministrador onLogout={handleLogout} />;
    case "COMPRADOR":
      return <MenuComprador onLogout={handleLogout} />;
    case "CONTADOR":
      return <MenuContador onLogout={handleLogout} />;
    default:
      return <p>Rol no reconocido</p>;
  }
}

export default App;
