package com.farmacias.siip.services;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class TrasladoService {

    public String generarGuiaRemisionCorrelativo(Long trasladoId) {
        return String.format("GR-001-%07d", trasladoId);
    }
}
