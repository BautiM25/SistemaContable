package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import com.sistemacontable.sistema_contable.dto.ResponseCCDto;

public interface CuentaCorrienteService {

    /**
     * Procesa todas las órdenes y asientos para generar el historial de
     * movimientos y el saldo acumulado de un proveedor.
     */
    ResponseCCDto generarReporte(Long idProveedor);
}
