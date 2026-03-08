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
const VincularProveedorModal = ({ onSelect, onClose, proveedoresYaVinculados, costoSugerido }) => {
    const [proveedores, setProveedores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Estado para el segundo paso: ingreso de precio
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
    const [precioPactado, setPrecioPactado] = useState(costoSugerido || 0);

    useEffect(() => {
        const cargarTodo = async () => {
            setLoading(true);
            try {
                const res = await api.get("/proveedores");
                const vinculadosIds = proveedoresYaVinculados.map(p => p.idProveedor);
                const filtrados = res.data.filter(p => !vinculadosIds.includes(p.id));
                setProveedores(filtrados);
            } catch (err) { console.error(err); } 
            finally { setLoading(false); }
        };
        cargarTodo();
    }, [proveedoresYaVinculados]);

    const filtered = proveedores.filter(p => 
        p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.cuitCuil?.includes(searchTerm)
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta" style={{ width: '600px' }}>
                <h3 className="modal-title">
                    {proveedorSeleccionado ? "Confirmar Precio Pactado" : "Vincular Nuevo Proveedor"}
                </h3>

                {!proveedorSeleccionado ? (
                    <>
                        <input 
                            type="text" className="input-base large-input" 
                            placeholder="Buscar por nombre o CUIT..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="cuenta-list-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {loading ? (
                                <div style={{color:'white', textAlign:'center'}}>Buscando...</div>
                            ) : filtered.map(p => (
                                <div key={p.id} className="list-item clickable-item" onClick={() => setProveedorSeleccionado(p)}>
                                    <span className="item-code" style={{ minWidth: '120px' }}>{p.cuitCuil}</span>
                                    <span className="item-name">{p.nombre}</span>
                                    <button className="action-button primary-button" style={{ fontSize: '10px' }}>SELECCIONAR</button>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <p style={{ color: '#aaa', marginBottom: '15px' }}>
                            Ingresá el precio negociado con <strong style={{color: '#4caf50'}}>{proveedorSeleccionado.nombre}</strong>
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                            <span style={{ color: '#fff', fontSize: '20px' }}>$</span>
                            <input 
                                type="number" 
                                className="input-base" 
                                style={{ width: '200px', fontSize: '18px', textAlign: 'center' }}
                                value={precioPactado}
                                onChange={(e) => setPrecioPactado(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button className="action-button primary-button" onClick={() => onSelect(proveedorSeleccionado, precioPactado)}>
                                CONFIRMAR VINCULACIÓN
                            </button>
                            <button className="action-button secondary-button" onClick={() => setProveedorSeleccionado(null)}>
                                ATRÁS
                            </button>
                        </div>
                    </div>
                )}
                
                {!proveedorSeleccionado && (
                    <div className="modal-actions" style={{ marginTop: '20px' }}>
                        <button className="action-button secondary-button" onClick={onClose}>Cerrar</button>
                    </div>
                )}
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

    const handleVincularProveedor = async (proveedor, precio) => {
        try {
            // 🔥 Envío del precio como Query Param para el @RequestParam del Back
            await api.post(`/articulos/${articulo.id}/proveedores/${proveedor.id}?precio=${precio}`);
            setShowVincularModal(false);
            fetchDetalle(); 
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