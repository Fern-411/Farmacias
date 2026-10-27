package com.farmacias.auth.service.impl;

import com.farmacias.auth.dao.AuditoriaEventoDao;
import com.farmacias.auth.dao.RolDao;
import com.farmacias.auth.dao.UsuarioDao;
import com.farmacias.auth.model.AuditoriaEvento;
import com.farmacias.auth.model.Rol;
import com.farmacias.auth.model.Usuario;
import com.farmacias.auth.service.IAuthService;
import com.farmacias.auth.util.SanitizadorTexto;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
public class AuthServiceImpl implements IAuthService {

    private static final Logger auditLog = LoggerFactory.getLogger("com.farmacias.auth.security.audit");
    private static final int MAX_ATTEMPTS = 5;

    private final UsuarioDao usuarioDao;
    private final RolDao rolDao;
    private final AuditoriaEventoDao auditoriaEventoDao;
    private final BCryptPasswordEncoder passwordEncoder;

    // Google Guava Cache para control de tasa de intentos fallidos en memoria (15 min)
    private final LoadingCache<String, Integer> attemptsCache = CacheBuilder.newBuilder()
            .expireAfterWrite(15, TimeUnit.MINUTES)
            .build(new CacheLoader<>() {
                @Override
                public Integer load(String key) {
                    return 0;
                }
            });

    public AuthServiceImpl(UsuarioDao usuarioDao, 
                           RolDao rolDao, 
                           AuditoriaEventoDao auditoriaEventoDao,
                           BCryptPasswordEncoder passwordEncoder) {
        this.usuarioDao = usuarioDao;
        this.rolDao = rolDao;
        this.auditoriaEventoDao = auditoriaEventoDao;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public Map<String, Object> authenticate(String rawUsername, String rawPassword, String ipOrigen) {
        String username = SanitizadorTexto.validarRequerido(rawUsername, "Username");
        String password = SanitizadorTexto.validarRequerido(rawPassword, "Password");

        // 1. Verificar bloqueo por Guava Cache (Requerimiento: Bloqueo a los 5 intentos)
        if (isBlocked(username)) {
            registrarAuditoria(null, username, "LOGIN_BLOCKED", "Intento de acceso en cuenta bloqueada por exceder 5 intentos", ipOrigen, false);
            auditLog.warn("Acceso denegado: Usuario [{}] bloqueado temporalmente por superar {} intentos fallidos. IP: {}", username, MAX_ATTEMPTS, ipOrigen);
            throw new IllegalStateException("Cuenta bloqueada temporalmente por 15 minutos tras exceder 5 intentos fallidos consecutivos.");
        }

        // 2. Buscar usuario en PostgreSQL (Requerimiento: Auth mediante PostgreSQL)
        Optional<Usuario> userOpt = usuarioDao.findByUsername(username);

        if (userOpt.isEmpty()) {
            incrementarIntentos(username);
            registrarAuditoria(null, username, "LOGIN_FAILED", "Usuario no encontrado en base de datos PostgreSQL", ipOrigen, false);
            auditLog.warn("Fallo de autenticación: Usuario [{}] inexistente desde IP: {}", username, ipOrigen);
            throw new IllegalArgumentException("Credenciales inválidas. Por favor verifique su usuario y contraseña.");
        }

        Usuario usuario = userOpt.get();

        if (Boolean.TRUE.equals(usuario.getBloqueado())) {
            registrarAuditoria(usuario.getId(), username, "LOGIN_BLOCKED", "Usuario marcado como bloqueado en PostgreSQL", ipOrigen, false);
            auditLog.warn("Acceso denegado: Usuario [{}] inhabilitado en PostgreSQL. IP: {}", username, ipOrigen);
            throw new IllegalStateException("La cuenta se encuentra inhabilitada administrativamente.");
        }

        // 3. Validar hash de contraseña BCrypt
        if (!passwordEncoder.matches(password, usuario.getPasswordHash())) {
            int intentos = incrementarIntentos(username);
            usuario.setIntentosFallidos(intentos);

            if (intentos >= MAX_ATTEMPTS) {
                usuario.setBloqueado(true);
                usuario.setFechaBloqueo(LocalDateTime.now());
                usuarioDao.save(usuario);
                registrarAuditoria(usuario.getId(), username, "USER_BLOCKED", "Bloqueo automático de usuario en PostgreSQL tras 5 intentos fallidos", ipOrigen, false);
                auditLog.error("ALERTA DE SEGURIDAD: Usuario [{}] ha sido bloqueado en PostgreSQL tras {} intentos fallidos. IP: {}", username, MAX_ATTEMPTS, ipOrigen);
                throw new IllegalStateException("Ha alcanzado el límite de 5 intentos fallidos. Su cuenta ha sido bloqueada.");
            }

            usuarioDao.save(usuario);
            registrarAuditoria(usuario.getId(), username, "LOGIN_FAILED", "Contraseña incorrecta (Intento " + intentos + " de " + MAX_ATTEMPTS + ")", ipOrigen, false);
            auditLog.warn("Contraseña incorrecta para usuario [{}]. Intento {}/{} desde IP: {}", username, intentos, MAX_ATTEMPTS, ipOrigen);
            throw new IllegalArgumentException("Credenciales inválidas. Intento " + intentos + " de " + MAX_ATTEMPTS + ".");
        }

        // 4. Éxito: Resetear intentos en Guava y en PostgreSQL
        resetFailedAttempts(username);
        usuario.setIntentosFallidos(0);
        usuario.setBloqueado(false);
        usuario.setFechaUltimoAcceso(LocalDateTime.now());
        usuarioDao.save(usuario);

        registrarAuditoria(usuario.getId(), username, "LOGIN_SUCCESS", "Autenticación exitosa en PostgreSQL con rol " + usuario.getRol().getCodigo(), ipOrigen, true);
        auditLog.info("Login exitoso: Usuario [{}] con rol [{}] en sede [{}]. IP: {}", username, usuario.getRol().getCodigo(), usuario.getSucursalId(), ipOrigen);

        // Retornar payload de sesión JWT simulado
        Map<String, Object> response = new HashMap<>();
        response.put("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.siip_farmacias_jwt_" + System.currentTimeMillis());
        response.put("username", usuario.getUsername());
        response.put("nombres", usuario.getNombres());
        response.put("apellidos", usuario.getApellidos());
        response.put("nombreCompleto", usuario.getNombres() + " " + usuario.getApellidos());
        response.put("rol", usuario.getRol().getCodigo());
        response.put("rolDescripcion", usuario.getRol().getNombre());
        response.put("sucursalId", usuario.getSucursalId());
        response.put("authProvider", "PostgreSQL-SIIP");
        response.put("expiresIn", 86400);

        return response;
    }

    @Override
    public boolean isBlocked(String username) {
        try {
            return attemptsCache.get(username) >= MAX_ATTEMPTS;
        } catch (ExecutionException e) {
            return false;
        }
    }

    @Override
    public void resetFailedAttempts(String username) {
        attemptsCache.invalidate(username);
    }

    private int incrementarIntentos(String username) {
        try {
            int current = attemptsCache.get(username);
            int next = current + 1;
            attemptsCache.put(username, next);
            return next;
        } catch (ExecutionException e) {
            return 1;
        }
    }

    @Override
    @Transactional
    public Usuario registrarUsuario(String username, String rawPassword, String nombres, String apellidos, String rolCodigo, Long sucursalId) {
        if (usuarioDao.existsByUsername(username)) {
            throw new IllegalArgumentException("El nombre de usuario ya está registrado en PostgreSQL.");
        }

        Rol rol = rolDao.findByCodigo(rolCodigo)
                .orElseGet(() -> rolDao.save(Rol.builder().codigo(rolCodigo).nombre(rolCodigo).build()));

        Usuario nuevo = Usuario.builder()
                .username(username)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .nombres(nombres)
                .apellidos(apellidos)
                .email(username + "@farmaciasperuanas.pe")
                .rol(rol)
                .sucursalId(sucursalId)
                .intentosFallidos(0)
                .bloqueado(false)
                .activo(true)
                .build();

        return usuarioDao.save(nuevo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Rol> listarRoles() {
        return rolDao.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> listarUsuariosActivos() {
        List<Usuario> usuarios = usuarioDao.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Usuario u : usuarios) {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", u.getId());
            dto.put("username", u.getUsername());
            dto.put("nombres", u.getNombres());
            dto.put("apellidos", u.getApellidos());
            dto.put("nombreCompleto", u.getNombres() + " " + u.getApellidos());
            dto.put("email", u.getEmail());
            dto.put("rolCodigo", u.getRol() != null ? u.getRol().getCodigo() : null);
            dto.put("rolNombre", u.getRol() != null ? u.getRol().getNombre() : null);
            dto.put("sucursalId", u.getSucursalId());
            dto.put("bloqueado", u.getBloqueado());
            result.add(dto);
        }
        return result;
    }

    private void registrarAuditoria(Long usuarioId, String username, String accion, String detalle, String ipOrigen, boolean exito) {
        try {
            AuditoriaEvento evento = AuditoriaEvento.builder()
                    .usuarioId(usuarioId)
                    .username(username)
                    .accion(accion)
                    .modulo("AUTH_SERVICE")
                    .detalle(detalle)
                    .ipOrigen(ipOrigen)
                    .exito(exito)
                    .build();
            auditoriaEventoDao.save(evento);
        } catch (Exception ex) {
            auditLog.error("Error al persistir auditoría en PostgreSQL: {}", ex.getMessage());
        }
    }
}
