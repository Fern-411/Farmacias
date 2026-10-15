package com.farmacias.prediccion.controllers;

import com.farmacias.prediccion.services.MotorPredictivoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/alertas")
@CrossOrigin(origins = "*")
public class AlertasController {

    private final MotorPredictivoService motorService;

    public AlertasController(MotorPredictivoService motorService) {
        this.motorService = motorService;
    }

    @GetMapping("/vencimientos")
    public ResponseEntity<Map<String, Object>> getAlertasVencimiento() {
        Map<String, Object> resp = new HashMap<>();
        resp.put("metaReduccionMermas", "22%");
        resp.put("algoritmo", "FEFO (First Expired, First Out)");
        resp.put("totalAlertas90dias", 18);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/quiebres")
    public ResponseEntity<Map<String, Object>> getRiesgosQuiebre() {
        Map<String, Object> resp = new HashMap<>();
        resp.put("horizonteEvaluacion", "7 dias");
        resp.put("quiebresInminentes", 5);
        return ResponseEntity.ok(resp);
    }
}
