package com.sistemacontable.sistema_contable.ElectroAndes.Util;

import com.password4j.Password;

public class PasswordEncoder {

    public String encode(String rawPassword) {
        // Generar el hash utilizando Bcrypt
        return Password.hash(rawPassword).withBcrypt().getResult();
    }

    public boolean verify(String rawPassword, String encodedPassword) {
        // Verificar la contraseña
        boolean isPasswordCorrect = Password.check(rawPassword, encodedPassword).withBcrypt();

        if (isPasswordCorrect) {
            System.out.println("The password is correct");
        } else {
            System.out.println("The password is incorrect");
        }
        return isPasswordCorrect;
    }
}