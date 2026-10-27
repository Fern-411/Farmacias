-- Roles
INSERT INTO roles (id, codigo, nombre, descripcion) VALUES
(1, 'ROLE_FARMACEUTICO', 'Químico Farmacéutico', 'Atención en ventanilla, consulta de inventario y solicitud de traslados'),
(2, 'ROLE_ADMIN_CD', 'Administrador Centro Distribución', 'Gestión de almacenes centrales, despachos masivos y logística'),
(3, 'ROLE_SUPERVISOR', 'Supervisor Regional de Operaciones', 'Monitoreo de red nacional, auditoría y control de mermas')
ON CONFLICT (codigo) DO NOTHING;

-- Sedes
INSERT INTO sucursales (id, codigo, marca, nombre, direccion, distrito, departamento, telefono, horario, director_tecnico, latitud, longitud, es_centro_distribucion) VALUES
(1, 'SUC-001', 'InkaFarma', 'InkaFarma San Isidro Central', 'Av. Rivera Navarrete 550', 'San Isidro', 'Lima', '(01) 314-2000', '24 Horas', 'Q.F. Ronny Mendoza Paucar (CQFP 18492)', -12.0931000, -77.0264000, FALSE),
(2, 'SUC-002', 'Mifarma', 'Mifarma Miraflores Ovalo Gutiérrez', 'Av. Santa Cruz 814', 'Miraflores', 'Lima', '(01) 612-5000', '24 Horas', 'Dra. Patricia Valdivia (CQFP 14205)', -12.1118000, -77.0358000, FALSE),
(8, 'CD-001', 'Corporativo', 'Centro Distribución Principal Huachipa', 'Av. Las Torres Mz. B Lote 4', 'Lurigancho', 'Lima', '(01) 314-2000', '24 Horas Logístico', 'Ing. Carlos Ramos (Reg. CIP 84920)', -12.0085000, -76.9215000, TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- Usuarios con hash BCrypt de 'password123'
INSERT INTO usuarios (id, username, password_hash, nombres, apellidos, email, rol_id, sucursal_id, intentos_fallidos, bloqueado) VALUES
(1, 'qf_mendoza', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Ronny Fernando', 'Mendoza Paucar', 'rmendoza@farmaciasperuanas.pe', 1, 1, 0, FALSE),
(2, 'admin_cd_huachipa', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Carlos', 'Ramos Huamán', 'cramos@farmaciasperuanas.pe', 2, 8, 0, FALSE),
(3, 'qf_miraflores', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Patricia', 'Valdivia Wong', 'pvaldivia@farmaciasperuanas.pe', 1, 2, 0, FALSE),
(4, 'supervisor_nacional', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Luis Javier', 'Herrera Villanueva', 'lherrera@farmaciasperuanas.pe', 3, 1, 0, FALSE)
ON CONFLICT (username) DO NOTHING;
