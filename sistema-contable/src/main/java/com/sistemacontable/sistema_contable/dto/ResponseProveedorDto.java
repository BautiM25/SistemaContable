package com.sistemacontable.sistema_contable.dto;

import java.math.BigDecimal;
import java.util.List;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.CategoriaIva;

public class ResponseProveedorDto {

    private Long id;
    private String nombre;
    private String cuitCuil;
    private String mail;
    private String rubro;
    private CategoriaIva categoriaIva;
    private String divisa;
    private BigDecimal saldoInicialCC;
    private String banco;
    private List<ArticuloVinculadoDto> articulos;
    private String identificadorBanco;

    public ResponseProveedorDto() {
    }

    // Getters y Setters
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

    public String getCuitCuil() {
        return cuitCuil;
    }

    public void setCuitCuil(String cuitCuil) {
        this.cuitCuil = cuitCuil;
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

    public CategoriaIva getCategoriaIva() {
        return categoriaIva;
    }

    public void setCategoriaIva(CategoriaIva categoriaIva) {
        this.categoriaIva = categoriaIva;
    }

    public String getDivisa() {
        return divisa;
    }

    public void setDivisa(String divisa) {
        this.divisa = divisa;
    }

    public BigDecimal getSaldoInicialCC() {
        return saldoInicialCC;
    }

    public void setSaldoInicialCC(BigDecimal saldoInicialCC) {
        this.saldoInicialCC = saldoInicialCC;
    }

    public String getBanco() {
        return banco;
    }

    public void setBanco(String banco) {
        this.banco = banco;
    }

    public List<ArticuloVinculadoDto> getArticulos() {
        return articulos;
    }

    public void setArticulos(List<ArticuloVinculadoDto> articulos) {
        this.articulos = articulos;
    }

    public String getIdentificadorBanco() {
        return identificadorBanco;
    }

    public void setIdentificadorBanco(String identificadorBanco) {
        this.identificadorBanco = identificadorBanco;
    }
}
