package com.farmacias.siip.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sucursales")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sucursal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    private String codigo;

    @Column(nullable = false, length = 50)
    private String marca; // InkaFarma, Mifarma, Corporativo

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, length = 250)
    private String direccion;

    @Column(nullable = false, length = 100)
    private String distrito;

    private String telefono;

    @Column(precision = 10, scale = 7)
    private Double latitud;

    @Column(precision = 10, scale = 7)
    private Double longitud;

    private Boolean esCentroDistribucion;

    private Boolean activo;
}
