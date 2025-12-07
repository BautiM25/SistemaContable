import React, { useState, useEffect } from "react";
import Login from "./pages/Login.jsx";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import MenuAdministrador from "./pages/MenuAdministrador.jsx";
import MenuComprador from "./pages/MenuComprador.jsx";
import MenuContador from "./pages/MenuContador.jsx";
import RegistrarAsiento from "./pages/RegistrarAsiento.jsx";
import GestionDeUsuarios from "./pages/GestionUsuarios.jsx";
import AltaUsuarios from "./pages/AltaUsuario.jsx";
import BajaUsuarios from "./pages/BajaUsuario.jsx";
import GestionDeCuentas from "./pages/GestionDeCuentas.jsx";
import AltaCuentas from "./pages/AltaCuentas.jsx";
import BajaCuentas from "./pages/BajaCuentas.jsx";
import ModificacionCuentas from "./pages/ModificacionCuentas.jsx";
import PlanDeCuentas from "./pages/PlanDeCuentas.jsx";
//import VerReportes from "./pages/VerReportes.jsx";

const AdminLayout = ({ onLogout }) => (
  // Nota: MenuAdministrador debe aceptar 'children' o usar Outlet.
  <MenuAdministrador onLogout={onLogout}> 
    <Outlet /> 
  </MenuAdministrador>
);


function App() {
  const [token, setToken] = useState(null);
  const [rol, setRol] = useState("");
  const [currentPage, setCurrentPage] = useState("DASHBOARD");

  // Al iniciar, leemos localStorage
  /*useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRol = localStorage.getItem("rol");

    if (storedToken) setToken(storedToken);
    if (storedRol) setRol(storedRol.trim().toUpperCase());
  }, []);
  */

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

  const handlePageChange = (pageName) => {
    setCurrentPage(pageName);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  // Función que decide qué componente de contenido mostrar
  const renderContent = (rol) => {
    // Primero, definimos qué componente de PÁGINA se debe renderizar.
    // La variable 'onPageChange' se pasa a TODAS las vistas de contenido.
    
    switch (currentPage) {
      // Vistas Contables
      case "REGISTRAR_ASIENTO":
        return <RegistrarAsiento onPageChange={handlePageChange} />;
      case "PLAN_DE_CUENTAS":
        return <PlanDeCuentas onPageChange={handlePageChange} />;
      
      // Gestión de Usuarios
      case "GESTION_USUARIOS":
        // Nota: GESTION_USUARIOS es la página de índice (botones), no un formulario.
        return <GestionDeUsuarios onPageChange={handlePageChange} />;
      case "ALTA_USUARIO":
        return <AltaUsuarios onPageChange={handlePageChange} />;
      case "BAJA_USUARIO":
        return <BajaUsuarios onPageChange={handlePageChange} />;
      // Añadir: case "MODIFICACION_USUARIO":
        
      // Gestión de Cuentas
      case "GESTION_CUENTAS":
        return <GestionDeCuentas onPageChange={handlePageChange} />;
      case "ALTA_CUENTA":
        return <AltaCuentas onPageChange={handlePageChange} />;
      case "BAJA_CUENTA":
        return <BajaCuentas onPageChange={handlePageChange} />;
      case "MODIFICACION_CUENTA":
        return <ModificacionCuentas onPageChange={handlePageChange} />;
      
      //Reportes
      case "VER_REPORTES":
        return <VerReportes onPageChange={handlePageChange} />;
      // Si la página no coincide con ninguna vista de contenido específica,
      // o si es la página de inicio ("DASHBOARD"), renderizamos el MENÚ.
      case "DASHBOARD":
      default:
        switch (rol) {
          case "ADMINISTRADOR":
            return <MenuAdministrador onLogout={handleLogout} onPageChange={handlePageChange} />;
          case "CONTADOR":
            return <MenuContador onLogout={handleLogout} onPageChange={handlePageChange} />;
          case "COMPRADOR":
            return <MenuComprador onLogout={handleLogout} onPageChange={handlePageChange} />;
          default:
            return <p>Rol no reconocido</p>;
        }
    }
  };


  console.log("Token:", token, "Rol normalizado:", rol);
  
  // Renderizamos el contenido basado en la lógica anterior
  return renderContent(rol); 
}

export default App;