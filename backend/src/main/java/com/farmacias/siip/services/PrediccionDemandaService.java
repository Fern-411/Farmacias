package com.farmacias.siip.services;

import org.springframework.stereotype.Service;

@Service
public class PrediccionDemandaService {

    /**
     * Evalúa el Consumo Promedio Diario (CPD) y días de autonomía.
     */
    public double calcularDiasAutonomia(int stockActual, double consumoPromedioDiario) {
        if (consumoPromedioDiario <= 0) return 99.0;
        return Math.round((stockActual / consumoPromedioDiario) * 10.0) / 10.0;
    }

    /**
     * Determina el semáforo FEFO según días restantes (Meta: Reducción 22% mermas).
     */
    public String clasificarSemaforoVencimiento(long diasRestantes) {
        if (diasRestantes <= 30) return "ROJO";
        if (diasRestantes <= 60) return "NARANJA";
        if (diasRestantes <= 90) return "AMARILLO";
        return "VERDE";
    }
}
