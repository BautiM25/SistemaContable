import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

const DIVISAS = ['ARS', 'USD'];

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
                    autoFocus
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
// MODAL PARA BUSCAR PROVEEDOR
// ====================================================================
const BuscarProveedorModal = ({ onSelect, onClose }) => {
    const [proveedores, setProveedores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/proveedores/status?status=true")
            .then(res => setProveedores(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const filtered = proveedores.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || p.cuitCuil.includes(searchTerm)
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta">
                <h3 className="modal-title">Seleccionar Proveedor Habitual</h3>
                <input 
                    type="text" 
                    className="input-base large-input" 
                    placeholder="Filtrar por nombre o CUIT..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="cuenta-list-container">
                    {loading ? <div>Cargando...</div> : 
                        filtered.map(p => (
                            <div key={p.id} className="list-item clickable-item" onClick={() => onSelect(p)}>
                                <span className="item-code">{p.cuitCuil}</span>
                                <span className="item-name">{p.nombre}</span>
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
// COMPONENTE PRINCIPAL: MODIFICACION (Mismo form que Alta)
// ====================================================================
export default function ModificacionArticulo({ onPageChange }) {
    const [seleccionado, setSeleccionado] = useState(null);
    const [articulosActivos, setArticulosActivos] = useState([]);
    const [showArticuloModal, setShowArticuloModal] = useState(false);
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [nombreProveedorSel, setNombreProveedorSel] = useState("");
    const [loadingList, setLoadingList] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        referencia: '', descripcion: '', familia: '',
        habilitado: true, envaseSiNo: false, unidadesPorEnvase: 1,
        modalidadIvaCompra: 'GENERAL',
        modalidadIvaVenta: 'GENERAL',
        idProveedorHabitual: null,
        costoDivisa: 0, costoBase: 0, divisa: 'ARS',
        precioPublico: 0, precioMayorista: 0, descuentoMaximo: 0,
        listaPrecios: '', 
        stockFisico: 0,
        stockMinimo: 0,
        stockMaximo: 1000,
        comentarios: ''
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
        setNombreProveedorSel(art.nombreProveedorHabitual || "Buscar Proveedor...");
        setShowArticuloModal(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const numericFields = ['unidadesPorEnvase', 'costoDivisa', 'costoBase', 'precioPublico', 'precioMayorista', 'descuentoMaximo', 'stockFisico', 'stockMinimo', 'stockMaximo'];
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : 
                    numericFields.includes(name) ? (value === "" ? "" : parseFloat(value)) : value
        }));
    };

    const handleSelectSupplier = (p) => {
        setFormData(prev => ({ ...prev, idProveedorHabitual: p.id }));
        setNombreProveedorSel(p.nombre);
        setShowSupplierModal(false);
    };

    const handleGuardar = async () => {
        if (!formData.referencia || !formData.descripcion) {
            alert("Referencia y Descripción son campos obligatorios.");
            return;
        }

        setIsSubmitting(true);
        // Limpieza para Backend (vaciós a 0)
        const finalData = { ...formData };
        ['stockFisico', 'stockMinimo', 'stockMaximo'].forEach(key => {
            if (finalData[key] === "") finalData[key] = 0;
        });

        try {
            await api.put(`/articulos/${seleccionado.id}`, finalData);
            alert("✅ Artículo actualizado correctamente.");
            onPageChange("GESTION_STOCK");
        } catch (err) {
            console.error("Error al actualizar:", err.response?.data);
            alert("❌ Error al guardar los cambios.");
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
                                <h3 className="partidas-title">Busque el artículo que desea modificar</h3>
                                <button className="action-button primary-button large-button" onClick={() => setShowArticuloModal(true)}>
                                    BUSCAR ARTÍCULO
                                </button>
                            </div>
                        ) : (
                            <div className="tab-content-grid">
                                <h3 className="partidas-title">Identificación y Clasificación</h3>
                                <div className="input-row">
                                    <label className="header-field">Referencia / SKU:
                                        <input type="text" className="input-base" name="referencia" value={formData.referencia} onChange={handleChange} />
                                    </label>
                                    <label className="header-field">Familia:
                                        <input type="text" className="input-base" name="familia" value={formData.familia} onChange={handleChange} />
                                    </label>
                                </div>
                                <div className="input-row">
                                    <label className="header-field">Descripción:
                                        <input type="text" className="input-base" name="descripcion" value={formData.descripcion} onChange={handleChange} />
                                    </label>
                                </div>

                                <h3 className="partidas-title" style={{ marginTop: '20px' }}>Costos y Suministro</h3>
                                <div className="input-row">
                                    <label className="header-field">Proveedor Habitual:
                                        <div className="input-base" onClick={() => setShowSupplierModal(true)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                                            {nombreProveedorSel || "Buscar Proveedor..."}
                                        </div>
                                    </label>
                                    <label className="header-field">Divisa:
                                        <select className="input-base" name="divisa" value={formData.divisa} onChange={handleChange}>
                                            {DIVISAS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </label>
                                </div>

                                <h3 className="partidas-title" style={{ marginTop: '20px' }}>Precios y Stock</h3>
                                <div className="input-row three-columns">
                                    <label className="header-field">Stock Mínimo:
                                        <input type="number" className="input-base no-spinners" name="stockMinimo" value={formData.stockMinimo} onChange={handleChange} />
                                    </label>
                                    <label className="header-field">Stock Actual:
                                        <input type="number" className="input-base no-spinners" name="stockFisico" value={formData.stockFisico} onChange={handleChange} />
                                    </label>
                                    <label className="header-field">Stock Máximo:
                                        <input type="number" className="input-base no-spinners" name="stockMaximo" value={formData.stockMaximo} onChange={handleChange} />
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

            {showSupplierModal && (
                <BuscarProveedorModal 
                    onSelect={handleSelectSupplier} 
                    onClose={() => setShowSupplierModal(false)} 
                />
            )}
        </div>
    );
}