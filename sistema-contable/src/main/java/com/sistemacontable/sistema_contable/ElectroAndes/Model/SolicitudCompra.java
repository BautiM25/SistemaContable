package com.sistemacontable.sistema_contable.ElectroAndes.Model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "solicitudes_compra")
public class SolicitudCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitud")
    private Long id;

    @Column(name = "numero_solicitud", nullable = false, unique = true)
    private String numeroSolicitud;

    @Column(name = "fecha_emision_oc")
    private LocalDate fechaEmisionOC;

    @OneToMany(mappedBy = "solicitud", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleSolicitud> detalles = new ArrayList<>();

    // --- CONSTRUCTORES ---
    public SolicitudCompra() {
    }

    // --- GETTERS Y SETTERS ---
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

    public LocalDate getFechaEmisionOC() {
        return fechaEmisionOC;
    }

    public void setFechaEmisionOC(LocalDate fechaEmisionOC) {
        this.fechaEmisionOC = fechaEmisionOC;
    }

    public List<DetalleSolicitud> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleSolicitud> detalles) {
        this.detalles = detalles;
    }

    // Método de conveniencia para agregar detalles
    public void addDetalle(DetalleSolicitud detalle) {
        detalles.add(detalle);
        detalle.setSolicitud(this);
    }
}
