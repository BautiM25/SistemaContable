package com.sistemacontable.sistema_contable.dto;

import java.time.LocalDate;
import java.util.List;

public class OrdenDeCompraDto {
    private LocalDate fechaEmision;
    private Integer nroOrden;
    private Long idProveedor;
    private Long idUsuario;
    private List<DetalleOrdenDto> detalles;

    // Getters y Setters
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

    public Long getIdProveedor() {
        return idProveedor;
    }

    public void setIdProveedor(Long idProveedor) {
        this.idProveedor = idProveedor;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public List<DetalleOrdenDto> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleOrdenDto> detalles) {
        this.detalles = detalles;
    }
}