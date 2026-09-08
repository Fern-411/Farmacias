package com.farmacias.shared.domain.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuiaRemisionDto {
    private String numeroGuia;
    private String rucEmisor;
    private String transportista;
    private String placaVehiculo;
    private String codigoHashQr;
    private LocalDateTime fechaEmision;
    private String estadoSunat;
}
