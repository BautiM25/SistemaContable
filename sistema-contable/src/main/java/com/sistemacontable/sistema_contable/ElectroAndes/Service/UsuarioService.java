package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Usuario;
import com.sistemacontable.sistema_contable.dto.*;

import java.util.List;

public interface UsuarioService {
    ResponseUsuarioDto createUsuario(CreateUsuarioDto dto);

    List<ResponseUsuarioDto> getAllUsuarios();

    ResponseUsuarioDto getUsuarioById(Long id);

    ResponseUsuarioDto updateUsuario(UpdateUsuarioDto dto);

    void deleteUsuario(Long id);

    Usuario findByUsername(String username);
}

