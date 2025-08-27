package com.sistemacontable.sistema_contable.dto;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Rol;

public class UpdateUsuarioDto {
    private Long id;
    private String nombreUsuario;
    private String contrasenia;
    private String nombreCompleto;
    private Rol rol;

    public UpdateUsuarioDto() { }

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

    public String getContrasenia() {
        return contrasenia;
    }
    // CORREGIDO: nombre correcto del setter
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
