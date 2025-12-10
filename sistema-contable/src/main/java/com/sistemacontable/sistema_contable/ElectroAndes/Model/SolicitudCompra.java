// src/main/java/com/sistemacontable/sistema_contable/ElectroAndes/Model/SolicitudCompra.java
package com.sistemacontable.sistema_contable.ElectroAndes.Model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "solicitudes_compra")
public class SolicitudCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitud_compra")
    private Long id;

    @Column(name = "numero_solicitud", nullable = false, unique = true)
    private String numeroSolicitud;

    @Column(name = "fecha_solicitud", nullable = false)
    private LocalDate fechaSolicitud;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_solicitante", nullable = false)
    private Usuario usuarioSolicitante; // Usuario que crea la solicitud

    @Column(name = "justificacion_general")
    private String justificacionGeneral;

    @Column(name = "estado", nullable = false)
    private String estado; // Ejemplo: 'PENDIENTE', 'APROBADA', 'RECHAZADA', 'ORDEN_GENERADA'

    @Column(name = "fecha_creacion")
    private LocalDate fechaCreacion;

    @OneToMany(mappedBy = "solicitudCompra", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleSolicitudCompra> detalles;

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroSolicitud() {
        return numeroSolicitud;
    }

    public void setNumeroSolicitud(String numeroSolicitud) {
        this.numeroSolicitud = numeroSolicitud;
    }

    public LocalDate getFechaSolicitud() {
        return fechaSolicitud;
    }

    public void setFechaSolicitud(LocalDate fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
    }

    public Usuario getUsuarioSolicitante() {
        return usuarioSolicitante;
    }

    public void setUsuarioSolicitante(Usuario usuarioSolicitante) {
        this.usuarioSolicitante = usuarioSolicitante;
    }

    public String getJustificacionGeneral() {
        return justificacionGeneral;
    }

    public void setJustificacionGeneral(String justificacionGeneral) {
        this.justificacionGeneral = justificacionGeneral;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDate getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDate fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public List<DetalleSolicitudCompra> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleSolicitudCompra> detalles) {
        this.detalles = detalles;
    }
}