package com.sistemacontable.sistema_contable.dto;

public class ResponseDetalleDto {
    private Long id;
    private double debe;
    private double haber;
    private String cuentaNombre;

    public ResponseDetalleDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getDebe() {
        return debe;
    }

    public void setDebe(double debe) {
        this.debe = debe;
    }

    public double getHaber() {
        return haber;
    }

    public void setHaber(double haber) {
        this.haber = haber;
    }

    public String getCuentaNombre() {
        return cuentaNombre;
    }

    public void setCuentaNombre(String cuentaNombre) {
        this.cuentaNombre = cuentaNombre;
    }
}
