import React, { useState, useEffect } from "react";
import api from "../services/api"; // Importamos la instancia de Axios
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

export default function BajaUsuarios({onPageChange}) {
    // Estado para almacenar la lista completa de usuarios
    const [usuarios, setUsuarios] = useState([]); 
    // Estado para el ID del usuario seleccionado para la baja
    const [usuarioIdSeleccionado, setUsuarioIdSeleccionado] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Carga Inicial de Usuarios
    useEffect(() => {
        const fetchUsuarios = async () => {
            setError(null);
            setLoading(true);
            try {
                const response = await api.get("/usuarios/list");
                
                if (response.data && response.data.length > 0) {
                    setUsuarios(response.data);
                    // Si la lista no está vacía, inicializamos el selector
                    setUsuarioIdSeleccionado(String(response.data[0].id)); 
                } else {
                    setError("No hay usuarios registrados para mostrar.");
                }
            } catch (err) {
                console.error("Error al cargar lista de usuarios:", err);
                setError("❌ No se pudo cargar la lista de usuarios.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsuarios();
    }, []); 


    // 2. Manejo de la Petición de Baja
    const handleBaja = async (e) => {
        e.preventDefault();
        setError(null);

        if (!usuarioIdSeleccionado) {
            alert("Debe seleccionar un usuario para dar de baja.");
            return;
        }
        
        // Prevención básica para no eliminarse a sí mismo (asumiendo que el ID del admin está en localStorage)
        if (usuarioIdSeleccionado === localStorage.getItem('id')) {
             alert("No puedes darte de baja a ti mismo.");
             return;
        }

        if (!window.confirm(`¿Está seguro que desea eliminar al usuario? Esta acción es irreversible.`)) {
             return;
        }

        setLoading(true);
        const userId = usuarioIdSeleccionado;

        try {
            // Petición DELETE al endpoint /delete/{id}
            const response = await api.delete(`/usuarios/delete/${userId}`);

            if (response.status === 200) {
                alert(`✅ Usuario ID ${userId} eliminado con éxito.`);
                
                // Actualizar la lista localmente
                const updatedUsuarios = usuarios.filter(u => String(u.id) !== userId);
                setUsuarios(updatedUsuarios);
                
                // Resetear la selección
                setUsuarioIdSeleccionado(updatedUsuarios.length > 0 ? String(updatedUsuarios[0].id) : '');
            }
        } catch (err) {
            console.error("Error al eliminar usuario:", err);
            const backendError = err.response?.data || 'Error desconocido al intentar eliminar.';
            setError(`❌ Error: ${backendError}`);
            alert(`Error al eliminar: ${backendError}`);
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
                            <h2 className="asiento-title">Baja de Usuario Existente</h2>
                        </div>
                    </div>

                    {/* BODY: Formulario de Baja */}
                    <div className="asiento-body gestion-body form-body"> 
                        <h3 className="partidas-title">Seleccione Usuario</h3>
                        
                        {error && <div style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '15px' }}>{error}</div>}

                        <form className="user-form" onSubmit={handleBaja}>
                            
                            {/* CAMPO: Selección de Usuario */}
                            <label className="header-field">Seleccione Usuario a Dar de Baja: 
                                <select 
                                    className="input-base large-input"
                                    value={usuarioIdSeleccionado}
                                    onChange={(e) => setUsuarioIdSeleccionado(e.target.value)}
                                    required
                                    disabled={loading || usuarios.length === 0}
                                >
                                    {loading ? (
                                        <option value="" disabled>Cargando usuarios...</option>
                                    ) : (
                                        usuarios.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.nombreUsuario} ({user.nombreCompleto} - {user.rol})
                                            </option>
                                        ))
                                    )}
                                    {usuarios.length === 0 && !loading && (
                                        <option value="" disabled>No hay usuarios disponibles</option>
                                    )}
                                </select>
                            </label>
                            
                            {/* CAMPO DE CONTRASEÑA ELIMINADO */}
                            
                            <button 
                                type="submit"
                                className="action-button icon-with-text danger-button submit-button"
                                disabled={loading || !usuarioIdSeleccionado}
                            >
                                {loading ? 'Eliminando...' : 'Confirmar Baja'}
                                <img src={LogoGrupo5} alt="Icono Eliminar" className="icon-small" /> 
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