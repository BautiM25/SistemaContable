import React from "react";
import "../styles/global.css"; // importa tu css con los estilos globales
import LogoGrupo5 from "../assets/LogoGrupo5.png"; // tu logo en assets

export default function DemoUI() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      {/* Título */}
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
        Demo de Componentes
      </h1>

      {/* Botones */}
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
        Botones Retro-Modernos
      </h1>

      <div className="flex gap-6 flex-wrap justify-center">
        <button className="button">
          <img src={LogoGrupo5} alt="icono" />
          Guardar
        </button>

        <button className="button">
          <img src={LogoGrupo5} alt="icono" />
          Cancelar
        </button>

        <button className="button">
          <img src={LogoGrupo5} alt="icono" />
          Cargar
        </button>
      </div>
    </div>

      {/* Campos de escritura */}
      <div className="w-full max-w-md flex flex-col gap-4">
        <input
          type="text"
          placeholder="Escribir comentario..."
          className="input"
        />
        <select className="select">
          <option>Administración</option>
          <option>Producción</option>
          <option>Finanzas</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="w-full max-w-3xl overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Medida</th>
              <th>Fecha Límite</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>001</td>
              <td>Producto A</td>
              <td>10</td>
              <td>Kg</td>
              <td>10/12/2024</td>
            </tr>
            <tr>
              <td>002</td>
              <td>Producto B</td>
              <td>5</td>
              <td>Piezas</td>
              <td>15/12/2024</td>
            </tr>
            <tr>
              <td>003</td>
              <td>Producto C</td>
              <td>25</td>
              <td>Unidades</td>
              <td>20/12/2024</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Logo de marca (botón falso) */}
      <img src={LogoGrupo5} alt="Logo Grupo 5" className="brand-logo" />
    </div>
  );
}
