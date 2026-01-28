package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import java.util.List;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.SolicitudCompra;
import com.sistemacontable.sistema_contable.dto.CreateSolicitudCompraDto;

public interface SolicitudCompraService {
    SolicitudCompra crear(CreateSolicitudCompraDto dto);
    List<SolicitudCompra> obtenerTodas();
    SolicitudCompra obtenerPorId(Long id);
    void cambiarEstado(Long id, boolean estado);
}