package com.sistemacontable.sistema_contable.ElectroAndes.Util;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.OrdenCompra;
import com.sistemacontable.sistema_contable.dto.ResponseDetalleOrdenDto;
import com.sistemacontable.sistema_contable.dto.ResponseOrdenCompraDto;

@Component
public class OrdenCompraMapper {

    public ResponseOrdenCompraDto toDto(OrdenCompra orden) {
        ResponseOrdenCompraDto dto = new ResponseOrdenCompraDto();
        dto.setId(orden.getId());
        dto.setNumeroOrdenCompra(orden.getNumeroOrdenCompra());
        dto.setFechaEmision(orden.getFechaEmision());
        dto.setProveedorNombre(orden.getProveedor().getNombre());
        dto.setMoneda(orden.getMoneda().name());

        // Vínculo con la solicitud origen
        if (orden.getSolicitudAsociada() != null) {
            dto.setSolicitudNumero(orden.getSolicitudAsociada().getNumeroSolicitud());
        }

        dto.setSubtotal(orden.getSubtotal());
        dto.setIva(orden.getIva());
        dto.setTotal(orden.getTotal());

        // Mapeo de detalles
        List<ResponseDetalleOrdenDto> detallesDto = orden.getDetalles().stream().map(detalle -> {
            ResponseDetalleOrdenDto dDto = new ResponseDetalleOrdenDto();
            dDto.setId(detalle.getId());
            dDto.setArticuloReferencia(detalle.getArticulo().getReferencia());
            dDto.setArticuloDescripcion(detalle.getArticulo().getDescripcion());
            dDto.setCantidad(detalle.getCantidad());
            dDto.setMedida(detalle.getMedida());
            dDto.setPrecioUnitario(detalle.getPrecioUnitario());

            // Calculamos el subtotal de la línea para el frontend
            BigDecimal subtotalLinea = detalle.getPrecioUnitario().multiply(BigDecimal.valueOf(detalle.getCantidad()));
            dDto.setSubtotalLinea(subtotalLinea);

            return dDto;
        }).collect(Collectors.toList());

        dto.setDetalles(detallesDto);
        return dto;
    }

    public List<ResponseOrdenCompraDto> toDtoList(List<OrdenCompra> ordenes) {
        return ordenes.stream().map(this::toDto).collect(Collectors.toList());
    }
}
