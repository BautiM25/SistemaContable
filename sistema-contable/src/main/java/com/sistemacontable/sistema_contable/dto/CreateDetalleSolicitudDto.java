// src/main/java/com/sistemacontable/sistema_contable/dto/CreateDetalleSolicitudDto.java
package com.sistemacontable.sistema_contable.dto;

public class CreateDetalleSolicitudDto {
    private Long idArticulo;
    private Integer cantidadRequerida;
    private String motivoCompra;

    // Getters y Setters

    public Long getIdArticulo() {
        return idArticulo;
    }

    public void setIdArticulo(Long idArticulo) {
        this.idArticulo = idArticulo;
    }

    public Integer getCantidadRequerida() {
        return cantidadRequerida;
    }

    public void setCantidadRequerida(Integer cantidadRequerida) {
        this.cantidadRequerida = cantidadRequerida;
    }

    public String getMotivoCompra() {
        return motivoCompra;
    }

    public void setMotivoCompra(String motivoCompra) {
        this.motivoCompra = motivoCompra;
    }
}