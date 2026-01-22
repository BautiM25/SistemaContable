package com.sistemacontable.sistema_contable.ElectroAndes.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "detalles_orden_compra")
public class DetalleOrdenCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_oc")
    private OrdenCompra ordenCompra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_articulo")
    private Article articulo; // 5. Cód. Artículo interno

    private Double bonificacion; // 6 (Porcentaje)

    private String medida; // 7

    @Column(name = "precio_unitario", precision = 19, scale = 2)
    private BigDecimal precioUnitario; // 8

    private Double cantidad; // 9

    @Column(name = "fecha_entrega")
    private LocalDate fechaEntrega; // 10

    @Column(name = "lugar_entrega")
    private String lugarEntrega; // 10

    public DetalleOrdenCompra() {}

    // --- GETTERS Y SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public OrdenCompra getOrdenCompra() { return ordenCompra; }
    public void setOrdenCompra(OrdenCompra ordenCompra) { this.ordenCompra = ordenCompra; }

    public Article getArticulo() { return articulo; }
    public void setArticulo(Article articulo) { this.articulo = articulo; }

    public Double getBonificacion() { return bonificacion; }
    public void setBonificacion(Double bonificacion) { this.bonificacion = bonificacion; }

    public String getMedida() { return medida; }
    public void setMedida(String medida) { this.medida = medida; }

    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }

    public Double getCantidad() { return cantidad; }
    public void setCantidad(Double cantidad) { this.cantidad = cantidad; }

    public LocalDate getFechaEntrega() { return fechaEntrega; }
    public void setFechaEntrega(LocalDate fechaEntrega) { this.fechaEntrega = fechaEntrega; }

    public String getLugarEntrega() { return lugarEntrega; }
    public void setLugarEntrega(String lugarEntrega) { this.lugarEntrega = lugarEntrega; }
}