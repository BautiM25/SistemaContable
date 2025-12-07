import React from "react";
import "../styles/Menu.css";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// Aceptamos la función onPageChange de App.jsx
export default function MenuContador({ onLogout, onPageChange }) {
  
  // Función para cerrar el menú y abrir la página
  const handleMenuClick = (pageName) => {
    // Verificamos que la función exista antes de llamarla
    if (onPageChange) {
      onPageChange(pageName);
    }
  };

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="menu-left">
          <img src={LogoEmpresa} alt="Logo Empresa" className="logo-empresa" />
        </div>

        <div className="menu-right">
          
          {/* Botón Registrar Asiento */}
          <button 
            className="menu-button"
            onClick={() => handleMenuClick('REGISTRAR_ASIENTO')} 
          >
            <img src={LogoGrupo5} alt="" /> Registrar Asiento
          </button>
          
          {/* Botón Ver Reportes */}
          <button 
            className="menu-button"
            onClick={() => handleMenuClick('VER_REPORTES')} // Usamos un nuevo estado para reportes
          >
            <img src={LogoGrupo5} alt="" /> Ver Reportes
          </button>
          
          {/* Botón Plan de Cuentas */}
          <button 
            className="menu-button"
            onClick={() => handleMenuClick('PLAN_DE_CUENTAS')} 
          >
            <img src={LogoGrupo5} alt="" /> Plan de Cuentas
          </button>
          <button
              className="menu-item"
              onClick={() => onPageChange("LIBRO_DIARIO")} // Llama a la nueva ruta
          >
            Libro Diario
          </button>
          {/* Botón Cerrar Sesión (usa el prop onLogout) */}
          <button className="menu-button logout" onClick={onLogout}>Cerrar Sesión</button>
        </div>
      </div>
    </div>
  );
}