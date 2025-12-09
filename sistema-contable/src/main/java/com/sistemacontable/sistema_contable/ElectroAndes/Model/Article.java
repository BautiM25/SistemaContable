// src/main/java/com.sistemacontable.sistema_contable.ElectroAndes.Model/Article.java
package com.sistemacontable.sistema_contable.ElectroAndes.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "articles")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // UML: nombre: String
    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false)
    private String nombre;

    // UML: descripcion: String
    @NotBlank(message = "La descripción es obligatoria")
    @Column(length = 255)
    private String descripcion;

    // UML: codigo: int
    @NotNull(message = "El código es obligatorio")
    @Column(nullable = false, unique = true) // Asumimos que el código debe ser único
    private Integer codigo;

    // UML: stockActual: int
    @NotNull
    @Min(value = 0, message = "El stock actual no puede ser negativo")
    private Integer stockActual = 0;

    // UML: stockMinimo: int
    @NotNull
    @Min(value = 0, message = "El stock mínimo no puede ser negativo")
    private Integer stockMinimo;

    // UML: precioUnitario: double
    @NotNull
    @Min(value = 0, message = "El precio unitario no puede ser negativo")
    private Double precioUnitario;

    // UML: presentacion: //Ver tipo de dato
    // Usaremos String, ya que la presentación (caja, unidad, litro) suele ser un texto
    @NotBlank(message = "La presentación es obligatoria")
    private String presentacion;

    // RELACIÓN CON PROVEEDOR (Supplier)
    // Un Producto (Article) tiene UN Proveedor.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false) // Clave foránea
    private Supplier supplier; // La Entidad Supplier debe estar cargada

    // Timestamps
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // --- Lifecycle Callbacks (para timestamps) ---
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // --- Constructor por defecto y Getters/Setters (omito por brevedad, pero necesarios) ---
    public Article() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getCodigo() {
        return codigo;
    }

    public void setCodigo(Integer codigo) {
        this.codigo = codigo;
    }

    public Integer getStockActual() {
        return stockActual;
    }

    public void setStockActual(Integer stockActual) {
        this.stockActual = stockActual;
    }

    public Integer getStockMinimo() {
        return stockMinimo;
    }

    public void setStockMinimo(Integer stockMinimo) {
        this.stockMinimo = stockMinimo;
    }

    public Double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(Double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public String getPresentacion() {
        return presentacion;
    }

    public void setPresentacion(String presentacion) {
        this.presentacion = presentacion;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

}
