package com.sistemacontable.sistema_contable.dto;

import java.time.LocalDate;
import java.util.List;

public class CreateAsientoDto {

    private String descripcion;
    private Long creador;
    private List<CreateDetalleAsientoDto> detalles;
    private LocalDate fecha;

    // Getters y Setters
    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Long getCreador() {
        return creador;
    }

    public void setCreador(Long creador) {
        this.creador = creador;
    }

    public List<CreateDetalleAsientoDto> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<CreateDetalleAsientoDto> detalles) {
        this.detalles = detalles;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
}
