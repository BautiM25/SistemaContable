// src/main/java/com/tuproyecto/contable/models/Supplier.java
package com.sistemacontable.sistema_contable.ElectroAndes.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "suppliers",
        uniqueConstraints = {
            // Mapea las propiedades 'unique: true' de Mongoose a restricciones de tabla en SQL
            @UniqueConstraint(columnNames = "phone"),
            @UniqueConstraint(columnNames = "email")
        })
public class Supplier {

    // El campo '_id' de MongoDB se mapea a un ID autoincremental de PostgreSQL
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Usamos Long para ID autoincremental

    // Mongoose: { name: { required: true } }
    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false) // Asegura que no sea nulo en la DB
    private String name;

    // Mongoose: { address: { required: true } }
    @NotBlank(message = "La dirección es obligatoria")
    @Column(nullable = false)
    private String address;

    // Mongoose: { phone: { required: true, unique: true } }
    @NotBlank(message = "El teléfono es obligatorio")
    @Column(nullable = false)
    private String phone;

    // Mongoose: { email: { required: true, lowercase: true, unique: true } }
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email incorrecto")
    @Column(nullable = false)
    private String email;

    // Mongoose: { active: { required: true, default: true } }
    @NotNull
    @Column(nullable = false)
    private boolean active = true; // Valor por defecto en Java

    // Mongoose: { timestamps: true } -> Manejado con anotaciones JPA/Hibernate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // --- Lifecycle Callbacks (para timestamps) ---
    @PrePersist // Se llama antes de guardar por primera vez
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate // Se llama antes de actualizar
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
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
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // --- Constructor por defecto ---
    public Supplier() {
    }
}
