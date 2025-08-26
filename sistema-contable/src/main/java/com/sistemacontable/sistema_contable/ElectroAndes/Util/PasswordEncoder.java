package com.sistemacontable.sistema_contable.ElectroAndes.Util;

import com.password4j.Password;
import org.springframework.stereotype.Component;

@Component
public class PasswordEncoder {

    public String encode(String rawPassword) {
        // Generar el hash utilizando Bcrypt (password4j)
        return Password.hash(rawPassword).withBcrypt().getResult();
    }

    public boolean verify(String rawPassword, String encodedPassword) {
        // Verificar la contraseña
        boolean isPasswordCorrect = Password.check(rawPassword, encodedPassword).withBcrypt();
        // En producción no imprimir nada sensible en logs
        return isPasswordCorrect;
    }
}