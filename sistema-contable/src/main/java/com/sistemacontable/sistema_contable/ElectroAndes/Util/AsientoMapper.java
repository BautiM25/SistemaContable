package com.sistemacontable.sistema_contable.ElectroAndes.Util;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Asiento;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleAsiento;
import com.sistemacontable.sistema_contable.dto.ResponseAsientoDto;
import com.sistemacontable.sistema_contable.dto.ResponseDetalleDto;

@Component
public class AsientoMapper {

    public ResponseAsientoDto mapToDto(Asiento asiento) {
        ResponseAsientoDto dto = new ResponseAsientoDto();
        dto.setId(asiento.getId());
        dto.setFecha(asiento.getFecha());
        dto.setDescripcion(asiento.getDescripcion());
        dto.setCreador(asiento.getCreador().getNombreCompleto());

        // Código Corregido (Añadiendo el tipo explícito DetalleAsiento):
        List<ResponseDetalleDto> detallesDto = asiento.getDetalles().stream().map((DetalleAsiento detalle) -> {
            ResponseDetalleDto d = new ResponseDetalleDto();
            d.setId(detalle.getId());
            d.setDebe(detalle.getDebe());
            d.setHaber(detalle.getHaber());
            d.setCuentaNombre(detalle.getCuenta().getNombreCuenta());
            return d;
        }).collect(Collectors.toList());

        dto.setDetalles(detallesDto);
        return dto;
    }

    public List<ResponseAsientoDto> toDtoList(List<Asiento> asientos) {
        return asientos.stream().map(this::mapToDto).collect(Collectors.toList());
    }

}
