package com.sistemacontable.sistema_contable.dto;

import java.time.LocalDate;
import java.util.List;

public class ResponseAsientoDto {
    private Long id;
    private LocalDate fecha;
    private String descripcion;
    private String creador; // o un objeto con nombre + rol

    private List<ResponseDetalleDto> detalles;

    public ResponseAsientoDto() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCreador() {
        return creador;
    }

    public void setCreador(String creador) {
        this.creador = creador;
    }

    public List<ResponseDetalleDto> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<ResponseDetalleDto> detalles) {
        this.detalles = detalles;
    }
}
