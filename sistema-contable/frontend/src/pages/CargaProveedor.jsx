import React, { useState } from "react";
import api from "../services/api";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

const CATEGORIAS_IVA = [
    { value: 'RESPONSABLE_INSCRIPTO', label: 'Responsable Inscripto' },
    { value: 'MONOTRIBUTISTA', label: 'Monotributista' },
    { value: 'EXENTO', label: 'Exento' }
];

const DIVISAS = ['ARS', 'USD'];

export default function CargaProveedor({ onPageChange }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        nombre: '', direccion: '', cuitCuil: '', telefono: '', mail: '', rubro: '',
        divisa: 'ARS', saldosAFavor: 0, saldoInicialCC: 0, subcuenta: '',
        categoriaIva: 'RESPONSABLE_INSCRIPTO',
        identificadorBanco: '', pais: '', banco: '',
        comentario: ''  // Eliminado 'descuento'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Eliminado 'descuento' de los campos numéricos
        const numericFields = ['saldosAFavor', 'saldoInicialCC'];
        
        setFormData(prev => ({
            ...prev,
            [name]: numericFields.includes(name) ? (value === "" ? 0 : parseFloat(value)) : value
        }));
    };

    const handleGuardar = async () => {
        if (!formData.nombre || !formData.cuitCuil) {
            alert("Nombre y CUIT son campos obligatorios.");
            return;
        }

        // Eliminada la validación de descuento
        if (formData.saldoInicialCC < 0 || formData.saldosAFavor < 0) {
            alert("Los saldos deben ser mayores o iguales a 0.");
            return;
        }

        setIsSubmitting(true);
        try {
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
                    
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                            <h2 className="asiento-title">Alta de Proveedor</h2>
                        </div>
                    </div>

                    <div className="asiento-body form-body" style={{ overflowY: 'auto' }}>
                        <div className="tab-content-grid">
                            
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
                                    <select className="input-base" name="divisa" value={formData.divisa} onChange={handleChange}>
                                        {DIVISAS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </label>
                                <label className="header-field">Subcuenta Contable:
                                    <input type="text" className="input-base" name="subcuenta" value={formData.subcuenta} onChange={handleChange} />
                                </label>
                            </div>

                            <div className="input-row">
                                <label className="header-field">Saldo Inicial CC:
                                    <input type="number" className="input-base no-spinners" name="saldoInicialCC" value={formData.saldoInicialCC} onChange={handleChange} min="0" />
                                </label>
                                <label className="header-field">Saldos a Favor:
                                    <input type="number" className="input-base no-spinners" name="saldosAFavor" value={formData.saldosAFavor} onChange={handleChange} min="0" />
                                </label>
                            </div>

                            <h3 className="partidas-title" style={{ marginTop: '20px' }}>Datos Bancarios y Notas</h3>
                            <div className="input-row three-columns">
                                <label className="header-field">Banco:
                                    <input type="text" className="input-base" name="banco" value={formData.banco} onChange={handleChange} />
                                </label>
                                <label className="header-field">CBU / Identificador:
                                    <input type="text" className="input-base" name="identificadorBanco" value={formData.identificadorBanco} onChange={handleChange} />
                                </label>
                                {/* Eliminado el campo de descuento */}
                                <label className="header-field">País:
                                    <input type="text" className="input-base" name="pais" value={formData.pais} onChange={handleChange} />
                                </label>
                            </div>

                            <div className="input-row">
                                <label className="header-field">Comentarios:
                                    <textarea className="input-base" name="comentario" rows="3" value={formData.comentario} onChange={handleChange} style={{ width: '100%', resize: 'none' }} />
                                </label>
                            </div>

                        </div>
                    </div>

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