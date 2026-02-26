import React, { useState, useEffect } from "react";
import api from "../services/api";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css";

export default function ConsultaArticulo({ id, onPageChange }) {
    const [articulo, setArticulo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                const response = await api.get(`/articulos/${id}`);
                setArticulo(response.data);
            } catch (err) {
                console.error("Error al obtener el detalle:", err);
                alert("No se pudo cargar la ficha del artículo.");
                onPageChange("VER_ARTICULOS");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDetalle();
    }, [id, onPageChange]);

    if (loading) return <div style={{textAlign:'center', padding:'50px', color:'white'}}>Sincronizando ficha técnica...</div>;
    if (!articulo) return null;

    // Lógica de alerta de stock
    const esStockCritico = articulo.stockFisico <= articulo.stockMinimo;

    return (
        <div className="page-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                
                {/* HEADER - Estilo Solicitud de Compra */}
                <div className="asiento-header" style={{ flexShrink: 0 }}>
                    <div className="asiento-logo-wrapper">
                        <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                        <h2 className="asiento-title">Ficha Técnica: {articulo.referencia}</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button className="action-button secondary-button" onClick={() => onPageChange("VER_ARTICULOS")}>
                            LISTADO
                        </button>
                        <button className="action-button primary-button" onClick={() => onPageChange("MODIFICACION_ARTICULO", { id: articulo.id })}>
                            EDITAR
                        </button>
                    </div>
                </div>

                {/* CUERPO - Basado en el JSON exacto */}
                <div className="asiento-body" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    
                    {/* PANEL RESUMEN (Identificación) */}
                    <div style={{ 
                        background: '#333', padding: '20px', borderRadius: '8px', marginBottom: '20px',
                        borderLeft: `5px solid ${esStockCritico ? '#8b2b2b' : '#3c6c3e'}`,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', color: esStockCritico ? '#ff4d4d' : '#4caf50' }}>
                                    {articulo.descripcion}
                                </h3>
                                <p style={{ margin: '0', fontSize: '14px', color: '#aaa' }}>
                                    <strong>REF:</strong> {articulo.referencia} | <strong>Familia:</strong> {articulo.familia}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                {/* Habilitado visualmente con un Badge */}
                                <span style={{ 
                                    background: articulo.habilitado ? '#3c6c3e' : '#444',
                                    color: 'white', padding: '4px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold'
                                }}>
                                    {articulo.habilitado ? '● HABILITADO' : '○ DESHABILITADO'}
                                </span>
                                <h2 style={{ margin: '10px 0 0 0', color: esStockCritico ? '#ff4d4d' : '#fff' }}>
                                    Stock: {articulo.stockFisico} un.
                                </h2>
                                {esStockCritico && <small style={{color: '#ff4d4d'}}>Bajo stock mínimo ({articulo.stockMinimo})</small>}
                            </div>
                        </div>
                    </div>

                    {/* GRIDS DE DATOS TÉCNICOS */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        
                        {/* Datos de Mercado */}
                        <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
                            <h4 style={{ color: '#3c6c3e', marginBottom: '15px', borderBottom: '1px solid #3c6c3e', paddingBottom: '5px' }}>INFORMACIÓN COMERCIAL</h4>
                            <div className="data-row">
                                <span className="data-label">Precio al Público</span>
                                <span className="data-value" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                    ${articulo.precioPublico?.toLocaleString()}
                                </span>
                            </div>
                            <div className="data-row">
                                <span className="data-label">Moneda de Referencia</span>
                                <span className="data-value">Pesos (ARS)</span>
                            </div>
                        </div>

                        {/* Datos de Proveedor y Alerta */}
                        <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
                            <h4 style={{ color: '#3c6c3e', marginBottom: '15px', borderBottom: '1px solid #3c6c3e', paddingBottom: '5px' }}>LOGÍSTICA Y REPOSICIÓN</h4>
                            <div className="data-row">
                                <span className="data-label">Proveedor Habitual</span>
                                <span className="data-value">{articulo.nombreProveedorHabitual}</span>
                            </div>
                            <div className="data-row">
                                <span className="data-label">Stock Mínimo</span>
                                <span className="data-value">{articulo.stockMinimo} unidades</span>
                            </div>
                        </div>
                    </div>

                    {/* CAJA DE COMENTARIOS */}
                    <div style={{ 
                        marginTop: '20px', background: '#1a1a1a', padding: '15px', borderRadius: '8px', border: '1px solid #333'
                    }}>
                        <h4 style={{ color: '#666', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase' }}>Comentarios y Observaciones</h4>
                        <p style={{ color: '#bbb', fontSize: '14px', fontStyle: 'italic', margin: 0, whiteSpace: 'pre-wrap' }}>
                            {articulo.comentarios || "Sin comentarios adicionales para este producto."}
                        </p>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="asiento-footer" style={{ flexShrink: 0 }}>
                    <button className="action-button secondary-button" onClick={() => onPageChange("GESTION_STOCK")}>
                        <img src={LogoGrupo5} alt="Back" className="icon-small" /> VOLVER AL MENÚ
                    </button>
                </div>
            </div>
            
            <style>{`
                .data-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid #333;
                }
                .data-label { color: #888; font-size: 13px; }
                .data-value { color: #f0f0f0; font-size: 14px; }
                .data-row:last-child { border-bottom: none; }
            `}</style>
        </div>
    );
}