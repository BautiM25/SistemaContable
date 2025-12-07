import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; // Asegúrate de que este archivo contenga el CSS para scrolling
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// URL base de la API
const API_URL = "http://localhost:8080/api";

// Nuevo Componente para el Input con Dropdown
const CuentaInput = ({ value, onChange, index, cuentasDisponibles }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);

    // Filtra las cuentas basado en el texto de búsqueda
    const filteredCuentas = (cuentasDisponibles || []).filter(cuenta => {
        const codigo = cuenta.codigoJerarquico || ''; 
        const nombre = cuenta.nombreCuenta || '';

        return codigo.includes(searchTerm) || nombre.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setSearchTerm(newValue);
        onChange(index, 'cuentaDisplay', newValue);
        setIsDropdownOpen(true);
    };

    const handleSelectCuenta = (cuenta) => {
        const codigo = cuenta.codigoJerarquico || '';
        const nombre = cuenta.nombreCuenta || '';
        
        let fullAccountName;
        if (codigo && nombre) {
            fullAccountName = `${codigo} - ${nombre}`;
        } else {
            fullAccountName = codigo || nombre || ''; 
        }
        
        setSearchTerm(fullAccountName);
        onChange(index, 'cuentaId', cuenta.id);
        onChange(index, 'cuentaDisplay', fullAccountName);
        
        setIsDropdownOpen(false);
    };
    
    // Cierra el menú cuando pierde el foco (con un pequeño retraso)
    const handleBlur = () => {
        // Usar un retraso de 200ms permite que el evento onMouseDown del ítem se dispare antes de que el dropdown se oculte.
        setTimeout(() => setIsDropdownOpen(false), 200); 
    };
    
    // Previene que el evento onBlur se dispare antes del onMouseDown del elemento
    const handleMouseDownItem = (cuenta) => {
        handleSelectCuenta(cuenta);
    };


    return (
        <div className="cuenta-input-wrapper" onBlur={handleBlur}>
            <input
                type="text"
                className="table-input cuenta-input"
                placeholder="Buscar cuenta..."
                value={searchTerm}
                onChange={handleInputChange}
                onClick={() => setIsDropdownOpen(true)}
                onFocus={() => setIsDropdownOpen(true)}
            />

            {isDropdownOpen && (
                <div className="cuenta-dropdown"> 
                    {filteredCuentas.length > 0 ? (
                        filteredCuentas.map((cuenta) => (
                            <div 
                                key={cuenta.id} 
                                className="dropdown-item"
                                // 🚨 FIX: Usamos onMouseDown en lugar de onClick para que se dispare antes del onBlur del wrapper.
                                onMouseDown={() => handleMouseDownItem(cuenta)} 
                            >
                                <span className="item-code">{cuenta.codigoJerarquico}</span>
                                <span className="item-name">{cuenta.nombreCuenta}</span>
                            </div>
                        ))
                    ) : (
                        <div className="dropdown-item no-results">No se encontraron cuentas</div>
                    )}
                </div>
            )}
        </div>
    );
};


// Componente principal
export default function RegistrarAsiento({ onPageChange }) {
    const CREATOR_ID_DUMMY = 1; 

    const [cuentas, setCuentas] = useState([]); 
    const [loadingCuentas, setLoadingCuentas] = useState(true);
    const [error, setError] = useState(null);

    const [asientoHeader, setAsientoHeader] = useState({
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0], // Fecha por defecto: hoy
    });

    const [partidas, setPartidas] = useState([
        { cuentaId: null, cuentaDisplay: '', debe: '', haber: '' }
    ]);

    const totalDebe = partidas.reduce((sum, p) => sum + (parseFloat(p.debe) || 0), 0);
    const totalHaber = partidas.reduce((sum, p) => sum + (parseFloat(p.haber) || 0), 0);


    useEffect(() => {
        const fetchCuentasHoja = async () => {
            try {
                const response = await axios.get(`${API_URL}/cuentas`); 
                const cuentasHoja = response.data.filter(c => c.esHoja); 
                setCuentas(cuentasHoja);
            } catch (err) {
                console.error("Error al cargar las cuentas:", err);
                setError("No se pudo cargar el Plan de Cuentas. Verifique la conexión al backend.");
            } finally {
                setLoadingCuentas(false);
            }
        };

        fetchCuentasHoja();
    }, []);

    const agregarFila = () => {
        setPartidas([...partidas, { cuentaId: null, cuentaDisplay: '', debe: '', haber: '' }]);
    };

    const handleInputChange = (index, field, value) => {
        const nuevasPartidas = [...partidas];
        
        if (field === 'debe' || field === 'haber') {
            // Aseguramos que el valor no sea negativo, aunque el min="0" de HTML lo maneja visualmente
            const numValue = value === '' ? '' : Math.max(0, parseFloat(value) || 0);
            nuevasPartidas[index][field] = numValue;
            
            if (field === 'debe' && numValue > 0) {
                nuevasPartidas[index]['haber'] = '';
            } else if (field === 'haber' && numValue > 0) {
                nuevasPartidas[index]['debe'] = '';
            }
        } else if (field === 'fecha') {
            setAsientoHeader({...asientoHeader, fecha: value});
            return;
        } else {
            nuevasPartidas[index][field] = value;
        }
        
        setPartidas(nuevasPartidas);
    };
    
    // 💾 FUNCIÓN CLAVE: Guardar Asiento
    const handleGuardarAsiento = async () => {
        // 1. Validaciones Preliminares del Frontend
        if (!asientoHeader.descripcion || !asientoHeader.fecha) {
            alert("Debe completar la descripción y la fecha del asiento.");
            return;
        }
        
        // 🚨 NUEVA VALIDACIÓN: Fecha no posterior a la actual
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

        // 2. Verificar Partida Doble
        if (Math.abs(totalDebe - totalHaber) > 0.01) { 
            alert(`Error de Partida Doble: Debe (${totalDebe.toFixed(2)}) ≠ Haber (${totalHaber.toFixed(2)}).`);
            return;
        }

        // 3. Preparar el DTO para el Backend
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
        
        console.log("DTO a enviar:", createAsientoDto); 

        // 4. Llamada a la API
        try {
            const response = await axios.post(`${API_URL}/asientos/create`, createAsientoDto);
            
            alert(`Asiento N° ${response.data.id} registrado con éxito.`);
            
            // Limpiar el formulario
            setAsientoHeader({
                descripcion: '',
                fecha: new Date().toISOString().split('T')[0],
            });
            setPartidas([{ cuentaId: null, cuentaDisplay: '', debe: '', haber: '' }]);
            
        } catch (err) {
            const errorMessage = err.response && err.response.data 
                                ? err.response.data.replace("Error al crear el asiento: ", "") 
                                : "Error desconocido al registrar el asiento.";
            
            alert(`Fallo en el registro:\n${errorMessage}`);
        }
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
                                    onChange={(e) => setAsientoHeader({...asientoHeader, descripcion: e.target.value})}
                                    required
                                />
                            </label>
                            <label className="header-field">Fecha: 
                                <input 
                                    type="date" 
                                    className="input-base date-input" 
                                    value={asientoHeader.fecha}
                                    onChange={(e) => setAsientoHeader({...asientoHeader, fecha: e.target.value})}
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
                                {/* 🚨 El scrolling se aplica al TBODY */}
                                <tbody> 
                                    {partidas.map((partida, index) => (
                                        <tr className="partida-row" key={index}>
                                            <td>
                                                <CuentaInput 
                                                    value={partida.cuentaDisplay} 
                                                    onChange={handleInputChange}
                                                    index={index}
                                                    cuentasDisponibles={cuentas}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    className="table-input monto-input" 
                                                    placeholder="0.00"
                                                    value={partida.debe}
                                                    onChange={(e) => handleInputChange(index, 'debe', e.target.value)}
                                                    min="0" // 🚨 FIX: Impide números negativos
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    className="table-input monto-input" 
                                                    placeholder="0.00"
                                                    value={partida.haber}
                                                    onChange={(e) => handleInputChange(index, 'haber', e.target.value)}
                                                    min="0" // 🚨 FIX: Impide números negativos
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
                        </div> {/* Fin de table-container-wrapper */}
                    </div>

                    {/* FOOTER */}
                    <div className="asiento-footer">
                        <button 
                            className="action-button icon-with-text add-button"
                            onClick={agregarFila}
                        >
                            <img src={LogoGrupo5} alt="Icono Agregar" className="icon-small" /> 
                            Agregar Fila
                        </button>
                        <button 
                            className="action-button icon-with-text save-button"
                            onClick={handleGuardarAsiento} 
                        >
                            <img src={LogoGrupo5} alt="Icono Guardar" className="icon-small" /> 
                            Guardar
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