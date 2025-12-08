import React, { useState } from "react";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import IconGrupo5 from "../assets/LogoGrupo5.png";

import "../styles/Menu.css";
import "../styles/RegistrarAsiento.css";
import "../styles/SolicitudDeCompra.css";

const initialItem = {
    codigoInterno: "",
    descripcion: "",
    concepto: "",
    descripcionConcepto: "",
    cantidad: 1,
    unidadMedida: "UNIDAD",
    fechaLimite: "",
};

export default function SolicitudCompraView({ onPageChange }) {
    const [division, setDivision] = useState("2 QSA Administración");
    const [centroCosto, setCentroCosto] = useState("Administración");
    const [comentario, setComentario] = useState("");
    const [fechaLimiteGeneral, setFechaLimiteGeneral] = useState("");
    const [items, setItems] = useState([{ ...initialItem }]);
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState(null);

    const volver = () => onPageChange && onPageChange("DASHBOARD");

    const addItem = () => setItems([...items, { ...initialItem }]);

    // 🔹 Nueva función para eliminar la última fila
    const removeLastItem = () => {
        if (items.length > 1) {
            setItems(items.slice(0, -1));
        }
    };

    const updateItem = (idx, field, value) => {
        const copy = [...items];
        copy[idx][field] = field === "cantidad" ? Number(value) : value;
        setItems(copy);
    };

    const guardarSolicitud = async () => {
        setLoading(true);

        const invalido = items.some(
            (i) => !i.descripcion || !i.concepto || i.cantidad <= 0
        );

        if (invalido) {
            alert("Completá todos los campos obligatorios.");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                division,
                centroCosto,
                comentario,
                fechaLimiteGeneral: fechaLimiteGeneral || null,
                items: items.map((i) => ({
                    ...i,
                    fechaLimite: i.fechaLimite || null,
                })),
            };

            const res = await fetch("http://localhost:8080/api/solicitudes-compra", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            setResultado(data);
        } catch {
            alert("Error al guardar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="main-content">
                <div className="asiento-layout-column">

                    {/* HEADER */}
                    <div className="asiento-header">
                        <div className="asiento-logo-wrapper">
                            <img src={LogoEmpresa} alt="Logo" className="logo-small" />
                            <h2 className="asiento-title">Solicitud de Compra</h2>
                        </div>

                        <div className="solicitud-header-row">
                            <div className="header-field">
                                <label>División</label>
                                <select
                                    className="input-base"
                                    value={division}
                                    onChange={(e) => setDivision(e.target.value)}
                                >
                                    <option>2 QSA Administración</option>
                                    <option>3 QSA Finanzas</option>
                                    <option>4 QSA Compras</option>
                                </select>
                            </div>

                            <div className="header-field">
                                <label>Centro de Costo</label>
                                <select
                                    className="input-base"
                                    value={centroCosto}
                                    onChange={(e) => setCentroCosto(e.target.value)}
                                >
                                    <option>Administración</option>
                                    <option>Finanzas</option>
                                    <option>Compras</option>
                                </select>
                            </div>

                            <div className="header-field">
                                <label>Comentario</label>
                                <input
                                    className="input-base"
                                    value={comentario}
                                    onChange={(e) => setComentario(e.target.value)}
                                />
                            </div>

                            <div className="header-field">
                                <label>Fecha límite general</label>
                                <input
                                    type="date"
                                    className="input-base"
                                    value={fechaLimiteGeneral}
                                    onChange={(e) => setFechaLimiteGeneral(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="asiento-body">
                        <h3 className="partidas-title">Productos</h3>

                        <table className="partidas-table">
                            <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descripción</th>
                                <th>Cpto</th>
                                <th>Descripción Cpto</th>
                                <th>Cantidad</th>
                                <th>Medida</th>
                                <th>Fecha Límite</th>
                            </tr>
                            </thead>
                            <tbody>
                            {items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <input
                                            className="table-input"
                                            value={item.codigoInterno}
                                            onChange={(e) => updateItem(idx, "codigoInterno", e.target.value)}
                                            placeholder="Ej: 001"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="table-input"
                                            value={item.descripcion}
                                            onChange={(e) => updateItem(idx, "descripcion", e.target.value)}
                                            placeholder="Ej: Producto A"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="table-input"
                                            value={item.concepto}
                                            onChange={(e) => updateItem(idx, "concepto", e.target.value)}
                                            placeholder="Ej: Cpto1"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="table-input"
                                            value={item.descripcionConcepto}
                                            onChange={(e) => updateItem(idx, "descripcionConcepto", e.target.value)}
                                            placeholder="Ej: Descripción Cpto"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="table-input"
                                            value={item.cantidad}
                                            onChange={(e) => updateItem(idx, "cantidad", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            className="table-input"
                                            value={item.unidadMedida}
                                            onChange={(e) => updateItem(idx, "unidadMedida", e.target.value)}
                                        >
                                            <option>UNIDAD</option>
                                            <option>PIEZA</option>
                                            <option>CAJA</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            className="table-input"
                                            value={item.fechaLimite}
                                            onChange={(e) => updateItem(idx, "fechaLimite", e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER */}
                    <div className="asiento-footer">
                        <button className="action-button secondary-button" onClick={addItem}>
                            <img src={IconGrupo5} alt="" />
                            Agregar
                        </button>

                        <button className="action-button primary-button" onClick={guardarSolicitud} disabled={loading}>
                            <img src={IconGrupo5} alt="" />
                            {loading ? "Guardando..." : "Guardar"}
                        </button>

                        {/* 🔹 Nuevo botón para eliminar última fila */}
                        <button className="action-button danger-button" onClick={removeLastItem} disabled={items.length <= 1}>
                            <img src={IconGrupo5} alt="" />
                            Eliminar última fila
                        </button>

                        <button className="action-button" onClick={volver}>
                            <img src={IconGrupo5} alt="" />
                            Volver
                        </button>
                    </div>

                    {/* Resultado */}
                    {resultado && (
                        <div className="asiento-body" style={{ marginTop: 20 }}>
                            <b>Solicitud #{resultado.numero}</b>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
