package com.farmacias.shared.utils;

public final class HaversineGeoUtil {

    private static final double RADIO_TIERRA_KM = 6371.0;

    private HaversineGeoUtil() {}

    /**
     * Calcula la distancia geodésica entre dos coordenadas GPS en kilómetros.
     */
    public static double calcularDistanciaKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distancia = RADIO_TIERRA_KM * c;

        return Math.round(distancia * 10.0) / 10.0;
    }

    /**
     * Valida si se encuentra dentro del radio operativo reglamentario de 10 kilómetros.
     */
    public static boolean estaEnRadioCercano(double distanciaKm) {
        return distanciaKm <= 10.0;
    }
}
