import React, { useState, useEffect } from "react";
import api from "../services/api"; 
import "../styles/Menu.css"; 
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// ====================================================================
// CONSTANTES Y MOCKUP
// ====================================================================

const MOCK_PROVEEDOR_INACTIVO = {
    id: 998, 
    codigoProveedor: 'P002', 
    nombre: 'Proveedor Inactivo Demo',
};

// ====================================================================
// MODAL DE SELECCIÓN DE PROVEEDOR (Adaptado para INACTIVOS)
// ====================================================================

const ProveedorInactivoModal = ({ proveedoresDisponibles, onSelect, onClose, loading, initialSearch }) => {
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');

    const filteredProveedores = (proveedoresDisponibles || []).filter(prov => {
        const codigo = String(prov.codigoProveedor) || ''; 
        const nombre = String(prov.nombre) || '';
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        return codigo.toLowerCase().includes(lowerSearchTerm) || 
               nombre.toLowerCase().includes(lowerSearchTerm);
    });

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta">
                <h3 className="modal-title">Seleccionar Proveedor para Activar</h3>
                
                <input 
                    type="text" 
                    className="input-base large-input" 
                    placeholder="Buscar por código o nombre (Inactivos)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading}
                />

                <div className="cuenta-list-container">
                    {loading ? (
                        <div className="loading-state">Cargando Proveedores Inactivos...</div>
                    ) : (
                        filteredProveedores.length > 0 ? (
                            filteredProveedores.map((prov) => (
                                <div 
                                    key={prov.id || prov.codigoProveedor} 
                                    className="list-item clickable-item" 
                                    onClick={() => onSelect(prov)}
                                >
                                    <span className="item-code">
                                        {prov.codigoProveedor ? `${prov.codigoProveedor} -` : ''}
                                    </span>
                                    <span className="item-name">{prov.nombre}</span>
                                </div>
                            ))
                        ) : (
                            <div className="list-item no-results">No se encontraron proveedores inactivos.</div>
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


// ====================================================================
// MODAL DE ACTIVACIÓN (Confirmación)
// ====================================================================

const ActivarModal = ({ proveedor, onConfirm, onClose }) => {
    
    const nombreCompleto = proveedor.codigoProveedor ? `${proveedor.codigoProveedor} - ${proveedor.nombre}` : proveedor.nombre;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title" style={{ color: '#3c6c3e' }}>Confirmación de Activación de Proveedor</h3>
                
                <div className="modal-details">
                    <p><strong>Proveedor:</strong> {nombreCompleto}</p>
                    <p style={{ color: '#3c6c3e', fontWeight: 'bold' }}>
                        Esta acción reactivará al proveedor, permitiendo su uso en el sistema.
                    </p>
                    <p>¿Desea confirmar la activación de este proveedor?</p>
                </div>

                <div className="modal-actions">
                    <button className="action-button secondary-button" onClick={onClose}>
                        Cancelar
                    </button>
                    <button 
                        className="action-button primary-button" // Usamos primary para Alta/Activación
                        onClick={() => onConfirm(proveedor)} 
                    >
                        Confirmar Activación
                    </button>
                </div>
            </div>
        </div>
    );
};


// ====================================================================
// COMPONENTE PRINCIPAL: ActivarProveedor
// ====================================================================

export default function ActivarProveedor({ onPageChange }) {
    
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
    const [loadingProveedores, setLoadingProveedores] = useState(false);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isActivating, setIsActivating] = useState(false); // Estado de activación

    const [proveedoresDisponibles, setProveedoresDisponibles] = useState([]); 

    // 🚨 FUNCIÓN 1: Cargar la lista de proveedores INACTIVOS (GET /suppliers/inactives)
    const fetchProveedoresDisponibles = async () => {
        setLoadingProveedores(true);
        try {
            // CRÍTICO: Usamos el endpoint para listar inactivos
            const response = await api.get("/suppliers/inactives?page=1&limit=999"); 
            
            const list = response.data.content.map(p => ({
                id: p.id, 
                codigoProveedor: p.code,
                nombre: p.name 
            }));
            setProveedoresDisponibles(list);
        } catch (err) {
            console.error("Error al cargar la lista de proveedores inactivos:", err);
            setProveedoresDisponibles([MOCK_PROVEEDOR_INACTIVO]); 
        } finally {
            setLoadingProveedores(false);
        }
    };

    useEffect(() => {
        fetchProveedoresDisponibles();
    }, []);

    // 2. Manejo de la Selección del Proveedor
    const handleProveedorSelect = (prov) => {
        setProveedorSeleccionado(prov);
        setShowSelectionModal(false);
        setShowConfirmModal(true); 
    };
    
    // 🚨 FUNCIÓN 3: Manejo de la ACTIVACIÓN (API CALL - POST /active-supplier)
    const handleConfirmarActivacion = async (proveedor) => {
        if (!proveedor.id) { 
             alert("Error de ID: No se pudo obtener el ID del proveedor para la activación.");
             return;
        }

        setShowConfirmModal(false);
        setIsActivating(true); // Usamos el estado de activación

        // Payload esperado: { idSupplier: Long }
        const payload = {
            idSupplier: proveedor.id
        };

        try {
            // Endpoint: POST /api/suppliers/active-supplier
            const response = await api.post("/suppliers/active-supplier", payload); 
            
            if (response.status === 200) { 
                alert(`✅ Proveedor ${proveedor.nombre} (ID: ${proveedor.id}) activado con éxito.`);
                
                // Actualizar la lista localmente (removiendo de la lista de inactivos)
                setProveedoresDisponibles(prev => prev.filter(p => p.id !== proveedor.id));
                setProveedorSeleccionado(null);
            }
        } catch (err) {
            console.error("Error al activar al proveedor:", err.response || err);
            const msg = err.response?.data || 'Error desconocido al procesar la activación.';
            alert(`❌ Fallo en la Activación:\n${msg}`);
        } finally {
            setIsActivating(false);
        }
    };

    const handleVolver = () => {
        if (onPageChange) {
            onPageChange("GESTION_PROVEEDORES"); 
        }
    };
    
    // 4. Renderizado principal
    const displayProveedor = proveedorSeleccionado 
        ? `${proveedorSeleccionado.codigoProveedor} - ${proveedorSeleccionado.nombre}` 
        : 'Seleccionar Proveedor Inactivo...';

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    {/* HEADER */}
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo Empresa" className="logo-small" />
                            <h2 className="asiento-title">Activación de Proveedor (Alta Lógica)</h2>
                        </div>
                    </div>

                    {/* BODY: Interfaz de Selección */}
                    <div className="asiento-body gestion-body form-body"> 
                        <h3 className="partidas-title">Busque y seleccione el proveedor inactivo a reactivar</h3>
                        
                        <div className="user-form search-form">
                            <label className="header-field search-field">Proveedor Inactivo Seleccionado: 
                                <div 
                                    className="input-base large-input" 
                                    style={{ textAlign: 'center', borderColor: proveedorSeleccionado ? '#3c6c3e' : '#888' }}
                                >
                                    {displayProveedor}
                                </div>
                            </label>
                            
                            <button 
                                type="button"
                                className="action-button icon-with-text primary-button search-button-action"
                                onClick={proveedorSeleccionado ? () => setShowConfirmModal(true) : () => setShowSelectionModal(true)}
                                disabled={isActivating}
                            >
                                <img src={LogoGrupo5} alt="Icono Activar" className="icon-small" /> 
                                {isActivating ? 'Procesando Activación...' : (proveedorSeleccionado ? 'Confirmar Activación' : 'Buscar Inactivos')}
                            </button>
                            
                            {proveedorSeleccionado && (
                                <p style={{ color: '#3c6c3e', marginTop: '15px', fontWeight: 'bold' }}>
                                    Proveedor listo para ser activado. Presione el botón de arriba.
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

            {/* MODAL DE SELECCIÓN */}
            {showSelectionModal && (
                <ProveedorInactivoModal // Usamos el modal adaptado
                    proveedoresDisponibles={proveedoresDisponibles}
                    loading={loadingProveedores}
                    onSelect={handleProveedorSelect}
                    onClose={() => setShowSelectionModal(false)}
                />
            )}
            
            {/* MODAL DE CONFIRMACIÓN DE ACTIVACIÓN */}
            {showConfirmModal && proveedorSeleccionado && (
                <ActivarModal 
                    proveedor={proveedorSeleccionado} 
                    onConfirm={handleConfirmarActivacion}
                    onClose={() => setShowConfirmModal(false)}
                />
            )}
        </div>
    );
}