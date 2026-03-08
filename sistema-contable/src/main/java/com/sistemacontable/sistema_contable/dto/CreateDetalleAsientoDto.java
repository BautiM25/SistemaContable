package com.sistemacontable.sistema_contable.dto;

public class CreateDetalleAsientoDto {

    private Double debe;
    private Double haber;
    private Long cuenta;

    public CreateDetalleAsientoDto() {
    }

    public CreateDetalleAsientoDto(Long cuenta, Double debe, Double haber) {
        this.cuenta = cuenta;
        this.debe = debe;
        this.haber = haber;
    }
    // Getters y Setters

    public Double getDebe() {
        return debe;
    }

    public void setDebe(Double debe) {
        this.debe = debe;
    }

    public Double getHaber() {
        return haber;
    }

    public void setHaber(Double haber) {
        this.haber = haber;
    }

    public Long getCuenta() {
        return cuenta;
    }

    public void setCuenta(Long cuenta) {
        this.cuenta = cuenta;
    }
}
