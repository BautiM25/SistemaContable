import React, { useState, useEffect } from "react";
import api from "../services/api"; 
import "../styles/Menu.css"; 
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// ====================================================================
// MODAL DE SELECCIÓN DE PROVEEDOR (Listado de Activos)
// ====================================================================
const ProveedorModal = ({ proveedoresDisponibles, onSelect, onClose, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = (proveedoresDisponibles || []).filter(prov => {
        const nombre = String(prov.nombre || '').toLowerCase();
        const cuit = String(prov.cuitCuil || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return nombre.includes(search) || cuit.includes(search);
    });

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta">
                <h3 className="modal-title">Seleccionar Proveedor Activo</h3>
                <input 
                    type="text" 
                    className="input-base large-input" 
                    placeholder="Buscar por nombre o CUIT..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="cuenta-list-container">
                    {loading ? <div className="loading-state">Cargando...</div> : 
                        filtered.map(p => (
                            <div key={p.id} className="list-item clickable-item" onClick={() => onSelect(p)}>
                                <span className="item-code" style={{ minWidth: '120px' }}>{p.cuitCuil}</span>
                                <span className="item-name">{p.nombre}</span>
                            </div>
                        ))
                    }
                </div>
                <div className="modal-actions">
                    <button className="action-button secondary-button" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// MODAL DE BAJA (Confirmación)
// ====================================================================
const BajaModal = ({ proveedor, onConfirm, onClose, isDeleting }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ borderTop: '5px solid #8b2b2b' }}>
                <h3 className="modal-title" style={{ color: '#8b2b2b' }}>Confirmación de Baja</h3>
                <div className="modal-details">
                    <p><strong>Proveedor:</strong> {proveedor.nombre}</p>
                    <p><strong>CUIT:</strong> {proveedor.cuitCuil}</p>
                    <p style={{ color: '#ffc107', fontWeight: 'bold', marginTop: '15px' }}>
                        ¡ADVERTENCIA! Esta acción desactivará al proveedor en el sistema.
                    </p>
                </div>
                <div className="modal-actions">
                    <button className="action-button secondary-button" onClick={onClose} disabled={isDeleting}>
                        Cancelar
                    </button>
                    <button className="action-button danger-button" onClick={() => onConfirm(proveedor)} disabled={isDeleting}>
                        {isDeleting ? 'Procesando...' : 'Confirmar Baja'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// COMPONENTE PRINCIPAL
// ====================================================================
export default function BajaProveedor({ onPageChange }) {
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
    const [proveedoresDisponibles, setProveedoresDisponibles] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // 🚨 FUNCIÓN 1: Cargar activos (status=true)
    const fetchActivos = async () => {
        setLoading(true);
        try {
            // Usamos tu nuevo endpoint de filtrado por estado
            const response = await api.get("/proveedores/status?status=true");
            setProveedoresDisponibles(response.data);
        } catch (err) {
            console.error("Error al cargar activos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchActivos(); }, []);

    const handleConfirmarBaja = async (proveedor) => {
        setIsDeleting(true);
        try {
            // 🚨 ENDPOINT: DELETE /{id}
            await api.delete(`/proveedores/${proveedor.id}`); 
            
            alert(`✅ Proveedor ${proveedor.nombre} dado de baja con éxito.`);
            
            setProveedorSeleccionado(null);
            setShowConfirmModal(false);
            fetchActivos(); // Refrescar lista
        } catch (err) {
            alert("❌ Error en la baja: " + (err.response?.data || "Servidor no disponible"));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                            <h2 className="asiento-title">Gestión de Bajas</h2>
                        </div>
                    </div>

                    <div className="asiento-body gestion-body form-body"> 
                        <h3 className="partidas-title">Seleccione un proveedor para desactivar</h3>
                        <div className="user-form search-form">
                            <label className="header-field">Proveedor Seleccionado: 
                                <div 
                                    className="input-base large-input" 
                                    style={{ textAlign: 'center', cursor: 'pointer', borderColor: '#8b2b2b' }}
                                    onClick={() => setShowSelectionModal(true)}
                                >
                                    {proveedorSeleccionado 
                                        ? `${proveedorSeleccionado.cuitCuil} - ${proveedorSeleccionado.nombre}` 
                                        : 'Haga clic para buscar...'}
                                </div>
                            </label>
                            
                            <button 
                                className="action-button danger-button search-button-action"
                                onClick={() => proveedorSeleccionado ? setShowConfirmModal(true) : setShowSelectionModal(true)}
                                disabled={isDeleting}
                            >
                                <img src={LogoGrupo5} alt="Baja" />
                                {proveedorSeleccionado ? 'Confirmar Baja' : 'Buscar Proveedor'}
                            </button>
                        </div>
                    </div>

                    <div className="asiento-footer">
                        <button className="action-button back-button-footer" onClick={() => onPageChange("GESTION_PROVEEDORES")}>
                            Volver
                        </button>
                    </div>
                </div>
            </div>

            {showSelectionModal && (
                <ProveedorModal
                    proveedoresDisponibles={proveedoresDisponibles}
                    loading={loading}
                    onSelect={(p) => { setProveedorSeleccionado(p); setShowSelectionModal(false); setShowConfirmModal(true); }}
                    onClose={() => setShowSelectionModal(false)}
                />
            )}
            
            {showConfirmModal && (
                <BajaModal 
                    proveedor={proveedorSeleccionado} 
                    isDeleting={isDeleting}
                    onConfirm={handleConfirmarBaja}
                    onClose={() => setShowConfirmModal(false)}
                />
            )}
        </div>
    );
}