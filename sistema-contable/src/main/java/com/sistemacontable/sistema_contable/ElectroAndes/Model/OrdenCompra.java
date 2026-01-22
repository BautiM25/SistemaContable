package com.sistemacontable.sistema_contable.ElectroAndes.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ordenes_compra")
public class OrdenCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_oc", nullable = false, unique = true)
    private String numeroOrdenCompra; // 1

    @Column(name = "fecha_emision")
    private LocalDate fechaEmision; // 2

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_solicitud")
    private SolicitudCompra solicitudAsociada; // 3

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_proveedor")
    private Proveedor proveedor; // 4

    @Enumerated(EnumType.STRING)
    private Divisa moneda; // 11 (Usando el Enum de Article)

    private String condicionesPago; // 12
    
    @Column(columnDefinition = "TEXT")
    private String observaciones; // 13

    private String comprador; // 14

    @Column(name = "es_modificacion")
    private boolean esModificacion; // 15

    // --- TOTALES FINANCIEROS ---
    @Column(precision = 19, scale = 2)
    private BigDecimal subtotal; // 16

    @Column(precision = 19, scale = 2)
    private BigDecimal descuentoGeneral; // 17

    @Column(precision = 19, scale = 2)
    private BigDecimal recargo; // 18

    @Column(name = "impuestos_internos", precision = 19, scale = 2)
    private BigDecimal impuestosInternos; // 19

    @Column(precision = 19, scale = 2)
    private BigDecimal iva; // 20

    @Column(name = "percepcion_iva", precision = 19, scale = 2)
    private BigDecimal percepcionIva; // 21

    @Column(precision = 19, scale = 2)
    private BigDecimal total; // 22

    @OneToMany(mappedBy = "ordenCompra", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleOrdenCompra> detalles = new ArrayList<>();

    public OrdenCompra() {}

    // --- GETTERS Y SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroOrdenCompra() { return numeroOrdenCompra; }
    public void setNumeroOrdenCompra(String numeroOrdenCompra) { this.numeroOrdenCompra = numeroOrdenCompra; }

    public LocalDate getFechaEmision() { return fechaEmision; }
    public void setFechaEmision(LocalDate fechaEmision) { this.fechaEmision = fechaEmision; }

    public SolicitudCompra getSolicitudAsociada() { return solicitudAsociada; }
    public void setSolicitudAsociada(SolicitudCompra solicitudAsociada) { this.solicitudAsociada = solicitudAsociada; }

    public Proveedor getProveedor() { return proveedor; }
    public void setProveedor(Proveedor proveedor) { this.proveedor = proveedor; }

    public Divisa getMoneda() { return moneda; }
    public void setMoneda(Divisa moneda) { this.moneda = moneda; }

    public String getCondicionesPago() { return condicionesPago; }
    public void setCondicionesPago(String condicionesPago) { this.condicionesPago = condicionesPago; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public String getComprador() { return comprador; }
    public void setComprador(String comprador) { this.comprador = comprador; }

    public boolean isEsModificacion() { return esModificacion; }
    public void setEsModificacion(boolean esModificacion) { this.esModificacion = esModificacion; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getDescuentoGeneral() { return descuentoGeneral; }
    public void setDescuentoGeneral(BigDecimal descuentoGeneral) { this.descuentoGeneral = descuentoGeneral; }

    public BigDecimal getRecargo() { return recargo; }
    public void setRecargo(BigDecimal recargo) { this.recargo = recargo; }

    public BigDecimal getImpuestosInternos() { return impuestosInternos; }
    public void setImpuestosInternos(BigDecimal impuestosInternos) { this.impuestosInternos = impuestosInternos; }

    public BigDecimal getIva() { return iva; }
    public void setIva(BigDecimal iva) { this.iva = iva; }

    public BigDecimal getPercepcionIva() { return percepcionIva; }
    public void setPercepcionIva(BigDecimal percepcionIva) { this.percepcionIva = percepcionIva; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public List<DetalleOrdenCompra> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleOrdenCompra> detalles) { this.detalles = detalles; }
}