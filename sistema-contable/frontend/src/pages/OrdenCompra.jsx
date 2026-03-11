import React, { useState, useEffect } from 'react';
import api from "../services/api";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from '../assets/LogoGrupo5.png';

import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ====================================================================
// FUNCIÓN PARA GENERAR PDF (ACTUALIZADA)
// ====================================================================
const generarPDF = (orden) => {
    try {
        const doc = new jsPDF();

        doc.setFillColor(60, 108, 62); 
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("ORDEN DE COMPRA", 14, 25);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`Número de OC: ${orden.numeroOrdenCompra}`, 14, 50);
        doc.text(`Fecha de Emisión: ${new Date(orden.fechaEmision).toLocaleDateString()}`, 14, 55);
        doc.text(`Comprador: ${orden.comprador || 'Sistema'}`, 14, 60);

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text("PROVEEDOR:", 14, 75);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.text(`${orden.proveedorNombre}`, 14, 82);
        
        // Mostrar categoría de IVA
        if (orden.categoriaIva) {
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(`Categoría IVA: ${orden.categoriaIva}`, 14, 88);
            doc.setTextColor(0, 0, 0);
        }

        const columnas = ["Referencia", "Descripción", "Cant.", "Precio Unit.", "Subtotal"];
        const filas = (orden.detalles || []).map(d => [
            d.articuloReferencia,
            d.articuloDescripcion,
            d.cantidad,
            `$${parseFloat(d.precioUnitario).toLocaleString()}`,
            `$${parseFloat(d.subtotalLinea).toLocaleString()}`
        ]);

        autoTable(doc, {
            startY: 95,
            head: [columnas],
            body: filas,
            theme: 'grid',
            headStyles: { fillColor: [60, 108, 62], textColor: [255, 255, 255] },
            styles: { fontSize: 9 }
        });

        const finalY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(10);
        doc.text(`Subtotal: $${parseFloat(orden.subtotal).toLocaleString()}`, 140, finalY); 
        
        // Mostrar IVA solo si es mayor a 0
        if (parseFloat(orden.iva) > 0) {
            doc.text(`IVA (21%): $${parseFloat(orden.iva).toLocaleString()}`, 140, finalY + 7); 
        } else {
            doc.text(`(Proveedor exento - Sin IVA)`, 140, finalY + 7);
        }
        
        doc.setFont(undefined, 'bold');
        doc.text(`TOTAL: $${parseFloat(orden.total).toLocaleString()}`, 140, finalY + 15); 

        doc.save(`Orden_${orden.numeroOrdenCompra}.pdf`);

    } catch (error) {
        console.error("Error generando PDF:", error);
        alert("No se pudo generar el PDF. Revisá la consola.");
    }
};

// ====================================================================
// MODAL DE BÚSQUEDA DE PROVEEDORES (ACTUALIZADO)
// ====================================================================
const BuscarProveedorModal = ({ onSelect, onClose, proveedoresAptos = [], isFiltering = false }) => {
    const [proveedores, setProveedores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const getCategoriaIVATexto = (categoria) => {
        const categorias = {
            'RESPONSABLE_INSCRIPTO': 'RI (21%)',
            'MONOTRIBUTISTA': 'Monotributo',
            'EXENTO': 'Exento'
        };
        return categorias[categoria] || categoria;
    };

    useEffect(() => {
        if (isFiltering) {
            setProveedores(proveedoresAptos);
            setLoading(false);
        } else {
            const fetchProveedores = async () => {
                setLoading(true);
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
        }
    }, [proveedoresAptos, isFiltering]);

    const filtered = proveedores.filter(p => 
        p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.cuitCuil?.includes(searchTerm)
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta" style={{ width: '600px', maxWidth: '90%', border: isFiltering && proveedores.length === 0 ? '2px solid #8b2b2b' : 'none' }}>
                <h3 className="modal-title">
                    {isFiltering ? "Validación de Proveedores Aptos" : "Seleccionar Proveedor"}
                </h3>

                {isFiltering && proveedores.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px' }}>
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>⚠️</div>
                        <p style={{ color: '#ff4d4d', fontWeight: 'bold', fontSize: '16px' }}>
                            SIN COINCIDENCIAS TOTALES
                        </p>
                        <p style={{ color: '#bbb', fontSize: '13px', marginTop: '10px' }}>
                            Ningún proveedor en la base de datos suministra la totalidad de los artículos activos en esta solicitud.
                        </p>
                        <p style={{ color: '#888', fontSize: '11px', fontStyle: 'italic' }}>
                            Sugerencia: Cierre este cuadro y remueva artículos de la tabla para volver a evaluar.
                        </p>
                    </div>
                ) : (
                    <>
                        <input 
                            type="text" 
                            className="input-base large-input" 
                            placeholder="Filtrar por nombre o CUIT..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                        <div className="cuenta-list-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {loading ? (
                                <div style={{color:'white', textAlign:'center', padding: '20px'}}>Sincronizando...</div>
                            ) : filtered.length > 0 ? (
                                filtered.map(p => (
                                    <div key={p.id} className="list-item clickable-item" onClick={() => onSelect(p)}>
                                        <span className="item-code" style={{ minWidth: '120px' }}>
                                            {p.cuitCuil}
                                        </span>
                                        <span className="item-name" style={{ flex: 2 }}>{p.nombre}</span>
                                        <span className="item-code" style={{ 
                                            color: p.categoriaIva === 'RESPONSABLE_INSCRIPTO' ? '#4caf50' : '#ff9800',
                                            fontSize: '11px',
                                            marginRight: '10px'
                                        }}>
                                            {getCategoriaIVATexto(p.categoriaIva)}
                                        </span>
                                        {isFiltering && <span style={{color: '#4caf50', fontSize: '10px', fontWeight:'bold'}}>APTO ✅</span>}
                                    </div>
                                ))
                            ) : (
                                <div style={{color:'#999', textAlign:'center', padding: '20px'}}>No hay proveedores disponibles</div>
                            )}
                        </div>
                    </>
                )}

                <div className="modal-actions" style={{ marginTop: '20px' }}>
                    <button className="action-button secondary-button" onClick={onClose}>
                        {isFiltering && proveedores.length === 0 ? "ENTENDIDO" : "CANCELAR"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// MODAL DE BÚSQUEDA DE SOLICITUDES (SIN CAMBIOS)
// ====================================================================
const BuscarSolicitudModal = ({ onSelect, onClose }) => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const res = await api.get("/solicitudes");
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
// COMPONENTE PRINCIPAL: ORDEN DE COMPRA (ACTUALIZADO)
// ====================================================================
const OrdenCompra = ({ onPageChange }) => {
    const [ordenes, setOrdenes] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [view, setView] = useState('list'); 
    const [loading, setLoading] = useState(false);
    const [showProveedorModal, setShowProveedorModal] = useState(false);
    const [showSolicitudModal, setShowSolicitudModal] = useState(false);
    const [proveedoresAptos, setProveedoresAptos] = useState([]);
    const [analisisBloqueo, setAnalisisBloqueo] = useState(null);
    const [buscandoAptos, setBuscandoAptos] = useState(false);
    
    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
    const [solicitudOrigen, setSolicitudOrigen] = useState(null);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

    const [nuevaOrden, setNuevaOrden] = useState({
        numeroOrdenCompra: '',
        idSolicitud: null,
        idProveedor: null,
        condicionesPago: '',
        observaciones: '',
        comprador: '',
        detalles: []
    });

    useEffect(() => { 
        cargarOrdenes(); 
    }, []);

    useEffect(() => {
        if (view === 'create' && !nuevaOrden.numeroOrdenCompra) {
            setNuevaOrden(prev => ({
                ...prev,
                numeroOrdenCompra: generarNumeroOrden()
            }));
        }
    }, [view]);

    const cargarOrdenes = async () => {
        setLoading(true);
        try {
            const res = await api.get("/ordenes");
            setOrdenes(res.data);
        } catch (err) {
            console.error("Error al obtener órdenes:", err);
        } finally {
            setLoading(false);
        }
    };

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
                    if (!isNaN(secuencial) && secuencial > maxNumero) maxNumero = secuencial;
                }
            }
        });
        return `OC-${año}${mes}${dia}-${String(maxNumero + 1).padStart(3, '0')}`;
    };

    // ===== FUNCIONES PARA IVA =====
    const proveedorEsResponsableInscripto = () => {
        return proveedorSeleccionado?.categoriaIva === 'RESPONSABLE_INSCRIPTO';
    };

    const getCategoriaIVATexto = () => {
        if (!proveedorSeleccionado) return '';
        const categorias = {
            'RESPONSABLE_INSCRIPTO': 'Responsable Inscripto (21%)',
            'MONOTRIBUTISTA': 'Monotributista (Sin IVA)',
            'EXENTO': 'Exento (Sin IVA)'
        };
        return categorias[proveedorSeleccionado.categoriaIva] || proveedorSeleccionado.categoriaIva;
    };

    const calcularSubtotal = () => {
        return nuevaOrden.detalles.reduce((sum, d) => 
            sum + (d.cantidad * d.precioUnitario), 0
        ).toFixed(2);
    };

    const calcularIVA = () => {
        const subtotal = parseFloat(calcularSubtotal()) || 0;
        if (!proveedorEsResponsableInscripto()) {
            return (0).toFixed(2);
        }
        return (subtotal * 0.21).toFixed(2);
    };

    const calcularTotal = () => {
        const subtotal = parseFloat(calcularSubtotal()) || 0;
        const iva = parseFloat(calcularIVA()) || 0;
        return (subtotal + iva).toFixed(2);
    };
    // ==============================

    const handleSelectProveedor = (prov) => {
        setProveedorSeleccionado(prov);
        
        const detallesActualizados = nuevaOrden.detalles.map(det => {
            const vinculacion = prov.articulos?.find(a => a.idArticulo === det.idArticulo);
            return {
                ...det,
                precioUnitario: vinculacion ? vinculacion.precioPactado : det.precioUnitario
            };
        });

        setNuevaOrden({
            ...nuevaOrden,
            idProveedor: prov.id,
            detalles: detallesActualizados
        });
        
        setShowProveedorModal(false);
    };

    const buscarProveedoresAptos = async (idSolicitud, idsVigentes = []) => {
        setBuscandoAptos(true);
        try {
            const idsQuery = idsVigentes.length > 0 ? `?ids=${idsVigentes.join(',')}` : '';
            const res = await api.get(`/solicitudes/${idSolicitud}/proveedores-aptos${idsQuery}`);
            setProveedoresAptos(res.data);
            
            if (res.data.length === 0) {
                setAnalisisBloqueo("Ningún proveedor suministra la totalidad de los artículos seleccionados.");
            } else {
                setAnalisisBloqueo(null);
            }
        } catch (err) {
            console.error("Error al buscar proveedores aptos:", err);
        } finally {
            setBuscandoAptos(false);
        }
    };

    const handleSelectSolicitud = (solicitud) => {
        setSolicitudOrigen(solicitud);
        
        const nuevosDetalles = solicitud.detalles
            .filter(d => d.estado) 
            .map(d => ({
                idArticulo: d.idArticulo,
                referencia: d.articuloReferencia,
                descripcion: d.articuloDescripcion,
                cantidad: d.cantidadFaltante !== undefined ? d.cantidadFaltante : d.cantidad, 
                medida: d.medida || '',
                precioUnitario: 0 
            }));

        setNuevaOrden({
            ...nuevaOrden,
            idSolicitud: solicitud.id,
            detalles: nuevosDetalles
        });
        
        setShowSolicitudModal(false);
        buscarProveedoresAptos(solicitud.id, nuevosDetalles.map(d => d.idArticulo)); 
    };

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
        setNuevaOrden({ ...nuevaOrden, detalles: nuevosDetalles });
        
        if (nuevaOrden.idSolicitud) {
            const idsRestantes = nuevosDetalles.map(d => d.idArticulo);
            buscarProveedoresAptos(nuevaOrden.idSolicitud, idsRestantes);
        }
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
            const ordenDto = {
                numeroOrdenCompra: nuevaOrden.numeroOrdenCompra,
                idSolicitud: nuevaOrden.idSolicitud,
                idProveedor: nuevaOrden.idProveedor,
                condicionesPago: nuevaOrden.condicionesPago || "CONTADO",
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
        setProveedoresAptos([]);
        setAnalisisBloqueo(null);
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
                            <div style={{ 
                                background: '#f0f0f0', 
                                padding: '20px', 
                                borderRadius: '8px', 
                                marginBottom: '20px',
                                borderLeft: '4px solid #3c6c3e'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ color: '#000', margin: '0 0 15px 0' }}>
                                        Orden #{ordenSeleccionada.numeroOrdenCompra}
                                    </h3>
                                    <button 
                                        className="action-button primary-button" 
                                        style={{ background: '#3c6c3e', padding: '8px 15px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
                                        onClick={() => generarPDF(ordenSeleccionada)}
                                    >
                                        PDF
                                    </button>
                                </div>

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
                                        {parseFloat(ordenSeleccionada.iva) === 0 && (
                                            <span style={{ color: '#ff9800', marginLeft: '5px', fontSize: '11px' }}>(Exento)</span>
                                        )}
                                    </div>
                                    <div>
                                        <strong style={{ color: '#000' }}>Total:</strong>
                                        <span style={{ color: '#000', marginLeft: '5px', fontWeight: 'bold' }}>{formatearMoneda(ordenSeleccionada.total)}</span>
                                    </div>
                                </div>
                            </div>

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
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <div className="user-form" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                                
                                {/* NÚMERO DE ORDEN */}
                                <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #3c6c3e' }}>
                                    <label style={{ color: '#aaa', fontSize: '11px', display: 'block', marginBottom: '5px' }}>NÚMERO DE ORDEN</label>
                                    <input className="input-base" value={nuevaOrden.numeroOrdenCompra} readOnly style={{ width: '100%', background: '#333', color: '#3c6c3e', fontWeight: 'bold' }} />
                                </div>

                                {/* PANEL DE INFORMACIÓN DEL PROVEEDOR (IVA) */}
                                {proveedorSeleccionado && (
                                    <div style={{ 
                                        background: proveedorEsResponsableInscripto() ? '#1b4a1b' : '#4a3b1b',
                                        padding: '12px 20px',
                                        borderRadius: '8px',
                                        marginBottom: '20px',
                                        borderLeft: `4px solid ${proveedorEsResponsableInscripto() ? '#4caf50' : '#ff9800'}`,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <span style={{ color: '#fff', fontWeight: 'bold' }}>Proveedor: {proveedorSeleccionado.nombre}</span>
                                            <span style={{ 
                                                color: '#fff', 
                                                marginLeft: '20px',
                                                background: 'rgba(255,255,255,0.2)',
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '12px'
                                            }}>
                                                {getCategoriaIVATexto()}
                                            </span>
                                        </div>
                                        <div>
                                            <span style={{ color: '#fff' }}>
                                                {proveedorEsResponsableInscripto() ? '✅ Aplica IVA 21%' : '⛔ Exento / Sin IVA'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* PANEL DE ANÁLISIS DE DISPONIBILIDAD */}
                                {solicitudOrigen && (
                                    <div style={{ 
                                        background: proveedoresAptos.length > 0 ? '#1b2e1b' : '#2e1b1b', 
                                        padding: '15px', borderRadius: '8px', marginBottom: '20px',
                                        border: `1px solid ${proveedoresAptos.length > 0 ? '#3c6c3e' : '#8b2b2b'}`,
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                    }}>
                                        <h4 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            {buscandoAptos ? "⏳ Analizando mercado..." : "🔍 Proveedores con Stock Completo"}
                                        </h4>
                                        
                                        {proveedoresAptos.length > 0 ? (
                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                {proveedoresAptos.map(p => (
                                                    <button 
                                                        key={p.id}
                                                        className={`action-button ${nuevaOrden.idProveedor === p.id ? 'primary-button' : 'secondary-button'}`}
                                                        style={{ fontSize: '12px', padding: '8px 15px', border: nuevaOrden.idProveedor === p.id ? '2px solid #fff' : 'none' }}
                                                        onClick={() => handleSelectProveedor(p)}
                                                    >
                                                        ✅ {p.nombre} ({p.categoriaIva === 'RESPONSABLE_INSCRIPTO' ? 'RI' : 'M/EX'})
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ padding: '5px' }}>
                                                <p style={{ color: '#ff4d4d', margin: '0', fontSize: '14px', fontWeight: 'bold' }}>
                                                    ⚠️ {analisisBloqueo || "Ningún proveedor suministra la totalidad de los artículos activos."}
                                                </p>
                                                <p style={{ color: '#aaa', margin: '5px 0 0 0', fontSize: '12px', fontStyle: 'italic' }}>
                                                    Sugerencia: Intente remover el artículo más restrictivo de la tabla inferior para encontrar coincidencias.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

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
                                        <select 
                                            className="input-base" 
                                            value={nuevaOrden.condicionesPago} 
                                            onChange={e => setNuevaOrden({...nuevaOrden, condicionesPago: e.target.value})}
                                            style={{ width: '100%', background: '#222', color: '#fff', padding: '10px' }}
                                        >
                                            <option value="">Seleccione una condición...</option>
                                            <option value="CONTADO">Contado (Efectivo/Banco)</option>
                                            <option value="CREDITO">Cuenta Corriente (Proveedores)</option>
                                        </select>
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

                                {/* Tabla de artículos */}
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

                                {/* Resumen de totales con IVA condicional */}
                                {nuevaOrden.detalles.length > 0 && (
                                    <div style={{ 
                                        background: '#1a1a1a', 
                                        padding: '20px', 
                                        borderRadius: '8px',
                                        marginBottom: '20px',
                                        border: '1px solid #3c6c3e'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '30px', alignItems: 'center' }}>
                                            <div>
                                                <span style={{ color: '#aaa' }}>Subtotal: </span>
                                                <span style={{ color: '#fff', fontWeight: 'bold' }}>${calcularSubtotal()}</span>
                                            </div>
                                            <div>
                                                <span style={{ color: '#aaa' }}>IVA: </span>
                                                <span style={{ 
                                                    color: proveedorEsResponsableInscripto() ? '#fff' : '#ff9800', 
                                                    fontWeight: 'bold' 
                                                }}>
                                                    ${calcularIVA()}
                                                    {!proveedorEsResponsableInscripto() && proveedorSeleccionado && 
                                                        <span style={{ fontSize: '10px', marginLeft: '5px', color: '#ff9800' }}>(Exento)</span>
                                                    }
                                                </span>
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
                    proveedoresAptos={proveedoresAptos} 
                    isFiltering={!!solicitudOrigen} 
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