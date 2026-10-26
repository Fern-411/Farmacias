# SISTEMA INTELIGENTE DE INVENTARIO Y PREDICCIÓN (SIIP)
## Farmacias Peruanas: InkaFarma & Mifarma
### Documento Maestro de Ingeniería de Software: Diagramas, Casos de Uso y Arquitectura

---

## 1. Diagrama de Casos de Uso del Sistema (UML)

El diagrama modela las interacciones entre los actores clave (**Químico Farmacéutico**, **Administrador del Centro de Distribución (CD)**, **Gerente de Operaciones** y el **Motor Predictivo**) con las funcionalidades del sistema SIIP.

```mermaid
graph LR
    subgraph Actores
        QF((fa:fa-user Químico Farmacéutico))
        ACD((fa:fa-user-tie Administrador de CD))
        GO((fa:fa-chart-line Gerente de Operaciones))
        SYS[fa:fa-robot Motor Predictivo SIIP]
    end

    subgraph Sistema Inteligente de Inventario y Predicción SIIP
        CU06(CU06: Autenticar y Seleccionar Sucursal)
        CU01(CU01: Consultar Inventario Global y Sedes Cercanas <10km)
        CU02(CU02: Generar Alerta Predictiva de Quiebre de Stock)
        CU03(CU03: Gestionar y Autorizar Traslado Interno)
        CU04(CU04: Monitorear Caducidad de Lotes a 90/60/30 días)
        CU05(CU05: Emitir Guía de Remisión Electrónica)
        CU07(CU07: Visualizar Dashboard Ejecutivo de Quiebres y Mermas)
        CU08(CU08: Actualizar Stock en Tiempo Real)
    end

    QF --> CU06
    QF --> CU01
    QF --> CU04
    QF --> CU08

    ACD --> CU06
    ACD --> CU02
    ACD --> CU03
    ACD --> CU04
    ACD --> CU05

    GO --> CU06
    GO --> CU07

    SYS --> CU02
    SYS --> CU04

    CU03 -.->|<<include>>| CU05
    CU01 -.->|<<include>>| CU06
    CU03 -.->|<<include>>| CU06
```

---

## 2. Especificación Detallada de Casos de Uso (Estándar RUP / IEEE 830)

### CU01: Consultar Inventario Global y Sedes Cercanas (< 10 km)
- **Identificador**: CU01
- **Nombre**: Consultar Inventario Global y Sedes Cercanas
- **Actores**: Químico Farmacéutico (Principal), Administrador de CD (Secundario).
- **Propósito**: Permitir al farmacéutico en ventanilla verificar la disponibilidad de un fármaco no disponible en su sede local, localizando stock en las 5 sucursales más cercanas dentro de un radio de 10 kilómetros para orientar al paciente o solicitar un traslado.
- **Precondiciones**:
  1. El usuario debe haber iniciado sesión en el sistema SIIP.
  2. La sucursal activa debe tener sus coordenadas geográficas (latitud, longitud) registradas.
- **Flujo Principal**:
  1. El farmacéutico ingresa al módulo "Buscador de Inventario".
  2. El farmacéutico escribe el nombre comercial, principio activo o código del medicamento (ej. *Amoxicilina 500mg*).
  3. El sistema valida la entrada y consulta el microservicio de inventario en tiempo real.
  4. El sistema presenta el stock disponible en la sucursal actual del farmacéutico.
  5. El sistema calcula la distancia mediante fórmula geodésica (Haversine) contra todas las sucursales de la red.
  6. El sistema filtra y lista las **5 sucursales con stock disponible** a menos de 10 km, ordenadas por menor distancia.
  7. Para cada sucursal encontrada, el sistema muestra: Nombre de sede (InkaFarma / Mifarma), Dirección exacta, Distancia en kilómetros, Lotes vigentes y Stock disponible.
  8. El farmacéutico selecciona una sede con sobrestock para visualizar la opción de "Solicitar Traslado de Emergencia".
- **Flujos Alternos**:
  - **FA-01 (Sin stock en radio de 10 km)**: Si no existen sucursales con stock a menos de 10 km, el sistema muestra una alerta informativa y sugiere consultar el stock en el Centro de Distribución Central (CD Huachipa / Lurín).
  - **FA-02 (Medicamento no registrado)**: Si el código o nombre no existe, el sistema ofrece sugerencias por principio activo o medicamentos genéricos equivalentes.
- **Postcondiciones**: La consulta queda registrada en el log de búsquedas para el análisis de demanda insatisfecha.

---

### CU02: Generar Alerta Predictiva de Quiebre de Stock
- **Identificador**: CU02
- **Nombre**: Generar Alerta Predictiva de Quiebre de Stock
- **Actores**: Motor Predictivo SIIP (Principal), Administrador de CD (Secundario).
- **Propósito**: Evaluar continuamente la velocidad de rotación de cada medicamento y predecir cuándo una sucursal sufrirá desabastecimiento en los próximos 7 días, notificando automáticamente al CD.
- **Precondiciones**:
  1. Existen registros de ventas históricas de al menos 30 días en la sucursal.
  2. Los umbrales de stock mínimo y stock de seguridad están parametrizados.
- **Flujo Principal**:
  1. El servicio cron o evento de dispensación dispara el algoritmo de predicción de demanda.
  2. El sistema calcula el **Consumo Promedio Diario ($CPD$)** del medicamento en la sucursal:
     $$CPD = \frac{\sum \text{Ventas últimos 14 días}}{14}$$
  3. El sistema calcula la **Autonomía de Inventario en Días ($AID$)**:
     $$AID = \frac{\text{Stock Físico Actual}}{CPD}$$
  4. Si $AID \le 7 \text{ días}$ o el stock actual cae por debajo del umbral de seguridad ($SS$), el sistema genera una alerta predictiva con severidad **CRÍTICA**.
  5. El sistema busca automáticamente sucursales dentro de la misma zona geográfica que presenten **Sobrestock** ($AID > 25 \text{ días}$ del mismo medicamento).
  6. El sistema genera una **Propuesta de Traslado Balanceado** y la envía a la bandeja del Administrador de CD.
- **Postcondiciones**: La alerta predictiva queda visible en el Dashboard y en la Bandeja de Notificaciones en tiempo real.

---

### CU03: Gestionar y Autorizar Traslado Interno de Stock
- **Identificador**: CU03
- **Nombre**: Gestionar y Autorizar Traslado Interno de Stock
- **Actores**: Administrador de Centro de Distribución (CD).
- **Propósito**: Revisar, validar y autorizar las propuestas automáticas o manuales de traslado de lotes entre una sucursal donante (sobrestock) y una sucursal receptora (riesgo de quiebre).
- **Precondiciones**:
  1. Debe existir una sugerencia de traslado generada por el CU02 o una solicitud manual del CU01.
  2. La sucursal origen debe contar con lotes vigentes no bloqueados.
- **Flujo Principal**:
  1. El Administrador de CD accede a la "Bandeja de Gestión de Traslados".
  2. El sistema muestra la lista de traslados recomendados con: Sucursal Origen, Sucursal Destino, Medicamento, Cantidad Sugerida, Ahorro estimado y Distancia.
  3. El Administrador selecciona una recomendación y presiona **"Aprobar Traslado"**.
  4. El sistema reserva automáticamente el stock en la sucursal origen (estado *Stock en Tránsito*).
  5. El sistema invoca al caso de uso **CU05: Emitir Guía de Remisión Electrónica**.
  6. El sistema notifica a ambas sucursales sobre la orden de traslado aprobada.
- **Flujos Alternos**:
  - **FA-01 (Rechazo de Traslado)**: El Administrador selecciona "Rechazar", ingresa el motivo (ej. *Cierre temporal de local*, *Lote comprometido*) y el sistema descarta la sugerencia recalculando alternativas.
  - **FA-02 (Ajuste de Cantidad)**: El Administrador modifica la cantidad de cajas a transferir antes de aprobar.
- **Postcondiciones**: Se actualiza el inventario contable y se genera el documento de transporte oficial.

---

### CU04: Monitorear Caducidad de Lotes (Alertas a 90, 60 y 30 Días)
- **Identificador**: CU04
- **Nombre**: Monitorear Caducidad de Lotes y Prevenir Mermas
- **Actores**: Químico Farmacéutico, Administrador de CD, Motor Predictivo.
- **Propósito**: Categorizar y alertar los lotes próximos a vencer para priorizar su salida (método FEFO - First Expired, First Out) y cumplir con la meta de reducir un **22% las pérdidas económicas**.
- **Precondiciones**: Los lotes están registrados con fecha de vencimiento y registro sanitario DIGEMID.
- **Flujo Principal**:
  1. El sistema evalúa diariamente a las 00:00 horas la diferencia entre la fecha actual y la fecha de expiración de cada lote:
     $$\Delta t = \text{Fecha Vencimiento} - \text{Fecha Actual}$$
  2. El sistema clasifica el riesgo según los rangos del negocio:
     - **Semáforo Amarillo (Atención)**: $61 \le \Delta t \le 90 \text{ días}$. Sugiere promociones o reubicación a sedes de mayor rotación.
     - **Semáforo Naranja (Alerta Alta)**: $31 \le \Delta t \le 60 \text{ días}$. Priorización absoluta en dispensación en ventanilla.
     - **Semáforo Rojo (Crítico)**: $\Delta t \le 30 \text{ días}$. Bloqueo para devolución al laboratorio proveedor o liquidación autorizada.
  3. El sistema consolida el valor monetario en riesgo ($S/.$) y lo refleja en el Dashboard Ejecutivo.
- **Postcondiciones**: El sistema genera alertas visuales inmediatas y badges de color en la ficha del medicamento.

---

### CU05: Emitir Guía de Remisión Electrónica de Traslado
- **Identificador**: CU05
- **Nombre**: Emitir Guía de Remisión Electrónica de Traslado
- **Actores**: Administrador de CD (Principal), Sistema de Facturación Electrónica / SUNAT (Secundario).
- **Propósito**: Generar el documento legal oficial requerido por SUNAT y DIGEMID para amparar el transporte terrestre de medicamentos entre sedes de InkaFarma/Mifarma.
- **Precondiciones**: El traslado ha sido aprobado en el CU03.
- **Flujo Principal**:
  1. El sistema genera el número correlativo de la guía (ej. `GR-001-0008492`).
  2. El sistema compila los datos: Razón Social (*Farmacias Peruanas S.A.*, RUC `20509872134`), Dirección de partida, Dirección de llegada, Datos del transportista/vehículo, Detalle de medicamentos (Nombre, Lote, Fecha de Vencimiento, Cantidad en unidades).
  3. El sistema genera el código de control y código QR reglamentario.
  4. El sistema presenta la vista previa imprimible y en formato digital PDF para despacho.
- **Postcondiciones**: La guía de remisión queda vinculada al traslado y con estado "En Despacho".

---

## 3. Diagrama de Procesos de Negocio BPMN 2.0

Diagrama de flujo del proceso integral de **Detección de Quiebres y Traslado Inteligente entre Sucursales**:

```mermaid
flowchart TD
    subgraph PO["Punto de Venta (Farmacia Origen)"]
        A1([Inicio: Venta de Medicamento en Caja]) --> A2[Dispensación y Resta de Stock Físico]
        A2 --> A3[Envío de Evento al Microservicio de Inventario]
    end

    subgraph MI["Microservicio de Inventario & Predicción"]
        A3 --> B1[Actualizar Stock Centralizado en PostgreSQL]
        B1 --> B2{¿Stock Actual <= Umbral Mínimo?}
        B2 -- NO --> B3([Fin del Proceso: Operación Normal])
        B2 -- SÍ --> B4[Calcular Consumo Promedio Diario CPD y Días de Autonomía]
        B4 --> B5{¿Riesgo de Quiebre <= 7 Días?}
        B5 -- NO --> B6[Registrar Alerta Preventiva Baja]
        B5 -- SÍ --> B7[Algoritmo Geoespacial: Buscar Sedes con Sobrestock < 10 km]
        B7 --> B8[Generar Propuesta de Traslado Inteligente]
    end

    subgraph CD["Centro de Distribución (Administrador CD)"]
        B8 --> C1[Notificación en Bandeja de Alertas del Dashboard]
        C1 --> C2{¿Administrador Aprueba Traslado?}
        C2 -- RECHAZAR --> C3[Registrar Motivo de Rechazo y Cerrar Alerta]
        C2 -- APROBAR --> C4[Confirmar Cantidad y Validar Lotes FEFO]
    end

    subgraph LOG["Logística y Despacho"]
        C4 --> D1[Generar Guía de Remisión Electrónica con QR]
        D1 --> D2[Bloquear Stock en Tránsito en Sucursal Donante]
        D2 --> D3[Transporte Físico y Recepción en Sucursal Afectada]
        D3 --> D4[Confirmar Recepción y Restablecer Stock Óptimo]
        D4 --> D5([Fin: Quiebre de Stock Evitado Satisfactoriamente])
    end

    style A1 fill:#e0f2fe,stroke:#0284c7,stroke-width:2px;
    style B3 fill:#dcfce7,stroke:#16a34a,stroke-width:2px;
    style D5 fill:#dcfce7,stroke:#16a34a,stroke-width:2px;
    style B2 fill:#fef3c7,stroke:#d97706,stroke-width:2px;
    style B5 fill:#fee2e2,stroke:#dc2626,stroke-width:2px;
    style C2 fill:#fef3c7,stroke:#d97706,stroke-width:2px;
```

---

## 4. Diagrama de Arquitectura de la Solución (Microservicios)

La solución adopta una **Arquitectura de Microservicios con Spring Boot y React**, asegurando alta disponibilidad (99.9%), cumplimiento de seguridad JWT y separación de responsabilidades:

```mermaid
graph TB
    subgraph CLIENTE["Capa de Presentación (Frontend)"]
        WEB["React 18 + Vite + Tailwind CSS<br/>(SPA Corporativo InkaFarma/Mifarma)"]
    end

    subgraph GATEWAY["Capa de Enrutamiento y Seguridad"]
        SCG["Spring Cloud API Gateway<br/>(Puerto: 8080)<br/>- Validación JWT<br/>- Balanceo de Carga<br/>- Rate Limiting"]
    end

    subgraph MICROSERVICIOS["Capa de Negocio (Microservicios Spring Boot)"]
        MS_AUTH["ms-auth-users<br/>(Puerto: 8081)<br/>- Spring Security<br/>- Autenticación JWT<br/>- Roles y Sucursales"]
        MS_INV["ms-inventario<br/>(Puerto: 8082)<br/>- Stock Centralizado<br/>- Búsqueda Geoespacial <10km<br/>- Registro de Lotes"]
        MS_PRED["ms-prediccion-alertas<br/>(Puerto: 8083)<br/>- Motor Predictivo de Quiebres<br/>- Semáforo Caducidad 90/60/30d<br/>- Consumo Promedio Diario"]
        MS_TRANS["ms-traslados-guias<br/>(Puerto: 8084)<br/>- Sugerencias de Balanceo<br/>- Emisión Guía de Remisión<br/>- Trazabilidad de Envíos"]
    end

    subgraph PERSISTENCIA["Capa de Persistencia (Base de Datos)"]
        DB[(PostgreSQL 16 Enterprise<br/>- Transacciones ACID<br/>- Índices Geoespaciales PostGIS<br/>- Alta Concurrencia)]
    end

    WEB -- HTTPS / REST JSON (JWT) --> SCG
    SCG --> MS_AUTH
    SCG --> MS_INV
    SCG --> MS_PRED
    SCG --> MS_TRANS

    MS_AUTH --> DB
    MS_INV --> DB
    MS_PRED --> DB
    MS_TRANS --> DB

    style CLIENTE fill:#f0fdf4,stroke:#16a34a,stroke-width:2px;
    style GATEWAY fill:#eff6ff,stroke:#2563eb,stroke-width:2px;
    style MICROSERVICIOS fill:#fdf4ff,stroke:#9333ea,stroke-width:2px;
    style PERSISTENCIA fill:#fffbeb,stroke:#d97706,stroke-width:2px;
```

---

## 5. Diagrama de Base de Datos Entidad-Relación (MER / DER)

Modelo de datos relacional para PostgreSQL enfocado en la trazabilidad por lotes, caducidad, geolocalización y balanceo de transferencias:

```mermaid
erDiagram
    SUCURSAL ||--o{ INVENTARIO_SUCURSAL : "almacena"
    SUCURSAL ||--o{ USUARIO : "pertenece"
    SUCURSAL ||--o{ SOLICITUD_TRASLADO : "origen"
    SUCURSAL ||--o{ SOLICITUD_TRASLADO : "destino"
    CATEGORIA ||--o{ MEDICAMENTO : "agrupa"
    MEDICAMENTO ||--o{ LOTE : "tiene"
    MEDICAMENTO ||--o{ INVENTARIO_SUCURSAL : "registrado_en"
    LOTE ||--o{ DETALLE_TRASLADO : "incluido_en"
    LOTE ||--o{ ALERTA_PREDICTIVA : "monitoreado_en"
    SOLICITUD_TRASLADO ||--|{ DETALLE_TRASLADO : "contiene"
    SOLICITUD_TRASLADO ||--o| GUIA_REMISION : "genera"
    ROL ||--o{ USUARIO : "posee"

    SUCURSAL {
        bigint id_sucursal PK
        varchar codigo UK
        varchar nombre
        varchar marca
        varchar direccion
        varchar distrito
        varchar provincia
        varchar departamento
        decimal latitud
        decimal longitud
        boolean activo
    }

    CATEGORIA {
        bigint id_categoria PK
        varchar nombre
        varchar descripcion
    }

    MEDICAMENTO {
        bigint id_medicamento PK
        varchar codigo_ean UK
        varchar nombre_comercial
        varchar principio_activo
        varchar concentracion
        varchar forma_farmaceutica
        bigint id_categoria FK
        decimal precio_unitario
        varchar registro_sanitario_digemid
        boolean requiere_receta
    }

    LOTE {
        bigint id_lote PK
        varchar codigo_lote
        bigint id_medicamento FK
        date fecha_fabricacion
        date fecha_vencimiento
        int cantidad_inicial
        varchar estado_lote
    }

    INVENTARIO_SUCURSAL {
        bigint id_inventario PK
        bigint id_sucursal FK
        bigint id_medicamento FK
        int stock_actual
        int stock_minimo
        int stock_maximo
        int stock_seguridad
        decimal consumo_promedio_diario
        timestamp ultima_actualizacion
    }

    ALERTA_PREDICTIVA {
        bigint id_alerta PK
        bigint id_sucursal FK
        bigint id_medicamento FK
        bigint id_lote FK
        varchar tipo_alerta
        varchar severidad
        int dias_restantes
        text recomendacion
        boolean atendida
        timestamp fecha_generacion
    }

    SOLICITUD_TRASLADO {
        bigint id_traslado PK
        varchar codigo_traslado UK
        bigint id_sucursal_origen FK
        bigint id_sucursal_destino FK
        varchar estado
        varchar motivo
        timestamp fecha_solicitud
        timestamp fecha_autorizacion
        bigint id_usuario_autoriza FK
    }

    DETALLE_TRASLADO {
        bigint id_detalle PK
        bigint id_traslado FK
        bigint id_medicamento FK
        bigint id_lote FK
        int cantidad
    }

    GUIA_REMISION {
        bigint id_guia PK
        bigint id_traslado FK
        varchar numero_guia UK
        varchar ruc_emisor
        varchar transportista
        varchar placa_vehiculo
        varchar licencia_conducir
        text codigo_hash_qr
        timestamp fecha_emision
    }

    USUARIO {
        bigint id_usuario PK
        varchar username UK
        varchar password_hash
        varchar nombres
        varchar apellidos
        varchar email
        bigint id_rol FK
        bigint id_sucursal FK
        boolean activo
    }

    ROL {
        bigint id_rol PK
        varchar nombre_rol
        text descripcion
    }
```

---

## 6. Diagramas de Secuencia UML

### Secuencia 1: Consulta de Stock Geolocalizado (< 10 km)

```mermaid
sequenceDiagram
    autonumber
    actor QF as Químico Farmacéutico
    participant UI as Frontend React
    participant GW as API Gateway
    participant INV as ms-inventario
    participant DB as PostgreSQL DB

    QF->>UI: Ingresa nombre de fármaco ("Amoxicilina")
    UI->>GW: GET /api/v1/inventario/cercanos?lat=-12.09&lng=-77.03&query=Amoxicilina (Bearer Token)
    GW->>GW: Valida token JWT y permisos
    GW->>INV: Deriva petición HTTP
    INV->>DB: SELECT * FROM inventario WHERE medicamento ILIKE '%Amoxicilina%'
    DB-->>INV: Retorna registros de stock de sucursales
    INV->>INV: Aplica fórmula Haversine y filtra sucursales con distancia <= 10 km
    INV->>INV: Ordena las 5 sucursales más cercanas con stock > 0
    INV-->>GW: Retorna JSON con stock local + 5 farmacias cercanas
    GW-->>UI: 200 OK (Data JSON)
    UI-->>QF: Renderiza tabla comparativa con badges de distancia y stock
```

### Secuencia 2: Generación de Alerta Predictiva y Aprobación de Traslado

```mermaid
sequenceDiagram
    autonumber
    actor ACD as Administrador de CD
    participant PRED as ms-prediccion
    participant TRANS as ms-traslados
    participant DB as PostgreSQL DB
    participant UI as Dashboard React

    Note over PRED,DB: Cron Job evalúa ventas cada 6 horas
    PRED->>DB: Calcula CPD y compara con stock físico actual
    DB-->>PRED: Stock = 4 cajas, CPD = 1.2 cajas/día (Autonomía = 3.3 días)
    PRED->>DB: INSERT INTO ALERTA_PREDICTIVA (severidad='CRITICA', dias=3)
    PRED->>TRANS: Dispara búsqueda de excedente de stock en la red
    TRANS->>DB: Localiza Sede Miraflores (Stock = 95 cajas, CPD = 1.0 -> 95 días)
    TRANS->>DB: INSERT INTO SOLICITUD_TRASLADO (estado='PROPUESTO', cant=30)
    
    ACD->>UI: Accede a Bandeja de Traslados
    UI->>TRANS: GET /api/v1/traslados/sugeridos
    TRANS-->>UI: Lista de traslados inteligentes
    UI-->>ACD: Muestra recomendación: Mover 30 cajas de Miraflores a San Isidro
    
    ACD->>UI: Clic en "Aprobar Traslado"
    UI->>TRANS: POST /api/v1/traslados/{id}/aprobar
    TRANS->>DB: UPDATE inventario SET stock_en_transito = stock_en_transito + 30
    TRANS->>DB: INSERT INTO GUIA_REMISION (numero='GR-001-008492')
    TRANS-->>UI: 200 OK + Objeto Guía de Remisión
    UI-->>ACD: Muestra modal con Guía de Remisión generada y QR de control
```

---

## 7. WBS (Work Breakdown Structure) Jerárquico

Estructura de Desglose de Trabajo (EDT/WBS) con asignación de cuota técnica:

```mermaid
graph TD
    WBS[1.0 Sistema Inteligente de Inventario y Predicción SIIP]
    
    WBS --> G1[1.1 Gestión del Proyecto]
    G1 --> G11[1.1.1 Project Charter y Objetivos]
    G1 --> G12[1.1.2 Cronograma y Presupuesto]
    G1 --> G13[1.1.3 Gestión de Riesgos y Stakeholders]

    WBS --> R2[1.2 Ingeniería de Requerimientos]
    R2 --> R21[1.2.1 Especificación de Requisitos SRS]
    R2 --> R22[1.2.2 Modelado de Casos de Uso CU01-CU06]
    R2 --> R23[1.2.3 Diagrama de Procesos de Negocio BPMN]

    WBS --> D3[1.3 Diseño y Arquitectura]
    D3 --> D31[1.3.1 Arquitectura de Microservicios]
    D3 --> D32[1.3.2 Diseño de Base de Datos PostgreSQL]
    D3 --> D33[1.3.3 Diseño de API REST y Seguridad JWT]
    D3 --> D34[1.3.4 Prototipos UI/UX en React]

    WBS --> DEV4[1.4 Desarrollo del Software Mínimo 50% Java]
    DEV4 --> B41[1.4.1 Backend Spring Boot: Microservicio Inventario]
    DEV4 --> B42[1.4.2 Backend Spring Boot: Microservicio Predicción y Alertas]
    DEV4 --> B43[1.4.3 Backend Spring Boot: Microservicio Traslados y Guías]
    DEV4 --> F44[1.4.4 Frontend React: SPA con 5 Módulos Clave]

    WBS --> T5[1.5 Calidad, Pruebas y Despliegue]
    T5 --> T51[1.5.1 Pruebas Unitarias e Integración]
    T5 --> T52[1.5.2 Contenedorización con Docker]
    T53[1.5.3 Capacitación y Documentación Final]
    T5 --> T53

    style WBS fill:#1e293b,stroke:#0f172a,color:#ffffff,stroke-width:2px;
    style DEV4 fill:#0284c7,stroke:#0369a1,color:#ffffff,stroke-width:2px;
```

---

## 8. Diagrama de Gantt del Proyecto (Planificación a 4 Meses)

Cronograma detallado de ejecución de las 16 semanas del proyecto:

```mermaid
gantt
    title Cronograma de Implementación SIIP - Farmacias Peruanas (16 Semanas)
    dateFormat  YYYY-MM-DD
    section Mes 1: Requerimientos y Diseño
    Project Charter & Planificación      :done,    m1_1, 2026-09-01, 7d
    Levantamiento de Requisitos & SRS    :done,    m1_2, after m1_1, 10d
    Modelado BPMN y Casos de Uso        :done,    m1_3, after m1_2, 7d
    Diseño de Arquitectura y Base Datos :active,  m1_4, after m1_3, 7d
    section Mes 2: Backend Java Spring Boot
    Configuración Gateway y Seguridad   :         m2_1, 2026-10-01, 7d
    Microservicio de Inventario & JPA   :         m2_2, after m2_1, 10d
    Microservicio de Traslados y Guías  :         m2_3, after m2_2, 10d
    Pruebas Unitarias de Endpoints      :         m2_4, after m2_3, 4d
    section Mes 3: Frontend React y Predicción
    Desarrollo UI/UX React + Tailwind   :         m3_1, 2026-11-01, 12d
    Algoritmo Predictivo y Caducidad    :         m3_2, after m3_1, 8d
    Integración Frontend - Backend REST :         m3_3, after m3_2, 10d
    section Mes 4: Pruebas y Cierre
    Pruebas de Integración y Carga      :         m4_1, 2026-12-01, 7d
    Plan Piloto en Distrito Modelo      :         m4_2, after m4_1, 10d
    Capacitación y Entrega Final        :         m4_3, after m4_2, 7d
```

---

## 9. Resumen de Fórmulas y Reglas de Negocio Implementadas

1. **Fórmula Geodésica de Haversine para Proximidad (< 10 km)**:
   $$d = 2R \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta \text{lng}}{2}\right)}\right)$$
   *Donde $R = 6,371 \text{ km}$. El sistema filtra automáticamente las 5 sucursales con $d \le 10 \text{ km}$.*

2. **Cálculo de Severidad de Caducidad (Meta -22% Mermas)**:
   - Verde: $\Delta t > 90 \text{ días}$ (Estado Óptimo).
   - Amarillo: $60 < \Delta t \le 90 \text{ días}$ (Prioridad de venta / Promoción).
   - Naranja: $30 < \Delta t \le 60 \text{ días}$ (Despacho inmediato obligatorio).
   - Rojo: $\Delta t \le 30 \text{ días}$ (Riesgo Crítico de Merma).

3. **Cálculo de Sugerencia de Traslado Automático**:
   $$\text{Cantidad a Transferir} = \min\left(\text{Sobrestock Origen} - \text{Stock Seguridad Origen}, \; \text{Déficit Estimado a 15 Días Destino}\right)$$
