# Arquitectura del Sistema SIIP - Farmacias Peruanas

## 1. Patrón Arquitectónico: Microservicios + SPA
- **Capa Cliente:** React 18, Vite, Tailwind CSS, Lucide React, Recharts.
- **Capa de Gateway & Seguridad:** Spring Cloud Gateway con filtro JWT y CORS unificado.
- **Capa de Lógica de Negocio:**
  - `ms-inventario`: Sincronización en tiempo real y cálculo geodésico de distancias (<10km).
  - `ms-prediccion`: Evaluación del Consumo Promedio Diario (CPD) y semáforo FEFO de caducidades (meta -22%).
  - `ms-traslados`: Orquestación de transferencias y emisión de Guía de Remisión Remitente SUNAT.
- **Capa de Persistencia:** PostgreSQL 16 con índices geoespaciales.

## 2. Métricas y Requisitos No Funcionales (RNF)
- **Disponibilidad:** 99.9% uptime anual.
- **Tiempo de Respuesta:** < 2.0 segundos para consultas geolocalizadas.
- **Seguridad:** Encriptación HTTPS/TLS y validación de tokens RFC 7519.
