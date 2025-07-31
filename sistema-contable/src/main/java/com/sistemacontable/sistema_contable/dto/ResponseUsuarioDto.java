package com.sistemacontable.sistema_contable.dto;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Rol;

public class ResponseUsuarioDto {
    private Long id;
    private String nombreUsuario;
    private String nombreCompleto;
    private Rol rol;

    public ResponseUsuarioDto() {
        //constructor vacio
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

}

