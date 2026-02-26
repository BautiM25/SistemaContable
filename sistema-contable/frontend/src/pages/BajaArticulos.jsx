import React, { useState, useEffect } from "react";
import api from "../services/api"; 
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// ====================================================================
// MODAL DE SELECCIÓN DE ARTÍCULO (Activos)
// ====================================================================
const ArticuloActivoModal = ({ articulosDisponibles, onSelect, onClose, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = (articulosDisponibles || []).filter(art => {
        const ref = String(art.referencia || '').toLowerCase();
        const desc = String(art.descripcion || '').toLowerCase();
        return ref.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta">
                <h3 className="modal-title">Seleccionar Artículo para dar de Baja</h3>
                <input 
                    type="text" 
                    className="input-base large-input" 
                    placeholder="Buscar por referencia o descripción..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="cuenta-list-container">
                    {loading ? <div className="loading-state">Cargando stock activo...</div> : 
                        filtered.map(art => (
                            <div key={art.id} className="list-item clickable-item" onClick={() => onSelect(art)}>
                                <span className="item-code" style={{ minWidth: '140px' }}>[{art.referencia}]</span>
                                <span className="item-name">{art.descripcion}</span>
                            </div>
                        ))
                    }
                </div>
                <div className="modal-actions">
                    <button className="action-button secondary-button" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// COMPONENTE PRINCIPAL
// ====================================================================
export default function BajaArticulo({ onPageChange }) {
    const [activos, setActivos] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    const [showSelection, setShowSelection] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // 1. Cargar solo artículos ACTIVOS
    const cargarActivos = async () => {
        setLoading(true);
        try {
            // Endpoint: GET /api/articulos/status?status=true
            const res = await api.get("/articulos/status?status=true");
            setActivos(res.data);
        } catch (err) {
            console.error("Error al cargar artículos activos", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargarActivos(); }, []);

    const handleSelect = (art) => {
        setSeleccionado(art);
        setShowSelection(false);
        setShowConfirm(true);
    };

    // 2. Ejecutar la baja (PUT /api/articulos/disable/{id})
    const ejecutarBaja = async () => {
        setIsDeleting(true);
        try {
            await api.put(`/articulos/disable/${seleccionado.id}`);
            alert(`🚫 Artículo [${seleccionado.referencia}] dado de baja correctamente.`);
            
            setSeleccionado(null);
            setShowConfirm(false);
            cargarActivos(); // Refrescar lista local
        } catch (err) {
            alert("❌ Error al procesar la baja del artículo.");
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
                            <h2 className="asiento-title">Baja de Artículos (Stock)</h2>
                        </div>
                    </div>

                    <div className="asiento-body gestion-body form-body">
                        <h3 className="partidas-title" style={{ color: '#8b2b2b' }}>Desactivación de Productos</h3>
                        
                        <div className="user-form search-form">
                            <p style={{ textAlign: 'center', marginBottom: '20px' }}>
                                Seleccione un artículo activo para deshabilitarlo del catálogo de ventas y compras.
                            </p>
                            
                            <div 
                                className="input-base large-input" 
                                style={{ 
                                    textAlign: 'center', 
                                    cursor: 'pointer', 
                                    marginBottom: '20px',
                                    borderColor: seleccionado ? '#8b2b2b' : '#444' 
                                }}
                                onClick={() => setShowSelection(true)}
                            >
                                {seleccionado 
                                    ? `[${seleccionado.referencia}] - ${seleccionado.descripcion}` 
                                    : 'Haga clic para buscar artículo...'}
                            </div>

                            <button 
                                className="action-button danger-button search-button-action"
                                onClick={() => seleccionado ? setShowConfirm(true) : setShowSelection(true)}
                                disabled={isDeleting}
                            >
                                <img src={LogoGrupo5} alt="Baja" />
                                {isDeleting ? "Procesando..." : (seleccionado ? "Confirmar Baja" : "Buscar Artículo")}
                            </button>
                        </div>
                    </div>

                    <div className="asiento-footer">
                        <button className="action-button back-button-footer" onClick={() => onPageChange("GESTION_STOCK")}>
                            Volver
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL 1: SELECCIÓN */}
            {showSelection && (
                <ArticuloActivoModal 
                    articulosDisponibles={activos} 
                    loading={loading}
                    onSelect={handleSelect}
                    onClose={() => setShowSelection(false)}
                />
            )}

            {/* MODAL 2: CONFIRMACIÓN DANGER */}
            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '450px', borderTop: '5px solid #8b2b2b' }}>
                        <h3 className="modal-title" style={{ color: '#8b2b2b' }}>¿Confirmar Baja de Stock?</h3>
                        <div style={{ margin: '20px 0', textAlign: 'center' }}>
                            <p>Está por dar de baja el siguiente artículo:</p>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '10px' }}>
                                [{seleccionado.referencia}]
                            </p>
                            <p>{seleccionado.descripcion}</p>
                            <p style={{ marginTop: '15px', color: '#ffc107', fontSize: '14px' }}>
                                <strong>Advertencia:</strong> El stock físico actual ({seleccionado.stockFisico}) quedará inmovilizado.
                            </p>
                        </div>
                        <div className="modal-actions" style={{ flexDirection: 'column', gap: '10px' }}>
                            <button className="action-button danger-button" onClick={ejecutarBaja} style={{ width: '100%' }}>
                                SÍ, DAR DE BAJA
                            </button>
                            <button className="action-button secondary-button" onClick={() => setShowConfirm(false)} style={{ width: '100%' }}>
                                CANCELAR
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}