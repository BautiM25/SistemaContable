package com.sistemacontable.sistema_contable.ElectroAndes.Service;

public interface AuthenticationService {
    String authenticate(String nombreUsuario, String contrasenia) throws Exception;
}