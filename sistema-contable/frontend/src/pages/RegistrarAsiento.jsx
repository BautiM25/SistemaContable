import React, { useState } from "react";
import "../styles/Menu.css"; 
import "../styles/RegistrarAsiento.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

export default function RegistrarAsiento() {
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
                                            <input 
                                                type="text" 
                                                className="table-input" 
                                                placeholder="Buscar cuenta..."
                                                value={partida.cuenta}
                                                onChange={(e) => handleInputChange(index, 'cuenta', e.target.value)}
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
                        <button className="action-button icon-with-text back-button-footer">
                            <img src={LogoGrupo5} alt="Icono Volver" className="icon-small" /> 
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}