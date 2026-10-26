package com.farmacias.siip;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SiipApplication {

    public static void main(String[] args) {
        SpringApplication.run(SiipApplication.class, args);
        System.out.println("==================================================");
        System.out.println("  SIIP - Farmacias Peruanas Backend Iniciado OK   ");
        System.out.println("  InkaFarma & Mifarma (Gestion de Stock y Mermas) ");
        System.out.println("==================================================");
    }
}
