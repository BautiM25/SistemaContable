package com.sistemacontable.sistema_contable.dto;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Cuenta;

public class CreateDetalleAsientoDto {

    private Double debe;
    private Double haber;
    private Long cuenta;

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
