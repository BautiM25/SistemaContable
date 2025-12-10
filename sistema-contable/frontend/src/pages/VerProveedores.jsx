import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/Menu.css"; 
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Tabs.css"; 
import "../styles/VerProveedores.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// NOTA: MOCKUP eliminado para forzar la carga de la API

export default function VerProveedores({ onPageChange }) {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showActive, setShowActive] = useState(true); // 🚨 NUEVO ESTADO: true = Activos, false = Inactivos

    // Función para obtener los datos de la API según el estado de activo/inactivo
    const fetchProveedores = async (active) => {
        setLoading(true);
        setError(null);
        
        // Define el endpoint basado en el estado (activos o inactivos)
        const endpoint = active ? "/suppliers/actives" : "/suppliers/inactives";
        
        try {
            // Usamos un límite alto para obtener toda la lista (asumiendo pocos datos)
            const response = await api.get(`${endpoint}?page=1&limit=999`); 
            
            // Mapeamos la respuesta paginada (SupplierResponseDTO) al formato de la tabla
            const list = response.data.content.map(p => ({
                id: p.id, // ID Long para la consulta de detalle
                codigoProveedor: p.code || 'N/A', // Asumimos que el código es 'code'
                nombre: p.name,
                cuitCuil: p.cuit || 'N/D', // Si el DTO no trae CUIT, queda N/D
                pais: p.country || 'N/D',
                telefono1: p.phone || 'N/D', // Asumimos que 'phone' mapea a 'telefono1'
            }));
            
            setProveedores(list);
        } catch (err) {
            console.error(`Error al cargar ${active ? 'activos' : 'inactivos'}:`, err.response || err);
            setError(`Error al cargar proveedores. Intente nuevamente. (${err.response?.status})`);
            setProveedores([]);
        } finally {
            setLoading(false);
        }
    };

    // 🚨 Efecto de Carga: Se ejecuta al inicio y cada vez que showActive cambia
    useEffect(() => {
        fetchProveedores(showActive);
    }, [showActive]);


    // 🚨 CLAVE: Navega a la nueva vista de Consulta (haciendo GET para el detalle completo)
    const handleVerDetalle = (proveedor) => {
        if (onPageChange && proveedor.id) {
            // Pasamos el ID y la página de destino.
            // La vista de ConsultaProveedor se encargará de hacer el GET por ID.
            onPageChange("CONSULTA_PROVEEDOR", { id: proveedor.id }); 
        } else {
            alert("No se pudo obtener el ID del proveedor para ver el detalle.");
        }
    };

    const handleVolver = () => {
        if (onPageChange) {
            onPageChange("GESTION_PROVEEDORES"); 
        }
    };

    // Función para alternar el estado (toggle)
    const handleToggle = () => {
        setShowActive(prev => !prev);
    };

    if (loading) return <div className="loading-state">Cargando lista de proveedores...</div>;
    if (error) return <div className="error-state">{error}</div>;

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    {/* HEADER */}
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo Empresa" className="logo-small" />
                            <h2 className="asiento-title">Lista de Proveedores ({showActive ? 'Activos' : 'Inactivos'})</h2>
                        </div>
                    </div>

                    {/* BODY: Tabla de Proveedores */}
                    <div className="asiento-body gestion-body form-body"> 
                        
                        {/* 🚨 TOGGLE ACTIVO / INACTIVO */}
                        <div className="toggle-container">
                            <span className={!showActive ? 'active' : ''}>INACTIVOS</span>
                            <label className="switch">
                                <input type="checkbox" checked={showActive} onChange={handleToggle} />
                                <span className="slider round"></span>
                            </label>
                            <span className={showActive ? 'active' : ''}>ACTIVOS</span>
                        </div>
                        
                        <h3 className="partidas-title" style={{ marginTop: '15px' }}>
                            Haga click en una fila para ver el detalle
                        </h3>
                        
                        <div className="table-list-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '15%' }}>Código</th>
                                        <th style={{ width: '40%' }}>Nombre</th>
                                        <th style={{ width: '25%' }}>CUIT/CUIL</th>
                                        <th style={{ width: '20%' }}>Teléfono</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proveedores.map((prov) => (
                                        <tr key={prov.id || prov.codigoProveedor} onClick={() => handleVerDetalle(prov)} className="clickable-row">
                                            <td>{prov.codigoProveedor}</td>
                                            <td>{prov.nombre}</td>
                                            <td>{prov.cuitCuil}</td>
                                            <td>{prov.telefono1}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {proveedores.length === 0 && <p className="no-data-msg">No hay proveedores {showActive ? 'activos' : 'inactivos'} registrados.</p>}
                        </div>
                    </div>

                    {/* FOOTER: Botón Volver */}
                    <div className="asiento-footer single-button-footer">
                        <button 
                            className="action-button icon-with-text back-button-footer"
                            onClick={handleVolver} 
                        >
                            <img src={LogoGrupo5} alt="Icono Volver" className="icon-small" /> 
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}