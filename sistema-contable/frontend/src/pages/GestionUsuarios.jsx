import React from "react";
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// Aceptamos onPageChange como prop
export default function GestionUsuarios({ onPageChange }) {

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
                            <h2 className="asiento-title">Gestión de Usuarios</h2>
                        </div>
                    </div>

                    {/* BODY: Contenedor de Botones de Gestión */}
                    <div className="asiento-body gestion-body"> 
                        <h3 className="partidas-title">Seleccione una acción</h3>
                        
                        <div className="gestion-buttons-container">
                            
                            <button 
                                className="menu-button gestion-button primary-button"
                                // CLAVE: Navegación a la vista de Alta
                                onClick={() => handleActionClick('ALTA_USUARIO')} 
                            >
                                <img src={LogoGrupo5} alt="Icono Alta" /> Alta Usuario
                            </button>
                            
                            <button 
                                className="menu-button gestion-button danger-button"
                                // CLAVE: Navegación a la vista de Baja
                                onClick={() => handleActionClick('BAJA_USUARIO')} 
                            >
                                <img src={LogoGrupo5} alt="Icono Baja" /> Baja Usuario
                            </button>

                        </div>
                    </div>

                    {/* FOOTER: Botón Volver */}
                    <div className="asiento-footer single-button-footer">
                        <button 
                            className="action-button icon-with-text back-button-footer"
                            onClick={handleVolver} // CLAVE: Navegación a DASHBOARD
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