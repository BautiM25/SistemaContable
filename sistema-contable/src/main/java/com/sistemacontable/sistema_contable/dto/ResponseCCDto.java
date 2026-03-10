package com.sistemacontable.sistema_contable.dto;

import java.util.List;

public class ResponseCCDto {

    private String nombreProveedor;
    private Double saldoInicial;
    private Double saldoActual;
    private List<MovimientoCCDto> movimientos;

    // Getters y Setters...
    public String getNombreProveedor() {
        return nombreProveedor;
    }

    public void setNombreProveedor(String nombreProveedor) {
        this.nombreProveedor = nombreProveedor;
    }

    public Double getSaldoInicial() {
        return saldoInicial;
    }

    public void setSaldoInicial(Double saldoInicial) {
        this.saldoInicial = saldoInicial;
    }

    public Double getSaldoActual() {
        return saldoActual;
    }

    public void setSaldoActual(Double saldoActual) {
        this.saldoActual = saldoActual;
    }

    public List<MovimientoCCDto> getMovimientos() {
        return movimientos;
    }

    public void setMovimientos(List<MovimientoCCDto> movimientos) {
        this.movimientos = movimientos;
    }

}
