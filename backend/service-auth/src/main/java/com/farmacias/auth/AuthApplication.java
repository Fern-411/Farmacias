package com.farmacias.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AuthApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthApplication.class, args);
        System.out.println(">>> [MS-AUTH] Microservicio de Autenticación & Roles JWT iniciado en puerto 8084");
    }
}
