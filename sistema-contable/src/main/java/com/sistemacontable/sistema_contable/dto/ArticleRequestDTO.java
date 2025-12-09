// src/main/java/com.sistemacontable.../dto/ArticleRequestDTO.java
package com.sistemacontable.sistema_contable.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ArticleRequestDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    @NotNull(message = "El código es obligatorio")
    private Integer codigo;

    @Min(value = 0)
    private Integer stockActual;

    @NotNull
    @Min(value = 0)
    private Integer stockMinimo;

    @NotNull
    @Min(value = 0)
    private Double precioUnitario;

    @NotBlank(message = "La presentación es obligatoria")
    private String presentacion;

    @NotNull(message = "El ID del proveedor es obligatorio")
    private Long supplierId; // Recibimos el ID del proveedor

    // --- Constructor por defecto ---
    public ArticleRequestDTO() {
    }

    // --- Getters ---
    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Integer getCodigo() {
        return codigo;
    }

    public Integer getStockActual() {
        return stockActual;
    }

    public Integer getStockMinimo() {
        return stockMinimo;
    }

    public Double getPrecioUnitario() {
        return precioUnitario;
    }

    public String getPresentacion() {
        return presentacion;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    // --- Setters (Requeridos por Jackson para deserialización) ---
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setCodigo(Integer codigo) {
        this.codigo = codigo;
    }

    public void setStockActual(Integer stockActual) {
        this.stockActual = stockActual;
    }

    public void setStockMinimo(Integer stockMinimo) {
        this.stockMinimo = stockMinimo;
    }

    public void setPrecioUnitario(Double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public void setPresentacion(String presentacion) {
        this.presentacion = presentacion;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }
}
