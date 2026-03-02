package com.sistemacontable.sistema_contable.ElectroAndes.Model;

import java.math.BigDecimal;

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
@Table(name = "articulo_proveedor")
public class ArticuloProveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_articulo")
    private Article articulo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_proveedor")
    private Proveedor proveedor;

    @Column(precision = 19, scale = 2)
    private BigDecimal precio; // El precio específico de este proveedor

    private Double descuento;

    @Column(name = "variacion_precio")
    private Double variacionPrecio;

    @Column(name = "variacion_descuento")
    private Double variacionDescuento;

    public ArticuloProveedor() {
    }

    // --- GETTERS Y SETTERS ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Article getArticulo() {
        return articulo;
    }

    public void setArticulo(Article articulo) {
        this.articulo = articulo;
    }

    public Proveedor getProveedor() {
        return proveedor;
    }

    public void setProveedor(Proveedor proveedor) {
        this.proveedor = proveedor;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public Double getDescuento() {
        return descuento;
    }

    public void setDescuento(Double descuento) {
        this.descuento = descuento;
    }

    public Double getVariacionPrecio() {
        return variacionPrecio;
    }

    public void setVariacionPrecio(Double variacionPrecio) {
        this.variacionPrecio = variacionPrecio;
    }

    public Double getVariacionDescuento() {
        return variacionDescuento;
    }

    public void setVariacionDescuento(Double variacionDescuento) {
        this.variacionDescuento = variacionDescuento;
    }
}
