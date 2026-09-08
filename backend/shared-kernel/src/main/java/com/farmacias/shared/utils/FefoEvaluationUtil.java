package com.farmacias.shared.utils;

import com.farmacias.shared.domain.enums.SemaforoCaducidad;

public final class FefoEvaluationUtil {

    private FefoEvaluationUtil() {}

    /**
     * Clasifica un lote farmacéutico según el semáforo FEFO para reducir 22% de mermas económicas.
     */
    public static SemaforoCaducidad clasificarPorDiasRestantes(long diasRestantes) {
        if (diasRestantes <= 30) {
            return SemaforoCaducidad.ROJO_CRITICO;
        } else if (diasRestantes <= 60) {
            return SemaforoCaducidad.NARANJA_ALERTA;
        } else if (diasRestantes <= 90) {
            return SemaforoCaducidad.AMARILLO_ATENCION;
        } else {
            return SemaforoCaducidad.VERDE_OPTIMO;
        }
    }

    /**
     * Calcula la autonomía del inventario = Stock Físico Actual / Consumo Promedio Diario.
     */
    public static double calcularAutonomiaEnDias(int stockActual, double consumoPromedioDiario) {
        if (consumoPromedioDiario <= 0) return 99.0;
        return Math.round((stockActual / consumoPromedioDiario) * 10.0) / 10.0;
    }
}
