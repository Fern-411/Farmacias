package com.farmacias.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
        System.out.println(">>> [API GATEWAY] Enrutador Central de Farmacias Peruanas iniciado en puerto 8080");
    }
}
