package com.sistemacontable.sistema_contable.ElectroAndes.Util;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleAsiento;
import com.sistemacontable.sistema_contable.dto.DetalleMayorDto;
import org.springframework.stereotype.Component;

@Component
public class DetalleAsientoMapper {
    
    public DetalleMayorDto toMayorDto(DetalleAsiento detalle) {
        if (detalle == null) {
            return null;
        }
        
        DetalleMayorDto dto = new DetalleMayorDto();
        dto.setId(detalle.getId());
        dto.setDebe(detalle.getDebe());
        dto.setHaber(detalle.getHaber());
        
        if (detalle.getAsiento() != null) {
            dto.setFechaAsiento(detalle.getAsiento().getFecha());
            dto.setDescripcionAsiento(detalle.getAsiento().getDescripcion());
        }
        
        if (detalle.getCuenta() != null) {
            dto.setCuentaNombre(detalle.getCuenta().getNombreCuenta());
            dto.setCuentaId(detalle.getCuenta().getId());
        }
        
        return dto;
    }
}