// Archivo: src/components/PlanDeCuentas.jsx

import React, { useState, useEffect } from "react";
import { obtenerCuentas } from "../services/cuentaService"; // <-- Importamos el servicio
import { buildCuentaTree } from "../utils/treeConverter"; // <-- Importamos el conversor
// Reutilizamos el layout base y estilos de botones/inputs
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/PlanDeCuentas.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// Componente recursivo para renderizar cada nodo del árbol
// NOTA: Usamos 'nombreCuenta' e 'id' de tu DTO, no 'codigo' y 'nombre' del ejemplo anterior.
const CuentaNodo = ({ cuenta }) => {
    const hasChildren = cuenta.children && cuenta.children.length > 0;

    return (
        <li className={`cuenta-node ${hasChildren ? 'parent-node' : 'leaf-node'}`}>
            {/* Usamos el ID de la cuenta para referencia */}
            <span className="cuenta-code">[ID: {cuenta.id}]</span> 
            <span className="cuenta-name">{cuenta.nombreCuenta}</span> 
            {/* Etiqueta para indicar si es una cuenta que se puede usar en asientos */}
            {cuenta.esHoja && <span className="hoja-badge">(Hoja)</span>}

            {hasChildren && (
                <ul className="subcuentas-list">
                    {cuenta.children.map((child) => (
                        <CuentaNodo key={child.id} cuenta={child} /> 
                    ))}
                </ul>
            )}
        </li>
    );
};


export default function PlanDeCuentas() {
    // 1. Estados para manejo de datos y UI
    const [cuentasTree, setCuentasTree] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. useEffect para cargar los datos
    useEffect(() => {
        const cargarCuentas = async () => {
            try {
                // Paso 1: Obtener la lista plana del backend
                const cuentasPlanas = await obtenerCuentas();
                
                // Paso 2: Convertir la lista plana a la estructura de árbol
                const treeData = buildCuentaTree(cuentasPlanas);

                setCuentasTree(treeData); 
                setError(null);
            } catch (err) {
                // Manejo de errores de conexión o del backend
                // Se puede mejorar mostrando el mensaje de error específico del servidor
                setError("Error al cargar las cuentas. Asegúrese que el backend está corriendo.");
            } finally {
                setLoading(false);
            }
        };

        cargarCuentas();
    }, []); // El array vacío asegura que se ejecuta solo al montar el componente

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
                        {/* Botón para la funcionalidad de Administrador (Crear) */}
                        <button className="action-button primary-button">
                            Crear Nueva Cuenta
                        </button>
                    </div>

                    {/* BODY: Contenedor del Árbol */}
                    <div className="asiento-body plan-cuentas-body"> 
                        <h3 className="partidas-title">Estructura Jerárquica</h3>
                        
                        <div className="arbol-container">
                            {cuentasTree.length === 0 ? (
                                <p>No hay cuentas cargadas en el sistema o las cuentas no tienen una estructura de padre/hijo definida.</p>
                            ) : (
                                <ul className="plan-cuentas-root">
                                    {/* Mapea las cuentas raíz que devuelve buildCuentaTree */}
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
                            onClick={handleVolver} // CLAVE: Llama a la función de navegación
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