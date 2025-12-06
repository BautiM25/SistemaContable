// Archivo: src/utils/treeConverter.js (MODIFICADO)

/**
 * Convierte una lista plana de CuentaDTOs (con cuentaPadreId) a una 
 * estructura de árbol anidada (con children) y calcula el código jerárquico.
 * @param {Array<object>} data - La lista plana de CuentaDTOs recibida del backend.
 * @returns {Array<object>} La estructura de cuentas en formato de árbol con 'codigoJerarquico'.
 */
export const buildCuentaTree = (data) => {
    const map = {};
    const rootNodes = [];

    // 1. Mapear todas las cuentas e inicializar el array children
    data.forEach(cuenta => {
        // Clonamos la cuenta e inicializamos propiedades
        map[cuenta.id] = { 
            ...cuenta, 
            children: [],
            codigoJerarquico: null // Se calculará en el siguiente paso
        }; 
    });

    // 2. Construir la jerarquía y recolectar las raíces
    Object.values(map).forEach(cuenta => {
        if (cuenta.cuentaPadreId != null) { 
            const parent = map[cuenta.cuentaPadreId];
            if (parent) {
                parent.children.push(cuenta);
            }
        } else {
            rootNodes.push(cuenta);
        }
    });
    
    // Opcional: Ordenar las cuentas raíz por ID para una numeración consistente (1, 2, 3...)
    rootNodes.sort((a, b) => a.id - b.id); 


    // 3. Recorrido recursivo para calcular el código jerárquico
    function assignCode(cuentaList, parentCode = '') {
        // Ordenar hijos por ID para que 1.1 venga antes que 1.2
        cuentaList.sort((a, b) => a.id - b.id);
        
        cuentaList.forEach((cuenta, index) => {
            const currentCode = parentCode ? `${parentCode}.${index + 1}` : String(index + 1);
            cuenta.codigoJerarquico = currentCode;

            if (cuenta.children && cuenta.children.length > 0) {
                // Llamada recursiva para los hijos
                assignCode(cuenta.children, currentCode);
            }
        });
    }

    // Iniciar el cálculo del código desde las raíces
    assignCode(rootNodes);

    return rootNodes;
};