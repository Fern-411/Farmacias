package com.farmacias.siip.services;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class InventarioService {

    private final GeoDistanceUtil geoDistanceUtil;

    public InventarioService(GeoDistanceUtil geoDistanceUtil) {
        this.geoDistanceUtil = geoDistanceUtil;
    }

    public List<Map<String, Object>> buscarSucursalesCercanas(Long sucursalOrigenId, Long medicamentoId, double latOrigen, double lonOrigen) {
        // En una implementacion completa conecta con PostgreSQL / PostGIS
        List<Map<String, Object>> resultados = new ArrayList<>();
        // Mock data structure compatible con los RF y SRS
        return resultados;
    }
}
