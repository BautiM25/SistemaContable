import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// 🚨 CORRECCIÓN: Valores exactos del Enum en Java
const IVA_MODALITIES = [
    { value: 'GENERAL', label: 'IVA General (21%)' },
    { value: 'REDUCIDO', label: 'IVA Reducido (10.5%)' },
    { value: 'RESPONSABLE_INSCRIPTO', label: 'Responsable Inscripto' },
    { value: 'EXENTO', label: 'Exento' }
];

const DIVISAS = ['ARS', 'USD', 'EUR'];

// ====================================================================
// MODAL DE BÚSQUEDA DE PROVEEDOR
// ====================================================================
const BuscarProveedorModal = ({ onSelect, onClose }) => {
    const [proveedores, setProveedores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const res = await api.get("/proveedores/status?status=true");
                setProveedores(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchProveedores();
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
// COMPONENTE PRINCIPAL
// ====================================================================
export default function AltaArticulos({ onPageChange }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [nombreProveedorSel, setNombreProveedorSel] = useState("");

    const [formData, setFormData] = useState({
        referencia: '', descripcion: '', familia: '',
        habilitado: true, envaseSiNo: false, unidadesPorEnvase: 1,
        modalidadIvaCompra: 'GENERAL', // 🚨 Corregido: valor por defecto válido
        modalidadIvaVenta: 'GENERAL',  // 🚨 Corregido: valor por defecto válido
        idProveedorHabitual: null,
        costoDivisa: 0, costoBase: 0, divisa: 'ARS',
        precioPublico: 0, precioMayorista: 0, descuentoMaximo: 0,
        listaPrecios: '', stockMinimo: 0, stockMaximo: 0, comentarios: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const numericFields = ['unidadesPorEnvase', 'costoDivisa', 'costoBase', 'precioPublico', 'precioMayorista', 'descuentoMaximo', 'stockMinimo', 'stockMaximo'];
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : 
                    numericFields.includes(name) ? parseFloat(value) || 0 : value
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
        try {
            await api.post("/articulos", formData);
            alert("✅ Artículo registrado correctamente.");
            onPageChange("GESTION_STOCK");
        } catch (err) {
            console.error("Error al guardar:", err.response?.data);
            alert("❌ Error al guardar: " + (err.response?.data?.message || "Revise los campos numéricos y Enums."));
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
                            <h2 className="asiento-title">Alta de Nuevo Artículo</h2>
                        </div>
                    </div>

                    <div className="asiento-body form-body" style={{ overflowY: 'auto' }}>
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
                            <div className="input-row three-columns">
                                <label className="header-field">Costo Divisa:
                                    <input type="number" className="input-base" name="costoDivisa" value={formData.costoDivisa} onChange={handleChange} />
                                </label>
                                <label className="header-field">Costo Base:
                                    <input type="number" className="input-base" name="costoBase" value={formData.costoBase} onChange={handleChange} />
                                </label>
                                <label className="header-field">IVA Compra:
                                    <select className="input-base" name="modalidadIvaCompra" value={formData.modalidadIvaCompra} onChange={handleChange}>
                                        {IVA_MODALITIES.map(m => (
                                            <option key={m.value} value={m.value}>{m.label}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <h3 className="partidas-title" style={{ marginTop: '20px' }}>Precios de Venta</h3>
                            <div className="input-row three-columns">
                                <label className="header-field">P. Público:
                                    <input type="number" className="input-base" name="precioPublico" value={formData.precioPublico} onChange={handleChange} />
                                </label>
                                <label className="header-field">P. Mayorista:
                                    <input type="number" className="input-base" name="precioMayorista" value={formData.precioMayorista} onChange={handleChange} />
                                </label>
                                <label className="header-field">IVA Venta:
                                    <select className="input-base" name="modalidadIvaVenta" value={formData.modalidadIvaVenta} onChange={handleChange}>
                                        {IVA_MODALITIES.map(m => (
                                            <option key={m.value} value={m.value}>{m.label}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <h3 className="partidas-title" style={{ marginTop: '20px' }}>Stock y Logística</h3>
                            <div className="input-row three-columns">
                                <label className="header-field" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                                    <input type="checkbox" name="envaseSiNo" checked={formData.envaseSiNo} onChange={handleChange} />
                                    ¿Envase?
                                </label>
                                <label className="header-field">Unidades/Envase:
                                    <input type="number" className="input-base" name="unidadesPorEnvase" value={formData.unidadesPorEnvase} onChange={handleChange} disabled={!formData.envaseSiNo} />
                                </label>
                                <label className="header-field" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                                    <input type="checkbox" name="habilitado" checked={formData.habilitado} onChange={handleChange} />
                                    Habilitado
                                </label>
                            </div>
                            <div className="input-row">
                                <label className="header-field">Stock Mínimo:
                                    <input type="number" className="input-base" name="stockMinimo" value={formData.stockMinimo} onChange={handleChange} />
                                </label>
                                <label className="header-field">Stock Máximo:
                                    <input type="number" className="input-base" name="stockMaximo" value={formData.stockMaximo} onChange={handleChange} />
                                </label>
                            </div>

                            <div className="input-row">
                                <label className="header-field">Comentarios:
                                    <textarea className="input-base" name="comentarios" rows="3" value={formData.comentarios} onChange={handleChange} style={{ width: '100%', resize: 'none' }} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="asiento-footer">
                        <button className="action-button primary-button" onClick={handleGuardar} disabled={isSubmitting}>
                            <img src={LogoGrupo5} alt="save" />
                            {isSubmitting ? "Registrando..." : "Guardar Artículo"}
                        </button>
                        <button className="action-button secondary-button" onClick={() => onPageChange("GESTION_STOCK")}>
                            Volver
                        </button>
                    </div>
                </div>
            </div>

            {showSupplierModal && (
                <BuscarProveedorModal 
                    onSelect={handleSelectSupplier} 
                    onClose={() => setShowSupplierModal(false)} 
                />
            )}
        </div>
    );
}