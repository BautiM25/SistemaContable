package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Usuario;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.UsuarioRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Util.JwtTokenUtil;
import com.sistemacontable.sistema_contable.ElectroAndes.Util.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    public String authenticate(String nombreUsuario, String contrasenia) throws Exception {
        Usuario existingUser = usuarioRepository.findByUsername(nombreUsuario);
        if (existingUser == null) {
            throw new Exception("Invalid credentials");
        }
        boolean ok = passwordEncoder.verify(contrasenia, existingUser.getContrasenia());
        if (!ok) {
            throw new Exception("Invalid credentials");
        }
        return jwtTokenUtil.generateToken(existingUser.getNombreUsuario());
    }
}