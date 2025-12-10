import React from "react";
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// Renombramos el componente para ser Gestión de Proveedores
export default function GestionProveedores({ onPageChange }) {

    // Función para manejar el clic en los botones de acción
    const handleActionClick = (pageName) => {
        if (onPageChange) {
            onPageChange(pageName);
        }
    };
    
    // Función para manejar el clic en Volver (regresa al menú principal)
    const handleVolver = () => {
        if (onPageChange) {
            onPageChange("DASHBOARD"); 
        }
    };

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    {/* HEADER */}
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo Empresa" className="logo-small" />
                            <h2 className="asiento-title">Gestión de Proveedores</h2> 
                        </div>
                    </div>

                    {/* BODY: Contenedor de Botones de Gestión */}
                    <div className="asiento-body gestion-body"> 
                        <h3 className="partidas-title">Seleccione una acción</h3>
                        
                        <div className="gestion-buttons-container">
                            
                            {/* 🚨 1. CONTENEDOR HORIZONTAL para Carga y Activar */}
                            <div className="horizontal-button-group"> 
                                {/* Carga / Alta (Mantiene el funcionamiento actual) */}
                                <button 
                                    className="menu-button gestion-button primary-button half-width-button"
                                    onClick={() => handleActionClick('CARGA_PROVEEDOR')} 
                                >
                                    <img src={LogoGrupo5} alt="Icono Carga" /> Carga / Alta
                                </button>
                                
                                {/* Nuevo Botón: Activar Proveedor */}
                                <button 
                                    className="menu-button gestion-button primary-button half-width-button activate-button"
                                    onClick={() => handleActionClick('ACTIVAR_PROVEEDOR')} 
                                >
                                    <img src={LogoGrupo5} alt="Icono Activar" /> Activar
                                </button>
                            </div>
                            
                            {/* 2. MODIFICACIÓN (Mantener si existe en el flujo original) */}
                             <button 
                                className="menu-button gestion-button secondary-button"
                                onClick={() => handleActionClick('MODIFICACION_PROVEEDOR')}
                            >
                                <img src={LogoGrupo5} alt="Icono Modificación" /> Modificación
                            </button>
                            
                            {/* 3. BAJA */}
                            <button 
                                className="menu-button gestion-button danger-button"
                                onClick={() => handleActionClick('BAJA_PROVEEDOR')} 
                            >
                                <img src={LogoGrupo5} alt="Icono Baja" /> Baja
                            </button>
                            
                            {/* 4. VISUALIZACIÓN */}
                            <button 
                                className="menu-button gestion-button secondary-button"
                                onClick={() => handleActionClick('VER_PROVEEDORES')}
                            >
                                <img src={LogoGrupo5} alt="Icono Ver" /> Ver Proveedores
                            </button>

                        </div>
                    </div>

                    {/* FOOTER: Botón Volver */}
                    <div className="asiento-footer single-button-footer">
                        <button 
                            className="action-button icon-with-text back-button-footer"
                            onClick={handleVolver} 
                        >
                            <img src={LogoGrupo5} alt="Icono Volver" className="icon-small" /> 
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}