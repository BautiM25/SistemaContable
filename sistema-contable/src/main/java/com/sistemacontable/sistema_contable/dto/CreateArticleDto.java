package com.sistemacontable.sistema_contable.dto;

import java.math.BigDecimal;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Divisa;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.IvaModality;

public class CreateArticleDto {

    private String referencia;
    private String descripcion;
    private String familia;
    private boolean habilitado;
    private boolean envaseSiNo;
    private Integer unidadesPorEnvase;
    private IvaModality modalidadIvaCompra;
    private Long idProveedorHabitual; // Recibimos solo el ID
    private BigDecimal costoDivisa;
    private BigDecimal costoBase;
    private Divisa divisa;
    private IvaModality modalidadIvaVenta;
    private BigDecimal precioPublico;
    private BigDecimal precioMayorista;
    private Double descuentoMaximo;
    private String listaPrecios;
    private Integer stockFisico; // Aunque no se envíe, lo inicializamos en el servicio
    private Integer stockMinimo;
    private Integer stockMaximo;
    private String comentarios;

    public CreateArticleDto() {
    }

    // Getters y Setters
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

    public boolean isEnvaseSiNo() {
        return envaseSiNo;
    }

    public void setEnvaseSiNo(boolean envaseSiNo) {
        this.envaseSiNo = envaseSiNo;
    }

    public Integer getUnidadesPorEnvase() {
        return unidadesPorEnvase;
    }

    public void setUnidadesPorEnvase(Integer unidadesPorEnvase) {
        this.unidadesPorEnvase = unidadesPorEnvase;
    }

    public IvaModality getModalidadIvaCompra() {
        return modalidadIvaCompra;
    }

    public void setModalidadIvaCompra(IvaModality modalidadIvaCompra) {
        this.modalidadIvaCompra = modalidadIvaCompra;
    }

    public Long getIdProveedorHabitual() {
        return idProveedorHabitual;
    }

    public void setIdProveedorHabitual(Long idProveedorHabitual) {
        this.idProveedorHabitual = idProveedorHabitual;
    }

    public BigDecimal getCostoDivisa() {
        return costoDivisa;
    }

    public void setCostoDivisa(BigDecimal costoDivisa) {
        this.costoDivisa = costoDivisa;
    }

    public BigDecimal getCostoBase() {
        return costoBase;
    }

    public void setCostoBase(BigDecimal costoBase) {
        this.costoBase = costoBase;
    }

    public Divisa getDivisa() {
        return divisa;
    }

    public void setDivisa(Divisa divisa) {
        this.divisa = divisa;
    }

    public IvaModality getModalidadIvaVenta() {
        return modalidadIvaVenta;
    }

    public void setModalidadIvaVenta(IvaModality modalidadIvaVenta) {
        this.modalidadIvaVenta = modalidadIvaVenta;
    }

    public BigDecimal getPrecioPublico() {
        return precioPublico;
    }

    public void setPrecioPublico(BigDecimal precioPublico) {
        this.precioPublico = precioPublico;
    }

    public BigDecimal getPrecioMayorista() {
        return precioMayorista;
    }

    public void setPrecioMayorista(BigDecimal precioMayorista) {
        this.precioMayorista = precioMayorista;
    }

    public Double getDescuentoMaximo() {
        return descuentoMaximo;
    }

    public void setDescuentoMaximo(Double descuentoMaximo) {
        this.descuentoMaximo = descuentoMaximo;
    }

    public String getListaPrecios() {
        return listaPrecios;
    }

    public void setListaPrecios(String listaPrecios) {
        this.listaPrecios = listaPrecios;
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

    public Integer getStockMaximo() {
        return stockMaximo;
    }

    public void setStockMaximo(Integer stockMaximo) {
        this.stockMaximo = stockMaximo;
    }

    public String getComentarios() {
        return comentarios;
    }

    public void setComentarios(String comentarios) {
        this.comentarios = comentarios;
    }
}
