-- =============================================================================
-- SCRIPT DE INICIALIZACIÓN DDL & DML: BASE DE DATOS POSTGRESQL (8 TABLAS)
-- SISTEMA INTELIGENTE DE INVENTARIO Y PREDICCIÓN (SIIP) - FARMACIAS PERUANAS
-- UNIVERSIDAD TECNOLÓGICA DEL PERÚ (UTP) - PROYECTO INTEGRADOR 2026
-- =============================================================================

-- 1. TABLA SUCURSALES (Red Nacional de 15 Sedes)
CREATE TABLE IF NOT EXISTS sucursales (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    marca VARCHAR(50) NOT NULL, -- 'InkaFarma' | 'Mifarma' | 'Corporativo'
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

-- 2. TABLA ROLES (Control de Acceso RBAC)
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL, -- 'ROLE_FARMACEUTICO', 'ROLE_ADMIN_CD', 'ROLE_SUPERVISOR'
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(250)
);

-- 3. TABLA USUARIOS (Autenticación PostgreSQL con Hash BCrypt y Bloqueo a 5 Intentos)
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- BCrypt Hash ($2a$10$...)
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    rol_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    sucursal_id BIGINT REFERENCES sucursales(id) ON DELETE SET NULL,
    intentos_fallidos INT DEFAULT 0,
    bloqueado BOOLEAN DEFAULT FALSE,
    fecha_ultimo_acceso TIMESTAMP,
    fecha_bloqueo TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLA MEDICAMENTOS (Catálogo Farmacéutico Vademécum)
CREATE TABLE IF NOT EXISTS medicamentos (
    id BIGSERIAL PRIMARY KEY,
    codigo_ean VARCHAR(30) UNIQUE NOT NULL,
    codigo_can VARCHAR(30), -- Código Alfanumérico Nacional DIGEMID
    nombre_comercial VARCHAR(150) NOT NULL,
    principio_activo VARCHAR(150) NOT NULL,
    marca_comercial VARCHAR(100),
    tipo_producto VARCHAR(50) DEFAULT 'MARCA', -- 'MARCA' | 'GENERICO'
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

-- 5. TABLA INVENTARIOS (Stock por Sede y Medicamento)
CREATE TABLE IF NOT EXISTS inventarios (
    id BIGSERIAL PRIMARY KEY,
    sucursal_id BIGINT NOT NULL REFERENCES sucursales(id) ON DELETE CASCADE,
    medicamento_id BIGINT NOT NULL REFERENCES medicamentos(id) ON DELETE CASCADE,
    stock_actual INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 15,
    stock_maximo INT NOT NULL DEFAULT 150,
    dias_autonomia INT DEFAULT 0,
    estado_stock VARCHAR(50) DEFAULT 'OPTIMO', -- 'QUIEBRE' | 'BAJO' | 'OPTIMO' | 'SOBRESTOCK'
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_sucursal_medicamento UNIQUE (sucursal_id, medicamento_id)
);

-- 6. TABLA LOTES_CADUCIDAD (Trazabilidad FEFO y Auditoría BPA DIGEMID R.M. 833-2015)
CREATE TABLE IF NOT EXISTS lotes_caducidad (
    id BIGSERIAL PRIMARY KEY,
    medicamento_id BIGINT NOT NULL REFERENCES medicamentos(id) ON DELETE CASCADE,
    sucursal_id BIGINT NOT NULL REFERENCES sucursales(id) ON DELETE CASCADE,
    numero_lote VARCHAR(50) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    semaforo_fefo VARCHAR(20) DEFAULT 'VERDE', -- 'ROJO' (<30d) | 'AMARILLO' (<90d) | 'VERDE'
    estado VARCHAR(30) DEFAULT 'DISPONIBLE',
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_lote_sede_med UNIQUE (numero_lote, sucursal_id, medicamento_id)
);

-- 7. TABLA TRASLADOS (Flujo Inter-Sedes con Guía de Remisión Electrónica GRE SUNAT)
CREATE TABLE IF NOT EXISTS traslados (
    id BIGSERIAL PRIMARY KEY,
    codigo_traslado VARCHAR(50) UNIQUE NOT NULL,
    origen_sucursal_id BIGINT NOT NULL REFERENCES sucursales(id),
    destino_sucursal_id BIGINT NOT NULL REFERENCES sucursales(id),
    medicamento_id BIGINT NOT NULL REFERENCES medicamentos(id),
    cantidad INT NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    justificacion TEXT,
    prioridad VARCHAR(30) DEFAULT 'NORMAL', -- 'NORMAL' | 'URGENTE' | 'CRITICO'
    estado VARCHAR(50) DEFAULT 'PENDIENTE', -- 'PENDIENTE' | 'DESPACHADO' | 'EN_TRANSITO' | 'COMPLETADO'
    guia_remision_numero VARCHAR(50), -- GRE SUNAT: T001-00004921
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

-- 8. TABLA AUDITORIA_EVENTOS (Logback y Trazabilidad de Seguridad)
CREATE TABLE IF NOT EXISTS auditoria_eventos (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
    username VARCHAR(50) NOT NULL,
    accion VARCHAR(100) NOT NULL, -- 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'USER_BLOCKED', 'TRANSFER_CREATED'
    modulo VARCHAR(100) NOT NULL,
    detalle TEXT,
    ip_origen VARCHAR(50),
    exito BOOLEAN DEFAULT TRUE,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- ÍNDICES PARA OPTIMIZACIÓN Y PERFORMANCE EN POSTGRESQL
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(username);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol_id);
CREATE INDEX IF NOT EXISTS idx_inventarios_sucursal ON inventarios(sucursal_id);
CREATE INDEX IF NOT EXISTS idx_inventarios_med ON inventarios(medicamento_id);
CREATE INDEX IF NOT EXISTS idx_lotes_vencimiento ON lotes_caducidad(fecha_vencimiento);
CREATE INDEX IF NOT EXISTS idx_lotes_fefo ON lotes_caducidad(semaforo_fefo);
CREATE INDEX IF NOT EXISTS idx_traslados_estado ON traslados(estado);
CREATE INDEX IF NOT EXISTS idx_traslados_origen ON traslados(origen_sucursal_id);
CREATE INDEX IF NOT EXISTS idx_traslados_destino ON traslados(destino_sucursal_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON auditoria_eventos(fecha_hora);

-- =============================================================================
-- CARGA DE DATOS INICIALES (SEED DATA)
-- =============================================================================

-- Roles Indispensables del Negocio Farmacéutico (DIGEMID BPA + SUNAT GRE)
INSERT INTO roles (id, codigo, nombre, descripcion) VALUES
(1, 'ROLE_FARMACEUTICO', 'Químico Farmacéutico (Director Técnico)', 'Dispensación, recetas médicas, consulta geocercana y solicitud de transferencias inter-sucursales'),
(2, 'ROLE_ADMIN_CD', 'Administrador Centro Distribución Huachipa', 'Gestión logística masiva, emisión de Guías Remitente SUNAT con QR y despacho inter-sedes'),
(3, 'ROLE_SUPERVISOR', 'Supervisor Regional de Operaciones', 'Monitoreo de red nacional (15 sedes), balance de sobrestock y auditoría de mermas'),
(4, 'ROLE_ASISTENTE_FARMACIA', 'Técnico en Farmacia (Ventanilla)', 'Atención al paciente, consulta de genéricos DCI en Cloudflare R2 y despacho en mostrador'),
(5, 'ROLE_AUDITOR_CALIDAD', 'Auditor de Calidad y Cumplimiento DIGEMID', 'Inspección de lotes FEFO, fiscalización de BPA R.M. 833-2015 y descarga de reportes auditables')
ON CONFLICT (codigo) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    descripcion = EXCLUDED.descripcion;

-- Sucursales Nacionales (15 Sedes)
INSERT INTO sucursales (codigo, marca, nombre, direccion, distrito, departamento, telefono, horario, director_tecnico, latitud, longitud, es_centro_distribucion) VALUES
('SUC-001', 'InkaFarma', 'InkaFarma San Isidro Central', 'Av. Rivera Navarrete 550', 'San Isidro', 'Lima', '(01) 314-2000', '24 Horas', 'Q.F. Ronny Mendoza Paucar (CQFP 18492)', -12.0931000, -77.0264000, FALSE),
('SUC-002', 'Mifarma', 'Mifarma Miraflores Ovalo Gutiérrez', 'Av. Santa Cruz 814', 'Miraflores', 'Lima', '(01) 612-5000', '24 Horas', 'Dra. Patricia Valdivia (CQFP 14205)', -12.1118000, -77.0358000, FALSE),
('SUC-003', 'InkaFarma', 'InkaFarma San Borja Real', 'Av. Javier Prado Este 2040', 'San Borja', 'Lima', '(01) 314-2000', '07:00 - 23:00', 'Q.F. Carlos Benavides (CQFP 21049)', -12.0882000, -77.0019000, FALSE),
('SUC-004', 'Mifarma', 'Mifarma Surco El Polo', 'Av. El Polo 670', 'Santiago de Surco', 'Lima', '(01) 612-5000', '24 Horas', 'Q.F. Lucía Ramos (CQFP 19384)', -12.1154000, -76.9748000, FALSE),
('SUC-005', 'InkaFarma', 'InkaFarma Magdalena Plaza', 'Jr. San Martín 480', 'Magdalena del Mar', 'Lima', '(01) 314-2000', '07:00 - 23:00', 'Q.F. Jorge Linares (CQFP 17293)', -12.0912000, -77.0701000, FALSE),
('SUC-006', 'Mifarma', 'Mifarma Jesús María Cuba', 'Av. Arnaldo Márquez 1250', 'Jesús María', 'Lima', '(01) 612-5000', '07:00 - 23:00', 'Q.F. Andrea Castro (CQFP 22910)', -12.0725000, -77.0498000, FALSE),
('SUC-007', 'InkaFarma', 'InkaFarma Los Olivos Antúnez', 'Av. Antúnez de Mayolo 1120', 'Los Olivos', 'Lima', '(01) 314-2000', '24 Horas', 'Q.F. Víctor Tello (CQFP 16402)', -11.9924000, -77.0712000, FALSE),
('CD-001', 'Corporativo', 'Centro Distribución Principal Huachipa', 'Av. Las Torres Mz. B Lote 4', 'Lurigancho', 'Lima', '(01) 314-2000', '24 Horas Logístico', 'Ing. Carlos Ramos (Reg. CIP 84920)', -12.0085000, -76.9215000, TRUE),
('SUC-009', 'InkaFarma', 'InkaFarma Chorrillos Huun', 'Av. Defensores del Morro 1400', 'Chorrillos', 'Lima', '(01) 314-2000', '07:00 - 23:00', 'Q.F. Elena Solís (CQFP 20119)', -12.1754000, -77.0215000, FALSE),
('SUC-010', 'Mifarma', 'Mifarma Callao Minka', 'Av. Argentina 3093', 'Callao', 'Callao', '(01) 612-5000', '08:00 - 22:00', 'Q.F. Roberto Díaz (CQFP 15309)', -12.0452000, -77.1085000, FALSE),
('SUC-011', 'InkaFarma', 'InkaFarma Arequipa Cayma', 'Av. Ejército 710', 'Cayma', 'Arequipa', '(054) 254-000', '24 Horas', 'Q.F. Maritza Quispe (CQFP 13920)', -16.3854000, -71.5421000, FALSE),
('SUC-012', 'Mifarma', 'Mifarma Cusco Sol', 'Av. El Sol 620', 'Cusco', 'Cusco', '(084) 240-500', '07:00 - 23:00', 'Q.F. Edwin Yupanqui (CQFP 18840)', -13.5215000, -71.9745000, FALSE),
('SUC-013', 'InkaFarma', 'InkaFarma Trujillo Mall Plaza', 'Av. América Oeste 750', 'Trujillo', 'La Libertad', '(044) 280-900', '08:00 - 22:00', 'Q.F. Carmen Morales (CQFP 19481)', -8.1025000, -79.0384000, FALSE),
('SUC-014', 'Mifarma', 'Mifarma Chiclayo Bolognesi', 'Av. Bolognesi 410', 'Chiclayo', 'Lambayeque', '(074) 231-100', '24 Horas', 'Q.F. Luis Sandoval (CQFP 17990)', -6.7725000, -79.8415000, FALSE),
('SUC-015', 'InkaFarma', 'InkaFarma Huancayo Real', 'Calle Real 540', 'Huancayo', 'Junín', '(064) 219-400', '07:00 - 23:00', 'Q.F. Teresa Cárdenas (CQFP 20455)', -12.0685000, -75.2104000, FALSE)
ON CONFLICT (codigo) DO NOTHING;

-- Usuarios Indispensables del Sistema (Hash BCrypt de 'password123')
INSERT INTO usuarios (id, username, password_hash, nombres, apellidos, email, rol_id, sucursal_id, intentos_fallidos, bloqueado) VALUES
(1, 'qf_mendoza', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Ronny Fernando', 'Mendoza Paucar', 'rmendoza@farmaciasperuanas.pe', 1, 1, 0, FALSE),
(2, 'admin_cd_huachipa', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Carlos', 'Ramos Huamán', 'cramos@farmaciasperuanas.pe', 2, 8, 0, FALSE),
(3, 'supervisor_nacional', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Luis Javier', 'Herrera Villanueva', 'lherrera@farmaciasperuanas.pe', 3, 1, 0, FALSE),
(4, 'tecnico_ventanilla', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Irani', 'Guillén Gómez', 'iguillen@farmaciasperuanas.pe', 4, 1, 0, FALSE),
(5, 'auditor_digemid', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Patricia', 'Valdivia Wong', 'pvaldivia@farmaciasperuanas.pe', 5, 2, 0, FALSE)
ON CONFLICT (username) DO UPDATE SET
    rol_id = EXCLUDED.rol_id,
    sucursal_id = EXCLUDED.sucursal_id,
    bloqueado = FALSE,
    intentos_fallidos = 0;

-- Medicamentos
INSERT INTO medicamentos (codigo_ean, codigo_can, nombre_comercial, principio_activo, marca_comercial, tipo_producto, presentacion, laboratorio, categoria, precio_unitario, registro_sanitario, requiere_receta, umbral_minimo, consumo_promedio_diario) VALUES
('775012345001', 'CAN-MED-001', 'Amoxidal 500 mg', 'Amoxicilina Trihidrato', 'Roemmers', 'MARCA', 'Caja x 100 Cápsulas', 'Laboratorios Roemmers S.A.', 'Antibióticos', 38.50, 'EN-04892 DIGEMID', TRUE, 15, 6.0),
('775012345002', 'CAN-MED-002', 'Amoxicilina 500 mg Genérico', 'Amoxicilina Trihidrato', 'Medifarma Genérico', 'GENERICO', 'Caja x 100 Cápsulas', 'Medifarma S.A.', 'Antibióticos', 14.20, 'GN-01928 DIGEMID', TRUE, 20, 8.5),
('775012345003', 'CAN-MED-003', 'Panadol Forte 500/65 mg', 'Paracetamol + Cafeína', 'Panadol', 'MARCA', 'Caja x 80 Tabletas', 'GSK Consumer Health', 'Analgésicos', 42.00, 'EE-01234 DIGEMID', FALSE, 15, 9.0),
('775012345004', 'CAN-MED-004', 'Paracetamol 500 mg Genérico', 'Paracetamol', 'Portugal Genérico', 'GENERICO', 'Caja x 100 Tabletas', 'Laboratorios Portugal', 'Analgésicos', 7.50, 'GN-04812 DIGEMID', FALSE, 25, 12.0),
('775012345005', 'CAN-MED-005', 'Azitromicina 500 mg Bagó', 'Azitromicina Dihidrato', 'Bagó', 'MARCA', 'Caja x 3 Tabletas', 'Laboratorios Bagó', 'Antibióticos', 24.80, 'EN-09821 DIGEMID', TRUE, 10, 4.0),
('775012345006', 'CAN-MED-006', 'Ibuprofeno 400 mg Genfar', 'Ibuprofeno', 'Genfar', 'GENERICO', 'Caja x 100 Tabletas', 'Genfar Sanofi', 'Antiinflamatorios', 19.50, 'EN-03412 DIGEMID', FALSE, 20, 7.5)
ON CONFLICT (codigo_ean) DO NOTHING;

-- Inventarios iniciales
INSERT INTO inventarios (sucursal_id, medicamento_id, stock_actual, stock_minimo, stock_maximo, dias_autonomia, estado_stock) VALUES
(1, 1, 4, 15, 100, 1, 'QUIEBRE'),
(1, 2, 45, 20, 150, 5, 'OPTIMO'),
(1, 3, 22, 15, 120, 3, 'OPTIMO'),
(2, 1, 95, 15, 150, 16, 'SOBRESTOCK'),
(2, 2, 80, 20, 150, 10, 'OPTIMO'),
(8, 1, 550, 50, 1000, 45, 'SOBRESTOCK')
ON CONFLICT (sucursal_id, medicamento_id) DO NOTHING;

-- Lotes con caducidad FEFO
INSERT INTO lotes_caducidad (medicamento_id, sucursal_id, numero_lote, fecha_vencimiento, cantidad, semaforo_fefo) VALUES
(1, 1, 'LT-AMX-2026-A1', '2026-11-15', 4, 'ROJO'),
(1, 2, 'LT-AMX-2027-B3', '2027-08-30', 95, 'VERDE'),
(2, 1, 'LT-GEN-2027-C1', '2027-05-20', 45, 'VERDE'),
(3, 1, 'LT-PAN-2026-X9', '2026-12-01', 22, 'AMARILLO')
ON CONFLICT (numero_lote, sucursal_id, medicamento_id) DO NOTHING;
