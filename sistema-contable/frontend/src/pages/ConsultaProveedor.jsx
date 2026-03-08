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
    const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
    const [precioPactado, setPrecioPactado] = useState(0);

    useEffect(() => {
        const cargarArticulos = async () => {
            try {
                const res = await api.get("/articulos");
                const vinculadosIds = articulosYaVinculados.map(a => a.idArticulo);
                const filtrados = res.data.filter(a => !vinculadosIds.includes(a.id));
                setArticulos(filtrados);
            } catch (err) { console.error(err); }
        };
        cargarArticulos();
    }, [articulosYaVinculados]);

    const filtered = articulos.filter(a => 
        a.referencia?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Cuando selecciona un artículo, cargamos su costo base como sugerencia
    const prepararConfirmacion = (art) => {
        setArticuloSeleccionado(art);
        setPrecioPactado(art.costoBase || 0);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta" style={{ width: '600px' }}>
                <h3 className="modal-title">
                    {articuloSeleccionado ? "Acuerdo de Precio" : "Vincular Artículo"}
                </h3>

                {!articuloSeleccionado ? (
                    <>
                        <input 
                            type="text" className="input-base large-input" 
                            placeholder="Buscar referencia o descripción..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="cuenta-list-container" style={{ maxHeight: '350px' }}>
                            {filtered.map(a => (
                                <div key={a.id} className="list-item clickable-item" onClick={() => prepararConfirmacion(a)}>
                                    <span className="item-code" style={{ color: '#4caf50' }}>{a.referencia}</span>
                                    <span className="item-name">{a.descripcion}</span>
                                    <button className="action-button primary-button" style={{ fontSize: '10px' }}>VINCULAR</button>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <p style={{ color: '#aaa' }}>Precio de compra para <strong style={{color: '#ffd700'}}>{articuloSeleccionado.descripcion}</strong></p>
                        <input 
                            type="number" className="input-base" 
                            style={{ width: '200px', fontSize: '18px', textAlign: 'center', marginTop: '10px' }}
                            value={precioPactado}
                            onChange={(e) => setPrecioPactado(e.target.value)}
                        />
                        <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button className="action-button primary-button" onClick={() => onSelect(articuloSeleccionado, precioPactado)}>
                                GUARDAR VÍNCULO
                            </button>
                            <button className="action-button secondary-button" onClick={() => setArticuloSeleccionado(null)}>
                                VOLVER
                            </button>
                        </div>
                    </div>
                )}

                {!articuloSeleccionado && (
                    <div className="modal-actions" style={{ marginTop: '20px' }}>
                        <button className="action-button secondary-button" onClick={onClose}>Cancelar</button>
                    </div>
                )}
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

    const handleVincularArticulo = async (articulo, precio) => {
        try {
            // 🔥 Envío al endpoint de proveedores con el precio por parámetro
            await api.post(`/proveedores/${proveedor.id}/articulos/${articulo.id}?precio=${precio}`);
            setShowVincularModal(false);
            fetchDetalle(); 
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
                                        <th style={{ padding: '10px', textAlign: 'left', color: '#000000' }}>Referencia</th>
                                        <th style={{ padding: '10px', textAlign: 'left', color: '#000000' }}>Descripción</th>
                                        <th style={{ padding: '10px', textAlign: 'right', color: '#000000' }}>Precio Pactado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proveedor.articulos.map((art, idx) => (
                                        <tr key={idx} style={{ 
                                            borderBottom: '1px solid #444',
                                            backgroundColor: art.activo ? 'transparent' : 'rgba(255, 77, 77, 0.05)' 
                                        }}>
                                            <td style={{ 
                                                padding: '10px', 
                                                // 🚀 Cambio de color dinámico: Verde si está activo, Rojo si no.
                                                color: art.activo ? '#4caf50' : '#ff4d4d', 
                                                fontWeight: 'bold' 
                                            }}>
                                                {art.referencia}
                                                {/* Agregamos una etiqueta textual para reforzar el color */}
                                                {!art.activo && <span style={{fontSize: '9px', marginLeft: '5px'}}>(INACTIVO)</span>}
                                            </td>
                                            <td style={{ 
                                                padding: '10px', 
                                                color: art.activo ? '#000000' : '#888' // Gris si está inactivo
                                            }}>
                                                {art.descripcion}
                                            </td>
                                            <td style={{ 
                                                padding: '10px', 
                                                color: '#ffd700', 
                                                textAlign: 'right', 
                                                fontWeight: 'bold',
                                                opacity: art.activo ? 1 : 0.6
                                            }}>
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