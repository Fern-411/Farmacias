package com.farmacias.auth.service;

import java.io.ByteArrayInputStream;

public interface IExcelReportService {
    ByteArrayInputStream generarReporteAuditoriaExcel();
    ByteArrayInputStream generarReporteUsuariosExcel();
}
