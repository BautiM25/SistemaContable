// src/components/VerReportes.jsx
import React, { useState } from 'react';
import ReporteLibroDiario from './ReporteLibroDiario';
import ReporteLibroMayor from './ReporteLibroMayor';
import LogoEmpresa from '../assets/LogoEmpresa.png';
import LogoGrupo5 from '../assets/LogoGrupo5.png';
import '../styles/ReporteStyles.css';

const VISTAS = {
    NINGUNA: 'NINGUNA',
    DIARIO: 'DIARIO',
    MAYOR: 'MAYOR',
};

const VerReportes = ({ onPageChange }) => {
    const [vistaActual, setVistaActual] = useState(VISTAS.NINGUNA);

    const handleVolver = () => {
        if (onPageChange) {
            onPageChange("DASHBOARD");
        }
    };

    const handleVolverMenu = () => {
        setVistaActual(VISTAS.NINGUNA);
    };

    const renderReporte = () => {
        switch (vistaActual) {
            case VISTAS.DIARIO:
                return <ReporteLibroDiario onVolver={handleVolverMenu} />;
            case VISTAS.MAYOR:
                return <ReporteLibroMayor onVolver={handleVolverMenu} />;
            case VISTAS.NINGUNA:
            default:
                return (
                    <div className="mensaje-vacio">
                        <p>Seleccione un tipo de reporte para comenzar la visualización.</p>
                        <p>
                            El <strong>Libro Diario</strong> muestra el registro cronológico de todas las transacciones.
                            <br />
                            El <strong>Libro Mayor</strong> resume los movimientos de una cuenta específica.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="reportes-page-container">
            <div className="reportes-main-content">
                <div className="reportes-layout-column">
                    
                    {/* HEADER IDÉNTICO AL DE REGISTRAR ASIENTO */}
                    <div className="reportes-header">
                        <div className="reportes-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo Empresa" className="reportes-logo-small" />
                            <h2 className="reportes-title">📊 Generador de Reportes Contables</h2>
                        </div>
                        
                        <div className="selector-reportes-wrapper">
                            <button
                                className={`selector-button ${vistaActual === VISTAS.DIARIO ? 'active' : ''}`}
                                onClick={() => setVistaActual(VISTAS.DIARIO)}
                            >
                                <img src={LogoGrupo5} alt="Icono Diario" className="icon-small" />
                                Libro Diario
                            </button>
                            <button
                                className={`selector-button ${vistaActual === VISTAS.MAYOR ? 'active' : ''}`}
                                onClick={() => setVistaActual(VISTAS.MAYOR)}
                            >
                                <img src={LogoGrupo5} alt="Icono Mayor" className="icon-small" />
                                Libro Mayor
                            </button>
                        </div>
                    </div>

                    {/* BODY CON CONTENIDO DEL REPORTE */}
                    <div className="reportes-body">
                        <div className="reporte-contenido">
                            {renderReporte()}
                        </div>
                    </div>

                    {/* FOOTER CON BOTÓN VOLVER */}
                    <div className="reportes-footer">
                        <button 
                            className="action-button back-button-footer"
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
};

export default VerReportes;