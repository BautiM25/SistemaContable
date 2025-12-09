// src/components/ReporteLibroDiario.jsx - Actualizado
import React, { useState } from 'react';
import axios from 'axios';
import LogoGrupo5 from '../assets/LogoGrupo5.png';
import '../styles/ReporteStyles.css';

const ReporteLibroDiario = ({ onVolver }) => {
    const [asientos, setAsientos] = useState([]);
    const [desde, setDesde] = useState('');
    const [hasta, setHasta] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!desde || !hasta) {
            setError("Por favor, seleccione un rango de fechas.");
            return;
        }

        setLoading(true);
        axios.get('http://localhost:8080/api/asientos/entre-fechas', {
            params: { desde, hasta }
        })
        .then(response => {
            setAsientos(response.data);
            setLoading(false);
        })
        .catch(err => {
            setError("Error al obtener el Libro Diario. Verifique el rango de fechas.");
            setAsientos([]);
            setLoading(false);
        });
    };

    let totalDiarioDebe = 0;
    let totalDiarioHaber = 0;

    return (
        <div className="reporte-contenido-interno">
            {/* FILTROS */}
            <div className="reporte-filters">
                <h3 className="filter-title">Filtros del Reporte</h3>
                <form onSubmit={handleSubmit} className="filter-controls">
                    <div className="filter-field">
                        <label htmlFor="desde">Desde:</label>
                        <input 
                            type="date" 
                            id="desde" 
                            value={desde} 
                            onChange={(e) => setDesde(e.target.value)} 
                            className="input-base" 
                            required 
                        />
                    </div>
                    <div className="filter-field">
                        <label htmlFor="hasta">Hasta:</label>
                        <input 
                            type="date" 
                            id="hasta" 
                            value={hasta} 
                            onChange={(e) => setHasta(e.target.value)} 
                            className="input-base" 
                            required 
                        />
                    </div>
                    <button type="submit" className="search-button" disabled={loading}>
                        <img src={LogoGrupo5} alt="Buscar" className="icon-small" />
                        {loading ? 'Cargando...' : 'Generar Diario'}
                    </button>
                </form>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            {/* LISTADO DE ASIENTOS */}
            {asientos.length > 0 ? (
                <div className="reporte-table-container">
                    <h3 className="filter-title">Asientos del {desde} al {hasta}</h3>
                    
                    {asientos.map((asiento) => {
                        let totalDebe = 0;
                        let totalHaber = 0;
                        
                        if (asiento.detalles) {
                            asiento.detalles.forEach(d => {
                                totalDiarioDebe += d.debe;
                                totalDiarioHaber += d.haber;
                            });
                        }

                        return (
                            <div key={asiento.id} className="reporte-asiento-card">
                                <h4>Asiento N° {asiento.id} - Fecha: {asiento.fecha}</h4>
                                <p><strong>Descripción:</strong> {asiento.descripcion}</p>
                                
                                <table className="asiento-detalle-tabla">
                                    <thead>
                                        <tr>
                                            <th>Cuenta</th>
                                            <th className="align-right">Debe</th>
                                            <th className="align-right">Haber</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {asiento.detalles?.map((detalle) => {
                                            totalDebe += detalle.debe;
                                            totalHaber += detalle.haber;
                                            const esDebe = detalle.debe > 0;
                                            
                                            return (
                                                <tr key={detalle.id} className={esDebe ? 'detalle-debe' : 'detalle-haber'}>
                                                    <td>{detalle.cuentaNombre || 'Cuenta no encontrada'}</td>
                                                    <td className="align-right">
                                                        {detalle.debe > 0 ? detalle.debe.toFixed(2) : ''}
                                                    </td>
                                                    <td className="align-right">
                                                        {detalle.haber > 0 ? detalle.haber.toFixed(2) : ''}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr className="total-row">
                                            <td><strong>SUMAS IGUALES:</strong></td>
                                            <td className="align-right debe-total">{totalDebe.toFixed(2)}</td>
                                            <td className="align-right haber-total">{totalHaber.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        );
                    })}
                    
                    {/* TOTAL GENERAL */}
                    <div className="reporte-asiento-card">
                        <h3>TOTAL GENERAL DEL PERÍODO</h3>
                        <table className="partidas-table">
                            <thead>
                                <tr>
                                    <th>Concepto</th>
                                    <th className="align-right">Suma del Debe</th>
                                    <th className="align-right">Suma del Haber</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Total del {desde} al {hasta}</strong></td>
                                    <td className="align-right saldo-positivo">{totalDiarioDebe.toFixed(2)}</td>
                                    <td className="align-right saldo-negativo">{totalDiarioHaber.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    {/* BOTÓN VOLVER */}
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <button 
                            onClick={onVolver} 
                            className="action-button"
                        >
                            <img src={LogoGrupo5} alt="Volver" className="icon-small" />
                            Volver al Menú de Reportes
                        </button>
                    </div>
                </div>
            ) : (
                !loading && !error && (
                    <div className="mensaje-vacio">
                        No hay asientos registrados en el rango de fechas seleccionado.
                    </div>
                )
            )}
            
            {loading && <div className="loading-state">Cargando datos del diario...</div>}
        </div>
    );
};

export default ReporteLibroDiario;