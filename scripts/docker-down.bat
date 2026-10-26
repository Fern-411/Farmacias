@echo off
echo ====================================================================
echo   DETENIENDO DOCKER COMPOSE - SIIP FARMACIAS PERUANAS
echo ====================================================================
cd ..
docker compose down
echo.
echo Contenedores detenidos correctamente.
pause
