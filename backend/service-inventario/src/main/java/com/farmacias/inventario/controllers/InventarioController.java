package com.farmacias.inventario.controllers;

import com.farmacias.inventario.services.HaversineGeoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/inventario")
@CrossOrigin(origins = "*")
public class InventarioController {

    private final HaversineGeoService geoService;

    public InventarioController(HaversineGeoService geoService) {
        this.geoService = geoService;
    }

    @GetMapping("/cercanos")
    public ResponseEntity<Map<String, Object>> buscarStockCercano(
            @RequestParam Long sucursalId,
            @RequestParam String query,
            @RequestParam(defaultValue = "-12.0935") double lat,
            @RequestParam(defaultValue = "-77.0255") double lng) {

        Map<String, Object> response = new HashMap<>();
        response.put("sucursalConsultaId", sucursalId);
        response.put("criterioBusqueda", query);
        response.put("radioMaximoKm", 10.0);
        response.put("status", "SUCCESS");
        response.put("timestamp", new Date());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint compatible con CU01: Búsqueda de disponibilidad en sucursales cercanas (<10 km)
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<Map<String, Object>>> buscar(@RequestParam String medicamento) {
        List<Map<String, Object>> resultado = new ArrayList<>();
        
        // Simulación georreferenciada de sedes InkaFarma/Mifarma cercanas
        Map<String, Object> s1 = new HashMap<>();
        s1.put("nombreSucursal", "InkaFarma - San Isidro Las Begonias");
        s1.put("codigoSucursal", "SUC-001");
        s1.put("distanciaKm", 1.85);
        s1.put("stockDisponible", 145);
        resultado.add(s1);

        Map<String, Object> s2 = new HashMap<>();
        s2.put("nombreSucursal", "Mifarma - Miraflores Ovalo Gutiérrez");
        s2.put("codigoSucursal", "SUC-002");
        s2.put("distanciaKm", 3.20);
        s2.put("stockDisponible", 80);
        resultado.add(s2);

        Map<String, Object> s3 = new HashMap<>();
        s3.put("nombreSucursal", "InkaFarma - Javier Prado Este");
        s3.put("codigoSucursal", "SUC-003");
        s3.put("distanciaKm", 5.12);
        s3.put("stockDisponible", 210);
        resultado.add(s3);

        return ResponseEntity.ok(resultado);
    }
}
