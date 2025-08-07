package com.sistemacontable.sistema_contable.dto;

import java.time.LocalDate;
import java.util.List;

public class SolicitudCompraDTO {
    private LocalDate fecha;
    private String division;
    private String centroCosto;
    private String comentario;
    private String estado;
    private List<DetalleSolicitudCompraDTO> detalles;

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public String getCentroCosto() {
        return centroCosto;
    }

    public void setCentroCosto(String centroCosto) {
        this.centroCosto = centroCosto;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public List<DetalleSolicitudCompraDTO> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleSolicitudCompraDTO> detalles) {
        this.detalles = detalles;
    }
}

