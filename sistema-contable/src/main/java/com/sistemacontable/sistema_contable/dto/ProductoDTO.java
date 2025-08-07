package com.sistemacontable.sistema_contable.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class ProductoDTO {

    private Integer idProducto;

    @NotBlank
    private String codigo;

    @NotBlank
    private String nombre;

    private String descripcion;

    private String categoria;

    @PositiveOrZero
    private double precioCompra;

    @Positive
    private double precioVenta;

    @PositiveOrZero
    private int stockMinimo;

    @NotBlank
    private String presentacion;

    @PositiveOrZero
    private double ivaCompra;

    @PositiveOrZero
    private double ivaVenta;

    private boolean activo;

    private List<Long> proveedoresIds;

    public ProductoDTO() {}

    public ProductoDTO(Integer idProducto, String codigo, String nombre, String descripcion,
                       String categoria, double precioCompra, double precioVenta,
                       int stockMinimo, String presentacion, double ivaCompra,
                       double ivaVenta, boolean activo, List<Long> proveedoresIds) {
        this.idProducto = idProducto;
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.precioCompra = precioCompra;
        this.precioVenta = precioVenta;
        this.stockMinimo = stockMinimo;
        this.presentacion = presentacion;
        this.ivaCompra = ivaCompra;
        this.ivaVenta = ivaVenta;
        this.activo = activo;
        this.proveedoresIds = proveedoresIds;
    }

    // Getters y Setters

    public Integer getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public double getPrecioCompra() {
        return precioCompra;
    }

    public void setPrecioCompra(double precioCompra) {
        this.precioCompra = precioCompra;
    }

    public double getPrecioVenta() {
        return precioVenta;
    }

    public void setPrecioVenta(double precioVenta) {
        this.precioVenta = precioVenta;
    }

    public int getStockMinimo() {
        return stockMinimo;
    }

    public void setStockMinimo(int stockMinimo) {
        this.stockMinimo = stockMinimo;
    }

    public String getPresentacion() {
        return presentacion;
    }

    public void setPresentacion(String presentacion) {
        this.presentacion = presentacion;
    }

    public double getIvaCompra() {
        return ivaCompra;
    }

    public void setIvaCompra(double ivaCompra) {
        this.ivaCompra = ivaCompra;
    }

    public double getIvaVenta() {
        return ivaVenta;
    }

    public void setIvaVenta(double ivaVenta) {
        this.ivaVenta = ivaVenta;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public List<Long> getProveedoresIds() {
        return proveedoresIds;
    }

    public void setProveedoresIds(List<Long> proveedoresIds) {
        this.proveedoresIds = proveedoresIds;
    }
}