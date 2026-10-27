package com.farmacias.auth.service.impl;

import com.farmacias.auth.dao.AuditoriaEventoDao;
import com.farmacias.auth.dao.UsuarioDao;
import com.farmacias.auth.model.AuditoriaEvento;
import com.farmacias.auth.model.Usuario;
import com.farmacias.auth.service.IExcelReportService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Servicio de exportación de reportes ejecutivos en formato Excel (.xlsx) utilizando Apache POI.
 * Requerimiento: Integración de Apache POI para auditoría regulatoria y exportación de datos.
 */
@Service
public class ExcelReportServiceImpl implements IExcelReportService {

    private final AuditoriaEventoDao auditoriaEventoDao;
    private final UsuarioDao usuarioDao;

    public ExcelReportServiceImpl(AuditoriaEventoDao auditoriaEventoDao, UsuarioDao usuarioDao) {
        this.auditoriaEventoDao = auditoriaEventoDao;
        this.usuarioDao = usuarioDao;
    }

    @Override
    public ByteArrayInputStream generarReporteAuditoriaExcel() {
        String[] columnas = {"ID", "Fecha y Hora", "Usuario", "Acción", "Módulo", "IP Origen", "Resultado", "Detalle"};
        List<AuditoriaEvento> eventos = auditoriaEventoDao.findTop50ByOrderByFechaHoraDesc();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Auditoría SIIP");

            // Estilo Cabecera: Azul Marino Farmacias Peruanas (#002B66) con letras blancas
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerFont.setFontHeightInPoints((short) 11);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            // Fila de Cabecera
            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < columnas.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columnas[col]);
                cell.setCellStyle(headerStyle);
            }

            // Filas de Datos
            int rowIdx = 1;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            for (AuditoriaEvento evento : eventos) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(evento.getId());
                row.createCell(1).setCellValue(evento.getFechaHora() != null ? evento.getFechaHora().format(formatter) : "-");
                row.createCell(2).setCellValue(evento.getUsername());
                row.createCell(3).setCellValue(evento.getAccion());
                row.createCell(4).setCellValue(evento.getModulo());
                row.createCell(5).setCellValue(evento.getIpOrigen() != null ? evento.getIpOrigen() : "127.0.0.1");
                row.createCell(6).setCellValue(Boolean.TRUE.equals(evento.getExito()) ? "ÉXITO" : "FALLIDO");
                row.createCell(7).setCellValue(evento.getDetalle());
            }

            // Auto-ajustar tamaño de columnas
            for (int col = 0; col < columnas.length; col++) {
                sheet.autoSizeColumn(col);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Error al generar reporte Excel con Apache POI: " + e.getMessage());
        }
    }

    @Override
    public ByteArrayInputStream generarReporteUsuariosExcel() {
        String[] columnas = {"ID", "Usuario", "Nombres", "Apellidos", "Rol", "Sede Asignada", "Estado", "Intentos Fallidos"};
        List<Usuario> usuarios = usuarioDao.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Usuarios Registrados");

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < columnas.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columnas[col]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Usuario u : usuarios) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(u.getId());
                row.createCell(1).setCellValue(u.getUsername());
                row.createCell(2).setCellValue(u.getNombres());
                row.createCell(3).setCellValue(u.getApellidos());
                row.createCell(4).setCellValue(u.getRol() != null ? u.getRol().getNombre() : "SIN_ROL");
                row.createCell(5).setCellValue(u.getSucursalId() != null ? "Sede #" + u.getSucursalId() : "Corporativo");
                row.createCell(6).setCellValue(Boolean.TRUE.equals(u.getBloqueado()) ? "BLOQUEADO" : "ACTIVO");
                row.createCell(7).setCellValue(u.getIntentosFallidos() != null ? u.getIntentosFallidos() : 0);
            }

            for (int col = 0; col < columnas.length; col++) {
                sheet.autoSizeColumn(col);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Error al generar reporte de usuarios con Apache POI: " + e.getMessage());
        }
    }
}
