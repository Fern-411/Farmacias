package com.farmacias.auth.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.getOrDefault("username", "qf_mendoza");
        Map<String, Object> resp = new HashMap<>();
        resp.put("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.siip_farmacias_token");
        resp.put("username", username);
        resp.put("role", "FARMACEUTICO");
        resp.put("nombre", "Ronny Mendoza Paucar");
        resp.put("expiresIn", 86400);
        return ResponseEntity.ok(resp);
    }
}
