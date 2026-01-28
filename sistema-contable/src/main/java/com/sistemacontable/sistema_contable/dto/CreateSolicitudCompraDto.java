package com.sistemacontable.sistema_contable.dto;

import java.util.List;

public class CreateSolicitudCompraDto {
    private String numeroSolicitud;
    private List<CreateDetalleSolicitudDto> detalles;
    
    public String getNumeroSolicitud() {
        return numeroSolicitud;
    }
    public void setNumeroSolicitud(String numeroSolicitud) {
        this.numeroSolicitud = numeroSolicitud;
    }
    public List<CreateDetalleSolicitudDto> getDetalles() {
        return detalles;
    }
    public void setDetalles(List<CreateDetalleSolicitudDto> detalles) {
        this.detalles = detalles;
    }
}
