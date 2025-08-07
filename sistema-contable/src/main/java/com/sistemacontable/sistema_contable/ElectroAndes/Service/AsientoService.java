package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Asiento;
import com.sistemacontable.sistema_contable.dto.CreateAsientoDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

public interface AsientoService {
    Asiento crearAsiento(CreateAsientoDto dto);
    List<Asiento> obtenerTodos();
    Asiento obtenerPorId(Long id);
    List<Asiento> obtenerPorFechas(LocalDate desde, LocalDate hasta);
}


