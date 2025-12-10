// src/main/java/com/sistemacontable/sistema_contable/ElectroAndes/Service/SolicitudCompraService.java
package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.SolicitudCompra;
import com.sistemacontable.sistema_contable.dto.CreateSolicitudCompraDto;
import com.sistemacontable.sistema_contable.dto.ResponseSolicitudCompraDto;

import java.util.List;

public interface SolicitudCompraService {
    
    // CRUD Básico
    ResponseSolicitudCompraDto createSolicitud(CreateSolicitudCompraDto dto);
    List<ResponseSolicitudCompraDto> getAllSolicitudes();
    ResponseSolicitudCompraDto getSolicitudById(Long id);
    
    // Lógica de negocio específica
    ResponseSolicitudCompraDto changeSolicitudStatus(Long id, String newStatus);
    SolicitudCompra findSolicitudEntityById(Long id);
}