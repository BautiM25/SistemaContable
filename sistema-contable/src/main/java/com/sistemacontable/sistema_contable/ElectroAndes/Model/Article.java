package com.sistemacontable.sistema_contable.ElectroAndes.Model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "articles")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- 1. DATOS GENERALES ---
    @Column(name = "reference", unique = true, nullable = false)
    private String referencia;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "familia")
    private String familia;

    @Column(name = "habilitado")
    private boolean habilitado;

    @Column(name = "envase_si_no")
    private Boolean envaseSiNo;

    @Column(name = "unidades_por_envase")
    private Integer unidadesPorEnvase;

    // --- 2. PRECIO COMPRA ---
    @Enumerated(EnumType.STRING)
    private IvaModality modalidadIvaCompra;

    @ManyToOne
    @JoinColumn(name = "id_proveedor_habitual")
    private Proveedor proveedorHabitual;

    @Column(precision = 19, scale = 2)
    private BigDecimal costoDivisa;

    @Column(precision = 19, scale = 2)
    private BigDecimal costoPromedio;

    @Column(precision = 19, scale = 2)
    private BigDecimal costoBase;

    @Enumerated(EnumType.STRING)
    private Divisa divisa;

    // --- 3. PRECIO VENTA ---
    @Enumerated(EnumType.STRING)
    private IvaModality modalidadIvaVenta;

    @Column(precision = 19, scale = 2)
    private BigDecimal precioPublico;

    @Column(precision = 19, scale = 2)
    private BigDecimal precioMayorista;

    private Double descuentoMaximo;

    // --- 4. LISTA DE PRECIOS ---
    private String listaPrecios;

    // --- 5. STOCKS ---
    private Integer stockMinimo;
    private Integer stockMaximo;
    private Integer stockFisico;
    private Integer stockPendienteRecibir;

    @OneToMany(mappedBy = "articulo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArticuloProveedor> proveedoresAsociados = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String comentarios;

    public Article() {
    }

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

    public Proveedor getProveedorHabitual() {
        return proveedorHabitual;
    }

    public void setProveedorHabitual(Proveedor proveedorHabitual) {
        this.proveedorHabitual = proveedorHabitual;
    }

    public BigDecimal getCostoDivisa() {
        return costoDivisa;
    }

    public void setCostoDivisa(BigDecimal costoDivisa) {
        this.costoDivisa = costoDivisa;
    }

    public BigDecimal getCostoPromedio() {
        return costoPromedio;
    }

    public void setCostoPromedio(BigDecimal costoPromedio) {
        this.costoPromedio = costoPromedio;
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

    public Integer getStockFisico() {
        return stockFisico;
    }

    public void setStockFisico(Integer stockFisico) {
        this.stockFisico = stockFisico;
    }

    public Integer getStockPendienteRecibir() {
        return stockPendienteRecibir;
    }

    public void setStockPendienteRecibir(Integer stockPendienteRecibir) {
        this.stockPendienteRecibir = stockPendienteRecibir;
    }

    public List<ArticuloProveedor> getProveedoresAsociados() {
        return proveedoresAsociados;
    }

    public void setProveedoresAsociados(List<ArticuloProveedor> proveedoresAsociados) {
        this.proveedoresAsociados = proveedoresAsociados;
    }

    public String getComentarios() {
        return comentarios;
    }

    public void setComentarios(String comentarios) {
        this.comentarios = comentarios;
    }
}
