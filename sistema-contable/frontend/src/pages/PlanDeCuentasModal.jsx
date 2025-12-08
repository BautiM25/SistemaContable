import React, { useState, useEffect } from "react";
// Dependencias externas (asumimos que están en tu proyecto)
import { obtenerCuentas } from "../services/cuentaService"; 
import { buildCuentaTree } from "../utils/treeConverter"; 

import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/PlanDeCuentas.css"; // Estilos del árbol
import "../styles/Modal.css"; // Estilos del Modal
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// Componente recursivo para renderizar cada nodo del árbol (sin cambios)
const CuentaNodo = ({ cuenta }) => {
    const hasChildren = cuenta.children && cuenta.children.length > 0;

    return (
        <li className={`cuenta-node ${hasChildren ? 'parent-node' : 'leaf-node'}`}>
            <span className="cuenta-id-label">{cuenta.codigoJerarquico}</span> 
            <span className="cuenta-name">{cuenta.nombreCuenta}</span> 
            
            {cuenta.esHoja && <span className="hoja-badge" title="Cuenta de Hoja (Utilizable en asientos)"></span>}
            
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


// Componente Modal: Plan de Cuentas
export default function PlanDeCuentasModal({ onClose }) {
    const [cuentasTree, setCuentasTree] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // EFECTO para cargar los datos del backend y convertirlos (Lógica copiada de PlanDeCuentas.jsx)
    useEffect(() => {
        const cargarCuentas = async () => {
            try {
                const cuentasPlanas = await obtenerCuentas();
                const treeData = buildCuentaTree(cuentasPlanas);

                setCuentasTree(treeData); 
                setError(null);
            } catch (err) {
                setError("Error al cargar las cuentas. Asegúrese que el backend está corriendo.");
            } finally {
                setLoading(false);
            }
        };

        cargarCuentas();
    }, []); 

    // Renderizado condicional de estados de carga/error dentro del modal
    let content;
    if (loading) {
        content = <div className="loading-state">Cargando Plan de Cuentas...</div>;
    } else if (error) {
        content = <div className="error-state" style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
    } else if (cuentasTree.length === 0) {
        content = <p>No hay cuentas cargadas en el sistema.</p>;
    } else {
         content = (
            <div className="arbol-container">
                <ul className="plan-cuentas-root">
                    {cuentasTree.map((cuenta) => (
                        <CuentaNodo key={cuenta.id} cuenta={cuenta} />
                    ))}
                </ul>
            </div>
        );
    }


    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '800px', height: '80vh' }}>
                <h3 className="modal-title">Estructura del Plan de Cuentas</h3>
                
                {/* Contenido del Árbol */}
                <div className="modal-body-scrollable" style={{ flexGrow: 1, overflowY: 'auto', padding: '10px 0' }}>
                    {content}
                </div>

                <div className="modal-actions">
                    <button 
                        className="action-button secondary-button" 
                        onClick={onClose}
                    >
                        Cerrar Visor
                    </button>
                </div>
            </div>
        </div>
    );
}