import React, { useState, useEffect } from "react";
import api from "../services/api";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from '../assets/LogoGrupo5.png';

export default function VerCuentasCorrientes({ onPageChange }) {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        const cargarSaldos = async () => {
            try {
                // Usamos el endpoint que ya tenés para traer proveedores activos
                const res = await api.get("/proveedores?status=true");
                setProveedores(res.data);
            } catch (err) {
                console.error("Error al cargar Cuentas Corrientes:", err);
            } finally {
                setLoading(false);
            }
        };
        cargarSaldos();
    }, []);

    // Lógica contable: Deuda Inicial - Pagos/Saldos a favor
    const calcularSaldoNeto = (p) => {
        const inicial = p.saldoInicialCC || 0;
        const aFavor = p.saldosAFavor || 0;
        return inicial - aFavor;
    };

    const filtrados = proveedores.filter(p => 
        p.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
        p.cuitCuil.includes(filtro)
    );

    if (loading) return <div style={{color: 'white', textAlign: 'center', padding: '50px'}}>Sincronizando estados financieros...</div>;

    return (
        <div className="page-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                
                {/* HEADER */}
                <div className="asiento-header" style={{ flexShrink: 0 }}>
                    <div className="asiento-logo-wrapper">
                        <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                        <h2 className="asiento-title">Panel de Cuentas Corrientes</h2>
                    </div>
                    <input 
                        className="input-base" 
                        placeholder="Buscar proveedor o CUIT..." 
                        style={{ width: '300px' }}
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </div>

                {/* TABLA DE SALDOS */}
                <div className="asiento-body" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    <table className="partidas-table" style={{ width: '100%', borderCollapse: 'collapse', background: '#2a2a2a' }}>
                        <thead>
                            <tr style={{ background: '#333' }}>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#000000' }}>Proveedor</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#000000' }}>CUIT/CUIL</th>
                                <th style={{ padding: '12px', textAlign: 'right', color: '#000000' }}>Saldo Inicial</th>
                                <th style={{ padding: '12px', textAlign: 'right', color: '#000000' }}>A Favor</th>
                                <th style={{ padding: '12px', textAlign: 'right', color: '#000000' }}>Saldo Neto</th>
                                <th style={{ padding: '12px', textAlign: 'center', color: '#000000' }}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrados.map(p => {
                                const neto = calcularSaldoNeto(p);
                                return (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #444' }}>
                                        <td style={{ padding: '12px', color: '#000000', fontWeight: 'bold' }}>{p.nombre}</td>
                                        <td style={{ padding: '12px', color: '#000000' }}>{p.cuitCuil}</td>
                                        <td style={{ padding: '12px', textAlign: 'right', color: '#000000' }}>
                                            ${p.saldoInicialCC?.toLocaleString() || "0.00"}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right', color: '#4caf50' }}>
                                            -${p.saldosAFavor?.toLocaleString() || "0.00"}
                                        </td>
                                        <td style={{ 
                                            padding: '12px', 
                                            textAlign: 'right', 
                                            fontWeight: 'bold',
                                            color: neto > 0 ? '#ff4d4d' : '#4caf50' 
                                        }}>
                                            ${neto.toLocaleString()}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <span style={{ 
                                                fontSize: '10px', padding: '4px 8px', borderRadius: '4px',
                                                background: neto > 0 ? '#422' : '#1b2e1b',
                                                color: neto > 0 ? '#ff4d4d' : '#4caf50'
                                            }}>
                                                {neto > 0 ? "DEUDA" : "AL DÍA"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER */}
                <div className="asiento-footer" style={{ flexShrink: 0 }}>
                    <button className="action-button secondary-button" onClick={() => onPageChange("DASHBOARD")}>
                        <img src={LogoGrupo5} alt="Back" className="icon-small" /> VOLVER AL MENÚ
                    </button>
                </div>
            </div>
        </div>
    );
}