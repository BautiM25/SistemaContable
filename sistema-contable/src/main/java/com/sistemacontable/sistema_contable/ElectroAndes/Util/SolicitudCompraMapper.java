package com.sistemacontable.sistema_contable.ElectroAndes.Util;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleSolicitudCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.SolicitudCompra;
import com.sistemacontable.sistema_contable.dto.DetalleSolicitudCompraDTO;
import com.sistemacontable.sistema_contable.dto.SolicitudCompraDTO;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SolicitudCompraMapper {

    public SolicitudCompra toEntity(SolicitudCompraDTO dto) {

        SolicitudCompra solicitud = new SolicitudCompra();
        solicitud.setFecha(LocalDate.now());
        solicitud.setDivision(dto.getDivision());
        solicitud.setCentroCosto(dto.getCentroCosto());
        solicitud.setComentario(dto.getComentario());

        if (dto.getItems() != null) {
            List<DetalleSolicitudCompra> detalles = dto.getItems().stream()
                    .map(item -> mapDetalle(item, solicitud))
                    .collect(Collectors.toList());

            solicitud.setDetalles(detalles);
        }

        return solicitud;
    }

    private DetalleSolicitudCompra mapDetalle(
            DetalleSolicitudCompraDTO item,
            SolicitudCompra solicitud
    ) {
        DetalleSolicitudCompra detalle = new DetalleSolicitudCompra();

        detalle.setCantidad(item.getCantidad().doubleValue());
        detalle.setPresentacion(item.getUnidadMedida());

        // Guardamos toda la info del frontend en observación
        detalle.setObservacion(
                item.getCodigoInterno() + " | " +
                        item.getDescripcion() + " | " +
                        item.getConcepto() + " | " +
                        item.getDescripcionConcepto()
        );

        if (item.getFechaLimite() != null && !item.getFechaLimite().isEmpty()) {
            detalle.setFechaLimite(LocalDate.parse(item.getFechaLimite()));
        }

        detalle.setSolicitud(solicitud);
        return detalle;
    }
}
