package com.sistemacontable.sistema_contable.ElectroAndes.Util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.*;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.stereotype.Component;
import java.io.Serializable;
import java.util.Date;

@Component
public class JwtTokenUtil implements Serializable {

    private static final String SECRET_KEY = "SSAAII"; //Esta es la clave para firmar el JWT
    private static final Algorithm ALGORITHM = Algorithm.HMAC512(SECRET_KEY); //ESte es el algoritmo que usaremos junto a la clave secreta
    private static final long EXPIRATION_TIME = 10 * 24 * 60 * 60 * 1000;  // 10(Dias) * 24(Horas) * 60(Minutos) * 60(Segundos) * 1000(Expresar en Milisegundos)
    public static final String TOKEN_PREFIX = "Bearer ";

    public String generateToken(String subject){
        return TOKEN_PREFIX + JWT.create()
                .withSubject(subject)   //Añade el subject (username) al payload del Token
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) //Establecemos el tiempo de expiracion del Token
                .sign(ALGORITHM);   //Firma el Token con el Algoritmo
    }

    public static boolean verify(String token){
        try {
            JWT.require(ALGORITHM)
                    .build() // Crea un verificador con el mismo algoritmo
                    .verify(token.replace(TOKEN_PREFIX, "")); // Verifica el token (eliminando "Bearer ")
            return true;  // Retorna true si es válido
        } catch (JWTVerificationException e) {
            return false; // Retorna false si no es válido
        }
    }

    public static String getSubject(String token) {
        return JWT.decode(token.replace(TOKEN_PREFIX, "")).getSubject(); // Retorna el username del payload
    }

    public Date getExpirationDate(String token){
        return JWT.decode(token.replace(TOKEN_PREFIX, "")).getExpiresAt();
    }
}