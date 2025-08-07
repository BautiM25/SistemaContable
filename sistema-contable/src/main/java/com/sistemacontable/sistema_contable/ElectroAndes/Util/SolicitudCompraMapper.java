package com.sistemacontable.sistema_contable.ElectroAndes.Util;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.*;
import com.sistemacontable.sistema_contable.dto.*;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.ProductoRepository;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class SolicitudCompraMapper {

    private final ProductoRepository productoRepository;

    public SolicitudCompraMapper(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public SolicitudCompra toEntity(SolicitudCompraDTO dto) {
        SolicitudCompra solicitud = new SolicitudCompra();
        solicitud.setFecha(dto.getFecha());
        solicitud.setDivision(dto.getDivision());
        solicitud.setCentroCosto(dto.getCentroCosto());
        solicitud.setComentario(dto.getComentario());


        if (dto.getDetalles() != null) {
            var detalles = dto.getDetalles().stream().map(detalleDTO -> {
                DetalleSolicitudCompra detalle = new DetalleSolicitudCompra();
                detalle.setCantidad(detalleDTO.getCantidad());
                detalle.setPresentacion(detalleDTO.getPresentacion());
                detalle.setFechaLimite(detalleDTO.getFechaLimite());
                detalle.setObservacion(detalleDTO.getObservacion());

                Producto producto = productoRepository.findById(detalleDTO.getProductoId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado: ID " + detalleDTO.getProductoId()));
                detalle.setProducto(producto);
                detalle.setSolicitud(solicitud); // muy importante

                return detalle;
            }).collect(Collectors.toList());

            solicitud.setDetalles(detalles);
        }

        return solicitud;
    }
}
