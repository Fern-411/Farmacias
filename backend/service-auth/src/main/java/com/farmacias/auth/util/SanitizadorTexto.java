package com.farmacias.auth.util;

import com.google.common.base.Preconditions;
import org.apache.commons.lang3.StringUtils;

/**
 * Utilidad de sanitización y validación defensiva utilizando Apache Commons y Google Guava.
 * Requerimiento: Sanitización de inputs y prevención de inyección XSS / SQL en 4 capas.
 */
public final class SanitizadorTexto {

    private SanitizadorTexto() {
        // Clase utilitaria privada
    }

    /**
     * Limpia y normaliza cadenas de texto usando Apache Commons StringUtils.
     */
    public static String limpiar(String texto) {
        if (StringUtils.isBlank(texto)) {
            return StringUtils.EMPTY;
        }
        return StringUtils.trimToEmpty(texto)
                .replaceAll("<[^>]*>", "") // Remover etiquetas HTML
                .replaceAll("[\"';]", "");   // Remover caracteres de inyección SQL
    }

    /**
     * Valida precondiciones estrictas usando Google Guava Preconditions.
     */
    public static String validarRequerido(String valor, String nombreCampo) {
        Preconditions.checkNotNull(valor, "%s no puede ser nulo", nombreCampo);
        Preconditions.checkArgument(StringUtils.isNotBlank(valor), "%s no puede estar vacío", nombreCampo);
        return limpiar(valor);
    }
}
