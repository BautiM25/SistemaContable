// src/main/java/com/sistemacontable/sistema_contable/ElectroAndes/Model/DetalleSolicitudCompra.java
package com.sistemacontable.sistema_contable.ElectroAndes.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "detalle_solicitud_compra")
public class DetalleSolicitudCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle_solicitud")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_solicitud_compra", nullable = false)
    private SolicitudCompra solicitudCompra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_articulo", nullable = false)
    private Article articulo; // Usamos Article como en ArticleServiceImp

    @Column(name = "cantidad_requerida", nullable = false)
    private Integer cantidadRequerida;

    @Column(name = "motivo_compra")
    private String motivoCompra;

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SolicitudCompra getSolicitudCompra() {
        return solicitudCompra;
    }

    public void setSolicitudCompra(SolicitudCompra solicitudCompra) {
        this.solicitudCompra = solicitudCompra;
    }

    public Article getArticulo() {
        return articulo;
    }

    public void setArticulo(Article articulo) {
        this.articulo = articulo;
    }

    public Integer getCantidadRequerida() {
        return cantidadRequerida;
    }

    public void setCantidadRequerida(Integer cantidadRequerida) {
        this.cantidadRequerida = cantidadRequerida;
    }

    public String getMotivoCompra() {
        return motivoCompra;
    }

    public void setMotivoCompra(String motivoCompra) {
        this.motivoCompra = motivoCompra;
    }
}