package com.sistemacontable.sistema_contable.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ResponseOrdenCompraDto {
    private Long id;
    private String numeroOrdenCompra;
    private LocalDate fechaEmision;
    private String proveedorNombre;
    private String solicitudNumero;
    private BigDecimal subtotal;
    private BigDecimal iva;
    private BigDecimal total;
    private String moneda;
    private List<ResponseDetalleOrdenDto> detalles;
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNumeroOrdenCompra() {
        return numeroOrdenCompra;
    }
    public void setNumeroOrdenCompra(String numeroOrdenCompra) {
        this.numeroOrdenCompra = numeroOrdenCompra;
    }
    public LocalDate getFechaEmision() {
        return fechaEmision;
    }
    public void setFechaEmision(LocalDate fechaEmision) {
        this.fechaEmision = fechaEmision;
    }
    public String getProveedorNombre() {
        return proveedorNombre;
    }
    public void setProveedorNombre(String proveedorNombre) {
        this.proveedorNombre = proveedorNombre;
    }
    public String getSolicitudNumero() {
        return solicitudNumero;
    }
    public void setSolicitudNumero(String solicitudNumero) {
        this.solicitudNumero = solicitudNumero;
    }
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
    public BigDecimal getIva() {
        return iva;
    }
    public void setIva(BigDecimal iva) {
        this.iva = iva;
    }
    public BigDecimal getTotal() {
        return total;
    }
    public void setTotal(BigDecimal total) {
        this.total = total;
    }
    public String getMoneda() {
        return moneda;
    }
    public void setMoneda(String moneda) {
        this.moneda = moneda;
    }
    public List<ResponseDetalleOrdenDto> getDetalles() {
        return detalles;
    }
    public void setDetalles(List<ResponseDetalleOrdenDto> detalles) {
        this.detalles = detalles;
    }
    
}