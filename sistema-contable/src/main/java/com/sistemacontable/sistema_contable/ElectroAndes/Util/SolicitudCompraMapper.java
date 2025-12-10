// src/main/java/com/sistemacontable/sistema_contable/ElectroAndes/Util/SolicitudCompraMapper.java
package com.sistemacontable.sistema_contable.ElectroAndes.Util;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.SolicitudCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleSolicitudCompra;
import com.sistemacontable.sistema_contable.dto.ResponseSolicitudCompraDto;
import com.sistemacontable.sistema_contable.dto.ResponseDetalleSolicitudDto;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class SolicitudCompraMapper {

    // Mapea Detalle (Entidad) a Detalle (DTO)
    public ResponseDetalleSolicitudDto mapDetalleToDto(DetalleSolicitudCompra detalle) {
    ResponseDetalleSolicitudDto dto = new ResponseDetalleSolicitudDto();
    dto.setId(detalle.getId());
    dto.setIdArticulo(detalle.getArticulo().getId());
    dto.setNombreArticulo(detalle.getArticulo().getNombre());
    
    // Convertir Integer a String
    dto.setCodigoArticulo(String.valueOf(detalle.getArticulo().getCodigo()));
    
    dto.setCantidadRequerida(detalle.getCantidadRequerida());
    dto.setMotivoCompra(detalle.getMotivoCompra());
    return dto;
    }

    // Mapea Solicitud (Entidad) a Solicitud (DTO)
    public ResponseSolicitudCompraDto mapToDto(SolicitudCompra solicitud) {
        ResponseSolicitudCompraDto dto = new ResponseSolicitudCompraDto();
        dto.setId(solicitud.getId());
        dto.setNumeroSolicitud(solicitud.getNumeroSolicitud());
        dto.setFechaSolicitud(solicitud.getFechaSolicitud());
        dto.setJustificacionGeneral(solicitud.getJustificacionGeneral());
        dto.setEstado(solicitud.getEstado());

        // Mapeo del Usuario Solicitante
        if (solicitud.getUsuarioSolicitante() != null) {
            dto.setIdUsuarioSolicitante(solicitud.getUsuarioSolicitante().getId());
            dto.setNombreUsuarioSolicitante(solicitud.getUsuarioSolicitante().getNombreUsuario());
        }

        // Mapeo de los Detalles
        if (solicitud.getDetalles() != null) {
            dto.setDetalles(solicitud.getDetalles().stream()
                    .map(this::mapDetalleToDto)
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}