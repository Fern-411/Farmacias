package com.farmacias.siip.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventarios_sucursales")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventarioSucursal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sucursal_id", nullable = false)
    private Sucursal sucursal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicamento_id", nullable = false)
    private Medicamento medicamento;

    @Column(nullable = false)
    private Integer stockActual;

    private Integer stockSeguridad;
    private Double diasAutonomia;

    @Column(length = 30)
    private String estadoStock; // OPTIMO, SOBRESTOCK, QUIEBRE_CRITICO, ALERTA_BAJA

    private String lotePrincipal;

    private LocalDateTime ultimaActualizacion;
}
