import React, { useState, useEffect } from "react";
import api from "../services/api"; 
import "../styles/RegistrarAsiento.css"; 
import "../styles/GestionUsuarios.css"; 
import "../styles/Modal.css"; 
import LogoEmpresa from "../assets/LogoEmpresa.png";
import LogoGrupo5 from "../assets/LogoGrupo5.png";

// ====================================================================
// MODAL DE SELECCIÓN (LISTADO)
// ====================================================================
const ProveedorInactivoModal = ({ proveedoresDisponibles, onSelect, onClose, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = (proveedoresDisponibles || []).filter(prov => 
        prov.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        prov.cuitCuil.includes(searchTerm)
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-cuenta">
                <h3 className="modal-title">Seleccionar Proveedor Inactivo</h3>
                <input 
                    type="text" 
                    className="input-base large-input" 
                    placeholder="Buscar por nombre o CUIT..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="cuenta-list-container">
                    {loading ? <div className="loading-state">Cargando...</div> : 
                        filtered.map(p => (
                            <div key={p.id} className="list-item clickable-item" onClick={() => onSelect(p)}>
                                <span className="item-code">{p.cuitCuil}</span>
                                <span className="item-name">{p.nombre}</span>
                            </div>
                        ))
                    }
                </div>
                <div className="modal-actions">
                    <button className="action-button secondary-button" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// COMPONENTE PRINCIPAL
// ====================================================================
export default function ActivarProveedor({ onPageChange }) {
    const [inactivos, setInactivos] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    const [showSelection, setShowSelection] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false); // <--- Paso adicional de seguridad
    const [loading, setLoading] = useState(false);

    // 1. Cargar inactivos al montar el componente
    const cargarInactivos = async () => {
        setLoading(true);
        try {
            const res = await api.get("/proveedores/status?status=false");
            setInactivos(res.data);
        } catch (err) {
            console.error("Error al cargar inactivos", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargarInactivos(); }, []);

    // 2. Al elegir uno en el listado, NO activamos aún, solo mostramos confirmación
    const handleSelect = (p) => {
        setSeleccionado(p);
        setShowSelection(false);
        setShowConfirm(true); // Abrimos el "paso más"
    };

    // 3. Ejecutar la activación real (PUT /activate/{id})
    const ejecutarActivacion = async () => {
        try {
            // Mandamos el ID en la URL como pide el @PathVariable
            await api.put(`/proveedores/activate/${seleccionado.id}`);
            
            alert(`✅ ${seleccionado.nombre} reactivado con éxito.`);
            
            // Limpiamos y refrescamos
            setSeleccionado(null);
            setShowConfirm(false);
            cargarInactivos(); 
        } catch (err) {
            alert("❌ No se pudo activar al proveedor.");
        }
    };

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column">
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                            <h2 className="asiento-title">Reactivación de Proveedores</h2>
                        </div>
                    </div>

                    <div className="asiento-body gestion-body form-body">
                        <h3 className="partidas-title">Mantenimiento de Proveedores</h3>
                        
                        <div className="user-form search-form">
                            <p>Utilice esta herramienta para dar de alta lógica a proveedores suspendidos.</p>
                            <button 
                                className="action-button primary-button" 
                                onClick={() => setShowSelection(true)}
                                style={{ width: '100%', maxWidth: '300px' }}
                            >
                                <img src={LogoGrupo5} alt="search" />
                                BUSCAR PROVEEDORES INACTIVOS
                            </button>
                        </div>
                    </div>

                    <div className="asiento-footer">
                        <button className="action-button back-button-footer" onClick={() => onPageChange("GESTION_PROVEEDORES")}>
                            Volver
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL 1: SELECCIÓN */}
            {showSelection && (
                <ProveedorInactivoModal 
                    proveedoresDisponibles={inactivos} 
                    loading={loading}
                    onSelect={handleSelect}
                    onClose={() => setShowSelection(false)}
                />
            )}

            {/* MODAL 2: CONFIRMACIÓN (El "Paso más") */}
            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <h3 className="modal-title" style={{ color: '#3c6c3e' }}>¿Confirmar Activación?</h3>
                        <p style={{ margin: '20px 0', fontSize: '16px' }}>
                            Está por activar al proveedor: <br/>
                            <strong>{seleccionado.nombre}</strong> <br/>
                            <small>(CUIT: {seleccionado.cuitCuil})</small>
                        </p>
                        <div className="modal-actions" style={{ flexDirection: 'column', gap: '10px' }}>
                            <button className="action-button primary-button" onClick={ejecutarActivacion} style={{ width: '100%' }}>
                                SÍ, ACTIVAR AHORA
                            </button>
                            <button className="action-button secondary-button" onClick={() => setShowConfirm(false)} style={{ width: '100%' }}>
                                NO, CANCELAR
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}