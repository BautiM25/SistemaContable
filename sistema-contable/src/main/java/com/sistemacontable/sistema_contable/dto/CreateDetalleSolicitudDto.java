package com.sistemacontable.sistema_contable.dto;

import java.time.LocalDate;

public class CreateDetalleSolicitudDto {
    private Long idArticulo;
    private String descripcion;
    private String especificacionesTecnicas;
    private Double cantidad;
    private String medida;
    private String observaciones;
    private LocalDate fechaLimite;
    private String accion; // "Modificar" o "Duplicar"
    
    public Long getIdArticulo() {
        return idArticulo;
    }
    public void setIdArticulo(Long idArticulo) {
        this.idArticulo = idArticulo;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public String getEspecificacionesTecnicas() {
        return especificacionesTecnicas;
    }
    public void setEspecificacionesTecnicas(String especificacionesTecnicas) {
        this.especificacionesTecnicas = especificacionesTecnicas;
    }
    public Double getCantidad() {
        return cantidad;
    }
    public void setCantidad(Double cantidad) {
        this.cantidad = cantidad;
    }
    public String getMedida() {
        return medida;
    }
    public void setMedida(String medida) {
        this.medida = medida;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    public LocalDate getFechaLimite() {
        return fechaLimite;
    }
    public void setFechaLimite(LocalDate fechaLimite) {
        this.fechaLimite = fechaLimite;
    }
    public String getAccion() {
        return accion;
    }
    public void setAccion(String accion) {
        this.accion = accion;
    }

    
}