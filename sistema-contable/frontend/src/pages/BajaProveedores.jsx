import React, { useState, useEffect } from "react";
// Importamos api para la eliminación (DELETE)
import api from "../services/api"; 
import "../styles/Menu.css"; 
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// ====================================================================
// CONSTANTES Y MOCKUP
// ====================================================================

// DTO de Mockup mínimo para la simulación de la búsqueda
const MOCK_PROVEEDOR = {
    codigoProveedor: 'P001', 
    nombre: 'Distribuidora Luka',
    // Incluir otros campos mínimos necesarios para el DTO
};

// ====================================================================
// MODAL DE SELECCIÓN DE PROVEEDOR (Reutilizado de Modificación)
// ====================================================================

const ProveedorModal = ({ proveedoresDisponibles, onSelect, onClose, loading, initialSearch }) => {
    // Simulación de búsqueda de proveedor por código o nombre
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');

    const filteredProveedores = (proveedoresDisponibles || []).filter(prov => {
        const codigo = prov.codigoProveedor || ''; 
        const nombre = prov.nombre || '';
        return codigo.includes(searchTerm) || nombre.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta">
                <h3 className="modal-title">Seleccionar Proveedor para dar de Baja</h3>
                
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


// ====================================================================
// MODAL DE BAJA (Confirmación)
// ====================================================================

const BajaModal = ({ proveedor, onConfirm, onClose }) => {
    
    // Mostramos el código y nombre del proveedor seleccionado
    const nombreCompleto = proveedor.codigoProveedor ? `${proveedor.codigoProveedor} - ${proveedor.nombre}` : proveedor.nombre;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title" style={{ color: '#8b2b2b' }}>Confirmación de Baja de Proveedor</h3>
                
                <div className="modal-details">
                    <p><strong>Proveedor:</strong> {nombreCompleto}</p>
                    <p style={{ color: '#ffc107', fontWeight: 'bold' }}>
                        ¡ADVERTENCIA! Esta acción dará de baja lógicamente al proveedor del sistema.
                    </p>
                    <p>¿Desea confirmar la eliminación lógica de este proveedor?</p>
                </div>

                <div className="modal-actions">
                    <button className="action-button secondary-button" onClick={onClose}>
                        Cancelar
                    </button>
                    <button 
                        className="action-button danger-button" 
                        onClick={() => onConfirm(proveedor.codigoProveedor)} // Enviamos el ID/Código para la API
                    >
                        Confirmar Baja
                    </button>
                </div>
            </div>
        </div>
    );
};


// ====================================================================
// COMPONENTE PRINCIPAL: BajaProveedor
// ====================================================================

export default function BajaProveedor({ onPageChange }) {
    
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
    const [loadingProveedores, setLoadingProveedores] = useState(false);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Mockup: Lista inicial de proveedores disponibles
    const [proveedoresDisponibles, setProveedoresDisponibles] = useState([MOCK_PROVEEDOR]); 

    // 1. Efecto de Carga Inicial (Mockup)
    useEffect(() => {
        // En una aplicación real, aquí cargarías la lista de proveedores activos
        // setProveedoresDisponibles(apiData); 
    }, []);

    // 2. Manejo de la Selección del Proveedor
    const handleProveedorSelect = (prov) => {
        setProveedorSeleccionado(prov);
        setShowSelectionModal(false);
        setShowConfirmModal(true); // Abrir modal de confirmación inmediatamente
    };
    
    // 3. Manejo de la Baja (API CALL)
    const handleConfirmarBaja = async (codigoProveedor) => {
        setShowConfirmModal(false);
        setIsDeleting(true);

        try {
            // NOTA: Asumimos que el endpoint DELETE utiliza el código de proveedor como path variable
            // URL esperada: /api/proveedores/{codigoProveedor}
            // Si el backend usa Long ID, necesitarías obtener el ID primero. Usaremos el código por ahora.
            
            // Simulación de respuesta 204 No Content
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            
            // const response = await api.delete(`/proveedores/${codigoProveedor}`);
            // if (response.status === 204) { ... }
            
            alert(`✅ Proveedor ${codigoProveedor} dado de baja (lógicamente) con éxito.`);
            
            // Actualizar la lista localmente (eliminando el proveedor del estado)
            setProveedoresDisponibles(prev => prev.filter(p => p.codigoProveedor !== codigoProveedor));
            
            // Resetear la vista
            setProveedorSeleccionado(null);
            
        } catch (err) {
            console.error("Error al dar de baja al proveedor:", err);
            const backendMessage = err.response?.data?.message || 'Error desconocido al conectar con el backend.';
            alert(`❌ Fallo en la baja:\n${backendMessage}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleVolver = () => {
        if (onPageChange) {
            onPageChange("GESTION_PROVEEDORES"); 
        }
    };
    
    // 4. Renderizado principal
    const displayProveedor = proveedorSeleccionado 
        ? `${proveedorSeleccionado.codigoProveedor} - ${proveedorSeleccionado.nombre}` 
        : 'Seleccionar Proveedor...';

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column"> 
                    
                    {/* HEADER */}
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo Empresa" className="logo-small" />
                            <h2 className="asiento-title">Baja de Proveedor</h2>
                        </div>
                    </div>

                    {/* BODY: Interfaz de Selección */}
                    <div className="asiento-body gestion-body form-body"> 
                        <h3 className="partidas-title">Busque y seleccione el proveedor a dar de baja</h3>
                        
                        <div className="user-form search-form">
                            <label className="header-field search-field">Proveedor Seleccionado: 
                                <div 
                                    className="input-base large-input" 
                                    style={{ textAlign: 'center', borderColor: proveedorSeleccionado ? '#8b2b2b' : '#888' }}
                                >
                                    {displayProveedor}
                                </div>
                            </label>
                            
                            <button 
                                type="button"
                                className="action-button icon-with-text danger-button search-button-action"
                                onClick={() => setShowSelectionModal(true)} // Abre el modal de búsqueda
                                disabled={isDeleting}
                            >
                                <img src={LogoGrupo5} alt="Icono Buscar" className="icon-small" /> 
                                {isDeleting ? 'Procesando Baja...' : 'Buscar Proveedor'}
                            </button>
                            
                            {proveedorSeleccionado && (
                                <p style={{ color: '#ff6b6b', marginTop: '15px', fontWeight: 'bold' }}>
                                    Proveedor listo para la baja. Presione el botón de arriba.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* FOOTER: Botón Volver */}
                    <div className="asiento-footer single-button-footer">
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

            {/* MODAL DE SELECCIÓN */}
            {showSelectionModal && (
                <ProveedorModal
                    proveedoresDisponibles={proveedoresDisponibles}
                    loading={loadingProveedores}
                    onSelect={handleProveedorSelect}
                    onClose={() => setShowSelectionModal(false)}
                />
            )}
            
            {/* MODAL DE CONFIRMACIÓN DE BAJA */}
            {showConfirmModal && proveedorSeleccionado && (
                <BajaModal 
                    proveedor={proveedorSeleccionado} 
                    onConfirm={handleConfirmarBaja}
                    onClose={() => setShowConfirmModal(false)}
                />
            )}
        </div>
    );
}