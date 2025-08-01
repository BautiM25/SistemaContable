package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import com.sistemacontable.sistema_contable.dto.*;
import com.sistemacontable.sistema_contable.ElectroAndes.Util.UsuarioMapper;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Usuario;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public ResponseUsuarioDto createUsuario(CreateUsuarioDto dto) {
        Usuario usuario = UsuarioMapper.toEntity(dto);
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
        usuario.setContrasenia(dto.getContrasenia());
        usuario.setNombreCompleto(dto.getNombreCompleto());
        usuario.setRol(dto.getRol());

        return UsuarioMapper.toDto(usuarioRepository.save(usuario));
    }

    @Override
    public void deleteUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }
}

