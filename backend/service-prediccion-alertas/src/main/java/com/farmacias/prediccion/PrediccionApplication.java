package com.farmacias.prediccion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PrediccionApplication {
    public static void main(String[] args) {
        SpringApplication.run(PrediccionApplication.class, args);
        System.out.println(">>> [MS-PREDICCION] Motor Predictivo & Caducidades FEFO iniciado en puerto 8082");
    }
}
