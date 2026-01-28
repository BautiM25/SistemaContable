package com.sistemacontable.sistema_contable.dto;

import java.math.BigDecimal;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.CategoriaIva;

public class CreateProveedorDto {

    // --- GENERAL ---
    private String nombre;
    private String direccion;
    private String cuitCuil;
    private String telefono;
    private String mail;
    private String rubro;

    // --- COMERCIAL ---
    private String divisa;
    private BigDecimal saldosAFavor;
    private BigDecimal saldoInicialCC;
    private String subcuenta;
    private CategoriaIva categoriaIva;

    // --- BANCO ---
    private String identificadorBanco;
    private String pais;
    private String banco;

    // --- ESPECIFICAS ---
    private String producto;
    private Double variacionPrecio;
    private BigDecimal precio;
    private Double variacionDescuento;
    private Double descuento;
    private String comentario;

    public CreateProveedorDto() {
    }

    // Getters y Setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getCuitCuil() {
        return cuitCuil;
    }

    public void setCuitCuil(String cuitCuil) {
        this.cuitCuil = cuitCuil;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getRubro() {
        return rubro;
    }

    public void setRubro(String rubro) {
        this.rubro = rubro;
    }

    public String getDivisa() {
        return divisa;
    }

    public void setDivisa(String divisa) {
        this.divisa = divisa;
    }

    public BigDecimal getSaldosAFavor() {
        return saldosAFavor;
    }

    public void setSaldosAFavor(BigDecimal saldosAFavor) {
        this.saldosAFavor = saldosAFavor;
    }

    public BigDecimal getSaldoInicialCC() {
        return saldoInicialCC;
    }

    public void setSaldoInicialCC(BigDecimal saldoInicialCC) {
        this.saldoInicialCC = saldoInicialCC;
    }

    public String getSubcuenta() {
        return subcuenta;
    }

    public void setSubcuenta(String subcuenta) {
        this.subcuenta = subcuenta;
    }

    public CategoriaIva getCategoriaIva() {
        return categoriaIva;
    }

    public void setCategoriaIva(CategoriaIva categoriaIva) {
        this.categoriaIva = categoriaIva;
    }

    public String getIdentificadorBanco() {
        return identificadorBanco;
    }

    public void setIdentificadorBanco(String identificadorBanco) {
        this.identificadorBanco = identificadorBanco;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getBanco() {
        return banco;
    }

    public void setBanco(String banco) {
        this.banco = banco;
    }

    public String getProducto() {
        return producto;
    }

    public void setProducto(String producto) {
        this.producto = producto;
    }

    public Double getVariacionPrecio() {
        return variacionPrecio;
    }

    public void setVariacionPrecio(Double variacionPrecio) {
        this.variacionPrecio = variacionPrecio;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public Double getVariacionDescuento() {
        return variacionDescuento;
    }

    public void setVariacionDescuento(Double variacionDescuento) {
        this.variacionDescuento = variacionDescuento;
    }

    public Double getDescuento() {
        return descuento;
    }

    public void setDescuento(Double descuento) {
        this.descuento = descuento;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}
