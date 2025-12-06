import React from "react";
// Reutilizamos el layout base y estilos de botones/inputs
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/PlanDeCuentas.css"; // Estilos específicos del árbol
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// Datos de ejemplo simulando una estructura de árbol contable
const cuentasData = [
    {
        codigo: "1",
        nombre: "Activo",
        children: [
            {
                codigo: "1.1",
                nombre: "Activo Corriente",
                children: [
                    { codigo: "1.1.1", nombre: "Caja y Bancos" },
                    { codigo: "1.1.2", nombre: "Cuentas por Cobrar" },
                ],
            },
            {
                codigo: "1.2",
                nombre: "Activo No Corriente",
                children: [
                    { codigo: "1.2.1", nombre: "Bienes de Uso" },
                ],
            },
        ],
    },
    {
        codigo: "2",
        nombre: "Pasivo",
        children: [
            { codigo: "2.1", nombre: "Cuentas por Pagar" },
            { codigo: "2.2", nombre: "Deudas Bancarias" },
        ],
    },
    { codigo: "3", nombre: "Patrimonio Neto" },
];

// Componente recursivo para renderizar cada nodo del árbol
const CuentaNodo = ({ cuenta }) => {
    // Si la cuenta tiene subcuentas (children), se renderiza la lista anidada
    const hasChildren = cuenta.children && cuenta.children.length > 0;

    return (
        <li className={`cuenta-node ${hasChildren ? 'parent-node' : 'leaf-node'}`}>
            <span className="cuenta-code">{cuenta.codigo}</span>
            <span className="cuenta-name">{cuenta.nombre}</span>

            {hasChildren && (
                <ul className="subcuentas-list">
                    {cuenta.children.map((child) => (
                        <CuentaNodo key={child.codigo} cuenta={child} />
                    ))}
                </ul>
            )}
        </li>
    );
};


export default function PlanDeCuentas({onPageChange}) {
    
    const handleVolver = () => {
        if (onPageChange) {
            onPageChange("DASHBOARD"); 
        }
    };

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
                    </div>

                    {/* BODY: Contenedor del Árbol */}
                    <div className="asiento-body plan-cuentas-body"> 
                        <h3 className="partidas-title">Estructura Jerárquica</h3>
                        
                        <div className="arbol-container">
                            <ul className="plan-cuentas-root">
                                {cuentasData.map((cuenta) => (
                                    <CuentaNodo key={cuenta.codigo} cuenta={cuenta} />
                                ))}
                            </ul>
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