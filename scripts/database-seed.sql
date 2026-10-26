-- =============================================================================
-- SCRIPT DE INICIALIZACION DDL & DML: BASE DE DATOS SIIP FARMACIAS PERUANAS
-- =============================================================================

CREATE TABLE IF NOT EXISTS sucursales (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    marca VARCHAR(50) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(250) NOT NULL,
    distrito VARCHAR(100) NOT NULL,
    telefono VARCHAR(50),
    latitud NUMERIC(10, 7) NOT NULL,
    longitud NUMERIC(10, 7) NOT NULL,
    es_centro_distribucion BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS medicamentos (
    id BIGSERIAL PRIMARY KEY,
    codigo_ean VARCHAR(30) UNIQUE NOT NULL,
    codigo_can VARCHAR(30), -- Codigo Alfanumerico Nacional DIGEMID
    nombre_comercial VARCHAR(150) NOT NULL,
    principio_activo VARCHAR(150) NOT NULL,
    presentacion VARCHAR(100),
    laboratorio VARCHAR(100),
    categoria VARCHAR(100),
    precio_unitario NUMERIC(10, 2) NOT NULL,
    registro_sanitario VARCHAR(50),
    requiere_receta BOOLEAN DEFAULT FALSE,
    umbral_minimo INT DEFAULT 15,
    umbral_seguridad INT DEFAULT 25,
    consumo_promedio_diario NUMERIC(10, 2) DEFAULT 5.0
);

-- Insertar Sucursales Lima Metropolina
INSERT INTO sucursales (codigo, marca, nombre, direccion, distrito, telefono, latitud, longitud, es_centro_distribucion)
VALUES 
('SUC-001', 'InkaFarma', 'InkaFarma - San Isidro Las Begonias', 'Av. Las Begonias 441, San Isidro', 'San Isidro', '(01) 314-2020 anexo 101', -12.0935000, -77.0255000, FALSE),
('SUC-002', 'Mifarma', 'Mifarma - Miraflores Ovalo Gutiérrez', 'Av. Santa Cruz 814, Miraflores', 'Miraflores', '(01) 612-5000 anexo 204', -12.1118000, -77.0358000, FALSE),
('SUC-003', 'InkaFarma', 'InkaFarma - Javier Prado Este', 'Av. Javier Prado Este 2040, San Borja', 'San Borja', '(01) 314-2020 anexo 108', -12.0882000, -77.0019000, FALSE),
('SUC-004', 'Mifarma', 'Mifarma - Surco El Polo', 'Av. El Polo 670, Santiago de Surco', 'Surco', '(01) 612-5000 anexo 312', -12.1154000, -76.9748000, FALSE),
('CD-001', 'Corporativo', 'Centro de Distribución Principal Huachipa', 'Av. Las Torres Mz. B Lote 4', 'Lurigancho', '(01) 314-2000', -12.0085000, -76.9215000, TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- Insertar Medicamentos
INSERT INTO medicamentos (codigo_ean, nombre_comercial, principio_activo, presentacion, laboratorio, categoria, precio_unitario, registro_sanitario, requiere_receta)
VALUES
('775012345001', 'Amoxicilina 500 mg', 'Amoxicilina Trihidrato', 'Caja x 100 Cápsulas', 'Medifarma S.A.', 'Antibióticos', 38.50, 'EN-04892 DIGEMID', TRUE),
('775012345002', 'Panadol Forte 500/65 mg', 'Paracetamol + Cafeína', 'Caja x 80 Tabletas', 'GSK Consumer Health', 'Analgésicos', 42.00, 'EE-01234 DIGEMID', FALSE),
('775012345003', 'Azitromicina 500 mg', 'Azitromicina Dihidrato', 'Caja x 3 Tabletas', 'Laboratorios Bagó', 'Antibióticos', 24.80, 'EN-09821 DIGEMID', TRUE),
('775012345004', 'Ibuprofeno 400 mg Genfar', 'Ibuprofeno', 'Caja x 100 Tabletas', 'Genfar Sanofi', 'Antiinflamatorios', 19.50, 'EN-03412 DIGEMID', FALSE)
ON CONFLICT (codigo_ean) DO NOTHING;
