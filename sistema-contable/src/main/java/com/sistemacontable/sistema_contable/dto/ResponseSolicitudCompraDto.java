package com.sistemacontable.sistema_contable.dto;

import java.time.LocalDate;
import java.util.List;

public class ResponseSolicitudCompraDto {
    private Long id;
    private String numeroSolicitud;
    private LocalDate fechaEmisionOC;
    private boolean estado;
    private List<ResponseDetalleSolicitudDto> detalles;
    
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
    public LocalDate getFechaEmisionOC() {
        return fechaEmisionOC;
    }
    public void setFechaEmisionOC(LocalDate fechaEmisionOC) {
        this.fechaEmisionOC = fechaEmisionOC;
    }
    public boolean isEstado() {
        return estado;
    }
    public void setEstado(boolean estado) {
        this.estado = estado;
    }
    public List<ResponseDetalleSolicitudDto> getDetalles() {
        return detalles;
    }
    public void setDetalles(List<ResponseDetalleSolicitudDto> detalles) {
        this.detalles = detalles;
    }

}
