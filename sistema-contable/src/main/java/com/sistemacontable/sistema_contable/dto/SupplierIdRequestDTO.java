// src/main/java/com.sistemacontable/sistema_contable/dto/SupplierIdRequestDTO.java
package com.sistemacontable.sistema_contable.dto;

import jakarta.validation.constraints.NotNull;

public class SupplierIdRequestDTO {

    // Este campo es el ID que se envía en el cuerpo de la petición (POST)
    @NotNull(message = "El ID del Proveedor es Obligatorio")
    private Long idSupplier;

    // --- Constructor por defecto (necesario para la deserialización) ---
    public SupplierIdRequestDTO() {
    }

    // --- Getters y Setters ---
    public Long getIdSupplier() {
        return idSupplier;
    }

    public void setIdSupplier(Long idSupplier) {
        this.idSupplier = idSupplier;
    }
}
