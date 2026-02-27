package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import java.util.List;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.SolicitudCompra;
import com.sistemacontable.sistema_contable.dto.CreateSolicitudCompraDto;

public interface SolicitudCompraService {

    SolicitudCompra crear(CreateSolicitudCompraDto dto);
    List<SolicitudCompra> obtenerActivas();
    SolicitudCompra obtenerPorId(Long id);
    SolicitudCompra obtenerPorNumero(String numeroSolicitud);
    void cambiarEstado(Long id, boolean estado);
    
    // 📌 NUEVO: Método para obtener todas las solicitudes
    List<SolicitudCompra> obtenerTodas();
}