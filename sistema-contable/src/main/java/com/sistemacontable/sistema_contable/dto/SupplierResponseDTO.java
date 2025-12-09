// src/main/java/com.sistemacontable/sistema_contable/dto/SupplierResponseDTO.java
package com.sistemacontable.sistema_contable.dto;

import java.time.LocalDateTime;

public class SupplierResponseDTO {

    private Long id;
    private String name;
    private String address;
    private String phone;
    private String email;
    private boolean active;
    private LocalDateTime createdAt;

    public SupplierResponseDTO() {
    }

    // --- Getters y Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    } // ¡Faltaba este!

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    } // ¡Faltaba este!

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    } // ¡Faltaba este!

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    } // ¡Faltaba este!

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    } // ¡Faltaba este!

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    } // ¡Faltaba este!

    // Si tiene el campo updatedAt en el DTO, también debe agregarlo
    // public void setUpdatedAt(LocalDateTime updatedAt) { ... }
}
