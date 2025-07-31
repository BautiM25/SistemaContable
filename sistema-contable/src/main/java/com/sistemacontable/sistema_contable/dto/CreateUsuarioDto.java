package com.sistemacontable.sistema_contable.dto;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Rol;

public class CreateUsuarioDto {
    private String nombreUsuario;
    private String contrasenia;
    private String nombreCompleto;
    private Rol rol;

    public CreateUsuarioDto() {
        //Constructor Vacio
    }
    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getContrasenia() {
        return contrasenia;
    }

    public void setContrasenia(String contrasenia) {
        this.contrasenia = contrasenia;
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

