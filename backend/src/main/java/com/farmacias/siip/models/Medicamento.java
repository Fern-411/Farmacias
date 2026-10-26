package com.farmacias.siip.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "medicamentos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 30)
    private String codigoEan;

    @Column(length = 30)
    private String codigoCan; // Codigo Alfanumerico Nacional (DIGEMID)

    @Column(nullable = false, length = 150)
    private String nombreComercial;

    @Column(nullable = false, length = 150)
    private String principioActivo;

    private String presentacion;
    private String laboratorio;
    private String categoria;

    @Column(nullable = false)
    private BigDecimal precioUnitario;

    private String registroSanitario;
    private Boolean requiereReceta;

    private Integer umbralMinimo;
    private Integer umbralSeguridad;
    private Double consumoPromedioDiario;
}
