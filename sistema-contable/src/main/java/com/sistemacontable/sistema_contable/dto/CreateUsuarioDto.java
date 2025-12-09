package com.sistemacontable.sistema_contable.dto;

public class CreateUsuarioDto {
    private String nombreUsuario;
    private String contrasenia;
    private String nombreCompleto;
    private String rol;

    public CreateUsuarioDto() { }

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
    public String getRol() {
        return rol;
    }
    public void setRol(String rol) {
        if (rol != null) {
            this.rol = rol.toUpperCase();
        } else {
            this.rol = null;
        }
    }
}
