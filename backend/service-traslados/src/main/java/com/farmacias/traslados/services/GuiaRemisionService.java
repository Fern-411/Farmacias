package com.farmacias.traslados.services;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class GuiaRemisionService {

    public Map<String, Object> emitirGuiaRemision(Long trasladoId, String rucEmisor, String transportista) {
        Map<String, Object> guia = new HashMap<>();
        guia.put("numeroGuia", String.format("GR-001-%07d", trasladoId));
        guia.put("rucEmisor", rucEmisor);
        guia.put("transportista", transportista);
        guia.put("codigoHashQr", UUID.randomUUID().toString());
        guia.put("fechaEmision", new Date());
        guia.put("estado", "EMITIDA_VALIDADA_SUNAT");
        return guia;
    }
}
