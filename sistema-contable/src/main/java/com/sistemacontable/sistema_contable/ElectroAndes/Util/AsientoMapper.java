package com.sistemacontable.sistema_contable.ElectroAndes.Util;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Asiento;
import com.sistemacontable.sistema_contable.dto.ResponseAsientoDto;
import com.sistemacontable.sistema_contable.dto.ResponseDetalleDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AsientoMapper {

    public ResponseAsientoDto mapToDto(Asiento asiento) {
        ResponseAsientoDto dto = new ResponseAsientoDto();
        dto.setId(asiento.getId());
        dto.setFecha(asiento.getFecha());
        dto.setDescripcion(asiento.getDescripcion());

        // Evitar NullPointer
        if (asiento.getCreador() != null) {
            dto.setCreador(asiento.getCreador().getNombreCompleto());
        } else {
            dto.setCreador("Desconocido");
        }

        List<ResponseDetalleDto> detallesDto = asiento.getDetalles() != null
                ? asiento.getDetalles().stream().map(detalle -> {
            ResponseDetalleDto d = new ResponseDetalleDto();
            d.setId(detalle.getId());
            d.setDebe(detalle.getDebe());
            d.setHaber(detalle.getHaber());
            d.setCuentaNombre(
                    detalle.getCuenta() != null ? detalle.getCuenta().getNombreCuenta() : "Cuenta desconocida"
            );
            return d;
        }).collect(Collectors.toList())
                : List.of();

        dto.setDetalles(detallesDto);
        return dto;
    }

    public List<ResponseAsientoDto> toDtoList(List<Asiento> asientos) {
        return asientos.stream().map(this::mapToDto).collect(Collectors.toList());
    }
}




