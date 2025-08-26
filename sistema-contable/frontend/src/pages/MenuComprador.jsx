import React from "react";
import "../styles/MenuAdministrador.css";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

export default function MenuComprador() {
  return (
    <div className="page-container">
      <div className="menu-admin">
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
          <button className="menu-button logout">Cerrar Sesión</button>
        </div>
      </div>
    </div>
  );
}
