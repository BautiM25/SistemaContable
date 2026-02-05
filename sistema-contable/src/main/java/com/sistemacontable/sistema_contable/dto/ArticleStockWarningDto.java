package com.sistemacontable.sistema_contable.dto;

public class ArticleStockWarningDto {

    private Long id;
    private String referencia;
    private String descripcion;
    private Integer stockFisico;
    private Integer stockMinimo;
    private boolean esIgualAlMinimo; // true = igual, false = por debajo

    public ArticleStockWarningDto() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getStockFisico() {
        return stockFisico;
    }

    public void setStockFisico(Integer stockFisico) {
        this.stockFisico = stockFisico;
    }

    public Integer getStockMinimo() {
        return stockMinimo;
    }

    public void setStockMinimo(Integer stockMinimo) {
        this.stockMinimo = stockMinimo;
    }

    public boolean isEsIgualAlMinimo() {
        return esIgualAlMinimo;
    }

    public void setEsIgualAlMinimo(boolean esIgualAlMinimo) {
        this.esIgualAlMinimo = esIgualAlMinimo;
    }
}
