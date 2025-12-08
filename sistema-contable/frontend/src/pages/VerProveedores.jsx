import React, { useState, useEffect } from "react";
import api from "../services/api"; // Para futura carga real
import "../styles/Menu.css"; 
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Tabs.css"; 
import "../styles/VerProveedores.css"; // Nuevo archivo CSS para la tabla
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// Mockup de Datos de Proveedores (Simulación de la respuesta API)
const MOCK_PROVEEDORES_LIST = [
    { codigoProveedor: 'P001', nombre: 'Distribuidora Luka', cuitCuil: '30-12345678-9', pais: 'ARG', telefono1: '4777-1111' },
    { codigoProveedor: 'P002', nombre: 'Aceros Global S.A.', cuitCuil: '20-98765432-1', pais: 'ARG', telefono1: '4888-2222' },
    { codigoProveedor: 'P003', nombre: 'Quimicos del Sur', cuitCuil: '33-45678901-2', pais: 'CHL', telefono1: '56-2-123456' },
];

export default function VerProveedores({ onPageChange }) {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProveedores = async () => {
            // Simulación de carga API
            // try {
            //     const response = await api.get("/proveedores"); 
            //     setProveedores(response.data);
            // } catch (err) {
            //     setError("Error al cargar la lista de proveedores.");
            // } finally {
            //     setLoading(false);
            // }
            
            // Usamos el mockup para inicializar
            setProveedores(MOCK_PROVEEDORES_LIST);
            setLoading(false);
        };
        fetchProveedores();
    }, []);

    // 🚨 CLAVE: Navega a la nueva vista de Consulta con el proveedor seleccionado
    const handleVerDetalle = (proveedor) => {
        // En una aplicación real, aquí harías una llamada API para obtener el DTO completo
        // y lo pasarías al componente de consulta.
        
        if (onPageChange) {
            // Usaremos el estado "CONSULTA_PROVEEDOR" y pasaremos el objeto (o ID)
            onPageChange("CONSULTA_PROVEEDOR", proveedor); 
        }
    };

    const handleVolver = () => {
        if (onPageChange) {
            onPageChange("GESTION_PROVEEDORES"); 
        }
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
                            <h2 className="asiento-title">Lista de Proveedores Registrados</h2>
                        </div>
                    </div>

                    {/* BODY: Tabla de Proveedores */}
                    <div className="asiento-body gestion-body form-body"> 
                        <h3 className="partidas-title">Haga click en una fila para ver el detalle</h3>
                        
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
                                        <tr key={prov.codigoProveedor} onClick={() => handleVerDetalle(prov)} className="clickable-row">
                                            <td>{prov.codigoProveedor}</td>
                                            <td>{prov.nombre}</td>
                                            <td>{prov.cuitCuil}</td>
                                            <td>{prov.telefono1}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {proveedores.length === 0 && <p className="no-data-msg">No hay proveedores registrados.</p>}
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