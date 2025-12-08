import React from "react";
import "../styles/Menu.css"; // Reutilizamos estilos de menú
import "../styles/GestionUsuarios.css"; // Reutilizamos estilos de gestión
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// Aceptamos onPageChange para la navegación y onLogout si fuera un menú principal
export default function GestionProveedores({ onPageChange }) {
    
    // Función para manejar el clic y cambiar la página
    const handleMenuClick = (pageName) => {
        if (onPageChange) {
            onPageChange(pageName);
        }
    };

    // Función para volver al menú principal (DASHBOARD)
    const handleVolver = () => {
        handleMenuClick("DASHBOARD");
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
                        <h3 className="partidas-title">Seleccione una acción para Proveedores</h3>
                        
                        <div className="gestion-buttons-container">
                            
                            {/* 1. CARGA/ALTA */}
                            <button 
                                className="menu-button gestion-button primary-button"
                                onClick={() => handleMenuClick('CARGA_PROVEEDOR')}
                            >
                                <img src={LogoGrupo5} alt="Icono Carga" /> Carga / Alta
                            </button>
                            
                            {/* 2. MODIFICACIÓN */}
                            <button 
                                className="menu-button gestion-button secondary-button"
                                onClick={() => handleMenuClick('MODIFICACION_PROVEEDOR')}
                            >
                                <img src={LogoGrupo5} alt="Icono Modificación" /> Modificación
                            </button>
                            
                            {/* 3. BAJA */}
                            <button 
                                className="menu-button gestion-button danger-button"
                                onClick={() => handleMenuClick('BAJA_PROVEEDOR')}
                            >
                                <img src={LogoGrupo5} alt="Icono Baja" /> Baja
                            </button>
                            
                            {/* 4. VISUALIZACIÓN */}
                            <button 
                                className="menu-button gestion-button secondary-button"
                                onClick={() => handleMenuClick('VER_PROVEEDORES')}
                                style={{ backgroundColor: '#2f8f94' }} // Estilo distintivo
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