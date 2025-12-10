// src/main/java/com/sistemacontable/sistema_contable/dto/ResponseDetalleSolicitudDto.java
package com.sistemacontable.sistema_contable.dto;

public class ResponseDetalleSolicitudDto {
    private Long id;
    private Long idArticulo;
    private String nombreArticulo;
    private String codigoArticulo;
    private Integer cantidadRequerida;
    private String motivoCompra;

    // Constructor vacío
    public ResponseDetalleSolicitudDto() {}

    // Getters y Setters

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

    public String getNombreArticulo() {
        return nombreArticulo;
    }

    public void setNombreArticulo(String nombreArticulo) {
        this.nombreArticulo = nombreArticulo;
    }

    public String getCodigoArticulo() {
        return codigoArticulo;
    }

    public void setCodigoArticulo(String codigoArticulo) {
        this.codigoArticulo = codigoArticulo;
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