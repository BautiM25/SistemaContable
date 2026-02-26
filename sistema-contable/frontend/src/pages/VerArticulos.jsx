import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/VerProveedores.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

export default function VerArticulos({ onPageChange }) {
    const [articulos, setArticulos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 🚨 NUEVOS ESTADOS DE FILTRO
    // 'ACTIVOS', 'INACTIVOS', 'ALERTAS'
    const [filterMode, setFilterMode] = useState('ACTIVOS'); 

    const fetchArticulos = async () => {
        setLoading(true);
        try {
            let url = "";
            
            // Decidimos el endpoint según el modo seleccionado
            if (filterMode === 'ALERTAS') {
                url = "/articulos/alertas-stock";
            } else {
                const status = filterMode === 'ACTIVOS';
                url = `/articulos/status?status=${status}`;
            }

            const response = await api.get(url);
            setArticulos(response.data);
        } catch (err) {
            console.error("Error al cargar datos:", err);
            setArticulos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticulos();
    }, [filterMode]);

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                            <h2 className="asiento-title">Inventario y Stock</h2>
                        </div>
                    </div>

                    <div className="asiento-body"> 
                        
                        <div className="list-controls" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <h3 className="partidas-title" style={{ border: 'none' }}>
                                {filterMode === 'ALERTAS' ? '🚨 Reposición Urgente' : `Productos ${filterMode.toLowerCase()}`}
                            </h3>

                            {/* 🚨 SELECTOR DE TRES MODOS (Botones Segmentados) */}
                            <div className="toggle-wrapper" style={{ gap: '5px' }}>
                                <button 
                                    className={`mode-btn ${filterMode === 'INACTIVOS' ? 'selected-red' : ''}`}
                                    onClick={() => setFilterMode('INACTIVOS')}
                                > INACTIVOS </button>
                                <button 
                                    className={`mode-btn ${filterMode === 'ACTIVOS' ? 'selected-blue' : ''}`}
                                    onClick={() => setFilterMode('ACTIVOS')}
                                > ACTIVOS </button>
                                <button 
                                    className={`mode-btn ${filterMode === 'ALERTAS' ? 'selected-orange' : ''}`}
                                    onClick={() => setFilterMode('ALERTAS')}
                                > ALERTAS </button>
                            </div>
                        </div>
                        
                        <div className="table-wrapper-scroll" style={{ flexGrow: 1, overflowY: 'auto' }}>
                            <table className="bancos-table" style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '15%' }}>SKU / Ref</th>
                                        <th style={{ width: '35%' }}>Descripción</th>
                                        <th style={{ width: '15%' }}>{filterMode === 'ALERTAS' ? 'Stock Mín' : 'Familia'}</th>
                                        <th style={{ width: '15%' }}>Stock Actual</th>
                                        <th style={{ width: '20%' }}>Estado / Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" style={{ textAlign: 'center' }}>Sincronizando...</td></tr>
                                    ) : articulos.length > 0 ? (
                                        articulos.map((art) => (
                                            <tr key={art.id}>
                                                <td style={{ fontWeight: 'bold' }}>{art.referencia}</td>
                                                <td>{art.descripcion}</td>
                                                <td>
                                                    {filterMode === 'ALERTAS' ? 
                                                        <span style={{ color: '#888' }}>{art.stockMinimo} units</span> : 
                                                        <span className="badge-rubro">{art.familia}</span>
                                                    }
                                                </td>
                                                <td style={{ 
                                                    fontWeight: 'bold', 
                                                    color: filterMode === 'ALERTAS' ? (art.esIgualAlMinimo ? '#ffc107' : '#ff4d4d') : '#f0f0f0' 
                                                }}>
                                                    {art.stockFisico}
                                                </td>
                                                <td>
                                                    <button 
                                                        className="action-button primary-button" 
                                                        style={{ padding: '4px 8px', fontSize: '10px' }}
                                                        onClick={() => onPageChange("CONSULTA_ARTICULO", { id: art.id })}
                                                    >
                                                        DETALLES
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" style={{ textAlign: 'center' }}>No hay datos para este filtro.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="asiento-footer">
                        <button className="action-button secondary-button" onClick={() => onPageChange("GESTION_STOCK")}>
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}