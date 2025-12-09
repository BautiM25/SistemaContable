package com.sistemacontable.sistema_contable.dto;

import java.util.List;

public class SolicitudCompraDTO {

    private String division;
    private String centroCosto;
    private String comentario;
    private String fechaLimiteGeneral;
    private List<DetalleSolicitudCompraDTO> items;

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

    public String getFechaLimiteGeneral() {
        return fechaLimiteGeneral;
    }

    public void setFechaLimiteGeneral(String fechaLimiteGeneral) {
        this.fechaLimiteGeneral = fechaLimiteGeneral;
    }

    public List<DetalleSolicitudCompraDTO> getItems() {
        return items;
    }

    public void setItems(List<DetalleSolicitudCompraDTO> items) {
        this.items = items;
    }
}
