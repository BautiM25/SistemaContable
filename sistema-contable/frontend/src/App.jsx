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
import GestionProveedores from "./pages/GestionProveedores.jsx";
import CargaProveedor from "./pages/CargaProveedor.jsx";
import ModificacionProveedor from "./pages/ModificacionProveedor.jsx";
import BajaProveedor from "./pages/BajaProveedores.jsx";
import ActivarProveedor from "./pages/ActivarProveedor.jsx";
import VerProveedores from "./pages/VerProveedores.jsx";
import ConsultaProveedor from "./pages/ConsultaProveedor.jsx";
import VerReportes from "./pages/VerReportes.jsx";
import SolicitudCompra from "./pages/SolicitudCompra.jsx";
import GestionComprobantes from "./pages/GestionComprobantes.jsx";

import GestionStock from "./pages/GestionStock.jsx";
// Descomenta a medida que crees los archivos:
import AltaArticulo from "./pages/AltaArticulos.jsx";
import ModificacionArticulo from "./pages/ModificacionArticulos.jsx";
import BajaArticulos from "./pages/BajaArticulos.jsx";
import ActivarArticulo from "./pages/ActivarArticulo.jsx";
import VerArticulos from "./pages/VerArticulos.jsx";
import ConsultaArticulo from "./pages/ConsultaArticulo.jsx";


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
  const [nextPageState, setNextPageState] = useState(null);

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

  const handlePageChange = (pageName, state = null) => {
    setCurrentPage(pageName);
    setNextPageState(state); // 👈 Almacena los datos del proveedor
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
      case "SOLICITUD_COMPRA":
        return <SolicitudCompra onPageChange={handlePageChange} />;
      case "GESTION_COMPROBANTES":
        return <GestionComprobantes onPageChange={handlePageChange} />;
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

      case "GESTION_PROVEEDORES":
        return <GestionProveedores onPageChange={handlePageChange} />;
      case "CARGA_PROVEEDOR":
        return <CargaProveedor onPageChange={handlePageChange} />;
      case "MODIFICACION_PROVEEDOR":
        return <ModificacionProveedor onPageChange={handlePageChange} />;
      case "BAJA_PROVEEDOR":
        return <BajaProveedor onPageChange={handlePageChange} />;
      case "ACTIVAR_PROVEEDOR":
        return <ActivarProveedor onPageChange={handlePageChange} />;
      case "VER_PROVEEDORES":
        return <VerProveedores onPageChange={handlePageChange} />;
      case "CONSULTA_PROVEEDOR": // (Consulta de Detalle)
        return <ConsultaProveedor 
              onPageChange={handlePageChange} 
              initialData={nextPageState} // 👈 USA el estado que acabamos de actualizar
          />;
      // Si la página no coincide con ninguna vista de contenido específica,
      // o si es la página de inicio ("DASHBOARD"), renderizamos el MENÚ.

      case "GESTION_STOCK": 
        return <GestionStock onPageChange={handlePageChange} />;
      case "ALTA_ARTICULO": 
        return <AltaArticulo onPageChange={handlePageChange} />;
      case "ACTIVAR_ARTICULO": 
        return <ActivarArticulo onPageChange={handlePageChange} />;
      case "BAJA_ARTICULO": 
        return <BajaArticulos onPageChange={handlePageChange} />;
      case "MODIFICACION_ARTICULO": 
        return <ModificacionArticulo onPageChange={handlePageChange} id={nextPageState?.id} />;
      case "VER_ARTICULOS": 
        return <VerArticulos onPageChange={handlePageChange} />;
      case "CONSULTA_ARTICULO":
        return <ConsultaArticulo 
              onPageChange={handlePageChange} 
              id={nextPageState?.id} // 👈 PASAMOS SOLO EL ID, no todo el objeto
          />;

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