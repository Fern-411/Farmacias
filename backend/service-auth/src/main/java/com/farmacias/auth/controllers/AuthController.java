package com.farmacias.auth.controllers;

import com.farmacias.auth.model.Usuario;
import com.farmacias.auth.service.IAuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final IAuthService authService;

    public AuthController(IAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        String ipOrigen = request.getRemoteAddr();

        try {
            Map<String, Object> authData = authService.authenticate(username, password, ipOrigen);
            return ResponseEntity.ok(authData);
        } catch (IllegalArgumentException e) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "UNAUTHORIZED");
            err.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        } catch (IllegalStateException e) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "ACCOUNT_LOCKED");
            err.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.LOCKED).body(err);
        } catch (Exception e) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "INTERNAL_ERROR");
            err.put("mensaje", "Error interno en el servidor de autenticación PostgreSQL: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> payload) {
        try {
            String username = (String) payload.get("username");
            String password = (String) payload.get("password");
            String nombres = (String) payload.get("nombres");
            String apellidos = (String) payload.get("apellidos");
            String rolCodigo = (String) payload.getOrDefault("rol", "ROLE_FARMACEUTICO");
            Long sucursalId = payload.get("sucursalId") != null ? Long.valueOf(payload.get("sucursalId").toString()) : 1L;

            Usuario nuevo = authService.registrarUsuario(username, password, nombres, apellidos, rolCodigo, sucursalId);
            Map<String, Object> resp = new HashMap<>();
            resp.put("mensaje", "Usuario registrado exitosamente en PostgreSQL");
            resp.put("id", nuevo.getId());
            resp.put("username", nuevo.getUsername());
            resp.put("rol", nuevo.getRol().getCodigo());
            return ResponseEntity.status(HttpStatus.CREATED).body(resp);
        } catch (Exception e) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "BAD_REQUEST");
            err.put("mensaje", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @GetMapping("/status/{username}")
    public ResponseEntity<?> checkStatus(@PathVariable String username) {
        boolean blocked = authService.isBlocked(username);
        Map<String, Object> resp = new HashMap<>();
        resp.put("username", username);
        resp.put("isBlocked", blocked);
        return ResponseEntity.ok(resp);
    }
}
