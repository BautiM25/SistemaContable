import React, { useState, useEffect } from 'react';
import api from "../services/api";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from '../assets/LogoGrupo5.png';

import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css";

// ====================================================================
// MODAL DE BÚSQUEDA DE PROVEEDORES
// ====================================================================
const BuscarProveedorModal = ({ onSelect, onClose }) => {
    const [proveedores, setProveedores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const res = await api.get("/proveedores");
                setProveedores(res.data);
            } catch (err) {
                console.error("Error al cargar proveedores:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProveedores();
    }, []);

    const filtered = proveedores.filter(p => 
        p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.cuit?.includes(searchTerm)
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta" style={{ width: '600px', maxWidth: '90%' }}>
                <h3 className="modal-title">Seleccionar Proveedor</h3>
                <input 
                    type="text" 
                    className="input-base large-input" 
                    placeholder="Filtrar por nombre o CUIT..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                />
                <div className="cuenta-list-container" style={{ maxHeight: '400px' }}>
                    {loading ? (
                        <div style={{color:'white', textAlign:'center', padding: '20px'}}>Cargando proveedores...</div>
                    ) : filtered.length > 0 ? (
                        filtered.map(p => (
                            <div key={p.id} className="list-item clickable-item" onClick={() => onSelect(p)}>
                                <span className="item-code" style={{ minWidth: '120px' }}>
                                    {p.cuit || `CUIT-${p.id}`}
                                </span>
                                <span className="item-name" style={{ flex: 2 }}>{p.nombre}</span>
                            </div>
                        ))
                    ) : (
                        <div style={{color:'#999', textAlign:'center', padding: '20px'}}>No se encontraron proveedores</div>
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
// MODAL DE BÚSQUEDA DE SOLICITUDES
// ====================================================================
const BuscarSolicitudModal = ({ onSelect, onClose }) => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const res = await api.get("/solicitudes");

                console.log("📥 JSON recibido de /solicitudes:", JSON.stringify(res.data, null, 2));
                // Filtrar solo solicitudes activas y que tengan detalles
                const activas = res.data.filter(s => s.estado === true && s.detalles?.length > 0);
                setSolicitudes(activas);
            } catch (err) {
                console.error("Error al cargar solicitudes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSolicitudes();
    }, []);

    const filtered = solicitudes.filter(s => 
        s.numeroSolicitud?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta" style={{ width: '600px', maxWidth: '90%' }}>
                <h3 className="modal-title">Seleccionar Solicitud de Compra</h3>
                <input 
                    type="text" 
                    className="input-base large-input" 
                    placeholder="Filtrar por número de solicitud..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                />
                <div className="cuenta-list-container" style={{ maxHeight: '400px' }}>
                    {loading ? (
                        <div style={{color:'white', textAlign:'center', padding: '20px'}}>Cargando solicitudes...</div>
                    ) : filtered.length > 0 ? (
                        filtered.map(s => (
                            <div key={s.id} className="list-item clickable-item" onClick={() => onSelect(s)}>
                                <span className="item-code" style={{ minWidth: '100px' }}>
                                    #{s.id}
                                </span>
                                <span className="item-name" style={{ flex: 2 }}>{s.numeroSolicitud}</span>
                                <span className="item-code" style={{ color: '#4caf50' }}>
                                    {s.detalles?.length || 0} items
                                </span>
                            </div>
                        ))
                    ) : (
                        <div style={{color:'#999', textAlign:'center', padding: '20px'}}>No se encontraron solicitudes activas</div>
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
// COMPONENTE PRINCIPAL: ORDEN DE COMPRA
// ====================================================================
const OrdenCompra = ({ onPageChange }) => {
    const [ordenes, setOrdenes] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [view, setView] = useState('list'); 
    const [loading, setLoading] = useState(false);
    const [showProveedorModal, setShowProveedorModal] = useState(false);
    const [showSolicitudModal, setShowSolicitudModal] = useState(false);
    
    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

    const [nuevaOrden, setNuevaOrden] = useState({
        numeroOrdenCompra: '',
        idSolicitud: null,
        idProveedor: null,
        condicionesPago: '',
        observaciones: '',
        comprador: '',
        detalles: []
    });

    const [solicitudOrigen, setSolicitudOrigen] = useState(null);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

    const [itemActual, setItemActual] = useState({
        idArticulo: null,
        descripcion: '',
        cantidad: 1,
        medida: '',
        precioUnitario: 0
    });

    useEffect(() => {
        cargarOrdenes();
    }, []);

    // Generar número de orden automático
    const generarNumeroOrden = () => {
        const fecha = new Date();
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        
        let maxNumero = 0;
        ordenes.forEach(o => {
            if (o.numeroOrdenCompra) {
                const partes = o.numeroOrdenCompra.split('-');
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
        
        return `OC-${año}${mes}${dia}-${secuencialStr}`;
    };

    const cargarOrdenes = async () => {
        setLoading(true);
        try {
            const res = await api.get("/ordenes");
            console.log("Órdenes recibidas:", JSON.stringify(res.data, null, 2));
            setOrdenes(res.data);
        } catch (err) {
            console.error("Error al obtener órdenes:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectProveedor = (prov) => {
        setProveedorSeleccionado(prov);
        setNuevaOrden({
            ...nuevaOrden,
            idProveedor: prov.id
        });
        setShowProveedorModal(false);
    };

    const handleSelectSolicitud = (solicitud) => {
        setSolicitudOrigen(solicitud);
        setNuevaOrden({
            ...nuevaOrden,
            idSolicitud: solicitud.id,
            // Cargar los detalles de la solicitud como base (con cantidad editable)
            detalles: solicitud.detalles.map(d => ({
                idArticulo: d.idArticulo || d.articulo?.id,
                descripcion: d.articuloDescripcion || d.descripcion,
                cantidad: d.cantidad, // Se carga la cantidad de la solicitud pero será editable
                medida: d.medida || '',
                precioUnitario: 0
            }))
        });
        setShowSolicitudModal(false);
    };

    // Función para actualizar cualquier campo de un detalle
    const actualizarDetalle = (index, campo, valor) => {
        const nuevosDetalles = [...nuevaOrden.detalles];
        nuevosDetalles[index] = {
            ...nuevosDetalles[index],
            [campo]: campo === 'cantidad' || campo === 'precioUnitario' ? parseFloat(valor) || 0 : valor
        };
        setNuevaOrden({
            ...nuevaOrden,
            detalles: nuevosDetalles
        });
    };

    const actualizarPrecioDetalle = (index, precio) => {
        const nuevosDetalles = [...nuevaOrden.detalles];
        nuevosDetalles[index].precioUnitario = parseFloat(precio) || 0;
        setNuevaOrden({
            ...nuevaOrden,
            detalles: nuevosDetalles
        });
    };

    const eliminarDetalle = (index) => {
        const nuevosDetalles = nuevaOrden.detalles.filter((_, i) => i !== index);
        setNuevaOrden({
            ...nuevaOrden,
            detalles: nuevosDetalles
        });
    };

    const calcularSubtotal = () => {
        return nuevaOrden.detalles.reduce((sum, d) => 
            sum + (d.cantidad * d.precioUnitario), 0
        ).toFixed(2);
    };

    const calcularIVA = () => {
        return (calcularSubtotal() * 0.21).toFixed(2); // 21% IVA
    };

    const calcularTotal = () => {
        return (parseFloat(calcularSubtotal()) + parseFloat(calcularIVA())).toFixed(2);
    };

    const handleGenerarOrden = async () => {
        if (!nuevaOrden.idProveedor) {
            alert("Seleccione un proveedor.");
            return;
        }
        if (nuevaOrden.detalles.length === 0) {
            alert("La orden debe tener al menos un artículo.");
            return;
        }
        
        setLoading(true);
        try {
            // Preparar DTO según CreateOrdenCompraDto
            const ordenDto = {
                numeroOrdenCompra: nuevaOrden.numeroOrdenCompra,
                idSolicitud: nuevaOrden.idSolicitud,
                idProveedor: nuevaOrden.idProveedor,
                condicionesPago: nuevaOrden.condicionesPago || "Contado",
                observaciones: nuevaOrden.observaciones,
                comprador: nuevaOrden.comprador || "Sistema",
                detalles: nuevaOrden.detalles.map(d => ({
                    idArticulo: d.idArticulo,
                    cantidad: d.cantidad,
                    precioUnitario: d.precioUnitario,
                    medida: d.medida
                }))
            };

            console.log("🚀 Payload enviado al Back:", JSON.stringify(ordenDto, null, 2));
            
            await api.post("/ordenes/generar-desde-solicitud", ordenDto);
            alert("✅ Orden de Compra generada exitosamente.");
            await cargarOrdenes();
            setView('list');
            resetNuevaOrden();
        } catch (err) {
            alert("❌ Error al generar la orden.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetNuevaOrden = () => {
        setNuevaOrden({
            numeroOrdenCompra: generarNumeroOrden(),
            idSolicitud: null,
            idProveedor: null,
            condicionesPago: '',
            observaciones: '',
            comprador: '',
            detalles: []
        });
        setSolicitudOrigen(null);
        setProveedorSeleccionado(null);
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return 'Pendiente';
        try {
            return new Date(fecha).toLocaleDateString('es-ES');
        } catch {
            return 'Pendiente';
        }
    };

    const formatearMoneda = (valor) => {
        if (!valor) return '$0.00';
        return `$${parseFloat(valor).toFixed(2)}`;
    };

    return (
        <div className="page-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                
                {/* HEADER */}
                <div className="asiento-header" style={{ flexShrink: 0 }}>
                    <div className="asiento-logo-wrapper">
                        <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                        <h2 className="asiento-title">
                            {view === 'detail' ? `Detalle: Orden #${ordenSeleccionada?.numeroOrdenCompra}` : 
                             view === 'create' ? "➕ Generar Orden de Compra" : "📋 Gestión de Órdenes de Compra"}
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
                                    resetNuevaOrden();
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
                                <div style={{ textAlign: 'center', padding: '40px', color: '#000' }}>Cargando...</div>
                            ) : ordenes.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px', color: '#000' }}>
                                    No hay órdenes de compra
                                </div>
                            ) : (
                                <table className="partidas-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                                    <thead>
                                        <tr style={{ background: '#f0f0f0' }}>
                                            <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>ID</th>
                                            <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>N° Orden</th>
                                            <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Fecha</th>
                                            <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Proveedor</th>
                                            <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Solicitud</th>
                                            <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Total</th>
                                            <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ordenes
                                            .filter(o => o.numeroOrdenCompra?.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map(o => (
                                                <tr key={o.id} style={{ borderBottom: '1px solid #ccc' }}>
                                                    <td style={{ padding: '10px', color: '#000' }}>#{o.id}</td>
                                                    <td style={{ padding: '10px', color: '#000', fontWeight: 'bold' }}>{o.numeroOrdenCompra}</td>
                                                    <td style={{ padding: '10px', color: '#000' }}>{formatearFecha(o.fechaEmision)}</td>
                                                    <td style={{ padding: '10px', color: '#000' }}>{o.proveedorNombre}</td>
                                                    <td style={{ padding: '10px', color: '#000' }}>{o.solicitudNumero || '-'}</td>
                                                    <td style={{ padding: '10px', color: '#000', fontWeight: 'bold' }}>{formatearMoneda(o.total)}</td>
                                                    <td style={{ padding: '10px' }}>
                                                        <button 
                                                            className="action-button primary-button" 
                                                            style={{ padding: '5px 15px', background: '#3c6c3e', color: 'white' }}
                                                            onClick={() => { 
                                                                setOrdenSeleccionada(o); 
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

                    {/* ===== DETALLE ===== */}
                    {view === 'detail' && ordenSeleccionada && (
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
                                    Orden #{ordenSeleccionada.numeroOrdenCompra}
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                                    <div>
                                        <strong style={{ color: '#000' }}>ID:</strong>
                                        <span style={{ color: '#000', marginLeft: '5px' }}>{ordenSeleccionada.id}</span>
                                    </div>
                                    <div>
                                        <strong style={{ color: '#000' }}>Fecha:</strong>
                                        <span style={{ color: '#000', marginLeft: '5px' }}>{formatearFecha(ordenSeleccionada.fechaEmision)}</span>
                                    </div>
                                    <div>
                                        <strong style={{ color: '#000' }}>Proveedor:</strong>
                                        <span style={{ color: '#000', marginLeft: '5px' }}>{ordenSeleccionada.proveedorNombre}</span>
                                    </div>
                                    <div>
                                        <strong style={{ color: '#000' }}>Solicitud:</strong>
                                        <span style={{ color: '#000', marginLeft: '5px' }}>{ordenSeleccionada.solicitudNumero || '-'}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '10px' }}>
                                    <div>
                                        <strong style={{ color: '#000' }}>Subtotal:</strong>
                                        <span style={{ color: '#000', marginLeft: '5px' }}>{formatearMoneda(ordenSeleccionada.subtotal)}</span>
                                    </div>
                                    <div>
                                        <strong style={{ color: '#000' }}>IVA:</strong>
                                        <span style={{ color: '#000', marginLeft: '5px' }}>{formatearMoneda(ordenSeleccionada.iva)}</span>
                                    </div>
                                    <div>
                                        <strong style={{ color: '#000' }}>Total:</strong>
                                        <span style={{ color: '#000', marginLeft: '5px', fontWeight: 'bold' }}>{formatearMoneda(ordenSeleccionada.total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tabla de detalles */}
                            <h3 style={{ color: '#fff', marginBottom: '15px' }}>Detalle de Artículos</h3>
                            
                            {ordenSeleccionada.detalles && ordenSeleccionada.detalles.length > 0 ? (
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="partidas-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                                        <thead>
                                            <tr style={{ background: '#f0f0f0' }}>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Referencia</th>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Descripción</th>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Cantidad</th>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Medida</th>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Precio Unit.</th>
                                                <th style={{ padding: '10px', textAlign: 'left', color: '#000', borderBottom: '2px solid #ccc' }}>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ordenSeleccionada.detalles.map((d, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid #ccc' }}>
                                                    <td style={{ padding: '10px', color: '#000' }}>{d.articuloReferencia}</td>
                                                    <td style={{ padding: '10px', color: '#000' }}>{d.articuloDescripcion}</td>
                                                    <td style={{ padding: '10px', color: '#000' }}>{d.cantidad}</td>
                                                    <td style={{ padding: '10px', color: '#000' }}>{d.medida || '-'}</td>
                                                    <td style={{ padding: '10px', color: '#000' }}>{formatearMoneda(d.precioUnitario)}</td>
                                                    <td style={{ padding: '10px', color: '#000', fontWeight: 'bold' }}>{formatearMoneda(d.subtotalLinea)}</td>
                                                </tr>
                                            ))}
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
                                    No hay artículos en esta orden
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
                                maxWidth: '1200px',
                                margin: '0 auto'
                            }}>
                                {/* Número de orden automático */}
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
                                        NÚMERO DE ORDEN
                                    </label>
                                    <input 
                                        className="input-base" 
                                        value={nuevaOrden.numeroOrdenCompra} 
                                        readOnly
                                        style={{ width: '100%', background: '#333', color: '#3c6c3e', fontWeight: 'bold' }}
                                    />
                                </div>

                                {/* Selección de Proveedor y Solicitud */}
                                <div style={{ 
                                    background: '#1a1a1a', 
                                    padding: '20px', 
                                    borderRadius: '8px', 
                                    marginBottom: '20px',
                                    border: '1px solid #3c6c3e'
                                }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                                        <div>
                                            <label style={{ color: '#aaa', fontSize: '11px', display: 'block', marginBottom: '5px' }}>
                                                PROVEEDOR *
                                            </label>
                                            <div 
                                                className="input-base" 
                                                style={{ 
                                                    cursor: 'pointer', 
                                                    background: '#222', 
                                                    padding: '12px',
                                                    border: proveedorSeleccionado ? '1px solid #3c6c3e' : '1px solid #444',
                                                    color: proveedorSeleccionado ? '#fff' : '#888'
                                                }}
                                                onClick={() => setShowProveedorModal(true)}
                                            >
                                                {proveedorSeleccionado ? (
                                                    proveedorSeleccionado.nombre
                                                ) : (
                                                    "🔍 Seleccionar proveedor..."
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ color: '#aaa', fontSize: '11px', display: 'block', marginBottom: '5px' }}>
                                                SOLICITUD ORIGEN
                                            </label>
                                            <div 
                                                className="input-base" 
                                                style={{ 
                                                    cursor: 'pointer', 
                                                    background: '#222', 
                                                    padding: '12px',
                                                    border: solicitudOrigen ? '1px solid #3c6c3e' : '1px solid #444',
                                                    color: solicitudOrigen ? '#fff' : '#888'
                                                }}
                                                onClick={() => setShowSolicitudModal(true)}
                                            >
                                                {solicitudOrigen ? (
                                                    solicitudOrigen.numeroSolicitud
                                                ) : (
                                                    "🔍 Seleccionar solicitud (opcional)..."
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ color: '#aaa', fontSize: '11px', display: 'block', marginBottom: '5px' }}>
                                            CONDICIONES DE PAGO
                                        </label>
                                        <input 
                                            className="input-base" 
                                            placeholder="Ej: Contado, 30 días, etc." 
                                            value={nuevaOrden.condicionesPago} 
                                            onChange={e => setNuevaOrden({...nuevaOrden, condicionesPago: e.target.value})}
                                            style={{ width: '100%', background: '#222', color: '#fff' }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ color: '#aaa', fontSize: '11px', display: 'block', marginBottom: '5px' }}>
                                            OBSERVACIONES
                                        </label>
                                        <textarea 
                                            className="input-base" 
                                            placeholder="Observaciones generales..." 
                                            value={nuevaOrden.observaciones} 
                                            onChange={e => setNuevaOrden({...nuevaOrden, observaciones: e.target.value})}
                                            rows="2"
                                            style={{ width: '100%', background: '#222', color: '#fff' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: '#aaa', fontSize: '11px', display: 'block', marginBottom: '5px' }}>
                                            COMPRADOR
                                        </label>
                                        <input 
                                            className="input-base" 
                                            placeholder="Nombre del comprador" 
                                            value={nuevaOrden.comprador} 
                                            onChange={e => setNuevaOrden({...nuevaOrden, comprador: e.target.value})}
                                            style={{ width: '100%', background: '#222', color: '#fff' }}
                                        />
                                    </div>
                                </div>

                                {/* Tabla de artículos con cantidades editables */}
                                <div style={{ 
                                    background: '#2a2a2a', 
                                    padding: '20px', 
                                    borderRadius: '8px',
                                    marginBottom: '20px'
                                }}>
                                    <h3 style={{ color: '#3c6c3e', margin: '0 0 15px 0' }}>
                                        Artículos ({nuevaOrden.detalles.length})
                                    </h3>
                                    
                                    {nuevaOrden.detalles.length === 0 ? (
                                        <div style={{ 
                                            textAlign: 'center', 
                                            padding: '30px', 
                                            color: '#999', 
                                            background: '#1a1a1a', 
                                            borderRadius: '4px'
                                        }}>
                                            No hay artículos. Seleccione una solicitud para cargar los artículos.
                                        </div>
                                    ) : (
                                        <div style={{ overflowX: 'auto' }}>
                                            <table className="partidas-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <thead>
                                                    <tr style={{ background: '#333' }}>
                                                        <th style={{ padding: '10px', textAlign: 'left', color: '#000000' }}>ID Art.</th>
                                                        <th style={{ padding: '10px', textAlign: 'left', color: '#000000' }}>Descripción</th>
                                                        <th style={{ padding: '10px', textAlign: 'left', color: '#000000' }}>Cantidad</th>
                                                        <th style={{ padding: '10px', textAlign: 'left', color: '#000000' }}>Medida</th>
                                                        <th style={{ padding: '10px', textAlign: 'left', color: '#000000' }}>Precio Unit.</th>
                                                        <th style={{ padding: '10px', textAlign: 'left', color: '#000000' }}>Subtotal</th>
                                                        <th style={{ padding: '10px', textAlign: 'left', color: '#000000' }}>Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {nuevaOrden.detalles.map((d, i) => {
                                                        const subtotal = d.cantidad * d.precioUnitario;
                                                        return (
                                                            <tr key={i} style={{ borderBottom: '1px solid #444' }}>
                                                                <td style={{ padding: '10px', color: '#000000' }}>{d.idArticulo || '-'}</td>
                                                                <td style={{ padding: '10px', color: '#000000' }}>{d.descripcion}</td>
                                                                <td style={{ padding: '10px', color: '#fff' }}>
                                                                    <input 
                                                                        type="number" 
                                                                        min="0"
                                                                        step="1"
                                                                        value={d.cantidad} 
                                                                        onChange={e => actualizarDetalle(i, 'cantidad', e.target.value)}
                                                                        style={{ width: '80px', background: '#222', color: '#fff', border: '1px solid #444', padding: '5px', borderRadius: '4px' }}
                                                                    />
                                                                </td>
                                                                <td style={{ padding: '10px', color: '#000000' }}>{d.medida}</td>
                                                                <td style={{ padding: '10px', color: '#fff' }}>
                                                                    <input 
                                                                        type="number" 
                                                                        min="0"
                                                                        step="1"
                                                                        value={d.precioUnitario} 
                                                                        onChange={e => actualizarPrecioDetalle(i, e.target.value)}
                                                                        style={{ width: '100px', background: '#222', color: '#fff', border: '1px solid #444', padding: '5px', borderRadius: '4px' }}
                                                                    />
                                                                </td>
                                                                <td style={{ padding: '10px', color: '#ffd700', fontWeight: 'bold' }}>
                                                                    ${subtotal.toFixed(2)}
                                                                </td>
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
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                {/* Resumen de totales */}
                                {nuevaOrden.detalles.length > 0 && (
                                    <div style={{ 
                                        background: '#1a1a1a', 
                                        padding: '20px', 
                                        borderRadius: '8px',
                                        marginBottom: '20px',
                                        border: '1px solid #3c6c3e'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '30px' }}>
                                            <div>
                                                <span style={{ color: '#aaa' }}>Subtotal: </span>
                                                <span style={{ color: '#fff', fontWeight: 'bold' }}>${calcularSubtotal()}</span>
                                            </div>
                                            <div>
                                                <span style={{ color: '#aaa' }}>IVA (21%): </span>
                                                <span style={{ color: '#fff', fontWeight: 'bold' }}>${calcularIVA()}</span>
                                            </div>
                                            <div>
                                                <span style={{ color: '#aaa' }}>TOTAL: </span>
                                                <span style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '18px' }}>${calcularTotal()}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Botón generar */}
                                <button 
                                    className="action-button primary-button" 
                                    style={{ 
                                        background: '#2e7d32', 
                                        marginTop: '20px', 
                                        width: '100%', 
                                        padding: '15px',
                                        boxSizing: 'border-box'
                                    }} 
                                    onClick={handleGenerarOrden} 
                                    disabled={loading || nuevaOrden.detalles.length === 0 || !nuevaOrden.idProveedor}
                                >
                                    {loading ? "GENERANDO..." : "GENERAR ORDEN DE COMPRA"}
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

            {/* MODALES */}
            {showProveedorModal && (
                <BuscarProveedorModal 
                    onSelect={handleSelectProveedor} 
                    onClose={() => setShowProveedorModal(false)} 
                />
            )}
            {showSolicitudModal && (
                <BuscarSolicitudModal 
                    onSelect={handleSelectSolicitud} 
                    onClose={() => setShowSolicitudModal(false)} 
                />
            )}
        </div>
    );
};

export default OrdenCompra;