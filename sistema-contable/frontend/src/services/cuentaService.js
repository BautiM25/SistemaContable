// Archivo: src/services/cuentaService.js

// Importamos tu instancia de axios personalizada (api.js)
import api from "../services/api"; 

/**
 * Obtiene la lista completa de CuentaDTOs (plana) desde el backend.
 * @returns {Promise<Array>} Una promesa que resuelve con la lista plana de cuentas.
 */
export const obtenerCuentas = async () => {
    try {
        // Llama a http://localhost:8080/api/cuentas y adjunta el token
        const response = await api.get("/cuentas");
        return response.data; // Devuelve la lista de CuentaDTO
    } catch (error) {
        console.error("Error al obtener las cuentas:", error);
        throw error; // Propagamos el error al componente para que lo maneje
    }
};

/**
 * Registra una nueva cuenta. (Necesario para el administrador)
 * @param {object} nuevaCuenta - El objeto CuentaDTO a enviar.
 */
export const crearCuenta = async (nuevaCuenta) => {
    try {
        const response = await api.post("/cuentas", nuevaCuenta); 
        return response.data; // Devuelve la cuenta creada
    } catch (error) {
        console.error("Error al crear la cuenta:", error);
        throw error;
    }
};