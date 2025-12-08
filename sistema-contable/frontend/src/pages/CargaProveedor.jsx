import React, { useState } from "react";
import "../styles/Menu.css"; 
import "../styles/RegistrarAsiento.css"; // Reutilizamos layout base
import "../styles/GestionUsuarios.css"; // Reutilizamos estilos de formularios
import "../styles/Tabs.css"; // Nuevo archivo para estilos de solapas
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// Definición de las solapas
const TABS = [
    { key: 'GENERALES', label: 'Generales' },
    { key: 'COMERCIAL', label: 'Comercial' },
    { key: 'BANCO', label: 'Banco' },
    { key: 'ESPECIFICAS', label: 'Específicas' },
    { key: 'COMENTARIO', label: 'Comentario' }
];

const FormularioGenerales = ({ data, onChange }) => {
    return (
        <div className="tab-content-grid">
            <h3 className="partidas-title">Datos Generales</h3>
            
            <div className="input-row">
                <label className="header-field">Código Proveedor: 
                    <input type="text" className="input-base" name="codigoProveedor" value={data.codigoProveedor} onChange={onChange} required />
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
                    <input type="number" className="input-base" name="provincia" value={data.provincia} onChange={onChange} />
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

// Definición de las constantes (deberían estar fuera de la función principal)
const CATEGORIAS_IVA = ['Responsable Inscripto', 'Responsable no Inscripto', 'Exento', 'Importador / Exportador', 'Responsable Monotributista'];
const TIPOS_RESPONSABLE = ['Responsable Inscripto Tipo A', 'Responsable Inscripto Con CBU', 'Responsable Inscripto Tipo M'];

const FormularioComercial = ({ data, onChange, nombreProveedor }) => {

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        onChange({ target: { name, value: checked } }); 
    };

    return (
        <div className="tab-content-grid">
            <h3 className="partidas-title">Datos Comerciales y Fiscales</h3>

            {/* Fila 1: Proveedor Display (Ocupa el 90%) */}
            <div className="input-row">
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

            {/* Fila 4: Saldos a Favor y Saldo Inicial CC (Alineados de a 2) */}
            <div className="input-row">
                <label className="header-field">Total Saldos a Favor: 
                    <input type="number" step="0.01" className="input-base" name="totalSaldosFavor" value={data.totalSaldosFavor} onChange={onChange} disabled />
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
                    <input type="number" step="0.01" className="input-base" name="porcentajeDescuentoProntoPago" value={data.porcentajeDescuentoProntoPago} onChange={onChange} />
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
    
    // Estado local para gestionar las filas de la tabla de bancos
    const [bancoData, setBancoData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [nuevaFila, setNuevaFila] = useState({ identificador: '', pais: '', banco: '' });

    // Lógica de manipulación de datos (Mockup funcional - Evita errores de "unused")
    const generateId = () => bancoData.length > 0 ? Math.max(...bancoData.map(b => b.id)) + 1 : 1;
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevaFila(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAgregar = () => { 
        if (nuevaFila.identificador && nuevaFila.pais && nuevaFila.banco) {
            setBancoData(prev => [...prev, { ...nuevaFila, id: generateId() }]);
            setNuevaFila({ identificador: '', pais: '', banco: '' }); 
        } else {
            alert("Complete todos los campos para agregar.");
        }
    };
    
    const handleModificar = () => { 
        alert("Función Modificar: Implementación pendiente."); 
        setIsEditing(false);
        setEditingIndex(null);
        setNuevaFila({ identificador: '', pais: '', banco: '' });
    };
    
    const handleCargarEdicion = (index) => { 
        if (bancoData.length > 0) {
            setEditingIndex(0);
            setIsEditing(true);
            setNuevaFila(bancoData[0]); 
        }
    };
    
    const handleEliminar = (id) => { 
        if (bancoData.length > 0) {
            setBancoData(prev => prev.filter(item => item.id !== id));
            setEditingIndex(null);
            setIsEditing(false);
        }
    };
    // ----------------------------

    return (
        <div className="tab-content-grid fixed-bank-layout"> 
            <h3 className="partidas-title">Cuentas Bancarias</h3>

            {/* 1. SECCIÓN SUPERIOR (REFERENCIA) */}
            <div className="input-row bank-header-ref bank-ref-display"> {/* 🚨 CLAVE: NUEVA CLASE PARA FLEX Y PADDING */}
                
                {/* Código de Proveedor y Valor */}
                <div className="header-field bank-ref-item">
                    <label>Código Proveedor:</label>
                    <p className="input-display">{codigoProveedor || 'N/A'}</p>
                </div>
                
                {/* Nombre de Proveedor y Valor */}
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
                            {/* ... (Contenido de la tabla) ... */}
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

                {/* 🚨 CLAVE: Controles de Botones - Usamos la clase para forzar alineación horizontal */}
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
    
    // Estado local para gestionar las filas de la tabla de especificaciones
    const [especificasData, setEspecificasData] = useState([]);
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
    
    const handleAgregar = () => { 
        if (nuevaFila.codigo && nuevaFila.productoFamilia) {
            setEspecificasData(prev => [...prev, { ...nuevaFila, id: generateId() }]);
            setNuevaFila({ codigo: '', productoFamilia: '', b: '', vp: '', precio: '', vd: '', d: '' }); 
        } else {
            alert("Debe completar Código y Producto/Familia.");
        }
    };
    
    const handleModificar = () => { 
        alert("Función Modificar: Implementación pendiente."); 
        setIsEditing(false);
        setEditingIndex(null);
        setNuevaFila({ codigo: '', productoFamilia: '', b: '', vp: '', precio: '', vd: '', d: '' });
    };
    
    const handleCargarEdicion = (index) => { 
        if (especificasData.length > 0) {
            setEditingIndex(0);
            setIsEditing(true);
            setNuevaFila(especificasData[0]); 
        }
    };
    
    const handleEliminar = (id) => { 
        if (especificasData.length > 0) {
            setEspecificasData(prev => prev.filter(item => item.id !== id));
            setEditingIndex(null);
            setIsEditing(false);
        }
    };

    return (
        <div className="tab-content-grid fixed-bank-layout"> {/* Reutilizamos el layout 10/80/10 */}
            <h3 className="partidas-title">Especificaciones de Producto/Familia</h3>

            {/* 1. SECCIÓN SUPERIOR (REFERENCIA) */}
            <div className="input-row bank-header-ref bank-ref-display">
                <div className="header-field bank-ref-item">
                    <label>Código Proveedor:</label>
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
                <div className="input-row seven-columns"> {/* 🚨 NUEVA CLASE: seven-columns */}
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

                {/* Controles de Botones */}
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
            {/* Usamos el flex-grow: 1 directamente en el label para que absorba el espacio */}
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


export default function CargaProveedor({ onPageChange }) {
    // Estado para la pestaña activa
    const [activeTab, setActiveTab] = useState(TABS[0].key);
    
    const CATEGORIAS_IVA = ['Responsable Inscripto', 'Responsable no Inscripto', 'Exento', 'Importador / Exportador', 'Responsable Monotributista'];
    const TIPOS_RESPONSABLE = ['Responsable Inscripto Tipo A', 'Responsable Inscripto Con CBU', 'Responsable Inscripto Tipo M'];

    // Estado único para almacenar todos los datos del proveedor
    const [proveedorData, setProveedorData] = useState({
        // 1. Generales
        codigoProveedor: '',
        nombre: '',
        direccion: '',
        codigoCiudad: '',
        inscripcionMunicipal: '',
        provincia: '', // (número)
        cuitCuil: '',
        pais: '',
        codigoPostal: '',
        telefono1: '',
        telefono2: '',
        fax: '',
        email: '',
        personaContacto: '',
        transportista: '',
        codigoIdentificatorio: '',
        ingresosBrutos: '',
        
        // 2. Comercial
        divisa: '',
        formaPago: '',
        descuentoDefecto: '',
        diaPago: '',
        totalSaldosFavor: '',
        saldoInicialCC: '',
        subcuenta: '',
        subcuentaSaldoFavor: '',
        
        // Selectores
        categoriaIVA: CATEGORIAS_IVA[0], // Radio button: solo una opción
        inscriptoImpuestosInternos: false, // Checkbox
        agentePercepcionIVA: false, // Checkbox
        
        // Campos de texto adicionales
        porcentajePercepcion: '',
        porcentajeDescuentoProntoPago: '',
        porcentajeIVAFletes: '',
        
        // Tipo (Radio button)
        tipoResponsable: TIPOS_RESPONSABLE[0], // Radio button: solo una opción

        // 3. Banco (inicialmente vacío)
        // 4. Específicas (inicialmente vacío)
        // 5. Comentario (inicialmente vacío)
    });
    
    
    
    // Función genérica para manejar cambios en los inputs
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

    // Función para renderizar el contenido de la pestaña activa
    const renderTabContent = () => {
        switch (activeTab) {
            case 'GENERALES':
                return (
                    <FormularioGenerales 
                        data={proveedorData} 
                        onChange={handleInputChange} 
                    />
                );
            case 'COMERCIAL':
                return (
                    <FormularioComercial
                        data={proveedorData} 
                        onChange={handleInputChange}
                        nombreProveedor={proveedorData.nombre}
                    />
                );
            case 'BANCO': // 🚨 Nuevo caso para la pestaña Banco
                return (
                    <FormularioBanco 
                        data={proveedorData} 
                        onChange={handleInputChange} 
                        codigoProveedor={proveedorData.codigoProveedor} // Pasar código
                        nombreProveedor={proveedorData.nombre}         // Pasar nombre
                    />
                );
            case 'ESPECIFICAS': // 🚨 Nuevo caso para la pestaña Específicas
                return (
                    <FormularioEspecificas 
                        data={proveedorData} 
                        onChange={handleInputChange} 
                        codigoProveedor={proveedorData.codigoProveedor}
                        nombreProveedor={proveedorData.nombre}
                    />
                );
            case 'COMENTARIO': // 🚨 Nuevo caso para la pestaña Comentario
                return (
                    <FormularioComentario 
                        data={proveedorData} 
                        onChange={handleInputChange} 
                        codigoProveedor={proveedorData.codigoProveedor}
                        nombreProveedor={proveedorData.nombre}
                    />
                );
            default:
                return null;
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
                            <h2 className="asiento-title">Alta de Nuevo Proveedor</h2>
                        </div>
                        
                        {/* 🚨 Solapas de Navegación */}
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
                            onClick={() => alert('Implementar Guardar Proveedor')}
                            disabled={!proveedorData.nombre}
                        >
                            <img src={LogoGrupo5} alt="Icono Guardar" className="icon-small" /> 
                            Guardar Proveedor
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