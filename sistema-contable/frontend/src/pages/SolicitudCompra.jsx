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
                <h3 className="modal-title">Seleccionar Artículo de Inventario</h3>
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
    const [searchTerm, setSearchTerm] = useState(''); 
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
        observaciones: '',
        fechaLimite: '',
        accion: 'normal'
    });

    useEffect(() => {
        cargarSolicitudes();
    }, []);

    const cargarSolicitudes = async () => {
        setLoading(true);
        try {
            const res = await api.get("/solicitudes");
            console.log("Solicitudes recibidas:", res.data);
            setSolicitudes(res.data);
        } catch (err) {
            console.error("Error al obtener solicitudes:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectArticulo = (art) => {
        setItemActual({
            ...itemActual,
            idArticulo: art.id,
            descripcion: art.descripcion,
            medida: art.medida || '',
            especificacionesTecnicas: '',
            observaciones: ''
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
            observaciones: itemActual.observaciones,
            fechaLimite: itemActual.fechaLimite || null,
            accion: itemActual.accion === 'normal' ? null : itemActual.accion
        };
        
        let nuevosDetalles = [...nuevaSolicitud.detalles];
        
        if (itemActual.accion === 'Modificar' && nuevosDetalles.length > 0) {
            nuevosDetalles[nuevosDetalles.length - 1] = detalleDto;
        } else {
            nuevosDetalles.push(detalleDto);
        }
        
        setNuevaSolicitud({
            ...nuevaSolicitud,
            detalles: nuevosDetalles
        });
        
        setItemActual({
            idArticulo: null,
            descripcion: '',
            especificacionesTecnicas: '',
            cantidad: 1,
            medida: '',
            observaciones: '',
            fechaLimite: '',
            accion: 'normal'
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
        if (!nuevaSolicitud.numeroSolicitud) {
            alert("Ingrese un número de solicitud.");
            return;
        }
        if (nuevaSolicitud.detalles.length === 0) {
            alert("Agregue al menos un artículo a la solicitud.");
            return;
        }
        
        setLoading(true);
        try {
            await api.post("/solicitudes/create", nuevaSolicitud);
            alert("✅ Solicitud guardada exitosamente.");
            cargarSolicitudes();
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
        if (!fecha) return 'Sin fecha';
        try {
            return new Date(fecha).toLocaleDateString('es-ES');
        } catch {
            return 'Fecha inválida';
        }
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
                                onClick={() => setView('create')}
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
                <div className="asiento-body" style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
                    
                    {/* ===== LISTADO ===== */}
                    {view === 'list' && (
                        <div>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '40px' }}>Cargando...</div>
                            ) : solicitudes.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px' }}>
                                    No hay solicitudes
                                </div>
                            ) : (
                                <table className="partidas-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#333' }}>
                                            <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                                            <th style={{ padding: '10px', textAlign: 'left' }}>N° Solicitud</th>
                                            <th style={{ padding: '10px', textAlign: 'left' }}>Fecha</th>
                                            <th style={{ padding: '10px', textAlign: 'left' }}>Estado</th>
                                            <th style={{ padding: '10px', textAlign: 'left' }}>Items</th>
                                            <th style={{ padding: '10px', textAlign: 'left' }}>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {solicitudes
                                            .filter(s => s.numeroSolicitud?.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map(s => (
                                                <tr key={s.id} style={{ borderBottom: '1px solid #444' }}>
                                                    <td style={{ padding: '10px' }}>#{s.id}</td>
                                                    <td style={{ padding: '10px' }}>{s.numeroSolicitud || 'S/N'}</td>
                                                    <td style={{ padding: '10px' }}>{formatearFecha(s.fechaEmisionOC)}</td>
                                                    <td style={{ padding: '10px' }}>
                                                        <span style={{ 
                                                            background: s.estado ? '#4caf50' : '#ffd700',
                                                            color: '#333',
                                                            padding: '2px 8px',
                                                            borderRadius: '12px',
                                                            fontSize: '12px'
                                                        }}>
                                                            {s.estado ? 'ACTIVA' : 'PENDIENTE'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '10px' }}>{s.detalles?.length || 0}</td>
                                                    <td style={{ padding: '10px' }}>
                                                        <button 
                                                            className="action-button primary-button" 
                                                            style={{ padding: '5px 15px' }}
                                                            onClick={() => { setSolicitudSeleccionada(s); setView('detail'); }}
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

                    {/* ===== DETALLE ===== */}
                    {view === 'detail' && solicitudSeleccionada && (
                        <div>
                            <div style={{ background: '#333', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                                <h3>Solicitud #{solicitudSeleccionada.numeroSolicitud}</h3>
                                <p><strong>ID:</strong> {solicitudSeleccionada.id}</p>
                                <p><strong>Fecha:</strong> {formatearFecha(solicitudSeleccionada.fechaEmisionOC)}</p>
                                <p><strong>Estado:</strong> {solicitudSeleccionada.estado ? 'ACTIVA' : 'PENDIENTE'}</p>
                            </div>

                            <table className="partidas-table">
                                <thead>
                                    <tr>
                                        <th>Referencia</th>
                                        <th>Descripción</th>
                                        <th>Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {solicitudSeleccionada.detalles?.map((d, i) => (
                                        <tr key={i}>
                                            <td>{d.articuloReferencia || 'S/N'}</td>
                                            <td>{d.articuloDescripcion || 'Sin descripción'}</td>
                                            <td>{d.cantidad}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <button 
                                className="action-button secondary-button" 
                                style={{ marginTop: '20px' }}
                                onClick={() => setView('list')}
                            >
                                VOLVER
                            </button>
                        </div>
                    )}

                    {/* ===== CREACIÓN (COMPLETO) ===== */}
                    {view === 'create' && (
                        <div className="user-form" style={{ maxWidth: '100%' }}>
                            {/* Número de solicitud */}
                            <div style={{ 
                                background: '#2a2a2a', 
                                padding: '20px', 
                                borderRadius: '8px', 
                                marginBottom: '20px',
                                borderLeft: '4px solid #3c6c3e'
                            }}>
                                <label style={{ color: '#aaa', fontSize: '11px', display: 'block', marginBottom: '5px' }}>
                                    NÚMERO DE SOLICITUD *
                                </label>
                                <input 
                                    className="input-base" 
                                    placeholder="Ej: SOL-2024-001" 
                                    value={nuevaSolicitud.numeroSolicitud} 
                                    onChange={e => setNuevaSolicitud({...nuevaSolicitud, numeroSolicitud: e.target.value})}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            {/* Panel de ingreso de artículos */}
                            <div style={{ 
                                background: '#1a1a1a', 
                                padding: '20px', 
                                borderRadius: '8px', 
                                marginBottom: '20px',
                                border: '1px solid #3c6c3e'
                            }}>
                                <h3 style={{ color: '#3c6c3e', margin: '0 0 15px 0', fontSize: '16px' }}>
                                    ➕ Agregar Artículo
                                </h3>
                                
                                {/* Selector de artículo */}
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ color: '#aaa', fontSize: '11px', display: 'block', marginBottom: '5px' }}>
                                        ARTÍCULO *
                                    </label>
                                    <div 
                                        className="input-base" 
                                        style={{ 
                                            cursor: 'pointer', 
                                            background: '#222', 
                                            padding: '12px',
                                            border: itemActual.idArticulo ? '1px solid #3c6c3e' : '1px solid #444'
                                        }}
                                        onClick={() => setShowModal(true)}
                                    >
                                        {itemActual.idArticulo ? (
                                            <span style={{ color: 'white' }}>
                                                {itemActual.descripcion}
                                            </span>
                                        ) : (
                                            <span style={{ color: '#888' }}>🔍 Haga clic para buscar artículo...</span>
                                        )}
                                    </div>
                                </div>

                                {/* Campos del artículo */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                    <div>
                                        <label style={{ color: '#aaa', fontSize: '11px' }}>CANTIDAD</label>
                                        <input 
                                            className="input-base" 
                                            type="number" 
                                            min="0.01"
                                            step="0.01"
                                            value={itemActual.cantidad} 
                                            onChange={e => setItemActual({...itemActual, cantidad: parseFloat(e.target.value) || 1})}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ color: '#aaa', fontSize: '11px' }}>MEDIDA</label>
                                        <input 
                                            className="input-base" 
                                            placeholder="UN, KG, LT" 
                                            value={itemActual.medida} 
                                            onChange={e => setItemActual({...itemActual, medida: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ color: '#aaa', fontSize: '11px' }}>FECHA LÍMITE</label>
                                        <input 
                                            type="date" 
                                            className="input-base" 
                                            value={itemActual.fechaLimite} 
                                            onChange={e => setItemActual({...itemActual, fechaLimite: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ color: '#aaa', fontSize: '11px' }}>ACCIÓN</label>
                                        <select 
                                            className="input-base"
                                            value={itemActual.accion}
                                            onChange={e => setItemActual({...itemActual, accion: e.target.value})}
                                        >
                                            <option value="normal">Normal</option>
                                            <option value="Modificar">Modificar</option>
                                            <option value="Duplicar">Duplicar</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ color: '#aaa', fontSize: '11px' }}>ESPECIFICACIONES TÉCNICAS</label>
                                    <textarea 
                                        className="input-base" 
                                        placeholder="Especificaciones técnicas..." 
                                        value={itemActual.especificacionesTecnicas} 
                                        onChange={e => setItemActual({...itemActual, especificacionesTecnicas: e.target.value})}
                                        rows="2"
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ color: '#aaa', fontSize: '11px' }}>OBSERVACIONES</label>
                                    <textarea 
                                        className="input-base" 
                                        placeholder="Observaciones..." 
                                        value={itemActual.observaciones} 
                                        onChange={e => setItemActual({...itemActual, observaciones: e.target.value})}
                                        rows="2"
                                        style={{ width: '100%' }}
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
                            <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
                                <h3 style={{ color: '#3c6c3e', margin: '0 0 15px 0' }}>
                                    Artículos ({nuevaSolicitud.detalles.length})
                                </h3>
                                
                                {nuevaSolicitud.detalles.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                                        No hay artículos agregados
                                    </div>
                                ) : (
                                    <table className="partidas-table" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>Descripción</th>
                                                <th>Cant.</th>
                                                <th>Medida</th>
                                                <th>Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {nuevaSolicitud.detalles.map((d, i) => (
                                                <tr key={i}>
                                                    <td>{d.descripcion}</td>
                                                    <td>{d.cantidad}</td>
                                                    <td>{d.medida || '-'}</td>
                                                    <td>
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
                                )}
                            </div>

                            {/* Botón guardar */}
                            <button 
                                className="action-button primary-button" 
                                style={{ 
                                    background: '#2e7d32', 
                                    marginTop: '20px', 
                                    width: '100%', 
                                    padding: '15px'
                                }} 
                                onClick={handleCrearSolicitud} 
                                disabled={loading || nuevaSolicitud.detalles.length === 0}
                            >
                                {loading ? "GUARDANDO..." : "GUARDAR SOLICITUD"}
                            </button>
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