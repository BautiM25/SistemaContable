import React, { useState, useEffect } from "react";
import { obtenerCuentas } from "../services/cuentaService"; 
// Importamos la utilidad que ahora calcula el código jerárquico
import { buildCuentaTree } from "../utils/treeConverter"; 

// Reutilizamos el layout base y estilos de botones/inputs
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/PlanDeCuentas.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// Componente recursivo para renderizar cada nodo del árbol
const CuentaNodo = ({ cuenta }) => {
    const hasChildren = cuenta.children && cuenta.children.length > 0;

    return (
        <li className={`cuenta-node ${hasChildren ? 'parent-node' : 'leaf-node'}`}>
            
            {/* ⭐ CLAVE: Muestra el código jerárquico calculado en el Frontend */}
            <span className="cuenta-id-label">{cuenta.codigoJerarquico}</span> 
            
            <span className="cuenta-name">{cuenta.nombreCuenta}</span> 
            
            {/* Ícono para cuenta de hoja (Hoja = utilizable para asientos) */}
            {cuenta.esHoja && <span className="hoja-badge" title="Cuenta de Hoja (Utilizable en asientos)"></span>}
            
            {hasChildren && (
                <ul className="subcuentas-list">
                    {/* Usamos el ID original para la key, ya que es único */}
                    {cuenta.children.map((child) => (
                        <CuentaNodo key={child.id} cuenta={child} /> 
                    ))}
                </ul>
            )}
        </li>
    );
};


export default function PlanDeCuentas({onPageChange}) {
    // ESTADOS PARA CARGA DE DATOS REALES
    const [cuentasTree, setCuentasTree] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleVolver = () => {
        if (onPageChange) {
            onPageChange("DASHBOARD"); 
        }
    };

    // EFECTO para cargar los datos del backend y convertirlos
    useEffect(() => {
        const cargarCuentas = async () => {
            try {
                const cuentasPlanas = await obtenerCuentas();
                
                // Conversión y cálculo del código jerárquico
                const treeData = buildCuentaTree(cuentasPlanas);

                setCuentasTree(treeData); 
                setError(null);
            } catch (err) {
                console.error("Detalle del Error:", err);
                setError("Error al cargar las cuentas. Asegúrese que el backend está corriendo.");
            } finally {
                setLoading(false);
            }
        };

        cargarCuentas();
    }, []); 


    // Renderizado condicional de estados de carga/error
    if (loading) {
        return <div className="loading-state">Cargando Plan de Cuentas...</div>;
    }

    if (error) {
        return <div className="error-state" style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
            <p>{error}</p>
            <p>Revise la consola del navegador para más detalles.</p>
        </div>;
    }


    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    {/* HEADER */}
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo Empresa" className="logo-small" />
                            <h2 className="asiento-title">Plan de Cuentas</h2>
                        </div>
                        <button className="action-button primary-button">
                            Crear Nueva Cuenta
                        </button>
                    </div>

                    {/* BODY: Contenedor del Árbol */}
                    <div className="asiento-body plan-cuentas-body"> 
                        <h3 className="partidas-title">Estructura Jerárquica</h3>
                        
                        <div className="arbol-container">
                            {cuentasTree.length === 0 ? (
                                <p>No hay cuentas cargadas en el sistema. Utilice el botón "Crear Nueva Cuenta" para comenzar.</p>
                            ) : (
                                <ul className="plan-cuentas-root">
                                    {cuentasTree.map((cuenta) => (
                                        <CuentaNodo key={cuenta.id} cuenta={cuenta} />
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* FOOTER: Solo el botón Volver */}
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