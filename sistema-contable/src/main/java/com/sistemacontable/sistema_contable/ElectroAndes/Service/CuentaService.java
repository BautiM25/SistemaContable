package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import com.sistemacontable.sistema_contable.dto.CuentaDTO;

import java.util.List;

public interface CuentaService {

    List<CuentaDTO> obtenerTodasLasCuentas();

    CuentaDTO obtenerCuentaPorId(Long id);

    CuentaDTO crearCuenta(CuentaDTO dto);

    CuentaDTO actualizarCuenta(Long id, CuentaDTO dto);

    void eliminarCuenta(Long id);

    List<String> obtenerCuentasJerarquicasNumeradas();
}
