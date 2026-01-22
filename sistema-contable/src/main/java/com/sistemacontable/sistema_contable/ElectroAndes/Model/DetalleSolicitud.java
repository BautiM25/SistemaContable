package com.sistemacontable.sistema_contable.ElectroAndes.Model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "detalles_solicitud")
public class DetalleSolicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_solicitud")
    private SolicitudCompra solicitud;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_articulo")
    private Article articulo; // Vinculado a tu clase Article (Cód. Artículo Interno)

    private String descripcion; // Por si se desea una descripción distinta a la del maestro

    @Column(columnDefinition = "TEXT")
    private String especificacionesTecnicas;

    private Double cantidad;

    private String medida; // Ej: Unidades, Metros, Kg

    private String observaciones;

    @Column(name = "fecha_limite")
    private LocalDate fechaLimite;

    @Column(name = "accion_duplicar_modificar")
    private String accion; // Para manejar el estado "¿Modificar o Duplicar?"

    // --- CONSTRUCTORES ---
    public DetalleSolicitud() {
    }

    // --- GETTERS Y SETTERS ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SolicitudCompra getSolicitud() {
        return solicitud;
    }

    public void setSolicitud(SolicitudCompra solicitud) {
        this.solicitud = solicitud;
    }

    public Article getArticulo() {
        return articulo;
    }

    public void setArticulo(Article articulo) {
        this.articulo = articulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getEspecificacionesTecnicas() {
        return especificacionesTecnicas;
    }

    public void setEspecificacionesTecnicas(String especificacionesTecnicas) {
        this.especificacionesTecnicas = especificacionesTecnicas;
    }

    public Double getCantidad() {
        return cantidad;
    }

    public void setCantidad(Double cantidad) {
        this.cantidad = cantidad;
    }

    public String getMedida() {
        return medida;
    }

    public void setMedida(String medida) {
        this.medida = medida;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public LocalDate getFechaLimite() {
        return fechaLimite;
    }

    public void setFechaLimite(LocalDate fechaLimite) {
        this.fechaLimite = fechaLimite;
    }

    public String getAccion() {
        return accion;
    }

    public void setAccion(String accion) {
        this.accion = accion;
    }
}
