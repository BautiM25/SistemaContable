import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/VerProveedores.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

export default function VerProveedores({ onPageChange }) {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showActive, setShowActive] = useState(true); // true = activos, false = inactivos

    const fetchProveedores = async () => {
        setLoading(true);
        try {
            // 🚨 ENDPOINT CORRECTO: /api/proveedores/status?status=...
            // Como tu JSON es una lista directa [], usamos response.data
            const response = await api.get(`/proveedores/status?status=${showActive}`);
            setProveedores(response.data); 
        } catch (err) {
            console.error("Error al cargar proveedores:", err);
            setProveedores([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, [showActive]);

    const handleVerDetalle = (id) => {
        if (onPageChange) {
            onPageChange("CONSULTA_PROVEEDOR", { id }); 
        }
    };

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
                        <div className="list-controls" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <h3 className="partidas-title" style={{ border: 'none' }}>
                                Listado de cuentas {showActive ? 'Activas' : 'Inactivas'}
                            </h3>

                            <div className="toggle-wrapper">
                                <span className={`label-toggle ${!showActive ? 'selected' : ''}`}>Inactivos</span>
                                <label className="switch">
                                    <input 
                                        type="checkbox" 
                                        checked={showActive} 
                                        onChange={() => setShowActive(!showActive)} 
                                    />
                                    <span className="slider round"></span>
                                </label>
                                <span className={`label-toggle ${showActive ? 'selected' : ''}`}>Activos</span>
                            </div>
                        </div>
                        
                        <div className="table-wrapper-scroll" style={{ flexGrow: 1, overflowY: 'auto' }}>
                            <table className="bancos-table" style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>CUIT/CUIL</th>
                                        <th>Rubro</th>
                                        <th>Email</th>
                                        <th>Banco</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" style={{ textAlign: 'center' }}>Cargando...</td></tr>
                                    ) : proveedores.length > 0 ? (
                                        proveedores.map((prov) => (
                                            <tr key={prov.id}>
                                                <td style={{ fontWeight: 'bold' }}>{prov.nombre}</td>
                                                <td>{prov.cuitCuil}</td>
                                                <td><span className="badge-rubro">{prov.rubro}</span></td>
                                                <td>{prov.mail}</td>
                                                <td>{prov.banco || 'N/A'}</td>
                                                <td>
                                                    <button 
                                                        className="action-button primary-button" 
                                                        style={{ padding: '5px 10px', fontSize: '11px' }}
                                                        onClick={() => handleVerDetalle(prov.id)}
                                                    >
                                                        VER FICHA
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" style={{ textAlign: 'center' }}>No hay proveedores {showActive ? 'activos' : 'inactivos'}.</td></tr>
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