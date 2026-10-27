package com.farmacias.auth.controllers;

import com.farmacias.auth.service.IExcelReportService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/v1/reportes")
@CrossOrigin(origins = "*")
public class ReporteExcelController {

    private final IExcelReportService excelReportService;

    public ReporteExcelController(IExcelReportService excelReportService) {
        this.excelReportService = excelReportService;
    }

    @GetMapping("/auditoria.xlsx")
    public ResponseEntity<InputStreamResource> exportarAuditoriaExcel() {
        ByteArrayInputStream in = excelReportService.generarReporteAuditoriaExcel();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=auditoria_siip_farmacias.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    @GetMapping("/usuarios.xlsx")
    public ResponseEntity<InputStreamResource> exportarUsuariosExcel() {
        ByteArrayInputStream in = excelReportService.generarReporteUsuariosExcel();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=usuarios_siip_farmacias.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
}
