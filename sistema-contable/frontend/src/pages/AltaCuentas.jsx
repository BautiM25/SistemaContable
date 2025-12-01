import React, { useState } from "react";
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css"; // NUEVO
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

const AltaModal = ({ cuentaPadre, nombre, onConfirm, onClose }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <h3 className="modal-title">Confirmar Alta de Cuenta</h3>
            
            <div className="modal-details">
                <p><strong>Cuenta Padre:</strong> {cuentaPadre}</p>
                <p><strong>Nueva Cuenta:</strong> {nombre}</p>
                <p style={{ color: '#ffd700', marginTop: '15px' }}>¿Desea confirmar el registro de esta nueva cuenta en el Plan de Cuentas?</p>
            </div>

            <div className="modal-actions">
                <button 
                    className="action-button secondary-button" 
                    onClick={onClose}
                >
                    Cancelar
                </button>
                <button 
                    className="action-button primary-button" 
                    onClick={onConfirm}
                >
                    Confirmar Alta
                </button>
            </div>
        </div>
    </div>
);


export default function AltaCuentas() {
    const [numCuentaPadre, setNumCuentaPadre] = useState('');
    const [nombreCuenta, setNombreCuenta] = useState('');
    const [showModal, setShowModal] = useState(false); 

    const handleAlta = (e) => {
        e.preventDefault();
        setShowModal(true); 
    };

    const handleConfirmarAlta = () => {
        alert(`Cuenta '${nombreCuenta}' registrada con éxito bajo ${numCuentaPadre}.`);
        setShowModal(false);
        setNumCuentaPadre(''); 
        setNombreCuenta('');
    };

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    {/* HEADER */}
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo Empresa" className="logo-small" />
                            <h2 className="asiento-title">Alta de Nueva Cuenta Contable</h2>
                        </div>
                    </div>

                    {/* BODY: Formulario de Alta */}
                    <div className="asiento-body gestion-body form-body"> 
                        <h3 className="partidas-title">Datos de la Cuenta</h3>
                        
                        <form className="user-form" onSubmit={handleAlta}>
                            
                            <label className="header-field">Número de Cuenta Padre: 
                                <input 
                                    type="text" 
                                    className="input-base large-input" 
                                    placeholder="Ej: 1.1 o 1.1.1"
                                    value={numCuentaPadre}
                                    onChange={(e) => setNumCuentaPadre(e.target.value)}
                                    required
                                />
                            </label>

                            <label className="header-field">Nombre de la Nueva Cuenta: 
                                <input 
                                    type="text" 
                                    className="input-base large-input" 
                                    placeholder="Nombre completo de la cuenta"
                                    value={nombreCuenta}
                                    onChange={(e) => setNombreCuenta(e.target.value)}
                                    required
                                />
                            </label>
                            
                            <button 
                                type="submit"
                                className="action-button icon-with-text primary-button submit-button"
                            >
                                <img src={LogoGrupo5} alt="Icono Guardar" className="icon-small" /> 
                                Registrar Cuenta
                            </button>
                        </form>
                    </div>

                    {/* FOOTER: Botón Volver */}
                    <div className="asiento-footer single-button-footer">
                        <button className="action-button icon-with-text back-button-footer">
                            <img src={LogoGrupo5} alt="Icono Volver" className="icon-small" /> 
                            Volver
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL DE CONFIRMACIÓN */}
            {showModal && (
                <AltaModal 
                    cuentaPadre={numCuentaPadre} 
                    nombre={nombreCuenta} 
                    onConfirm={handleConfirmarAlta} 
                    onClose={() => setShowModal(false)} 
                />
            )}
        </div>
    );
}