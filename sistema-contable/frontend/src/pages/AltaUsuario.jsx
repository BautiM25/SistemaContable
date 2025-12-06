import React, { useState } from "react";
// Importamos la instancia de Axios configurada
import api from "../services/api"; 
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// Opciones de rol disponibles para el nuevo usuario
const ROLES = ["Administrador", "Contador", "Comprador"];

export default function AltaUsuarios({ onPageChange }) {
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [password, setPassword] = useState('');
    // Estado para el nuevo campo de rol, inicializado con la primera opción
    const [rolSeleccionado, setRolSeleccionado] = useState(ROLES[0]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAlta = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // 1. Construir el DTO (JSON) que espera el backend
        const createUsuarioDto = {
            nombreUsuario: nombreUsuario,
            contrasenia: password,
            nombreCompleto: nombreCompleto,
            rol: rolSeleccionado // Incluimos el rol
        };

        try {
            // 2. Realizar la petición POST
            const response = await api.post("/usuarios/create", createUsuarioDto);

            // 3. Manejo de éxito
            if (response.status === 200 || response.status === 201) {
                alert(`✅ Usuario '${nombreUsuario}' registrado con éxito.`);
                
                // Limpiar el formulario y volver a la gestión de usuarios
                setNombreCompleto('');
                setNombreUsuario('');
                setPassword('');
                setRolSeleccionado(ROLES[0]);
                
                if (onPageChange) {
                    onPageChange("GESTION_USUARIOS"); 
                }
            }
        } catch (err) {
            // 4. Manejo de errores (ej: usuario ya existe, error de servidor)
            console.error("Error al registrar usuario:", err);
            
            // Intentar extraer el mensaje de error del backend
            const backendError = err.response?.data || 'Error desconocido del servidor.';
            setError(`❌ Error: ${backendError}`);
            alert(`Error al registrar: ${backendError}`);
        } finally {
            setLoading(false);
        }
    };

    const handleVolver = () => {
        if (onPageChange) {
            onPageChange("GESTION_USUARIOS"); 
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
                            <h2 className="asiento-title">Alta de Nuevo Usuario</h2>
                        </div>
                    </div>

                    {/* BODY: Formulario de Alta */}
                    <div className="asiento-body gestion-body form-body"> 
                        <h3 className="partidas-title">Datos del Usuario</h3>
                        
                        <form className="user-form" onSubmit={handleAlta}>
                            
                            {/* CAMPO: Nombre Completo */}
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

                            {/* CAMPO: Nombre de Usuario */}
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
                            
                            {/* CAMPO: Contraseña */}
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

                            {/* CAMPO AÑADIDO: Rol */}
                            <label className="header-field">Rol de Usuario: 
                                <select 
                                    className="input-base large-input"
                                    value={rolSeleccionado}
                                    onChange={(e) => setRolSeleccionado(e.target.value)}
                                    required
                                >
                                    {ROLES.map(rol => (
                                        <option key={rol} value={rol}>
                                            {rol}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            
                            {/* Mensaje de Error (visible si hay error) */}
                            {error && <div style={{ color: '#ff6b6b', fontWeight: 'bold' }}>{error}</div>}

                            <button 
                                type="submit"
                                className="action-button icon-with-text primary-button submit-button"
                                disabled={loading} // Deshabilita el botón mientras carga
                            >
                                {loading ? 'Registrando...' : 'Registrar Usuario'}
                                <img src={LogoGrupo5} alt="Icono Guardar" className="icon-small" /> 
                            </button>
                        </form>
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