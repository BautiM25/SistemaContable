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

// DTO de Mockup mínimo (debe incluir ID para ser seleccionado)
const MOCK_PROVEEDOR = {
    id: 999, // CRÍTICO: Añadimos ID al mock
    codigoProveedor: 'P001', 
    nombre: 'Distribuidora Luka (Mock)',
};

// ====================================================================
// MODAL DE SELECCIÓN DE PROVEEDOR
// ====================================================================

const ProveedorModal = ({ proveedoresDisponibles, onSelect, onClose, loading, initialSearch }) => {
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');

    const filteredProveedores = (proveedoresDisponibles || []).filter(prov => {
        // 🚨 CORRECCIÓN: Aseguramos que el código sea String para usar .includes()
        const codigo = String(prov.codigoProveedor) || ''; 
        const nombre = String(prov.nombre) || '';
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        return codigo.toLowerCase().includes(lowerSearchTerm) || 
               nombre.toLowerCase().includes(lowerSearchTerm);
    });

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta">
                <h3 className="modal-title">Seleccionar Proveedor para dar de Baja</h3>
                
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
                        <div className="loading-state">Cargando Proveedores...</div>
                    ) : (
                        filteredProveedores.length > 0 ? (
                            filteredProveedores.map((prov) => (
                                <div 
                                    // 🚨 CRÍTICO: Usar el 'id' como clave
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
                            <div className="list-item no-results">No se encontraron proveedores activos.</div>
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
// MODAL DE BAJA (Confirmación)
// ====================================================================

const BajaModal = ({ proveedor, onConfirm, onClose }) => {
    
    const nombreCompleto = proveedor.codigoProveedor ? `${proveedor.codigoProveedor} - ${proveedor.nombre}` : proveedor.nombre;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title" style={{ color: '#8b2b2b' }}>Confirmación de Baja de Proveedor</h3>
                
                <div className="modal-details">
                    <p><strong>Proveedor:</strong> {nombreCompleto}</p>
                    <p style={{ color: '#ffc107', fontWeight: 'bold' }}>
                        ¡ADVERTENCIA! Esta acción dará de baja lógicamente al proveedor del sistema.
                    </p>
                    <p>¿Desea confirmar la eliminación lógica de este proveedor?</p>
                </div>

                <div className="modal-actions">
                    <button className="action-button secondary-button" onClick={onClose}>
                        Cancelar
                    </button>
                    <button 
                        className="action-button danger-button" 
                        // 🚨 CRÍTICO: Enviamos el objeto completo 'proveedor'
                        onClick={() => onConfirm(proveedor)} 
                    >
                        Confirmar Baja
                    </button>
                </div>
            </div>
        </div>
    );
};


// ====================================================================
// COMPONENTE PRINCIPAL: BajaProveedor
// ====================================================================

export default function BajaProveedor({ onPageChange }) {
    
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
    const [loadingProveedores, setLoadingProveedores] = useState(false);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [proveedoresDisponibles, setProveedoresDisponibles] = useState([]); 

    // 🚨 FUNCIÓN 1: Cargar la lista de proveedores activos (GET /suppliers/actives)
    const fetchProveedoresDisponibles = async () => {
        setLoadingProveedores(true);
        try {
            // Nuevo endpoint de listado activo con paginación
            const response = await api.get("/suppliers/actives?page=1&limit=999"); 
            
            // Mapeamos la respuesta paginada al formato minimalista
            const list = response.data.content.map(p => ({
                id: p.id, // ID Long de la base de datos
                codigoProveedor: p.code,
                nombre: p.name 
            }));
            setProveedoresDisponibles(list);
        } catch (err) {
            console.error("Error al cargar la lista de proveedores activos:", err);
            // Fallback con mock si la API falla
            setProveedoresDisponibles([MOCK_PROVEEDOR]); 
        } finally {
            setLoadingProveedores(false);
        }
    };

    useEffect(() => {
        fetchProveedoresDisponibles();
    }, []);

    // 2. Manejo de la Selección del Proveedor
    const handleProveedorSelect = (prov) => {
        // 'prov' contiene el id (Long) y el códigoProveedor del listado
        setProveedorSeleccionado(prov);
        setShowSelectionModal(false);
        setShowConfirmModal(true); 
    };
    
    // 🚨 FUNCIÓN 3: Manejo de la Baja (API CALL - POST de Eliminación Lógica)
    const handleConfirmarBaja = async (proveedor) => {
        // 🚨 Verificación de ID
        if (!proveedor.id) { 
             alert("Error de ID: No se pudo obtener el ID del proveedor para la baja.");
             return;
        }

        setShowConfirmModal(false);
        setIsDeleting(true);

        // Payload esperado: { idSupplier: Long }
        const payload = {
            idSupplier: proveedor.id
        };

        try {
            // Endpoint: POST /api/suppliers/delete-supplier
            const response = await api.post("/suppliers/delete-supplier", payload); 
            
            if (response.status === 200) { 
                alert(`✅ Proveedor ${proveedor.nombre} (ID: ${proveedor.id}) dado de baja lógicamente.`);
                
                // Actualizar la lista localmente
                setProveedoresDisponibles(prev => prev.filter(p => p.id !== proveedor.id));
                setProveedorSeleccionado(null);
            }
        } catch (err) {
            console.error("Error al dar de baja al proveedor:", err.response || err);
            // Mensaje de error desde el body de la respuesta
            const msg = err.response?.data || 'Error desconocido al procesar la baja lógica.';
            alert(`❌ Fallo en la baja:\n${msg}`);
        } finally {
            setIsDeleting(false);
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
        : 'Seleccionar Proveedor...';

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    {/* HEADER */}
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo Empresa" className="logo-small" />
                            <h2 className="asiento-title">Baja de Proveedor</h2>
                        </div>
                    </div>

                    {/* BODY: Interfaz de Selección */}
                    <div className="asiento-body gestion-body form-body"> 
                        <h3 className="partidas-title">Busque y seleccione el proveedor a dar de baja</h3>
                        
                        <div className="user-form search-form">
                            <label className="header-field search-field">Proveedor Seleccionado: 
                                <div 
                                    className="input-base large-input" 
                                    style={{ textAlign: 'center', borderColor: proveedorSeleccionado ? '#8b2b2b' : '#888' }}
                                >
                                    {displayProveedor}
                                </div>
                            </label>
                            
                            <button 
                                type="button"
                                className="action-button icon-with-text danger-button search-button-action"
                                onClick={proveedorSeleccionado ? () => setShowConfirmModal(true) : () => setShowSelectionModal(true)}
                                disabled={isDeleting}
                            >
                                <img src={LogoGrupo5} alt="Icono Buscar" className="icon-small" /> 
                                {isDeleting ? 'Procesando Baja...' : (proveedorSeleccionado ? 'Confirmar Baja' : 'Buscar Proveedor')}
                            </button>
                            
                            {proveedorSeleccionado && (
                                <p style={{ color: '#ff6b6b', marginTop: '15px', fontWeight: 'bold' }}>
                                    Proveedor listo para la baja. Presione el botón **Confirmar Baja**.
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
                <ProveedorModal
                    proveedoresDisponibles={proveedoresDisponibles}
                    loading={loadingProveedores}
                    onSelect={handleProveedorSelect}
                    onClose={() => setShowSelectionModal(false)}
                />
            )}
            
            {/* MODAL DE CONFIRMACIÓN DE BAJA */}
            {showConfirmModal && proveedorSeleccionado && (
                <BajaModal 
                    proveedor={proveedorSeleccionado} 
                    onConfirm={handleConfirmarBaja}
                    onClose={() => setShowConfirmModal(false)}
                />
            )}
        </div>
    );
}