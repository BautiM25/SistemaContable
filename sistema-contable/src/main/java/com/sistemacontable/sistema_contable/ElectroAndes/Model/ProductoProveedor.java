package com.sistemacontable.sistema_contable.ElectroAndes.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "producto_proveedor")
public class ProductoProveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "proveedor_id")
    private Proveedor proveedor;

    private Double precioAcordado;

    private String observaciones;

    public ProductoProveedor(Producto producto, Proveedor proveedor) {
    }

    public ProductoProveedor() {

    }

}