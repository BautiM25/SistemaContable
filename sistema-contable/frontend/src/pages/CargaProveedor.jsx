import React, { useState } from "react";
import api from "../services/api";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// Opciones para el Enum de CategoriaIva (Asegúrate que coincidan con tu Enum en Java)
const CATEGORIAS_IVA = [
    { value: 'RESPONSABLE_INSCRIPTO', label: 'Responsable Inscripto' },
    { value: 'MONOTRIBUTISTA', label: 'Monotributista' },
    { value: 'EXENTO', label: 'Exento' },
    { value: 'CONSUMIDOR_FINAL', label: 'Consumidor Final' }
];

export default function CargaProveedor({ onPageChange }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Estado inicial basado exactamente en el CreateProveedorDto
    const [formData, setFormData] = useState({
        nombre: '', direccion: '', cuitCuil: '', telefono: '', mail: '', rubro: '',
        divisa: 'ARS', saldosAFavor: 0, saldoInicialCC: 0, subcuenta: '',
        categoriaIva: 'RESPONSABLE_INSCRIPTO',
        identificadorBanco: '', pais: '', banco: '',
        producto: '', variacionPrecio: 0, precio: 0, variacionDescuento: 0, descuento: 0, comentario: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Manejo de números para campos BigDecimal/Double
        const numericFields = ['saldosAFavor', 'saldoInicialCC', 'variacionPrecio', 'precio', 'variacionDescuento', 'descuento'];
        setFormData(prev => ({
            ...prev,
            [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value
        }));
    };

    const handleGuardar = async () => {
        if (!formData.nombre || !formData.cuitCuil) {
            alert("Nombre y CUIT son campos obligatorios.");
            return;
        }

        setIsSubmitting(true);
        try {
            // URL según tu Controller: @PostMapping en /api/proveedores
            await api.post("/proveedores", formData);
            alert("✅ Proveedor creado con éxito.");
            onPageChange("GESTION_PROVEEDORES");
        } catch (err) {
            console.error(err);
            alert("❌ Error al guardar: " + (err.response?.data || "Servidor no disponible"));
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
                            <h2 className="asiento-title">Alta de Proveedor (Sistema ElectroAndes)</h2>
                        </div>
                    </div>

                    {/* FORMULARIO ÚNICO CON SCROLL */}
                    <div className="asiento-body form-body scrollable-tab-content" style={{ overflowY: 'auto' }}>
                        
                        <div className="tab-content-grid">
                            {/* --- SECCIÓN GENERAL --- */}
                            <h3 className="partidas-title">Datos Generales</h3>
                            <div className="input-row">
                                <label className="header-field">Nombre / Razón Social:
                                    <input type="text" className="input-base" name="nombre" value={formData.nombre} onChange={handleChange} />
                                </label>
                                <label className="header-field">CUIT/CUIL:
                                    <input type="text" className="input-base" name="cuitCuil" value={formData.cuitCuil} onChange={handleChange} placeholder="30-XXXXXXXX-X" />
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
                            <div className="input-row">
                                <label className="header-field">Dirección Completa:
                                    <input type="text" className="input-base" name="direccion" value={formData.direccion} onChange={handleChange} />
                                </label>
                            </div>

                            {/* --- SECCIÓN COMERCIAL --- */}
                            <h3 className="partidas-title" style={{ marginTop: '20px' }}>Configuración Comercial</h3>
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
                                <label className="header-field">Subcuenta Contable:
                                    <input type="text" className="input-base" name="subcuenta" value={formData.subcuenta} onChange={handleChange} />
                                </label>
                            </div>
                            <div className="input-row">
                                <label className="header-field">Saldo Inicial CC:
                                    <input type="number" className="input-base" name="saldoInicialCC" value={formData.saldoInicialCC} onChange={handleChange} />
                                </label>
                                <label className="header-field">Saldos a Favor:
                                    <input type="number" className="input-base" name="saldosAFavor" value={formData.saldosAFavor} onChange={handleChange} />
                                </label>
                            </div>

                            {/* --- SECCIÓN BANCO --- */}
                            <h3 className="partidas-title" style={{ marginTop: '20px' }}>Datos Bancarios</h3>
                            <div className="input-row three-columns">
                                <label className="header-field">Banco:
                                    <input type="text" className="input-base" name="banco" value={formData.banco} onChange={handleChange} />
                                </label>
                                <label className="header-field">CBU/Identificador:
                                    <input type="text" className="input-base" name="identificadorBanco" value={formData.identificadorBanco} onChange={handleChange} />
                                </label>
                                <label className="header-field">País:
                                    <input type="text" className="input-base" name="pais" value={formData.pais} onChange={handleChange} />
                                </label>
                            </div>

                            {/* --- SECCIÓN PRODUCTOS / COMENTARIOS --- */}
                            <h3 className="partidas-title" style={{ marginTop: '20px' }}>Específicas y Notas</h3>
                            <div className="input-row three-columns">
                                <label className="header-field">Producto Principal:
                                    <input type="text" className="input-base" name="producto" value={formData.producto} onChange={handleChange} />
                                </label>
                                <label className="header-field">Precio Base:
                                    <input type="number" className="input-base" name="precio" value={formData.precio} onChange={handleChange} />
                                </label>
                                <label className="header-field">Descuento (%):
                                    <input type="number" className="input-base" name="descuento" value={formData.descuento} onChange={handleChange} />
                                </label>
                            </div>
                            <div className="input-row">
                                <label className="header-field">Comentarios Internos:
                                    <textarea 
                                        className="input-base" 
                                        name="comentario" 
                                        rows="3" 
                                        style={{ width: '100%', resize: 'none' }}
                                        value={formData.comentario} 
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="asiento-footer">
                        <button className="action-button primary-button" onClick={handleGuardar} disabled={isSubmitting}>
                            <img src={LogoGrupo5} alt="save" />
                            {isSubmitting ? "Guardando..." : "Registrar Proveedor"}
                        </button>
                        <button className="action-button secondary-button" onClick={() => onPageChange("GESTION_PROVEEDORES")}>
                            Volver
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}