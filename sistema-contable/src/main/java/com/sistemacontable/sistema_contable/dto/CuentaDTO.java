package com.sistemacontable.sistema_contable.dto;

public class CuentaDTO {
    private Long id;
    private String nombreCuenta;
    private Boolean activado;
    private Boolean esHoja;
    private Long cuentaPadreId;

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreCuenta() {
        return nombreCuenta;
    }

    public void setNombreCuenta(String nombreCuenta) {
        this.nombreCuenta = nombreCuenta;
    }

    public Boolean getActivado() {
        return activado;
    }

    public void setActivado(Boolean activado) {
        this.activado = activado;
    }

    public Boolean getEsHoja() {
        return esHoja;
    }

    public void setEsHoja(Boolean esHoja) {
        this.esHoja = esHoja;
    }

    public Long getCuentaPadreId() {
        return cuentaPadreId;
    }

    public void setCuentaPadreId(Long cuentaPadreId) {
        this.cuentaPadreId = cuentaPadreId;
    }
}
