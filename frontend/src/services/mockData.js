// ==============================================================================
// BASE DE DATOS Y SERVICIOS SIIP - FARMACIAS PERUANAS (INKAFARMA / MIFARMA)
// ==============================================================================

// Configuración de Almacenamiento Cloudflare R2 (leído desde .env por buenas prácticas)
export const CLOUDFLARE_R2_CONFIG = {
  bucketName: import.meta.env?.VITE_CLOUDFLARE_R2_BUCKET_NAME || 'farmacias',
  publicUrl: import.meta.env?.VITE_CLOUDFLARE_R2_PUBLIC_URL || 'https://pub-baeedb27ad20485a9948ce6913eb8e20.r2.dev',
  region: 'Eastern North America (ENAM)',
};

/**
 * Resuelve la URL de la imagen del medicamento priorizando:
 * 1. Cloudflare R2 público configurado en .env
 * 2. Archivo local de alta resolución en /medicamentos/
 * 3. Fallback fotográfico farmacéutico
 */
export function getMedicineImageUrl(med) {
  if (!med) return '/medicamentos/amoxidal-500mg-megalabs.png';
  if (med.imagenLocal) return med.imagenLocal;
  if (med.imagenR2) {
    const base = CLOUDFLARE_R2_CONFIG.publicUrl.replace(/\/$/, '');
    return `${base}/${med.imagenR2}`;
  }
  return med.imagenUrl || '/medicamentos/amoxidal-500mg-megalabs.png';
}

// ==============================================================================
// CAPA DE PERSISTENCIA REAL (LOCALSTORAGE CON SINCRONIZACIÓN REACTIVA)
// ==============================================================================
export const STORAGE_KEYS = {
  INVENTARIO: 'SIIP_INVENTARIO_DATA_V2',
  MEDICAMENTOS: 'SIIP_MEDICAMENTOS_V2',
  SUCURSALES: 'SIIP_SUCURSALES_V2',
  TRASLADOS: 'SIIP_TRASLADOS_SUGERIDOS_V2',
  KARDEX: 'SIIP_KARDEX_MOVIMIENTOS_V2',
  LOTES: 'SIIP_LOTES_CADUCIDAD_V2'
};

export function getStoredItem(key, fallback) {
  if (typeof window === 'undefined' || !window.localStorage) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error al leer ${key} de localStorage:`, err);
    return fallback;
  }
}

export function setStoredItem(key, val) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.warn(`Error al guardar ${key} en localStorage:`, err);
  }
}

export function notifyDataChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('siip:data_updated', { detail: { timestamp: Date.now() } }));
  }
}

export function resetFactoryData() {
  if (typeof window !== 'undefined' && window.localStorage) {
    Object.values(STORAGE_KEYS).forEach(k => window.localStorage.removeItem(k));
    window.location.reload();
  }
}

export const DEFAULT_SUCURSALES = [
  // ============================================================================
  // LIMA METROPOLITANA Y CALLAO
  // ============================================================================
  {
    id: 1,
    codigo: 'SUC-001',
    marca: 'InkaFarma',
    nombre: 'InkaFarma - San Isidro Las Begonias',
    direccion: 'Av. Las Begonias 441, San Isidro',
    distrito: 'San Isidro',
    departamento: 'Lima',
    telefono: '(01) 314-2020 anexo 101',
    lat: -12.0935,
    lng: -77.0255,
    esCentroDistribucion: false,
    referencia: 'Frente al Centro Financiero Begonias, al lado de Ripley',
    instruccionRuta: 'A 2 cuadras de la estación Javier Prado del Metropolitano.',
    tiempoEstimadoAutoMin: 2,
    tiempoEstimadoPieMin: 5
  },
  {
    id: 2,
    codigo: 'SUC-002',
    marca: 'Mifarma',
    nombre: 'Mifarma - Miraflores Ovalo Gutiérrez',
    direccion: 'Av. Santa Cruz 814, Miraflores',
    distrito: 'Miraflores',
    departamento: 'Lima',
    telefono: '(01) 612-5000 anexo 204',
    lat: -12.1118,
    lng: -77.0358,
    esCentroDistribucion: false,
    referencia: 'A 50 metros del Óvalo Gutiérrez, frente al Cineplanet',
    instruccionRuta: 'Seguir por Av. Camino Real hacia el sur, cruzar Av. Cavenecia hasta el Óvalo Gutiérrez.',
    tiempoEstimadoAutoMin: 7,
    tiempoEstimadoPieMin: 24
  },
  {
    id: 3,
    codigo: 'SUC-003',
    marca: 'InkaFarma',
    nombre: 'InkaFarma - San Borja Javier Prado',
    direccion: 'Av. Javier Prado Este 2040, San Borja',
    distrito: 'San Borja',
    departamento: 'Lima',
    telefono: '(01) 314-2020 anexo 108',
    lat: -12.0882,
    lng: -77.0019,
    esCentroDistribucion: false,
    referencia: 'A media cuadra de la estación La Cultura (Línea 1 del Metro)',
    instruccionRuta: 'Directo por el corredor Javier Prado Este entre Av. San Luis y Guardia Civil.',
    tiempoEstimadoAutoMin: 8,
    tiempoEstimadoPieMin: 30
  },
  {
    id: 4,
    codigo: 'SUC-004',
    marca: 'Mifarma',
    nombre: 'Mifarma - Surco El Polo',
    direccion: 'Av. El Polo 670, Santiago de Surco',
    distrito: 'Surco',
    departamento: 'Lima',
    telefono: '(01) 612-5000 anexo 312',
    lat: -12.1154,
    lng: -76.9748,
    esCentroDistribucion: false,
    referencia: 'Frente al Centro Comercial El Polo I',
    instruccionRuta: 'Tomar Av. Encalada o Av. Primavera hacia el cruce con Av. El Polo.',
    tiempoEstimadoAutoMin: 14,
    tiempoEstimadoPieMin: 50
  },
  {
    id: 5,
    codigo: 'SUC-005',
    marca: 'InkaFarma',
    nombre: 'InkaFarma - Lince Petit Thouars',
    direccion: 'Av. Petit Thouars 2150, Lince',
    distrito: 'Lince',
    departamento: 'Lima',
    telefono: '(01) 314-2020 anexo 115',
    lat: -12.0815,
    lng: -77.0335,
    esCentroDistribucion: false,
    referencia: 'Frente al Mercado Lobatón, cruce con Jr. Risso',
    instruccionRuta: 'Subir por Av. Rivera Navarrete hacia Paseo de la República y girar hacia Petit Thouars.',
    tiempoEstimadoAutoMin: 5,
    tiempoEstimadoPieMin: 18
  },
  {
    id: 6,
    codigo: 'SUC-006',
    marca: 'Mifarma',
    nombre: 'Mifarma - Jesús María Real Plaza',
    direccion: 'Av. Salaverry 2370, Jesús María',
    distrito: 'Jesús María',
    departamento: 'Lima',
    telefono: '(01) 612-5000 anexo 140',
    lat: -12.0889,
    lng: -77.0512,
    esCentroDistribucion: false,
    referencia: 'Nivel 1 del Centro Comercial Real Plaza Salaverry',
    instruccionRuta: 'Seguir por Av. Dos de Mayo hacia Av. Salaverry, continuar recto 5 cuadras.',
    tiempoEstimadoAutoMin: 9,
    tiempoEstimadoPieMin: 35
  },
  {
    id: 7,
    codigo: 'SUC-007',
    marca: 'InkaFarma',
    nombre: 'InkaFarma - Magdalena Mercado',
    direccion: 'Jr. Bolognesi 490, Magdalena del Mar',
    distrito: 'Magdalena',
    departamento: 'Lima',
    telefono: '(01) 314-2020 anexo 152',
    lat: -12.0912,
    lng: -77.0710,
    esCentroDistribucion: false,
    referencia: 'A 1 cuadra de la Plaza Central de Magdalena y la Iglesia Corazón de María',
    instruccionRuta: 'Bajar por Av. Javier Prado Oeste hacia Av. Brasil y continuar hacia Jr. Bolognesi.',
    tiempoEstimadoAutoMin: 12,
    tiempoEstimadoPieMin: 45
  },
  {
    id: 8,
    codigo: 'CD-001',
    marca: 'Corporativo',
    nombre: 'Centro de Distribución Principal (CD Huachipa)',
    direccion: 'Av. Las Torres Mz. B Lote 4, Huachipa',
    distrito: 'Lurigancho-Chosica',
    departamento: 'Lima',
    telefono: '(01) 314-2000 central logística',
    lat: -12.0085,
    lng: -76.9215,
    esCentroDistribucion: true,
    referencia: 'Parque Industrial Las Torres, complejo de almacenes centrales del grupo',
    instruccionRuta: 'Acceso por Carretera Central y Autopista Ramiro Prialé.',
    tiempoEstimadoAutoMin: 35,
    tiempoEstimadoPieMin: 180
  },
  {
    id: 9,
    codigo: 'SUC-008',
    marca: 'InkaFarma',
    nombre: 'InkaFarma - Los Olivos MegaPlaza',
    direccion: 'Av. Alfredo Mendiola 3698, Los Olivos',
    distrito: 'Los Olivos',
    departamento: 'Lima Norte',
    telefono: '(01) 314-2020 anexo 180',
    lat: -11.9942,
    lng: -77.0625,
    esCentroDistribucion: false,
    referencia: 'Frente al Centro Comercial MegaPlaza, Panamericana Norte km 16.5',
    instruccionRuta: 'Panamericana Norte hacia el norte, bajada directa por Av. Carlos Izaguirre.',
    tiempoEstimadoAutoMin: 22,
    tiempoEstimadoPieMin: 75
  },
  {
    id: 10,
    codigo: 'SUC-009',
    marca: 'Mifarma',
    nombre: 'Mifarma - San Juan de Lurigancho Las Flores',
    direccion: 'Av. Próceres de la Independencia 1820, SJL',
    distrito: 'San Juan de Lurigancho',
    departamento: 'Lima Este',
    telefono: '(01) 612-5000 anexo 195',
    lat: -12.0035,
    lng: -77.0082,
    esCentroDistribucion: false,
    referencia: 'A 1 cuadra de la estación Los Postes de la Línea 1 del Metro',
    instruccionRuta: 'Por Av. Próceres de la Independencia altura paradero 14 de Las Flores.',
    tiempoEstimadoAutoMin: 18,
    tiempoEstimadoPieMin: 60
  },

  // ============================================================================
  // MACRORREGIÓN SUR DEL PERÚ
  // ============================================================================
  {
    id: 11,
    codigo: 'SUC-010',
    marca: 'InkaFarma',
    nombre: 'InkaFarma - Arequipa Mercaderes',
    direccion: 'Calle Mercaderes 214, Cercado de Arequipa',
    distrito: 'Arequipa',
    departamento: 'Arequipa',
    telefono: '(054) 28-3030',
    lat: -16.3988,
    lng: -71.5369,
    esCentroDistribucion: false,
    referencia: 'A 2 cuadras de la Plaza de Armas de Arequipa',
    instruccionRuta: 'Paseo Peatonal Mercaderes, cruce con Calle San Francisco.',
    tiempoEstimadoAutoMin: 8,
    tiempoEstimadoPieMin: 15
  },
  {
    id: 12,
    codigo: 'SUC-011',
    marca: 'Mifarma',
    nombre: 'Mifarma - Cusco Av. El Sol',
    direccion: 'Av. El Sol 612, Cusco Centro Histórico',
    distrito: 'Cusco',
    departamento: 'Cusco',
    telefono: '(084) 24-5000',
    lat: -13.5183,
    lng: -71.9772,
    esCentroDistribucion: false,
    referencia: 'Frente al Palacio de Justicia y a 100 metros del Qorikancha',
    instruccionRuta: 'Av. El Sol en dirección al Templo del Sol Qorikancha.',
    tiempoEstimadoAutoMin: 6,
    tiempoEstimadoPieMin: 12
  },

  // ============================================================================
  // MACRORREGIÓN NORTE DEL PERÚ
  // ============================================================================
  {
    id: 13,
    codigo: 'SUC-012',
    marca: 'Mifarma',
    nombre: 'Mifarma - Trujillo Pizarro',
    direccion: 'Jr. Francisco Pizarro 542, Centro Histórico',
    distrito: 'Trujillo',
    departamento: 'La Libertad',
    telefono: '(044) 22-8080',
    lat: -8.1118,
    lng: -79.0287,
    esCentroDistribucion: false,
    referencia: 'Paseo Peatonal Pizarro, frente a la Plazuela El Recreo',
    instruccionRuta: 'Jr. Pizarro a 3 cuadras de la Plaza Mayor de Trujillo.',
    tiempoEstimadoAutoMin: 7,
    tiempoEstimadoPieMin: 14
  },
  {
    id: 14,
    codigo: 'SUC-013',
    marca: 'InkaFarma',
    nombre: 'InkaFarma - Chiclayo Balta',
    direccion: 'Av. José Balta 890, Chiclayo Centro',
    distrito: 'Chiclayo',
    departamento: 'Lambayeque',
    telefono: '(074) 23-4545',
    lat: -6.7714,
    lng: -79.8409,
    esCentroDistribucion: false,
    referencia: 'Cruce de Av. Balta con Calle Elías Aguirre',
    instruccionRuta: 'Av. Balta en pleno centro comercial y financiero de Chiclayo.',
    tiempoEstimadoAutoMin: 5,
    tiempoEstimadoPieMin: 10
  },

  // ============================================================================
  // MACRORREGIÓN CENTRO DEL PERÚ
  // ============================================================================
  {
    id: 15,
    codigo: 'SUC-014',
    marca: 'InkaFarma',
    nombre: 'InkaFarma - Huancayo Calle Real',
    direccion: 'Calle Real 720, Huancayo Centro',
    distrito: 'Huancayo',
    departamento: 'Junín',
    telefono: '(064) 21-1212',
    lat: -12.0683,
    lng: -75.2100,
    esCentroDistribucion: false,
    referencia: 'A media cuadra de la Plaza Huamanmarca',
    instruccionRuta: 'Calle Real cruce con Jr. Ica, zona comercial bancaria de Huancayo.',
    tiempoEstimadoAutoMin: 6,
    tiempoEstimadoPieMin: 12
  }
];

function initSucursales() {
  const stored = getStoredItem(STORAGE_KEYS.SUCURSALES, null);
  if (!stored) return [...DEFAULT_SUCURSALES];
  const storedIds = new Set(stored.map(s => s.id));
  const missing = DEFAULT_SUCURSALES.filter(s => !storedIds.has(s.id));
  return [...stored, ...missing];
}

export let SUCURSALES = initSucursales();

export function getAllBranches() {
  return SUCURSALES;
}

export function addNewBranch(newBranch) {
  const branchWithId = {
    ...newBranch,
    id: newBranch.id || (Date.now() % 100000),
    codigo: newBranch.codigo || ('SUC-' + String(SUCURSALES.length + 1).padStart(3, '0')),
    lat: Number(newBranch.lat) || -12.09,
    lng: Number(newBranch.lng) || -77.03,
    esCentroDistribucion: !!newBranch.esCentroDistribucion,
    directorTecnico: newBranch.directorTecnico || 'QF. Ronny Mendoza Paucar (CQFP 28491)',
    horarioAtencion: newBranch.horarioAtencion || '24 Horas (Atención Continua)',
    registroDigemid: newBranch.registroDigemid || ('EE-FAR-2026-' + Math.floor(1000 + Math.random() * 9000)),
    region: newBranch.region || (newBranch.departamento === 'Lima' ? 'Lima Metropolitana' : 'Provincias del Perú')
  };

  SUCURSALES.push(branchWithId);

  // Inicializar stock en la nueva sede
  if (!INVENTARIO_DATA[branchWithId.id]) {
    INVENTARIO_DATA[branchWithId.id] = [];
    MEDICAMENTOS.forEach(m => {
      const initialStock = branchWithId.esCentroDistribucion ? 1000 : 25;
      INVENTARIO_DATA[branchWithId.id].push({
        medicamentoId: m.id,
        stockActual: initialStock,
        stockSeguridad: m.umbralSeguridad || 15,
        estado: 'OPTIMO',
        lotePrincipal: 'LT-INIC-' + (m.codigoEAN ? m.codigoEAN.slice(-4) : '2026'),
        diasAutonomia: 6.0
      });
    });
  }

  setStoredItem(STORAGE_KEYS.SUCURSALES, SUCURSALES);
  setStoredItem(STORAGE_KEYS.INVENTARIO, INVENTARIO_DATA);
  notifyDataChange();

  return branchWithId;
}

export function updateExistingBranch(branchId, updatedFields) {
  const index = SUCURSALES.findIndex(s => s.id === Number(branchId));
  if (index !== -1) {
    SUCURSALES[index] = {
      ...SUCURSALES[index],
      ...updatedFields,
      lat: updatedFields.lat !== undefined ? Number(updatedFields.lat) : SUCURSALES[index].lat,
      lng: updatedFields.lng !== undefined ? Number(updatedFields.lng) : SUCURSALES[index].lng
    };
    setStoredItem(STORAGE_KEYS.SUCURSALES, SUCURSALES);
    notifyDataChange();
    return SUCURSALES[index];
  }
  return null;
}

const DEFAULT_MEDICAMENTOS = [
  // ============================================================================
  // FAMILIA: AMOXICILINA (Marcas Comerciales vs. Genéricos DCI)
  // ============================================================================
  {
    id: 101,
    familia: 'Amoxicilina',
    categoria: 'Antibióticos',
    nombreComercial: 'Amoxidal 500',
    principioActivo: 'Amoxicilina 500 mg',
    tipoProducto: 'MARCA', // MARCA o GENERICO
    marcaComercial: 'Amoxidal',
    laboratorio: 'Megalabs',
    concentracion: '500 mg',
    formaFarmaceutica: 'Cápsulas (Vía oral)',
    presentacion: 'Caja x 16 Cápsulas',
    cajasPorBulto: 40,
    codigoEAN: '775012345001',
    codigoCan: 'CAN-AMX-00500',
    precioUnitario: 42.50,
    registroSanitario: 'EE-04892 DIGEMID',
    requiereReceta: true,
    umbralMinimo: 15,
    umbralSeguridad: 25,
    consumoPromedioDiario: 6.2,
    imagenR2: 'amoxidal-500mg-megalabs.png',
    imagenLocal: '/medicamentos/amoxidal-500mg-megalabs.png',
    imagenUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 102,
    familia: 'Amoxicilina',
    categoria: 'Antibióticos',
    nombreComercial: 'TRIXAN 500',
    principioActivo: 'Amoxicilina 500 mg',
    tipoProducto: 'MARCA',
    marcaComercial: 'Trixan',
    laboratorio: 'Pharmetica',
    concentracion: '500 mg',
    formaFarmaceutica: 'Comprimidos Recubiertos',
    presentacion: 'Caja x 16 Comprimidos con Blíster',
    cajasPorBulto: 50,
    codigoEAN: '775012345002',
    codigoCan: 'CAN-TRX-00500',
    precioUnitario: 38.00,
    registroSanitario: 'EE-03120 DIGEMID',
    requiereReceta: true,
    umbralMinimo: 12,
    umbralSeguridad: 22,
    consumoPromedioDiario: 5.4,
    imagenR2: 'trixan-500mg-pharmetica.png',
    imagenLocal: '/medicamentos/trixan-500mg-pharmetica.png',
    imagenUrl: 'https://images.unsplash.com/photo-1550572017-ed200f5e6343?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 103,
    familia: 'Amoxicilina',
    categoria: 'Antibióticos',
    nombreComercial: 'Amoxicilina 500 mg Genérica',
    principioActivo: 'Amoxicilina Trihidrato',
    tipoProducto: 'GENERICO',
    marcaComercial: 'Genérico DCI',
    laboratorio: 'Medifarma S.A.',
    concentracion: '500 mg',
    formaFarmaceutica: 'Cápsulas',
    presentacion: 'Caja x 100 Cápsulas',
    cajasPorBulto: 50,
    codigoEAN: '775012345003',
    codigoCan: 'CAN-AMX-GEN500',
    precioUnitario: 18.50,
    registroSanitario: 'EN-04892 DIGEMID',
    requiereReceta: true,
    umbralMinimo: 20,
    umbralSeguridad: 35,
    consumoPromedioDiario: 8.5,
    imagenR2: 'amoxicilina-500mg-generico.webp',
    imagenLocal: null,
    imagenUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 104,
    familia: 'Amoxicilina',
    categoria: 'Antibióticos',
    nombreComercial: 'Amoxicilina 250 mg / 5 mL Suspensión',
    principioActivo: 'Amoxicilina Trihidrato',
    tipoProducto: 'GENERICO',
    marcaComercial: 'Genérico Pediátrico',
    laboratorio: 'Medifarma S.A.',
    concentracion: '250 mg / 5 mL',
    formaFarmaceutica: 'Suspensión Oral Pediátrica',
    presentacion: 'Frasco x 100 mL con vaso dosificador',
    cajasPorBulto: 40,
    codigoEAN: '775012345004',
    codigoCan: 'CAN-AMX-PED250',
    precioUnitario: 14.90,
    registroSanitario: 'EN-03112 DIGEMID',
    requiereReceta: true,
    umbralMinimo: 12,
    umbralSeguridad: 20,
    consumoPromedioDiario: 4.8,
    imagenR2: 'amoxicilina-250mg-suspension.webp',
    imagenLocal: null,
    imagenUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 105,
    familia: 'Amoxicilina',
    categoria: 'Antibióticos',
    nombreComercial: 'Clavumox 500/125 mg (Amox + Clavulánico)',
    principioActivo: 'Amoxicilina + Ácido Clavulánico',
    tipoProducto: 'MARCA',
    marcaComercial: 'Clavumox',
    laboratorio: 'Medifarma S.A.',
    concentracion: '500 mg / 125 mg',
    formaFarmaceutica: 'Tabletas Recubiertas',
    presentacion: 'Caja x 14 Tabletas',
    cajasPorBulto: 30,
    codigoEAN: '775012345005',
    codigoCan: 'CAN-CLV-500125',
    precioUnitario: 58.00,
    registroSanitario: 'EE-09142 DIGEMID',
    requiereReceta: true,
    umbralMinimo: 8,
    umbralSeguridad: 15,
    consumoPromedioDiario: 3.1,
    imagenR2: 'clavumox-500-125mg.webp',
    imagenLocal: null,
    imagenUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=600&q=80'
  },

  // ============================================================================
  // ANALGÉSICOS, ANTIINFLAMATORIOS Y OTROS GRUPOS TERAPÉUTICOS
  // ============================================================================
  {
    id: 106,
    familia: 'Paracetamol',
    categoria: 'Analgésicos y Antipiréticos',
    nombreComercial: 'Panadol Forte 500/65 mg',
    principioActivo: 'Paracetamol + Cafeína',
    tipoProducto: 'MARCA',
    marcaComercial: 'Panadol',
    laboratorio: 'GSK Consumer Health',
    concentracion: '500 mg / 65 mg',
    formaFarmaceutica: 'Tabletas Recubiertas',
    presentacion: 'Caja x 80 Tabletas',
    cajasPorBulto: 50,
    codigoEAN: '775012345006',
    codigoCan: 'CAN-PAN-50065',
    precioUnitario: 42.00,
    registroSanitario: 'EE-01234 DIGEMID',
    requiereReceta: false,
    umbralMinimo: 20,
    umbralSeguridad: 35,
    consumoPromedioDiario: 11.5,
    imagenR2: 'panadol-forte-500mg.webp',
    imagenLocal: null,
    imagenUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 107,
    familia: 'Azitromicina',
    categoria: 'Antibióticos',
    nombreComercial: 'Zitromax 500 mg',
    principioActivo: 'Azitromicina Dihidrato',
    tipoProducto: 'MARCA',
    marcaComercial: 'Zitromax',
    laboratorio: 'Pfizer S.A.',
    concentracion: '500 mg',
    formaFarmaceutica: 'Tabletas Recubiertas',
    presentacion: 'Caja x 3 Tabletas',
    cajasPorBulto: 60,
    codigoEAN: '775012345007',
    codigoCan: 'CAN-ZIT-00500',
    precioUnitario: 48.50,
    registroSanitario: 'EE-08912 DIGEMID',
    requiereReceta: true,
    umbralMinimo: 10,
    umbralSeguridad: 18,
    consumoPromedioDiario: 3.2,
    imagenR2: 'zitromax-500mg.webp',
    imagenLocal: null,
    imagenUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 108,
    familia: 'Ibuprofeno',
    categoria: 'Antiinflamatorios',
    nombreComercial: 'Ibuprofeno 400 mg Genfar',
    principioActivo: 'Ibuprofeno',
    tipoProducto: 'GENERICO',
    marcaComercial: 'Genfar Sanofi',
    laboratorio: 'Genfar Sanofi',
    concentracion: '400 mg',
    formaFarmaceutica: 'Tabletas',
    presentacion: 'Caja x 100 Tabletas',
    cajasPorBulto: 50,
    codigoEAN: '775012345008',
    codigoCan: 'CAN-IBU-00400',
    precioUnitario: 19.50,
    registroSanitario: 'EN-03412 DIGEMID',
    requiereReceta: false,
    umbralMinimo: 18,
    umbralSeguridad: 30,
    consumoPromedioDiario: 8.4,
    imagenR2: 'ibuprofeno-400mg.webp',
    imagenLocal: null,
    imagenUrl: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 109,
    familia: 'Losartán',
    categoria: 'Cardiovascular y Presión',
    nombreComercial: 'Cozaar 50 mg (Losartán)',
    principioActivo: 'Losartán Potásico',
    tipoProducto: 'MARCA',
    marcaComercial: 'Cozaar',
    laboratorio: 'Organon & Co.',
    concentracion: '50 mg',
    formaFarmaceutica: 'Comprimidos Recubiertos',
    presentacion: 'Caja x 30 Comprimidos',
    cajasPorBulto: 60,
    codigoEAN: '775012345009',
    codigoCan: 'CAN-COZ-00050',
    precioUnitario: 65.00,
    registroSanitario: 'EE-06542 DIGEMID',
    requiereReceta: true,
    umbralMinimo: 12,
    umbralSeguridad: 20,
    consumoPromedioDiario: 4.1,
    imagenR2: 'cozaar-50mg.webp',
    imagenLocal: null,
    imagenUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 110,
    familia: 'Metformina',
    categoria: 'Diabetes y Endocrinología',
    nombreComercial: 'Glucophage XR 850 mg',
    principioActivo: 'Metformina Clorhidrato',
    tipoProducto: 'MARCA',
    marcaComercial: 'Glucophage',
    laboratorio: 'Merck Peruana',
    concentracion: '850 mg',
    formaFarmaceutica: 'Tabletas de Liberación Prolongada',
    presentacion: 'Caja x 60 Tabletas',
    cajasPorBulto: 40,
    codigoEAN: '775012345010',
    codigoCan: 'CAN-GLU-00850',
    precioUnitario: 62.00,
    registroSanitario: 'EE-08912 DIGEMID',
    requiereReceta: true,
    umbralMinimo: 15,
    umbralSeguridad: 22,
    consumoPromedioDiario: 5.0,
    imagenR2: 'glucophage-850mg.webp',
    imagenLocal: null,
    imagenUrl: 'https://images.unsplash.com/photo-1550572017-ed200f5e6343?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 111,
    familia: 'Omeprazol',
    categoria: 'Gastroenterología',
    nombreComercial: 'Omeprazol 20 mg Genérico',
    principioActivo: 'Omeprazol Cápsulas',
    tipoProducto: 'GENERICO',
    marcaComercial: 'Genérico DCI',
    laboratorio: 'AC Farma',
    concentracion: '20 mg',
    formaFarmaceutica: 'Cápsulas con Capa Entérica',
    presentacion: 'Caja x 30 Cápsulas',
    cajasPorBulto: 80,
    codigoEAN: '775012345011',
    codigoCan: 'CAN-OME-00020',
    precioUnitario: 12.90,
    registroSanitario: 'EN-02190 DIGEMID',
    requiereReceta: false,
    umbralMinimo: 14,
    umbralSeguridad: 25,
    consumoPromedioDiario: 7.2,
    imagenR2: 'omeprazol-20mg.webp',
    imagenLocal: null,
    imagenUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 112,
    familia: 'Cetirizina',
    categoria: 'Antihistamínicos y Alergias',
    nombreComercial: 'Zyrtec 10 mg',
    principioActivo: 'Cetirizina Diclorhidrato',
    tipoProducto: 'MARCA',
    marcaComercial: 'Zyrtec',
    laboratorio: 'GSK Pharma',
    concentracion: '10 mg',
    formaFarmaceutica: 'Tabletas',
    presentacion: 'Caja x 20 Tabletas',
    cajasPorBulto: 60,
    codigoEAN: '775012345012',
    codigoCan: 'CAN-ZYR-00010',
    precioUnitario: 39.50,
    registroSanitario: 'EE-04519 DIGEMID',
    requiereReceta: false,
    umbralMinimo: 10,
    umbralSeguridad: 16,
    consumoPromedioDiario: 3.5,
    imagenR2: 'zyrtec-10mg.webp',
    imagenLocal: null,
    imagenUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80'
  },

  // ============================================================================
  // DERMOCOSMÉTICA, CUIDADO DE LA PIEL, DISPOSITIVOS Y CUIDADO PERSONAL
  // ============================================================================
  {
    id: 201,
    familia: 'Hidratantes Dermocosméticos',
    nombreComercial: 'CeraVe Crema Hidratante Piel Seca a Muy Seca',
    principioActivo: '3 Ceramidas Esenciales + Ácido Hialurónico',
    tipoProducto: 'MARCA',
    marcaComercial: 'CeraVe',
    laboratorio: "L'Oréal Cosméticos",
    concentracion: 'Fórmula MVE 24h',
    formaFarmaceutica: 'Crema Hidratante Corporal y Facial',
    presentacion: 'Pote x 453 g (16 oz)',
    cajasPorBulto: 24,
    codigoEAN: '775098765001',
    codigoCan: 'NSO-CER-00453',
    categoria: 'Dermocosmética y Piel',
    precioUnitario: 89.90,
    registroSanitario: 'NSOC41234-19PE (DIGEMID)',
    requiereReceta: false,
    umbralMinimo: 8,
    umbralSeguridad: 16,
    consumoPromedioDiario: 3.2,
    imagenR2: 'cerave-crema-hidratante-453g.webp',
    imagenLocal: null,
    imagenUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 202,
    familia: 'Fotoprotectores Solares',
    nombreComercial: 'La Roche-Posay Anthelios UVMune 400 SPF 50+',
    principioActivo: 'Filtro Mexoryl 400 + Agua Termal',
    tipoProducto: 'MARCA',
    marcaComercial: 'La Roche-Posay',
    laboratorio: 'La Roche-Posay Laboratoire',
    concentracion: 'SPF 50+ / UVA Muy Alto',
    formaFarmaceutica: 'Fluido Invisible Facial Anti-brillo',
    presentacion: 'Frasco x 50 mL con dosificador',
    cajasPorBulto: 36,
    codigoEAN: '775098765002',
    codigoCan: 'NSO-ANT-00050',
    categoria: 'Dermocosmética y Piel',
    precioUnitario: 114.90,
    registroSanitario: 'NSOC51892-21PE (DIGEMID)',
    requiereReceta: false,
    umbralMinimo: 10,
    umbralSeguridad: 20,
    consumoPromedioDiario: 4.5,
    imagenR2: 'anthelios-uvmune-400-spf50.webp',
    imagenLocal: null,
    imagenUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 203,
    familia: 'Pomadas Regeneradoras',
    nombreComercial: 'Bepanthen Pomada Regeneradora y Protectora',
    principioActivo: 'Dexpantenol (Pro-Vitamina B5 al 5%)',
    tipoProducto: 'MARCA',
    marcaComercial: 'Bepanthen',
    laboratorio: 'Bayer Hispania / Bayer Perú',
    concentracion: '50 mg/g (5%)',
    formaFarmaceutica: 'Pomada Dérmica Regeneradora',
    presentacion: 'Tubo x 30 g',
    cajasPorBulto: 48,
    codigoEAN: '775098765003',
    codigoCan: 'NSO-BEP-00030',
    categoria: 'Dermocosmética y Piel',
    precioUnitario: 24.50,
    registroSanitario: 'NSOC19821-16PE (DIGEMID)',
    requiereReceta: false,
    umbralMinimo: 12,
    umbralSeguridad: 25,
    consumoPromedioDiario: 5.8,
    imagenR2: 'bepanthen-pomada-30g.webp',
    imagenLocal: null,
    imagenUrl: 'https://images.unsplash.com/photo-1567928815104-b7980ee5032e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 204,
    familia: 'Lociones Corporales',
    nombreComercial: 'Eucerin pH5 Loción Hidratante Corporal',
    principioActivo: 'Tampón Citrato pH5 + Dexpantenol',
    tipoProducto: 'MARCA',
    marcaComercial: 'Eucerin',
    laboratorio: 'Beiersdorf S.A.',
    concentracion: 'pH5 Balance System',
    formaFarmaceutica: 'Loción Emoliente Suave',
    presentacion: 'Frasco con válvula dispensadora x 400 mL',
    cajasPorBulto: 20,
    codigoEAN: '775098765004',
    codigoCan: 'NSO-EUC-00400',
    categoria: 'Dermocosmética y Piel',
    precioUnitario: 74.90,
    registroSanitario: 'NSOC33120-18PE (DIGEMID)',
    requiereReceta: false,
    umbralMinimo: 8,
    umbralSeguridad: 15,
    consumoPromedioDiario: 2.8,
    imagenR2: 'eucerin-ph5-locion-400ml.webp',
    imagenLocal: null,
    imagenUrl: 'https://images.unsplash.com/photo-1608248597359-074465593cb8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 205,
    familia: 'Dispositivos Médicos',
    nombreComercial: 'Tensiómetro Digital de Brazo Citizen CH-452',
    principioActivo: 'Sensor Oscilométrico de Presión Arterial',
    tipoProducto: 'MARCA',
    marcaComercial: 'Citizen Healthcare',
    laboratorio: 'Citizen Systems Japan',
    concentracion: '90 Memorias • Pantalla LCD',
    formaFarmaceutica: 'Dispositivo Médico Certificado',
    presentacion: 'Caja con Tensiómetro + Brazalete M-L + Pilas',
    cajasPorBulto: 12,
    codigoEAN: '775098765005',
    codigoCan: 'DM-CIT-CH452',
    categoria: 'Dispositivos Médicos y Primeros Auxilios',
    precioUnitario: 149.00,
    registroSanitario: 'DM-12093-DIGEMID',
    requiereReceta: false,
    umbralMinimo: 4,
    umbralSeguridad: 8,
    consumoPromedioDiario: 1.1,
    imagenR2: 'tensiometro-digital-citizen.webp',
    imagenLocal: null,
    imagenUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 206,
    familia: 'Higiene y Desinfección',
    nombreComercial: 'Alcohol en Gel Antibacterial Aval 70°',
    principioActivo: 'Alcohol Etílico 70% + Aloe Vera y Glicerina',
    tipoProducto: 'MARCA',
    marcaComercial: 'Aval',
    laboratorio: 'Química Suiza S.A.C.',
    concentracion: '70° G.L.',
    formaFarmaceutica: 'Gel Antiséptico Desinfectante',
    presentacion: 'Frasco x 1000 mL (1 Litro) con dispensador',
    cajasPorBulto: 12,
    codigoEAN: '775098765006',
    codigoCan: 'NSO-AVA-01000',
    categoria: 'Higiene y Cuidado Personal',
    precioUnitario: 16.90,
    registroSanitario: 'NSOC29182-17PE (DIGEMID)',
    requiereReceta: false,
    umbralMinimo: 15,
    umbralSeguridad: 30,
    consumoPromedioDiario: 6.5,
    imagenR2: 'alcohol-en-gel-aval-1l.webp',
    imagenLocal: null,
    imagenUrl: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=600&q=80'
  }
];

function initMedicamentos() {
  const stored = getStoredItem(STORAGE_KEYS.MEDICAMENTOS, null);
  if (!stored) return [...DEFAULT_MEDICAMENTOS];
  const defaultsMap = new Map(DEFAULT_MEDICAMENTOS.map(m => [m.id, m]));
  const merged = stored.map(s => {
    const def = defaultsMap.get(s.id);
    if ((!s.categoria || s.categoria === 'Medicamento') && def?.categoria) {
      return { ...s, categoria: def.categoria };
    }
    return s;
  });
  const storedIds = new Set(merged.map(m => m.id));
  const missing = DEFAULT_MEDICAMENTOS.filter(m => !storedIds.has(m.id));
  return [...merged, ...missing];
}

export let MEDICAMENTOS = initMedicamentos();

const DEFAULT_INVENTARIO_DATA = {
  // SUCURSAL 1: InkaFarma Las Begonias (San Isidro)
  1: [
    { medicamentoId: 101, stockActual: 4, stockSeguridad: 25, estado: 'QUIEBRE_CRITICO', lotePrincipal: 'LT-AMX-2026A', diasAutonomia: 0.6 },
    { medicamentoId: 102, stockActual: 5, stockSeguridad: 22, estado: 'QUIEBRE_CRITICO', lotePrincipal: 'LT-TRX-2026A', diasAutonomia: 0.9 },
    { medicamentoId: 103, stockActual: 18, stockSeguridad: 35, estado: 'ALERTA_BAJA', lotePrincipal: 'LT-AMX-GEN-01', diasAutonomia: 2.1 },
    { medicamentoId: 104, stockActual: 6, stockSeguridad: 20, estado: 'ALERTA_BAJA', lotePrincipal: 'LT-AMX-PED-01', diasAutonomia: 1.2 },
    { medicamentoId: 105, stockActual: 3, stockSeguridad: 15, estado: 'QUIEBRE_CRITICO', lotePrincipal: 'LT-CLV-001', diasAutonomia: 0.9 },
    { medicamentoId: 106, stockActual: 48, stockSeguridad: 35, estado: 'OPTIMO', lotePrincipal: 'LT-PAN-9921', diasAutonomia: 4.2 },
    { medicamentoId: 107, stockActual: 2, stockSeguridad: 18, estado: 'QUIEBRE_CRITICO', lotePrincipal: 'LT-ZIT-4412', diasAutonomia: 0.6 },
    { medicamentoId: 108, stockActual: 65, stockSeguridad: 30, estado: 'OPTIMO', lotePrincipal: 'LT-IBU-8102', diasAutonomia: 7.7 },
    { medicamentoId: 109, stockActual: 8, stockSeguridad: 20, estado: 'ALERTA_BAJA', lotePrincipal: 'LT-COZ-7120', diasAutonomia: 1.9 },
    { medicamentoId: 110, stockActual: 30, stockSeguridad: 22, estado: 'OPTIMO', lotePrincipal: 'LT-GLU-5541', diasAutonomia: 6.0 },
    { medicamentoId: 111, stockActual: 5, stockSeguridad: 25, estado: 'QUIEBRE_CRITICO', lotePrincipal: 'LT-OME-1982', diasAutonomia: 0.7 },
    { medicamentoId: 112, stockActual: 22, stockSeguridad: 16, estado: 'OPTIMO', lotePrincipal: 'LT-ZYR-3011', diasAutonomia: 6.3 },
    // Dermocosmética y Cuidado Personal
    { medicamentoId: 201, stockActual: 14, stockSeguridad: 8, estado: 'OPTIMO', lotePrincipal: 'LT-CER-2026A', diasAutonomia: 4.3 },
    { medicamentoId: 202, stockActual: 8, stockSeguridad: 10, estado: 'ALERTA_BAJA', lotePrincipal: 'LT-ANT-2026A', diasAutonomia: 1.8 },
    { medicamentoId: 203, stockActual: 25, stockSeguridad: 12, estado: 'OPTIMO', lotePrincipal: 'LT-BEP-2026A', diasAutonomia: 4.3 },
    { medicamentoId: 204, stockActual: 10, stockSeguridad: 8, estado: 'OPTIMO', lotePrincipal: 'LT-EUC-2026A', diasAutonomia: 3.5 },
    { medicamentoId: 205, stockActual: 3, stockSeguridad: 4, estado: 'ALERTA_BAJA', lotePrincipal: 'LT-CIT-2026A', diasAutonomia: 2.7 },
    { medicamentoId: 206, stockActual: 40, stockSeguridad: 15, estado: 'OPTIMO', lotePrincipal: 'LT-AVA-2026A', diasAutonomia: 6.1 }
  ],
  // SUCURSAL 2: Mifarma Miraflores Ovalo Gutiérrez (Excelente Stock)
  2: [
    { medicamentoId: 101, stockActual: 95, stockSeguridad: 25, estado: 'SOBRESTOCK', lotePrincipal: 'LT-AMX-2026B', diasAutonomia: 15.3 },
    { medicamentoId: 102, stockActual: 82, stockSeguridad: 22, estado: 'SOBRESTOCK', lotePrincipal: 'LT-TRX-2026B', diasAutonomia: 15.1 },
    { medicamentoId: 103, stockActual: 140, stockSeguridad: 35, estado: 'SOBRESTOCK', lotePrincipal: 'LT-AMX-GEN-02', diasAutonomia: 16.4 },
    { medicamentoId: 104, stockActual: 45, stockSeguridad: 20, estado: 'SOBRESTOCK', lotePrincipal: 'LT-AMX-PED-02', diasAutonomia: 9.4 },
    { medicamentoId: 105, stockActual: 32, stockSeguridad: 15, estado: 'SOBRESTOCK', lotePrincipal: 'LT-CLV-002', diasAutonomia: 10.3 },
    { medicamentoId: 106, stockActual: 72, stockSeguridad: 35, estado: 'OPTIMO', lotePrincipal: 'LT-PAN-9922', diasAutonomia: 6.2 },
    { medicamentoId: 107, stockActual: 38, stockSeguridad: 18, estado: 'SOBRESTOCK', lotePrincipal: 'LT-ZIT-4418', diasAutonomia: 11.8 },
    { medicamentoId: 108, stockActual: 40, stockSeguridad: 30, estado: 'OPTIMO', lotePrincipal: 'LT-IBU-8105', diasAutonomia: 4.8 },
    { medicamentoId: 109, stockActual: 35, stockSeguridad: 20, estado: 'OPTIMO', lotePrincipal: 'LT-COZ-7128', diasAutonomia: 8.5 },
    { medicamentoId: 110, stockActual: 44, stockSeguridad: 22, estado: 'OPTIMO', lotePrincipal: 'LT-GLU-5549', diasAutonomia: 8.8 },
    { medicamentoId: 111, stockActual: 88, stockSeguridad: 25, estado: 'SOBRESTOCK', lotePrincipal: 'LT-OME-1988', diasAutonomia: 12.2 },
    { medicamentoId: 112, stockActual: 18, stockSeguridad: 16, estado: 'OPTIMO', lotePrincipal: 'LT-ZYR-3015', diasAutonomia: 5.1 },
    // Dermocosmética y Cuidado Personal en Miraflores Ovalo Gutiérrez (Excedente)
    { medicamentoId: 201, stockActual: 42, stockSeguridad: 16, estado: 'SOBRESTOCK', lotePrincipal: 'LT-CER-2026B', diasAutonomia: 13.1 },
    { medicamentoId: 202, stockActual: 38, stockSeguridad: 20, estado: 'SOBRESTOCK', lotePrincipal: 'LT-ANT-2026B', diasAutonomia: 8.4 },
    { medicamentoId: 203, stockActual: 60, stockSeguridad: 25, estado: 'SOBRESTOCK', lotePrincipal: 'LT-BEP-2026B', diasAutonomia: 10.3 },
    { medicamentoId: 204, stockActual: 32, stockSeguridad: 15, estado: 'SOBRESTOCK', lotePrincipal: 'LT-EUC-2026B', diasAutonomia: 11.4 },
    { medicamentoId: 205, stockActual: 12, stockSeguridad: 4, estado: 'SOBRESTOCK', lotePrincipal: 'LT-CIT-2026B', diasAutonomia: 12.0 },
    { medicamentoId: 206, stockActual: 85, stockSeguridad: 30, estado: 'SOBRESTOCK', lotePrincipal: 'LT-AVA-2026B', diasAutonomia: 13.0 }
  ],
  // SUCURSAL 3: InkaFarma San Borja Javier Prado
  3: [
    { medicamentoId: 101, stockActual: 62, stockSeguridad: 25, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-2026C', diasAutonomia: 10.0 },
    { medicamentoId: 102, stockActual: 48, stockSeguridad: 22, estado: 'OPTIMO', lotePrincipal: 'LT-TRX-2026C', diasAutonomia: 8.8 },
    { medicamentoId: 103, stockActual: 75, stockSeguridad: 35, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-GEN-03', diasAutonomia: 8.8 },
    { medicamentoId: 104, stockActual: 28, stockSeguridad: 20, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-PED-03', diasAutonomia: 5.8 },
    { medicamentoId: 105, stockActual: 18, stockSeguridad: 15, estado: 'OPTIMO', lotePrincipal: 'LT-CLV-003', diasAutonomia: 5.8 },
    { medicamentoId: 106, stockActual: 110, stockSeguridad: 35, estado: 'SOBRESTOCK', lotePrincipal: 'LT-PAN-9930', diasAutonomia: 9.6 },
    { medicamentoId: 107, stockActual: 24, stockSeguridad: 18, estado: 'OPTIMO', lotePrincipal: 'LT-ZIT-4420', diasAutonomia: 7.5 },
    { medicamentoId: 108, stockActual: 28, stockSeguridad: 30, estado: 'ALERTA_BAJA', lotePrincipal: 'LT-IBU-8110', diasAutonomia: 3.3 },
    { medicamentoId: 109, stockActual: 40, stockSeguridad: 20, estado: 'OPTIMO', lotePrincipal: 'LT-COZ-7132', diasAutonomia: 9.8 },
    { medicamentoId: 110, stockActual: 19, stockSeguridad: 22, estado: 'ALERTA_BAJA', lotePrincipal: 'LT-GLU-5552', diasAutonomia: 3.8 },
    { medicamentoId: 111, stockActual: 45, stockSeguridad: 25, estado: 'OPTIMO', lotePrincipal: 'LT-OME-1990', diasAutonomia: 6.2 },
    { medicamentoId: 112, stockActual: 30, stockSeguridad: 16, estado: 'OPTIMO', lotePrincipal: 'LT-ZYR-3020', diasAutonomia: 8.6 }
  ],
  // SUCURSAL 4: Mifarma Surco El Polo
  4: [
    { medicamentoId: 101, stockActual: 45, stockSeguridad: 25, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-2026D', diasAutonomia: 7.2 },
    { medicamentoId: 102, stockActual: 35, stockSeguridad: 22, estado: 'OPTIMO', lotePrincipal: 'LT-TRX-2026D', diasAutonomia: 6.4 },
    { medicamentoId: 103, stockActual: 60, stockSeguridad: 35, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-GEN-04', diasAutonomia: 7.0 },
    { medicamentoId: 104, stockActual: 30, stockSeguridad: 20, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-PED-04', diasAutonomia: 6.2 },
    { medicamentoId: 105, stockActual: 14, stockSeguridad: 15, estado: 'OPTIMO', lotePrincipal: 'LT-CLV-004', diasAutonomia: 4.5 },
    { medicamentoId: 106, stockActual: 55, stockSeguridad: 35, estado: 'OPTIMO', lotePrincipal: 'LT-PAN-9935', diasAutonomia: 4.8 },
    { medicamentoId: 107, stockActual: 18, stockSeguridad: 18, estado: 'OPTIMO', lotePrincipal: 'LT-ZIT-4425', diasAutonomia: 5.6 },
    { medicamentoId: 108, stockActual: 82, stockSeguridad: 30, estado: 'SOBRESTOCK', lotePrincipal: 'LT-IBU-8115', diasAutonomia: 9.7 },
    { medicamentoId: 109, stockActual: 24, stockSeguridad: 20, estado: 'OPTIMO', lotePrincipal: 'LT-COZ-7135', diasAutonomia: 5.8 },
    { medicamentoId: 110, stockActual: 52, stockSeguridad: 22, estado: 'SOBRESTOCK', lotePrincipal: 'LT-GLU-5555', diasAutonomia: 10.4 },
    { medicamentoId: 111, stockActual: 38, stockSeguridad: 25, estado: 'OPTIMO', lotePrincipal: 'LT-OME-1995', diasAutonomia: 5.2 },
    { medicamentoId: 112, stockActual: 14, stockSeguridad: 16, estado: 'ALERTA_BAJA', lotePrincipal: 'LT-ZYR-3025', diasAutonomia: 4.0 }
  ],
  // SUCURSAL 5: InkaFarma Lince Petit Thouars
  5: [
    { medicamentoId: 101, stockActual: 38, stockSeguridad: 25, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-2026E', diasAutonomia: 6.1 },
    { medicamentoId: 102, stockActual: 30, stockSeguridad: 22, estado: 'OPTIMO', lotePrincipal: 'LT-TRX-2026E', diasAutonomia: 5.5 },
    { medicamentoId: 103, stockActual: 50, stockSeguridad: 35, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-GEN-05', diasAutonomia: 5.8 },
    { medicamentoId: 104, stockActual: 22, stockSeguridad: 20, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-PED-05', diasAutonomia: 4.5 },
    { medicamentoId: 105, stockActual: 11, stockSeguridad: 15, estado: 'ALERTA_BAJA', lotePrincipal: 'LT-CLV-005', diasAutonomia: 3.5 },
    { medicamentoId: 106, stockActual: 30, stockSeguridad: 35, estado: 'ALERTA_BAJA', lotePrincipal: 'LT-PAN-9940', diasAutonomia: 2.6 },
    { medicamentoId: 107, stockActual: 15, stockSeguridad: 18, estado: 'ALERTA_BAJA', lotePrincipal: 'LT-ZIT-4430', diasAutonomia: 4.6 },
    { medicamentoId: 108, stockActual: 35, stockSeguridad: 30, estado: 'OPTIMO', lotePrincipal: 'LT-IBU-8120', diasAutonomia: 4.1 },
    { medicamentoId: 109, stockActual: 6, stockSeguridad: 20, estado: 'QUIEBRE_CRITICO', lotePrincipal: 'LT-COZ-7140', diasAutonomia: 1.4 },
    { medicamentoId: 110, stockActual: 26, stockSeguridad: 22, estado: 'OPTIMO', lotePrincipal: 'LT-GLU-5560', diasAutonomia: 5.2 },
    { medicamentoId: 111, stockActual: 29, stockSeguridad: 25, estado: 'OPTIMO', lotePrincipal: 'LT-OME-2000', diasAutonomia: 4.0 },
    { medicamentoId: 112, stockActual: 8, stockSeguridad: 16, estado: 'ALERTA_BAJA', lotePrincipal: 'LT-ZYR-3030', diasAutonomia: 2.2 }
  ],
  // SUCURSAL 6: Mifarma Jesús María Real Plaza
  6: [
    { medicamentoId: 101, stockActual: 50, stockSeguridad: 25, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-2026F', diasAutonomia: 8.0 },
    { medicamentoId: 102, stockActual: 42, stockSeguridad: 22, estado: 'OPTIMO', lotePrincipal: 'LT-TRX-2026F', diasAutonomia: 7.7 },
    { medicamentoId: 103, stockActual: 80, stockSeguridad: 35, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-GEN-06', diasAutonomia: 9.4 },
    { medicamentoId: 104, stockActual: 35, stockSeguridad: 20, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-PED-06', diasAutonomia: 7.2 },
    { medicamentoId: 105, stockActual: 22, stockSeguridad: 15, estado: 'OPTIMO', lotePrincipal: 'LT-CLV-006', diasAutonomia: 7.0 },
    { medicamentoId: 106, stockActual: 60, stockSeguridad: 35, estado: 'OPTIMO', lotePrincipal: 'LT-PAN-9945', diasAutonomia: 5.2 },
    { medicamentoId: 107, stockActual: 15, stockSeguridad: 18, estado: 'ALERTA_BAJA', lotePrincipal: 'LT-ZIT-4435', diasAutonomia: 4.6 },
    { medicamentoId: 108, stockActual: 48, stockSeguridad: 30, estado: 'OPTIMO', lotePrincipal: 'LT-IBU-8125', diasAutonomia: 5.7 },
    { medicamentoId: 109, stockActual: 32, stockSeguridad: 20, estado: 'OPTIMO', lotePrincipal: 'LT-COZ-7145', diasAutonomia: 7.8 },
    { medicamentoId: 110, stockActual: 28, stockSeguridad: 22, estado: 'OPTIMO', lotePrincipal: 'LT-GLU-5565', diasAutonomia: 5.6 },
    { medicamentoId: 111, stockActual: 50, stockSeguridad: 25, estado: 'OPTIMO', lotePrincipal: 'LT-OME-2005', diasAutonomia: 6.9 },
    { medicamentoId: 112, stockActual: 25, stockSeguridad: 16, estado: 'OPTIMO', lotePrincipal: 'LT-ZYR-3035', diasAutonomia: 7.1 }
  ],
  // SUCURSAL 7: InkaFarma Magdalena Mercado
  7: [
    { medicamentoId: 101, stockActual: 40, stockSeguridad: 25, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-2026G', diasAutonomia: 6.4 },
    { medicamentoId: 102, stockActual: 33, stockSeguridad: 22, estado: 'OPTIMO', lotePrincipal: 'LT-TRX-2026G', diasAutonomia: 6.1 },
    { medicamentoId: 103, stockActual: 55, stockSeguridad: 35, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-GEN-07', diasAutonomia: 6.4 },
    { medicamentoId: 104, stockActual: 25, stockSeguridad: 20, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-PED-07', diasAutonomia: 5.2 },
    { medicamentoId: 105, stockActual: 16, stockSeguridad: 15, estado: 'OPTIMO', lotePrincipal: 'LT-CLV-007', diasAutonomia: 5.1 },
    { medicamentoId: 106, stockActual: 44, stockSeguridad: 35, estado: 'OPTIMO', lotePrincipal: 'LT-PAN-9950', diasAutonomia: 3.8 },
    { medicamentoId: 107, stockActual: 19, stockSeguridad: 18, estado: 'OPTIMO', lotePrincipal: 'LT-ZIT-4440', diasAutonomia: 5.9 },
    { medicamentoId: 108, stockActual: 50, stockSeguridad: 30, estado: 'OPTIMO', lotePrincipal: 'LT-IBU-8130', diasAutonomia: 5.9 },
    { medicamentoId: 109, stockActual: 22, stockSeguridad: 20, estado: 'OPTIMO', lotePrincipal: 'LT-COZ-7150', diasAutonomia: 5.3 },
    { medicamentoId: 110, stockActual: 35, stockSeguridad: 22, estado: 'OPTIMO', lotePrincipal: 'LT-GLU-5570', diasAutonomia: 7.0 },
    { medicamentoId: 111, stockActual: 30, stockSeguridad: 25, estado: 'OPTIMO', lotePrincipal: 'LT-OME-2010', diasAutonomia: 4.1 },
    { medicamentoId: 112, stockActual: 20, stockSeguridad: 16, estado: 'OPTIMO', lotePrincipal: 'LT-ZYR-3040', diasAutonomia: 5.7 }
  ],
  // SUCURSAL 8: Centro de Distribución Huachipa (CD)
  8: [
    { medicamentoId: 101, stockActual: 4500, stockSeguridad: 500, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-CD01', diasAutonomia: 60.0 },
    { medicamentoId: 102, stockActual: 3800, stockSeguridad: 400, estado: 'OPTIMO', lotePrincipal: 'LT-TRX-CD01', diasAutonomia: 55.0 },
    { medicamentoId: 103, stockActual: 9000, stockSeguridad: 800, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-GEN-CD', diasAutonomia: 80.0 },
    { medicamentoId: 104, stockActual: 3200, stockSeguridad: 400, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-CD-PED', diasAutonomia: 55.0 },
    { medicamentoId: 105, stockActual: 1950, stockSeguridad: 300, estado: 'OPTIMO', lotePrincipal: 'LT-CLV-CD01', diasAutonomia: 48.0 },
    { medicamentoId: 106, stockActual: 8200, stockSeguridad: 800, estado: 'OPTIMO', lotePrincipal: 'LT-PAN-CD01', diasAutonomia: 75.0 },
    { medicamentoId: 107, stockActual: 2100, stockSeguridad: 300, estado: 'OPTIMO', lotePrincipal: 'LT-ZIT-CD01', diasAutonomia: 45.0 },
    { medicamentoId: 108, stockActual: 6400, stockSeguridad: 600, estado: 'OPTIMO', lotePrincipal: 'LT-IBU-CD01', diasAutonomia: 65.0 },
    { medicamentoId: 109, stockActual: 3800, stockSeguridad: 400, estado: 'OPTIMO', lotePrincipal: 'LT-COZ-CD01', diasAutonomia: 58.0 },
    { medicamentoId: 110, stockActual: 4200, stockSeguridad: 500, estado: 'OPTIMO', lotePrincipal: 'LT-GLU-CD01', diasAutonomia: 62.0 },
    { medicamentoId: 111, stockActual: 5100, stockSeguridad: 500, estado: 'OPTIMO', lotePrincipal: 'LT-OME-CD01', diasAutonomia: 70.0 },
    { medicamentoId: 112, stockActual: 2900, stockSeguridad: 300, estado: 'OPTIMO', lotePrincipal: 'LT-ZYR-CD01', diasAutonomia: 52.0 },
    { medicamentoId: 201, stockActual: 600, stockSeguridad: 100, estado: 'OPTIMO', lotePrincipal: 'LT-CER-CD01', diasAutonomia: 60.0 },
    { medicamentoId: 202, stockActual: 800, stockSeguridad: 120, estado: 'OPTIMO', lotePrincipal: 'LT-ANT-CD01', diasAutonomia: 60.0 },
    { medicamentoId: 203, stockActual: 1200, stockSeguridad: 150, estado: 'OPTIMO', lotePrincipal: 'LT-BEP-CD01', diasAutonomia: 60.0 },
    { medicamentoId: 204, stockActual: 500, stockSeguridad: 80, estado: 'OPTIMO', lotePrincipal: 'LT-EUC-CD01', diasAutonomia: 60.0 },
    { medicamentoId: 205, stockActual: 250, stockSeguridad: 40, estado: 'OPTIMO', lotePrincipal: 'LT-CIT-CD01', diasAutonomia: 60.0 },
    { medicamentoId: 206, stockActual: 1500, stockSeguridad: 200, estado: 'OPTIMO', lotePrincipal: 'LT-AVA-CD01', diasAutonomia: 60.0 }
  ],
  // SUCURSAL 9: InkaFarma Los Olivos MegaPlaza (Lima Norte)
  9: [
    { medicamentoId: 101, stockActual: 55, stockSeguridad: 25, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-2026NO', diasAutonomia: 8.8 },
    { medicamentoId: 102, stockActual: 40, stockSeguridad: 22, estado: 'OPTIMO', lotePrincipal: 'LT-TRX-2026NO', diasAutonomia: 7.4 },
    { medicamentoId: 103, stockActual: 90, stockSeguridad: 35, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-GEN-NO', diasAutonomia: 10.5 },
    { medicamentoId: 106, stockActual: 80, stockSeguridad: 35, estado: 'SOBRESTOCK', lotePrincipal: 'LT-PAN-NO01', diasAutonomia: 7.0 },
    { medicamentoId: 201, stockActual: 22, stockSeguridad: 15, estado: 'OPTIMO', lotePrincipal: 'LT-CER-NO01', diasAutonomia: 6.8 },
    { medicamentoId: 202, stockActual: 30, stockSeguridad: 18, estado: 'OPTIMO', lotePrincipal: 'LT-ANT-NO01', diasAutonomia: 6.6 }
  ],
  // SUCURSAL 10: Mifarma SJL Las Flores (Lima Este)
  10: [
    { medicamentoId: 101, stockActual: 12, stockSeguridad: 25, estado: 'ALERTA_BAJA', lotePrincipal: 'LT-AMX-2026LE', diasAutonomia: 1.9 },
    { medicamentoId: 102, stockActual: 8, stockSeguridad: 22, estado: 'QUIEBRE_CRITICO', lotePrincipal: 'LT-TRX-2026LE', diasAutonomia: 1.4 },
    { medicamentoId: 103, stockActual: 30, stockSeguridad: 35, estado: 'ALERTA_BAJA', lotePrincipal: 'LT-AMX-GEN-LE', diasAutonomia: 3.5 },
    { medicamentoId: 106, stockActual: 45, stockSeguridad: 35, estado: 'OPTIMO', lotePrincipal: 'LT-PAN-LE01', diasAutonomia: 3.9 },
    { medicamentoId: 206, stockActual: 35, stockSeguridad: 20, estado: 'OPTIMO', lotePrincipal: 'LT-AVA-LE01', diasAutonomia: 5.3 }
  ],
  // SUCURSAL 11: InkaFarma Arequipa Mercaderes (Arequipa)
  11: [
    { medicamentoId: 101, stockActual: 75, stockSeguridad: 25, estado: 'SOBRESTOCK', lotePrincipal: 'LT-AMX-AQP01', diasAutonomia: 12.0 },
    { medicamentoId: 102, stockActual: 60, stockSeguridad: 22, estado: 'SOBRESTOCK', lotePrincipal: 'LT-TRX-AQP01', diasAutonomia: 11.1 },
    { medicamentoId: 103, stockActual: 110, stockSeguridad: 35, estado: 'SOBRESTOCK', lotePrincipal: 'LT-AMX-GEN-AQP', diasAutonomia: 12.9 },
    { medicamentoId: 106, stockActual: 90, stockSeguridad: 35, estado: 'SOBRESTOCK', lotePrincipal: 'LT-PAN-AQP01', diasAutonomia: 7.8 },
    { medicamentoId: 201, stockActual: 25, stockSeguridad: 12, estado: 'OPTIMO', lotePrincipal: 'LT-CER-AQP01', diasAutonomia: 7.8 }
  ],
  // SUCURSAL 12: Mifarma Cusco Av. El Sol (Cusco)
  12: [
    { medicamentoId: 101, stockActual: 8, stockSeguridad: 25, estado: 'QUIEBRE_CRITICO', lotePrincipal: 'LT-AMX-CUZ01', diasAutonomia: 1.2 },
    { medicamentoId: 102, stockActual: 10, stockSeguridad: 22, estado: 'ALERTA_BAJA', lotePrincipal: 'LT-TRX-CUZ01', diasAutonomia: 1.8 },
    { medicamentoId: 103, stockActual: 25, stockSeguridad: 35, estado: 'ALERTA_BAJA', lotePrincipal: 'LT-AMX-GEN-CUZ', diasAutonomia: 2.9 },
    { medicamentoId: 106, stockActual: 120, stockSeguridad: 35, estado: 'SOBRESTOCK', lotePrincipal: 'LT-PAN-CUZ01', diasAutonomia: 10.4 },
    { medicamentoId: 205, stockActual: 8, stockSeguridad: 4, estado: 'OPTIMO', lotePrincipal: 'LT-CIT-CUZ01', diasAutonomia: 7.2 }
  ],
  // SUCURSAL 13: Mifarma Trujillo Pizarro (La Libertad)
  13: [
    { medicamentoId: 101, stockActual: 65, stockSeguridad: 25, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-TRU01', diasAutonomia: 10.4 },
    { medicamentoId: 102, stockActual: 50, stockSeguridad: 22, estado: 'OPTIMO', lotePrincipal: 'LT-TRX-TRU01', diasAutonomia: 9.2 },
    { medicamentoId: 103, stockActual: 80, stockSeguridad: 35, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-GEN-TRU', diasAutonomia: 9.4 },
    { medicamentoId: 106, stockActual: 70, stockSeguridad: 35, estado: 'OPTIMO', lotePrincipal: 'LT-PAN-TRU01', diasAutonomia: 6.0 },
    { medicamentoId: 203, stockActual: 40, stockSeguridad: 20, estado: 'OPTIMO', lotePrincipal: 'LT-BEP-TRU01', diasAutonomia: 6.8 }
  ],
  // SUCURSAL 14: InkaFarma Chiclayo Balta (Lambayeque)
  14: [
    { medicamentoId: 101, stockActual: 85, stockSeguridad: 25, estado: 'SOBRESTOCK', lotePrincipal: 'LT-AMX-CHX01', diasAutonomia: 13.7 },
    { medicamentoId: 102, stockActual: 70, stockSeguridad: 22, estado: 'SOBRESTOCK', lotePrincipal: 'LT-TRX-CHX01', diasAutonomia: 12.9 },
    { medicamentoId: 103, stockActual: 125, stockSeguridad: 35, estado: 'SOBRESTOCK', lotePrincipal: 'LT-AMX-GEN-CHX', diasAutonomia: 14.7 },
    { medicamentoId: 202, stockActual: 50, stockSeguridad: 20, estado: 'SOBRESTOCK', lotePrincipal: 'LT-ANT-CHX01', diasAutonomia: 11.1 },
    { medicamentoId: 206, stockActual: 60, stockSeguridad: 25, estado: 'SOBRESTOCK', lotePrincipal: 'LT-AVA-CHX01', diasAutonomia: 9.2 }
  ],
  // SUCURSAL 15: InkaFarma Huancayo Calle Real (Junín)
  15: [
    { medicamentoId: 101, stockActual: 30, stockSeguridad: 25, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-HYO01', diasAutonomia: 4.8 },
    { medicamentoId: 102, stockActual: 25, stockSeguridad: 22, estado: 'OPTIMO', lotePrincipal: 'LT-TRX-HYO01', diasAutonomia: 4.6 },
    { medicamentoId: 103, stockActual: 50, stockSeguridad: 35, estado: 'OPTIMO', lotePrincipal: 'LT-AMX-GEN-HYO', diasAutonomia: 5.8 },
    { medicamentoId: 106, stockActual: 110, stockSeguridad: 35, estado: 'SOBRESTOCK', lotePrincipal: 'LT-PAN-HYO01', diasAutonomia: 9.5 },
    { medicamentoId: 204, stockActual: 20, stockSeguridad: 12, estado: 'OPTIMO', lotePrincipal: 'LT-EUC-HYO01', diasAutonomia: 7.1 }
  ]
};

function initInventarioData(medsList) {
  const stored = getStoredItem(STORAGE_KEYS.INVENTARIO, null);
  const data = stored || JSON.parse(JSON.stringify(DEFAULT_INVENTARIO_DATA));
  SUCURSALES.forEach(suc => {
    if (!data[suc.id]) data[suc.id] = [];
    medsList.forEach(m => {
      const exists = data[suc.id].some(item => item.medicamentoId === m.id);
      if (!exists) {
        data[suc.id].push({
          medicamentoId: m.id,
          stockActual: suc.esCentroDistribucion ? 500 : 12,
          stockSeguridad: m.umbralSeguridad || 15,
          estado: 'OPTIMO',
          lotePrincipal: 'LT-' + (m.codigoEAN ? m.codigoEAN.slice(-6) : '2026'),
          diasAutonomia: 5.0
        });
      }
    });
  });
  return data;
}

export let INVENTARIO_DATA = initInventarioData(MEDICAMENTOS);

const DEFAULT_LOTES_CADUCIDAD = [
  {
    id: 1,
    codigoLote: 'LT-AMX-2024-V1',
    medicamentoId: 101,
    sucursalId: 1,
    fechaVencimiento: '2026-09-15',
    diasRestantes: 16,
    cantidad: 18,
    semaforo: 'ROJO',
    accionRecomendada: 'Bloquear lote para devolución inmediata a Laboratorio Megalabs.',
    impactoMonetario: 765.00
  },
  {
    id: 2,
    codigoLote: 'LT-TRX-2024-X4',
    medicamentoId: 102,
    sucursalId: 1,
    fechaVencimiento: '2026-09-28',
    diasRestantes: 29,
    cantidad: 12,
    semaforo: 'ROJO',
    accionRecomendada: 'Promoción autorizada o canje express con Pharmetica.',
    impactoMonetario: 456.00
  },
  {
    id: 3,
    codigoLote: 'LT-OME-2025-A2',
    medicamentoId: 111,
    sucursalId: 1,
    fechaVencimiento: '2026-10-18',
    diasRestantes: 49,
    cantidad: 35,
    semaforo: 'NARANJA',
    accionRecomendada: 'Priorizar en dispensación FEFO de ventanilla inmediata.',
    impactoMonetario: 451.50
  },
  {
    id: 4,
    codigoLote: 'LT-PAN-2025-C9',
    medicamentoId: 106,
    sucursalId: 2,
    fechaVencimiento: '2026-10-25',
    diasRestantes: 56,
    cantidad: 40,
    semaforo: 'NARANJA',
    accionRecomendada: 'Trasladar a sucursal de alta rotación (San Isidro / San Borja).',
    impactoMonetario: 1680.00
  }
];

export let LOTES_CADUCIDAD = getStoredItem(STORAGE_KEYS.LOTES, DEFAULT_LOTES_CADUCIDAD);

const DEFAULT_TRASLADOS_SUGERIDOS = [
  {
    id: 1,
    codigo: 'TRA-2026-00891',
    fechaSugerencia: '2026-10-25 08:30',
    origenSucursalId: 2,
    destinoSucursalId: 1,
    medicamentoId: 101,
    cantidadSugerida: 35,
    distanciaKm: 2.3,
    prioridad: 'URGENTE',
    motivo: 'PREDICCION_QUIEBRE_7_DIAS',
    justificacion: 'San Isidro tiene 0.6 días de stock de Amoxidal 500. Miraflores tiene sobrestock de 15.3 días.',
    estado: 'PENDIENTE_APROBACION', // Espera Guía de Salida SUNAT
    ahorroEstimadoSoles: 1487.50,
    guiaSalida: null,
    guiaEntrada: null
  },
  {
    id: 2,
    codigo: 'TRA-2026-00892',
    fechaSugerencia: '2026-10-25 09:15',
    origenSucursalId: 2,
    destinoSucursalId: 1,
    medicamentoId: 102,
    cantidadSugerida: 25,
    distanciaKm: 2.3,
    prioridad: 'URGENTE',
    motivo: 'PREDICCION_QUIEBRE_7_DIAS',
    justificacion: 'Trixan 500 en quiebre crítico en San Isidro. Despachado en valija de seguridad sellada.',
    estado: 'EN_TRANSITO', // Despachado, furgón en ruta con precinto
    ahorroEstimadoSoles: 950.00,
    guiaSalida: {
      numeroGuia: 'T001-00004892',
      codigoHashSunat: '4A8F9C1B7E3D2A5581E',
      fechaEmision: '2026-10-25 09:40',
      conductor: 'Carlos Mendoza Quispe',
      licenciaConducir: 'Q-45892110',
      placaVehiculo: 'BCV-912',
      marcaVehiculo: 'Mercedes-Benz Sprinter Furgón Isotérmico',
      precintoSeguridad: 'PREC-SEC-88219',
      temperaturaDespacho: '20.5 °C',
      bultosTotales: 1,
      pesoBrutoKg: 3.2,
      despachadoPor: 'QF Director Técnico (Mifarma Miraflores)'
    },
    guiaEntrada: null // Listo para ser recepcionado en sede destino
  },
  {
    id: 3,
    codigo: 'TRA-2026-00893',
    fechaSugerencia: '2026-10-25 07:45',
    origenSucursalId: 2,
    destinoSucursalId: 1,
    medicamentoId: 201, // CeraVe Crema Hidratante (Dermocosmética / No Medicamento)
    cantidadSugerida: 15,
    distanciaKm: 2.3,
    prioridad: 'NORMAL',
    motivo: 'CAMPANA_PROMOCIONAL',
    justificacion: 'Reposición de CeraVe 453g para campaña dermatológica en San Isidro.',
    estado: 'RECEPCIONADO_CONFORME', // Completó ambas guías formalmente
    ahorroEstimadoSoles: 1348.50,
    guiaSalida: {
      numeroGuia: 'T001-00004890',
      codigoHashSunat: '9C2B8A1D4E7F550212F',
      fechaEmision: '2026-10-25 08:00',
      conductor: 'Juan Pérez Villanueva',
      licenciaConducir: 'Q-38192004',
      placaVehiculo: 'D2A-741',
      marcaVehiculo: 'Furgón Isotérmico Liviano',
      precintoSeguridad: 'PREC-VAL-77401',
      temperaturaDespacho: '21.0 °C',
      bultosTotales: 1,
      pesoBrutoKg: 7.5,
      despachadoPor: 'QF Director Técnico (Mifarma Miraflores)'
    },
    guiaEntrada: {
      numeroActaRecepcion: 'ACTA-BPA-2026-00341',
      numeroGuiaEntrada: 'GE-001-0000341',
      fechaRecepcion: '2026-10-25 09:10',
      qfReceptor: 'Ronny Fernando Mendoza Paucar (QF Reg. 28491)',
      conteoVerificado: true,
      cantidadRecibida: 15,
      precintoIntacto: true,
      precintoVerificado: 'PREC-VAL-77401',
      temperaturaLlegada: '21.4 °C',
      estadoFisico: 'CONFORME_SIN_OBSERVACIONES',
      loteVerificado: 'LT-CER-2026B',
      vencimientoVerificado: '2028-06-30',
      observaciones: '15 potes de CeraVe 453g recibidos en perfecto estado. Precinto intacto verificado.'
    }
  },
  {
    id: 4,
    codigo: 'TRA-2026-00894',
    fechaSugerencia: '2026-10-25 10:10',
    origenSucursalId: 3,
    destinoSucursalId: 1,
    medicamentoId: 106, // Panadol Antigripal NF
    cantidadSugerida: 40,
    distanciaKm: 3.1,
    prioridad: 'NORMAL',
    motivo: 'ROTACION_VENCIMIENTO',
    justificacion: 'Excedente en San Borja. Evita merma y abastece mostrador de San Isidro.',
    estado: 'PENDIENTE_APROBACION',
    ahorroEstimadoSoles: 1680.00,
    guiaSalida: null,
    guiaEntrada: null
  }
];

export let TRASLADOS_SUGERIDOS = getStoredItem(STORAGE_KEYS.TRASLADOS, DEFAULT_TRASLADOS_SUGERIDOS);

export function calcularDistanciaHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio medio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export function getSucursalesCercanas(sucursalOrigenId, medicamentoId, limit = null) {
  const origen = SUCURSALES.find(s => s.id === Number(sucursalOrigenId));
  if (!origen) return [];

  const allBranches = SUCURSALES
    .filter(s => s.id !== Number(sucursalOrigenId) && !s.esCentroDistribucion)
    .map(sucursal => {
      const distancia = calcularDistanciaHaversine(origen.lat, origen.lng, sucursal.lat, sucursal.lng);
      const invSucursal = INVENTARIO_DATA[sucursal.id] || [];
      const itemInv = invSucursal.find(item => item.medicamentoId === Number(medicamentoId));
      
      return {
        ...sucursal,
        distanciaKm: distancia,
        stock: itemInv ? itemInv.stockActual : 0,
        stockSeguridad: itemInv ? itemInv.stockSeguridad : 0,
        estadoStock: itemInv ? itemInv.estado : 'SIN_STOCK',
        diasAutonomia: itemInv ? itemInv.diasAutonomia : 0,
        lote: itemInv ? itemInv.lotePrincipal : 'N/A'
      };
    })
    .sort((a, b) => a.distanciaKm - b.distanciaKm);

  if (limit && Number(limit) > 0) {
    return allBranches.slice(0, Number(limit));
  }

  return allBranches;
}

// ==============================================================================
// GESTIÓN DINÁMICA DE PRODUCTOS, KARDEX Y AJUSTE DE STOCK (RBAC)
// ==============================================================================

// Historial auditable de Movimientos de Kardex
const DEFAULT_KARDEX_MOVIMIENTOS = [
  {
    id: 1,
    fecha: '2026-10-25 09:30',
    sucursalId: 1,
    sucursalNombre: 'InkaFarma - San Isidro Las Begonias',
    medicamentoId: 101,
    medicamentoNombre: 'Amoxidal 500 (Megalabs)',
    tipoMovimiento: 'ENTRADA_COMPRA',
    cantidad: 20,
    stockAnterior: 4,
    stockNuevo: 24,
    usuario: 'Ronny Mendoza Paucar (QF)',
    motivo: 'Recepción de pedido directo desde Laboratorio Megalabs',
    documentoSustento: 'GR-001-9821'
  },
  {
    id: 2,
    fecha: '2026-10-25 11:15',
    sucursalId: 1,
    sucursalNombre: 'InkaFarma - San Isidro Las Begonias',
    medicamentoId: 201,
    medicamentoNombre: 'CeraVe Crema Hidratante (453 g)',
    tipoMovimiento: 'ENTRADA_COMPRA',
    cantidad: 15,
    stockAnterior: 10,
    stockNuevo: 25,
    usuario: 'Ronny Mendoza Paucar (QF)',
    motivo: 'Reposición de línea dermocosmética CeraVe para campaña dermatológica',
    documentoSustento: 'FC-LOREAL-2026-08'
  },
  {
    id: 3,
    fecha: '2026-10-25 12:45',
    sucursalId: 1,
    sucursalNombre: 'InkaFarma - San Isidro Las Begonias',
    medicamentoId: 205,
    medicamentoNombre: 'Tensiómetro Digital Citizen CH-452',
    tipoMovimiento: 'AJUSTE_FISICO_POSITIVO',
    cantidad: 2,
    stockAnterior: 1,
    stockNuevo: 3,
    usuario: 'Ronny Mendoza Paucar (QF)',
    motivo: 'Ajuste por conteo físico cíclico de dispositivos médicos',
    documentoSustento: 'ACTA-INV-004'
  }
];

export let KARDEX_MOVIMIENTOS = getStoredItem(STORAGE_KEYS.KARDEX, DEFAULT_KARDEX_MOVIMIENTOS);

// Inicializar almacenamiento si no existe aún
if (typeof window !== 'undefined' && window.localStorage) {
  if (!window.localStorage.getItem(STORAGE_KEYS.INVENTARIO)) {
    setStoredItem(STORAGE_KEYS.INVENTARIO, INVENTARIO_DATA);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.MEDICAMENTOS)) {
    setStoredItem(STORAGE_KEYS.MEDICAMENTOS, MEDICAMENTOS);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.TRASLADOS)) {
    setStoredItem(STORAGE_KEYS.TRASLADOS, TRASLADOS_SUGERIDOS);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.KARDEX)) {
    setStoredItem(STORAGE_KEYS.KARDEX, KARDEX_MOVIMIENTOS);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.LOTES)) {
    setStoredItem(STORAGE_KEYS.LOTES, LOTES_CADUCIDAD);
  }
}

export function getAllProducts() {
  return MEDICAMENTOS;
}

export function addNewProduct(newProduct) {
  // Asegurar ID único
  const productWithId = {
    ...newProduct,
    id: newProduct.id || (Date.now() % 100000)
  };
  
  MEDICAMENTOS.unshift(productWithId);

  // Inicializar stock en todas las sucursales
  SUCURSALES.forEach(sucursal => {
    if (!INVENTARIO_DATA[sucursal.id]) {
      INVENTARIO_DATA[sucursal.id] = [];
    }
    const initialStock = sucursal.esCentroDistribucion ? 400 : (Number(newProduct.stockInicial) || 12);
    INVENTARIO_DATA[sucursal.id].push({
      medicamentoId: productWithId.id,
      stockActual: initialStock,
      stockSeguridad: Number(newProduct.umbralSeguridad) || 15,
      estado: initialStock > 20 ? 'OPTIMO' : (initialStock > 5 ? 'ALERTA_BAJA' : 'QUIEBRE_CRITICO'),
      lotePrincipal: 'LT-' + (newProduct.codigoEAN ? newProduct.codigoEAN.slice(-6) : '2026'),
      diasAutonomia: Math.round((initialStock / (Number(newProduct.consumoPromedioDiario) || 3.0)) * 10) / 10
    });
  });

  setStoredItem(STORAGE_KEYS.MEDICAMENTOS, MEDICAMENTOS);
  setStoredItem(STORAGE_KEYS.INVENTARIO, INVENTARIO_DATA);
  notifyDataChange();

  return productWithId;
}

export function updateExistingProduct(productId, updatedFields) {
  const index = MEDICAMENTOS.findIndex(p => p.id === Number(productId));
  if (index !== -1) {
    MEDICAMENTOS[index] = {
      ...MEDICAMENTOS[index],
      ...updatedFields
    };
    setStoredItem(STORAGE_KEYS.MEDICAMENTOS, MEDICAMENTOS);
    notifyDataChange();
    return MEDICAMENTOS[index];
  }
  return null;
}

export function adjustStockRecord(sucursalId, medicamentoId, cantidadDiferencia, tipoMovimiento, motivo, documentoSustento, usuario) {
  const sId = Number(sucursalId);
  const mId = Number(medicamentoId);
  const sucursal = SUCURSALES.find(s => s.id === sId);
  const product = MEDICAMENTOS.find(p => p.id === mId);
  
  if (!INVENTARIO_DATA[sId]) {
    INVENTARIO_DATA[sId] = [];
  }
  
  let item = INVENTARIO_DATA[sId].find(i => i.medicamentoId === mId);
  const stockAnterior = item ? item.stockActual : 0;
  const stockNuevo = Math.max(0, stockAnterior + Number(cantidadDiferencia));
  const cpd = Number(product?.consumoPromedioDiario) || 3.5;
  const umbralSeg = Number(product?.umbralSeguridad) || (item?.stockSeguridad || 15);
  
  if (item) {
    item.stockActual = stockNuevo;
    item.estado = stockNuevo > (umbralSeg * 1.5) ? 'SOBRESTOCK' : (stockNuevo > (umbralSeg * 0.4) ? 'OPTIMO' : 'QUIEBRE_CRITICO');
    item.diasAutonomia = Math.round((stockNuevo / cpd) * 10) / 10;
  } else {
    INVENTARIO_DATA[sId].push({
      medicamentoId: mId,
      stockActual: stockNuevo,
      stockSeguridad: umbralSeg,
      estado: stockNuevo > (umbralSeg * 0.4) ? 'OPTIMO' : 'QUIEBRE_CRITICO',
      lotePrincipal: 'LT-AJUSTE-' + Date.now().toString().slice(-4),
      diasAutonomia: Math.round((stockNuevo / cpd) * 10) / 10
    });
  }

  // Registrar en Kardex
  const nuevoKardex = {
    id: Date.now(),
    fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
    sucursalId: sId,
    sucursalNombre: sucursal?.nombre || `Sede ${sId}`,
    medicamentoId: mId,
    medicamentoNombre: product?.nombreComercial || `Producto ${mId}`,
    tipoMovimiento,
    cantidad: Math.abs(Number(cantidadDiferencia)),
    stockAnterior,
    stockNuevo,
    usuario: usuario || 'Químico Farmacéutico Autorizado',
    motivo: motivo || 'Ajuste de inventario en sede',
    documentoSustento: documentoSustento || 'ACTA-INT-2026'
  };

  KARDEX_MOVIMIENTOS.unshift(nuevoKardex);

  // Sincronizar inmediatamente con localStorage y notificar
  setStoredItem(STORAGE_KEYS.INVENTARIO, INVENTARIO_DATA);
  setStoredItem(STORAGE_KEYS.KARDEX, KARDEX_MOVIMIENTOS);
  notifyDataChange();

  return { stockAnterior, stockNuevo, nuevoKardex };
}

// ==============================================================================
// FLUJO Y CADENA DE CUSTODIA DE TRASLADOS FARMACÉUTICOS (SUNAT & DIGEMID)
// ==============================================================================

/**
 * 1. Crear Solicitud de Traslado interactiva con cantidad específica
 */
export function createTransferOrder({
  origenSucursalId,
  destinoSucursalId,
  medicamentoId,
  cantidadSugerida,
  motivo = 'QUIEBRE_VENTANILLA',
  justificacion = 'Reposición de stock por solicitud de ventanilla',
  prioridad = 'URGENTE',
  usuario = 'Químico Farmacéutico Responsable'
}) {
  const med = MEDICAMENTOS.find(m => m.id === Number(medicamentoId));
  const origen = SUCURSALES.find(s => s.id === Number(origenSucursalId));
  const destino = SUCURSALES.find(s => s.id === Number(destinoSucursalId));

  const distancia = origen && destino 
    ? calcularDistanciaHaversine(origen.lat, origen.lng, destino.lat, destino.lng) 
    : 2.5;

  const ahorro = (med?.precioUnitario || 35.0) * Number(cantidadSugerida);

  const newTransfer = {
    id: Date.now(),
    codigo: 'TRA-2026-' + Math.floor(10000 + Math.random() * 90000),
    fechaSugerencia: new Date().toISOString().replace('T', ' ').substring(0, 16),
    origenSucursalId: Number(origenSucursalId),
    destinoSucursalId: Number(destinoSucursalId),
    medicamentoId: Number(medicamentoId),
    cantidadSugerida: Number(cantidadSugerida),
    distanciaKm: distancia,
    prioridad,
    motivo,
    justificacion,
    estado: 'PENDIENTE_APROBACION', // Espera Guía de Salida SUNAT
    ahorroEstimadoSoles: Math.round(ahorro * 100) / 100,
    solicitadoPor: usuario,
    guiaSalida: null,
    guiaEntrada: null
  };

  TRASLADOS_SUGERIDOS.unshift(newTransfer);
  setStoredItem(STORAGE_KEYS.TRASLADOS, TRASLADOS_SUGERIDOS);
  notifyDataChange();
  return newTransfer;
}

/**
 * 2. Despachar Traslado desde Sede Origen:
 * Emite Guía de Remisión Electrónica de Salida (GRE Remitente SUNAT con QR),
 * asigna precinto de seguridad, conductor, y descuenta el stock en la sede origen.
 */
export function dispatchTransferOrder(transferId, dispatchData = {}) {
  const transfer = TRASLADOS_SUGERIDOS.find(t => t.id === Number(transferId));
  if (!transfer) return null;

  const med = MEDICAMENTOS.find(m => m.id === transfer.medicamentoId);
  const origen = SUCURSALES.find(s => s.id === transfer.origenSucursalId);
  
  const numeroGuia = dispatchData.numeroGuia || `T001-${String(Math.floor(10000000 + Math.random() * 90000000))}`;
  const precinto = dispatchData.precintoSeguridad || `PREC-SEC-${Math.floor(10000 + Math.random() * 90000)}`;

  const guiaSalida = {
    numeroGuia,
    codigoHashSunat: (Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 10)).toUpperCase(),
    fechaEmision: new Date().toISOString().replace('T', ' ').substring(0, 16),
    conductor: dispatchData.conductor || 'Carlos Mendoza Quispe',
    licenciaConducir: dispatchData.licenciaConducir || 'Q-45892110',
    placaVehiculo: dispatchData.placaVehiculo || 'BCV-912',
    marcaVehiculo: dispatchData.marcaVehiculo || 'Mercedes-Benz Sprinter Furgón Isotérmico',
    precintoSeguridad: precinto,
    temperaturaDespacho: dispatchData.temperaturaDespacho || '20.5 °C',
    bultosTotales: 1,
    pesoBrutoKg: Math.round((transfer.cantidadSugerida * 0.25) * 10) / 10,
    despachadoPor: dispatchData.despachadoPor || `QF Director Técnico (${origen?.nombre || 'Sede Origen'})`
  };

  transfer.estado = 'EN_TRANSITO';
  transfer.guiaSalida = guiaSalida;

  // Descontar stock de la sede origen formalmente en Kardex
  adjustStockRecord(
    transfer.origenSucursalId,
    transfer.medicamentoId,
    -transfer.cantidadSugerida,
    'SALIDA_TRASLADO_INTERNO',
    `Despacho por traslado hacia ${transfer.destinoSucursalId} bajo GRE ${numeroGuia}`,
    numeroGuia,
    guiaSalida.despachadoPor
  );

  setStoredItem(STORAGE_KEYS.TRASLADOS, TRASLADOS_SUGERIDOS);
  notifyDataChange();

  return transfer;
}

/**
 * 3. Recepcionar Traslado en Sede Destino:
 * Inspección física conforme a DIGEMID BPA (Buenas Prácticas de Almacenamiento),
 * verificación de precinto, generación de Guía de Entrada / Acta de Recepción Conforme,
 * y sumatoria formal del stock al inventario de la sede receptora.
 */
export function receiveTransferOrder(transferId, receiveData = {}) {
  const transfer = TRASLADOS_SUGERIDOS.find(t => t.id === Number(transferId));
  if (!transfer) return null;

  const destino = SUCURSALES.find(s => s.id === transfer.destinoSucursalId);
  const numeroActa = `ACTA-BPA-2026-${String(Math.floor(10000 + Math.random() * 90000))}`;
  const numeroGuiaEntrada = `GE-001-${String(Math.floor(1000000 + Math.random() * 9000000))}`;

  const guiaEntrada = {
    numeroActaRecepcion: numeroActa,
    numeroGuiaEntrada,
    fechaRecepcion: new Date().toISOString().replace('T', ' ').substring(0, 16),
    qfReceptor: receiveData.qfReceptor || 'Ronny Fernando Mendoza Paucar (QF Reg. 28491)',
    conteoVerificado: true,
    cantidadRecibida: transfer.cantidadSugerida,
    precintoIntacto: true,
    precintoVerificado: transfer.guiaSalida?.precintoSeguridad || 'PREC-INTACTO',
    temperaturaLlegada: receiveData.temperaturaLlegada || '21.2 °C',
    estadoFisico: 'CONFORME_SIN_OBSERVACIONES',
    loteVerificado: 'LT-CONF-' + new Date().getFullYear(),
    vencimientoVerificado: '2028-12-31',
    observaciones: receiveData.observaciones || `Recepción conforme de ${transfer.cantidadSugerida} cajas según Guía de Salida ${transfer.guiaSalida?.numeroGuia || 'GRE'}. Conteo y precinto intacto verificado conforme a Manual BPA DIGEMID.`
  };

  transfer.estado = 'RECEPCIONADO_CONFORME';
  transfer.guiaEntrada = guiaEntrada;

  // Sumar stock en la sede destino formalmente en Kardex
  adjustStockRecord(
    transfer.destinoSucursalId,
    transfer.medicamentoId,
    transfer.cantidadSugerida,
    'ENTRADA_TRASLADO_INTERNO',
    `Recepción de traslado desde sede ${transfer.origenSucursalId} bajo Acta ${numeroActa}`,
    numeroGuiaEntrada,
    guiaEntrada.qfReceptor
  );

  setStoredItem(STORAGE_KEYS.TRASLADOS, TRASLADOS_SUGERIDOS);
  notifyDataChange();

  return transfer;
}

/**
 * 4. Rechazar Solicitud de Traslado:
 * Registra formalmente el rechazo y persiste en el historial.
 */
export function rejectTransferOrder(transferId, motivoRechazo = 'Rechazado por criterio farmacéutico') {
  const transfer = TRASLADOS_SUGERIDOS.find(t => t.id === Number(transferId));
  if (!transfer) return null;

  transfer.estado = 'RECHAZADO';
  transfer.motivoRechazo = motivoRechazo;

  setStoredItem(STORAGE_KEYS.TRASLADOS, TRASLADOS_SUGERIDOS);
  notifyDataChange();

  return transfer;
}

/**
 * 5. Ejecutar Traslado Express Inmediato:
 * Crea, emite GRE SUNAT, asigna precinto y aplica la entrada física en destino al instante.
 * Ajusta formalmente el inventario de ambas sucursales y persiste inmediatamente en localStorage.
 */
export function executeDirectTransfer({
  origenSucursalId,
  destinoSucursalId,
  medicamentoId,
  cantidadSugerida,
  motivo = 'QUIEBRE_VENTANILLA',
  justificacion = 'Traslado express inmediato por quiebre de stock en ventanilla',
  prioridad = 'URGENTE',
  usuario = 'Químico Farmacéutico Responsable'
}) {
  const oId = Number(origenSucursalId);
  const dId = Number(destinoSucursalId);
  const mId = Number(medicamentoId);
  const qty = Number(cantidadSugerida);

  const med = MEDICAMENTOS.find(m => m.id === mId);
  const origen = SUCURSALES.find(s => s.id === oId);
  const destino = SUCURSALES.find(s => s.id === dId);

  const distancia = origen && destino 
    ? calcularDistanciaHaversine(origen.lat, origen.lng, destino.lat, destino.lng) 
    : 2.5;

  const ahorro = (med?.precioUnitario || 35.0) * qty;
  const numeroGuia = T001-;
  const numeroActa = ACTA-BPA-2026-;
  const numeroGuiaEntrada = GE-001-;
  const precinto = PREC-SEC-;

  const guiaSalida = {
    numeroGuia,
    codigoHashSunat: (Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 10)).toUpperCase(),
    fechaEmision: new Date().toISOString().replace('T', ' ').substring(0, 16),
    conductor: 'Carlos Mendoza Quispe',
    licenciaConducir: 'Q-45892110',
    placaVehiculo: 'BCV-912',
    marcaVehiculo: 'Mercedes-Benz Sprinter Furgón Isotérmico',
    precintoSeguridad: precinto,
    temperaturaDespacho: '20.5 °C',
    bultosTotales: 1,
    pesoBrutoKg: Math.round((qty * 0.25) * 10) / 10,
    despachadoPor: QF Director Técnico ()
  };

  const guiaEntrada = {
    numeroActaRecepcion: numeroActa,
    numeroGuiaEntrada,
    fechaRecepcion: new Date().toISOString().replace('T', ' ').substring(0, 16),
    qfReceptor: usuario,
    conteoVerificado: true,
    cantidadRecibida: qty,
    precintoIntacto: true,
    precintoVerificado: precinto,
    temperaturaLlegada: '21.0 °C',
    estadoFisico: 'CONFORME_SIN_OBSERVACIONES',
    loteVerificado: 'LT-CONF-' + new Date().getFullYear(),
    vencimientoVerificado: '2028-12-31',
    observaciones: Traslado express de  cajas de  transferidas exitosamente desde  hacia .
  };

  const completedTransfer = {
    id: Date.now(),
    codigo: 'TRA-2026-' + Math.floor(10000 + Math.random() * 90000),
    fechaSugerencia: new Date().toISOString().replace('T', ' ').substring(0, 16),
    origenSucursalId: oId,
    destinoSucursalId: dId,
    medicamentoId: mId,
    cantidadSugerida: qty,
    distanciaKm: distancia,
    prioridad,
    motivo,
    justificacion,
    estado: 'RECEPCIONADO_CONFORME',
    ahorroEstimadoSoles: Math.round(ahorro * 100) / 100,
    solicitadoPor: usuario,
    guiaSalida,
    guiaEntrada
  };

  // 1. Descontar stock en sede origen
  adjustStockRecord(
    oId,
    mId,
    -qty,
    'SALIDA_TRASLADO_INTERNO',
    Despacho express hacia  bajo GRE ,
    numeroGuia,
    guiaSalida.despachadoPor
  );

  // 2. Sumar stock en sede destino
  adjustStockRecord(
    dId,
    mId,
    qty,
    'ENTRADA_TRASLADO_INTERNO',
    Recepción express desde  bajo Acta ,
    numeroGuiaEntrada,
    guiaEntrada.qfReceptor
  );

  // 3. Registrar en historial de traslados
  TRASLADOS_SUGERIDOS.unshift(completedTransfer);
  setStoredItem(STORAGE_KEYS.TRASLADOS, TRASLADOS_SUGERIDOS);

  // 4. Persistir estado de inventario global y notificar a componentes reactivos
  setStoredItem(STORAGE_KEYS.INVENTARIO, INVENTARIO_DATA);
  setStoredItem(STORAGE_KEYS.KARDEX, KARDEX_MOVIMIENTOS);
  notifyDataChange();

  return completedTransfer;
}
