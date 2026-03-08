package com.sistemacontable.sistema_contable.dto;

import java.math.BigDecimal;

public class ArticuloVinculadoDto {

    private Long idArticulo;
    private String referencia;
    private String descripcion;
    private BigDecimal precioPactado;
    private boolean activo;

    // Getters y Setters
    public Long getIdArticulo() {
        return idArticulo;
    }

    public void setIdArticulo(Long idArticulo) {
        this.idArticulo = idArticulo;
    }

    public String getReferencia() {
        return referencia;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public BigDecimal getPrecioPactado() {
        return precioPactado;
    }

    public void setPrecioPactado(BigDecimal precioPactado) {
        this.precioPactado = precioPactado;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
}
