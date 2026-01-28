package com.sistemacontable.sistema_contable.ElectroAndes.Util;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.SolicitudCompra;
import com.sistemacontable.sistema_contable.dto.ResponseDetalleSolicitudDto;
import com.sistemacontable.sistema_contable.dto.ResponseSolicitudCompraDto;

@Component
public class SolicitudCompraMapper {

    public ResponseSolicitudCompraDto toDto(SolicitudCompra solicitud) {
        ResponseSolicitudCompraDto dto = new ResponseSolicitudCompraDto();
        dto.setId(solicitud.getId());
        dto.setNumeroSolicitud(solicitud.getNumeroSolicitud());
        dto.setEstado(solicitud.getEstado());
        dto.setFechaEmisionOC(solicitud.getFechaEmisionOC());

        List<ResponseDetalleSolicitudDto> detallesDto = solicitud.getDetalles().stream().map(d -> {
            ResponseDetalleSolicitudDto rd = new ResponseDetalleSolicitudDto();
            rd.setId(d.getId());
            rd.setArticuloReferencia(d.getArticulo().getReferencia());
            rd.setArticuloDescripcion(d.getDescripcion());
            rd.setCantidad(d.getCantidad());
            rd.setMedida(d.getMedida());
            rd.setEstado(d.getEstado());
            return rd;
        }).collect(Collectors.toList());

        dto.setDetalles(detallesDto);
        return dto;
    }

    public List<ResponseSolicitudCompraDto> toDtoList(List<SolicitudCompra> lista) {
        return lista.stream().map(this::toDto).collect(Collectors.toList());
    }
}