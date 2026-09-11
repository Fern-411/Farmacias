package com.farmacias.shared.domain.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicamentoDto {
    private Long id;
    private String codigoEan;
    private String codigoCan; // Codigo Alfanumerico Nacional (DIGEMID)
    private String nombreComercial;
    private String principioActivo;
    private String presentacion;
    private String laboratorio;
    private String categoria;
    private BigDecimal precioUnitario;
    private String registroSanitario;
    private Boolean requiereReceta;
    private Integer umbralMinimo;
    private Integer umbralSeguridad;
    private Double consumoPromedioDiario;
}
