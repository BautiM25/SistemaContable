import React, { useState, useEffect } from 'react';
import api from "../services/api";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from '../assets/LogoGrupo5.png';

import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css";

// ====================================================================
// MODAL DE BÚSQUEDA DE ARTÍCULOS
// ====================================================================
const BuscarArticuloModal = ({ onSelect, onClose }) => {
    const [articulos, setArticulos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticulos = async () => {
            try {
                const res = await api.get("/articulos");
                setArticulos(res.data);
            } catch (err) {
                console.error("Error al cargar artículos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchArticulos();
    }, []);

    const filtered = articulos.filter(a => 
        a.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.referencia?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta" style={{ width: '600px', maxWidth: '90%' }}>
                <h3 className="modal-title">Seleccionar Artículo</h3>
                <input 
                    type="text" 
                    className="input-base large-input" 
                    placeholder="Filtrar por descripción o referencia..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                />
                <div className="cuenta-list-container" style={{ maxHeight: '400px' }}>
                    {loading ? (
                        <div style={{color:'white', textAlign:'center', padding: '20px'}}>Cargando artículos...</div>
                    ) : filtered.length > 0 ? (
                        filtered.map(a => (
                            <div key={a.id} className="list-item clickable-item" onClick={() => onSelect(a)}>
                                <span className="item-code" style={{ minWidth: '100px' }}>
                                    {a.referencia || `REF-${a.id}`}
                                </span>
                                <span className="item-name" style={{ flex: 2 }}>{a.descripcion}</span>
                                <span className="item-code" style={{ color: '#4caf50' }}>{a.medida || '-'}</span>
                            </div>
                        ))
                    ) : (
                        <div style={{color:'#999', textAlign:'center', padding: '20px'}}>No se encontraron artículos</div>
                    )}
                </div>
                <div className="modal-actions">
                    <button className="action-button secondary-button" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// COMPONENTE PRINCIPAL: SOLICITUD DE COMPRA
// ====================================================================
const SolicitudCompra = ({ onPageChange }) => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [ordenes, setOrdenes] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [filtroEstado, setFiltroEstado] = useState('todas');
    const [view, setView] = useState('list'); 
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

    const [nuevaSolicitud, setNuevaSolicitud] = useState({
        numeroSolicitud: '',
        detalles: []
    });

    const [itemActual, setItemActual] = useState({
        idArticulo: null,
        descripcion: '',
        especificacionesTecnicas: '',
        cantidad: 1,
        medida: '',
        fechaLimite: ''
    });

    useEffect(() => {
        cargarSolicitudes();
        cargarOrdenes();
    }, []);

    const cargarOrdenes = async () => {
        try {
            const res = await api.get("/ordenes");
            console.log("Órdenes cargadas:", res.data);
            setOrdenes(res.data);
        } catch (err) {
            console.error("Error al cargar órdenes:", err);
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const generarNumeroSolicitud = () => {
        const fecha = new Date();
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        
        let maxNumero = 0;
        solicitudes.forEach(s => {
            if (s.numeroSolicitud) {
                const partes = s.numeroSolicitud.split('-');
                if (partes.length === 3) {
                    const secuencial = parseInt(partes[2]);
                    if (!isNaN(secuencial) && secuencial > maxNumero) {
                        maxNumero = secuencial;
                    }
                }
            }
        });
        
        const nuevoSecuencial = maxNumero + 1;
        const secuencialStr = String(nuevoSecuencial).padStart(3, '0');
        
        return `SOL-${año}${mes}${dia}-${secuencialStr}`;
    };

    const cargarSolicitudes = async () => {
        setLoading(true);
        try {
            const res = await api.get("/solicitudes/todas");
            console.log("Todas las solicitudes:", res.data);
            setSolicitudes(res.data);
        } catch (err) {
            console.error("Error al obtener solicitudes:", err);
        } finally {
            setLoading(false);
        }
    };

    // Verificar si una solicitud tiene orden asociada
    const tieneOrden = (solicitudId, solicitudNumero) => {
        if (!ordenes || ordenes.length === 0) return false;
        
        const encontrada = ordenes.some(o => 
            o.solicitudNumero === solicitudNumero || 
            o.solicitudNumero === solicitudId?.toString()
        );
        
        return encontrada;
    };

    // Calcular cantidad pendiente para un artículo en una solicitud
    const calcularCantidadPendiente = (solicitudId, articuloId, cantidadSolicitada) => {
        if (!ordenes || ordenes.length === 0) return cantidadSolicitada;
        
        // Buscar todas las órdenes asociadas a esta solicitud
        const ordenesSolicitud = ordenes.filter(o => 
            o.solicitudNumero === solicitudId?.toString() || 
            o.solicitudNumero === solicitudSeleccionada?.numeroSolicitud
        );
        
        if (ordenesSolicitud.length === 0) return cantidadSolicitada;
        
        // Sumar las cantidades de este artículo en todas las órdenes
        let cantidadPedida = 0;
        ordenesSolicitud.forEach(orden => {
            if (orden.detalles) {
                const detalle = orden.detalles.find(d => 
                    d.articuloReferencia === articuloId?.toString() ||
                    d.id === articuloId
                );
                if (detalle) {
                    cantidadPedida += detalle.cantidad;
                }
            }
        });
        
        return Math.max(0, cantidadSolicitada - cantidadPedida);
    };

    // Determinar el color de fondo para un detalle según su estado de pedido
    const getColorEstadoArticulo = (cantidadPendiente, cantidadSolicitada) => {
        if (cantidadPendiente === 0) {
            return '#ffcccc'; // Rojo claro para artículos totalmente pedidos
        } else if (cantidadPendiente < cantidadSolicitada) {
            return '#cce5ff'; // Azul claro para artículos parcialmente pedidos
        } else {
            return 'white'; // Blanco para artículos sin pedir
        }
    };

    const handleSelectArticulo = (art) => {
        setItemActual({
            ...itemActual,
            idArticulo: art.id,
            descripcion: art.descripcion,
            medida: art.medida || ''
        });
        setShowModal(false);
    };

    const agregarDetalle = () => {
        if (!itemActual.idArticulo || itemActual.cantidad <= 0) {
            alert("Por favor seleccione un artículo y una cantidad válida.");
            return;
        }

        const detalleDto = {
            idArticulo: itemActual.idArticulo,
            descripcion: itemActual.descripcion,
            especificacionesTecnicas: itemActual.especificacionesTecnicas,
            cantidad: itemActual.cantidad,
            medida: itemActual.medida,
            fechaLimite: itemActual.fechaLimite || null,
            accion: null
        };
        
        setNuevaSolicitud({
            ...nuevaSolicitud,
            detalles: [...nuevaSolicitud.detalles, detalleDto]
        });
        
        setItemActual({
            idArticulo: null,
            descripcion: '',
            especificacionesTecnicas: '',
            cantidad: 1,
            medida: '',
            fechaLimite: ''
        });
    };

    const eliminarDetalle = (index) => {
        const nuevosDetalles = nuevaSolicitud.detalles.filter((_, i) => i !== index);
        setNuevaSolicitud({
            ...nuevaSolicitud,
            detalles: nuevosDetalles
        });
    };

    const handleCrearSolicitud = async () => {
        if (nuevaSolicitud.detalles.length === 0) {
            alert("Agregue al menos un artículo a la solicitud.");
            return;
        }
        
        setLoading(true);
        try {
            await api.post("/solicitudes/create", nuevaSolicitud);
            alert("✅ Solicitud guardada exitosamente.");
            await cargarSolicitudes();
            setView('list');
            setNuevaSolicitud({ 
                numeroSolicitud: '', 
                detalles: [] 
            });
        } catch (err) {
            alert("❌ Error al guardar.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return 'Pendiente';
        try {
            return new Date(fecha).toLocaleDateString('es-ES');
        } catch {
            return 'Pendiente';
        }
    };

    const getBackgroundColor = (solicitud) => {
        if (!solicitud.estado) {
            return '#ffebee';
        }
        if (tieneOrden(solicitud.id, solicitud.numeroSolicitud)) {
            return '#e8f4fd';
        }
        return 'white';
    };

    return (
        <div className="page-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                
                {/* HEADER */}
                <div className="asiento-header" style={{ flexShrink: 0 }}>
                    <div className="asiento-logo-wrapper">
                        <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                        <h2 className="asiento-title">
                            {view === 'detail' ? `Detalle: Solicitud #${solicitudSeleccionada?.numeroSolicitud}` : 
                             view === 'create' ? "➕ Nueva Solicitud de Compra" : "📋 Gestión de Solicitudes"}
                        </h2>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button 
                                className={`action-button ${view === 'list' ? 'primary-button' : 'secondary-button'}`} 
                                onClick={() => setView('list')}
                            >
                                LISTADO
                            </button>
                            <button 
                                className={`action-button ${view === 'create' ? 'primary-button' : 'secondary-button'}`} 
                                onClick={() => {
                                    setNuevaSolicitud({
                                        numeroSolicitud: generarNumeroSolicitud(),
                                        detalles: []
                                    });
                                    setView('create');
                                }}
                            >
                                NUEVA
                            </button>
                        </div>
                        {view === 'list' && (
                            <input 
                                className="input-base" 
                                placeholder="Buscar..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                style={{ width: '200px' }} 
                            />
                        )}
                    </div>
                </div>

                {/* CUERPO */}
                <div className="asiento-body" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    
                    {/* ===== LISTADO ===== */}
                    {view === 'list' && (
                        <div>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#000' }}>Cargando solicitudes...</div>
                            ) : solicitudes.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px', color: '#000' }}>
                                    No hay solicitudes
                                </div>
                            ) : (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button 
                                                className={`action-button ${filtroEstado === 'todas' ? 'primary-button' : 'secondary-button'}`}
                                                onClick={() => setFiltroEstado('todas')}
                                                style={{ padding: '5px 15px' }}
                                            >
                                                Todas
                                            </button>
                                            <button 
                                                className={`action-button ${filtroEstado === 'activas' ? 'primary-button' : 'secondary-button'}`}
                                                onClick={() => setFiltroEstado('activas')}
                                                style={{ padding: '5px 15px' }}
                                            >
                                                Activas
                                            </button>
                                            <button 
                                                className={`action-button ${filtroEstado === 'inactivas' ? 'primary-button' : 'secondary-button'}`}
                                                onClick={() => setFiltroEstado('inactivas')}
                                                style={{ padding: '5px 15px' }}
                                            >
                                                Inactivas
                                            </button>
                                        </div>
                                    </div>

                                    <table className="partidas-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                                        <thead>
                                            <tr style={{ background: '#f0f0f0' }}>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>ID</th>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>N° Solicitud</th>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Fecha</th>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Estado</th>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Items</th>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Orden Generada</th>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {solicitudes
                                                .filter(s => {
                                                    const matchesSearch = s.numeroSolicitud?.toLowerCase().includes(searchTerm.toLowerCase());
                                                    const matchesEstado = 
                                                        filtroEstado === 'todas' ? true :
                                                        filtroEstado === 'activas' ? s.estado === true :
                                                        filtroEstado === 'inactivas' ? s.estado === false : true;
                                                    return matchesSearch && matchesEstado;
                                                })
                                                .map(s => {
                                                    const tieneOrdenAsociada = tieneOrden(s.id, s.numeroSolicitud);
                                                    const backgroundColor = getBackgroundColor(s);
                                                    
                                                    return (
                                                        <tr key={s.id} style={{ 
                                                            borderBottom: '1px solid #ccc',
                                                            backgroundColor: backgroundColor
                                                        }}>
                                                            <td style={{ padding: '10px', color: '#000' }}>#{s.id}</td>
                                                            <td style={{ padding: '10px', color: '#000', fontWeight: 'bold' }}>{s.numeroSolicitud || 'S/N'}</td>
                                                            <td style={{ padding: '10px', color: '#000' }}>{formatearFecha(s.fechaEmisionOC)}</td>
                                                            <td style={{ padding: '10px' }}>
                                                                <span style={{ 
                                                                    background: s.estado ? '#4caf50' : '#f44336',
                                                                    color: '#000',
                                                                    padding: '2px 8px',
                                                                    borderRadius: '12px',
                                                                    fontSize: '12px',
                                                                    fontWeight: 'bold'
                                                                }}>
                                                                    {s.estado ? 'ACTIVA' : 'INACTIVA'}
                                                                </span>
                                                            </td>
                                                            <td style={{ padding: '10px', color: '#000' }}>{s.detalles?.length || 0}</td>
                                                            <td style={{ padding: '10px' }}>
                                                                {tieneOrdenAsociada ? (
                                                                    <span style={{ 
                                                                        background: '#2196f3',
                                                                        color: 'white',
                                                                        padding: '2px 8px',
                                                                        borderRadius: '12px',
                                                                        fontSize: '12px',
                                                                        fontWeight: 'bold'
                                                                    }}>
                                                                        SÍ
                                                                    </span>
                                                                ) : (
                                                                    <span style={{ 
                                                                        background: '#9e9e9e',
                                                                        color: 'white',
                                                                        padding: '2px 8px',
                                                                        borderRadius: '12px',
                                                                        fontSize: '12px'
                                                                    }}>
                                                                        NO
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td style={{ padding: '10px' }}>
                                                                <button 
                                                                    className="action-button primary-button" 
                                                                    style={{ padding: '5px 15px', background: '#3c6c3e', color: 'white' }}
                                                                    onClick={() => { 
                                                                        console.log("Solicitud seleccionada:", s);
                                                                        console.log("Detalles:", s.detalles);
                                                                        setSolicitudSeleccionada(s); 
                                                                        setView('detail'); 
                                                                    }}
                                                                >
                                                                    VER
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ===== DETALLE ===== */}
                    {view === 'detail' && solicitudSeleccionada && (
                        <div>
                            {/* Cabecera con fondo más claro */}
                            <div style={{ 
                                background: '#f0f0f0', 
                                padding: '20px', 
                                borderRadius: '8px', 
                                marginBottom: '20px',
                                borderLeft: '4px solid #3c6c3e'
                            }}>
                                <h3 style={{ color: '#000', margin: '0 0 15px 0' }}>
                                    Solicitud #{solicitudSeleccionada.numeroSolicitud}
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                                    <div>
                                        <strong style={{ color: '#000' }}>ID:</strong>
                                        <span style={{ color: '#000', marginLeft: '5px' }}>{solicitudSeleccionada.id}</span>
                                    </div>
                                    <div>
                                        <strong style={{ color: '#000' }}>Fecha:</strong>
                                        <span style={{ color: '#000', marginLeft: '5px' }}>{formatearFecha(solicitudSeleccionada.fechaEmisionOC)}</span>
                                    </div>
                                    <div>
                                        <strong style={{ color: '#000' }}>Estado:</strong>
                                        <span style={{ 
                                            background: solicitudSeleccionada.estado ? '#4caf50' : '#f44336',
                                            color: '#000',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            marginLeft: '10px'
                                        }}>
                                            {solicitudSeleccionada.estado ? 'ACTIVA' : 'INACTIVA'}
                                        </span>
                                    </div>
                                    <div>
                                        <strong style={{ color: '#000' }}>Orden:</strong>
                                        <span style={{ 
                                            background: tieneOrden(solicitudSeleccionada.id, solicitudSeleccionada.numeroSolicitud) ? '#2196f3' : '#9e9e9e',
                                            color: 'white',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            marginLeft: '10px'
                                        }}>
                                            {tieneOrden(solicitudSeleccionada.id, solicitudSeleccionada.numeroSolicitud) ? 'GENERADA' : 'PENDIENTE'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tabla de detalles con cantidad pendiente y colores */}
                            <h3 style={{ color: '#ffffff', marginBottom: '15px' }}>Artículos Solicitados</h3>
                            
                            {solicitudSeleccionada.detalles && solicitudSeleccionada.detalles.length > 0 ? (
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="partidas-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                                        <thead>
                                            <tr style={{ background: '#f0f0f0' }}>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Referencia</th>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Descripción</th>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Cant. Solicitada</th>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Cant. Pendiente</th>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Espec. Técnicas</th>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Medida</th>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Fecha Límite</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {solicitudSeleccionada.detalles.map((d, i) => {
                                                const cantidadPendiente = calcularCantidadPendiente(
                                                    solicitudSeleccionada.id, 
                                                    d.articuloReferencia, 
                                                    d.cantidad
                                                );
                                                const backgroundColor = getColorEstadoArticulo(cantidadPendiente, d.cantidad);
                                                
                                                return (
                                                    <tr key={i} style={{ 
                                                        borderBottom: '1px solid #ccc',
                                                        backgroundColor: backgroundColor
                                                    }}>
                                                        <td style={{ padding: '10px', color: '#000' }}>
                                                            {d.articuloReferencia || 'S/N'}
                                                        </td>
                                                        <td style={{ padding: '10px', color: '#000' }}>
                                                            {d.articuloDescripcion || 'Sin descripción'}
                                                        </td>
                                                        <td style={{ padding: '10px', color: '#000', fontWeight: 'bold' }}>{d.cantidad}</td>
                                                        <td style={{ padding: '10px', color: '#000', fontWeight: 'bold' }}>
                                                            {cantidadPendiente}
                                                        </td>
                                                        <td style={{ padding: '10px', color: '#000' }}>
                                                            {d.especificacionesTecnicas || '-'}
                                                        </td>
                                                        <td style={{ padding: '10px', color: '#000' }}>
                                                            {d.medida || '-'}
                                                        </td>
                                                        <td style={{ padding: '10px', color: '#000' }}>
                                                            {d.fechaLimite ? formatearFecha(d.fechaLimite) : '-'}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div style={{ 
                                    textAlign: 'center', 
                                    padding: '40px', 
                                    background: '#f0f0f0', 
                                    borderRadius: '8px',
                                    color: '#000'
                                }}>
                                    No hay artículos en esta solicitud
                                </div>
                            )}

                            <button 
                                className="action-button secondary-button" 
                                style={{ marginTop: '20px', background: '#505050', color: 'white' }}
                                onClick={() => setView('list')}
                            >
                                VOLVER
                            </button>
                        </div>
                    )}

                    {/* ===== CREACIÓN ===== */}
                    {view === 'create' && (
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            width: '100%' 
                        }}>
                            <div className="user-form" style={{ 
                                width: '100%', 
                                maxWidth: '900px',
                                margin: '0 auto'
                            }}>
                                {/* Número de solicitud automático */}
                                <div style={{ 
                                    background: '#2a2a2a', 
                                    padding: '20px', 
                                    borderRadius: '8px', 
                                    marginBottom: '20px',
                                    borderLeft: '4px solid #3c6c3e',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <label style={{ color: '#aaa', fontSize: '11px', display: 'block', marginBottom: '5px' }}>
                                        NÚMERO DE SOLICITUD
                                    </label>
                                    <input 
                                        className="input-base" 
                                        value={nuevaSolicitud.numeroSolicitud} 
                                        readOnly
                                        style={{ width: '100%', background: '#333', color: '#3c6c3e', fontWeight: 'bold' }}
                                    />
                                </div>

                                {/* Panel de ingreso de artículos */}
                                <div style={{ 
                                    background: '#1a1a1a', 
                                    padding: '20px', 
                                    borderRadius: '8px', 
                                    marginBottom: '20px',
                                    border: '1px solid #3c6c3e',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <h3 style={{ color: '#3c6c3e', margin: '0 0 15px 0', fontSize: '16px' }}>
                                        ➕ Agregar Artículo
                                    </h3>
                                    
                                    {/* Selector de artículo */}
                                    <div style={{ marginBottom: '15px', width: '100%' }}>
                                        <label style={{ color: '#aaa', fontSize: '11px', display: 'block', marginBottom: '5px' }}>
                                            ARTÍCULO *
                                        </label>
                                        <div 
                                            className="input-base" 
                                            style={{ 
                                                cursor: 'pointer', 
                                                background: '#222', 
                                                padding: '12px',
                                                border: itemActual.idArticulo ? '1px solid #3c6c3e' : '1px solid #444',
                                                color: itemActual.idArticulo ? '#fff' : '#888',
                                                width: '100%',
                                                boxSizing: 'border-box'
                                            }}
                                            onClick={() => setShowModal(true)}
                                        >
                                            {itemActual.idArticulo ? (
                                                itemActual.descripcion
                                            ) : (
                                                "🔍 Haga clic para buscar artículo..."
                                            )}
                                        </div>
                                    </div>

                                    {/* Campos del artículo */}
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: '1fr 1fr 1fr', 
                                        gap: '10px', 
                                        marginBottom: '10px',
                                        width: '100%'
                                    }}>
                                        <div>
                                            <label style={{ color: '#aaa', fontSize: '11px' }}>CANTIDAD</label>
                                            <input 
                                                className="input-base" 
                                                type="number" 
                                                min="0"
                                                step="1"
                                                value={itemActual.cantidad} 
                                                onChange={e => setItemActual({...itemActual, cantidad: parseFloat(e.target.value) || 1})}
                                                style={{ width: '100%', background: '#222', color: '#fff', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ color: '#aaa', fontSize: '11px' }}>MEDIDA</label>
                                            <input 
                                                className="input-base" 
                                                placeholder="UN, KG, LT" 
                                                value={itemActual.medida} 
                                                onChange={e => setItemActual({...itemActual, medida: e.target.value})}
                                                style={{ width: '100%', background: '#222', color: '#fff', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ color: '#aaa', fontSize: '11px' }}>FECHA LÍMITE</label>
                                            <input 
                                                type="date" 
                                                className="input-base" 
                                                min={getTodayDate()}
                                                value={itemActual.fechaLimite} 
                                                onChange={e => setItemActual({...itemActual, fechaLimite: e.target.value})}
                                                style={{ width: '100%', background: '#222', color: '#fff', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '10px', width: '100%' }}>
                                        <label style={{ color: '#aaa', fontSize: '11px' }}>ESPECIFICACIONES TÉCNICAS</label>
                                        <textarea 
                                            className="input-base" 
                                            placeholder="Especificaciones técnicas..." 
                                            value={itemActual.especificacionesTecnicas} 
                                            onChange={e => setItemActual({...itemActual, especificacionesTecnicas: e.target.value})}
                                            rows="2"
                                            style={{ width: '100%', background: '#222', color: '#fff', boxSizing: 'border-box' }}
                                        />
                                    </div>

                                    <button 
                                        className="action-button primary-button" 
                                        onClick={agregarDetalle}
                                        disabled={!itemActual.idArticulo}
                                        style={{ width: '100%', padding: '10px' }}
                                    >
                                        AÑADIR ARTÍCULO
                                    </button>
                                </div>

                                {/* Tabla de detalles */}
                                <div style={{ 
                                    background: '#2a2a2a', 
                                    padding: '20px', 
                                    borderRadius: '8px',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <h3 style={{ color: '#3c6c3e', margin: '0 0 15px 0' }}>
                                        Artículos ({nuevaSolicitud.detalles.length})
                                    </h3>
                                    
                                    {nuevaSolicitud.detalles.length === 0 ? (
                                        <div style={{ 
                                            textAlign: 'center', 
                                            padding: '30px', 
                                            color: '#999', 
                                            background: '#1a1a1a', 
                                            borderRadius: '4px',
                                            width: '100%',
                                            boxSizing: 'border-box'
                                        }}>
                                            No hay artículos agregados
                                        </div>
                                    ) : (
                                        <div style={{ overflowX: 'auto', width: '100%' }}>
                                            <table className="partidas-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <thead>
                                                    <tr style={{ background: '#333' }}>
                                                        <th style={{ padding: '10px', textAlign: 'left', color: '#000000' }}>Descripción</th>
                                                        <th style={{ padding: '10px', textAlign: 'left', color: '#000000' }}>Cant.</th>
                                                        <th style={{ padding: '10px', textAlign: 'left', color: '#000000' }}>Medida</th>
                                                        <th style={{ padding: '10px', textAlign: 'left', color: '#000000' }}>Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {nuevaSolicitud.detalles.map((d, i) => (
                                                        <tr key={i} style={{ borderBottom: '1px solid #444' }}>
                                                            <td style={{ padding: '10px', color: '#000000' }}>{d.descripcion}</td>
                                                            <td style={{ padding: '10px', color: '#000000' }}>{d.cantidad}</td>
                                                            <td style={{ padding: '10px', color: '#000000' }}>{d.medida || '-'}</td>
                                                            <td style={{ padding: '10px' }}>
                                                                <button 
                                                                    onClick={() => eliminarDetalle(i)}
                                                                    style={{
                                                                        background: '#8b2b2b',
                                                                        border: 'none',
                                                                        color: 'white',
                                                                        padding: '2px 8px',
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
                                        </div>
                                    )}
                                </div>

                                {/* Botón guardar */}
                                <button 
                                    className="action-button primary-button" 
                                    style={{ 
                                        background: '#2e7d32', 
                                        marginTop: '20px', 
                                        width: '100%', 
                                        padding: '15px',
                                        boxSizing: 'border-box'
                                    }} 
                                    onClick={handleCrearSolicitud} 
                                    disabled={loading || nuevaSolicitud.detalles.length === 0}
                                >
                                    {loading ? "GUARDANDO..." : "GUARDAR SOLICITUD"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="asiento-footer" style={{ flexShrink: 0 }}>
                    <button className="action-button secondary-button" onClick={() => onPageChange("DASHBOARD")}>
                        <img src={LogoGrupo5} alt="Volver" className="icon-small" /> Volver al Inicio
                    </button>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <BuscarArticuloModal 
                    onSelect={handleSelectArticulo} 
                    onClose={() => setShowModal(false)} 
                />
            )}
        </div>
    );
};

export default SolicitudCompra;