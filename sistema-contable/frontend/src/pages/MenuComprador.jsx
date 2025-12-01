import React from "react";
import "../styles/Menu.css";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

export default function MenuComprador({ onLogout }) {
  return (
    <div className="page-container">
      <div className="main-content">
        <div className="menu-left">
          <img src={LogoEmpresa} alt="Logo Empresa" className="logo-empresa" />
        </div>

        <div className="menu-right">
          <button className="menu-button">
            <img src={LogoGrupo5} alt="" /> Comprobantes
          </button>
          <button className="menu-button">
            <img src={LogoGrupo5} alt="" /> Proveedores
          </button>
          <button className="menu-button">
            <img src={LogoGrupo5} alt="" /> Stock
          </button>
          <button className="menu-button">
            <img src={LogoGrupo5} alt="" /> Cuentas Corrientes
          </button>
          <button className="menu-button logout" onClick={onLogout}>Cerrar Sesión</button>
        </div>
      </div>
    </div>
  );
}
