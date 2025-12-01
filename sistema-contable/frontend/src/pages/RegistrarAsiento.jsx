import React, { useState } from "react";
import "../styles/Menu.css"; 
import "../styles/RegistrarAsiento.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// Datos de ejemplo para el menú de cuentas (serán reemplazados por el endpoint)
const cuentasDummy = [
    { codigo: '1.1.1', nombre: 'Caja' },
    { codigo: '1.1.2', nombre: 'Banco' },
    { codigo: '1.1.3', nombre: 'Cuentas por Cobrar' },
    { codigo: '2.1.1', nombre: 'Proveedores' },
    { codigo: '3.1.1', nombre: 'Capital Social' },
];

// Nuevo Componente para el Input con Dropdown
const CuentaInput = ({ value, onChange, index }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);

    // Filtra las cuentas basado en el texto de búsqueda
    const filteredCuentas = cuentasDummy.filter(cuenta => 
        cuenta.codigo.includes(searchTerm) || cuenta.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setSearchTerm(newValue);
        onChange(index, 'cuenta', newValue); // Actualiza el estado del componente padre
        setIsDropdownOpen(true); // Abre el menú al escribir
    };

    const handleSelectCuenta = (cuenta) => {
        const fullAccountName = `${cuenta.codigo} - ${cuenta.nombre}`;
        setSearchTerm(fullAccountName);
        onChange(index, 'cuenta', fullAccountName); // Rellena el input con el valor completo
        setIsDropdownOpen(false); // Cierra el menú al seleccionar
    };
    
    // Abre/cierra el menú al hacer clic en el input si no está escribiendo
    const handleInputClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Cierra el menú cuando pierde el foco (con un pequeño retraso)
    const handleBlur = () => {
        // Usamos un pequeño retraso para permitir clics en el dropdown
        setTimeout(() => setIsDropdownOpen(false), 200);
    };

    return (
        <div className="cuenta-input-wrapper" onBlur={handleBlur}>
            <input 
                type="text" 
                className="table-input cuenta-input" 
                placeholder="Buscar cuenta..."
                value={searchTerm}
                onChange={handleInputChange}
                onClick={handleInputClick}
                onFocus={() => setIsDropdownOpen(true)}
            />

            {isDropdownOpen && (
                <div className="cuenta-dropdown">
                    {filteredCuentas.length > 0 ? (
                        filteredCuentas.map((cuenta) => (
                            <div 
                                key={cuenta.codigo} 
                                className="dropdown-item"
                                // Mousedown se usa para registrar el clic antes del evento onBlur
                                onMouseDown={() => handleSelectCuenta(cuenta)} 
                            >
                                <span className="item-code">{cuenta.codigo}</span>
                                <span className="item-name">{cuenta.nombre}</span>
                            </div>
                        ))
                    ) : (
                        <div className="dropdown-item no-results">No se encontraron cuentas</div>
                    )}
                </div>
            )}
        </div>
    );
};


// Componente principal: Acepta onPageChange para la navegación
export default function RegistrarAsiento({ onPageChange }) {
    // Estado inicial: una sola fila vacía
    const [partidas, setPartidas] = useState([
        { cuenta: '', debe: '', haber: '' }
    ]);

    // Función para añadir una nueva fila al estado
    const agregarFila = () => {
        setPartidas([...partidas, { cuenta: '', debe: '', haber: '' }]);
    };

    // Función para manejar cambios en los inputs (necesario para React)
    const handleInputChange = (index, field, value) => {
        const nuevasPartidas = [...partidas];
        nuevasPartidas[index][field] = value;
        setPartidas(nuevasPartidas);
    };

    // FUNCIÓN CLAVE: Navega de vuelta al menú (DASHBOARD)
    const handleVolver = () => {
        // Llama a la función que resetea la página al menú (DASHBOARD) en App.jsx
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
                            <h2 className="asiento-title">Registro de Nuevo Asiento Contable</h2>
                        </div>
                        
                        <div className="header-fields-wrapper">
                            <label className="header-field">Descripción: 
                                <input 
                                    type="text" 
                                    className="input-base description-input" 
                                    placeholder="Descripción del asiento..." 
                                    required
                                />
                            </label>
                            <label className="header-field">Fecha: 
                                <input 
                                    type="date" 
                                    className="input-base date-input" 
                                    required
                                />
                            </label>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="asiento-body">
                        <h3 className="partidas-title">Partidas del Asiento</h3>
                        <table className="partidas-table">
                            <thead>
                                <tr>
                                    <th className="th-cuenta">Cuenta</th>
                                    <th className="th-monto">Debe</th>
                                    <th className="th-monto">Haber</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Mapeo de las filas del estado */}
                                {partidas.map((partida, index) => (
                                    <tr className="partida-row" key={index}>
                                        <td>
                                            {/* REEMPLAZO DEL INPUT POR EL COMPONENTE CUSTOM */}
                                            <CuentaInput 
                                                value={partida.cuenta}
                                                onChange={handleInputChange}
                                                index={index}
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="number" 
                                                className="table-input monto-input" 
                                                placeholder="0.00"
                                                value={partida.debe}
                                                onChange={(e) => handleInputChange(index, 'debe', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="number" 
                                                className="table-input monto-input" 
                                                placeholder="0.00"
                                                value={partida.haber}
                                                onChange={(e) => handleInputChange(index, 'haber', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER */}
                    <div className="asiento-footer">
                        <button 
                            className="action-button icon-with-text add-button"
                            onClick={agregarFila}
                        >
                            <img src={LogoGrupo5} alt="Icono Agregar" className="icon-small" /> 
                            Agregar Fila
                        </button>
                        <button className="action-button icon-with-text save-button">
                            <img src={LogoGrupo5} alt="Icono Guardar" className="icon-small" /> 
                            Guardar
                        </button>
                        
                        {/* BOTÓN VOLVER MODIFICADO PARA NAVEGAR */}
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