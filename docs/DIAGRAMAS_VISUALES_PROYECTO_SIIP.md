# DIAGRAMAS DE INGENIERÍA DEL SOFTWARE - PROYECTO SIIP
## FARMACIAS PERUANAS (INKAFARMA / MIFARMA) - UTP 2026
### Alumno: Mendoza Paucar Ronny Fernando (U25302314) • Docente: Irani Guillen Gomez

---

### 1. Diagrama de Procesos de Negocio (BPMN 2.0)
Proceso de Alerta de Quiebre, Búsqueda Georreferenciada < 10 km y Despacho con Guía SUNAT.

### 2. Diagrama de Casos de Uso UML (CU01 al CU06)
Interacción de Actores (Químico Farmacéutico, Administrador CD, Gerencia, Timer) con los casos de uso del SIIP.

### 3. Diagrama de Arquitectura de Microservicios
4 capas desacopladas: React 18 SPA -> Spring Cloud API Gateway (8080) -> Microservicios Spring Boot 3 -> PostgreSQL 16.

### 4. Modelo de Base de Datos Entidad-Relación (MER / DER en 3FN)
Esquema relacional en PostgreSQL 16 con 11 tablas normalizadas y transacciones ACID.

### 5. Diagramas de Secuencia UML
- Secuencia 1: Consulta de Stock Georreferenciado (< 10 km con Haversine).
- Secuencia 2: Aprobación de Traslado y Emisión de Guía de Remisión Electrónica SUNAT con código QR.
