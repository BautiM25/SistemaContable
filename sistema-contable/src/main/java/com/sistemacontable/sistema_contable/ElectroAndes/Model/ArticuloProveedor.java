package com.sistemacontable.sistema_contable.ElectroAndes.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "articulo_proveedor")
public class ArticuloProveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_articulo")
    private Article articulo;

    @ManyToOne
    @JoinColumn(name = "id_proveedor")
    private Proveedor proveedor;

    @Column(name = "variacion_precio")
    private Double variacionPrecio;

    @Column(precision = 19, scale = 2)
    private BigDecimal precio;

    @Column(name = "variacion_descuento")
    private Double variacionDescuento;

    private Double descuento;

    public ArticuloProveedor() {}

    // GETTERS Y SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Article getArticulo() { return articulo; }
    public void setArticulo(Article articulo) { this.articulo = articulo; }

    public Proveedor getProveedor() { return proveedor; }
    public void setProveedor(Proveedor proveedor) { this.proveedor = proveedor; }

    public Double getVariacionPrecio() { return variacionPrecio; }
    public void setVariacionPrecio(Double variacionPrecio) { this.variacionPrecio = variacionPrecio; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public Double getVariacionDescuento() { return variacionDescuento; }
    public void setVariacionDescuento(Double variacionDescuento) { this.variacionDescuento = variacionDescuento; }

    public Double getDescuento() { return descuento; }
    public void setDescuento(Double descuento) { this.descuento = descuento; }
}