import React, { useState } from "react";
// ... (imports)
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css"; // NUEVO
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// Datos dummy de la cuenta encontrada
const cuentaDummy = {
    numero: '1.1.1',
    nombre: 'Caja y Bancos',
    padre: '1.1',
};

const ModificacionModal = ({ cuenta, onClose, onSave }) => {
    const [nombreModificado, setNombreModificado] = useState(cuenta.nombre);

    const handleSave = (e) => {
        e.preventDefault();
        onSave(nombreModificado);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">Modificar Cuenta {cuenta.numero}</h3>
                
                {/* Formulario de modificación dentro del modal */}
                <form onSubmit={handleSave} className="user-form modal-form">
                    
                    <label className="header-field">Cuenta Padre: 
                        <input 
                            type="text" 
                            className="input-base large-input" 
                            value={cuenta.padre}
                            disabled 
                        />
                    </label>
                    
                    <label className="header-field">Nuevo Nombre: 
                        <input 
                            type="text" 
                            className="input-base large-input" 
                            placeholder="Ingrese el nuevo nombre"
                            value={nombreModificado}
                            onChange={(e) => setNombreModificado(e.target.value)}
                            required
                        />
                    </label>

                    <div className="modal-actions" style={{justifyContent: 'space-between'}}>
                        <button 
                            className="action-button secondary-button" 
                            onClick={onClose}
                            type="button"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className="action-button secondary-button" 
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default function ModificacionCuentas({onPageChange}) {
    const [numCuentaBuscar, setNumCuentaBuscar] = useState('');
    const [cuentaEncontrada, setCuentaEncontrada] = useState(null); 
    const [showModal, setShowModal] = useState(false);

    // FASE 1: Búsqueda
    const handleBuscar = (e) => {
        e.preventDefault();
        
        if (numCuentaBuscar === cuentaDummy.numero) {
            setCuentaEncontrada(cuentaDummy);
            setShowModal(true); // Abre el modal de edición
        } else {
            setCuentaEncontrada(null);
            alert(`Cuenta ${numCuentaBuscar} no encontrada. Ingrese '1.1.1' para simular.`);
        }
    };

    const handleSaveModification = (nuevoNombre) => {
        alert(`Modificando cuenta ${cuentaEncontrada.numero}. Nuevo nombre: ${nuevoNombre}`);
        setShowModal(false);
        setCuentaEncontrada(null); 
        setNumCuentaBuscar('');
    };

    const handleVolver = () => {
        if (onPageChange) {
            onPageChange("GESTION_CUENTAS"); 
        }
    };

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    {/* HEADER */}
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo Empresa" className="logo-small" />
                            <h2 className="asiento-title">Modificación de Cuenta Contable</h2>
                        </div>
                    </div>

                    {/* BODY: BÚSQUEDA */}
                    <div className="asiento-body gestion-body form-body"> 
                        <h3 className="partidas-title">Busque la cuenta a modificar</h3>
                        
                        <form className="user-form search-form" onSubmit={handleBuscar}>
                            <label className="header-field search-field">Número de Cuenta: 
                                <input 
                                    type="text" 
                                    className="input-base large-input" 
                                    placeholder="Ingrese el número de cuenta (Ej: 1.1.1)"
                                    value={numCuentaBuscar}
                                    onChange={(e) => setNumCuentaBuscar(e.target.value)}
                                    required
                                />
                            </label>
                            <button 
                                type="submit"
                                className="action-button icon-with-text secondary-button search-button-action"
                            >
                                <img src={LogoGrupo5} alt="Icono Buscar" className="icon-small" /> 
                                Buscar
                            </button>
                        </form>
                    </div>

                    {/* FOOTER: Botón Volver */}
                    <div className="asiento-footer single-button-footer">
                    <button 
                            className="action-button icon-with-text back-button-footer"
                            onClick={handleVolver} // CLAVE: Vuelve a GESTION_CUENTAS
                        >
                            <img src={LogoGrupo5} alt="Icono Volver" className="icon-small" /> 
                            Volver
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL DE MODIFICACIÓN */}
            {showModal && cuentaEncontrada && (
                <ModificacionModal 
                    cuenta={cuentaEncontrada} 
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveModification}
                />
            )}
        </div>
    );
}