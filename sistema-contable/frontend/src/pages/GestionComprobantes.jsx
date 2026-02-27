import React from "react";
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

export default function GestionComprobantes({ onPageChange }) {

    // Función para manejar la navegación
    const handleActionClick = (pageName) => {
        if (onPageChange) {
            onPageChange(pageName);
        }
    };
    
    // Regresa al menú principal del comprador
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
                            <h2 className="asiento-title">Gestión de Comprobantes</h2> 
                        </div>
                    </div>

                    {/* BODY: Botones de Gestión de Comprobantes */}
                    <div className="asiento-body gestion-body"> 
                        <h3 className="partidas-title">Seleccione el tipo de comprobante</h3>
                        
                        <div className="gestion-buttons-container">
                            
                            {/* Solicitud de Compra */}
                            <button 
                                className="menu-button gestion-button primary-button"
                                onClick={() => handleActionClick('SOLICITUD_COMPRA')} 
                            >
                                <img src={LogoGrupo5} alt="Icono Solicitud" /> Solicitud de Compra
                            </button>
                            
                            {/* Orden de Compra - AHORA ACTIVO */}
                            <button 
                                className="menu-button gestion-button secondary-button"
                                onClick={() => handleActionClick('ORDEN_COMPRA')}
                            >
                                <img src={LogoGrupo5} alt="Icono Orden" /> Orden de Compra
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
                            Volver al Menú
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}