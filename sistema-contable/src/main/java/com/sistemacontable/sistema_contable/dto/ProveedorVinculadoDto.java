package com.sistemacontable.sistema_contable.dto;

import java.math.BigDecimal;

public class ProveedorVinculadoDto {

    private Long idProveedor;
    private String nombre;
    private BigDecimal precioPactado;

    // Getters y Setters
    public Long getIdProveedor() {
        return idProveedor;
    }

    public void setIdProveedor(Long idProveedor) {
        this.idProveedor = idProveedor;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getPrecioPactado() {
        return precioPactado;
    }

    public void setPrecioPactado(BigDecimal precioPactado) {
        this.precioPactado = precioPactado;
    }
}
