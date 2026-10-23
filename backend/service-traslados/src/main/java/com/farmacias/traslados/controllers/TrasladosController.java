package com.farmacias.traslados.controllers;

import com.farmacias.traslados.services.GuiaRemisionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/traslados")
@CrossOrigin(origins = "*")
public class TrasladosController {

    private final GuiaRemisionService guiaService;

    public TrasladosController(GuiaRemisionService guiaService) {
        this.guiaService = guiaService;
    }

    @PostMapping("/{id}/aprobar")
    public ResponseEntity<Map<String, Object>> aprobarTraslado(@PathVariable Long id) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("trasladoId", id);
        resp.put("nuevoEstado", "APROBADO_EN_TRANSITO");
        resp.put("guiaRemision", guiaService.emitirGuiaRemision(id, "20509872134", "Logistica InkaFarma/Mifarma Express"));
        return ResponseEntity.ok(resp);
    }
}
