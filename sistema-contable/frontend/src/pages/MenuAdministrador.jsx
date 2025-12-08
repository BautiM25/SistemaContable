import React from "react";
import "../styles/Menu.css";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// Aceptamos la función onPageChange de App.jsx
export default function MenuAdministrador({ onLogout, onPageChange }) {
  
  // Función para cerrar el menú y abrir la página
  const handleMenuClick = (pageName) => {
    onPageChange(pageName);
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
          
          <button className="menu-button">
            <img src={LogoGrupo5} alt="" /> Ver Reportes
          </button>
          
          {/* BOTÓN: Gestión de Usuarios */}
          <button 
            className="menu-button"
            onClick={() => handleMenuClick('GESTION_USUARIOS')} 
          >
            <img src={LogoGrupo5} alt="" /> Gestión de Usuarios
          </button>
          
          {/* BOTÓN CLAVE: Plan de Cuentas */}
          <button 
            className="menu-button"
            onClick={() => handleMenuClick('PLAN_DE_CUENTAS')} // Enviamos la señal
          >
            <img src={LogoGrupo5} alt="" /> Plan de Cuentas
          </button>
          
          <button 
            className="menu-button"
            onClick={() => handleMenuClick('GESTION_CUENTAS')} 
          >
            <img src={LogoGrupo5} alt="" /> Gestion de Cuentas
          </button>
          <button
              className="menu-item"
              onClick={() => onPageChange("LIBRO_DIARIO")} // Llama a la nueva ruta
          >
            Libro Diario
          </button>
          <button
              className="menu-button"
              onClick={() => handleMenuClick('SOLICITUD_COMPRA')}
          >
            <img src={LogoGrupo5} alt="" /> Solicitud de Compra
          </button>
          <button className="menu-button logout" onClick={onLogout}>Cerrar Sesión</button>
        </div>
      </div>
    </div>
  );
}