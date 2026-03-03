import React, { useState, useEffect } from "react";
import api from "../services/api"; 
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

const CATEGORIAS_IVA = [
    { value: 'RESPONSABLE_INSCRIPTO', label: 'Responsable Inscripto' },
    { value: 'MONOTRIBUTISTA', label: 'Monotributista' },
    { value: 'EXENTO', label: 'Exento' }
];

// ====================================================================
// MODAL DE BÚSQUEDA (Misma lógica que Activar/Baja)
// ====================================================================
const BuscarProveedorModal = ({ proveedoresDisponibles, onSelect, onClose, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = (proveedoresDisponibles || []).filter(prov => 
        prov.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        prov.cuitCuil.includes(searchTerm)
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta">
                <h3 className="modal-title">Seleccionar Proveedor Activo</h3>
                <input 
                    type="text" 
                    className="input-base large-input" 
                    placeholder="Buscar por nombre o CUIT..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="cuenta-list-container">
                    {loading ? <div className="loading-state">Cargando...</div> : 
                        filtered.map(p => (
                            <div key={p.id} className="list-item clickable-item" onClick={() => onSelect(p)}>
                                <span className="item-code" style={{ minWidth: '120px' }}>{p.cuitCuil}</span>
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
export default function ModificacionProveedor({ onPageChange }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingList, setLoadingList] = useState(false);
    const [proveedoresActivos, setProveedoresActivos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [seleccionado, setSeleccionado] = useState(null);

    // Estado que mapea 1 a 1 con CreateProveedorDto
    const [formData, setFormData] = useState({
        nombre: '', direccion: '', cuitCuil: '', telefono: '', mail: '', rubro: '',
        divisa: 'ARS', saldosAFavor: 0, saldoInicialCC: 0, subcuenta: '',
        categoriaIva: 'RESPONSABLE_INSCRIPTO',
        identificadorBanco: '', pais: '', banco: '',
        producto: '', variacionPrecio: 0, precio: 0, variacionDescuento: 0, descuento: 0, comentario: ''
    });

    // 1. Cargar activos para el buscador
    useEffect(() => {
        const fetchActivos = async () => {
            setLoadingList(true);
            try {
                const res = await api.get("/proveedores/status?status=true");
                setProveedoresActivos(res.data);
            } catch (err) { console.error(err); }
            finally { setLoadingList(false); }
        };
        fetchActivos();
    }, []);

    // 2. Al seleccionar un proveedor, cargamos sus datos en el form
    const handleSelect = (p) => {
        setSeleccionado(p);
        setFormData({ ...p }); // Asumimos que el objeto 'p' ya trae los campos del DTO
        setShowModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericFields = ['saldosAFavor', 'saldoInicialCC', 'variacionPrecio', 'precio', 'variacionDescuento', 'descuento'];
        setFormData(prev => ({
            ...prev,
            [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value
        }));
    };

    const handleGuardar = async () => {
        if (!seleccionado) return;
        setIsSubmitting(true);
        try {
            // 🚨 PUT /api/proveedores/{id}
            await api.put(`/proveedores/${seleccionado.id}`, formData);
            alert("✅ Cambios guardados con éxito.");
            onPageChange("GESTION_PROVEEDORES");
        } catch (err) {
            alert("❌ Error al modificar: " + (err.response?.data || "Servidor no disponible"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column">
                    
                    {/* HEADER */}
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                            <h2 className="asiento-title">Modificar Proveedor Existente</h2>
                        </div>
                    </div>

                    {/* BUSCADOR INICIAL O FORMULARIO */}
                    <div className="asiento-body form-body" style={{ overflowY: 'auto' }}>
                        
                        {!seleccionado ? (
                            <div className="center-search-container" style={{ textAlign: 'center', marginTop: '50px' }}>
                                <h3 className="partidas-title">Seleccione un proveedor para comenzar la edición</h3>
                                <button className="action-button primary-button large-button" onClick={() => setShowModal(true)}>
                                    BUSCAR PROVEEDOR
                                </button>
                            </div>
                        ) : (
                            <div className="tab-content-grid">
                                {/* SECCIÓN GENERAL */}
                                <h3 className="partidas-title">Datos Generales (ID: {seleccionado.id})</h3>
                                <div className="input-row">
                                    <label className="header-field">Nombre / Razón Social:
                                        <input type="text" className="input-base" name="nombre" value={formData.nombre} onChange={handleChange} />
                                    </label>
                                    <label className="header-field">CUIT/CUIL:
                                        <input type="text" className="input-base" name="cuitCuil" value={formData.cuitCuil} onChange={handleChange} />
                                    </label>
                                </div>
                                <div className="input-row three-columns">
                                    <label className="header-field">Email:
                                        <input type="email" className="input-base" name="mail" value={formData.mail} onChange={handleChange} />
                                    </label>
                                    <label className="header-field">Teléfono:
                                        <input type="text" className="input-base" name="telefono" value={formData.telefono} onChange={handleChange} />
                                    </label>
                                    <label className="header-field">Rubro:
                                        <input type="text" className="input-base" name="rubro" value={formData.rubro} onChange={handleChange} />
                                    </label>
                                </div>

                                {/* SECCIÓN COMERCIAL */}
                                <h3 className="partidas-title" style={{ marginTop: '20px' }}>Comercial e Impuestos</h3>
                                <div className="input-row three-columns">
                                    <label className="header-field">Categoría IVA:
                                        <select className="input-base" name="categoriaIva" value={formData.categoriaIva} onChange={handleChange}>
                                            {CATEGORIAS_IVA.map(cat => (
                                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="header-field">Divisa:
                                        <input type="text" className="input-base" name="divisa" value={formData.divisa} onChange={handleChange} />
                                    </label>
                                    <label className="header-field">Subcuenta:
                                        <input type="text" className="input-base" name="subcuenta" value={formData.subcuenta} onChange={handleChange} />
                                    </label>
                                </div>

                                {/* SECCIÓN BANCO */}
                                <h3 className="partidas-title" style={{ marginTop: '20px' }}>Datos Bancarios</h3>
                                <div className="input-row three-columns">
                                    <label className="header-field">Banco:
                                        <input type="text" className="input-base" name="banco" value={formData.banco} onChange={handleChange} />
                                    </label>
                                    <label className="header-field">CBU:
                                        <input type="text" className="input-base" name="identificadorBanco" value={formData.identificadorBanco} onChange={handleChange} />
                                    </label>
                                    <label className="header-field">País:
                                        <input type="text" className="input-base" name="pais" value={formData.pais} onChange={handleChange} />
                                    </label>
                                </div>

                                {/* SECCIÓN ESPECÍFICAS */}
                                <h3 className="partidas-title" style={{ marginTop: '20px' }}>Productos y Comentarios</h3>
                                <div className="input-row three-columns">
                                    <label className="header-field">Producto:
                                        <input type="text" className="input-base" name="producto" value={formData.producto} onChange={handleChange} />
                                    </label>
                                    <label className="header-field">Precio:
                                        <input type="number" className="input-base" name="precio" value={formData.precio} onChange={handleChange} />
                                    </label>
                                    <label className="header-field">Descuento (%):
                                        <input type="number" className="input-base" name="descuento" value={formData.descuento} onChange={handleChange} />
                                    </label>
                                </div>
                                <div className="input-row">
                                    <label className="header-field">Comentario:
                                        <textarea className="input-base" name="comentario" rows="3" value={formData.comentario} onChange={handleChange} style={{ width: '100%', resize: 'none' }} />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="asiento-footer">
                        {seleccionado && (
                            <button className="action-button primary-button" onClick={handleGuardar} disabled={isSubmitting}>
                                <img src={LogoGrupo5} alt="save" />
                                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        )}
                        <button className="action-button secondary-button" onClick={() => onPageChange("GESTION_PROVEEDORES")}>
                            {seleccionado ? "Cancelar" : "Volver"}
                        </button>
                    </div>

                </div>
            </div>

            {showModal && (
                <BuscarProveedorModal 
                    proveedoresDisponibles={proveedoresActivos} 
                    loading={loadingList} 
                    onSelect={handleSelect} 
                    onClose={() => setShowModal(false)} 
                />
            )}
        </div>
    );
}