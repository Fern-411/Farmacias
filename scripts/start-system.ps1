# Script PowerShell de Inicio SIIP
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  INICIANDO SISTEMA SIIP - FARMACIAS PERUANAS (INKAFARMA / MIFARMA)" -ForegroundColor Yellow
Write-Host "  Curso Integrador I: Sistemas Software - UTP 2026" -ForegroundColor White
Write-Host "  Alumno: Mendoza Paucar Ronny Fernando" -ForegroundColor Green
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""
Set-Location -Path "$PSScriptRoot\..\frontend"
npm run dev
