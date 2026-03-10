import React, { useState, useEffect } from "react";
import api from "../services/api";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from '../assets/LogoGrupo5.png';

export default function VerCuentasCorrientes({ onPageChange }) {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("");
    
    // Estado para los datos detallados del nuevo endpoint
    const [datosCC, setDatosCC] = useState(null);
    const [loadingDetalle, setLoadingDetalle] = useState(false);

    useEffect(() => {
        cargarProveedores();
    }, []);

    const cargarProveedores = async () => {
        try {
            const res = await api.get("/proveedores?status=true");
            setProveedores(res.data);
        } catch (err) {
            console.error("Error al cargar proveedores:", err);
        } finally {
            setLoading(false);
        }
    };

    // 🚀 NUEVA FUNCIÓN: Consume el endpoint que acabamos de crear
    const verDetalleCuenta = async (idProveedor) => {
        setLoadingDetalle(true);
        try {
            const res = await api.get(`/cuentas-corrientes/proveedor/${idProveedor}`);
            setDatosCC(res.data);
        } catch (err) {
            alert("Error al obtener el estado de cuenta detallado.");
            console.error(err);
        } finally {
            setLoadingDetalle(false);
        }
    };

    // 📄 FUNCIÓN DE EXPORTACIÓN A PDF
    const exportarPDF = () => {
        if (!datosCC) return;

        const doc = new jsPDF();
        
        // Encabezado
        doc.setFillColor(60, 108, 62); // Verde BASE #3c6c3e
        doc.rect(0, 0, 210, 35, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.text("ESTADO DE CUENTA CORRIENTE", 14, 22);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`Proveedor: ${datosCC.nombreProveedor}`, 14, 45);
        doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 14, 50);
        doc.text(`Saldo Actual: $${datosCC.saldoActual.toLocaleString()}`, 14, 55);

        // Tabla - Filtrando haber = 0
        const movimientosFiltrados = datosCC.movimientos.filter(m => m.haber !== 0);
        const columnas = ["Fecha", "Comprobante", "Detalle", "Debe", "Haber", "Saldo Acum."];
        const filas = movimientosFiltrados.map(m => [
            new Date(m.fecha).toLocaleDateString(),
            m.comprobante,
            m.detalle,
            m.debe > 0 ? `$${m.debe.toLocaleString()}` : "-",
            m.haber > 0 ? `$${m.haber.toLocaleString()}` : "-",
            `$${m.saldoAcumulado.toLocaleString()}`
        ]);

        autoTable(doc, {
            startY: 65,
            head: [columnas],
            body: filas,
            theme: 'grid',
            headStyles: { fillColor: [60, 108, 62] },
            styles: { fontSize: 8 }
        });

        doc.save(`CC_${datosCC.nombreProveedor.replace(/\s+/g, '_')}.pdf`);
    };

    const filtrados = proveedores.filter(p => 
        p.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
        p.cuitCuil.includes(filtro)
    );

    if (loading) return <div style={{color: 'white', textAlign: 'center', padding: '50px'}}>Cargando estados contables...</div>;

    // --- VISTA 1: MAYOR AUXILIAR DETALLADO (Basado en el nuevo endpoint) ---
    if (datosCC) {
        // 🎯 Filtramos aquí los movimientos que no tengan Haber (compras que no generan deuda)
        const movimientosVisibles = datosCC.movimientos.filter(m => m.haber !== 0);

        return (
            <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <div className="asiento-header">
                    <div className="asiento-logo-wrapper">
                        <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                        <h2 className="asiento-title">Cuenta Corriente: {datosCC.nombreProveedor}</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="action-button primary-button" style={{ background: '#3c6c3e' }} onClick={exportarPDF}>
                            PDF
                        </button>
                        <button className="action-button secondary-button" onClick={() => setDatosCC(null)}>
                            VOLVER
                        </button>
                    </div>
                </div>

                <div className="asiento-body" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    
                    {/* Resumen de Saldo en la parte superior */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                        <div style={{ background: '#1b2e1b', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #4caf50' }}>
                            <span style={{ color: '#4caf50', fontSize: '11px', fontWeight: 'bold' }}>DEUDA TOTAL ACTUAL</span>
                            <h2 style={{ color: '#ffd700', margin: 0 }}>${datosCC.saldoActual.toLocaleString()}</h2>
                        </div>
                    </div>

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
                                    ${datosCC.saldoInicial.toLocaleString()}
                                </td>
                            </tr>
                            
                            {movimientosVisibles.map((mov, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #444' }}>
                                    <td style={{ padding: '12px', color: '#000000' }}>{new Date(mov.fecha).toLocaleDateString()}</td>
                                    <td style={{ padding: '12px', color: '#000000', fontWeight: 'bold' }}>{mov.comprobante}</td>
                                    <td style={{ padding: '12px', color: '#000000' }}>{mov.detalle}</td>
                                    <td style={{ padding: '12px', textAlign: 'right', color: '#ff4d4d' }}>
                                        {mov.debe > 0 ? `-$${mov.debe.toLocaleString()}` : "-"}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right', color: '#35c022' }}>
                                        {mov.haber > 0 ? `$${mov.haber.toLocaleString()}` : "-"}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right', color: '#ffd700', fontWeight: 'bold' }}>
                                        ${mov.saldoAcumulado.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                            // Usamos el saldo inicial que viene en el proveedor
                            const inicial = p.saldoInicialCC || 0;
                            // El saldo actual lo calculamos o lo traemos del objeto anidado si existe
                            const actual = p.cuentaCorriente?.saldoActual || 0;

                            return (
                                <tr key={p.id} style={{ borderBottom: '1px solid #444' }} className="row-hover">
                                    <td style={{ padding: '15px', color: '#000000', fontWeight: 'bold' }}>{p.nombre}</td>
                                    <td style={{ padding: '15px', color: '#000000' }}>{p.cuitCuil}</td>
                                    <td style={{ padding: '15px', textAlign: 'right', color: '#000000' }}>
                                        ${inicial.toLocaleString()}
                                    </td>
                                    <td style={{ 
                                        padding: '15px', 
                                        textAlign: 'right', 
                                        fontWeight: 'bold',
                                        color: actual > 0 ? '#ff4d4d' : '#4caf50' 
                                    }}>
                                        ${actual.toLocaleString()}
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <button 
                                            className="action-button primary-button" 
                                            style={{ padding: '5px 15px', fontSize: '12px' }}
                                            onClick={() => verDetalleCuenta(p.id)}
                                            disabled={loadingDetalle}
                                        >
                                            {loadingDetalle ? "..." : "VER DETALLES"}
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