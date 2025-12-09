// src/main/java/com.sistemacontable.sistema_contable.ElectroAndes.Util/SupplierMapper.java
package com.sistemacontable.sistema_contable.ElectroAndes.Util;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Supplier;
import com.sistemacontable.sistema_contable.dto.SupplierResponseDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class SupplierMapper {

    // Mapea una sola Entidad a su DTO de Respuesta
    public SupplierResponseDTO mapToDto(Supplier supplier) {
        if (supplier == null) {
            return null;
        }

        SupplierResponseDTO dto = new SupplierResponseDTO();

        // Mapeo de campos básicos
        dto.setId(supplier.getId());
        dto.setName(supplier.getName());
        dto.setAddress(supplier.getAddress());
        dto.setPhone(supplier.getPhone());
        dto.setEmail(supplier.getEmail());
        dto.setActive(supplier.isActive());

        // Mapeo seguro para createdAt y updatedAt (POSIBLES FALLOS)
        // Se asume que getCreatedAt() y getUpdatedAt() pueden devolver null para registros antiguos.
        dto.setCreatedAt(supplier.getCreatedAt() != null ? supplier.getCreatedAt() : null);
        // Si tu DTO tiene un setUpdatedAt, también debe ser nulo seguro:
        // dto.setUpdatedAt(supplier.getUpdatedAt() != null ? supplier.getUpdatedAt() : null); 

        return dto;
    }

    // Mapea una lista de Entidades a una lista de DTOs
    public List<SupplierResponseDTO> toDtoList(List<Supplier> suppliers) {
        return suppliers.stream().map(this::mapToDto).collect(Collectors.toList());
    }
}
