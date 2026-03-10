import React, { useState, useEffect } from "react";
import api from "../services/api";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from '../assets/LogoGrupo5.png';

export default function VerCuentasCorrientes({ onPageChange }) {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("");
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            // Se asume que el backend ya trae la CuentaCorriente y sus Ordenes anidadas
            const res = await api.get("/proveedores?status=true");
            setProveedores(res.data);
        } catch (err) {
            console.error("Error al cargar Cuentas Corrientes:", err);
        } finally {
            setLoading(false);
        }
    };

    const filtrados = proveedores.filter(p => 
        p.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
        p.cuitCuil.includes(filtro)
    );

    if (loading) return <div style={{color: 'white', textAlign: 'center', padding: '50px'}}>Cargando estados contables...</div>;

    // --- VISTA 1: MAYOR AUXILIAR DETALLADO ---
    if (proveedorSeleccionado) {
        let saldoAcumulado = proveedorSeleccionado.saldoInicialCC || 0;

        return (
            <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <div className="asiento-header">
                    <div className="asiento-logo-wrapper">
                        <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                        <div>
                            <h2 className="asiento-title">Cuenta Corriente: {proveedorSeleccionado.nombre}</h2>
                            <span style={{ color: '#ffffff', fontSize: '12px' }}>CUIT: {proveedorSeleccionado.cuitCuil}</span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right', color: 'white' }}>
                        <p style={{ margin: 0 }}>Saldo Inicial: <strong>${proveedorSeleccionado.saldoInicialCC?.toLocaleString()}</strong></p>
                        <p style={{ margin: 0, color: '#ff4d4d' }}>Saldo Actual: <strong>${proveedorSeleccionado.cuentaCorriente?.saldoActual?.toLocaleString()}</strong></p>
                    </div>
                </div>

                <div className="asiento-body" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    <table className="partidas-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#333' }}>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#000' }}>Fecha</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#000' }}>Comprobante</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#000' }}>Detalle</th>
                                <th style={{ padding: '12px', textAlign: 'right', color: '#000' }}>Debe (Pagos)</th>
                                <th style={{ padding: '12px', textAlign: 'right', color: '#000' }}>Haber (Compras)</th>
                                <th style={{ padding: '12px', textAlign: 'right', color: '#000' }}>Saldo Acum.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Fila de Saldo Inicial */}
                            <tr style={{ borderBottom: '1px solid #444', background: '#222' }}>
                                <td style={{ padding: '12px', color: '#ffffff' }}>-</td>
                                <td style={{ padding: '12px', color: '#ffffff' }}>S/I</td>
                                <td style={{ padding: '12px', color: '#ffffff' }}>SALDO INICIAL DE APERTURA</td>
                                <td style={{ padding: '12px', color: '#ffffff', textAlign: 'right' }}>-</td>
                                <td style={{ padding: '12px', color: '#ffffff', textAlign: 'right' }}>-</td>
                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: 'white' }}>
                                    ${proveedorSeleccionado.saldoInicialCC?.toLocaleString()}
                                </td>
                            </tr>
                            
                            {/* Movimientos: Ordenes de Compra */}
                            {proveedorSeleccionado.cuentaCorriente?.ordenes?.map((oc) => {
                                const esContado = oc.condicionesPago?.toUpperCase() === 'CONTADO';
                                const haber = esContado ? 0 : oc.total; 
                                const debe = 0; // Reservado para futuros pagos
                                saldoAcumulado += (haber - debe);

                                return (
                                    <tr key={oc.id} style={{ borderBottom: '1px solid #444' }}>
                                        <td style={{ padding: '12px', color: 'white' }}>{oc.fechaEmision}</td>
                                        <td style={{ padding: '12px', color: '#aaa' }}>OC {oc.numeroOrdenCompra}</td>
                                        <td style={{ padding: '12px', color: '#aaa' }}>
                                            {esContado ? "Compra Contado (Sin saldo)" : "Compra a Crédito"}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right', color: '#4caf50' }}>-</td>
                                        <td style={{ padding: '12px', textAlign: 'right', color: '#ff4d4d' }}>
                                            ${haber > 0 ? haber.toLocaleString() : "0.00"}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right', color: 'white' }}>
                                            ${saldoAcumulado.toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="asiento-footer">
                    <button className="action-button secondary-button" onClick={() => setProveedorSeleccionado(null)}>
                         VOLVER AL LISTADO
                    </button>
                </div>
            </div>
        );
    }

    // --- VISTA 2: LISTADO GENERAL DE PROVEEDORES ---
    return (
        <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div className="asiento-header">
                <div className="asiento-logo-wrapper">
                    <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                    <h2 className="asiento-title">Cuentas Corrientes de Proveedores</h2>
                </div>
                <input 
                    className="input-base" 
                    placeholder="Buscar por nombre o CUIT..." 
                    style={{ width: '350px' }}
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />
            </div>

            <div className="asiento-body" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                <table className="partidas-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#333' }}>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#000' }}>Proveedor</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#000' }}>CUIT/CUIL</th>
                            <th style={{ padding: '15px', textAlign: 'right', color: '#000' }}>Saldo Inicial</th>
                            <th style={{ padding: '15px', textAlign: 'right', color: '#000' }}>Saldo Actual</th>
                            <th style={{ padding: '15px', textAlign: 'center', color: '#000' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrados.map(p => {
                            const saldo = p.cuentaCorriente?.saldoActual || 0;
                            return (
                                <tr key={p.id} style={{ borderBottom: '1px solid #444', transition: '0.3s' }} className="row-hover">
                                    <td style={{ padding: '15px', color: '#000000', fontWeight: 'bold' }}>{p.nombre}</td>
                                    <td style={{ padding: '15px', color: '#000000' }}>{p.cuitCuil}</td>
                                    <td style={{ padding: '15px', textAlign: 'right', color: '#000000' }}>
                                        ${p.saldoInicialCC?.toLocaleString() || "0.00"}
                                    </td>
                                    <td style={{ 
                                        padding: '15px', 
                                        textAlign: 'right', 
                                        fontWeight: 'bold',
                                        color: saldo > 0 ? '#ff4d4d' : '#4caf50' 
                                    }}>
                                        ${saldo.toLocaleString()}
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <button 
                                            className="action-button primary-button" 
                                            style={{ padding: '5px 15px', fontSize: '12px' }}
                                            onClick={() => setProveedorSeleccionado(p)}
                                        >
                                            VER DETALLES
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="asiento-footer">
                <button className="action-button secondary-button" onClick={() => onPageChange("DASHBOARD")}>
                    <img src={LogoGrupo5} alt="Back" className="icon-small" /> VOLVER AL MENÚ
                </button>
            </div>
        </div>
    );
}