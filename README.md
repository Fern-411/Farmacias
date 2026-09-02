# 🏥 Sistema Inteligente de Inventario y Predicción (SIIP)
## Red Farmacias Peruanas: InkaFarma & Mifarma

[![Node.js](https://img.shields.io/badge/Node.js-v20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Java](https://img.shields.io/badge/Java-JDK_17+-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-blue.svg)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed.svg)](https://www.docker.com/)

---

### 🎓 Información Académica
- **Institución:** Universidad Tecnológica del Perú (UTP)
- **Curso:** Curso Integrador I: Sistemas Software (Sección 20065)
- **Docente:** IRANI GUILLEN GOMEZ
- **Alumno:** **Mendoza Paucar Ronny Fernando**
- **Fecha de Entrega:** 30/08/2026

---

## 📌 Descripción del Proyecto
El **Sistema Inteligente de Inventario y Predicción (SIIP)** es una solución centralizada de alta disponibilidad diseñada para la red de farmacias más grande del Perú (**InkaFarma** y **Mifarma**). 

Su propósito central es:
1. **Reducir en un 22% las pérdidas económicas por medicamentos vencidos** mediante un semáforo inteligente de caducidades a 90, 60 y 30 días (Criterio FEFO).
2. **Eliminar los quiebres de stock en ventanilla** calculando en tiempo real la disponibilidad en las **5 sucursales más cercanas a menos de 10 kilómetros** mediante la fórmula de Haversine.
3. **Automatizar las solicitudes de traslado interno** entre sucursales con sobrestock y tiendas desabastecidas, generando la **Guía de Remisión Electrónica SUNAT / DIGEMID** con código QR.

---

## 📂 Estructura del Repositorio (Enterprise Monorepo)

```
Farmacias/
├── .github/
│   └── workflows/
│       └── ci-cd.yml                   # Pipeline de Integración Continua (GitHub Actions)
├── .vscode/
│   ├── settings.json                   # Configuración del espacio de trabajo
│   ├── launch.json                     # Depurador de Frontend y Backend
│   └── extensions.json                 # Extensiones recomendadas para el equipo
├── docker/
│   ├── Dockerfile.frontend             # Imagen Docker de Producción (Nginx)
│   └── Dockerfile.backend              # Imagen Docker de Producción (OpenJDK 17)
├── docs/
│   ├── DOCUMENTO_DIAGRAMAS_Y_CASOS_DE_USO.md  # Memoria técnica completa y diagramas
│   ├── ARQUITECTURA_SISTEMA.md         # Documento de arquitectura técnica
│   └── MANUAL_DE_DESPLIEGUE.md         # Guía de instalación paso a paso
├── frontend/                           # Aplicación Web React 18 + Tailwind + Recharts
│   ├── src/
│   │   ├── components/                 # Componentes reutilizables (Navbar, Sidebar, Guia SUNAT)
│   │   ├── pages/                      # Pantallas clave (Login, Dashboard, Buscador, Alertas, Traslados)
│   │   └── services/                   # Datos simulados y utilitarios Haversine
├── backend/                            # Microservicios en Java Spring Boot 3.x
│   ├── src/main/java/com/farmacias/siip/
│   │   ├── controllers/                # Controladores REST API
│   │   ├── models/                     # Entidades JPA (Sucursal, Medicamento, Lote, Traslado)
│   │   └── services/                   # Lógica de negocio predictiva y Haversine
│   └── pom.xml
├── scripts/
│   ├── start-system.bat                # Lanzador de 1 clic para Windows
│   ├── start-system.ps1                # Script PowerShell de ejecución
│   └── database-seed.sql               # Script SQL de datos iniciales peruanos
├── .env                                # Variables de entorno activas
├── .env.example                        # Plantilla de variables de entorno
├── .gitignore                          # Exclusiones completas para Git
├── docker-compose.yml                  # Orquestador Docker (Postgres, pgAdmin, Backend, Frontend)
├── package.json                        # Scripts globales del Monorepo
└── README.md                           # Portada y documentación general
```

---

## 🖥️ Módulos y Pantallas Desarrolladas

| N° | Módulo / Pantalla | Caso de Uso | Descripción Técnica |
|---|---|---|---|
| **01** | **Login & Selección de Sede** | `CU06` | Autenticación basada en roles (*Químico Farmacéutico*, *Admin CD*, *Gerencia*) y selección de farmacia activa. |
| **02** | **Dashboard Ejecutivo** | `CU07` | Panel con KPIs en vivo (Tasa de quiebre 3.2%, Reducción merma -21.4%), gráficos de barras y donut FEFO. |
| **03** | **Buscador Geocercano (<10 km)** | `CU01` | Búsqueda predictiva y cálculo de distancias por Haversine para encontrar las 5 sedes con stock más cercanas. |
| **04** | **Alertas Predictivas** | `CU02 / CU04` | Semáforo FEFO (90, 60 y 30 días) y predicción de riesgo de desabastecimiento en los próximos 7 días. |
| **05** | **Gestión de Traslados** | `CU03 / CU05` | Aprobación de traslados en 1 clic y visor/impresión de **Guía de Remisión Electrónica SUNAT** con código QR. |
| **06** | **Visor de Diagramas** | `Todos` | Visualizador interactivo de todos los diagramas de ingeniería (UML, BPMN, E-R, Gantt). |

---

## 🐳 Despliegue con Docker (100% Dockerizado)

El sistema cuenta con un orquestador [docker-compose.yml](./docker-compose.yml) listo para producción que levanta todos los componentes de forma aislada:

| Servicio | Contenedor | Puerto Local | Descripción |
|---|---|---|---|
| **Frontend Web** | `siip-frontend-ui` | `http://localhost:8088` | React 18 servido con servidor Nginx |
| **API Gateway** | `siip-api-gateway` | `http://localhost:8080` | Spring Cloud Gateway y enrutamiento reactivo |
| **MS Inventario** | `siip-ms-inventario` | Interno (8081) | Stock y geolocalización Haversine (<10 km) |
| **MS Predicción** | `siip-ms-prediccion` | Interno (8082) | Semáforo de caducidades FEFO a 90/60/30 días |
| **MS Traslados** | `siip-ms-traslados` | Interno (8083) | Guías de Remisión Electrónica SUNAT con QR |
| **MS Autenticación** | `siip-ms-auth` | Interno (8084) | Seguridad JWT, BCrypt y roles RBAC |
| **Base de Datos** | `siip-postgres-db` | `5445` (interno 5432) | PostgreSQL 16 con carga de `database-seed.sql` |
| **pgAdmin 4** | `siip-pgadmin` | `http://localhost:5055` | Administrador visual de PostgreSQL |

---

## 🚀 Guía para Subir a GitHub y Compartir con tu Equipo

### Paso 1: Subir el proyecto a tu repositorio de GitHub (Tú)
Abre PowerShell o Git Bash en la carpeta raíz del proyecto y ejecuta:

```powershell
# 1. Inicializar repositorio git
git init
git branch -M main

# 2. Agregar todos los archivos (el .gitignore ya protege datos sensibles)
git add .
git commit -m "feat: Sistema SIIP Farmacias Peruanas con Docker, Microservicios y React"

# 3. Vincular con tu repositorio de GitHub y subir
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

---

### Paso 2: ¿Cómo lo descarga y lo usa tu compañero en su PC?

Tu compañero **NO NECESITA INSTALAR NI Java, NI Maven, NI PostgreSQL, NI Node.js**. Solo necesita tener instalado **Docker Desktop** (o Git).

#### 👉 Opción A: Ejecución con Docker (Recomendada para sustentar)
1. Clona el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   cd TU_REPOSITORIO
   ```
2. Inicia todo el ecosistema con un solo comando:
   ```bash
   docker compose up -d --build
   ```
   *(O simplemente haz doble clic en `scripts/docker-up.bat` en Windows)*.

3. Abre el navegador y accede:
   - **Frontend Web:** [`http://localhost:8088`](http://localhost:8088)
   - **API Gateway:** [`http://localhost:8080`](http://localhost:8080)
   - **pgAdmin (Base de Datos):** [`http://localhost:5055`](http://localhost:5055)  
     *(Email: `admin@farmaciasperuanas.pe` | Clave: `admin_password_2026`)*

4. Para detener los contenedores:
   ```bash
   docker compose down
   ```
   *(O doble clic en `scripts/docker-down.bat`)*.

---

#### 👉 Opción B: Modo Desarrollo Rápido (Solo Frontend en 30 segundos)
Si tu compañero no tiene Docker o su PC tiene pocos recursos y solo quiere ver/editar la interfaz gráfica:
```powershell
cd frontend
npm install
npm run dev
```
*(O doble clic en `scripts/start-system.bat`)*  
Accede directamente a: **`http://localhost:5173`**

---

## 📊 Documentación de Diagramas y Auditoría
- 📄 Memoria Técnica y Diagramas UML/BPMN: [`docs/DOCUMENTO_DIAGRAMAS_Y_CASOS_DE_USO.md`](./docs/DOCUMENTO_DIAGRAMAS_Y_CASOS_DE_USO.md)
- 📄 Auditoría de 40 Puntos de Seguridad y Legal: [`docs/AUDITORIA_SEGURIDAD_Y_CUMPLIMIENTO_LEGAL_40_PUNTOS.md`](./docs/AUDITORIA_SEGURIDAD_Y_CUMPLIMIENTO_LEGAL_40_PUNTOS.md)
- 🌐 Versión Imprimible de Auditoría: [`docs/AUDITORIA_SEGURIDAD_Y_CUMPLIMIENTO_LEGAL_40_PUNTOS.html`](./docs/AUDITORIA_SEGURIDAD_Y_CUMPLIMIENTO_LEGAL_40_PUNTOS.html)
