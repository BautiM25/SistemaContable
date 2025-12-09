package com.sistemacontable.sistema_contable.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SupplierEditRequestDTO {

    // El ID se envía en el cuerpo de la petición en el controlador TS, lo mantendremos así por ahora.
    @NotNull(message = "El ID del Proveedor es Obligatorio")
    private Long idSupplier;

    @NotBlank(message = "El Nombre del Proveedor es Obligatorio")
    private String newName;

    @NotBlank(message = "La Direccion del Proveedor es Obligatoria")
    private String newAddress;

    @NotBlank(message = "El Telefono del Proveedor es Obligatorio")
    private String newPhone;

    @NotBlank(message = "El Email del Proveedor es Obligatorio")
    @Email(message = "Formato de email incorrecto")
    private String newEmail;

    // --- Constructor por defecto ---
    public SupplierEditRequestDTO() {
    }

    // --- Getters ---
    public Long getIdSupplier() {
        return idSupplier;
    }

    public String getNewName() {
        return newName;
    }

    public String getNewAddress() {
        return newAddress;
    }

    public String getNewPhone() {
        return newPhone;
    }

    public String getNewEmail() {
        return newEmail;
    }

    // --- Setters (Requeridos por Jackson para deserialización) ---
    public void setIdSupplier(Long idSupplier) {
        this.idSupplier = idSupplier;
    }

    public void setNewName(String newName) {
        this.newName = newName;
    }

    public void setNewAddress(String newAddress) {
        this.newAddress = newAddress;
    }

    public void setNewPhone(String newPhone) {
        this.newPhone = newPhone;
    }

    public void setNewEmail(String newEmail) {
        this.newEmail = newEmail;
    }
}
