import React, { useState, useEffect } from "react";
import api from "../services/api"; 
import "../styles/Menu.css"; 
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Tabs.css"; 
import "../styles/Modal.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// ====================================================================
// CONSTANTES Y DTO MOCKUP
// ====================================================================

// Definición de las solapas
const TABS = [
    { key: 'GENERALES', label: 'Generales' },
    { key: 'COMERCIAL', label: 'Comercial' },
    { key: 'BANCO', label: 'Banco' },
    { key: 'ESPECIFICAS', label: 'Específicas' },
    { key: 'COMENTARIO', label: 'Comentario' }
];

const CATEGORIAS_IVA = ['Responsable Inscripto', 'Responsable no Inscripto', 'Exento', 'Importador / Exportador', 'Responsable Monotributista'];
const TIPOS_RESPONSABLE = ['Responsable Inscripto Tipo A', 'Responsable Inscripto Con CBU', 'Responsable Inscripto Tipo M'];

// DTO de inicialización completo (necesario para el mapeo)
const EMPTY_PROVEEDOR_DATA = {
    id: null, codigoProveedor: '', nombre: '', activado: true,
    cuitCuil: '', direccion: '', codigoPostal: '', codigoCiudad: '', provincia: '', pais: '', 
    telefono1: '', telefono2: '', fax: '', email: '', personaContacto: '', transportista: '', 
    codigoIdentificatorio: '', inscripcionMunicipal: '', ingresosBrutos: '',
    divisa: '', formaPago: '', descuentoDefecto: 0.0, diaPago: null, totalSaldosFavor: 0.0, 
    saldoInicialCC: 0.0, subcuenta: '', subctaSaldoFavor: '', categoriaIVA: CATEGORIAS_IVA[0], 
    inscriptoImpuestosInternos: false, agentePercepcionIVA: false, porcentajePercepcion: 0.0, 
    porcentajeDescuentoProntoPago: 0.0, porcentajeIVAFletes: 0.0, tipoResponsable: TIPOS_RESPONSABLE[0], 
    bancoData: [], especificasData: [], comentarios: '',
};

// MOCK para la lista de búsqueda
const MOCK_PROVEEDOR_LISTA = {
    id: 101, codigoProveedor: 'P001', nombre: 'Distribuidora Luka', razonSocial: 'Distribuidora Luka',
};

// ====================================================================
// MODAL DE SELECCIÓN DE PROVEEDOR
// ====================================================================

const ProveedorModal = ({ proveedoresDisponibles, onSelect, onClose, loading, initialSearch }) => {
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');

    const filteredProveedores = (proveedoresDisponibles || []).filter(prov => {
        
        // 🚨 SOLUCIÓN: Convertir código y nombre a String ANTES de usar .includes()
        const codigo = String(prov.codigoProveedor) || ''; 
        const nombre = String(prov.nombre) || '';
        
        // Convertimos el término de búsqueda a minúsculas
        const lowerSearchTerm = searchTerm.toLowerCase();

        // Aplicamos la búsqueda usando toLowerCase() para el nombre
        return codigo.toLowerCase().includes(lowerSearchTerm) || 
               nombre.toLowerCase().includes(lowerSearchTerm);
    });

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta">
                <h3 className="modal-title">Seleccionar Proveedor a Modificar</h3>
                
                <input 
                    type="text" 
                    className="input-base large-input" 
                    placeholder="Buscar por código o nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading}
                />

                <div className="cuenta-list-container">
                    {loading ? (
                        <div className="loading-state">Cargando Proveedores...</div>
                    ) : (
                        filteredProveedores.length > 0 ? (
                            filteredProveedores.map((prov) => (
                                <div 
                                    key={prov.codigoProveedor} 
                                    className="list-item clickable-item" 
                                    onClick={() => onSelect(prov)}
                                >
                                    <span className="item-code">
                                        {prov.codigoProveedor ? `${prov.codigoProveedor} -` : ''}
                                    </span>
                                    <span className="item-name">{prov.nombre}</span>
                                </div>
                            ))
                        ) : (
                            <div className="list-item no-results">No se encontraron proveedores.</div>
                        )
                    )}
                </div>

                <div className="modal-actions">
                    <button 
                        className="action-button secondary-button" 
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

const FormularioGenerales = ({ data, onChange }) => {
    return (
        <div className="tab-content-grid">
            <h3 className="partidas-title">Datos Generales</h3>
            
            <div className="input-row">
                <label className="header-field">Código Proveedor: 
                    <input type="text" className="input-base" name="codigoProveedor" value={data.codigoProveedor} disabled /> {/* <-- INMUTABLE */}
                </label>
                <label className="header-field">Nombre: 
                    <input type="text" className="input-base" name="nombre" value={data.nombre} onChange={onChange} required />
                </label>
            </div>
            
            <div className="input-row">
                <label className="header-field">Dirección: 
                    <input type="text" className="input-base" name="direccion" value={data.direccion} onChange={onChange} />
                </label>
                <label className="header-field">Cuit/Cuil: 
                    <input type="text" className="input-base" name="cuitCuil" value={data.cuitCuil} onChange={onChange} />
                </label>
            </div>

            <div className="input-row three-columns">
                <label className="header-field">Teléfono 1: 
                    <input type="text" className="input-base" name="telefono1" value={data.telefono1} onChange={onChange} />
                </label>
                <label className="header-field">Teléfono 2: 
                    <input type="text" className="input-base" name="telefono2" value={data.telefono2} onChange={onChange} />
                </label>
                <label className="header-field">Fax: 
                    <input type="text" className="input-base" name="fax" value={data.fax} onChange={onChange} />
                </label>
            </div>
            
            <div className="input-row three-columns">
                <label className="header-field">País: 
                    <input type="text" className="input-base" name="pais" value={data.pais} onChange={onChange} />
                </label>
                <label className="header-field">Provincia (Número): 
                    <input type="number" className="input-base" name="provincia" value={data.provincia} disabled /> {/* <-- INMUTABLE */}
                </label>
                <label className="header-field">Código Postal: 
                    <input type="text" className="input-base" name="codigoPostal" value={data.codigoPostal} onChange={onChange} />
                </label>
            </div>
            
            <div className="input-row">
                 <label className="header-field">Email: 
                    <input type="email" className="input-base" name="email" value={data.email} onChange={onChange} />
                </label>
                <label className="header-field">Persona de Contacto: 
                    <input type="text" className="input-base" name="personaContacto" value={data.personaContacto} onChange={onChange} />
                </label>
            </div>
            
            <div className="input-row three-columns">
                 <label className="header-field">Código Ciudad: 
                    <input type="text" className="input-base" name="codigoCiudad" value={data.codigoCiudad} onChange={onChange} />
                </label>
                <label className="header-field">Inscripción Municipal: 
                    <input type="text" className="input-base" name="inscripcionMunicipal" value={data.inscripcionMunicipal} onChange={onChange} />
                </label>
                <label className="header-field">Ingresos Brutos: 
                    <input type="text" className="input-base" name="ingresosBrutos" value={data.ingresosBrutos} onChange={onChange} />
                </label>
            </div>

            <div className="input-row">
                 <label className="header-field">Transportista: 
                    <input type="text" className="input-base" name="transportista" value={data.transportista} onChange={onChange} />
                </label>
                 <label className="header-field">Código Identificatorio: 
                    <input type="text" className="input-base" name="codigoIdentificatorio" value={data.codigoIdentificatorio} onChange={onChange} />
                </label>
            </div>
        </div>
    );
};


const FormularioComercial = ({ data, onChange, nombreProveedor }) => {
    
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        onChange({ target: { name, value: checked } }); 
    };

    return (
        <div className="tab-content-grid">
            <h3 className="partidas-title">Datos Comerciales y Fiscales</h3>

            {/* Fila 1: Código Proveedor (Inmutable) y Nombre Proveedor (Display) */}
            <div className="input-row">
                <label className="header-field">Código Proveedor: 
                    <input type="text" className="input-base" name="codigoProveedor" value={data.codigoProveedor} disabled /> {/* <-- INMUTABLE */}
                </label>
                <label className="header-field">Proveedor: 
                    <p className="input-display">{nombreProveedor || '[Sin Nombre]'}</p>
                </label>
            </div>
            
            {/* Fila 2: Divisa y Forma de Pago (Alineados de a 2) */}
            <div className="input-row">
                <label className="header-field">Divisa: 
                    <input type="text" className="input-base" name="divisa" value={data.divisa} onChange={onChange} />
                </label>
                <label className="header-field">Forma de Pago: 
                    <input type="text" className="input-base" name="formaPago" value={data.formaPago} onChange={onChange} />
                </label>
            </div>

            {/* Fila 3: Descuento Defecto y Día de Pago (Alineados de a 2) */}
            <div className="input-row">
                <label className="header-field">Descuento por Defecto: 
                    <input type="number" step="0.01" className="input-base" name="descuentoDefecto" value={data.descuentoDefecto} onChange={onChange} />
                </label>
                <label className="header-field">Día de Pago: 
                    <input type="number" min="1" max="31" className="input-base" name="diaPago" value={data.diaPago} onChange={onChange} />
                </label>
            </div>

            {/* Fila 4: Saldos a Favor (Inmutable) y Saldo Inicial CC */}
            <div className="input-row">
                <label className="header-field">Total Saldos a Favor: 
                    <input type="number" step="0.01" className="input-base" name="totalSaldosFavor" value={data.totalSaldosFavor} disabled /> {/* <-- INMUTABLE */}
                </label>
                <label className="header-field">Saldo Inicial Cuenta Corriente: 
                    <input type="number" step="0.01" className="input-base" name="saldoInicialCC" value={data.saldoInicialCC} onChange={onChange} />
                </label>
            </div>

            {/* Fila 5: Subcuenta y Subcuenta Saldo a Favor (Alineados de a 2) */}
            <div className="input-row">
                <label className="header-field">Subcuenta: 
                    <input type="text" className="input-base" name="subcuenta" value={data.subcuenta} onChange={onChange} />
                </label>
                <label className="header-field">Subcuenta Saldo a Favor: 
                    <input type="text" className="input-base" name="subcuentaSaldoFavor" value={data.subcuentaSaldoFavor} onChange={onChange} />
                </label>
            </div>

            {/* Fila 6: Categoría IVA (Grupo de Radio buttons - Ocupa el 90%) */}
            <div className="input-row full-width-sections">
                <div className="radio-group-container">
                    <h4 className="group-title">Categoría frente al IVA</h4>
                    {CATEGORIAS_IVA.map(cat => (
                        <label key={cat} className="radio-label">
                            <input 
                                type="radio" 
                                name="categoriaIVA" 
                                value={cat} 
                                checked={data.categoriaIVA === cat} 
                                onChange={onChange} 
                            />
                            {cat}
                        </label>
                    ))}
                </div>
            </div>

            {/* Fila 7: Estado Impositivo Adicional (Checkboxes - Ocupa el 90%) */}
            <div className="input-row full-width-sections">
                <div className="checkbox-group-container">
                    <h4 className="group-title">Estado Impositivo Adicional</h4>
                    <label className="checkbox-label">
                        <input 
                            type="checkbox" 
                            name="inscriptoImpuestosInternos" 
                            checked={data.inscriptoImpuestosInternos} 
                            onChange={handleCheckboxChange} 
                        />
                        Inscripto a impuestos internos
                    </label>
                    <label className="checkbox-label">
                        <input 
                            type="checkbox" 
                            name="agentePercepcionIVA" 
                            checked={data.agentePercepcionIVA} 
                            onChange={handleCheckboxChange} 
                        />
                        Agente de percepción de IVA
                    </label>
                </div>
            </div>


            {/* Fila 8: Porcentajes (Tres columnas) */}
            <div className="input-row three-columns">
                <label className="header-field">% de Percepción: 
                    <input type="number" step="0.01" className="input-base" name="porcentajePercepcion" value={data.porcentajePercepcion} onChange={onChange} />
                </label>
                <label className="header-field">% Descuento Pronto Pago: 
                    <input type="number" step="0.01" className="input-base" name="porcentajeDescuentoPronto Pago" value={data.porcentajeDescuentoProntoPago} onChange={onChange} />
                </label>
                <label className="header-field">% IVA Fletes: 
                    <input type="number" step="0.01" className="input-base" name="porcentajeIVAFletes" value={data.porcentajeIVAFletes} onChange={onChange} />
                </label>
            </div>
            
            {/* Fila 9: Tipo de Responsable (Grupo de Radio buttons - Ocupa el 90%) */}
            <div className="input-row full-width-sections">
                <div className="radio-group-container">
                    <h4 className="group-title">Tipo</h4>
                    {TIPOS_RESPONSABLE.map(tipo => (
                        <label key={tipo} className="radio-label">
                            <input 
                                type="radio" 
                                name="tipoResponsable" 
                                value={tipo} 
                                checked={data.tipoResponsable === tipo} 
                                onChange={onChange} 
                            />
                            {tipo}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

const TIPOS_CUENTA = ['Cuenta Corriente', 'Caja de Ahorro', 'Cuenta de Inversión', 'Otro'];

const FormularioBanco = ({ data, onChange, codigoProveedor, nombreProveedor }) => {
    
    // NOTA: En Modificación, bancoData se inicializa desde data.bancoData
    const [bancoData, setBancoData] = useState(data.bancoData || []);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [nuevaFila, setNuevaFila] = useState({ identificador: '', pais: '', banco: '' });

    // Lógica de manipulación de datos (Mockup funcional)
    const generateId = () => bancoData.length > 0 ? Math.max(...bancoData.map(b => b.id)) + 1 : 1;
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevaFila(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAgregar = () => { /* ... Mockup ... */ };
    const handleModificar = () => { alert("Guardar Modificación (Mockup)"); };
    const handleCargarEdicion = (index) => { alert("Cargar Edición (Mockup)"); };
    const handleEliminar = (id) => { alert(`Eliminar ID ${id} (Mockup)`); };

    return (
        <div className="tab-content-grid fixed-bank-layout"> 
            <h3 className="partidas-title">Cuentas Bancarias</h3>

            {/* 1. SECCIÓN SUPERIOR (REFERENCIA) */}
            <div className="input-row bank-header-ref bank-ref-display">
                <div className="header-field bank-ref-item">
                    <label>Código Proveedor:</label>
                    {/* Código Proveedor es INMUTABLE */}
                    <p className="input-display">{codigoProveedor || 'N/A'}</p> 
                </div>
                <div className="header-field bank-ref-item">
                    <label>Nombre Proveedor:</label>
                    <p className="input-display">{nombreProveedor || '[Sin Nombre]'}</p>
                </div>
            </div>
            
            {/* 2. SECCIÓN MEDIA (TABLA PRINCIPAL) */}
            <div className="tabla-banco-visor">
                <div className="table-wrapper tabla-wrapper-expandida">
                    <table className="bancos-table">
                        <thead>
                            <tr>
                                <th style={{ width: '20%' }}>Identificador</th>
                                <th style={{ width: '20%' }}>País</th>
                                <th style={{ width: '60%' }}>Banco / Cuenta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bancoData.map((item, index) => (
                                <tr key={item.id} className={editingIndex === index ? 'editing-row' : ''}>
                                    <td>{item.identificador}</td>
                                    <td>{item.pais}</td>
                                    <td>{item.banco}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* 3. SECCIÓN INFERIOR (CONTROLES) */}
            <div className="controles-banco-footer">
                
                {/* Formulario de Entrada / Edición (Mantiene estructura de 3 columnas) */}
                <div className="input-row three-columns" style={{ width: '100%', margin: 0 }}> 
                    <label className="header-field">Identificador: 
                        <input type="text" className="input-base" name="identificador" value={nuevaFila.identificador} onChange={handleInputChange} placeholder="Ej: CBU Principal"/>
                    </label>
                    <label className="header-field">País: 
                        <input type="text" className="input-base" name="pais" value={nuevaFila.pais} onChange={handleInputChange} placeholder="Ej: ARG"/>
                    </label>
                    <label className="header-field">Banco / Cuenta: 
                        <input type="text" className="input-base" name="banco" value={nuevaFila.banco} onChange={handleInputChange} placeholder="Ej: Banco Nación, CBU o Nro. Cuenta"/>
                    </label>
                </div>

                <div className="controles-acciones-banco">
                    
                    {isEditing ? (
                        <button type="button" className="action-button wide-button primary-button" onClick={handleModificar}>
                            GUARDAR MODIFICACIÓN
                        </button>
                    ) : (
                        <button type="button" className="action-button wide-button primary-button" onClick={handleAgregar}>
                            AGREGAR FILA
                        </button>
                    )}
                    
                    <button type="button" className="action-button wide-button secondary-button" onClick={() => handleCargarEdicion(0)} disabled={bancoData.length === 0}>
                        MODIFICAR SELECCIONADA
                    </button>
                    
                    <button type="button" className="action-button wide-button danger-button" onClick={() => handleEliminar(1)} disabled={bancoData.length === 0}>
                        ELIMINAR FILA
                    </button>
                </div>
            </div>
        </div>
    );
};

const FormularioEspecificas = ({ data, onChange, codigoProveedor, nombreProveedor }) => {
    
    // NOTA: En Modificación, especificasData se inicializa desde data.especificasData
    const [especificasData, setEspecificasData] = useState(data.especificasData || []);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [nuevaFila, setNuevaFila] = useState({ 
        codigo: '', 
        productoFamilia: '', 
        b: '', 
        vp: '', 
        precio: '', 
        vd: '', 
        d: '' 
    });

    // Lógica de manipulación de datos (Mockup funcional)
    const generateId = () => especificasData.length > 0 ? Math.max(...especificasData.map(b => b.id)) + 1 : 1;
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevaFila(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAgregar = () => { alert("Agregar fila (Mockup)"); };
    const handleModificar = () => { alert("Guardar Modificación (Mockup)"); };
    const handleCargarEdicion = (index) => { alert("Cargar Edición (Mockup)"); };
    const handleEliminar = (id) => { alert(`Eliminar ID ${id} (Mockup)`); };

    return (
        <div className="tab-content-grid fixed-bank-layout"> 
            <h3 className="partidas-title">Especificaciones de Producto/Familia</h3>

            {/* 1. SECCIÓN SUPERIOR (REFERENCIA) */}
            <div className="input-row bank-header-ref bank-ref-display">
                <div className="header-field bank-ref-item">
                    <label>Código Proveedor:</label>
                    {/* El código de proveedor es inmutable */}
                    <p className="input-display">{codigoProveedor || 'N/A'}</p> 
                </div>
                <div className="header-field bank-ref-item">
                    <label>Nombre Proveedor:</label>
                    <p className="input-display">{nombreProveedor || '[Sin Nombre]'}</p>
                </div>
            </div>
            
            {/* 2. SECCIÓN MEDIA (TABLA PRINCIPAL) */}
            <div className="tabla-banco-visor">
                <div className="table-wrapper tabla-wrapper-expandida">
                    <table className="bancos-table">
                        <thead>
                            <tr>
                                <th style={{ width: '10%' }}>Código</th>
                                <th style={{ width: '30%' }}>Producto/Familia</th>
                                <th style={{ width: '10%' }}>B</th>
                                <th style={{ width: '10%' }}>VP</th>
                                <th style={{ width: '10%' }}>Precio</th>
                                <th style={{ width: '10%' }}>VD</th>
                                <th style={{ width: '10%' }}>D</th>
                            </tr>
                        </thead>
                        <tbody>
                            {especificasData.map((item, index) => (
                                <tr key={item.id} className={editingIndex === index ? 'editing-row' : ''}>
                                    <td>{item.codigo}</td>
                                    <td>{item.productoFamilia}</td>
                                    <td>{item.b}</td>
                                    <td>{item.vp}</td>
                                    <td>{item.precio}</td>
                                    <td>{item.vd}</td>
                                    <td>{item.d}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* 3. SECCIÓN INFERIOR (CONTROLES DE EDICIÓN Y BOTONES) */}
            <div className="controles-banco-footer">
                
                {/* Formulario de Entrada (7 campos) */}
                <div className="input-row seven-columns"> 
                    <label className="header-field" style={{ flex: '2 1 0%' }}>Producto/Familia: 
                        <input type="text" className="input-base" name="productoFamilia" value={nuevaFila.productoFamilia} onChange={handleInputChange} placeholder="Nombre o Descripción" required />
                    </label>
                    <label className="header-field" style={{ flex: '1 1 0%' }}>Código: 
                        <input type="text" className="input-base" name="codigo" value={nuevaFila.codigo} onChange={handleInputChange} placeholder="Cód." required />
                    </label>
                    <label className="header-field">B: 
                        <input type="text" className="input-base" name="b" value={nuevaFila.b} onChange={handleInputChange} />
                    </label>
                    <label className="header-field">VP: 
                        <input type="text" className="input-base" name="vp" value={nuevaFila.vp} onChange={handleInputChange} />
                    </label>
                    <label className="header-field">Precio: 
                        <input type="number" step="0.01" className="input-base" name="precio" value={nuevaFila.precio} onChange={onChange} />
                    </label>
                    <label className="header-field">VD: 
                        <input type="text" className="input-base" name="vd" value={nuevaFila.vd} onChange={onChange} />
                    </label>
                    <label className="header-field">D: 
                        <input type="text" className="input-base" name="d" value={nuevaFila.d} onChange={onChange} />
                    </label>
                </div>

                <div className="controles-acciones-banco">
                    
                    {isEditing ? (
                        <button type="button" className="action-button wide-button primary-button" onClick={handleModificar}>
                            GUARDAR MODIFICACIÓN
                        </button>
                    ) : (
                        <button type="button" className="action-button wide-button primary-button" onClick={handleAgregar}>
                            AGREGAR FILA
                        </button>
                    )}
                    
                    <button type="button" className="action-button wide-button secondary-button" onClick={() => handleCargarEdicion(0)} disabled={especificasData.length === 0}>
                        MODIFICAR SELECCIONADA
                    </button>
                    
                    <button type="button" className="action-button wide-button danger-button" onClick={() => handleEliminar(1)} disabled={especificasData.length === 0}>
                        ELIMINAR FILA
                    </button>
                </div>
            </div>
        </div>
    );
};

const FormularioComentario = ({ data, onChange, codigoProveedor, nombreProveedor }) => {

    return (
        <div className="tab-content-grid fixed-comment-layout"> 
            <h3 className="partidas-title">Notas y Comentarios Internos</h3>

            {/* 1. SECCIÓN REFERENCIA (10% - Alto fijo) */}
            <div className="input-row bank-header-ref bank-ref-display full-width-input-row" style={{ height: '50px', margin: '0 20px', flexShrink: 0 }}> 
                <div className="header-field bank-ref-item">
                    <label>Código Proveedor:</label>
                    <p className="input-display">{codigoProveedor || 'N/A'}</p>
                </div>
                <div className="header-field bank-ref-item">
                    <label>Nombre Proveedor:</label>
                    <p className="input-display">{nombreProveedor || '[Sin Nombre]'}</p>
                </div>
            </div>
            
            {/* 2. SECCIÓN TEXTAREA (90% - Debe crecer) */}
            <label className="header-field comentario-label comentario-area-final-layout"> 
                Comentarios Adicionales:
                <textarea
                    className="input-base large-textarea final-full-height-textarea"
                    name="comentarios" 
                    value={data.comentarios} 
                    onChange={onChange}
                    placeholder="Ingrese notas, acuerdos especiales o cualquier comentario relevante sobre el proveedor."
                />
            </label>
        </div>
    );
};


// ====================================================================
// COMPONENTE PRINCIPAL: ModificacionProveedor
// ====================================================================

export default function ModificacionProveedor({ onPageChange }) {
    const [activeTab, setActiveTab] = useState(TABS[0].key);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
    const [proveedorData, setProveedorData] = useState(null); 
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [loadingProveedores, setLoadingProveedores] = useState(true); // Inicialmente cargando la lista
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [proveedoresDisponibles, setProveedoresDisponibles] = useState([]);

    // 🚨 FUNCIÓN 1: Cargar la lista de proveedores para el modal (GET Listar)
    const fetchProveedoresDisponibles = async () => {
        setLoadingProveedores(true);
        try {
            const response = await api.get("/suppliers/actives?page=1&limit=999"); 
            
            // --- CRÍTICO: Acceder a 'content' de la respuesta paginada ---
            const list = response.data.content.map(p => ({
                // El listado devuelve 'id' (Long) y 'name'
                id: p.id, 
                codigoProveedor: p.code || p.id, // Asumimos que "code" o "codigoProveedor" es "id" o no existe
                nombre: p.name 
            }));
            setProveedoresDisponibles(list);
        } catch (err) {
            console.error("Error al cargar la lista:", err);
            // Si falla la API, cargamos un mock que coincida con el formato esperado
            setProveedoresDisponibles([
                { id: 101, codigoProveedor: 'M001', nombre: 'Mock Proveedor' }
            ]); 
        } finally {
            setLoadingProveedores(false);
        }
    };

    useEffect(() => {
        fetchProveedoresDisponibles();
    }, []);


    // 🚨 FUNCIÓN 2: Manejo de la Selección (Cargar DTO completo por ID - GET Detalle)
    const handleProveedorSelect = async (provMin) => {
        if (!provMin.id) return;
        
        setLoadingProveedores(true);
        setShowSelectionModal(false); // Ocultamos el modal de búsqueda

        try {
            // Nuevo endpoint: GET /api/suppliers/{idSupplier}
            const response = await api.get(`/suppliers/${provMin.id}`); 
            const fullDto = response.data; // Recibimos el DTO simplificado (7 campos)
            
            // Mapeo Inverso: DTO Simple (Backend) -> Estado React (Frontend 30+ campos)
            const mappedData = {
                // 1. Usamos el DTO vacío como base para no perder los campos de formulario
                ...EMPTY_PROVEEDOR_DATA, 
                
                // 2. Preservamos los datos mínimos del listado (incluyendo el código)
                codigoProveedor: provMin.codigoProveedor, // CRÍTICO: Preservar el código del listado
                
                // 3. Mapeo explícito de los 7 campos devueltos por el detalle
                id: fullDto.id, 
                nombre: fullDto.name || '', // Mapeo: name -> nombre
                direccion: fullDto.address || '',
                email: fullDto.email || '',
                telefono1: fullDto.phone || '', // Mapeo: phone -> telefono1
                
                // Los demás campos (CUIT, IVA, Descuentos) se quedan con los valores de EMPTY_PROVEEDOR_DATA.
            };

            setProveedorSeleccionado(mappedData);
            setProveedorData(mappedData); 

        } catch (err) {
            console.error("Error al cargar el detalle (GET /suppliers/{id}):", err);
            alert(`Error al cargar el detalle: ${err.response?.data || 'Proveedor no encontrado.'}`);
            setProveedorSeleccionado(null); // Reseteamos si falló
        } finally {
            setLoadingProveedores(false);
        }
    };

    // 3. Manejo genérico de cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProveedorData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleVolver = () => {
        if (onPageChange) {
            onPageChange("GESTION_PROVEEDORES"); 
        }
    };
    
    // 🚨 FUNCIÓN 3: Guardar Modificación (POST /api/suppliers/edit-supplier)
    const handleGuardarModificacion = async () => {
        if (!proveedorData || !proveedorData.id) {
            alert("Error: Proveedor no seleccionado o ID faltante.");
            return;
        }
        
        // El backend espera SupplierEditRequestDTO: { idSupplier, newName, newAddress, newPhone, newEmail, ... }
        // Nota: Solo usaremos los campos que el controlador mapea explícitamente (name, address, phone, email)
        const payload = {
            idSupplier: proveedorData.id,
            newName: proveedorData.nombre, 
            newAddress: proveedorData.direccion,
            newPhone: proveedorData.telefono1, // Usamos telefono1
            newEmail: proveedorData.email,
            
            // CRÍTICO: Los otros 25+ campos no se enviarán porque el EditRequestDTO y Controller NO los manejan.
        };

        setIsSubmitting(true);

        try {
            // Nuevo endpoint: POST /api/suppliers/edit-supplier
            const response = await api.post(`/suppliers/edit-supplier`, payload); 
            
            if (response.status === 200) {
                alert(`✅ Proveedor '${proveedorData.nombre}' actualizado correctamente.`);
                onPageChange("GESTION_PROVEEDORES");
            }
        } catch (err) {
            console.error("Error al modificar proveedor:", err.response || err);
            const msg = err.response?.data || 'Error desconocido. Verifique la unicidad de los campos.';
            alert(`❌ Fallo en la Modificación: ${msg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Función para renderizar el contenido de la pestaña activa
    const renderTabContent = () => {
        if (!proveedorData) return null;

        const commonProps = {
            data: proveedorData,
            onChange: handleInputChange,
            codigoProveedor: proveedorData.codigoProveedor,
            nombreProveedor: proveedorData.nombre,
        };
        
        switch (activeTab) {
            case 'GENERALES':
                return <FormularioGenerales {...commonProps} />;
            case 'COMERCIAL':
                return <FormularioComercial {...commonProps} />;
            case 'BANCO':
                return <FormularioBanco {...commonProps} />;
            case 'ESPECIFICAS':
                return <FormularioEspecificas {...commonProps} />;
            case 'COMENTARIO':
                return <FormularioComentario {...commonProps} />;
            default:
                return null;
        }
    };


    // 4. Renderizado principal
    if (!proveedorSeleccionado) {
        // Muestra la interfaz de Búsqueda si no hay proveedor cargado
        return (
            <div className="page-container">
                <div className="main-content">
                    <div className="asiento-layout-column"> 
                        <div className="asiento-header">
                            <h2 className="asiento-title">Modificación de Proveedor</h2>
                        </div>
                        <div className="asiento-body gestion-body form-body center-search">
                            <h3 className="partidas-title">Seleccione un proveedor para modificar</h3>
                            <button
                                type="button" 
                                className="action-button primary-button large-button"
                                onClick={() => setShowSelectionModal(true)}
                                disabled={loadingProveedores}
                            >
                                Buscar Proveedor
                            </button>
                        </div>
                        <div className="asiento-footer single-button-footer">
                            <button className="action-button icon-with-text back-button-footer" onClick={handleVolver}>
                                <img src={LogoGrupo5} alt="Icono Volver" className="icon-small" /> 
                                Volver
                            </button>
                        </div>
                    </div>
                </div>
                {showSelectionModal && (
                    <ProveedorModal
                        proveedoresDisponibles={proveedoresDisponibles}
                        loading={loadingProveedores}
                        onSelect={handleProveedorSelect}
                        onClose={() => setShowSelectionModal(false)}
                    />
                )}
            </div>
        );
    }


    // Renderizado del formulario de Modificación (Proveedor Seleccionado)
    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    {/* HEADER con TABS */}
                    <div className="asiento-header tab-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo Empresa" className="logo-small" />
                            <h2 className="asiento-title">Modificación Proveedor: {proveedorSeleccionado.nombre}</h2>
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

                    {/* FOOTER */}
                    <div className="asiento-footer">
                        <button 
                            className="action-button icon-with-text primary-button"
                            onClick={handleGuardarModificacion} // Llama a la función de envío
                            disabled={isSubmitting}
                        >
                            <img src={LogoGrupo5} alt="Icono Guardar" className="icon-small" /> 
                            {isSubmitting ? 'Guardando...' : 'Guardar Modificación'}
                        </button>
                        <button 
                            className="action-button icon-with-text back-button-footer"
                            onClick={handleVolver} 
                        >
                            <img src={LogoGrupo5} alt="Icono Volver" className="icon-small" /> 
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}