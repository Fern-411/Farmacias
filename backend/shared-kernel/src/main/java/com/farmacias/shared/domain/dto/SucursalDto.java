package com.farmacias.shared.domain.dto;

import com.farmacias.shared.domain.enums.MarcaFarmacia;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SucursalDto {
    private Long id;
    private String codigo;
    private MarcaFarmacia marca;
    private String nombre;
    private String direccion;
    private String distrito;
    private String telefono;
    private Double latitud;
    private Double longitud;
    private Double distanciaKm;
    private Boolean esCentroDistribucion;
}
