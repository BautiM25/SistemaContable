// src/main/java/com/sistemacontable/sistema_contable/dto/ResponseSolicitudCompraDto.java
package com.sistemacontable.sistema_contable.dto;

import java.time.LocalDate;
import java.util.List;

public class ResponseSolicitudCompraDto {
    private Long id;
    private String numeroSolicitud;
    private LocalDate fechaSolicitud;
    private Long idUsuarioSolicitante;
    private String nombreUsuarioSolicitante;
    private String justificacionGeneral;
    private String estado;
    private List<ResponseDetalleSolicitudDto> detalles;

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroSolicitud() {
        return numeroSolicitud;
    }

    public void setNumeroSolicitud(String numeroSolicitud) {
        this.numeroSolicitud = numeroSolicitud;
    }

    public LocalDate getFechaSolicitud() {
        return fechaSolicitud;
    }

    public void setFechaSolicitud(LocalDate fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
    }

    public Long getIdUsuarioSolicitante() {
        return idUsuarioSolicitante;
    }

    public void setIdUsuarioSolicitante(Long idUsuarioSolicitante) {
        this.idUsuarioSolicitante = idUsuarioSolicitante;
    }

    public String getNombreUsuarioSolicitante() {
        return nombreUsuarioSolicitante;
    }

    public void setNombreUsuarioSolicitante(String nombreUsuarioSolicitante) {
        this.nombreUsuarioSolicitante = nombreUsuarioSolicitante;
    }

    public String getJustificacionGeneral() {
        return justificacionGeneral;
    }

    public void setJustificacionGeneral(String justificacionGeneral) {
        this.justificacionGeneral = justificacionGeneral;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public List<ResponseDetalleSolicitudDto> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<ResponseDetalleSolicitudDto> detalles) {
        this.detalles = detalles;
    }
}