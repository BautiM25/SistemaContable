package com.sistemacontable.sistema_contable.dto;

import java.time.LocalDate;
import java.util.List;

public class OrdenDeCompraResponse {
    private Long id;
    private LocalDate fechaEmision;
    private Integer nroOrden;
    private String proveedorNombre;
    private String usuarioNombre;
    private List<DetalleOrdenResponse> detalles;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getFechaEmision() {
        return fechaEmision;
    }

    public void setFechaEmision(LocalDate fechaEmision) {
        this.fechaEmision = fechaEmision;
    }

    public Integer getNroOrden() {
        return nroOrden;
    }

    public void setNroOrden(Integer nroOrden) {
        this.nroOrden = nroOrden;
    }

    public String getProveedorNombre() {
        return proveedorNombre;
    }

    public void setProveedorNombre(String proveedorNombre) {
        this.proveedorNombre = proveedorNombre;
    }

    public String getUsuarioNombre() {
        return usuarioNombre;
    }

    public void setUsuarioNombre(String usuarioNombre) {
        this.usuarioNombre = usuarioNombre;
    }

    public List<DetalleOrdenResponse> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleOrdenResponse> detalles) {
        this.detalles = detalles;
    }
}