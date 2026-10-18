package com.farmacias.prediccion.services;

import org.springframework.stereotype.Service;

@Service
public class MotorPredictivoService {

    /**
     * Calcula los días de autonomía = Stock / Consumo Promedio Diario.
     */
    public double calcularAutonomiaDias(int stock, double cpd) {
        if (cpd <= 0) return 99.0;
        return Math.round((stock / cpd) * 10.0) / 10.0;
    }

    /**
     * Clasifica lote según regla FEFO para reducir 22% de mermas económicas.
     */
    public String clasificarSemaforoFefo(long diasParaVencer) {
        if (diasParaVencer <= 30) return "ROJO_CRITICO";
        if (diasParaVencer <= 60) return "NARANJA_ALERTA";
        if (diasParaVencer <= 90) return "AMARILLO_ATENCION";
        return "VERDE_OPTIMO";
    }
}
