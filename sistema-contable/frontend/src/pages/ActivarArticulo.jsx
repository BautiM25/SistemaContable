import React, { useState, useEffect } from "react";
import api from "../services/api"; 
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// ====================================================================
// MODAL DE SELECCIÓN DE ARTÍCULO (Inactivos)
// ====================================================================
const ArticuloInactivoModal = ({ articulosDisponibles, onSelect, onClose, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = (articulosDisponibles || []).filter(art => {
        const ref = String(art.referencia || '').toLowerCase();
        const desc = String(art.descripcion || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return ref.includes(search) || desc.includes(search);
    });

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta">
                <h3 className="modal-title">Seleccionar Artículo para Activar</h3>
                <input 
                    type="text" 
                    className="input-base large-input" 
                    placeholder="Buscar por referencia o descripción..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading}
                />
                <div className="cuenta-list-container">
                    {loading ? (
                        <div className="loading-state">Consultando artículos deshabilitados...</div>
                    ) : (
                        filtered.length > 0 ? (
                            filtered.map((art) => (
                                <div key={art.id} className="list-item clickable-item" onClick={() => onSelect(art)}>
                                    <span className="item-code" style={{ minWidth: '140px' }}>[{art.referencia}]</span>
                                    <span className="item-name">{art.descripcion}</span>
                                </div>
                            ))
                        ) : (
                            <div className="list-item no-results">No se encontraron artículos inactivos.</div>
                        )
                    )}
                </div>
                <div className="modal-actions">
                    <button className="action-button secondary-button" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// COMPONENTE PRINCIPAL
// ====================================================================
export default function ActivarArticulo({ onPageChange }) {
    const [seleccionado, setSeleccionado] = useState(null);
    const [inactivos, setInactivos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    // 1. Cargar artículos inactivos (status=false)
    const fetchInactivos = async () => {
        setLoading(true);
        try {
            const response = await api.get("/articulos/status?status=false");
            setInactivos(response.data);
        } catch (err) {
            console.error("Error al cargar artículos inactivos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInactivos();
    }, []);

    // 2. Ejecutar Activación (PUT /api/articulos/activate/{id})
    const handleConfirmarActivacion = async () => {
        if (!seleccionado) return;

        setIsActivating(true);
        try {
            await api.put(`/articulos/enable/${seleccionado.id}`);
            alert(`✅ Artículo [${seleccionado.referencia}] reactivado con éxito.`);
            
            // Limpiar selección y refrescar lista
            setSeleccionado(null);
            fetchInactivos();
        } catch (err) {
            alert("❌ Error al procesar la activación.");
        } finally {
            setIsActivating(false);
        }
    };

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    {/* HEADER */}
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                            <h2 className="asiento-title">Recuperación de Artículos</h2>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="asiento-body gestion-body form-body"> 
                        <h3 className="partidas-title">Reactivación de stock deshabilitado</h3>
                        
                        <div className="user-form search-form">
                            <label className="header-field">Artículo a Reactivar: 
                                <div 
                                    className="input-base large-input" 
                                    style={{ 
                                        textAlign: 'center', 
                                        cursor: 'pointer',
                                        borderColor: seleccionado ? '#3c6c3e' : '#888' 
                                    }}
                                    onClick={() => setShowModal(true)}
                                >
                                    {seleccionado 
                                        ? `[${seleccionado.referencia}] - ${seleccionado.descripcion}` 
                                        : 'Haga clic para buscar artículos inactivos...'}
                                </div>
                            </label>
                            
                            <button 
                                type="button"
                                className="action-button primary-button search-button-action"
                                onClick={seleccionado ? handleConfirmarActivacion : () => setShowModal(true)}
                                disabled={isActivating || (seleccionado === null && loading)}
                            >
                                <img src={LogoGrupo5} alt="Icono" /> 
                                {isActivating ? 'Activando...' : (seleccionado ? 'Confirmar Activación' : 'Buscar Inactivos')}
                            </button>

                            {seleccionado && (
                                <div className="info-extra-activar" style={{ marginTop: '20px', textAlign: 'center' }}>
                                    <p><strong>Familia:</strong> {seleccionado.familia}</p>
                                    <p><strong>Proveedor:</strong> {seleccionado.nombreProveedorHabitual}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="asiento-footer">
                        <button className="action-button back-button-footer" onClick={() => onPageChange("GESTION_STOCK")}>
                            Volver a Gestión
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <ArticuloInactivoModal 
                    articulosDisponibles={inactivos}
                    loading={loading}
                    onSelect={(art) => { setSeleccionado(art); setShowModal(false); }}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}