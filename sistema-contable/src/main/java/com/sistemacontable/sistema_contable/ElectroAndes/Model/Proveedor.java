package com.sistemacontable.sistema_contable.ElectroAndes.Model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "proveedores")
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_proveedor")
    private Long id;

    // --- GENERAL ---
    @Column(nullable = false, length = 100)
    private String nombre;

    private String direccion;

    @Column(name = "cuit_cuil", length = 20, unique = true)
    private String cuitCuil;

    private String telefono;

    private String mail;

    private String rubro;

    // --- COMERCIAL ---
    private String divisa; // Ejemplo: "ARS", "USD"

    @Column(name = "saldos_a_favor", precision = 19, scale = 2)
    private BigDecimal saldosAFavor;

    @Column(name = "saldo_inicial_cc", precision = 19, scale = 2)
    private BigDecimal saldoInicialCC;

    private String subcuenta;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria_iva")
    private CategoriaIva categoriaIva;

    // --- BANCO ---
    @Column(name = "identificador_banco")
    private String identificadorBanco;

    private String pais;

    private String banco;

    // --- ESPECIFICAS ---
    private String producto;

    @Column(precision = 19, scale = 2)
    private BigDecimal precio;

    private Double descuento;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "activo", nullable = false)
    private boolean activo = true;

    // --- CONSTRUCTORES ---
    public Proveedor() {
    }

    // --- GETTERS Y SETTERS ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
}
