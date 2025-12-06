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
    
    // Si la página es Registrar Asiento, le pasamos el handler de cambio de página
    if (currentPage === "REGISTRAR_ASIENTO") {
        // CLAVE: Pasamos onPageChange
        return <RegistrarAsiento onPageChange={handlePageChange} />;
    }

    if (currentPage === "GESTION_USUARIOS") {
      // Pasa onPageChange para que el botón "Volver" pueda regresar al menú
      return <GestionDeUsuarios onPageChange={handlePageChange} />; 
    }

    if (currentPage === "ALTA_USUARIO") {
      return <AltaUsuarios onPageChange={handlePageChange} />;
  } else if (currentPage === "BAJA_USUARIO") {
      return <BajaUsuarios onPageChange={handlePageChange} />;
  } else if (currentPage === "GESTION_USUARIOS") {
      return <GestionDeUsuarios onPageChange={handlePageChange} />; // La vista actual
  } else if (currentPage === "GESTION_CUENTAS") {
    // Pasa onPageChange para que el botón "Volver" funcione
    return <GestionDeCuentas onPageChange={handlePageChange} />; 
  } else if (currentPage === "ALTA_CUENTA") {
    return <AltaCuentas onPageChange={handlePageChange} />;
} else if (currentPage === "BAJA_CUENTA") {
    return <BajaCuentas onPageChange={handlePageChange} />;
} else if (currentPage === "MODIFICACION_CUENTA") {
    return <ModificacionCuentas onPageChange={handlePageChange} />;
} else if (currentPage === "PLAN_DE_CUENTAS") {
  return <PlanDeCuentas onPageChange={handlePageChange} />; 
}
    // ... (Añadir más páginas aquí) ...
    
    // Si estamos en el DASHBOARD (el menú), mostramos el layout del menú
    switch (rol) {
        case "ADMINISTRADOR":
            // Pasamos el handler para que el menú pueda cambiar el estado de la página
            return <MenuAdministrador onLogout={handleLogout} onPageChange={handlePageChange} />;
        case "CONTADOR":
            // Pasamos el handler para que el menú pueda cambiar el estado de la página
            return <MenuContador onLogout={handleLogout} onPageChange={handlePageChange} />;
        case "COMPRADOR":
            // Pasamos el handler para que el menú pueda cambiar el estado de la página
            return <MenuComprador onLogout={handleLogout} onPageChange={handlePageChange} />;
        default:
            return <p>Rol no reconocido</p>;
    }
};


  console.log("Token:", token, "Rol normalizado:", rol);
  
  // Renderizamos el contenido basado en la lógica anterior
  return renderContent(rol); 
}

export default App;