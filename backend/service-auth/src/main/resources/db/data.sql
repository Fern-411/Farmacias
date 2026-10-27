-- =============================================================================
-- SEED DATA OFICIAL - POSTGRESQL SIIP FARMACIAS PERUANAS (5 ROLES INDISPENSABLES)
-- =============================================================================

-- 1. Roles Indispensables del Negocio Farmacéutico (DIGEMID BPA + SUNAT GRE)
INSERT INTO roles (id, codigo, nombre, descripcion) VALUES
(1, 'ROLE_FARMACEUTICO', 'Químico Farmacéutico (Director Técnico)', 'Dispensación, recetas médicas, consulta geocercana y solicitud de transferencias inter-sucursales'),
(2, 'ROLE_ADMIN_CD', 'Administrador Centro Distribución Huachipa', 'Gestión logística masiva, emisión de Guías Remitente SUNAT con QR y despacho inter-sedes'),
(3, 'ROLE_SUPERVISOR', 'Supervisor Regional de Operaciones', 'Monitoreo de red nacional (15 sedes), balance de sobrestock y auditoría de mermas'),
(4, 'ROLE_ASISTENTE_FARMACIA', 'Técnico en Farmacia (Ventanilla)', 'Atención al paciente, consulta de genéricos DCI en Cloudflare R2 y despacho en mostrador'),
(5, 'ROLE_AUDITOR_CALIDAD', 'Auditor de Calidad y Cumplimiento DIGEMID', 'Inspección de lotes FEFO, fiscalización de BPA R.M. 833-2015 y descarga de reportes auditables')
ON CONFLICT (codigo) DO UPDATE SET 
    nombre = EXCLUDED.nombre,
    descripcion = EXCLUDED.descripcion;

-- 2. Sucursales de Referencia (15 Sedes)
INSERT INTO sucursales (id, codigo, marca, nombre, direccion, distrito, departamento, telefono, horario, director_tecnico, latitud, longitud, es_centro_distribucion) VALUES
(1, 'SUC-001', 'InkaFarma', 'InkaFarma San Isidro Central', 'Av. Rivera Navarrete 550', 'San Isidro', 'Lima', '(01) 314-2000', '24 Horas', 'Q.F. Ronny Mendoza Paucar (CQFP 18492)', -12.0931000, -77.0264000, FALSE),
(2, 'SUC-002', 'Mifarma', 'Mifarma Miraflores Ovalo Gutiérrez', 'Av. Santa Cruz 814', 'Miraflores', 'Lima', '(01) 612-5000', '24 Horas', 'Dra. Patricia Valdivia (CQFP 14205)', -12.1118000, -77.0358000, FALSE),
(3, 'SUC-003', 'InkaFarma', 'InkaFarma San Borja Real', 'Av. Javier Prado Este 2040', 'San Borja', 'Lima', '(01) 314-2000', '07:00 - 23:00', 'Q.F. Carlos Benavides (CQFP 21049)', -12.0882000, -77.0019000, FALSE),
(4, 'SUC-004', 'Mifarma', 'Mifarma Surco El Polo', 'Av. El Polo 670', 'Santiago de Surco', 'Lima', '(01) 612-5000', '24 Horas', 'Q.F. Lucía Ramos (CQFP 19384)', -12.1154000, -76.9748000, FALSE),
(8, 'CD-001', 'Corporativo', 'Centro Distribución Principal Huachipa', 'Av. Las Torres Mz. B Lote 4', 'Lurigancho', 'Lima', '(01) 314-2000', '24 Horas Logístico', 'Ing. Carlos Ramos (Reg. CIP 84920)', -12.0085000, -76.9215000, TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- 3. Usuarios con Hash BCrypt de 'password123' ($2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi)
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
