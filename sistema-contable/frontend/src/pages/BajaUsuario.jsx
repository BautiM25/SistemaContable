import React, { useState } from "react";
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

export default function BajaUsuarios() {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [password, setPassword] = useState('');

    const handleBaja = (e) => {
        e.preventDefault();
        // NOTA: En un sistema real, la contraseña sería la del administrador que ejecuta la baja.
        alert(`Confirmando baja del usuario: ${nombreUsuario}`);
        // Aquí iría la lógica de API para eliminar el usuario
    };

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    {/* HEADER */}
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo Empresa" className="logo-small" />
                            <h2 className="asiento-title">Baja de Usuario Existente</h2>
                        </div>
                    </div>

                    {/* BODY: Formulario de Baja */}
                    <div className="asiento-body gestion-body form-body"> 
                        <h3 className="partidas-title">Confirmar Datos</h3>
                        
                        <form className="user-form" onSubmit={handleBaja}>
                            
                            <label className="header-field">Nombre de Usuario a Dar de Baja: 
                                <input 
                                    type="text" 
                                    className="input-base large-input" 
                                    placeholder="Nombre de usuario a eliminar"
                                    value={nombreUsuario}
                                    onChange={(e) => setNombreUsuario(e.target.value)}
                                    required
                                />
                            </label>
                            
                            <label className="header-field">Contraseña de Administrador: 
                                <input 
                                    type="password" 
                                    className="input-base large-input" 
                                    placeholder="Contraseña de confirmación"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </label>

                            <button 
                                type="submit"
                                className="action-button icon-with-text danger-button submit-button"
                            >
                                <img src={LogoGrupo5} alt="Icono Eliminar" className="icon-small" /> 
                                Confirmar Baja
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