package com.farmacias.traslados;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TrasladosApplication {
    public static void main(String[] args) {
        SpringApplication.run(TrasladosApplication.class, args);
        System.out.println(">>> [MS-TRASLADOS] Microservicio de Traslados & Guías SUNAT iniciado en puerto 8083");
    }
}
