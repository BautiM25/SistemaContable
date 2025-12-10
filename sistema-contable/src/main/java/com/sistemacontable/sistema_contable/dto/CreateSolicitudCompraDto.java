// src/main/java/com/sistemacontable/sistema_contable/dto/CreateSolicitudCompraDto.java
package com.sistemacontable.sistema_contable.dto;

import java.util.List;

public class CreateSolicitudCompraDto {
    private String numeroSolicitud;
    private Long idUsuarioSolicitante;
    private String justificacionGeneral;
    private List<CreateDetalleSolicitudDto> detalles;

    // Getters y Setters

    public String getNumeroSolicitud() {
        return numeroSolicitud;
    }

    public void setNumeroSolicitud(String numeroSolicitud) {
        this.numeroSolicitud = numeroSolicitud;
    }

    public Long getIdUsuarioSolicitante() {
        return idUsuarioSolicitante;
    }

    public void setIdUsuarioSolicitante(Long idUsuarioSolicitante) {
        this.idUsuarioSolicitante = idUsuarioSolicitante;
    }

    public String getJustificacionGeneral() {
        return justificacionGeneral;
    }

    public void setJustificacionGeneral(String justificacionGeneral) {
        this.justificacionGeneral = justificacionGeneral;
    }

    public List<CreateDetalleSolicitudDto> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<CreateDetalleSolicitudDto> detalles) {
        this.detalles = detalles;
    }
}