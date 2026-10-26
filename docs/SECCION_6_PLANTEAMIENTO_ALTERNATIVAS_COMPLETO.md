# SECCIÓN 6: PLANTEAMIENTO DE ALTERNATIVAS DE SOLUCIÓN
## CURSO INTEGRADOR I: SISTEMAS SOFTWARE (SECCIÓN 20065) - UTP 2026
### PROYECTO: SISTEMA INTELIGENTE DE INVENTARIO Y PREDICCIÓN (SIIP) - FARMACIAS PERUANAS

---

## 6.1. PRESENTACIÓN DE LAS 3 ALTERNATIVAS DE SOLUCIÓN

Para resolver de manera integral la problemática de desabastecimiento, quiebres de stock y mermas por vencimiento en la red nacional de **Farmacias Peruanas (InkaFarma y Mifarma)**, se han formulado tres alternativas arquitectónicas. Todas las opciones cumplen estrictamente con la restricción académica de emplear **al menos el 50% de desarrollo en tecnología Java**.

A continuación, se detalla cada alternativa tecnológica junto con el diseño y especificación UI/UX de sus **5 pantallas obligatorias**:

---

```
====================================================================================================
                        ALTERNATIVA 1 (SOLUCIÓN SELECCIONADA)
   ARQUITECTURA DISTRIBUIDA DE MICROSERVICIOS CON JAVA SPRING BOOT Y FRONTEND EN REACT 18
====================================================================================================
```

### 1. Descripción Técnica y Uso de TIC
* **Enfoque:** Arquitectura desacoplada basada en microservicios independientes (`service-auth`, `service-inventario`, `service-prediccion-alertas`, `service-traslados`, `shared-kernel`), orquestados mediante un **Spring Cloud API Gateway** y persistencia en **PostgreSQL 16**.
* **Uso de TIC (Garantía Java):**
  * **70% Java:** Java 17, Spring Boot 3.x, Spring Cloud Gateway, Spring Data JPA / Hibernate, JUnit 5, Docker.
  * **30% Frontend Web:** React 18 SPA, Vite, Tailwind CSS, Lucide Icons, Recharts para analítica en tiempo real.

---

### Las 5 Pantallas / Diseños UI/UX de la Alternativa 1:

#### Pantalla 1.1: Interfaz de Autenticación y Autorización (Login Seguro)
* **Objetivo:** Control de acceso basado en roles (RBAC) con emisión de tokens JWT y asignación automática de la sucursal física de trabajo.
* **Componentes UI/UX:** Formulario minimalista con credenciales, chips de acceso rápido por perfil (Químico Farmacéutico, Administrador CD, Gerencia), badges de marca (InkaFarma / Mifarma) y cifrado TLS/HTTPS.

```text
+--------------------------------------------------------------------------------------------------+
|  [SIIP v1.0] SISTEMA INTELIGENTE DE INVENTARIO Y PREDICCIÓN - FARMACIAS PERUANAS (Inka / Mifarma)|
|                                                                                                  |
|                      +----------------------------------------------------+                      |
|                      |             ACCESO AL SISTEMA SIIP                 |                      |
|                      +----------------------------------------------------+                      |
|                      |  [ 👨‍⚕️ Químico Farmacéutico ] [ 🏢 Admin CD ]      | <- Selector Rápido   |
|                      |                                                    |                      |
|                      |  Usuario / Correo Corporativo:                     |                      |
|                      |  [ 👤 qf_mendoza@farmaciasperuanas.pe            ] |                      |
|                      |                                                    |                      |
|                      |  Contraseña de Seguridad:                          |                      |
|                      |  [ 🔒 ••••••••••••••••••                      👁️ ] |                      |
|                      |                                                    |                      |
|                      |  Sede Asignada: [ InkaFarma - San Isidro ] (Fija)  |                      |
|                      |                                                    |                      |
|                      |  [          INGRESAR AL SISTEMA SIIP  ➔          ] |                      |
|                      |                                                    |                      |
|                      |  🛡️ Autenticación JWT • TLS / HTTPS • Microservicios|                      |
|                      +----------------------------------------------------+                      |
+--------------------------------------------------------------------------------------------------+
```

---

#### Pantalla 1.2: Dashboard Operativo Principal y Analítica de KPIs
* **Objetivo:** Visualización ejecutiva en tiempo real del estado de abastecimiento, rotación y riesgo de pérdidas.
* **Componentes UI/UX:** 4 Tarjetas de KPIs (Tasa de quiebre 3.2%, Reducción de mermas -21.4%, Disponibilidad 96.8%, Dinero en riesgo S/ 4,120), gráfico de barras interactivo de Demanda vs Stock, y donut chart del semáforo FEFO.

```text
+--------------------------------------------------------------------------------------------------+
| [SIIP] Farmacias Peruanas | Sede: InkaFarma San Isidro | Usuario: QF. Ronny Mendoza | [ Cerrar ] |
+--------------------------------------------------------------------------------------------------+
| [TABLERO] [BUSCADOR <10KM] [ALERTAS FEFO] [TRASLADOS] [DIAGRAMAS]                                |
+--------------------------------------------------------------------------------------------------+
|  +------------------+  +------------------+  +------------------+  +--------------------------+  |
|  | TASA DE QUIEBRE  |  | REDUCCIÓN MERMAS |  | DISPONIBILIDAD   |  | VALOR EN RIESGO FEFO     |  |
|  |      3.2%        |  |  -21.4% (Meta 22)|  |      96.8%       |  | S/ 4,120.00 (7 Lotes)    |  |
|  +------------------+  +------------------+  +------------------+  +--------------------------+  |
|                                                                                                  |
|  [ GRÁFICO 1: DEMANDA DIARIA VS STOCK POR CATEGORÍA ]   [ GRÁFICO 2: SEMÁFORO FEFO VENCIMIENTOS ]|
|  120 |      [Stock]                                      🔴 Crítico <30 días:     3 Lotes (43%)  |
|   80 |  [Venta] [Stock]                                  🟠 Alerta 30-60 días:   2 Lotes (29%)  |
|   40 |  [Venta] [Venta]                                  🟡 Atención 60-90 días: 2 Lotes (28%)  |
|    0 +---------------------------------                  🟢 Óptimo >90 días:     Resto Inventario|
|       Antibióticos  Analgésicos  Cardio                                                          |
+--------------------------------------------------------------------------------------------------+
```

---

#### Pantalla 1.3: Módulo de Consulta de Inventario Georreferenciado (< 10 km)
* **Objetivo:** Búsqueda en tiempo real de medicamentos y cálculo de proximidad geográfica mediante la **Fórmula de Haversine**.
* **Componentes UI/UX:** Buscador predictivo por EAN/Nombre, selector de categorías, panel del producto activo y **Tabla Comparativa de las 5 sucursales más cercanas con stock disponible**.

```text
+--------------------------------------------------------------------------------------------------+
| BUSCADOR GEOCERCANO | Radio Máximo: 10.0 Kilómetros (Fórmula de Haversine)                        |
+--------------------------------------------------------------------------------------------------+
| Fármaco Seleccionado: [ AMOXICILINA 500MG CAJA X 100 ] | Stock en mi Sede: [ 0 cjs - SIN STOCK ] |
+--------------------------------------------------------------------------------------------------+
| TABLA COMPARATIVA DE LAS 5 SUCURSALES MÁS CERCANAS CON STOCK DISPONIBLE:                         |
| +---+-----------------------+---------------------+---------------+--------+----------+---------+|
| |N° | SUCURSAL / MARCA      | DIRECCIÓN / DISTRITO| DISTANCIA KM  | STOCK  |AUTONOMÍA | ACCIÓN  ||
| +---+-----------------------+---------------------+---------------+--------+----------+---------+|
| | 1 | [InkaFarma] Corpac    | Av. Canaval 450     |  1.2 km       | 85 cjs | 14 días  |[Pedir ➔]||
| | 2 | [Mifarma] Miraflores  | Av. Larco 720       |  2.4 km       | 42 cjs |  9 días  |[Pedir ➔]||
| | 3 | [InkaFarma] San Borja | Av. Aviación 2800   |  3.1 km       | 60 cjs | 12 días  |[Pedir ➔]||
| | 4 | [Mifarma] Lince       | Av. Arequipa 1980   |  3.8 km       | 30 cjs |  7 días  |[Pedir ➔]||
| | 5 | [InkaFarma] Surquillo | Av. Angamos 1200    |  4.5 km       | 50 cjs | 11 días  |[Pedir ➔]||
| +---+-----------------------+---------------------+---------------+--------+----------+---------+|
| [ Botón: Solicitar Traslado Express de Emergencia al Centro de Distribución ]                    |
+--------------------------------------------------------------------------------------------------+
```

---

#### Pantalla 1.4: Bandeja de Alertas Predictivas y Reporte Tabular FEFO
* **Objetivo:** Monitoreo diario de fechas de caducidad y quiebres inminentes para evitar pérdidas económicas.
* **Componentes UI/UX:** Pestañas de Vencimientos FEFO y Quiebres a 7 días, filtros por color de semáforo, y **Tabla interactiva estilo Excel** con impacto monetario en Soles ($S/.$).

```text
+--------------------------------------------------------------------------------------------------+
| CONTROL DE CADUCIDADES FEFO & QUIEBRES | Meta: -22% Mermas | Dinero en Riesgo: S/ 4,120.00       |
+--------------------------------------------------------------------------------------------------+
| [ Pestaña: Lotes FEFO (90, 60 y 30 días) ]   [ Pestaña: Riesgo de Quiebre a 7 Días ]             |
| Filtros: [ Todos (7) ] [ 🔴 Crítico <30d (3) ] [ 🟠 Alerta 30-60d (2) ] [ 🟡 Atención 60-90d (2) ]|
+--------------------------------------------------------------------------------------------------+
| REPORTE TABULAR DE LOTES PRÓXIMOS A VENCER:                                                      |
| +-----------+-------------------------+-------------+--------+---------+----------+-------------+|
| |LOTE       | MEDICAMENTO / REG. DIG. | SUCURSAL    |VENCE EN|SEMÁFORO |CANTIDAD  |RIESGO (S/.) ||
| +-----------+-------------------------+-------------+--------+---------+----------+-------------+|
| |LT-AMX-01  | Amoxicilina 500mg       | San Isidro  | 18 días|🔴CRÍTICO|  40 cjs  | S/ 1,440.00 ||
| |LT-AZI-04  | Azitromicina 500mg      | Miraflores  | 25 días|🔴CRÍTICO|  25 cjs  | S/ 1,125.00 ||
| |LT-PAN-09  | Panadol Antigripal      | Surco       | 42 días|🟠ALERTA |  80 cjs  | S/   960.00 ||
| |LT-IBU-12  | Ibuprofeno 400mg        | San Borja   | 75 días|🟡ATENCIÓN| 110 cjs | S/   595.00 ||
| +-----------+-------------------------+-------------+--------+---------+----------+-------------+|
+--------------------------------------------------------------------------------------------------+
```

---

#### Pantalla 1.5: Gestor de Traslados Internos y Emisión de Guía SUNAT
* **Objetivo:** Autorización del balanceo logístico entre sedes con sobrestock y emisión de la Guía de Remisión Electrónica.
* **Componentes UI/UX:** Tabla de órdenes propuestas por el algoritmo, botones de aprobación en 1 clic, y modal con **Guía de Remisión Remitente con código QR oficial validado ante SUNAT / DIGEMID**.

```text
+--------------------------------------------------------------------------------------------------+
| GESTIÓN DE TRASLADOS INTERNOS | Aprobación en 1 Clic • Emisión de Guía de Remisión Electrónica   |
+--------------------------------------------------------------------------------------------------+
| +--------------+-----------------------+---------------------+----------+--------+--------------+|
| |CÓDIGO        | ORIGEN (SOBRESTOCK)   | DESTINO (QUIEBRE)   |FÁRMACO   |CANTIDAD| ACCIONES     ||
| +--------------+-----------------------+---------------------+----------+--------+--------------+|
| |TRA-2026-00891| InkaFarma Surquillo   | InkaFarma San Isidro|Amoxicilin| 25 cjs |[✓ Aprobar]   ||
| |TRA-2026-00892| Mifarma Lince         | Mifarma Miraflores  |Azitromici| 15 cjs |[✓ Aprobar]   ||
| +--------------+-----------------------+---------------------+----------+--------+--------------+|
|                                                                                                  |
| [ MODAL EMERGENTE: GUÍA DE REMISIÓN ELECTRÓNICA REMITENTE - SUNAT ]                              |
| +----------------------------------------------------------------------------------------------+ |
| | GUÍA DE REMISIÓN ELECTRÓNICA: GR-001-0008492      | [ QR CODE SUNAT ]                        | |
| | RUC Emisor: 20509872134 (FARMACIAS PERUANAS S.A.) |  ████  ██  ██                            | |
| | Transportista: Logística Express Inka/Mifarma     |  ██  ████  ██  Hash: e8b9f1...           | |
| | Placa Vehículo: ABC-782 | Chofer: J. Morales      |  ████  ██  ██                            | |
| | Motivo: TRASLADO ENTRE ESTABLECIMIENTOS DE LA MISMA EMPRESA (Art. 18 R.S. SUNAT)            | |
| | [ Botón: Imprimir Documento Oficial ]   [ Botón: Descargar PDF ]                             | |
| +----------------------------------------------------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
```

---

```
====================================================================================================
                                      ALTERNATIVA 2
                  APLICACIÓN WEB MONOLÍTICA TRADICIONAL (JAVA EE / JSF)
====================================================================================================
```

### 1. Descripción Técnica y Uso de TIC
* **Enfoque:** Sistema web centralizado donde toda la lógica de negocio, acceso a datos JDBC/JPA y renderizado de interfaz se empaquetan en un único archivo `.war` desplegado sobre un servidor **WildFly / GlassFish**.
* **Uso de TIC (Garantía Java):**
  * **90% Java:** Java Enterprise Edition (Java EE 8), Servlets, Enterprise Java Beans (EJB), JavaServer Faces (JSF / PrimeFaces), JPA/Hibernate.
  * **10% Web:** HTML5, CSS3 tradicional y scripts JavaScript básicos generados por el servidor.

---

### Las 5 Pantallas / Diseños UI/UX de la Alternativa 2:

#### Pantalla 2.1: Autenticación Estándar JSF
* **Objetivo:** Formulario clásico renderizado en el servidor mediante Managed Beans de JSF.
* **Componentes UI/UX:** Cuadro de diálogo central, etiquetas `h:inputText`, `h:inputSecret`, y `h:commandButton` que recarga la página completamente al enviar la petición HTTP POST.

```text
+--------------------------------------------------------------------------------------------------+
|                             SISTEMA WEB DE FARMACIAS PERUANAS (JSF)                              |
|                                                                                                  |
|                      +----------------------------------------------------+                      |
|                      |             INICIO DE SESIÓN - JAVA EE             |                      |
|                      +----------------------------------------------------+                      |
|                      |  Nombre de Usuario:                                |                      |
|                      |  [_______________________________________]         |                      |
|                      |                                                    |                      |
|                      |  Contraseña:                                       |                      |
|                      |  [***************************************]         |                      |
|                      |                                                    |                      |
|                      |  [ Botón: Iniciar Sesión (HTTP POST síncrono) ]   |                      |
|                      +----------------------------------------------------+                      |
+--------------------------------------------------------------------------------------------------+
```

---

#### Pantalla 2.2: Menú de Navegación Clásico con Tablas JSF
* **Objetivo:** Panel administrativo con menú lateral izquierdo rígido y contenedor central de datos.
* **Componentes UI/UX:** Menú jerárquico `p:menu` (Inventario, Almacén, Movimientos, Usuarios), tabla de datos básica `p:dataTable` con paginación server-side.

```text
+--------------------------------------------------------------------------------------------------+
| CABECERA: Sistema Farmacias (Java EE) | Usuario: admin | Rol: Administrador General | [ Salir ]  |
+---------------------+----------------------------------------------------------------------------+
| MENÚ PRINCIPAL      | PANEL CENTRAL DE INVENTARIO LOCAL                                          |
| - Inicio            | Sucursal: Local 001 - San Isidro                                           |
| - Mantenimiento     | +---------------+-------------------+---------------+--------+-------------+|
|   * Fármacos        | | Código EAN    | Nombre Producto   | Categoría     | Stock  | Precio S/.  ||
|   * Lotes           | +---------------+-------------------+---------------+--------+-------------+|
| - Movimientos       | | 7750123456789 | Amoxicilina 500mg | Antibióticos  | 25 cjs | S/ 36.00    ||
|   * Entradas        | | 7750987654321 | Paracetamol 500mg | Analgésicos   | 80 cjs | S/ 12.50    ||
|   * Salidas         | +---------------+-------------------+---------------+--------+-------------+|
| - Reportes          | Mostrando página 1 de 25 [ Anterior ] [ 1 ] [ 2 ] [ Siguiente ]            |
+---------------------+----------------------------------------------------------------------------+
```

---

#### Pantalla 2.3: Formulario Síncrono de Mantenimiento (CRUD) de Medicamentos
* **Objetivo:** Registro, modificación y eliminación tradicional de medicamentos y lotes en la base de datos.
* **Componentes UI/UX:** Formulario con validadores JSF estándar (`f:validateRequired`, `f:validateDoubleRange`), botones de Guardar, Cancelar y Limpiar.

```text
+--------------------------------------------------------------------------------------------------+
| MANTENIMIENTO DE MEDICAMENTOS (FORMULARIO CRUD - JSF)                                            |
+--------------------------------------------------------------------------------------------------+
|  Código de Barras EAN-13: [ 7750123456789        ]                                               |
|  Nombre Comercial:        [ Amoxicilina 500mg Cápsulas                   ]                       |
|  Principio Activo:        [ Amoxicilina Trihidrato                       ]                       |
|  Registro DIGEMID:        [ EN-04892 DIGEMID                             ]                       |
|  Precio Unitario (S/.):   [ 36.00       ]  Stock de Seguridad: [ 20      ]                       |
|  Requiere Receta Médica:  [X] SÍ  [ ] NO                                                         |
|                                                                                                  |
|  [ Botón: Guardar Registro ]    [ Botón: Modificar ]    [ Botón: Eliminar ]    [ Botón: Cancelar]|
+--------------------------------------------------------------------------------------------------+
```

---

#### Pantalla 2.4: Reporte Tabular Estático de Caducidades
* **Objetivo:** Generación de una matriz tabular completa de lotes para exportación a hojas de cálculo.
* **Componentes UI/UX:** Filtro por fecha de corte, tabla `p:dataTable` con botón de exportación `p:dataExporter` hacia archivo Excel/PDF.

```text
+--------------------------------------------------------------------------------------------------+
| REPORTE DE VENCIMIENTOS DE LOTES (SISTEMA MONOLÍTICO)                                            |
+--------------------------------------------------------------------------------------------------+
| Fecha de Corte: [ 30/09/2026 ]  Sucursal: [ Todas las Sucursales (Consolidado) v ] [ Generar ]   |
+--------------------------------------------------------------------------------------------------+
| +-------------+-------------------------+--------------------+------------------+---------------+ |
| | Código Lote | Fármaco                 | Fecha Vencimiento  | Días Restantes   | Cantidad Cajas| |
| +-------------+-------------------------+--------------------+------------------+---------------+ |
| | LT-AMX-2024 | Amoxicilina 500mg       | 15/10/2026         | 15 días          | 40            | |
| | LT-AZI-2024 | Azitromicina 500mg      | 28/10/2026         | 28 días          | 25            | |
| +-------------+-------------------------+--------------------+------------------+---------------+ |
| [ Botón: Exportar a Microsoft Excel (.xls) ]    [ Botón: Imprimir Reporte en PDF ]               |
+--------------------------------------------------------------------------------------------------+
```

---

#### Pantalla 2.5: Historial de Movimientos de Almacén (Kardex Físico)
* **Objetivo:** Registro cronológico de todas las transacciones de entrada, salida y ajustes en el inventario.
* **Componentes UI/UX:** Listado transaccional secuencial con fecha, tipo de movimiento (Venta, Devolución, Entrada CD) y saldo final.

```text
+--------------------------------------------------------------------------------------------------+
| CONSULTA DE KARDEX DE ALMACÉN (HISTORIAL TRANSACCIONAL)                                          |
+--------------------------------------------------------------------------------------------------+
| Fármaco: [ Amoxicilina 500mg v ]  Rango: [ 01/09/2026 ] al [ 25/09/2026 ] [ Consultar Kardex ]   |
+--------------------------------------------------------------------------------------------------+
| +------------------+-------------------+-----------+------------+------------+-----------------+ |
| | Fecha y Hora     | Tipo Movimiento   | N° Doc.   | Entrada    | Salida     | Saldo Actual    | |
| +------------------+-------------------+-----------+------------+------------+-----------------+ |
| | 20/09/2026 09:30 | Venta Ventanilla  | BOL-10492 | -          | 2 cajas    | 25 cajas        | |
| | 18/09/2026 14:15 | Entrada de CD     | GUIA-8490 | 20 cajas   | -          | 27 cajas        | |
| | 15/09/2026 11:00 | Venta Ventanilla  | BOL-10380 | -          | 1 caja     | 7 cajas         | |
| +------------------+-------------------+-----------+------------+------------+-----------------+ |
+--------------------------------------------------------------------------------------------------+
```

---

```
====================================================================================================
                                      ALTERNATIVA 3
               ERP COMERCIAL EN LA NUBE CON MIDDLEWARE DE INTEGRACIÓN JAVA
====================================================================================================
```

### 1. Descripción Técnica y Uso de TIC
* **Enfoque:** Adquisición de licencias de un software ERP propietario en la nube (SAP Business One / Microsoft Dynamics) para la gestión centralizada del inventario, complementado con un **Middleware de integración en Java** (Broker de colas JMS / Spring Integration) que conecta los sistemas de farmacia con las APIs del ERP.
* **Uso de TIC (Garantía Java):**
  * **50% Java:** Java 17, Spring Integration, Apache Camel, ActiveMQ / RabbitMQ, JDBC, JPA.
  * **50% Software Comercial Propietario:** Plataforma ERP Cloud (Módulos de Almacén, Planificación y Logística).

---

### Las 5 Pantallas / Diseños UI/UX de la Alternativa 3:

#### Pantalla 3.1: Panel de Monitoreo del Middleware de Integración Java
* **Objetivo:** Interfaz técnica desarrollada en Java para supervisar la sincronización de tramas, colas de mensajes y salud de las conexiones entre farmacias y el ERP.
* **Componentes UI/UX:** Semáforos de conexión, métricas de latencia en milisegundos, contador de mensajes encolados y tasa de éxito de sincronización.

```text
+--------------------------------------------------------------------------------------------------+
| [JAVA MIDDLEWARE MONITOR] - Broker de Integración SIIP <-> ERP Cloud                             |
+--------------------------------------------------------------------------------------------------+
| Estado de Conexión ERP: [ 🟢 CONECTADO ] | Latencia Promedio: [ 142 ms ] | Hilos Activos: [ 16 ] |
+--------------------------------------------------------------------------------------------------+
| MÉTRICAS DE COLAS DE MENSAJES (APACHE CAMEL / JMS):                                              |
| - Cola de Salidas de Stock:  [ 124 msg/seg ] - Estado: 🟢 Normal                                |
| - Cola de Órdenes Traslado:  [   8 msg/seg ] - Estado: 🟢 Normal                                |
| - Cola de Errores/Reintentos:[   2 mensajes] - Estado: 🟡 Atención                              |
|                                                                                                  |
| [ LOG DE TRAMAS EN TIEMPO REAL ]:                                                                |
| 14:02:11 [INFO] Sincronización exitosa SUC-001 -> ERP_INVENTORY_UPDATE (ID: 98124)               |
| 14:02:15 [INFO] Solicitud de reabastecimiento enviada a ERP_MRP_MODULE (ID: 98125)               |
+--------------------------------------------------------------------------------------------------+
```

---

#### Pantalla 3.2: Interfaz del ERP - Gestión Maestra de Almacenes
* **Objetivo:** Pantalla nativa del software ERP comercial para el control consolidado de stock en los macro-centros de distribución.
* **Componentes UI/UX:** Formulario ERP estándar con códigos de almacén central, valorización de inventario en moneda extranjera/nacional y niveles de rotación global.

```text
+--------------------------------------------------------------------------------------------------+
| ERP CLOUD - MÓDULO DE GESTIÓN DE MATERIALES Y ALMACENES (CD CENTRAL HUACHIPA)                    |
+--------------------------------------------------------------------------------------------------+
| Almacén Central: [ ALM-01 HUACHIPA CENTRAL v ] | Moneda: [ PEN - Soles ]                         |
+--------------------------------------------------------------------------------------------------+
| +--------------+-------------------------+-------------+---------------+------------------------+|
| | Código Mat.  | Descripción Material    | Stock Físico| Stock Reserva | Valorización Total     ||
| +--------------+-------------------------+-------------+---------------+------------------------+|
| | MAT-100849   | Amoxicilina 500mg Cax100| 12,400 cjs  |  1,500 cjs    | S/ 446,400.00          ||
| | MAT-100912   | Paracetamol 500mg Cax100| 35,000 cjs  |  4,200 cjs    | S/ 437,500.00          ||
| +--------------+-------------------------+-------------+---------------+------------------------+|
| [ Botón ERP: Ajuste de Inventario ]   [ Botón ERP: Bloqueo de Lote ]   [ Botón ERP: Auditoría ]  |
+--------------------------------------------------------------------------------------------------+
```

---

#### Pantalla 3.3: Interfaz del ERP - Planificación de Demanda (Módulo MRP)
* **Objetivo:** Cálculo automático de necesidades de reabastecimiento global basado en históricos de compra.
* **Componentes UI/UX:** Tabla de pronóstico estadístico por familia de producto, tiempos de entrega de laboratorios (*lead time*) y órdenes de compra automáticas.

```text
+--------------------------------------------------------------------------------------------------+
| ERP CLOUD - PLANIFICACIÓN DE NECESIDADES DE MATERIALES (MRP)                                     |
+--------------------------------------------------------------------------------------------------+
| Periodo de Pronóstico: [ Octubre 2026 v ] | Método: [ Media Móvil Ponderada ERP v ]              |
+--------------------------------------------------------------------------------------------------+
| +------------------+---------------------+-------------------+------------------+---------------+|
| | Proveedor / Lab. | Producto            | Demanda Proyectada| Stock Proyectado | Pedido Suger. ||
| +------------------+---------------------+-------------------+------------------+---------------+|
| | Medifarma S.A.   | Amoxicilina 500mg   | 45,000 cajas      | 12,400 cajas     | 32,600 cajas  ||
| | Farmindustria    | Azitromicina 500mg  | 18,000 cajas      |  4,100 cajas     | 13,900 cajas  ||
| +------------------+---------------------+-------------------+------------------+---------------+|
| [ Botón ERP: Generar Órdenes de Compra Automáticas hacia Laboratorios Fabricantes ]              |
+--------------------------------------------------------------------------------------------------+
```

---

#### Pantalla 3.4: Interfaz del ERP - Asignación y Despacho Logístico
* **Objetivo:** Programación de camiones y rutas de distribución física desde el CD hacia las sucursales.
* **Componentes UI/UX:** Programador de flota vehicular, capacidad de carga en toneladas/volumen y hojas de ruta para transporte.

```text
+--------------------------------------------------------------------------------------------------+
| ERP CLOUD - GESTIÓN LOGÍSTICA DE DISTRIBUCIÓN Y EMBARQUE                                         |
+--------------------------------------------------------------------------------------------------+
| Ruta: [ RUTA-04 LIMA SUR (Miraflores - Surco - Chorrillos) v ] | Fecha: [ 28/09/2026 ]           |
+--------------------------------------------------------------------------------------------------+
| Vehículo Asignado: [ Camión Isuzu 5 Ton (Placa B4F-892) ] | Conductor: [ Carlos Huamán ]         |
| Capacidad Utilizada: [ ████████████████░░░░ ] 82% (3.8 Toneladas)                                |
|                                                                                                  |
| Sedes de la Ruta de Entrega:                                                                     |
| 1. SUC-002 Mifarma Miraflores (Entrega: 45 bultos) - Estado: Programado                          |
| 2. SUC-005 InkaFarma Surco (Entrega: 60 bultos) - Estado: Programado                             |
|                                                                                                  |
| [ Botón ERP: Cerrar Manifiesto de Carga ]   [ Botón ERP: Imprimir Hojas de Ruta ]                |
+--------------------------------------------------------------------------------------------------+
```

---

#### Pantalla 3.5: Pantalla de Trazabilidad y Errores (Logs del Middleware)
* **Objetivo:** Diagnóstico de tramas de datos fallidas que no pudieron insertarse en el ERP para su corrección y reenvío.
* **Componentes UI/UX:** Consola de errores con identificador de transacción, código de error HTTP/SOAP devuelto por el ERP y botón de reintento forzado (*Retry*).

```text
+--------------------------------------------------------------------------------------------------+
| MIDDLEWARE JAVA - BANDEJA DE EXCEPCIONES Y RETRANSICIÓN DE TRAMAS FALLIDAS                       |
+--------------------------------------------------------------------------------------------------+
| Filtro de Error: [ Todos los Errores (HTTP 500 / Timeout) v ] [ Actualizar Consola ]             |
+--------------------------------------------------------------------------------------------------+
| +------------+------------------+---------+------------------------------+----------------------+|
| | ID Trama   | Sucursal Origen  | Hora    | Detalle del Error Devuelto   | Acción de Corrección ||
| +------------+------------------+---------+------------------------------+----------------------+|
| | TRM-99120  | SUC-042 Tacna    | 13:45:10| SOAP_TIMEOUT: ERP no responde| [ 🔄 Reintentar ]    ||
| | TRM-99124  | SUC-018 Trujillo | 13:50:22| INVALID_SKU: Código no existe| [ ✏️ Editar Payload ] ||
| +------------+------------------+---------+------------------------------+----------------------+|
| [ Botón: Reintentar Todas las Tramas Encoladas (Batch Retry) ]                                   |
+--------------------------------------------------------------------------------------------------+
```

---

## 6.2. COMPARACIÓN EXHAUSTIVA ENTRE LAS ALTERNATIVAS DE SOLUCIÓN

```
+--------------------------------------------------------------------------------------------------+
|                    MATRIZ COMPARATIVA DE FACTIBILIDAD Y ATRIBUTOS DE CALIDAD                     |
+---------------------+-----------------------------+-----------------------+----------------------+
| Criterio Evaluado   | Alternativa 1 (Elegida)     | Alternativa 2         | Alternativa 3        |
|                     | Microservicios Spring+React | Monolito Java EE      | ERP Cloud + Middleware|
+---------------------+-----------------------------+-----------------------+----------------------+
| Uso de TIC Java     | 70% Java (Spring Boot/JPA)  | 90% Java (JSF/EJB)    | 50% Java Middleware  |
| Escalabilidad       | Alta (Horizontal elástica)  | Baja (Vertical)       | Media (Límites ERP)  |
| Resiliencia / Fallo | Alta (Tolerancia a fallos)  | Nula (Punto único)    | Alta en ERP / Media  |
| Experiencia UX      | Asíncrona, rápida y moderna | Síncrona, recarga web | Rígida / Compleja    |
| Costo Licenciamiento| S/ 0 (100% Open Source)     | S/ 0 (Open Source)    | Muy Alto (Inviable)  |
| Algoritmo a Medida  | Total (Haversine & FEFO)    | Total                 | Restringido por ERP  |
| Factibilidad Técnica| ALTA                        | MEDIA / BAJA          | MEDIA                |
| Factibilidad Econó. | ALTA (Costo-Eficiente)      | MEDIA                 | BAJA (Inviable)      |
+---------------------+-----------------------------+-----------------------+----------------------+
```

---

## 6.3. SELECCIÓN Y JUSTIFICACIÓN DE LA ALTERNATIVA MÁS VIABLE

### Selección Concluyente: **Alternativa 1 (Arquitectura de Microservicios con Java Spring Boot y React)**

#### Justificación Técnica y de Negocio:
1. **Soporte de Alta Concurrencia Nacional:** Farmacias Peruanas opera más de 2,200 locales que ejecutan más de **350 transacciones por segundo (TPS)** en horas punta. Un sistema monolítico (Alternativa 2) representaría un grave riesgo de caída total ante sobrecargas, mientras que la arquitectura de microservicios distribuye la carga elásticamente.
2. **Viabilidad Económica:** La Alternativa 3 (ERP Comercial) implicaría costos millonarios en el pago de licencias de usuario para más de 2,500 farmacéuticos a nivel nacional. La Alternativa 1 aprovecha tecnologías de código abierto de clase mundial (**Spring Boot, PostgreSQL, React**), eliminando costos de licenciamiento.
3. **Flexibilidad Algorítmica:** Permite implementar con exactitud matemática el cálculo de proximidad de **Haversine (< 10 km)** y el semáforo **FEFO a 90, 60 y 30 días** para alcanzar la meta de **reducir en un 22% las pérdidas económicas por medicamentos vencidos**.
4. **Cumplimiento Académico:** Cumple holgadamente con el requisito del curso de desarrollar más del **50% del núcleo de la solución en lenguaje Java**.
