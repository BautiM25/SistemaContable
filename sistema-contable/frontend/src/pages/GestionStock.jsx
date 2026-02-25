import React from "react";
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

export default function GestionStock({ onPageChange }) {

    // Función para navegar entre sub-vistas de Stock
    const handleActionClick = (pageName) => {
        if (onPageChange) {
            onPageChange(pageName);
        }
    };
    
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
                            <h2 className="asiento-title">Gestión de Stock y Artículos</h2> 
                        </div>
                    </div>

                    {/* BODY: Botones de Gestión de Inventario */}
                    <div className="asiento-body gestion-body"> 
                        <h3 className="partidas-title">Control de Inventario</h3>
                        
                        <div className="gestion-buttons-container">
                            
                            {/* Grupo Horizontal: Carga y Reactivación */}
                            <div className="horizontal-button-group"> 
                                <button 
                                    className="menu-button gestion-button primary-button half-width-button"
                                    onClick={() => handleActionClick('ALTA_ARTICULO')} 
                                >
                                    <img src={LogoGrupo5} alt="Alta" /> Nuevo Artículo
                                </button>
                                
                                <button 
                                    className="menu-button gestion-button primary-button half-width-button activate-button"
                                    onClick={() => handleActionClick('ACTIVAR_ARTICULO')} 
                                >
                                    <img src={LogoGrupo5} alt="Activar" /> Activar / Recuperar
                                </button>
                            </div>
                            
                            {/* Modificación de Precios o Datos Técnicos */}
                            <button 
                                className="menu-button gestion-button secondary-button"
                                onClick={() => handleActionClick('MODIFICACION_ARTICULO')}
                            >
                                <img src={LogoGrupo5} alt="Modificar" /> Editar Artículo
                            </button>
                            
                            {/* Baja de Producto (Obsoleto o Fuera de línea) */}
                            <button 
                                className="menu-button gestion-button danger-button"
                                onClick={() => handleActionClick('BAJA_ARTICULO')} 
                            >
                                <img src={LogoGrupo5} alt="Baja" /> Dar de Baja
                            </button>
                            
                            {/* Explorador de Inventario / Stock Real */}
                            <button 
                                className="menu-button gestion-button secondary-button"
                                onClick={() => handleActionClick('VER_ARTICULOS')}
                            >
                                <img src={LogoGrupo5} alt="Ver" /> Ver Stock / Listado
                            </button>

                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="asiento-footer single-button-footer">
                        <button 
                            className="action-button icon-with-text back-button-footer"
                            onClick={handleVolver} 
                        >
                            <img src={LogoGrupo5} alt="Volver" className="icon-small" /> 
                            Volver al Inicio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}