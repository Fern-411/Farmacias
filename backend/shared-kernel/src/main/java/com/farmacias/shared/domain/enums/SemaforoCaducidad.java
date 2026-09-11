package com.farmacias.shared.domain.enums;

public enum SemaforoCaducidad {
    VERDE_OPTIMO("Óptimo (>90 días)"),
    AMARILLO_ATENCION("Atención (60-90 días) - Descuento Agora / Monedero"),
    NARANJA_ALERTA("Alerta Alta (30-60 días) - Dispensación Prioritaria FEFO"),
    ROJO_CRITICO("Crítico (<30 días) - Bloqueo y Devolución a Laboratorio");

    private final String descripcion;

    SemaforoCaducidad(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
