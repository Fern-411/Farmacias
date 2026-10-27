package com.farmacias.auth.service;

import com.farmacias.auth.dao.AuditoriaEventoDao;
import com.farmacias.auth.dao.RolDao;
import com.farmacias.auth.dao.UsuarioDao;
import com.farmacias.auth.model.Rol;
import com.farmacias.auth.model.Usuario;
import com.farmacias.auth.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Pruebas Unitarias de Autenticación bajo metodología TDD.
 * Requerimiento: Cobertura TDD, verificación de Hash BCrypt y bloqueo tras 5 intentos fallidos con Guava.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UsuarioDao usuarioDao;

    @Mock
    private RolDao rolDao;

    @Mock
    private AuditoriaEventoDao auditoriaEventoDao;

    private BCryptPasswordEncoder passwordEncoder;
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        authService = new AuthServiceImpl(usuarioDao, rolDao, auditoriaEventoDao, passwordEncoder);
    }

    @Test
    @DisplayName("TDD 1: Login exitoso con credenciales válidas en PostgreSQL y hash BCrypt")
    void loginExitoso_DebeRetornarTokenYDatos() {
        // Arrange
        String username = "qf_mendoza";
        String rawPass = "password123";
        String encodedPass = passwordEncoder.encode(rawPass);

        Rol rol = Rol.builder().id(1L).codigo("ROLE_FARMACEUTICO").nombre("Químico Farmacéutico").build();
        Usuario usuario = Usuario.builder()
                .id(1L)
                .username(username)
                .passwordHash(encodedPass)
                .nombres("Ronny Fernando")
                .apellidos("Mendoza Paucar")
                .rol(rol)
                .sucursalId(1L)
                .intentosFallidos(0)
                .bloqueado(false)
                .build();

        when(usuarioDao.findByUsername(username)).thenReturn(Optional.of(usuario));

        // Act
        Map<String, Object> result = authService.authenticate(username, rawPass, "192.168.1.100");

        // Assert
        assertNotNull(result);
        assertEquals(username, result.get("username"));
        assertEquals("ROLE_FARMACEUTICO", result.get("rol"));
        assertEquals("PostgreSQL-SIIP", result.get("authProvider"));
        verify(usuarioDao, times(1)).save(usuario);
    }

    @Test
    @DisplayName("TDD 2: Login fallido con contraseña errónea debe lanzar IllegalArgumentException e incrementar intentos")
    void loginPasswordInvalido_DebeLanzarExcepcion() {
        // Arrange
        String username = "qf_mendoza";
        String encodedPass = passwordEncoder.encode("correct_password");

        Rol rol = Rol.builder().id(1L).codigo("ROLE_FARMACEUTICO").nombre("QF").build();
        Usuario usuario = Usuario.builder()
                .id(1L)
                .username(username)
                .passwordHash(encodedPass)
                .nombres("Ronny")
                .apellidos("Mendoza")
                .rol(rol)
                .intentosFallidos(0)
                .bloqueado(false)
                .build();

        when(usuarioDao.findByUsername(username)).thenReturn(Optional.of(usuario));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            authService.authenticate(username, "wrong_password", "127.0.0.1");
        });

        verify(usuarioDao, times(1)).save(any(Usuario.class));
    }

    @Test
    @DisplayName("TDD 3: Bloqueo de cuenta tras 5 intentos fallidos consecutivos (Guava + PostgreSQL)")
    void bloqueoCuenta_TrasCincoIntentosFallidos() {
        String username = "usuario_ataque";
        String encodedPass = passwordEncoder.encode("secret");
        Rol rol = Rol.builder().id(1L).codigo("ROLE_FARMACEUTICO").build();
        Usuario usuario = Usuario.builder()
                .id(99L)
                .username(username)
                .passwordHash(encodedPass)
                .nombres("Test")
                .apellidos("Bot")
                .rol(rol)
                .intentosFallidos(0)
                .bloqueado(false)
                .build();

        when(usuarioDao.findByUsername(username)).thenReturn(Optional.of(usuario));

        // Ejecutar 4 intentos fallidos
        for (int i = 0; i < 4; i++) {
            assertThrows(IllegalArgumentException.class, () -> authService.authenticate(username, "bad_pass", "127.0.0.1"));
        }

        // El 5to intento debe bloquear la cuenta
        assertThrows(IllegalStateException.class, () -> authService.authenticate(username, "bad_pass", "127.0.0.1"));
    }
}
