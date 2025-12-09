package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Asiento;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleAsiento;
import com.sistemacontable.sistema_contable.dto.CreateAsientoDto;

import java.time.LocalDate;
import java.util.List;

public interface AsientoService {
    Asiento crearAsiento(CreateAsientoDto dto);
    List<Asiento> obtenerTodos();
    Asiento obtenerPorId(Long id);
    List<Asiento> obtenerPorFechas(LocalDate desde, LocalDate hasta);
    List<DetalleAsiento> obtenerMayorPorCuentaYFechas(Long cuentaId, LocalDate desde, LocalDate hasta);
}


