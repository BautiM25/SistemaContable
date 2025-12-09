import React, { useState, useEffect } from "react";
import api from "../services/api"; // Usamos la API para la carga
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css"; 
import "../styles/PlanDeCuentas.css";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";
import PlanDeCuentasModal from "./PlanDeCuentasModal"; // Para ver el Plan (Árbol)

// =========================================================
// 1. Componente Modal de Selección de Cuenta (LISTA BUSCABLE)
//    (Necesario para reemplazar la búsqueda por input de texto)
// =========================================================
const CuentaModal = ({ cuentasDisponibles, onSelect, onClose, loading, initialSearch }) => {
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');

    const filteredCuentas = (cuentasDisponibles || []).filter(cuenta => {
        const codigo = cuenta.codigoJerarquico || ''; 
        const nombre = cuenta.nombreCuenta || '';
        return codigo.includes(searchTerm) || nombre.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta">
                <h3 className="modal-title">Buscar Cuenta para Modificar</h3>
                
                <input 
                    type="text" 
                    className="input-base large-input" 
                    placeholder="Buscar por código o nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading}
                />

                <div className="cuenta-list-container">
                    {loading ? (
                        <div className="loading-state">Cargando Plan de Cuentas...</div>
                    ) : (
                        filteredCuentas.length > 0 ? (
                            filteredCuentas.map((cuenta) => (
                                <div 
                                    key={cuenta.id} 
                                    className="list-item clickable-item" 
                                    onClick={() => onSelect(cuenta)} // Seleccionar y llenar el formulario
                                >
                                    <span className="item-code">
                                        {cuenta.codigoJerarquico ? `${cuenta.codigoJerarquico} -` : ''}
                                    </span>
                                    <span className="item-name">{cuenta.nombreCuenta}</span>
                                </div>
                            ))
                        ) : (
                            <div className="list-item no-results">No se encontraron cuentas.</div>
                        )
                    )}
                </div>

                <div className="modal-actions">
                    <button 
                        className="action-button secondary-button" 
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};


// =========================================================
// 2. ModificacionModal (Interno: Modificado para mostrar todos los campos)
// =========================================================
const ModificacionModal = ({ cuenta, onSave, onCancel }) => {
    // Aquí usamos el estado para permitir la edición del nombre
    const [nombreModificado, setNombreModificado] = useState(cuenta.nombreCuenta);

    const handleSave = (e) => {
        e.preventDefault();
        // Lógica de validación
        if (nombreModificado.trim() === '') {
            alert('El nombre no puede estar vacío.');
            return;
        }
        // 🔑 CLAVE: Enviamos el nombre modificado
        onSave(cuenta, nombreModificado); 
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">Modificar Cuenta {cuenta.codigoJerarquico}</h3>
                
                <form onSubmit={handleSave} className="user-form modal-form">
                    
                    <label className="header-field">Código: 
                        <input type="text" className="input-base large-input" value={cuenta.codigoJerarquico || 'N/A'} disabled />
                    </label>
                    
                    <label className="header-field">Tipo: 
                        <input type="text" className="input-base large-input" value={cuenta.tipo || 'N/A'} disabled />
                    </label>
                    
                    <label className="header-field">Cuenta Padre ID: 
                        <input type="text" className="input-base large-input" value={cuenta.cuentaPadreId || 'N/A'} disabled />
                    </label>
                    
                    <label className="header-field">Nuevo Nombre: 
                        <input 
                            type="text" 
                            className="input-base large-input" 
                            placeholder="Ingrese el nuevo nombre"
                            value={nombreModificado}
                            onChange={(e) => setNombreModificado(e.target.value)}
                            required
                        />
                    </label>

                    <div className="modal-actions">
                        <button className="action-button secondary-button" onClick={onCancel} type="button">
                            Cancelar
                        </button>
                        <button type="submit" className="action-button primary-button">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// =========================================================
// 3. Componente Principal ModificacionCuentas
// =========================================================
export default function ModificacionCuentas({onPageChange}) {
    // ... (Estados de carga, datos, y modales sin cambios) ...
    const [cuentasDisponibles, setCuentasDisponibles] = useState([]);
    const [loadingCuentas, setLoadingCuentas] = useState(true);
    const [errorCuentas, setErrorCuentas] = useState(null);
    const [displayCuentaBuscar, setDisplayCuentaBuscar] = useState('Seleccionar Cuenta...'); 
    const [cuentaEncontrada, setCuentaEncontrada] = useState(null); 
    const [showModal, setShowModal] = useState(false); 
    const [showSelectionModal, setShowSelectionModal] = useState(false); 
    const [showPlanModal, setShowPlanModal] = useState(false); 


    // 1. Carga Inicial (useEffect, sin cambios)
    useEffect(() => {
        const fetchCuentas = async () => {
            try {
                const response = await api.get("/cuentas"); 
                setCuentasDisponibles(response.data); 
            } catch (err) {
                console.error("Error al cargar cuentas:", err);
                setErrorCuentas("No se pudo cargar el Plan de Cuentas. Verifique la conexión al backend.");
            } finally {
                setLoadingCuentas(false);
            }
        };
        fetchCuentas();
    }, []);

    // 2. Manejo de la Selección del Modal de Búsqueda (sin cambios)
    const handleCuentaSelect = (cuenta) => {
        const display = cuenta.codigoJerarquico ? `${cuenta.codigoJerarquico} - ${cuenta.nombreCuenta}` : cuenta.nombreCuenta;
        setDisplayCuentaBuscar(display);
        setCuentaEncontrada(cuenta); // Guardamos el DTO completo
        setShowSelectionModal(false);
        setShowModal(true); // Abrir el modal de modificación inmediatamente
    };
    
    // 3. Manejo de Guardar Modificación (API CALL CORREGIDA)
    // Recibe el objeto DTO original y solo el nombre modificado.
    const handleSaveModification = async (originalCuentaDto, nuevoNombre) => {
        
        // 🔑 CLAVE: Construir el DTO completo, actualizando solo el nombre.
        const updateDto = {
            id: originalCuentaDto.id, // Requerido por el backend
            nombreCuenta: nuevoNombre,
            activado: originalCuentaDto.activado,
            esHoja: originalCuentaDto.esHoja,
            cuentaPadreId: originalCuentaDto.cuentaPadreId,
            tipo: originalCuentaDto.tipo 
        };
        
        setShowModal(false); // Cerramos el modal mientras esperamos la API

        try {
            // Llama al endpoint PUT /api/cuentas/{id}
            const response = await api.put(`/cuentas/${originalCuentaDto.id}`, updateDto); 
            
            if (response.status === 200) {
                alert(`✅ Cuenta ID ${originalCuentaDto.id} modificada con éxito a: ${nuevoNombre}`);
                
                // Opcional: Actualizar la lista 'cuentasDisponibles' para reflejar el cambio.
                
                // Resetear la vista después de modificar
                setCuentaEncontrada(null);
                setDisplayCuentaBuscar('Seleccionar Cuenta...');
            }
        } catch (err) {
            console.error("Error al modificar cuenta:", err);
            const backendMessage = err.response?.data?.message || err.response?.data || 'Fallo desconocido en la modificación.';
            alert(`❌ ${backendMessage}`);
        }
    };

    const handleVolver = () => {
        if (onPageChange) {
            onPageChange("GESTION_CUENTAS"); 
        }
    };

    if (loadingCuentas) {
        return <div className="loading-state">Cargando cuentas...</div>;
    }
    if (errorCuentas) {
        return <div className="error-state">{errorCuentas}</div>;
    }


    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    {/* HEADER */}
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo Empresa" className="logo-small" />
                            <h2 className="asiento-title">Modificación de Cuenta Contable</h2>
                        </div>
                        
                        {/* BOTÓN: Ver Plan (Árbol) */}
                        <button 
                            type="button"
                            className="action-button secondary-button"
                            onClick={() => setShowPlanModal(true)} 
                            style={{ maxWidth: '250px', alignSelf: 'flex-start', marginTop: '10px' }}
                        >
                            Ver Plan (Árbol)
                        </button>
                    </div>

                    {/* BODY: BÚSQUEDA */}
                    <div className="asiento-body gestion-body form-body"> 
                        <h3 className="partidas-title">Busque y seleccione la cuenta a modificar</h3>
                        
                        <div className="user-form search-form">
                            {/* ... (Visualización de Cuenta Seleccionada sin cambios) ... */}
                            <label className="header-field search-field">Cuenta Seleccionada: 
                                <div 
                                    className="input-base large-input" 
                                    style={{ textAlign: 'center', borderColor: cuentaEncontrada ? '#4CAF50' : '#888' }}
                                >
                                    {displayCuentaBuscar}
                                </div>
                            </label>
                            
                            <button 
                                type="button"
                                className="action-button icon-with-text primary-button search-button-action"
                                onClick={() => setShowSelectionModal(true)} // Abre el modal de búsqueda
                                style={{ marginTop: '10px' }} 
                            >
                                <img src={LogoGrupo5} alt="Icono Buscar" className="icon-small" /> 
                                Buscar Cuenta
                            </button>
                            
                            {cuentaEncontrada && (
                                <p style={{ color: '#00ccff', marginTop: '15px', fontWeight: 'bold' }}>
                                    Cuenta lista para modificar. Presione el botón "Buscar Cuenta" si desea cambiar.
                                </p>
                            )}
                        </div>
                    </div>
                    
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

            {/* MODAL DE MODIFICACIÓN */}
            {showModal && cuentaEncontrada && (
                <ModificacionModal 
                    cuenta={cuentaEncontrada} 
                    onClose={() => setShowModal(false)}
                    // 🔑 Corregido para enviar el DTO completo y el nombre modificado
                    onSave={handleSaveModification} 
                    onCancel={() => setShowModal(false)}
                />
            )}
            
            {/* MODAL DE SELECCIÓN DE CUENTA */}
            {showSelectionModal && (
                <CuentaModal
                    cuentasDisponibles={cuentasDisponibles}
                    loading={loadingCuentas}
                    onSelect={handleCuentaSelect}
                    onClose={() => setShowSelectionModal(false)}
                    initialSearch={displayCuentaBuscar === 'Seleccionar Cuenta...' ? '' : displayCuentaBuscar}
                />
            )}
            
            {/* MODAL DEL PLAN DE CUENTAS (ÁRBOL COMPLETO) */}
            {showPlanModal && (
                <PlanDeCuentasModal
                    onClose={() => setShowPlanModal(false)} // 🚨 CORRECCIÓN: Usamos el setter
                />
            )}
        </div>
    );
}