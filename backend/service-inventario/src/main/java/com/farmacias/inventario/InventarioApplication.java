package com.farmacias.inventario;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class InventarioApplication {
    public static void main(String[] args) {
        SpringApplication.run(InventarioApplication.class, args);
        System.out.println(">>> [MS-INVENTARIO] Microservicio de Inventario & Buscador <10km iniciado en puerto 8081");
    }
}
