# Script PowerShell para levantar Docker Compose
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  INICIANDO DOCKER COMPOSE - MICROSERVICIOS SIIP FARMACIAS PERUANAS" -ForegroundColor Yellow
Write-Host "  Alternativa 1: Microservicios Spring Boot + React + PostgreSQL" -ForegroundColor White
Write-Host "====================================================================" -ForegroundColor Cyan

Set-Location -Path "$PSScriptRoot\.."
docker-compose up -d --build
docker-compose ps
