package com.sistemacontable.sistema_contable.ElectroAndes.Model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "seguimiento_ordenes")
public class SeguimientoOrdenCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_solicitud")
    private SolicitudCompra solicitudCompra; // 1

    @Column(name = "fecha_recepcion")
    private LocalDate fechaRecepcion; // 2

    @Column(name = "fecha_recepcion_cotizacion")
    private LocalDate fechaRecepcionCotizacion; // 3

    @Column(name = "fecha_adjudicacion")
    private LocalDate fechaAdjudicacion; // 4

    @Column(name = "datos_adjudicacion", columnDefinition = "TEXT")
    private String datosAdjudicacion; // 5

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_oc")
    private OrdenCompra ordenCompra; // 6

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_proveedor")
    private Proveedor proveedor; // 7

    @Column(name = "fecha_entrega_real")
    private LocalDate fechaEntrega; // 8

    @Column(name = "numero_informe_recepcion")
    private String numeroInformeRecepcion; // 9

    @Column(columnDefinition = "TEXT")
    private String observaciones; // 10

    public SeguimientoOrdenCompra() {}

    // --- GETTERS Y SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public SolicitudCompra getSolicitudCompra() { return solicitudCompra; }
    public void setSolicitudCompra(SolicitudCompra solicitudCompra) { this.solicitudCompra = solicitudCompra; }

    public LocalDate getFechaRecepcion() { return fechaRecepcion; }
    public void setFechaRecepcion(LocalDate fechaRecepcion) { this.fechaRecepcion = fechaRecepcion; }

    public LocalDate getFechaRecepcionCotizacion() { return fechaRecepcionCotizacion; }
    public void setFechaRecepcionCotizacion(LocalDate fechaRecepcionCotizacion) { this.fechaRecepcionCotizacion = fechaRecepcionCotizacion; }

    public LocalDate getFechaAdjudicacion() { return fechaAdjudicacion; }
    public void setFechaAdjudicacion(LocalDate fechaAdjudicacion) { this.fechaAdjudicacion = fechaAdjudicacion; }

    public String getDatosAdjudicacion() { return datosAdjudicacion; }
    public void setDatosAdjudicacion(String datosAdjudicacion) { this.datosAdjudicacion = datosAdjudicacion; }

    public OrdenCompra getOrdenCompra() { return ordenCompra; }
    public void setOrdenCompra(OrdenCompra ordenCompra) { this.ordenCompra = ordenCompra; }

    public Proveedor getProveedor() { return proveedor; }
    public void setProveedor(Proveedor proveedor) { this.proveedor = proveedor; }

    public LocalDate getFechaEntrega() { return fechaEntrega; }
    public void setFechaEntrega(LocalDate fechaEntrega) { this.fechaEntrega = fechaEntrega; }

    public String getNumeroInformeRecepcion() { return numeroInformeRecepcion; }
    public void setNumeroInformeRecepcion(String numeroInformeRecepcion) { this.numeroInformeRecepcion = numeroInformeRecepcion; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}