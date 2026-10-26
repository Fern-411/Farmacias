# Manual de Instalación y Despliegue - SIIP

## Requisitos Previos
- Node.js 18+ o 20+
- Java JDK 17+
- Docker & Docker Compose (Opcional para despliegue contenerizado)

## Opción A: Ejecución Local Rápida (Recomendada)
1. **Iniciar el Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Abrir navegador en: `http://localhost:5173`

2. **Iniciar el Backend Spring Boot:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   API REST disponible en: `http://localhost:8080/api/v1`

## Opción B: Despliegue Completo con Docker Compose
```bash
docker-compose up -d --build
```
- Frontend Web: `http://localhost` (Puerto 80)
- Backend API: `http://localhost:8080`
- Base de datos Postgres: `localhost:5432`
- pgAdmin 4: `http://localhost:5050` (Usuario: `admin@farmaciasperuanas.pe`)
