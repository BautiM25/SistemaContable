import React, { useState, useEffect } from "react";
// Importamos api y los modales (asumimos que PlanDeCuentasModal existe)
import api from "../services/api";
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css"; 
import "../styles/PlanDeCuentas.css";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";
import PlanDeCuentasModal from "./PlanDeCuentasModal"; // Importado para el modal del árbol

// --- MODALES AUXILIARES ---

const AltaModal = ({ cuentaPadre, nombre, onConfirm, onClose }) => (
    // ... (AltaModal JSX sin cambios) ...
    <div className="modal-overlay">
        <div className="modal-content">
            <h3 className="modal-title">Confirmar Alta de Cuenta</h3>
            
            <div className="modal-details">
                <p><strong>Cuenta Padre:</strong> {cuentaPadre}</p>
                <p><strong>Nueva Cuenta:</strong> {nombre}</p>
                <p style={{ color: '#ffd700', marginTop: '15px' }}>¿Desea confirmar el registro de esta nueva cuenta en el Plan de Cuentas?</p>
            </div>

            <div className="modal-actions">
                <button 
                    className="action-button secondary-button" 
                    onClick={onClose}
                >
                    Cancelar
                </button>
                <button 
                    className="action-button primary-button" 
                    onClick={onConfirm}
                >
                    Confirmar Alta
                </button>
            </div>
        </div>
    </div>
);

const CuentaModal = ({ cuentasDisponibles, onSelect, onClose, loading, initialSearch }) => {
    // ... (CuentaModal JSX sin cambios, definido para simplificar) ...
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');

    const filteredCuentas = (cuentasDisponibles || []).filter(cuenta => {
        const codigo = cuenta.codigoJerarquico || ''; 
        const nombre = cuenta.nombreCuenta || '';
        return codigo.includes(searchTerm) || nombre.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta">
                <h3 className="modal-title">Seleccionar Cuenta Padre</h3>
                
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


export default function AltaCuentas({onPageChange}) {
    // ESTADO DE DATOS Y CARGA
    const [cuentasDisponibles, setCuentasDisponibles] = useState([]);
    const [loadingCuentas, setLoadingCuentas] = useState(true);
    const [errorCuentas, setErrorCuentas] = useState(null);

    // ESTADO DEL FORMULARIO
    const [idCuentaPadre, setIdCuentaPadre] = useState(null);
    const [displayCuentaPadre, setDisplayCuentaPadre] = useState('Seleccionar Cuenta Padre...');
    const [nombreCuenta, setNombreCuenta] = useState('');
    const [tipoCuenta, setTipoCuenta] = useState(null);
    
    // ESTADOS DE MODAL
    const [showModal, setShowModal] = useState(false); // Confirmación
    const [showPlanModal, setShowPlanModal] = useState(false); // Ver Plan (Árbol)
    const [showSelectionModal, setShowSelectionModal] = useState(false); // Selección de Cuenta Padre

    // 1. Carga Inicial de TODAS las cuentas disponibles (useEffect, sin cambios)
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

    // 2. Manejo de la Selección del Modal (sin cambios)
    const handleCuentaPadreSelect = (cuenta) => {
        const codigo = cuenta.codigoJerarquico;
        const nombre = cuenta.nombreCuenta;
        
        const fullAccountName = codigo ? `${codigo} - ${nombre}` : nombre;

        setIdCuentaPadre(cuenta.id);
        setDisplayCuentaPadre(fullAccountName);
        setTipoCuenta(cuenta.tipo);
        setShowSelectionModal(false);
    };

    // 3. Manejo del Submit del Formulario (sin cambios)
    const handleAlta = (e) => {
        e.preventDefault();
        
        if (!idCuentaPadre) {
            alert("Debe seleccionar una Cuenta Padre válida.");
            return;
        }

        // Lógica de DTO y llamada a la API
        setShowModal(true); 
    };

    const handleVolver = () => {
        if (onPageChange) {
            onPageChange("GESTION_CUENTAS"); 
        }
    };

    const handleConfirmarAlta = async () => {
        // Cerramos el modal inmediatamente
        setShowModal(false); 
        
        if (!idCuentaPadre || !nombreCuenta) {
            alert("Error interno: Faltan datos para el registro.");
            return;
        }

        const cuentaDto = {
            nombreCuenta: nombreCuenta,
            activado: true, // Fijo en true
            esHoja: true,   // Fijo en true
            cuentaPadreId: idCuentaPadre, // ID obtenido del modal de selección
            tipo: tipoCuenta
        };
        
        try {
            const response = await api.post("/cuentas/create", cuentaDto); // Endpoint @PostMapping("/")

            // Manejo de éxito
            if (response.status === 200 || response.status === 201) {
                const nuevaCuenta = response.data;
                alert(`✅ Cuenta registrada: ${nuevaCuenta.nombreCuenta} (ID: ${nuevaCuenta.id})`);

                // Limpiar el formulario
                setIdCuentaPadre(null);
                setDisplayCuentaPadre('Seleccionar Cuenta Padre...');
                setNombreCuenta('');
                setTipoCuenta(null);
            }
        } catch (err) {
            console.error("Error al registrar cuenta:", err);
            const errorMessage = err.response?.data?.message || err.response?.data || 'Error desconocido al conectar con el backend.';
            alert(`❌ Fallo en el registro:\n${errorMessage}`);
        }
    };
    
    // Estados de carga y error iniciales
    if (loadingCuentas) {
        return <div className="loading-state">Cargando cuentas para selección...</div>;
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
                            <h2 className="asiento-title">Alta de Nueva Cuenta Contable</h2>
                        </div>
                        
                        {/* BOTÓN: Ver Plan de Cuentas (ÁRBOL) */}
                        <button 
                            className="action-button secondary-button" 
                            onClick={() => setShowPlanModal(true)}
                            style={{ maxWidth: '250px', alignSelf: 'flex-start', marginTop: '10px' }}
                        >
                            Ver Plan de Cuentas
                        </button>
                    </div>

                    {/* BODY: Formulario de Alta */}
                    <div className="asiento-body gestion-body form-body"> 
                        <h3 className="partidas-title">Datos de la Cuenta</h3>
                        
                        <form className="user-form" onSubmit={handleAlta}>
                            
                            {/* CAMPO REEMPLAZADO: Selección de Cuenta Padre */}
                            <label className="header-field">Cuenta Padre Seleccionada: 
                                <div 
                                    className="input-base large-input" 
                                    // Cambiamos el color si se ha seleccionado una cuenta
                                    style={{ textAlign: 'center', borderColor: idCuentaPadre ? '#4CAF50' : '#888' }}
                                >
                                    {displayCuentaPadre}
                                </div>
                            </label>
                            
                            {/* NUEVO BOTÓN: Abre el modal de selección */}
                            <button
                                type="button" // Importante: no es submit
                                className="action-button secondary-button"
                                onClick={() => setShowSelectionModal(true)}
                                style={{ marginTop: '10px', width: '250px' }}
                                disabled={loadingCuentas}
                            >
                                Seleccionar Padre
                            </button>
                            
                            {/* Input oculto para asegurar que la validación del submit funcione */}
                            {!idCuentaPadre && (
                                <input type="hidden" value="" required /> 
                            )}


                            <label className="header-field">Nombre de la Nueva Cuenta: 
                                <input 
                                    type="text" 
                                    className="input-base large-input" 
                                    placeholder="Nombre completo de la cuenta"
                                    value={nombreCuenta}
                                    onChange={(e) => setNombreCuenta(e.target.value)}
                                    required
                                />
                            </label>
                            
                            <button 
                                type="submit"
                                className="action-button icon-with-text primary-button submit-button"
                                disabled={!idCuentaPadre || !nombreCuenta}
                            >
                                <img src={LogoGrupo5} alt="Icono Guardar" className="icon-small" /> 
                                Registrar Cuenta
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

            {/* MODAL DE CONFIRMACIÓN */}
            {showModal && (
                <AltaModal 
                    cuentaPadre={displayCuentaPadre} 
                    nombre={nombreCuenta} 
                    onConfirm={handleConfirmarAlta} 
                    onClose={() => setShowModal(false)} 
                />
            )}
            
            {/* MODAL DEL PLAN DE CUENTAS (ÁRBOL COMPLETO) */}
            {showPlanModal && (
                <PlanDeCuentasModal
                    onClose={() => setShowPlanModal(false)}
                />
            )}
            
            {/* MODAL DE SELECCIÓN DE CUENTA PADRE (LISTA BUSCABLE) */}
            {showSelectionModal && (
                <CuentaModal
                    cuentasDisponibles={cuentasDisponibles}
                    loading={loadingCuentas}
                    onSelect={handleCuentaPadreSelect}
                    onClose={() => setShowSelectionModal(false)}
                    initialSearch={displayCuentaPadre === 'Seleccionar Cuenta Padre...' ? '' : displayCuentaPadre}
                />
            )}
        </div>
    );
}