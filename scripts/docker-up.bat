@echo off
echo ====================================================================
echo   INICIANDO DOCKER COMPOSE - MICROSERVICIOS SIIP FARMACIAS PERUANAS
echo   Alternativa 1: Microservicios Spring Boot + React + PostgreSQL
echo ====================================================================
cd ..
docker-compose up -d --build
echo.
echo Contenedores levantados exitosamente:
docker-compose ps
pause
