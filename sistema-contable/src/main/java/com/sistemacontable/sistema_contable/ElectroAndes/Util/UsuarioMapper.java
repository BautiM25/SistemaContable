package com.sistemacontable.sistema_contable.ElectroAndes.Util;

import com.sistemacontable.sistema_contable.dto.*;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Usuario;

public class UsuarioMapper {

    public static Usuario toEntity(CreateUsuarioDto dto) {
        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(dto.getNombreUsuario());
        usuario.setContrasenia(dto.getContrasenia());
        usuario.setNombreCompleto(dto.getNombreCompleto());
        usuario.setRol(dto.getRol());
        return usuario;
    }

    public static Usuario toEntity(UpdateUsuarioDto dto) {
        Usuario usuario = new Usuario();
        usuario.setId(dto.getId());
        usuario.setNombreUsuario(dto.getNombreUsuario());
        usuario.setContrasenia(dto.getContrasenia());
        usuario.setNombreCompleto(dto.getNombreCompleto());
        usuario.setRol(dto.getRol());
        return usuario;
    }

    public static ResponseUsuarioDto toDto(Usuario usuario) {
        ResponseUsuarioDto dto = new ResponseUsuarioDto();
        dto.setId(usuario.getId());
        dto.setNombreUsuario(usuario.getNombreUsuario());
        dto.setNombreCompleto(usuario.getNombreCompleto());
        dto.setRol(usuario.getRol());
        return dto;
    }
}

