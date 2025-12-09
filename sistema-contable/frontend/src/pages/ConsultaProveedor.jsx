import React, { useState, useEffect } from "react";
import api from "../services/api"; 
import "../styles/Menu.css"; 
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Tabs.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// ====================================================================
// CONSTANTES Y DTO MOCKUP (Necesarias para simular el DTO completo)
// ====================================================================

const TABS = [
    { key: 'GENERALES', label: 'Generales' },
    { key: 'COMERCIAL', label: 'Comercial' },
    { key: 'BANCO', label: 'Banco' },
    { key: 'ESPECIFICAS', label: 'Específicas' },
    { key: 'COMENTARIO', label: 'Comentario' }
];

const CATEGORIAS_IVA = ['Responsable Inscripto', 'Responsable no Inscripto', 'Exento', 'Importador / Exportador', 'Responsable Monotributista'];
const TIPOS_RESPONSABLE = ['Responsable Inscripto Tipo A', 'Responsable Inscripto Con CBU', 'Responsable Inscripto Tipo M'];


// DTO de Mockup (usado solo si initialData no es un DTO completo)
const EMPTY_PROVEEDOR_DATA = {
    // Generales
    codigoProveedor: 'N/A', nombre: 'Proveedor No Seleccionado', direccion: '', codigoCiudad: '',
    inscripcionMunicipal: '', provincia: '', cuitCuil: '', pais: '',
    codigoPostal: '', telefono1: '', telefono2: '', fax: '',
    email: '', personaContacto: '', transportista: '',
    codigoIdentificatorio: '', ingresosBrutos: '',
    // Comercial (Valores por defecto para evitar errores)
    divisa: '', formaPago: '', descuentoDefecto: '', diaPago: '',
    totalSaldosFavor: '', saldoInicialCC: '', subcuenta: '',
    subcuentaSaldoFavor: '', categoriaIVA: CATEGORIAS_IVA[0], 
    inscriptoImpuestosInternos: false, agentePercepcionIVA: false,
    porcentajePercepcion: '', porcentajeDescuentoProntoPago: '', porcentajeIVAFletes: '',
    tipoResponsable: TIPOS_RESPONSABLE[0],
    // Dinámicos
    bancoData: [], especificasData: [], comentarios: '',
};


// ====================================================================
// COMPONENTES DE FORMULARIO (MODO READ-ONLY)
// ====================================================================

// Nota: Todos los inputs deben llevar 'disabled' y no necesitan 'onChange'

// --- Generales (Inmutables: Codigo Proveedor, Provincia) ---
const FormularioGeneralesConsulta = ({ data }) => {
    return (
        <div className="tab-content-grid">
            <h3 className="partidas-title">Datos Generales (Consulta)</h3>
            
            <div className="input-row">
                <label className="header-field">Código Proveedor: 
                    <input type="text" className="input-base" value={data.codigoProveedor} disabled /> 
                </label>
                <label className="header-field">Nombre: 
                    <input type="text" className="input-base" value={data.nombre} disabled />
                </label>
            </div>
            
            {/* ... Resto de campos con disabled ... */}
            <div className="input-row three-columns">
                <label className="header-field">País: 
                    <input type="text" className="input-base" value={data.pais} disabled />
                </label>
                <label className="header-field">Provincia (Número): 
                    <input type="number" className="input-base" value={data.provincia} disabled /> 
                </label>
                <label className="header-field">Código Postal: 
                    <input type="text" className="input-base" value={data.codigoPostal} disabled />
                </label>
            </div>
            {/* Se asume que el resto de FormularioGenerales se adapta de forma similar */}
        </div>
    );
};

// --- Comercial (Inmutables: Codigo Proveedor, Total Saldos a Favor) ---
const FormularioComercialConsulta = ({ data, nombreProveedor }) => {
    return (
        <div className="tab-content-grid">
            <h3 className="partidas-title">Datos Comerciales y Fiscales (Consulta)</h3>

            {/* Fila 1: Código Proveedor (Disabled) y Nombre Proveedor (Display) */}
            <div className="input-row">
                <label className="header-field">Código Proveedor: 
                    <input type="text" className="input-base" value={data.codigoProveedor} disabled />
                </label>
                <label className="header-field">Proveedor: 
                    <p className="input-display">{nombreProveedor}</p>
                </label>
            </div>
            
            {/* Fila 4: Saldos a Favor (Disabled) y Saldo Inicial CC */}
            <div className="input-row">
                <label className="header-field">Total Saldos a Favor: 
                    <input type="number" step="0.01" className="input-base" value={data.totalSaldosFavor} disabled /> 
                </label>
                <label className="header-field">Saldo Inicial Cuenta Corriente: 
                    <input type="number" step="0.01" className="input-base" value={data.saldoInicialCC} disabled />
                </label>
            </div>
            {/* Se asume que el resto de FormularioComercial se adapta de forma similar */}
        </div>
    );
};

// --- Banco (Tabla en modo read-only) ---
const FormularioBancoConsulta = ({ data, codigoProveedor, nombreProveedor }) => {
    const bancoData = data.bancoData || [];
    
    return (
        <div className="tab-content-grid fixed-bank-layout"> 
            <h3 className="partidas-title">Cuentas Bancarias (Consulta)</h3>
            <div className="input-row bank-header-ref bank-ref-display">
                <div className="header-field bank-ref-item"><label>Código Proveedor:</label><p className="input-display">{codigoProveedor}</p></div>
                <div className="header-field bank-ref-item"><label>Nombre Proveedor:</label><p className="input-display">{nombreProveedor}</p></div>
            </div>
            
            <div className="tabla-banco-visor">
                <div className="table-wrapper tabla-wrapper-expandida">
                    <table className="bancos-table">
                        <thead><tr><th style={{ width: '20%' }}>Identificador</th><th style={{ width: '20%' }}>País</th><th style={{ width: '60%' }}>Banco / Cuenta</th></tr></thead>
                        <tbody>
                            {bancoData.length > 0 ? (
                                bancoData.map((item, index) => (<tr key={item.id}><td>{item.identificador}</td><td>{item.pais}</td><td>{item.banco}</td></tr>))
                            ) : (
                                <tr><td colSpan="3" style={{ textAlign: 'center' }}>No hay cuentas bancarias registradas.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- Específicas (Tabla en modo read-only) ---
const FormularioEspecificasConsulta = ({ data, codigoProveedor, nombreProveedor }) => {
    const especificasData = data.especificasData || [];
    
    return (
        <div className="tab-content-grid fixed-bank-layout"> 
            <h3 className="partidas-title">Especificaciones de Producto/Familia (Consulta)</h3>
            <div className="input-row bank-header-ref bank-ref-display">
                <div className="header-field bank-ref-item"><label>Código Proveedor:</label><p className="input-display">{codigoProveedor}</p></div>
                <div className="header-field bank-ref-item"><label>Nombre Proveedor:</label><p className="input-display">{nombreProveedor}</p></div>
            </div>
            
            <div className="tabla-banco-visor">
                <div className="table-wrapper tabla-wrapper-expandida">
                    <table className="bancos-table">
                        <thead><tr><th style={{ width: '10%' }}>Código</th><th style={{ width: '30%' }}>Producto/Familia</th><th style={{ width: '10%' }}>B</th><th style={{ width: '10%' }}>VP</th><th style={{ width: '10%' }}>Precio</th><th style={{ width: '10%' }}>VD</th><th style={{ width: '10%' }}>D</th></tr></thead>
                        <tbody>
                            {especificasData.length > 0 ? (
                                especificasData.map((item, index) => (<tr key={item.id}><td>{item.codigo}</td><td>{item.productoFamilia}</td><td>{item.b}</td><td>{item.vp}</td><td>{item.precio}</td><td>{item.vd}</td><td>{item.d}</td></tr>))
                            ) : (
                                <tr><td colSpan="7" style={{ textAlign: 'center' }}>No hay especificaciones registradas.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- Comentario (Textarea disabled) ---
const FormularioComentarioConsulta = ({ data, codigoProveedor, nombreProveedor }) => {
    return (
        <div className="tab-content-grid fixed-comment-layout"> 
            <h3 className="partidas-title">Notas y Comentarios Internos (Consulta)</h3>
            <div className="input-row bank-header-ref bank-ref-display full-width-input-row"> 
                <div className="header-field bank-ref-item"><label>Código Proveedor:</label><p className="input-display">{codigoProveedor}</p></div>
                <div className="header-field bank-ref-item"><label>Nombre Proveedor:</label><p className="input-display">{nombreProveedor}</p></div>
            </div>
            
            <label className="header-field comentario-label comentario-area-final-layout"> 
                Comentarios Adicionales:
                <textarea
                    className="input-base large-textarea final-full-height-textarea"
                    value={data.comentarios} 
                    disabled // <--- Deshabilitado
                    placeholder="No hay comentarios."
                />
            </label>
        </div>
    );
};


// ====================================================================
// COMPONENTE PRINCIPAL: ConsultaProveedor
// ====================================================================

export default function ConsultaProveedor({ onPageChange, initialData }) {
    
    // 🚨 CLAVE: Inicializa el estado con los datos pasados o con el mock vacío
    const [proveedorData, setProveedorData] = useState(initialData || EMPTY_PROVEEDOR_DATA); 
    const [activeTab, setActiveTab] = useState(TABS[0].key);

    // 1. Manejar carga completa del DTO si initialData solo trae un identificador (en el futuro)
    useEffect(() => {
        if (initialData && initialData.codigoProveedor && !initialData.nombre) {
            // Lógica futura: Llamar a la API para obtener el DTO completo
            // setProveedorData(api.get(`/proveedores/${initialData.codigoProveedor}`))
            // Por ahora, usamos el DTO de initialData
        }
    }, [initialData]);


    const handleVolver = () => {
        // Vuelve a la lista de proveedores
        if (onPageChange) {
            onPageChange("VER_PROVEEDORES"); 
        }
    };

    const renderTabContent = () => {
        // Obtenemos los props necesarios para la consulta
        const commonProps = {
            data: proveedorData,
            codigoProveedor: proveedorData.codigoProveedor,
            nombreProveedor: proveedorData.nombre,
        };

        switch (activeTab) {
            case 'GENERALES':
                return <FormularioGeneralesConsulta {...commonProps} />;
            case 'COMERCIAL':
                return <FormularioComercialConsulta {...commonProps} />;
            case 'BANCO':
                return <FormularioBancoConsulta {...commonProps} />;
            case 'ESPECIFICAS':
                return <FormularioEspecificasConsulta {...commonProps} />;
            case 'COMENTARIO':
                return <FormularioComentarioConsulta {...commonProps} />;
            default:
                return <div>Pestaña {activeTab} en modo consulta.</div>;
        }
    };

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    {/* HEADER con TABS */}
                    <div className="asiento-header tab-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo Empresa" className="logo-small" />
                            <h2 className="asiento-title">Consulta Proveedor: {proveedorData.nombre}</h2>
                        </div>
                        
                        {/* Solapas de Navegación */}
                        <div className="tabs-container">
                            {TABS.map(tab => (
                                <button
                                    key={tab.key}
                                    className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* BODY: Contenido de la Solapa Activa */}
                    <div className="asiento-body gestion-body form-body scrollable-tab-content"> 
                        {renderTabContent()}
                    </div>

                    {/* FOOTER (SOLO BOTÓN VOLVER) */}
                    <div className="asiento-footer single-button-footer">
                        <button 
                            className="action-button icon-with-text back-button-footer"
                            onClick={handleVolver} 
                        >
                            <img src={LogoGrupo5} alt="Icono Volver" className="icon-small" /> 
                            Volver a Lista
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}