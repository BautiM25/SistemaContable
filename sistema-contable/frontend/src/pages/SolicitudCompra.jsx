import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from '../assets/LogoGrupo5.png';

import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 

const API_URL = "http://localhost:8080/api";

const SolicitudCompra = ({ onPageChange }) => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [articulosDB, setArticulosDB] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [view, setView] = useState('list'); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

    const [nuevaSolicitud, setNuevaSolicitud] = useState({
        numeroSolicitud: '',
        fechaEmision: new Date().toISOString().split('T')[0],
        detalles: []
    });

    const [itemActual, setItemActual] = useState({ 
        idArticulo: '', 
        nombreArticulo: '', 
        cantidad: 1
    });

    const [showProductSelector, setShowProductSelector] = useState(false);
    const [productSearch, setProductSearch] = useState('');

    // Cargar datos reales de la BD
    useEffect(() => {
        cargarSolicitudes();
        cargarArticulos();
    }, []);

    const cargarSolicitudes = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_URL}/solicitudes`);
            setSolicitudes(res.data);
        } catch (err) { 
            console.error("Error cargando solicitudes:", err);
            setError("No se pudieron cargar las solicitudes");
        } finally {
            setLoading(false);
        }
    };

    const cargarArticulos = async () => {
        try {
            const res = await axios.get(`${API_URL}/articulos`);
            setArticulosDB(res.data);
        } catch (err) { 
            console.error("Error cargando artículos:", err);
            setError("No se pudieron cargar los artículos");
        }
    };

    const seleccionarProducto = (producto) => {
        setItemActual({
            ...itemActual,
            idArticulo: producto.id,
            nombreArticulo: producto.nombre
        });
        setShowProductSelector(false);
        setProductSearch('');
    };

    const agregarDetalle = () => {
        if (!itemActual.idArticulo || itemActual.cantidad <= 0) {
            alert('Seleccione un producto y cantidad válida');
            return;
        }
        setNuevaSolicitud({
            ...nuevaSolicitud,
            detalles: [...nuevaSolicitud.detalles, { ...itemActual }]
        });
        setItemActual({ idArticulo: '', nombreArticulo: '', cantidad: 1 });
    };

    const eliminarDetalle = (index) => {
        const nuevosDetalles = nuevaSolicitud.detalles.filter((_, i) => i !== index);
        setNuevaSolicitud({
            ...nuevaSolicitud,
            detalles: nuevosDetalles
        });
    };

    const handleCrearSolicitud = async () => {
        if (!nuevaSolicitud.numeroSolicitud) {
            alert('Ingrese un número de solicitud');
            return;
        }
        if (nuevaSolicitud.detalles.length === 0) {
            alert('Agregue al menos un producto a la solicitud');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await axios.post(`${API_URL}/solicitudes/create`, nuevaSolicitud);
            alert("Solicitud creada exitosamente");
            await cargarSolicitudes(); // Recargar la lista
            setView('list');
            setNuevaSolicitud({ 
                numeroSolicitud: '', 
                fechaEmision: new Date().toISOString().split('T')[0], 
                detalles: [] 
            });
        } catch (err) { 
            console.error("Error al crear solicitud:", err);
            setError(err.response?.data?.message || "Error al guardar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    // Filtrar productos según búsqueda
    const productosFiltrados = articulosDB.filter(p => 
        p.nombre?.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.id?.toString().includes(productSearch)
    );

    return (
        <div className="page-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                
                {/* HEADER */}
                <div className="asiento-header" style={{ 
                    flexShrink: 0,
                    background: 'linear-gradient(145deg, #2a2a2a 0%, #1e1e1e 100%)',
                    borderBottom: '3px solid #3c6c3e'
                }}>
                    <div className="asiento-logo-wrapper">
                        <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                        <h2 className="asiento-title" style={{ fontSize: '28px', fontWeight: '400' }}>
                            {view === 'detail' ? `📋 Detalle: ${solicitudSeleccionada?.numeroSolicitud}` : "📦 Gestión de Solicitudes"}
                        </h2>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                className={`action-button ${view === 'list' ? 'primary-button' : 'secondary-button'}`} 
                                onClick={() => {
                                    setView('list');
                                    setError(null);
                                }}
                                style={{ minWidth: '120px' }}
                            >
                                📋 LISTADO
                            </button>
                            <button 
                                className={`action-button ${view === 'create' ? 'primary-button' : 'secondary-button'}`} 
                                onClick={() => {
                                    setView('create');
                                    setError(null);
                                }}
                                style={{ minWidth: '120px' }}
                            >
                                ➕ NUEVA
                            </button>
                        </div>
                        {view === 'list' && (
                            <div style={{ position: 'relative' }}>
                                <input 
                                    className="input-base" 
                                    placeholder="🔍 Buscar solicitud..." 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                    style={{ 
                                        width: '250px', 
                                        borderRadius: '25px',
                                        padding: '10px 20px',
                                        background: 'rgba(255,255,255,0.1)'
                                    }} 
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* CUERPO CON SCROLL */}
                <div className="asiento-body" style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    marginTop: '15px',
                    padding: '20px',
                    background: 'rgba(20,20,20,0.95)'
                }}>
                    
                    {/* Mensaje de error */}
                    {error && (
                        <div style={{
                            background: '#8b2b2b',
                            color: 'white',
                            padding: '15px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            textAlign: 'center'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Indicador de carga */}
                    {loading && view === 'list' && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>
                            ⏳ Cargando solicitudes...
                        </div>
                    )}

                    {/* VISTA LISTADO - SOLO DATOS REALES */}
                    {view === 'list' && !loading && (
                        <div>
                            {solicitudes.length === 0 ? (
                                <div style={{ 
                                    textAlign: 'center', 
                                    padding: '60px', 
                                    color: '#ccc',
                                    background: '#2a2a2a',
                                    borderRadius: '10px'
                                }}>
                                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
                                    <h3>No hay solicitudes registradas</h3>
                                    <p>Comienza creando una nueva solicitud</p>
                                    <button 
                                        className="action-button primary-button"
                                        onClick={() => setView('create')}
                                        style={{ marginTop: '20px', padding: '12px 30px' }}
                                    >
                                        ➕ Crear primera solicitud
                                    </button>
                                </div>
                            ) : (
                                <table className="partidas-table" style={{ 
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                                }}>
                                    <thead>
                                        <tr style={{ background: '#2a2a2a' }}>
                                            <th style={{ padding: '15px' }}>ID</th>
                                            <th style={{ padding: '15px' }}>N° Solicitud</th>
                                            <th style={{ padding: '15px' }}>Fecha</th>
                                            <th style={{ padding: '15px' }}>Estado</th>
                                            <th style={{ padding: '15px' }}>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {solicitudes
                                            .filter(s => s.numeroSolicitud?.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === '')
                                            .map(s => (
                                            <tr key={s.id} style={{ 
                                                background: '#333',
                                                borderBottom: '1px solid #444',
                                                transition: '0.3s',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => { setSolicitudSeleccionada(s); setView('detail'); }}
                                            >
                                                <td style={{ padding: '12px 15px' }}>#{s.id}</td>
                                                <td style={{ padding: '12px 15px', fontWeight: 'bold' }}>{s.numeroSolicitud || 'SIN N°'}</td>
                                                <td style={{ padding: '12px 15px' }}>{s.fechaEmision ? new Date(s.fechaEmision).toLocaleDateString() : 'Pendiente'}</td>
                                                <td style={{ padding: '12px 15px' }}>
                                                    <span style={{ 
                                                        background: s.estado === 'Aprobada' ? '#4caf50' : '#ffd700',
                                                        color: '#333',
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {s.estado || 'Pendiente'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 15px' }}>
                                                    <button 
                                                        className="action-button primary-button" 
                                                        style={{ 
                                                            padding: '8px 20px',
                                                            minWidth: '80px',
                                                            fontSize: '14px'
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSolicitudSeleccionada(s); 
                                                            setView('detail');
                                                        }}
                                                    >
                                                        VER
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* VISTA DETALLE - SOLO DATOS REALES */}
                    {view === 'detail' && solicitudSeleccionada && (
                        <div className="user-form" style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <div style={{ 
                                background: '#2a2a2a',
                                padding: '20px',
                                borderRadius: '10px',
                                marginBottom: '20px'
                            }}>
                                <h3 style={{ color: '#3c6c3e', margin: '0 0 10px 0' }}>
                                    Solicitud #{solicitudSeleccionada.numeroSolicitud}
                                </h3>
                                <p style={{ color: '#ccc', margin: '5px 0' }}>
                                    <strong>ID:</strong> {solicitudSeleccionada.id}
                                </p>
                                <p style={{ color: '#ccc', margin: '5px 0' }}>
                                    <strong>Fecha:</strong> {solicitudSeleccionada.fechaEmision ? new Date(solicitudSeleccionada.fechaEmision).toLocaleDateString() : 'No especificada'}
                                </p>
                                <p style={{ color: '#ccc', margin: '5px 0' }}>
                                    <strong>Estado:</strong> <span style={{ 
                                        background: solicitudSeleccionada.estado === 'Aprobada' ? '#4caf50' : '#ffd700',
                                        color: '#333',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        marginLeft: '10px'
                                    }}>{solicitudSeleccionada.estado || 'Pendiente'}</span>
                                </p>
                            </div>

                            <table className="partidas-table" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                <thead>
                                    <tr style={{ background: '#2a2a2a' }}>
                                        <th style={{ padding: '15px' }}>ID Art.</th>
                                        <th style={{ padding: '15px' }}>Nombre</th>
                                        <th style={{ padding: '15px' }}>Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {solicitudSeleccionada.detalles && solicitudSeleccionada.detalles.length > 0 ? (
                                        solicitudSeleccionada.detalles.map((d, i) => {
                                            // Buscar el nombre del artículo en la base de datos si no viene en el detalle
                                            const articulo = articulosDB.find(a => a.id === d.idArticulo);
                                            return (
                                                <tr key={i} style={{ background: '#333', borderBottom: '1px solid #444' }}>
                                                    <td style={{ padding: '12px 15px' }}>#{d.idArticulo}</td>
                                                    <td style={{ padding: '12px 15px' }}>
                                                        {d.nombreArticulo || articulo?.nombre || 'Producto no encontrado'}
                                                    </td>
                                                    <td style={{ padding: '12px 15px', fontWeight: 'bold' }}>{d.cantidad}</td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="3" style={{ padding: '30px', textAlign: 'center', color: '#999' }}>
                                                No hay productos en esta solicitud
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <button 
                                className="action-button secondary-button" 
                                style={{ 
                                    marginTop: '20px',
                                    padding: '12px',
                                    width: '200px',
                                    margin: '20px auto 0'
                                }} 
                                onClick={() => setView('list')}
                            >
                                ← VOLVER
                            </button>
                        </div>
                    )}

                    {/* VISTA CREAR - SELECTOR CON PRODUCTOS REALES */}
                    {view === 'create' && (
                        <div className="user-form" style={{ 
                            maxWidth: '900px', 
                            margin: '0 auto',
                            width: '100%'
                        }}>
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr 1fr',
                                gap: '20px',
                                marginBottom: '20px'
                            }}>
                                <div className="header-field">
                                    <label style={{ color: '#ccc', marginBottom: '5px' }}>N° Solicitud *</label>
                                    <input 
                                        className="input-base" 
                                        placeholder="Ej: SOL-001" 
                                        value={nuevaSolicitud.numeroSolicitud} 
                                        onChange={e => setNuevaSolicitud({...nuevaSolicitud, numeroSolicitud: e.target.value})}
                                        style={{ padding: '12px', background: '#333' }}
                                        required
                                    />
                                </div>
                                <div className="header-field">
                                    <label style={{ color: '#ccc', marginBottom: '5px' }}>Fecha de Emisión</label>
                                    <input 
                                        type="date" 
                                        className="input-base" 
                                        value={nuevaSolicitud.fechaEmision} 
                                        onChange={e => setNuevaSolicitud({...nuevaSolicitud, fechaEmision: e.target.value})}
                                        style={{ padding: '12px', background: '#333' }}
                                    />
                                </div>
                            </div>

                            {/* SELECTOR DE PRODUCTOS - SOLO DE LA BD */}
                            <div style={{ 
                                background: '#2a2a2a',
                                padding: '20px',
                                borderRadius: '10px',
                                marginBottom: '20px'
                            }}>
                                <h3 style={{ color: '#3c6c3e', margin: '0 0 15px 0' }}>Agregar Producto</h3>
                                
                                {articulosDB.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                        No hay artículos disponibles en la base de datos
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 2, position: 'relative' }}>
                                                <input
                                                    className="input-base"
                                                    placeholder="Buscar producto por nombre o ID..."
                                                    value={itemActual.nombreArticulo || productSearch}
                                                    onClick={() => setShowProductSelector(true)}
                                                    onChange={(e) => {
                                                        setProductSearch(e.target.value);
                                                        setShowProductSelector(true);
                                                        // Limpiar selección actual
                                                        if (itemActual.idArticulo) {
                                                            setItemActual({ idArticulo: '', nombreArticulo: '', cantidad: 1 });
                                                        }
                                                    }}
                                                    style={{ 
                                                        width: '100%',
                                                        padding: '12px',
                                                        background: '#333',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                                
                                                {showProductSelector && productosFiltrados.length > 0 && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '100%',
                                                        left: 0,
                                                        right: 0,
                                                        maxHeight: '300px',
                                                        overflowY: 'auto',
                                                        background: '#333',
                                                        border: '2px solid #3c6c3e',
                                                        borderRadius: '0 0 8px 8px',
                                                        zIndex: 1000,
                                                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                                                    }}>
                                                        {productosFiltrados.map(producto => (
                                                            <div
                                                                key={producto.id}
                                                                onClick={() => seleccionarProducto(producto)}
                                                                style={{
                                                                    padding: '12px 15px',
                                                                    borderBottom: '1px solid #444',
                                                                    cursor: 'pointer',
                                                                    transition: '0.3s',
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center'
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.background = '#3c6c3e'}
                                                                onMouseLeave={(e) => e.currentTarget.style.background = '#333'}
                                                            >
                                                                <div>
                                                                    <span style={{ 
                                                                        background: '#444',
                                                                        padding: '2px 8px',
                                                                        borderRadius: '4px',
                                                                        marginRight: '10px',
                                                                        fontSize: '12px'
                                                                    }}>
                                                                        #{producto.id}
                                                                    </span>
                                                                    <span style={{ fontWeight: 'bold' }}>{producto.nombre}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <input 
                                                className="input-base" 
                                                style={{ 
                                                    width: '120px',
                                                    padding: '12px',
                                                    background: '#333'
                                                }} 
                                                type="number" 
                                                min="1"
                                                placeholder="Cant." 
                                                value={itemActual.cantidad} 
                                                onChange={e => setItemActual({...itemActual, cantidad: parseInt(e.target.value) || 1})} 
                                            />
                                            
                                            <button 
                                                className="action-button primary-button" 
                                                onClick={agregarDetalle}
                                                style={{ 
                                                    padding: '12px 25px',
                                                    background: '#3c6c3e',
                                                    minWidth: '120px'
                                                }}
                                                disabled={!itemActual.idArticulo}
                                            >
                                                ➕ AGREGAR
                                            </button>
                                        </div>
                                        
                                        {productSearch && productosFiltrados.length === 0 && (
                                            <div style={{ marginTop: '10px', color: '#999', textAlign: 'center' }}>
                                                No se encontraron productos con "{productSearch}"
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* TABLA DE DETALLES */}
                            <div style={{ 
                                background: '#2a2a2a',
                                padding: '20px',
                                borderRadius: '10px',
                                marginBottom: '20px'
                            }}>
                                <h3 style={{ color: '#3c6c3e', margin: '0 0 15px 0' }}>
                                    Productos Agregados ({nuevaSolicitud.detalles.length})
                                </h3>
                                
                                {nuevaSolicitud.detalles.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                                        No hay productos agregados aún
                                    </div>
                                ) : (
                                    <table className="partidas-table" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                                        <thead>
                                            <tr style={{ background: '#1e1e1e' }}>
                                                <th style={{ padding: '12px' }}>ID</th>
                                                <th style={{ padding: '12px' }}>Nombre</th>
                                                <th style={{ padding: '12px' }}>Cant.</th>
                                                <th style={{ padding: '12px' }}>Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {nuevaSolicitud.detalles.map((d, i) => (
                                                <tr key={i} style={{ background: '#333', borderBottom: '1px solid #444' }}>
                                                    <td style={{ padding: '10px 12px' }}>#{d.idArticulo}</td>
                                                    <td style={{ padding: '10px 12px', fontWeight: 'bold' }}>{d.nombreArticulo}</td>
                                                    <td style={{ padding: '10px 12px' }}>{d.cantidad}</td>
                                                    <td style={{ padding: '10px 12px' }}>
                                                        <button 
                                                            onClick={() => eliminarDetalle(i)}
                                                            style={{
                                                                background: '#8b2b2b',
                                                                border: 'none',
                                                                color: 'white',
                                                                padding: '4px 10px',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            ✕
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            <button 
                                className="action-button primary-button" 
                                style={{ 
                                    background: '#3c6c3e',
                                    padding: '15px',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    width: '100%'
                                }} 
                                onClick={handleCrearSolicitud} 
                                disabled={loading || nuevaSolicitud.detalles.length === 0}
                            >
                                {loading ? '⏳ GUARDANDO...' : '✅ REGISTRAR SOLICITUD'}
                            </button>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="asiento-footer" style={{ 
                    flexShrink: 0, 
                    marginTop: '15px',
                    borderTop: '2px solid #3c6c3e',
                    padding: '15px 20px'
                }}>
                    <button 
                        className="action-button secondary-button" 
                        onClick={() => onPageChange("DASHBOARD")}
                        style={{
                            padding: '12px 30px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <img src={LogoGrupo5} alt="Volver" className="icon-small" /> 
                        ⬅️ Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SolicitudCompra;