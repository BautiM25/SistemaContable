import React, { useState } from "react";
// Reutilizamos el layout base y el estilo de los inputs/botones
import "../styles/Menu.css"; 
// Usaremos los mismos estilos del asiento para la tabla y el layout de 3 filas
import "../styles/RegistrarAsiento.css"; 
import "../styles/LibroDiario.css"; // Estilos específicos del Body
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

export default function LibroDiario() {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    
    // Datos de ejemplo para el reporte (5 columnas)
    const reportData = [
        { fecha: '2025-10-01', descripcion: 'Cobro de facturas', cuenta: 'Caja', debe: '5,000.00', haber: '0.00' },
        { fecha: '2025-10-01', descripcion: 'Cobro de facturas', cuenta: 'Ventas', debe: '0.00', haber: '5,000.00' },
        { fecha: '2025-10-02', descripcion: 'Pago de alquiler', cuenta: 'Alquileres', debe: '1,500.00', haber: '0.00' },
        { fecha: '2025-10-02', descripcion: 'Pago de alquiler', cuenta: 'Banco', debe: '0.00', haber: '1,500.00' },
    ];

    const handleBuscar = () => {
        alert(`Buscando Libro Diario desde ${fechaInicio} hasta ${fechaFin}`);
        // Aquí iría la lógica real para cargar los datos del reporte
    };

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    {/* HEADER: Similar al de Registrar Asiento, pero con título diferente */}
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo Empresa" className="logo-small" />
                            <h2 className="asiento-title">Libro Diario</h2>
                        </div>
                    </div>

                    {/* BODY: Dividido en Filtros y Tabla */}
                    <div className="asiento-body libro-body"> 
                        
                        {/* Filtros de Fecha y Botón de Búsqueda */}
                        <div className="report-filters">
                            <h3 className="filter-title">Seleccionar Período</h3>
                            <div className="filter-controls">
                                <label className="filter-field">Fecha Inicio: 
                                    <input 
                                        type="date" 
                                        className="input-base date-input" 
                                        value={fechaInicio}
                                        onChange={(e) => setFechaInicio(e.target.value)}
                                    />
                                </label>
                                <label className="filter-field">Fecha Fin: 
                                    <input 
                                        type="date" 
                                        className="input-base date-input" 
                                        value={fechaFin}
                                        onChange={(e) => setFechaFin(e.target.value)}
                                    />
                                </label>
                                <button 
                                    className="action-button icon-with-text search-button"
                                    onClick={handleBuscar}
                                >
                                    <img src={LogoGrupo5} alt="Icono Buscar" className="icon-small" /> 
                                    Buscar
                                </button>
                            </div>
                        </div>

                        {/* Tabla de Reporte */}
                        <div className="report-table-wrapper">
                             <h3 className="partidas-title">Resultados del Período</h3>
                            <table className="partidas-table report-table">
                                <thead>
                                    <tr>
                                        <th className="th-date">Fecha</th>
                                        <th className="th-description">Descripción</th>
                                        <th className="th-account">Cuenta</th>
                                        <th className="th-monto">Debe</th>
                                        <th className="th-monto">Haber</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((item, index) => (
                                        <tr key={index}>
                                            <td className="td-date">{item.fecha}</td>
                                            <td className="td-description">{item.descripcion}</td>
                                            <td className="td-account">{item.cuenta}</td>
                                            <td className="td-monto">{item.debe}</td>
                                            <td className="td-monto">{item.haber}</td>
                                        </tr>
                                    ))}
                                    {/* Nota: En reportes, generalmente no se usan filas vacías de entrada, sino filas de datos cargados. */}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* FOOTER: Solo el botón Volver */}
                    <div className="asiento-footer single-button-footer">
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