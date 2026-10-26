package com.farmacias.siip.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "solicitudes_traslados")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolicitudTraslado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 30)
    private String codigo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "origen_sucursal_id", nullable = false)
    private Sucursal origenSucursal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destino_sucursal_id", nullable = false)
    private Sucursal destinoSucursal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicamento_id", nullable = false)
    private Medicamento medicamento;

    private Integer cantidadSugerida;
    private Double distanciaKm;

    private String motivo;
    private String justificacion;

    @Column(length = 30)
    private String estado; // PENDIENTE_APROBACION, APROBADO_EN_TRANSITO, RECHAZADO

    private BigDecimal ahorroEstimadoSoles;
    private LocalDateTime fechaSugerencia;
    private LocalDateTime fechaAutorizacion;
}
