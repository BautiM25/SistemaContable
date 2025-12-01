package com.sistemacontable.sistema_contable.ElectroAndes.Util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.*;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.stereotype.Component;
import java.io.Serializable;
import java.util.Date;

@Component
public class JwtTokenUtil implements Serializable {

    private static final String SECRET_KEY = "SSAAII"; // RECOMENDACIÓN: mover a env var (p.ej. System.getenv("JWT_SECRET"))
    private static final Algorithm ALGORITHM = Algorithm.HMAC512(SECRET_KEY);
    private static final long EXPIRATION_TIME = 10 * 24 * 60 * 60 * 1000L;  // 10 días
    public static final String TOKEN_PREFIX = "Bearer ";

    public String generateToken(String subject){
        return TOKEN_PREFIX + JWT.create()
                .withSubject(subject)
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(ALGORITHM);
    }

    public static boolean verify(String token){
        try {
            JWT.require(ALGORITHM)
                    .build()
                    .verify(token.replace(TOKEN_PREFIX, ""));
            return true;
        } catch (JWTVerificationException e) {
            return false;
        }
    }

    public static String getSubject(String token) {
        return JWT.decode(token.replace(TOKEN_PREFIX, "")).getSubject();
    }

    public Date getExpirationDate(String token){
        return JWT.decode(token.replace(TOKEN_PREFIX, "")).getExpiresAt();
    }
}
