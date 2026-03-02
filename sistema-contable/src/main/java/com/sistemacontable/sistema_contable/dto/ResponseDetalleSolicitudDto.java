package com.sistemacontable.sistema_contable.dto;

import java.time.LocalDate;

public class ResponseDetalleSolicitudDto {

    private Long id;
    private Long idArticulo;
    private String articuloReferencia;
    private String articuloDescripcion;
    private Double cantidad;
    private String medida;
    private boolean estado;

    // 📌 NUEVOS CAMPOS
    private String especificacionesTecnicas;
    private String observaciones;
    private LocalDate fechaLimite;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdArticulo() {
        return idArticulo;
    }

    public void setIdArticulo(Long idArticulo) {
        this.idArticulo = idArticulo;
    }

    public String getArticuloReferencia() {
        return articuloReferencia;
    }

    public void setArticuloReferencia(String articuloReferencia) {
        this.articuloReferencia = articuloReferencia;
    }

    public String getArticuloDescripcion() {
        return articuloDescripcion;
    }

    public void setArticuloDescripcion(String articuloDescripcion) {
        this.articuloDescripcion = articuloDescripcion;
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

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    // 📌 GETTERS Y SETTERS NUEVOS
    public String getEspecificacionesTecnicas() {
        return especificacionesTecnicas;
    }

    public void setEspecificacionesTecnicas(String especificacionesTecnicas) {
        this.especificacionesTecnicas = especificacionesTecnicas;
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
}
