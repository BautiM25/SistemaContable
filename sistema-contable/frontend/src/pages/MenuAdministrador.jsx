import React from "react";
import "../styles/MenuAdministrador.css";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

export default function MenuAdministrador({ onLogout }) {
  return (
      <div className="page-container">
        <div className="menu-admin">
          <div className="menu-left">
            <img src={LogoEmpresa} alt="Logo Empresa" className="logo-empresa" />
          </div>

          <div className="menu-right">
            <button className="menu-button">
              <img src={LogoGrupo5} alt="" /> Registrar Asiento
            </button>
            <button className="menu-button">
              <img src={LogoGrupo5} alt="" /> Ver Reportes
            </button>
            <button className="menu-button">
              <img src={LogoGrupo5} alt="" /> Gestión de Usuarios
            </button>
            <button className="menu-button">
              <img src={LogoGrupo5} alt="" /> Plan de Cuentas
            </button>
            <button className="menu-button">
              <img src={LogoGrupo5} alt="" /> Configuración
            </button>
            <button className="menu-button logout" onClick={onLogout}>Cerrar Sesión</button>
          </div>
        </div>
      </div>
  );
}
