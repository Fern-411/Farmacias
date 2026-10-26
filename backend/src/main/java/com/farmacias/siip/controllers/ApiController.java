package com.farmacias.siip.controllers;

import com.farmacias.siip.services.GeoDistanceUtil;
import com.farmacias.siip.services.PrediccionDemandaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class ApiController {

    private final GeoDistanceUtil geoDistanceUtil;
    private final PrediccionDemandaService prediccionService;

    public ApiController(GeoDistanceUtil geoDistanceUtil, PrediccionDemandaService prediccionService) {
        this.geoDistanceUtil = geoDistanceUtil;
        this.prediccionService = prediccionService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "UP");
        resp.put("system", "SIIP - Farmacias Peruanas (InkaFarma/Mifarma)");
        resp.put("version", "1.0.0");
        resp.put("uptime", "99.9%");
        resp.put("metaMerma", "-22% vencidos");
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/geo/distancia")
    public ResponseEntity<Map<String, Object>> calcularDistancia(
            @RequestParam double lat1, @RequestParam double lon1,
            @RequestParam double lat2, @RequestParam double lon2) {
        
        double distancia = geoDistanceUtil.calcularDistanciaHaversine(lat1, lon1, lat2, lon2);
        Map<String, Object> resp = new HashMap<>();
        resp.put("distanciaKm", distancia);
        resp.put("validoRadio10km", distancia <= 10.0);
        return ResponseEntity.ok(resp);
    }
}
