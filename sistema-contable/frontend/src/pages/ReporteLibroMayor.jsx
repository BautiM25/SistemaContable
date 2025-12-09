// src/components/ReporteLibroMayor.jsx - VERSIÓN CORREGIDA FINAL
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogoGrupo5 from '../assets/LogoGrupo5.png';
import '../styles/ReporteStyles.css';

const ReporteLibroMayor = ({ onVolver }) => {
    const [detalles, setDetalles] = useState([]);
    const [cuentas, setCuentas] = useState([]);
    const [cuentaId, setCuentaId] = useState('');
    const [cuentaNombre, setCuentaNombre] = useState('N/A');
    const [desde, setDesde] = useState('');
    const [hasta, setHasta] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/api/cuentas')
            .then(response => {
                setCuentas(response.data);
            })
            .catch(err => {
                setError("No se pudo cargar la lista de cuentas.");
            });
    }, []);

    const handleCuentaChange = (e) => {
        const selectedId = e.target.value;
        setCuentaId(selectedId);
        const selectedCuenta = cuentas.find(c => c.id === Number(selectedId));
        setCuentaNombre(selectedCuenta ? selectedCuenta.nombreCuenta : 'N/A');
        setSearchPerformed(false); // Resetear cuando cambia la cuenta
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setDetalles([]);
        setSearchPerformed(false);
        
        if (!cuentaId || !desde || !hasta) {
            setError("Por favor, seleccione una cuenta y un rango de fechas.");
            return;
        }

        if (new Date(hasta) < new Date(desde)) {
            setError("La fecha 'Hasta' no puede ser anterior a la fecha 'Desde'.");
            return;
        }

        setLoading(true);
        axios.get('http://localhost:8080/api/asientos/libro-mayor', {
            params: { cuentaId, desde, hasta }
        })
        .then(response => {
            console.log('Respuesta recibida:', response.data);
            
            const datos = response.data;
            
            if (Array.isArray(datos)) {
                setDetalles(datos);
            } else {
                setError('Formato de respuesta inesperado del servidor.');
                setDetalles([]);
            }
            
            setSearchPerformed(true);
            setLoading(false);
        })
        .catch(err => {
            console.error('Error en la petición:', err);
            
            let errorMsg = "Error al obtener el Libro Mayor.";
            
            if (err.response) {
                if (err.response.status === 500) {
                    errorMsg = "Error interno del servidor. Verifique los filtros.";
                }
                
                if (err.response.data && typeof err.response.data === 'string') {
                    errorMsg = err.response.data;
                }
            } else if (err.request) {
                errorMsg = "No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose.";
            }
            
            setError(errorMsg);
            setDetalles([]);
            setSearchPerformed(true);
            setLoading(false);
        });
    };
    
    let saldoAcumulado = 0;
    
    return (
        <div className="reporte-contenido-interno">
            {/* FILTROS */}
            <div className="reporte-filters">
                <h3 className="filter-title">Filtros del Reporte</h3>
                <form onSubmit={handleSubmit} className="filter-controls">
                    <div className="filter-field">
                        <label htmlFor="cuenta">Cuenta:</label>
                        <select
                            id="cuenta"
                            value={cuentaId}
                            onChange={handleCuentaChange}
                            className="select"
                            required
                        >
                            <option value="">Seleccione una cuenta</option>
                            {cuentas.map(cuenta => (
                                <option key={cuenta.id} value={cuenta.id}>
                                    {cuenta.codigoJerarquico} - {cuenta.nombreCuenta}
                                </option>
                            ))}
                        </select>
                    </div>
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
                        {loading ? 'Cargando...' : 'Generar Mayor'}
                    </button>
                </form>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* TABLA DE RESULTADOS */}
            {detalles.length > 0 ? (
                <div className="reporte-table-container">
                    <h3 className="filter-title">
                        📊 Libro Mayor: <span style={{color: 'var(--color-accent)'}}>{cuentaNombre}</span> 
                        <span style={{fontSize: '0.9em', color: '#aaa', marginLeft: '10px'}}>
                            (ID: {cuentaId}) | Período: {desde} al {hasta}
                        </span>
                    </h3>
                    
                    <div className="table-container-wrapper">
                        <table className="partidas-table">
                            <thead>
                                <tr>
                                    <th>Fecha Asiento</th>
                                    <th>Descripción Asiento</th>
                                    <th className="align-right">Debe</th>
                                    <th className="align-right">Haber</th>
                                    <th className="align-right">Saldo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalles.map((detalle) => {
                                    // Agrega logging para ver la estructura de cada detalle
                                    console.log('Detalle:', detalle);
                                    
                                    // **INICIO DE CORRECCIÓN:** Acceso directo a las propiedades
                                    const fecha = detalle.fechaAsiento || 'N/A'; 
                                    const descripcion = detalle.descripcionAsiento || 'Sin descripción';
                                    // **FIN DE CORRECCIÓN**
                                    
                                    const debe = detalle.debe || 0;
                                    const haber = detalle.haber || 0;
                                    
                                    saldoAcumulado += debe - haber;
                                    const saldoClase = saldoAcumulado >= 0 ? 'saldo-positivo' : 'saldo-negativo';
                                    
                                    return (
                                        <tr key={detalle.id || Math.random()}>
                                            <td>{fecha}</td>
                                            <td>{descripcion}</td>
                                            <td className="align-right">{debe.toFixed(2)}</td>
                                            <td className="align-right">{haber.toFixed(2)}</td>
                                            <td className={`align-right ${saldoClase}`}>{saldoAcumulado.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr className="total-row">
                                    <td colSpan="4" className="total-label">
                                        <strong>SALDO FINAL ({cuentaNombre}):</strong>
                                    </td>
                                    <td className={`align-right ${saldoAcumulado >= 0 ? 'saldo-positivo' : 'saldo-negativo'}`}>
                                        <strong>{saldoAcumulado.toFixed(2)}</strong>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    {/* RESUMEN */}
                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        background: 'rgba(30, 30, 30, 0.7)',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)'
                    }}>
                        <h4 style={{color: 'var(--color-accent)', marginBottom: '10px'}}>Resumen del Reporte</h4>
                        <p><strong>Cuenta:</strong> {cuentaNombre}</p>
                        <p><strong>Período:</strong> {desde} al {hasta}</p>
                        <p><strong>Total de movimientos:</strong> {detalles.length}</p>
                        <p><strong>Saldo final:</strong> 
                            <span style={{
                                color: saldoAcumulado >= 0 ? 'var(--color-debe-ledger)' : 'var(--color-haber-ledger)',
                                fontWeight: 'bold',
                                marginLeft: '10px'
                            }}>
                                {saldoAcumulado.toFixed(2)}
                            </span>
                        </p>
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
                // Mostrar diferentes mensajes según el estado
                searchPerformed && !loading && (
                    <div className="mensaje-vacio">
                        <h4>📭 No se encontraron movimientos</h4>
                        <p>No hay registros para la cuenta <strong>{cuentaNombre}</strong> en el período <strong>{desde} al {hasta}</strong>.</p>
                        <p style={{fontSize: '0.9em', color: '#aaa', marginTop: '10px'}}>
                            Posibles razones:
                            <ul style={{textAlign: 'left', marginLeft: '20px'}}>
                                <li>La cuenta no ha tenido movimientos en ese período</li>
                                <li>Las fechas seleccionadas son incorrectas</li>
                                <li>La cuenta seleccionada es una cuenta de grupo (no tiene movimientos directos)</li>
                            </ul>
                        </p>
                        <button 
                            onClick={() => setSearchPerformed(false)} 
                            className="action-button"
                            style={{marginTop: '20px', maxWidth: '200px'}}
                        >
                            Realizar nueva búsqueda
                        </button>
                    </div>
                )
            )}
            
            {!searchPerformed && !loading && detalles.length === 0 && !error && (
                <div className="mensaje-vacio">
                    <h4>🔍 Generar Libro Mayor</h4>
                    <p>Seleccione una cuenta y un rango de fechas para generar el reporte.</p>
                    <p style={{fontSize: '0.9em', color: '#aaa', marginTop: '10px'}}>
                        El <strong>Libro Mayor</strong> muestra todos los movimientos de una cuenta específica en un período determinado.
                    </p>
                </div>
            )}
            
            {loading && (
                <div className="loading-state">
                    <div style={{marginBottom: '10px'}}>⌛ Buscando movimientos...</div>
                    <div style={{fontSize: '0.9em', color: '#aaa'}}>
                        Cuenta: {cuentaNombre} | Período: {desde} al {hasta}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReporteLibroMayor;