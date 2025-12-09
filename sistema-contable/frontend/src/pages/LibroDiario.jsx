import React, { useState } from "react";
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css";
import "../styles/LibroDiario.css";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

export default function LibroDiario() {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [reportData, setReportData] = useState([]);

    const today = new Date().toISOString().split("T")[0];

    const handleBuscar = async () => {
        // Validación de fechas
        if (fechaInicio > today || fechaFin > today) {
            alert("Las fechas no pueden ser mayores al día de hoy.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            console.log("Token usado:", token); // DEBUG: Ver si hay token

            const response = await fetch(
                `http://localhost:8080/api/asientos/entre-fechas?desde=${fechaInicio}&hasta=${fechaFin}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json" // Buena práctica añadir esto
                    }
                }
            );

            // Si el backend devuelve error (ej. 403 o 500), lanzamos error con el texto
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("Datos recibidos:", data); // DEBUG: Ver los datos
            setReportData(data);

        } catch (error) {
            console.error("Detalle del error:", error); // MIRA ESTO EN LA CONSOLA (F12)
            alert(`Error: ${error.message}`);
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
                            <h2 className="asiento-title">Libro Diario</h2>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="asiento-body libro-body">
                        <div className="report-filters">
                            <h3 className="filter-title">Seleccionar Período</h3>
                            <div className="filter-controls">
                                <label className="filter-field">Fecha Inicio:
                                    <input
                                        type="date"
                                        className="input-base date-input"
                                        value={fechaInicio}
                                        max={today}
                                        onChange={(e) => setFechaInicio(e.target.value)}
                                    />
                                </label>
                                <label className="filter-field">Fecha Fin:
                                    <input
                                        type="date"
                                        className="input-base date-input"
                                        value={fechaFin}
                                        max={today}
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

                        {/* Tabla con scroll */}
                        <div className="report-table-wrapper" style={{ maxHeight: "300px", overflowY: "auto" }}>
                            <h3 className="partidas-title">Resultados del Período</h3>
                            <table className="partidas-table report-table">
                                <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Descripción</th>
                                    <th>Cuenta</th>
                                    <th>Debe</th>
                                    <th>Haber</th>
                                </tr>
                                </thead>
                                <tbody>
                                {reportData.map((asiento) => (
                                    <React.Fragment key={asiento.id}>
                                        <tr className="asiento-row">
                                            <td>{asiento.fecha}</td>
                                            <td>{asiento.descripcion}</td>
                                            <td colSpan="3">Creado por: {asiento.creador}</td>
                                        </tr>

                                        {asiento.detalles.map((det) => (
                                            <tr key={det.id} className="detalle-row">
                                                <td></td>
                                                <td></td>
                                                <td>{det.cuentaNombre}</td>
                                                <td>{det.debe}</td>
                                                <td>{det.haber}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                                </tbody>


                            </table>
                        </div>
                    </div>

                    {/* FOOTER */}
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
