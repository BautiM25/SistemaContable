import React, { useState, useEffect } from "react";
import api from "../services/api";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css";

export default function ConsultaProveedor({ id, onPageChange }) {
    const [proveedor, setProveedor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                // Endpoint: GET /api/proveedores/{id}
                const response = await api.get(`/proveedores/${id}`);
                setProveedor(response.data);
            } catch (err) {
                console.error("Error al obtener el detalle del proveedor:", err);
                alert("No se pudo cargar la ficha del proveedor.");
                onPageChange("VER_PROVEEDORES");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDetalle();
    }, [id, onPageChange]);

    if (loading) return <div style={{textAlign:'center', padding:'50px', color:'white'}}>Sincronizando ficha de proveedor...</div>;
    if (!proveedor) return null;

    return (
        <div className="page-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                
                {/* HEADER - Estilo Ficha Técnica */}
                <div className="asiento-header" style={{ flexShrink: 0 }}>
                    <div className="asiento-logo-wrapper">
                        <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                        <h2 className="asiento-title">Ficha del Proveedor: {proveedor.nombre}</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button className="action-button secondary-button" onClick={() => onPageChange("VER_PROVEEDORES")}>
                            LISTADO
                        </button>
                        <button className="action-button primary-button" onClick={() => onPageChange("MODIFICACION_PROVEEDOR", { id: proveedor.id })}>
                            EDITAR
                        </button>
                    </div>
                </div>

                {/* CUERPO - Basado en paneles del JSON real */}
                <div className="asiento-body" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    
                    {/* PANEL RESUMEN (Identificación Principal) */}
                    <div style={{ 
                        background: '#333', padding: '20px', borderRadius: '8px', marginBottom: '25px',
                        borderLeft: '5px solid #3c6c3e',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', color: '#4caf50' }}>{proveedor.nombre}</h3>
                                <p style={{ margin: '0', fontSize: '14px', color: '#aaa' }}>
                                    <strong>CUIT/CUIL:</strong> {proveedor.cuitCuil} | <strong>Rubro:</strong> {proveedor.rubro}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ 
                                    background: '#3c6c3e', color: 'white', padding: '4px 12px', 
                                    borderRadius: '15px', fontSize: '11px', fontWeight: 'bold' 
                                }}>
                                    ● PROVEEDOR ACTIVO
                                </span>
                                <h2 style={{ margin: '10px 0 0 0', color: '#fff' }}>
                                    Saldo: ${proveedor.saldoInicialCC?.toLocaleString()}
                                </h2>
                                <small style={{ color: '#888' }}>Moneda Operativa: {proveedor.divisa}</small>
                            </div>
                        </div>
                    </div>

                    {/* GRIDS DE INFORMACIÓN TÉCNICA */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        
                        {/* Datos Fiscales y Contacto */}
                        <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
                            <h4 style={{ color: '#3c6c3e', marginBottom: '15px', borderBottom: '1px solid #3c6c3e', paddingBottom: '5px' }}>DATOS FISCALES Y CONTACTO</h4>
                            <div className="data-row">
                                <span className="data-label">Categoría IVA</span>
                                <span className="data-value">{proveedor.categoriaIva?.replace('_', ' ')}</span>
                            </div>
                            <div className="data-row">
                                <span className="data-label">Email de Contacto</span>
                                <span className="data-value" style={{ color: '#1e90ff' }}>{proveedor.mail}</span>
                            </div>
                        </div>

                        {/* Datos Bancarios y Comerciales */}
                        <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
                            <h4 style={{ color: '#3c6c3e', marginBottom: '15px', borderBottom: '1px solid #3c6c3e', paddingBottom: '5px' }}>INFORMACIÓN BANCARIA</h4>
                            <div className="data-row">
                                <span className="data-label">Entidad Bancaria</span>
                                <span className="data-value">{proveedor.banco || "No especificada"}</span>
                            </div>
                            <div className="data-row">
                                <span className="data-label">Divisa de Cuenta</span>
                                <span className="data-value">{proveedor.divisa}</span>
                            </div>
                        </div>
                    </div>

                    {/* PANEL DE COMENTARIOS (Opcional si lo agregas luego) */}
                    <div style={{ 
                        marginTop: '20px', background: '#1a1a1a', padding: '15px', borderRadius: '8px', border: '1px solid #333'
                    }}>
                        <h4 style={{ color: '#666', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase' }}>Notas Internas</h4>
                        <p style={{ color: '#bbb', fontSize: '14px', fontStyle: 'italic', margin: 0 }}>
                            {proveedor.comentarios || "Sin observaciones registradas para este proveedor."}
                        </p>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="asiento-footer" style={{ flexShrink: 0 }}>
                    <button className="action-button secondary-button" onClick={() => onPageChange("VER_PROVEEDORES")}>
                        <img src={LogoGrupo5} alt="Back" className="icon-small" /> VOLVER A LISTADO
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
                .data-value { color: #f0f0f0; font-size: 14px; font-weight: 500; }
                .data-row:last-child { border-bottom: none; }
            `}</style>
        </div>
    );
}