import React, { useState, useEffect } from "react";
import api from "../services/api"; // Usamos la API para la carga y eliminación
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css"; 
import "../styles/PlanDeCuentas.css";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";
import PlanDeCuentasModal from "./PlanDeCuentasModal"; 

// =========================================================
// 1. Componente Modal de Búsqueda de Cuenta (CON FILTRO HOJA)
//    (Permite buscar cuentas y solo muestra aquellas que tienen esHoja: true)
// =========================================================
const CuentaModal = ({ cuentasDisponibles, onSelect, onClose, loading, initialSearch }) => {
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');

    // Filtra: 1) solo cuentas hoja, 2) por término de búsqueda.
    const filteredCuentas = (cuentasDisponibles || [])
        .filter(cuenta => cuenta.esHoja) 
        .filter(cuenta => {
            const codigo = cuenta.codigoJerarquico || ''; 
            const nombre = cuenta.nombreCuenta || '';
            return codigo.includes(searchTerm) || nombre.toLowerCase().includes(searchTerm.toLowerCase());
        });

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta">
                <h3 className="modal-title">Buscar Cuenta para Eliminar</h3>
                
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
                                    onClick={() => onSelect(cuenta)} 
                                >
                                    <span className="item-code">
                                        {cuenta.codigoJerarquico ? `${cuenta.codigoJerarquico} -` : ''}
                                    </span>
                                    <span className="item-name">{cuenta.nombreCuenta}</span>
                                </div>
                            ))
                        ) : (
                            <div className="list-item no-results">No se encontraron cuentas hoja.</div>
                        )
                    )}
                </div>

                <div className="modal-actions">
                    <button className="action-button secondary-button" onClick={onClose} disabled={loading}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};


// =========================================================
// 2. BajaModal (Interno: Confirmación de Eliminación)
// =========================================================
const BajaModal = ({ cuenta, onConfirm, onClose }) => {
    
    const nombreCompleto = cuenta.codigoJerarquico ? `${cuenta.codigoJerarquico} - ${cuenta.nombreCuenta}` : cuenta.nombreCuenta;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title" style={{ color: '#8b2b2b' }}>Confirmar Baja Crítica</h3>
                
                <div className="modal-details">
                    <p><strong>Cuenta:</strong> {nombreCompleto}</p>
                    <p style={{ color: '#ffc107', fontWeight: 'bold' }}>
                        ¡ADVERTENCIA! Esta acción eliminará lógicamente la cuenta.
                    </p>
                    <p>¿Desea continuar con la eliminación?</p>
                </div>

                <div className="modal-actions">
                    <button className="action-button secondary-button" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="action-button danger-button" onClick={() => onConfirm(cuenta.id)}>
                        Eliminar Cuenta
                    </button>
                </div>
            </div>
        </div>
    );
};


// =========================================================
// 3. Componente Principal BajaCuentas
// =========================================================
export default function BajaCuentas({onPageChange}) {
    // ESTADO DE DATOS Y CARGA
    const [cuentasDisponibles, setCuentasDisponibles] = useState([]);
    const [loadingCuentas, setLoadingCuentas] = useState(true);
    const [errorCuentas, setErrorCuentas] = useState(null);

    // ESTADO DEL FORMULARIO DE BÚSQUEDA/ELIMINACIÓN
    const [displayCuentaBuscar, setDisplayCuentaBuscar] = useState('Seleccionar Cuenta...');
    const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null); // Objeto CuentaDTO
    const [isDeleting, setIsDeleting] = useState(false); // Estado para la API DELETE
    
    // ESTADOS DE MODAL
    const [showConfirmModal, setShowConfirmModal] = useState(false); 
    const [showSelectionModal, setShowSelectionModal] = useState(false); 
    const [showPlanModal, setShowPlanModal] = useState(false); 

    // 1. Carga Inicial de TODAS las cuentas disponibles
    useEffect(() => {
        const fetchCuentas = async () => {
            try {
                // Obtenemos TODAS las cuentas que estén activas
                const response = await api.get("/cuentas"); 
                setCuentasDisponibles(response.data); 
            } catch (err) {
                console.error("Error al cargar cuentas:", err);
                setErrorCuentas("No se pudo cargar el Plan de Cuentas.");
            } finally {
                setLoadingCuentas(false);
            }
        };
        fetchCuentas();
    }, []);

    // 2. Manejo de la Selección del Modal de Búsqueda
    const handleCuentaSelect = (cuenta) => {
        const display = cuenta.codigoJerarquico ? `${cuenta.codigoJerarquico} - ${cuenta.nombreCuenta}` : cuenta.nombreCuenta;
        
        setDisplayCuentaBuscar(display);
        setCuentaSeleccionada(cuenta); 
        setShowSelectionModal(false);

        // Abrir modal de confirmación inmediatamente después de seleccionar
        setShowConfirmModal(true);
    };

    // 3. Manejo de la Baja (API CALL)
    const handleConfirmarBaja = async (idCuenta) => {
        setShowConfirmModal(false);
        setIsDeleting(true);

        try {
            // 🔑 CLAVE: Llama al endpoint DELETE /api/cuentas/{id}
            const response = await api.delete(`/cuentas/${idCuenta}`); 
            
            // El backend retorna ResponseEntity.noContent().build(), que es status 204
            if (response.status === 204) { 
                alert(`✅ Cuenta ID ${idCuenta} eliminada (lógicamente) con éxito.`);
                
                // Actualizar la lista localmente (eliminando la cuenta del estado)
                setCuentasDisponibles(cuentasDisponibles.filter(c => c.id !== idCuenta));
                
                // Resetear la vista
                setCuentaSeleccionada(null);
                setDisplayCuentaBuscar('Seleccionar Cuenta...');
            }
        } catch (err) {
            console.error("Error al eliminar cuenta:", err);
            // Si el backend devuelve un error (ej. cuenta con movimientos asociados)
            const backendMessage = err.response?.data?.message || err.response?.data || 'Error desconocido al intentar eliminar.';
            alert(`❌ Fallo en la eliminación:\n${backendMessage}`);
        } finally {
            setIsDeleting(false);
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
                            <img src={LogoGrupo5} alt="Logo Empresa" className="logo-small" />
                            <h2 className="asiento-title">Baja de Cuenta Contable</h2>
                        </div>
                         {/* BOTÓN: Ver Plan de Cuentas (ÁRBOL) */}
                        <button 
                            type="button"
                            className="action-button secondary-button"
                            onClick={() => setShowPlanModal(true)} 
                            style={{ 
                                maxWidth: '250px', 
                                alignSelf: 'flex-start', 
                                marginTop: '10px' 
                            }}
                        >
                            Ver Plan (Árbol)
                        </button>
                    </div>

                    {/* BODY: BÚSQUEDA Y ACCIÓN */}
                    <div className="asiento-body gestion-body form-body"> 
                        <h3 className="partidas-title">Busque y seleccione la cuenta a eliminar</h3>
                        
                        <div className="user-form search-form">
                            <label className="header-field search-field">Cuenta Seleccionada: 
                                <div 
                                    className="input-base large-input" 
                                    style={{ textAlign: 'center', borderColor: cuentaSeleccionada ? '#8b2b2b' : '#888' }}
                                >
                                    {displayCuentaBuscar}
                                </div>
                            </label>
                            
                            {/* Botón principal de búsqueda y eliminación */}
                            <button 
                                type="button"
                                className="action-button icon-with-text danger-button search-button-action"
                                onClick={() => setShowSelectionModal(true)} 
                                disabled={isDeleting}
                            >
                                <img src={LogoGrupo5} alt="Icono Buscar" className="icon-small" /> 
                                {isDeleting ? 'Eliminando...' : 'Buscar y Eliminar'}
                            </button>
                            
                            {cuentaSeleccionada && (
                                <p style={{ color: '#ff6b6b', marginTop: '15px', fontWeight: 'bold' }}>
                                    Cuenta lista para eliminación. Presione el botón de arriba.
                                </p>
                            )}
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

            {/* MODAL DE CONFIRMACIÓN */}
            {showConfirmModal && cuentaSeleccionada && (
                <BajaModal 
                    cuenta={cuentaSeleccionada} 
                    onConfirm={handleConfirmarBaja}
                    onClose={() => setShowConfirmModal(false)}
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
                    onClose={() => setShowPlanModal(false)}
                />
            )}
        </div>
    );
}