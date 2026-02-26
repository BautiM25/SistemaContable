import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// Enums sincronizados con el Backend
const IVA_MODALITIES = [
    { value: 'GENERAL', label: 'IVA General (21%)' },
    { value: 'REDUCIDO', label: 'IVA Reducido (10.5%)' },
    { value: 'RESPONSABLE_INSCRIPTO', label: 'Responsable Inscripto' },
    { value: 'EXENTO', label: 'Exento' }
];

const DIVISAS = ['ARS', 'USD', 'EUR'];

// ====================================================================
// MODAL PARA BUSCAR EL ARTÍCULO A MODIFICAR
// ====================================================================
const BuscarArticuloModal = ({ articulosDisponibles, onSelect, onClose, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = (articulosDisponibles || []).filter(art => 
        art.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) || 
        art.referencia.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta">
                <h3 className="modal-title">Seleccionar Artículo para Editar</h3>
                <input 
                    type="text" 
                    className="input-base large-input" 
                    placeholder="Buscar por SKU o descripción..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="cuenta-list-container">
                    {loading ? <div className="loading-state">Cargando...</div> : 
                        filtered.map(a => (
                            <div key={a.id} className="list-item clickable-item" onClick={() => onSelect(a)}>
                                <span className="item-code" style={{ minWidth: '120px' }}>[{a.referencia}]</span>
                                <span className="item-name">{a.descripcion}</span>
                            </div>
                        ))
                    }
                </div>
                <div className="modal-actions">
                    <button className="action-button secondary-button" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// MODAL PARA CAMBIAR PROVEEDOR HABITUAL
// ====================================================================
const BuscarProveedorModal = ({ onSelect, onClose }) => {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/proveedores/status?status=true")
            .then(res => setProveedores(res.data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta">
                <h3 className="modal-title">Cambiar Proveedor Habitual</h3>
                <div className="cuenta-list-container">
                    {loading ? <div>Cargando...</div> : 
                        proveedores.map(p => (
                            <div key={p.id} className="list-item clickable-item" onClick={() => onSelect(p)}>
                                <span className="item-code">{p.cuitCuil}</span>
                                <span className="item-name">{p.nombre}</span>
                            </div>
                        ))
                    }
                </div>
                <div className="modal-actions">
                    <button className="action-button secondary-button" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// COMPONENTE PRINCIPAL
// ====================================================================
export default function ModificacionArticulo({ onPageChange }) {
    const [seleccionado, setSeleccionado] = useState(null);
    const [articulosActivos, setArticulosActivos] = useState([]);
    const [showArticuloModal, setShowArticuloModal] = useState(false);
    const [showProveedorModal, setShowProveedorModal] = useState(false);
    const [loadingList, setLoadingList] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [nombreProveedorHabitual, setNombreProveedorHabitual] = useState("");

    const [formData, setFormData] = useState({
        referencia: '', descripcion: '', familia: '',
        habilitado: true, envaseSiNo: false, unidadesPorEnvase: 1,
        modalidadIvaCompra: 'GENERAL', modalidadIvaVenta: 'GENERAL',
        idProveedorHabitual: null, costoDivisa: 0, costoBase: 0, divisa: 'ARS',
        precioPublico: 0, precioMayorista: 0, descuentoMaximo: 0,
        listaPrecios: '', stockMinimo: 0, stockMaximo: 0, comentarios: ''
    });

    useEffect(() => {
        setLoadingList(true);
        api.get("/articulos/status?status=true")
            .then(res => setArticulosActivos(res.data))
            .finally(() => setLoadingList(false));
    }, []);

    const handleSelectArticulo = (art) => {
        setSeleccionado(art);
        setFormData({ ...art });
        setNombreProveedorHabitual(art.nombreProveedorHabitual || "No asignado");
        setShowArticuloModal(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const numericFields = ['unidadesPorEnvase', 'costoDivisa', 'costoBase', 'precioPublico', 'precioMayorista', 'descuentoMaximo', 'stockMinimo', 'stockMaximo'];
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : 
                    numericFields.includes(name) ? parseFloat(value) || 0 : value
        }));
    };

    const handleGuardar = async () => {
        setIsSubmitting(true);
        try {
            await api.put(`/articulos/${seleccionado.id}`, formData);
            alert("✅ Artículo actualizado correctamente.");
            onPageChange("GESTION_STOCK");
        } catch (err) {
            alert("❌ Error al actualizar el artículo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column">
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                            <h2 className="asiento-title">Modificación de Artículo</h2>
                        </div>
                    </div>

                    <div className="asiento-body form-body" style={{ overflowY: 'auto' }}>
                        {!seleccionado ? (
                            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                                <h3 className="partidas-title">Seleccione un artículo para editar</h3>
                                <button className="action-button primary-button large-button" onClick={() => setShowArticuloModal(true)}>
                                    BUSCAR ARTÍCULO
                                </button>
                            </div>
                        ) : (
                            <div className="tab-content-grid">
                                <h3 className="partidas-title">Datos Principales (Ref: {formData.referencia})</h3>
                                <div className="input-row">
                                    <label className="header-field">Descripción:
                                        <input type="text" className="input-base" name="descripcion" value={formData.descripcion} onChange={handleChange} />
                                    </label>
                                    <label className="header-field">Familia:
                                        <input type="text" className="input-base" name="familia" value={formData.familia} onChange={handleChange} />
                                    </label>
                                </div>

                                <h3 className="partidas-title" style={{ marginTop: '20px' }}>Costos y Proveedor</h3>
                                <div className="input-row">
                                    <label className="header-field">Proveedor Habitual:
                                        <div className="input-base" onClick={() => setShowProveedorModal(true)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                                            {nombreProveedorHabitual} (Click para cambiar)
                                        </div>
                                    </label>
                                    <label className="header-field">Divisa:
                                        <select className="input-base" name="divisa" value={formData.divisa} onChange={handleChange}>
                                            {DIVISAS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </label>
                                </div>
                                <div className="input-row three-columns">
                                    <label className="header-field">Costo Base:
                                        <input type="number" className="input-base" name="costoBase" value={formData.costoBase} onChange={handleChange} />
                                    </label>
                                    <label className="header-field">IVA Compra:
                                        <select className="input-base" name="modalidadIvaCompra" value={formData.modalidadIvaCompra} onChange={handleChange}>
                                            {IVA_MODALITIES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                        </select>
                                    </label>
                                    <label className="header-field">IVA Venta:
                                        <select className="input-base" name="modalidadIvaVenta" value={formData.modalidadIvaVenta} onChange={handleChange}>
                                            {IVA_MODALITIES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                        </select>
                                    </label>
                                </div>

                                <h3 className="partidas-title" style={{ marginTop: '20px' }}>Stock y Control</h3>
                                <div className="input-row three-columns">
                                    <label className="header-field">Stock Mínimo:
                                        <input type="number" className="input-base" name="stockMinimo" value={formData.stockMinimo} onChange={handleChange} />
                                    </label>
                                    <label className="header-field">Stock Máximo:
                                        <input type="number" className="input-base" name="stockMaximo" value={formData.stockMaximo} onChange={handleChange} />
                                    </label>
                                    <label className="header-field" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                                        <input type="checkbox" name="habilitado" checked={formData.habilitado} onChange={handleChange} />
                                        Habilitado
                                    </label>
                                </div>

                                <div className="input-row">
                                    <label className="header-field">Comentarios:
                                        <textarea className="input-base" name="comentarios" rows="3" value={formData.comentarios} onChange={handleChange} style={{ width: '100%', resize: 'none' }} />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="asiento-footer">
                        {seleccionado && (
                            <button className="action-button primary-button" onClick={handleGuardar} disabled={isSubmitting}>
                                <img src={LogoGrupo5} alt="save" />
                                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        )}
                        <button className="action-button secondary-button" onClick={() => onPageChange("GESTION_STOCK")}>
                            {seleccionado ? "Cancelar" : "Volver"}
                        </button>
                    </div>
                </div>
            </div>

            {showArticuloModal && (
                <BuscarArticuloModal 
                    articulosDisponibles={articulosActivos} 
                    loading={loadingList} 
                    onSelect={handleSelectArticulo} 
                    onClose={() => setShowArticuloModal(false)} 
                />
            )}

            {showProveedorModal && (
                <BuscarProveedorModal 
                    onSelect={(p) => {
                        setFormData(prev => ({ ...prev, idProveedorHabitual: p.id }));
                        setNombreProveedorHabitual(p.nombre);
                        setShowProveedorModal(false);
                    }} 
                    onClose={() => setShowProveedorModal(false)} 
                />
            )}
        </div>
    );
}