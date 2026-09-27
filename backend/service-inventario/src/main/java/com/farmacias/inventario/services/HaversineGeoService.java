package com.farmacias.inventario.services;

import org.springframework.stereotype.Service;

@Service
public class HaversineGeoService {
    private static final double RADIO_TIERRA_KM = 6371.0;

    /**
     * Calcula la distancia geodésica entre 2 coordenadas en kilómetros (Fórmula de Haversine).
     */
    public double calcularDistancia(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(RADIO_TIERRA_KM * c * 10.0) / 10.0;
    }
}
