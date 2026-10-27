-- =============================================================================
-- ESQUEMA DDL COMPLETO (8 TABLAS) - POSTGRESQL SIIP FARMACIAS PERUANAS
-- =============================================================================

CREATE TABLE IF NOT EXISTS sucursales (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    marca VARCHAR(50) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(250) NOT NULL,
    distrito VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) NOT NULL DEFAULT 'Lima',
    telefono VARCHAR(50),
    horario VARCHAR(100) DEFAULT '24 Horas (Lunes a Domingo)',
    director_tecnico VARCHAR(150),
    latitud NUMERIC(10, 7) NOT NULL,
    longitud NUMERIC(10, 7) NOT NULL,
    es_centro_distribucion BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(250)
);

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    rol_id BIGINT NOT NULL REFERENCES roles(id),
    sucursal_id BIGINT REFERENCES sucursales(id),
    intentos_fallidos INT DEFAULT 0,
    bloqueado BOOLEAN DEFAULT FALSE,
    fecha_ultimo_acceso TIMESTAMP,
    fecha_bloqueo TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medicamentos (
    id BIGSERIAL PRIMARY KEY,
    codigo_ean VARCHAR(30) UNIQUE NOT NULL,
    codigo_can VARCHAR(30),
    nombre_comercial VARCHAR(150) NOT NULL,
    principio_activo VARCHAR(150) NOT NULL,
    marca_comercial VARCHAR(100),
    tipo_producto VARCHAR(50) DEFAULT 'MARCA',
    presentacion VARCHAR(100),
    laboratorio VARCHAR(100),
    categoria VARCHAR(100),
    precio_unitario NUMERIC(10, 2) NOT NULL,
    registro_sanitario VARCHAR(50),
    requiere_receta BOOLEAN DEFAULT FALSE,
    umbral_minimo INT DEFAULT 15,
    umbral_seguridad INT DEFAULT 25,
    consumo_promedio_diario NUMERIC(10, 2) DEFAULT 5.0,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS inventarios (
    id BIGSERIAL PRIMARY KEY,
    sucursal_id BIGINT NOT NULL REFERENCES sucursales(id),
    medicamento_id BIGINT NOT NULL REFERENCES medicamentos(id),
    stock_actual INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 15,
    stock_maximo INT NOT NULL DEFAULT 150,
    dias_autonomia INT DEFAULT 0,
    estado_stock VARCHAR(50) DEFAULT 'OPTIMO',
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_sucursal_medicamento UNIQUE (sucursal_id, medicamento_id)
);

CREATE TABLE IF NOT EXISTS lotes_caducidad (
    id BIGSERIAL PRIMARY KEY,
    medicamento_id BIGINT NOT NULL REFERENCES medicamentos(id),
    sucursal_id BIGINT NOT NULL REFERENCES sucursales(id),
    numero_lote VARCHAR(50) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    semaforo_fefo VARCHAR(20) DEFAULT 'VERDE',
    estado VARCHAR(30) DEFAULT 'DISPONIBLE',
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_lote_sede_med UNIQUE (numero_lote, sucursal_id, medicamento_id)
);

CREATE TABLE IF NOT EXISTS traslados (
    id BIGSERIAL PRIMARY KEY,
    codigo_traslado VARCHAR(50) UNIQUE NOT NULL,
    origen_sucursal_id BIGINT NOT NULL REFERENCES sucursales(id),
    destino_sucursal_id BIGINT NOT NULL REFERENCES sucursales(id),
    medicamento_id BIGINT NOT NULL REFERENCES medicamentos(id),
    cantidad INT NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    justificacion TEXT,
    prioridad VARCHAR(30) DEFAULT 'NORMAL',
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    guia_remision_numero VARCHAR(50),
    transportista_ruc VARCHAR(20),
    placa_vehiculo VARCHAR(20),
    precinto_seguridad VARCHAR(50),
    codigo_qr_hash VARCHAR(255),
    usuario_solicita_id BIGINT REFERENCES usuarios(id),
    usuario_despacha_id BIGINT REFERENCES usuarios(id),
    usuario_recibe_id BIGINT REFERENCES usuarios(id),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_despacho TIMESTAMP,
    fecha_recepcion TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auditoria_eventos (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuarios(id),
    username VARCHAR(50) NOT NULL,
    accion VARCHAR(100) NOT NULL,
    modulo VARCHAR(100) NOT NULL,
    detalle TEXT,
    ip_origen VARCHAR(50),
    exito BOOLEAN DEFAULT TRUE,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(username);
CREATE INDEX IF NOT EXISTS idx_inventarios_sucursal ON inventarios(sucursal_id);
CREATE INDEX IF NOT EXISTS idx_lotes_fefo ON lotes_caducidad(semaforo_fefo);
CREATE INDEX IF NOT EXISTS idx_traslados_estado ON traslados(estado);
