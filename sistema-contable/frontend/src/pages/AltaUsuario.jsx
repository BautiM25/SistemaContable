import React, { useState } from "react";
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; // Reutilizamos estilos de gestión
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

export default function AltaUsuarios() {
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [password, setPassword] = useState('');

    const handleAlta = (e) => {
        e.preventDefault();
        alert(`Dando de Alta al usuario: ${nombreUsuario} (${nombreCompleto})`);
        // Aquí iría la lógica de API para registrar el usuario
    };

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    {/* HEADER */}
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo Empresa" className="logo-small" />
                            <h2 className="asiento-title">Alta de Nuevo Usuario</h2>
                        </div>
                    </div>

                    {/* BODY: Formulario de Alta */}
                    <div className="asiento-body gestion-body form-body"> 
                        <h3 className="partidas-title">Datos del Usuario</h3>
                        
                        <form className="user-form" onSubmit={handleAlta}>
                            
                            <label className="header-field">Nombre Completo: 
                                <input 
                                    type="text" 
                                    className="input-base large-input" 
                                    placeholder="Nombre y apellido del empleado"
                                    value={nombreCompleto}
                                    onChange={(e) => setNombreCompleto(e.target.value)}
                                    required
                                />
                            </label>

                            <label className="header-field">Nombre de Usuario: 
                                <input 
                                    type="text" 
                                    className="input-base large-input" 
                                    placeholder="Usuario único para el sistema"
                                    value={nombreUsuario}
                                    onChange={(e) => setNombreUsuario(e.target.value)}
                                    required
                                />
                            </label>
                            
                            <label className="header-field">Contraseña: 
                                <input 
                                    type="password" 
                                    className="input-base large-input" 
                                    placeholder="Contraseña inicial"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </label>

                            <button 
                                type="submit"
                                className="action-button icon-with-text primary-button submit-button"
                            >
                                <img src={LogoGrupo5} alt="Icono Guardar" className="icon-small" /> 
                                Registrar Usuario
                            </button>
                        </form>
                    </div>

                    {/* FOOTER: Botón Volver */}
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