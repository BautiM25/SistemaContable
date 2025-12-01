package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Rol;
import com.sistemacontable.sistema_contable.dto.*;
import com.sistemacontable.sistema_contable.ElectroAndes.Util.UsuarioMapper;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Usuario;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.UsuarioRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Util.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public ResponseUsuarioDto createUsuario(CreateUsuarioDto dto) {
        Usuario usuario = UsuarioMapper.toEntity(dto);

        // Hashear la contraseña antes de guardar
        usuario.setContrasenia(passwordEncoder.encode(usuario.getContrasenia()));

        // Convertir rol a enum en mayúscula antes de guardar
        if (dto.getRol() != null) {
            try {
                usuario.setRol(Rol.valueOf(dto.getRol().toString().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Rol inválido: " + dto.getRol());
            }
        }
        return UsuarioMapper.toDto(usuarioRepository.save(usuario));
    }

    @Override
    public List<ResponseUsuarioDto> getAllUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ResponseUsuarioDto getUsuarioById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return UsuarioMapper.toDto(usuario);
    }

    @Override
    public ResponseUsuarioDto updateUsuario(UpdateUsuarioDto dto) {
        Usuario usuario = usuarioRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setNombreUsuario(dto.getNombreUsuario());
        // Si la contraseña fue enviada y no está vacía, re-hashea
        if (dto.getContrasenia() != null && !dto.getContrasenia().isBlank()) {
            usuario.setContrasenia(passwordEncoder.encode(dto.getContrasenia()));
        }
        usuario.setNombreCompleto(dto.getNombreCompleto());

        // Convertir rol a enum en mayúscula antes de guardar
        if (dto.getRol() != null) {
            try {
                usuario.setRol(Rol.valueOf(dto.getRol().toString().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Rol inválido: " + dto.getRol());
            }
        }
        return UsuarioMapper.toDto(usuarioRepository.save(usuario));
    }

    @Override
    public void deleteUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    @Override
    public Usuario findByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }
}