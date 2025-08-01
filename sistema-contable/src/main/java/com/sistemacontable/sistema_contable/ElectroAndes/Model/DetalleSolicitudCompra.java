package com.sistemacontable.sistema_contable.ElectroAndes.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "detalles_solicitud")
public class DetalleSolicitudCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "solicitud_id")
    @JsonBackReference
    private SolicitudCompra solicitud;


    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    private Double cantidad;

    private String presentacion;

    private LocalDate fechaLimite;

    private String observacion;

    public DetalleSolicitudCompra(Long id, SolicitudCompra solicitud, Producto producto, Double cantidad, String presentacion, LocalDate fechaLimite, String observacion) {
        this.id = id;
        this.solicitud = solicitud;
        this.producto = producto;
        this.cantidad = cantidad;
        this.presentacion = presentacion;
        this.fechaLimite = fechaLimite;
        this.observacion = observacion;
    }

    public DetalleSolicitudCompra() {
    }

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

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Double getCantidad() {
        return cantidad;
    }

    public void setCantidad(Double cantidad) {
        this.cantidad = cantidad;
    }

    public String getPresentacion() {
        return presentacion;
    }

    public void setPresentacion(String presentacion) {
        this.presentacion = presentacion;
    }

    public LocalDate getFechaLimite() {
        return fechaLimite;
    }

    public void setFechaLimite(LocalDate fechaLimite) {
        this.fechaLimite = fechaLimite;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }
}
