import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

const DIVISAS = ['ARS', 'USD'];

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
        modalidadIvaCompra: 'GENERAL',
        modalidadIvaVenta: 'GENERAL',
        idProveedorHabitual: null,
        costoDivisa: 0, costoBase: 0, divisa: 'ARS',
        precioPublico: 0, precioMayorista: 0, descuentoMaximo: 0,
        listaPrecios: '', 
        stockFisico: 0, 
        stockMinimo: 0, 
        stockMaximo: 1
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const numericFields = ['unidadesPorEnvase', 'costoDivisa', 'costoBase', 'precioPublico', 'precioMayorista', 'descuentoMaximo', 'stockFisico', 'stockMinimo', 'stockMaximo'];
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : 
                    numericFields.includes(name) ? (value === "" ? 0 : parseFloat(value)) : value
        }));
    };

    const handleSelectSupplier = (p) => {
        setFormData(prev => ({ ...prev, idProveedorHabitual: p.id }));
        setNombreProveedorSel(p.nombre);
        setShowSupplierModal(false);
    };

    const handleGuardar = async () => {
        // Validaciones de campos obligatorios
        if (!formData.referencia || !formData.descripcion) {
            alert("Referencia y Descripción son campos obligatorios.");
            return;
        }

        // Validación de lógica de Stock (Mínimo >= 0, Máximo > Mínimo)
        if (formData.stockMinimo < 0 || formData.stockFisico < 0 || formData.stockMaximo < 0) {
            alert("Los valores de stock no pueden ser negativos.");
            return;
        }

        if (formData.stockMaximo <= formData.stockMinimo) {
            alert("El Stock Máximo debe ser mayor que el Stock Mínimo.");
            return;
        }

        setIsSubmitting(true);
        const finalData = { ...formData };

        try {
            await api.post("/articulos", finalData);
            alert("✅ Artículo registrado correctamente.");
            onPageChange("GESTION_STOCK");
        } catch (err) {
            console.error("Error al guardar:", err.response?.data);
            alert("❌ Error al guardar.");
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

                            <h3 className="partidas-title" style={{ marginTop: '20px' }}>Precios y Stock</h3>
                            <div className="input-row three-columns">
                                <label className="header-field">Stock Mínimo:
                                    <input type="number" className="input-base no-spinners" name="stockMinimo" value={formData.stockMinimo} onChange={handleChange} min="0" />
                                </label>
                                <label className="header-field">Stock Actual:
                                    <input type="number" className="input-base no-spinners" name="stockFisico" value={formData.stockFisico} onChange={handleChange} min="0" />
                                </label>
                                <label className="header-field">Stock Máximo:
                                    <input type="number" className="input-base no-spinners" name="stockMaximo" value={formData.stockMaximo} onChange={handleChange} min="0" />
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