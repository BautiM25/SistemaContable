import React, { useState, useEffect } from "react";
import api from "../services/api";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css";

// ====================================================================
// COMPONENTE INTERNO: MODAL DE VINCULACIÓN
// ====================================================================
const VincularProveedorModal = ({ onSelect, onClose, proveedoresYaVinculados }) => {
    const [proveedores, setProveedores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    // Cargar todos los proveedores al abrir
    useEffect(() => {
        const cargarTodo = async () => {
            setLoading(true);
            try {
                const res = await api.get("/proveedores");
                // Filtramos los que YA están vinculados para no duplicar
                const vinculadosIds = proveedoresYaVinculados.map(p => p.idProveedor);
                const filtrados = res.data.filter(p => !vinculadosIds.includes(p.id));
                setProveedores(filtrados);
            } catch (err) {
                console.error("Error al cargar proveedores:", err);
            } finally {
                setLoading(false);
            }
        };
        cargarTodo();
    }, [proveedoresYaVinculados]);

    // Lógica de búsqueda (Filtro local + soporte para búsqueda por CUIT)
    const filtered = proveedores.filter(p => 
        p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.cuitCuil?.includes(searchTerm)
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta" style={{ width: '600px', maxWidth: '90%' }}>
                <h3 className="modal-title">Vincular Nuevo Proveedor</h3>
                <div style={{ marginBottom: '15px' }}>
                    <input 
                        type="text" 
                        className="input-base large-input" 
                        placeholder="Buscar por nombre o CUIT..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="cuenta-list-container" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {loading ? (
                        <div style={{color:'white', textAlign:'center', padding: '20px'}}>Buscando proveedores...</div>
                    ) : filtered.length > 0 ? (
                        filtered.map(p => (
                            <div key={p.id} className="list-item clickable-item" onClick={() => onSelect(p)}>
                                <span className="item-code" style={{ minWidth: '120px' }}>{p.cuitCuil}</span>
                                <span className="item-name" style={{ flex: 2 }}>{p.nombre}</span>
                                <button className="action-button primary-button" style={{ padding: '2px 10px', fontSize: '10px' }}>
                                    VINCULAR
                                </button>
                            </div>
                        ))
                    ) : (
                        <div style={{color:'#999', textAlign:'center', padding: '20px'}}>
                            No se encontraron proveedores disponibles
                        </div>
                    )}
                </div>

                <div className="modal-actions" style={{ marginTop: '20px' }}>
                    <button className="action-button secondary-button" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// COMPONENTE PRINCIPAL
// ====================================================================
export default function ConsultaArticulo({ id, onPageChange }) {
    const [articulo, setArticulo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showVincularModal, setShowVincularModal] = useState(false);

    const fetchDetalle = async () => {
        try {
            const response = await api.get(`/articulos/${id}`);
            setArticulo(response.data);
        } catch (err) {
            console.error("Error al obtener el detalle:", err);
            onPageChange("VER_ARTICULOS");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchDetalle();
    }, [id]);

    const handleVincularProveedor = async (proveedor) => {
        try {
            // Llamada al endpoint: POST /api/articulos/{id}/proveedores/{idProveedor}
            await api.post(`/articulos/${articulo.id}/proveedores/${proveedor.id}`);
            setShowVincularModal(false);
            fetchDetalle(); // Recargamos la ficha para ver la nueva "Compulsa de Precios"
        } catch (err) {
            alert("Error al vincular el proveedor.");
        }
    };

    if (loading) return <div style={{textAlign:'center', padding:'50px', color:'white'}}>Cargando ficha técnica...</div>;
    if (!articulo) return null;

    const esStockCritico = articulo.stockFisico <= articulo.stockMinimo;

    return (
        <div className="page-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                
                {/* HEADER */}
                <div className="asiento-header" style={{ flexShrink: 0 }}>
                    <div className="asiento-logo-wrapper">
                        <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                        <h2 className="asiento-title">Ficha Técnica: {articulo.referencia}</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button className="action-button secondary-button" onClick={() => onPageChange("VER_ARTICULOS")}>
                            LISTADO
                        </button>
                        <button 
                            className="action-button primary-button" 
                            style={{ background: '#2e7d32' }}
                            onClick={() => setShowVincularModal(true)}
                        >
                            🔗 VINCULAR PROVEEDOR
                        </button>
                        <button className="action-button primary-button" onClick={() => onPageChange("MODIFICACION_ARTICULO", { id: articulo.id })}>
                            EDITAR
                        </button>
                    </div>
                </div>

                <div className="asiento-body" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    
                    {/* PANEL RESUMEN (Igual al anterior) */}
                    <div style={{ 
                        background: '#333', padding: '20px', borderRadius: '8px', marginBottom: '20px',
                        borderLeft: `5px solid ${esStockCritico ? '#8b2b2b' : '#3c6c3e'}`
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', color: esStockCritico ? '#ff4d4d' : '#4caf50' }}>{articulo.descripcion}</h3>
                                <p style={{ margin: '0', fontSize: '14px', color: '#aaa' }}>
                                    <strong>REF:</strong> {articulo.referencia} | <strong>Familia:</strong> {articulo.familia}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ background: articulo.habilitado ? '#3c6c3e' : '#444', color: 'white', padding: '4px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold' }}>
                                    {articulo.habilitado ? '● HABILITADO' : '○ DESHABILITADO'}
                                </span>
                                <h2 style={{ margin: '10px 0 0 0', color: esStockCritico ? '#ff4d4d' : '#fff' }}>Stock: {articulo.stockFisico} un.</h2>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
                            <h4 style={{ color: '#3c6c3e', marginBottom: '15px', borderBottom: '1px solid #3c6c3e', paddingBottom: '5px' }}>INFORMACIÓN COMERCIAL</h4>
                            <div className="data-row"><span className="data-label">Precio Público</span><span className="data-value">${articulo.precioPublico?.toLocaleString()}</span></div>
                            <div className="data-row"><span className="data-label">Moneda</span><span className="data-value">ARS</span></div>
                        </div>

                        <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
                            <h4 style={{ color: '#3c6c3e', marginBottom: '15px', borderBottom: '1px solid #3c6c3e', paddingBottom: '5px' }}>LOGÍSTICA</h4>
                            <div className="data-row"><span className="data-label">Habitual</span><span className="data-value">{articulo.nombreProveedorHabitual || "N/A"}</span></div>
                            <div className="data-row"><span className="data-label">Mínimo</span><span className="data-value">{articulo.stockMinimo} un.</span></div>
                        </div>
                    </div>

                    {/* TABLA DE PROVEEDORES VINCULADOS (COMPULSA) */}
                    <div style={{ marginTop: '20px', background: '#2a2a2a', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
                        <h4 style={{ color: '#ffd700', marginBottom: '15px', borderBottom: '1px solid #ffd700', paddingBottom: '5px' }}>
                            LISTADO DE PROVEEDORES Y PRECIOS PACTADOS
                        </h4>
                        {articulo.proveedores && articulo.proveedores.length > 0 ? (
                            <table className="partidas-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#333' }}>
                                        <th style={{ padding: '10px', textAlign: 'left', color: '#000000' }}>Proveedor</th>
                                        <th style={{ padding: '10px', textAlign: 'right', color: '#000000' }}>Precio Pactado</th>
                                        <th style={{ padding: '10px', textAlign: 'center', color: '#000000' }}>Rol</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {articulo.proveedores.map((p, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #444' }}>
                                            <td style={{ padding: '10px', color: '#000000' }}>{p.nombre}</td>
                                            <td style={{ padding: '10px', color: '#ffd700', textAlign: 'right', fontWeight: 'bold' }}>
                                                ${p.precioPactado?.toFixed(2)}
                                            </td>
                                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                                {p.idProveedor === articulo.idProveedorHabitual ? 
                                                    <span style={{color: '#4caf50', fontWeight:'bold'}}>PRINCIPAL</span> : 
                                                    <span style={{color: '#888'}}>Alternativo</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No hay proveedores vinculados.</p>
                        )}
                    </div>
                </div>

                <div className="asiento-footer" style={{ flexShrink: 0 }}>
                    <button className="action-button secondary-button" onClick={() => onPageChange("GESTION_STOCK")}>
                        <img src={LogoGrupo5} alt="Back" className="icon-small" /> VOLVER
                    </button>
                </div>
            </div>

            {/* RENDERIZADO CONDICIONAL DEL MODAL INTERNO */}
            {showVincularModal && (
                <VincularProveedorModal 
                    onSelect={handleVincularProveedor} 
                    onClose={() => setShowVincularModal(false)}
                    proveedoresYaVinculados={articulo.proveedores || []}
                />
            )}

            <style>{`
                .data-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #333; }
                .data-label { color: #888; font-size: 13px; }
                .data-value { color: #f0f0f0; font-size: 14px; }
            `}</style>
        </div>
    );
}