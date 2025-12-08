import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/Modal.css"; // Estilos para el Modal
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// URL base de la API (debería ser importado desde api.js)
const API_URL = "http://localhost:8080/api";
const CREATOR_ID_DUMMY = 1; // ID del usuario que crea el asiento (ejemplo)


// =========================================================
// 1. Componente Modal de Selección de Cuenta
// =========================================================
const CuentaModal = ({ cuentasDisponibles, onSelect, onClose, loading, initialSearch }) => {
    // Permite que la búsqueda se inicie con el texto que estaba en el input
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');

    const filteredCuentas = (cuentasDisponibles || []).filter(cuenta => {
        const codigo = cuenta.codigoJerarquico || ''; 
        const nombre = cuenta.nombreCuenta || '';
        return codigo.includes(searchTerm) || nombre.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta">
                <h3 className="modal-title">Seleccionar Cuenta Contable</h3>
                
                {/* Campo de búsqueda */}
                <input 
                    type="text" 
                    className="input-base large-input" 
                    placeholder="Buscar por código o nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading}
                />

                {/* Lista de Resultados */}
                <div className="cuenta-list-container">
                    {loading ? (
                        <div className="loading-state">Cargando Plan de Cuentas...</div>
                    ) : (
                        filteredCuentas.length > 0 ? (
                            filteredCuentas.map((cuenta) => (
                                <div 
                                    key={cuenta.id} 
                                    className="list-item"
                                    onClick={() => onSelect(cuenta)}
                                >
                                    <span className="item-name">{cuenta.nombreCuenta}</span>
                                </div>
                            ))
                        ) : (
                            <div className="list-item no-results">No se encontraron cuentas que coincidan.</div>
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

// =========================================================
// 2. Componente Principal RegistrarAsiento
// =========================================================
export default function RegistrarAsiento({ onPageChange }) {
    
    const [cuentas, setCuentas] = useState([]); 
    const [loadingCuentas, setLoadingCuentas] = useState(true);
    const [error, setError] = useState(null);

    const [asientoHeader, setAsientoHeader] = useState({
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0],
    });

    const [partidas, setPartidas] = useState([
        { cuentaId: null, cuentaDisplay: 'Seleccionar...', debe: '', haber: '' }
    ]);
    
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null); 
    const [initialSearchTerm, setInitialSearchTerm] = useState(''); 

    const totalDebe = partidas.reduce((sum, p) => sum + (parseFloat(p.debe) || 0), 0);
    const totalHaber = partidas.reduce((sum, p) => sum + (parseFloat(p.haber) || 0), 0);

    // ---------------------------------------------------------
    // Lógica de Carga de Cuentas (useEffect)
    // ---------------------------------------------------------
    useEffect(() => {
        const fetchCuentasHoja = async () => {
            try {
                // Usar api.get("/cuentas") si api.js está configurado
                const response = await axios.get(`${API_URL}/cuentas`); 
                const cuentasHoja = response.data.filter(c => c.esHoja); 
                setCuentas(cuentasHoja);
            } catch (err) {
                setError("No se pudo cargar el Plan de Cuentas. Verifique la conexión al backend.");
            } finally {
                setLoadingCuentas(false);
            }
        };

        fetchCuentasHoja();
    }, []);

    // ---------------------------------------------------------
    // Lógica de Manejo de Partidas y API
    // ---------------------------------------------------------
    const agregarFila = () => {
        setPartidas([...partidas, { cuentaId: null, cuentaDisplay: 'Seleccionar...', debe: '', haber: '' }]);
    };

    const handleInputChange = (index, field, value) => {
        const nuevasPartidas = [...partidas];
        
        if (field === 'debe' || field === 'haber') {
            const numValue = value === '' ? '' : Math.max(0, parseFloat(value) || 0);
            nuevasPartidas[index][field] = numValue;
            
            // Lógica de autocompletado (solo permite Debe o Haber)
            if (field === 'debe' && numValue > 0) {
                nuevasPartidas[index]['haber'] = '';
            } else if (field === 'haber' && numValue > 0) {
                nuevasPartidas[index]['debe'] = '';
            }
        } else {
             // Manejo de inputs del Header
            if (field === 'fecha') {
                setAsientoHeader({...asientoHeader, fecha: value});
            } else if (field === 'descripcion') {
                 setAsientoHeader({...asientoHeader, descripcion: value});
            }
        }
        
        setPartidas(nuevasPartidas);
    };
    
    const handleGuardarAsiento = async () => {
        // 1. Validaciones Preliminares (sin cambios)
        if (!asientoHeader.descripcion || !asientoHeader.fecha) {
            alert("Debe completar la descripción y la fecha del asiento.");
            return;
        }
        
        const today = new Date().toISOString().split('T')[0];
        if (asientoHeader.fecha > today) {
            alert("Error: No se puede registrar un asiento con una fecha futura.");
            return;
        }

        const detallesValidos = partidas.filter(p => p.cuentaId !== null && (p.debe > 0 || p.haber > 0));

        if (detallesValidos.length < 2) {
            alert("El asiento debe tener al menos dos partidas válidas (Cuenta, Debe o Haber con valor > 0).");
            return;
        }

        if (Math.abs(totalDebe - totalHaber) > 0.01) { 
            alert(`Error de Partida Doble: Debe (${totalDebe.toFixed(2)}) ≠ Haber (${totalHaber.toFixed(2)}).`);
            return;
        }

        // 2. Preparar el DTO y Llamada a la API (sin cambios)
        const createAsientoDto = {
            descripcion: asientoHeader.descripcion,
            fecha: asientoHeader.fecha, 
            creador: CREATOR_ID_DUMMY, 
            detalles: detallesValidos.map(p => ({
                debe: p.debe || 0.0,
                haber: p.haber || 0.0,
                cuenta: p.cuentaId 
            }))
        };

        try {
            const response = await axios.post(`${API_URL}/asientos/create`, createAsientoDto);
            
            alert(`Asiento N° ${response.data.id} registrado con éxito.`);
            
            // Limpiar el formulario
            setAsientoHeader({
                descripcion: '',
                fecha: new Date().toISOString().split('T')[0],
            });
            setPartidas([{ cuentaId: null, cuentaDisplay: 'Seleccionar...', debe: '', haber: '' }]);
            
        } catch (err) {
            const errorMessage = err.response && err.response.data 
                                ? err.response.data.replace("Error al crear el asiento: ", "") 
                                : "Error desconocido al registrar el asiento.";
            
            alert(`Fallo en el registro:\n${errorMessage}`);
        }
    };
    
    // ---------------------------------------------------------
    // Lógica del Modal
    // ---------------------------------------------------------
    const handleOpenModal = (index) => {
        setEditingIndex(index);
        setInitialSearchTerm(partidas[index].cuentaDisplay === 'Seleccionar...' ? '' : partidas[index].cuentaDisplay);
        setShowAccountModal(true);
    };

    const handleAccountSelect = (cuenta) => {
        const codigo = cuenta.codigoJerarquico;
        const nombre = cuenta.nombreCuenta;
        
        // 🚨 FIX LÓGICO: Construimos el display name para el input
        // Si hay código, mostramos "Código - Nombre", si no, solo el nombre.
        const fullAccountName = codigo ? `${codigo} - ${nombre}` : nombre;
        
        if (editingIndex !== null) {
            const nuevasPartidas = [...partidas];
            nuevasPartidas[editingIndex]['cuentaId'] = cuenta.id;
            nuevasPartidas[editingIndex]['cuentaDisplay'] = fullAccountName;
            setPartidas(nuevasPartidas);
        }
        
        setShowAccountModal(false);
        setEditingIndex(null);
        setInitialSearchTerm('');
    };
    
    const handleVolver = () => {
        if (onPageChange) {
            onPageChange("DASHBOARD"); 
        }
    };

    if (loadingCuentas) {
        return <div className="loading-state">Cargando Plan de Cuentas...</div>;
    }
    
    if (error) {
        return <div className="error-state">{error}</div>;
    }


    // ---------------------------------------------------------
    // RENDERIZADO FINAL
    // ---------------------------------------------------------
    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    {/* HEADER */}
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo Empresa" className="logo-small" />
                            <h2 className="asiento-title">Registro de Nuevo Asiento Contable</h2>
                        </div>
                        
                        <div className="header-fields-wrapper">
                            <label className="header-field">Descripción: 
                                <input 
                                    type="text" 
                                    className="input-base description-input" 
                                    placeholder="Descripción del asiento..." 
                                    value={asientoHeader.descripcion}
                                    onChange={(e) => handleInputChange(null, 'descripcion', e.target.value)}
                                    required
                                />
                            </label>
                            <label className="header-field">Fecha: 
                                <input 
                                    type="date" 
                                    className="input-base date-input" 
                                    value={asientoHeader.fecha}
                                    onChange={(e) => handleInputChange(null, 'fecha', e.target.value)}
                                    max={new Date().toISOString().split('T')[0]} 
                                    required
                                />
                            </label>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="asiento-body">
                        <h3 className="partidas-title">Partidas del Asiento</h3>
                        <div className="table-container-wrapper">
                            <table className="partidas-table">
                                <thead>
                                    <tr>
                                        <th className="th-cuenta">Cuenta</th>
                                        <th className="th-monto">Debe</th>
                                        <th className="th-monto">Haber</th>
                                    </tr>
                                </thead>
                                <tbody> 
                                    {partidas.map((partida, index) => (
                                        <tr className="partida-row" key={index}>
                                            <td 
                                                // 🚨 CLAVE: El click en la celda abre el modal
                                                onClick={() => handleOpenModal(index)}
                                                className="cuenta-select-cell"
                                            >
                                                {/* Reemplazamos el input por un DIV/SPAN que muestra el valor */}
                                                <div className="cuenta-display-value">
                                                    {partida.cuentaDisplay}
                                                </div>
                                            </td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    className="table-input monto-input" 
                                                    placeholder="0.00"
                                                    value={partida.debe}
                                                    onChange={(e) => handleInputChange(index, 'debe', e.target.value)}
                                                    min="0"
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    className="table-input monto-input" 
                                                    placeholder="0.00"
                                                    value={partida.haber}
                                                    onChange={(e) => handleInputChange(index, 'haber', e.target.value)}
                                                    min="0"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="total-row">
                                        <td className="total-label">Total:</td>
                                        <td className="total-monto debe-total">
                                            {totalDebe.toFixed(2)}
                                            {Math.abs(totalDebe - totalHaber) > 0.01 && <span className="warning-badge">⚠️</span>}
                                        </td>
                                        <td className="total-monto haber-total">
                                            {totalHaber.toFixed(2)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="asiento-footer">
                        <button 
                            className="action-button icon-with-text save-button"
                            onClick={handleGuardarAsiento} 
                        >
                            <img src={LogoGrupo5} alt="Icono Guardar" className="icon-small" /> 
                            Guardar
                        </button>
                        
                        <button 
                            className="action-button icon-with-text add-button"
                            onClick={agregarFila}
                        >
                            <img src={LogoGrupo5} alt="Icono Agregar" className="icon-small" /> 
                            Agregar Fila
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
            
            {/* 🚨 MODAL DE SELECCIÓN DE CUENTA */}
            {showAccountModal && (
                <CuentaModal 
                    cuentasDisponibles={cuentas}
                    loading={loadingCuentas}
                    onSelect={handleAccountSelect}
                    onClose={() => setShowAccountModal(false)}
                    initialSearch={initialSearchTerm}
                />
            )}
        </div>
    );
}