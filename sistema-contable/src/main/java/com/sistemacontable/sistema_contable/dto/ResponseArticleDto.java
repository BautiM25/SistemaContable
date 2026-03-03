package com.sistemacontable.sistema_contable.dto;

import java.math.BigDecimal;
import java.util.List;

public class ResponseArticleDto {

    private Long id;
    private String referencia;
    private String descripcion;
    private String familia;
    private boolean habilitado;
    private BigDecimal precioPublico;
    private Integer stockFisico;
    private Integer stockMinimo;
    private Long idProveedorHabitual;
    private String nombreProveedorHabitual;
    private String comentarios;
    private List<ProveedorVinculadoDto> proveedores; // Una lista de proveedores con sus precios

    public ResponseArticleDto() {
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

    public String getFamilia() {
        return familia;
    }

    public void setFamilia(String familia) {
        this.familia = familia;
    }

    public boolean isHabilitado() {
        return habilitado;
    }

    public void setHabilitado(boolean habilitado) {
        this.habilitado = habilitado;
    }

    public BigDecimal getPrecioPublico() {
        return precioPublico;
    }

    public void setPrecioPublico(BigDecimal precioPublico) {
        this.precioPublico = precioPublico;
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

    public Long getIdProveedorHabitual() {
        return idProveedorHabitual;
    }

    public void setIdProveedorHabitual(Long idProveedorHabitual) {
        this.idProveedorHabitual = idProveedorHabitual;
    }

    public String getNombreProveedorHabitual() {
        return nombreProveedorHabitual;
    }

    public void setNombreProveedorHabitual(String nombreProveedorHabitual) {
        this.nombreProveedorHabitual = nombreProveedorHabitual;
    }

    public String getComentarios() {
        return comentarios;
    }

    public void setComentarios(String comentarios) {
        this.comentarios = comentarios;
    }

    public List<ProveedorVinculadoDto> getProveedores() {
        return proveedores;
    }

    public void setProveedores(List<ProveedorVinculadoDto> proveedores) {
        this.proveedores = proveedores;
    }
}
