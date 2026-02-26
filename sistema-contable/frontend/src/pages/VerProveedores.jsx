import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/VerProveedores.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";

export default function VerProveedores({ onPageChange }) {
    const [proveedores, setProveedores] = useState([]);
    const [rubros, setRubros] = useState([]); // 🚨 Lista de rubros de la DB
    const [loading, setLoading] = useState(true);
    const [showActive, setShowActive] = useState(true);
    const [rubroSeleccionado, setRubroSeleccionado] = useState("");

    // 1. Cargar la lista de rubros únicos al montar el componente
    useEffect(() => {
        const fetchRubros = async () => {
            try {
                const res = await api.get("/proveedores/rubros");
                setRubros(res.data);
            } catch (err) {
                console.error("Error cargando rubros:", err);
            }
        };
        fetchRubros();
    }, []);

    // 2. Cargar proveedores (por estado o por rubro)
    const fetchProveedores = async () => {
        setLoading(true);
        try {
            let response;
            if (rubroSeleccionado !== "") {
                // Si hay rubro, usamos el endpoint de familia
                response = await api.get(`/proveedores/familia/${rubroSeleccionado}`);
                setShowActive(true); 
            } else {
                // Si no, listado normal por estado
                response = await api.get(`/proveedores/status?status=${showActive}`);
            }
            setProveedores(response.data); 
        } catch (err) {
            setProveedores([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, [showActive, rubroSeleccionado]);

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                            <h2 className="asiento-title">Explorador de Proveedores</h2>
                        </div>
                    </div>

                    <div className="asiento-body"> 
                        <div className="list-controls" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', gap: '15px' }}>
                            
                            {/* 🚨 SELECTOR DE RUBROS DINÁMICO */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexGrow: 1 }}>
                                <label style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>FILTRAR POR RUBRO:</label>
                                <select 
                                    className="input-base" 
                                    style={{ maxWidth: '250px' }}
                                    value={rubroSeleccionado}
                                    onChange={(e) => setRubroSeleccionado(e.target.value)}
                                >
                                    <option value="">-- Todos los rubros --</option>
                                    {rubros.map((r, index) => (
                                        <option key={index} value={r}>{r}</option>
                                    ))}
                                </select>
                                {rubroSeleccionado && (
                                    <button 
                                        className="action-button secondary-button" 
                                        style={{ padding: '5px 10px', fontSize: '10px' }}
                                        onClick={() => setRubroSeleccionado("")}
                                    > LIMPIAR </button>
                                )}
                            </div>

                            <div className="toggle-wrapper">
                                <span className={`label-toggle ${!showActive ? 'selected' : ''}`}>Inactivos</span>
                                <label className="switch">
                                    <input 
                                        type="checkbox" 
                                        checked={showActive} 
                                        onChange={() => {
                                            setShowActive(!showActive);
                                            setRubroSeleccionado(""); // Reset rubro al cambiar estado
                                        }} 
                                    />
                                    <span className="slider round"></span>
                                </label>
                                <span className={`label-toggle ${showActive ? 'selected' : ''}`}>Activos</span>
                            </div>
                        </div>
                        
                        <div className="table-wrapper-scroll" style={{ flexGrow: 1, overflowY: 'auto' }}>
                            <table className="bancos-table" style={{ width: '100%' }}>
                                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>CUIT/CUIL</th>
                                        <th>Rubro</th>
                                        <th>Email</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Cargando...</td></tr>
                                    ) : proveedores.length > 0 ? (
                                        proveedores.map((prov) => (
                                            <tr key={prov.id}>
                                                <td style={{ fontWeight: 'bold' }}>{prov.nombre}</td>
                                                <td>{prov.cuitCuil}</td>
                                                <td><span className="badge-rubro">{prov.rubro}</span></td>
                                                <td>{prov.mail}</td>
                                                <td>
                                                    <button className="action-button primary-button" onClick={() => onPageChange("CONSULTA_PROVEEDOR", { id: prov.id })}>
                                                        VER FICHA
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No hay proveedores para esta selección.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="asiento-footer">
                        <button className="action-button secondary-button" onClick={() => onPageChange("GESTION_PROVEEDORES")}>
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}