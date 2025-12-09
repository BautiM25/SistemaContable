package com.sistemacontable.sistema_contable.dto;

import java.time.LocalDate;

public class DetalleMayorDto {
    private Long id;
    private Double debe;
    private Double haber;
    private LocalDate fechaAsiento;
    private String descripcionAsiento;
    private String cuentaNombre;
    private Long cuentaId;

    // Constructor vacío
    public DetalleMayorDto() {}

    // Constructor con parámetros
    public DetalleMayorDto(Long id, Double debe, Double haber, LocalDate fechaAsiento, 
                          String descripcionAsiento, String cuentaNombre, Long cuentaId) {
        this.id = id;
        this.debe = debe;
        this.haber = haber;
        this.fechaAsiento = fechaAsiento;
        this.descripcionAsiento = descripcionAsiento;
        this.cuentaNombre = cuentaNombre;
        this.cuentaId = cuentaId;
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Double getDebe() { return debe; }
    public void setDebe(Double debe) { this.debe = debe; }
    
    public Double getHaber() { return haber; }
    public void setHaber(Double haber) { this.haber = haber; }
    
    public LocalDate getFechaAsiento() { return fechaAsiento; }
    public void setFechaAsiento(LocalDate fechaAsiento) { this.fechaAsiento = fechaAsiento; }
    
    public String getDescripcionAsiento() { return descripcionAsiento; }
    public void setDescripcionAsiento(String descripcionAsiento) { this.descripcionAsiento = descripcionAsiento; }
    
    public String getCuentaNombre() { return cuentaNombre; }
    public void setCuentaNombre(String cuentaNombre) { this.cuentaNombre = cuentaNombre; }
    
    public Long getCuentaId() { return cuentaId; }
    public void setCuentaId(Long cuentaId) { this.cuentaId = cuentaId; }
}