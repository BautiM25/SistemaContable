import React from "react";
// Reutilizamos el layout base y estilos de botones/inputs
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; // Estilos específicos para la gestión
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

export default function GestionUsuarios() {

    const handleAction = (action) => {
        alert(`Acción seleccionada: ${action}`);
        // Aquí iría la lógica de navegación a las vistas de Alta, Modificación o Baja
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
                                onClick={() => handleAction('Alta Usuario')}
                            >
                                <img src={LogoGrupo5} alt="Icono Alta" /> Alta Usuario
                            </button>
                            
                            <button 
                                className="menu-button gestion-button secondary-button"
                                onClick={() => handleAction('Modificación Usuario')}
                            >
                                <img src={LogoGrupo5} alt="Icono Modificación" /> Modificación Usuario
                            </button>
                            
                            <button 
                                className="menu-button gestion-button danger-button"
                                onClick={() => handleAction('Baja Usuario')}
                            >
                                <img src={LogoGrupo5} alt="Icono Baja" /> Baja Usuario
                            </button>

                        </div>
                    </div>

                    {/* FOOTER: Solo el botón Volver */}
                    <div className="asiento-footer single-button-footer">
                        <button className="action-button icon-with-text back-button-footer">
                            <img src={LogoGrupo5} alt="Icono Volver" className="icon-small" /> 
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}