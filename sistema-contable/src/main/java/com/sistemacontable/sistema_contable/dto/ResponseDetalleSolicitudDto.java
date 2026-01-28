package com.sistemacontable.sistema_contable.dto;

public class ResponseDetalleSolicitudDto {
    private Long id;
    private String articuloReferencia;
    private String articuloDescripcion;
    private Double cantidad;
    private String medida;
    private boolean estado;
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
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

}
