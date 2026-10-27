package com.farmacias.auth.service;

import com.farmacias.auth.model.Rol;
import com.farmacias.auth.model.Usuario;
import java.util.List;
import java.util.Map;

public interface IAuthService {
    Map<String, Object> authenticate(String username, String rawPassword, String ipOrigen);
    boolean isBlocked(String username);
    void resetFailedAttempts(String username);
    Usuario registrarUsuario(String username, String rawPassword, String nombres, String apellidos, String rolCodigo, Long sucursalId);
    List<Rol> listarRoles();
    List<Map<String, Object>> listarUsuariosActivos();
}
