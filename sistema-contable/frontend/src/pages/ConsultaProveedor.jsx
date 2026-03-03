import React, { useState, useEffect } from "react";
import api from "../services/api";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css";

// ====================================================================
// COMPONENTE INTERNO: MODAL DE VINCULACIÓN DE ARTÍCULOS
// ====================================================================
const VincularArticuloModal = ({ onSelect, onClose, articulosYaVinculados }) => {
    const [articulos, setArticulos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const cargarArticulos = async () => {
            setLoading(true);
            try {
                // Traemos todos los artículos
                const res = await api.get("/articulos");
                // Filtramos los que el proveedor ya tiene vinculados
                const vinculadosIds = articulosYaVinculados.map(a => a.idArticulo);
                const filtrados = res.data.filter(a => !vinculadosIds.includes(a.id));
                setArticulos(filtrados);
            } catch (err) {
                console.error("Error al cargar artículos:", err);
            } finally {
                setLoading(false);
            }
        };
        cargarArticulos();
    }, [articulosYaVinculados]);

    // Filtro local por Referencia o Descripción
    const filtered = articulos.filter(a => 
        a.referencia?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta" style={{ width: '600px', maxWidth: '90%' }}>
                <h3 className="modal-title">Vincular Artículo al Proveedor</h3>
                <div style={{ marginBottom: '15px' }}>
                    <input 
                        type="text" 
                        className="input-base large-input" 
                        placeholder="Buscar por Referencia (ej: CAB-30) o Descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="cuenta-list-container" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {loading ? (
                        <div style={{color:'white', textAlign:'center', padding: '20px'}}>Sincronizando catálogo...</div>
                    ) : filtered.length > 0 ? (
                        filtered.map(a => (
                            <div key={a.id} className="list-item clickable-item" onClick={() => onSelect(a)}>
                                <span className="item-code" style={{ minWidth: '130px', fontWeight: 'bold', color: '#4caf50' }}>
                                    {a.referencia}
                                </span>
                                <span className="item-name" style={{ flex: 2 }}>{a.descripcion}</span>
                                <button className="action-button primary-button" style={{ padding: '2px 10px', fontSize: '10px' }}>
                                    AGREGAR
                                </button>
                            </div>
                        ))
                    ) : (
                        <div style={{color:'#999', textAlign:'center', padding: '20px'}}>
                            No hay artículos disponibles para vincular
                        </div>
                    )}
                </div>

                <div className="modal-actions" style={{ marginTop: '20px' }}>
                    <button className="action-button secondary-button" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// COMPONENTE PRINCIPAL: CONSULTA DE PROVEEDOR
// ====================================================================
export default function ConsultaProveedor({ id, onPageChange }) {
    const [proveedor, setProveedor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showVincularModal, setShowVincularModal] = useState(false);

    const fetchDetalle = async () => {
        try {
            const response = await api.get(`/proveedores/${id}`);
            setProveedor(response.data);
        } catch (err) {
            console.error("Error al obtener el proveedor:", err);
            onPageChange("VER_PROVEEDORES");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchDetalle();
    }, [id]);

    const handleVincularArticulo = async (articulo) => {
        try {
            // Endpoint: POST /api/proveedores/{id}/articulos/{idArticulo}
            await api.post(`/proveedores/${proveedor.id}/articulos/${articulo.id}`);
            setShowVincularModal(false);
            fetchDetalle(); // Refrescar lista de artículos suministrados
        } catch (err) {
            alert("Error al vincular el artículo.");
        }
    };

    if (loading) return <div style={{textAlign:'center', padding:'50px', color:'white'}}>Cargando ficha del proveedor...</div>;
    if (!proveedor) return null;

    return (
        <div className="page-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                
                {/* HEADER */}
                <div className="asiento-header" style={{ flexShrink: 0 }}>
                    <div className="asiento-logo-wrapper">
                        <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                        <h2 className="asiento-title">Ficha Proveedor: {proveedor.nombre}</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button className="action-button secondary-button" onClick={() => onPageChange("VER_PROVEEDORES")}>
                            LISTADO
                        </button>
                        <button 
                            className="action-button primary-button" 
                            style={{ background: '#2e7d32' }}
                            onClick={() => setShowVincularModal(true)}
                        >
                            🔗 ASOCIAR ARTÍCULO
                        </button>
                    </div>
                </div>

                <div className="asiento-body" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    
                    {/* PANEL RESUMEN */}
                    <div style={{ 
                        background: '#333', padding: '20px', borderRadius: '8px', marginBottom: '20px',
                        borderLeft: '5px solid #3c6c3e', boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', color: '#4caf50' }}>{proveedor.nombre}</h3>
                                <p style={{ margin: '0', fontSize: '14px', color: '#aaa' }}>
                                    <strong>CUIT:</strong> {proveedor.cuitCuil} | <strong>Rubro:</strong> {proveedor.rubro}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ background: '#3c6c3e', color: 'white', padding: '4px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold' }}>
                                    ACTIVO
                                </span>
                                <p style={{ color: '#bbb', marginTop: '10px', fontSize: '13px' }}>{proveedor.mail}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {/* Información Comercial */}
                        <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
                            <h4 style={{ color: '#3c6c3e', marginBottom: '15px', borderBottom: '1px solid #3c6c3e', paddingBottom: '5px' }}>DATOS COMERCIALES</h4>
                            <div className="data-row"><span className="data-label">Categoría IVA</span><span className="data-value">{proveedor.categoriaIva?.replace('_', ' ')}</span></div>
                            <div className="data-row"><span className="data-label">Divisa</span><span className="data-value">{proveedor.divisa}</span></div>
                            <div className="data-row"><span className="data-label">Saldo Cuenta Corriente</span><span className="data-value">${proveedor.saldoInicialCC?.toLocaleString()}</span></div>
                        </div>

                        {/* Información Bancaria */}
                        <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
                            <h4 style={{ color: '#3c6c3e', marginBottom: '15px', borderBottom: '1px solid #3c6c3e', paddingBottom: '5px' }}>INFORMACIÓN BANCARIA</h4>
                            <div className="data-row"><span className="data-label">Banco</span><span className="data-value">{proveedor.banco || "No especificado"}</span></div>
                            <div className="data-row"><span className="data-label">ID Banco / CBU</span><span className="data-value">{proveedor.identificadorBanco || "-"}</span></div>
                        </div>
                    </div>

                    {/* TABLA DE ARTÍCULOS SUMINISTRADOS */}
                    <div style={{ marginTop: '20px', background: '#2a2a2a', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
                        <h4 style={{ color: '#ffd700', marginBottom: '15px', borderBottom: '1px solid #ffd700', paddingBottom: '5px' }}>
                            ARTÍCULOS SUMINISTRADOS POR ESTE PROVEEDOR
                        </h4>
                        {proveedor.articulos && proveedor.articulos.length > 0 ? (
                            <table className="partidas-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#333' }}>
                                        <th style={{ padding: '10px', textAlign: 'left', color: '#fff' }}>Referencia</th>
                                        <th style={{ padding: '10px', textAlign: 'left', color: '#fff' }}>Descripción</th>
                                        <th style={{ padding: '10px', textAlign: 'right', color: '#fff' }}>Precio Pactado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proveedor.articulos.map((art, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #444' }}>
                                            <td style={{ padding: '10px', color: '#4caf50', fontWeight: 'bold' }}>{art.referencia}</td>
                                            <td style={{ padding: '10px', color: '#fff' }}>{art.descripcion}</td>
                                            <td style={{ padding: '10px', color: '#ffd700', textAlign: 'right', fontWeight: 'bold' }}>
                                                ${art.precioPactado?.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>Este proveedor aún no tiene artículos vinculados.</p>
                        )}
                    </div>
                </div>

                <div className="asiento-footer" style={{ flexShrink: 0 }}>
                    <button className="action-button secondary-button" onClick={() => onPageChange("DASHBOARD")}>
                        <img src={LogoGrupo5} alt="Back" className="icon-small" /> VOLVER AL INICIO
                    </button>
                </div>
            </div>

            {/* MODAL DE BÚSQUEDA DE ARTÍCULOS */}
            {showVincularModal && (
                <VincularArticuloModal 
                    onSelect={handleVincularArticulo} 
                    onClose={() => setShowVincularModal(false)}
                    articulosYaVinculados={proveedor.articulos || []}
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