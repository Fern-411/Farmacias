package com.farmacias.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Configuración de Seguridad en 4 capas para SIIP Farmacias Peruanas.
 * Requerimientos: Hash BCrypt para contraseñas en PostgreSQL, protección CSRF y RBAC.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        // Encriptador de contraseñas oficial con factor de costo 10
        return new BCryptPasswordEncoder(10);
    }
}
