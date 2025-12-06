import React, { useState } from "react";
// ... (imports)
import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css"; // NUEVO
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// Simulación de detalles de cuenta
const cuentaEncontradaDummy = {
    numero: '1.1.1',
    nombre: 'Caja y Bancos',
    movimientos: 15, 
};

const BajaModal = ({ cuenta, onConfirm, onClose }) => {
    const [adminPassword, setAdminPassword] = useState('');

    const handleConfirm = () => {
        if (!adminPassword) {
            alert('Debe ingresar la contraseña del administrador.');
            return;
        }
        onConfirm(adminPassword);
    };

    
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title" style={{ color: '#8b2b2b' }}>Confirmación de Baja Crítica</h3>
                
                <div className="modal-details">
                    <p><strong>Nro. Cuenta:</strong> {cuenta.numero}</p>
                    <p><strong>Nombre:</strong> {cuenta.nombre}</p>
                    <p style={{ color: '#ffc107', fontWeight: 'bold' }}>Movimientos Asociados: {cuenta.movimientos} (¡Verifique antes de eliminar!) </p>
                    
                    <label className="header-field" style={{marginTop: '15px'}}>Contraseña de Administrador: 
                        <input 
                            type="password" 
                            className="input-base large-input" 
                            placeholder="Contraseña de confirmación"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className="modal-actions">
                    <button className="action-button secondary-button" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="action-button danger-button" onClick={handleConfirm}>
                        Eliminar Cuenta
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function BajaCuentas({onPageChange}) {
    const [numCuenta, setNumCuenta] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleBaja = (e) => {
        e.preventDefault();
        if (numCuenta !== cuentaEncontradaDummy.numero) {
            alert("Cuenta no encontrada. Ingrese '1.1.1' para simular.");
            return;
        }
        setShowModal(true); 
    };

    const handleVolver = () => {
        if (onPageChange) {
            onPageChange("GESTION_CUENTAS"); 
        }
    };

    const handleConfirmarBaja = (adminPassword) => {
        alert(`Cuenta ${numCuenta} eliminada con contraseña: ${adminPassword}`);
        setShowModal(false);
        setNumCuenta('');
    };

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    {/* HEADER */}
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo Empresa" className="logo-small" />
                            <h2 className="asiento-title">Baja de Cuenta Contable</h2>
                        </div>
                    </div>

                    {/* BODY: Formulario de Baja */}
                    <div className="asiento-body gestion-body form-body"> 
                        <h3 className="partidas-title">Ingrese el número de cuenta a eliminar</h3>
                        
                        <form className="user-form" onSubmit={handleBaja}>
                            
                            <label className="header-field">Número de Cuenta a Eliminar: 
                                <input 
                                    type="text" 
                                    className="input-base large-input" 
                                    placeholder="Ej: 1.1.1.2"
                                    value={numCuenta}
                                    onChange={(e) => setNumCuenta(e.target.value)}
                                    required
                                />
                            </label>

                            <button 
                                type="submit"
                                className="action-button icon-with-text danger-button submit-button"
                            >
                                <img src={LogoGrupo5} alt="Icono Eliminar" className="icon-small" /> 
                                Eliminar Cuenta
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

            {/* MODAL DE BAJA */}
            {showModal && (
                <BajaModal 
                    cuenta={cuentaEncontradaDummy} 
                    onConfirm={handleConfirmarBaja} 
                    onClose={() => setShowModal(false)} 
                />
            )}
        </div>
    );
}