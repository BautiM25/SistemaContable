// src/components/ReporteLibroMayor.jsx - VERSIÓN CORREGIDA
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogoGrupo5 from '../assets/LogoGrupo5.png';
import '../styles/ReporteStyles.css';

const ReporteLibroMayor = ({ onVolver }) => {
    const [detalles, setDetalles] = useState([]);
    const [cuentas, setCuentas] = useState([]);
    const [cuentaId, setCuentaId] = useState('');
    const [cuentaNombre, setCuentaNombre] = useState('N/A');
    const [tipoCuenta, setTipoCuenta] = useState(null);
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
        if (selectedCuenta) {
            setCuentaNombre(selectedCuenta.nombreCuenta);
            setTipoCuenta(selectedCuenta.tipo);
        } else {
            setCuentaNombre('N/A');
            setTipoCuenta(null);
        }
        setSearchPerformed(false);
    };

    // CORRECCIÓN: Nueva función para calcular saldo
    const calcularNuevoSaldo = (tipoCuenta, debe, haber, saldoAnterior) => {
        if (!tipoCuenta) return saldoAnterior + debe - haber;
        
        const tipo = tipoCuenta.toUpperCase();
        
        switch(tipo) {
            case 'ACTIVO':
            case 'EGRESO':
                // Aumenta por DEBE: saldo + debe - haber
                return saldoAnterior + debe - haber;
            case 'PASIVO':
            case 'PATRIMONIO':
            case 'INGRESO':
                // Aumenta por HABER: saldo - debe + haber
                return saldoAnterior - debe + haber;
            default:
                return saldoAnterior + debe - haber;
        }
    };

    // CORRECCIÓN: Función para mostrar el saldo (siempre positivo cuando sea favorable)
    const mostrarSaldo = (saldoCalculado, tipoCuenta) => {
        if (!tipoCuenta) return saldoCalculado;
        
        const tipo = tipoCuenta.toUpperCase();
        
        // Para las cuentas que aumentan por HABER, el cálculo ya da el valor correcto
        // Solo necesitamos asegurarnos de que se muestre adecuadamente
        return saldoCalculado;
    };

    // CORRECCIÓN: Determinar si el saldo es positivo (favorable)
    const esSaldoFavorable = (saldoCalculado, tipoCuenta) => {
        if (!tipoCuenta) return saldoCalculado >= 0;
        
        const tipo = tipoCuenta.toUpperCase();
        
        switch(tipo) {
            case 'ACTIVO':
            case 'EGRESO':
                // Para Activo y Egreso, positivo es DEBE > HABER
                return saldoCalculado >= 0;
            case 'PASIVO':
            case 'PATRIMONIO':
            case 'INGRESO':
                // Para Pasivo, Patrimonio e Ingreso, positivo es HABER > DEBE
                return saldoCalculado >= 0; // El cálculo ya hace -debe+haber
            default:
                return saldoCalculado >= 0;
        }
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

    const getColorPorTipo = (tipo) => {
        if (!tipo) return '#aaa';
        
        const tipoUpper = tipo.toUpperCase();
        
        switch(tipoUpper) {
            case 'ACTIVO': return '#4CAF50'; // Verde
            case 'PASIVO': return '#2196F3'; // Azul
            case 'PATRIMONIO': return '#9C27B0'; // Púrpura
            case 'INGRESO': return '#00BCD4'; // Cyan
            case 'EGRESO': return '#FF9800'; // Naranja
            default: return '#aaa';
        }
    };

    // CORRECCIÓN: Calcular saldo acumulado
    let saldoAcumulado = 0;
    const movimientosConSaldo = detalles.map(detalle => {
        const debe = detalle.debe || 0;
        const haber = detalle.haber || 0;
        
        // Calcular nuevo saldo
        const nuevoSaldo = calcularNuevoSaldo(tipoCuenta, debe, haber, saldoAcumulado);
        const saldoMostrar = mostrarSaldo(nuevoSaldo, tipoCuenta);
        const esFavorable = esSaldoFavorable(nuevoSaldo, tipoCuenta);
        
        // Crear objeto con toda la información
        const movimiento = {
            ...detalle,
            debe,
            haber,
            saldoCalculado: nuevoSaldo,
            saldoMostrado: saldoMostrar,
            esFavorable: esFavorable,
            saldoAnterior: saldoAcumulado
        };
        
        // Actualizar saldo acumulado para el siguiente movimiento
        saldoAcumulado = nuevoSaldo;
        
        return movimiento;
    });
    
    // Obtener el último saldo
    const ultimoSaldo = movimientosConSaldo.length > 0 
        ? movimientosConSaldo[movimientosConSaldo.length - 1].saldoMostrado 
        : 0;
    
    const ultimoEsFavorable = movimientosConSaldo.length > 0 
        ? movimientosConSaldo[movimientosConSaldo.length - 1].esFavorable 
        : true;

    return (
        <div className="reporte-contenido-interno">
            {/* FILTROS - Sin cambios */}
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
                                    {cuenta.tipo && ` (${cuenta.tipo})`}
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

            {/* TABLA DE RESULTADOS - CON CORRECCIÓN */}
            {detalles.length > 0 ? (
                <div className="reporte-table-container">
                    <h3 className="filter-title">
                        📊 Libro Mayor: <span style={{color: getColorPorTipo(tipoCuenta)}}>{cuentaNombre}</span> 
                        <span style={{fontSize: '0.9em', color: '#aaa', marginLeft: '10px'}}>
                            (ID: {cuentaId}) | Tipo: {tipoCuenta} | Período: {desde} al {hasta}
                        </span>
                    </h3>
                    
                    {/* Explicación del cálculo */}
                    {tipoCuenta && (
                        <div style={{
                            margin: '10px 0 20px 0',
                            padding: '15px',
                            background: 'rgba(30, 30, 30, 0.7)',
                            borderRadius: '8px',
                            border: `2px solid ${getColorPorTipo(tipoCuenta)}`
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                marginBottom: '10px'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: getColorPorTipo(tipoCuenta),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1em'
                                }}>
                                    {tipoCuenta?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <h4 style={{margin: '0 0 5px 0', color: getColorPorTipo(tipoCuenta)}}>
                                        {tipoCuenta} - {
                                            ['ACTIVO', 'EGRESO'].includes(tipoCuenta?.toUpperCase()) 
                                            ? 'Aumenta por DEBE' 
                                            : 'Aumenta por HABER'
                                        }
                                    </h4>
                                    <p style={{margin: 0, fontSize: '0.9em', color: '#ccc'}}>
                                        {['ACTIVO', 'EGRESO'].includes(tipoCuenta?.toUpperCase()) 
                                            ? 'Fórmula: Saldo = Saldo anterior + DEBE - HABER'
                                            : 'Fórmula: Saldo = Saldo anterior - DEBE + HABER'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
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
                                {movimientosConSaldo.map((movimiento, index) => (
                                    <tr key={movimiento.id || index}>
                                        <td>{movimiento.fechaAsiento || 'N/A'}</td>
                                        <td>{movimiento.descripcionAsiento || 'Sin descripción'}</td>
                                        <td className="align-right">{movimiento.debe.toFixed(2)}</td>
                                        <td className="align-right">{movimiento.haber.toFixed(2)}</td>
                                        <td className={`align-right ${movimiento.esFavorable ? 'saldo-positivo' : 'saldo-negativo'}`}>
                                            {movimiento.saldoMostrado.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="total-row">
                                    <td colSpan="4" className="total-label">
                                        <strong>SALDO FINAL ({cuentaNombre}):</strong>
                                        {tipoCuenta && (
                                            <span style={{
                                                fontSize: '0.8em',
                                                color: getColorPorTipo(tipoCuenta),
                                                marginLeft: '10px',
                                                fontWeight: 'bold'
                                            }}>
                                                ({tipoCuenta})
                                            </span>
                                        )}
                                    </td>
                                    <td className={`align-right ${ultimoEsFavorable ? 'saldo-positivo' : 'saldo-negativo'}`}>
                                        <strong style={{fontSize: '1.1em'}}>
                                            {ultimoSaldo.toFixed(2)}
                                        </strong>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    {/* RESUMEN MEJORADO */}
                    <div style={{
                        marginTop: '30px',
                        padding: '20px',
                        background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(50, 50, 50, 0.7) 100%)',
                        borderRadius: '10px',
                        border: '1px solid var(--color-border)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h4 style={{
                            color: 'var(--color-accent)', 
                            marginBottom: '15px',
                            borderBottom: '1px solid var(--color-border)',
                            paddingBottom: '10px'
                        }}>
                            📋 Resumen Detallado
                        </h4>
                        
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '20px'
                        }}>
                            <div>
                                <h5 style={{color: '#aaa', marginBottom: '8px'}}>Información de Cuenta</h5>
                                <p><strong>Nombre:</strong> {cuentaNombre}</p>
                                <p><strong>ID:</strong> {cuentaId}</p>
                                <p>
                                    <strong>Tipo:</strong> 
                                    <span style={{
                                        color: getColorPorTipo(tipoCuenta),
                                        fontWeight: 'bold',
                                        marginLeft: '8px'
                                    }}>
                                        {tipoCuenta || 'No definido'}
                                    </span>
                                </p>
                            </div>
                            
                            <div>
                                <h5 style={{color: '#aaa', marginBottom: '8px'}}>Período y Movimientos</h5>
                                <p><strong>Período:</strong> {desde} al {hasta}</p>
                                <p><strong>Total movimientos:</strong> {detalles.length}</p>
                                <p>
                                    <strong>Comportamiento:</strong> 
                                    <span style={{
                                        color: ['ACTIVO', 'EGRESO'].includes(tipoCuenta?.toUpperCase()) 
                                            ? '#4CAF50' 
                                            : '#2196F3',
                                        fontWeight: 'bold',
                                        marginLeft: '8px'
                                    }}>
                                        {['ACTIVO', 'EGRESO'].includes(tipoCuenta?.toUpperCase()) 
                                            ? 'Aumenta por DEBE' 
                                            : 'Aumenta por HABER'}
                                    </span>
                                </p>
                            </div>
                        </div>
                        
                        <div style={{
                            marginTop: '20px',
                            padding: '15px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '8px',
                            border: '2px solid ' + (ultimoEsFavorable ? 'var(--color-debe-ledger)' : 'var(--color-haber-ledger)')
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h5 style={{margin: '0 0 5px 0', color: '#aaa'}}>Saldo Final</h5>
                                    <p style={{margin: 0, fontSize: '0.9em', color: '#ccc'}}>
                                        {['ACTIVO', 'EGRESO'].includes(tipoCuenta?.toUpperCase()) 
                                            ? 'Positivo = Tiene saldo DEUDOR' 
                                            : 'Positivo = Tiene saldo ACREEDOR'}
                                    </p>
                                </div>
                                <div style={{
                                    fontSize: '1.5em',
                                    color: ultimoEsFavorable 
                                        ? 'var(--color-debe-ledger)' 
                                        : 'var(--color-haber-ledger)',
                                    fontWeight: 'bold'
                                }}>
                                    {ultimoSaldo.toFixed(2)}
                                </div>
                            </div>
                        </div>
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
                searchPerformed && !loading && (
                    <div className="mensaje-vacio">
                        <h4>📭 No se encontraron movimientos</h4>
                        <p>No hay registros para la cuenta <strong>{cuentaNombre}</strong> en el período <strong>{desde} al {hasta}</strong>.</p>
                        {tipoCuenta && (
                            <p><strong>Tipo de cuenta:</strong> 
                                <span style={{color: getColorPorTipo(tipoCuenta), fontWeight: 'bold', marginLeft: '5px'}}>
                                    {tipoCuenta}
                                </span>
                            </p>
                        )}
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
                </div>
            )}
            
            {loading && (
                <div className="loading-state">
                    <div style={{marginBottom: '10px'}}>⌛ Buscando movimientos...</div>
                    <div style={{fontSize: '0.9em', color: '#aaa'}}>
                        Cuenta: {cuentaNombre} | 
                        {tipoCuenta && ` Tipo: ${tipoCuenta} | `} 
                        Período: {desde} al {hasta}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReporteLibroMayor;