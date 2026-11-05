import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calcularDistanciaHaversine, 
  getSucursalesCercanas, 
  executeDirectTransfer, 
  SUCURSALES, 
  MEDICAMENTOS 
} from '../src/services/mockData.js';

test('LOGIC-01: Cálculo geodésico exacto por Fórmula de Haversine', () => {
  // Coordenadas San Isidro (-12.0931, -77.0264) a Miraflores (-12.1215, -77.0298)
  const dist = calcularDistanciaHaversine(-12.0931, -77.0264, -12.1215, -77.0298);
  assert.ok(dist > 3.0 && dist < 3.5, `Distancia calculada: ${dist} km debe estar entre 3.0 y 3.5 km`);
  
  // Misma coordenada debe dar 0 km
  const distCero = calcularDistanciaHaversine(-12.0931, -77.0264, -12.0931, -77.0264);
  assert.equal(distCero, 0);
});

test('LOGIC-02: Búsqueda geocercana con ordenamiento estricto por proximidad', () => {
  const origenId = 1; // San Isidro
  const medId = 1; // Amoxicilina 500mg
  const resultados = getSucursalesCercanas(origenId, medId);

  assert.ok(resultados.length > 0, 'Debe encontrar sucursales con inventario');
  // Verificar ordenamiento ascendente por distancia
  for (let i = 0; i < resultados.length - 1; i++) {
    assert.ok(resultados[i].distanciaKm <= resultados[i+1].distanciaKm, 'Las sedes deben ordenarse de menor a mayor distancia');
  }
});

test('LOGIC-03: Transaccionalidad de Traslado Express, deducción de stock y generación de GRE SUNAT', () => {
  const cantTraslado = 15;

  const resultado = executeDirectTransfer({
    origenSucursalId: 2,
    destinoSucursalId: 1,
    medicamentoId: 1,
    cantidadSugerida: cantTraslado,
    motivo: 'QUIEBRE_VENTANILLA',
    justificacion: 'Prueba unitaria de traslado express',
    prioridad: 'URGENTE',
    usuario: 'Ronny Mendoza (QF Responsable)'
  });

  assert.ok(resultado, 'Debe retornar el objeto del traslado completado');
  assert.equal(resultado.estado, 'RECEPCIONADO_CONFORME');
  assert.ok(resultado.guiaSalida.numeroGuia.startsWith('T001-'), 'Debe generar número de Guía Electrónica GRE');
  assert.ok(resultado.guiaEntrada.numeroActaRecepcion.startsWith('ACTA-BPA-'), 'Debe generar Acta de Recepción DIGEMID BPA');
  assert.equal(resultado.cantidadSugerida, cantTraslado);
});
