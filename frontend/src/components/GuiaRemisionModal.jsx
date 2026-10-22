import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  FileText, 
  Truck, 
  Thermometer, 
  Lock, 
  Calendar, 
  AlertCircle,
  Building2,
  ClipboardCheck,
  Check
} from 'lucide-react';
import { SUCURSALES, MEDICAMENTOS } from '../services/mockData';

export default function GuiaRemisionModal({ traslado, initialTab = 'salida', onClose }) {
  const [activeDocTab, setActiveDocTab] = useState('salida');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (traslado) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [traslado, onClose]);

  useEffect(() => {
    if (traslado) {
      setActiveDocTab(traslado.estado === 'RECEPCIONADO_CONFORME' && initialTab === 'entrada' ? 'entrada' : 'salida');
    }
  }, [traslado, initialTab]);

  if (!traslado) return null;

  const origen = SUCURSALES.find(s => s.id === traslado.origenSucursalId);
  const destino = SUCURSALES.find(s => s.id === traslado.destinoSucursalId);
  const med = MEDICAMENTOS.find(m => m.id === traslado.medicamentoId);

  const fechaHoy = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Datos Guía de Salida SUNAT
  const guiaSalida = traslado.guiaSalida || {
    numeroGuia: `T001-${String(traslado.id).padStart(8, '0')}`,
    codigoHashSunat: '4A8F9C1B7E3D2A5581E',
    fechaEmision: traslado.fechaSugerencia || fechaHoy,
    conductor: 'Carlos Mendoza Quispe',
    licenciaConducir: 'Q-45892110',
    placaVehiculo: 'BCV-912',
    marcaVehiculo: 'Mercedes-Benz Sprinter Furgón Isotérmico',
    precintoSeguridad: 'PREC-SEC-88219',
    temperaturaDespacho: '20.5 °C',
    bultosTotales: 1,
    pesoBrutoKg: (traslado.cantidadSugerida * 0.25).toFixed(1),
    despachadoPor: `QF Director Técnico (${origen?.nombre || 'Sede Origen'})`
  };

  // Datos Guía de Entrada / Acta DIGEMID
  const guiaEntrada = traslado.guiaEntrada || (traslado.estado === 'RECEPCIONADO_CONFORME' ? {
    numeroActaRecepcion: `ACTA-BPA-2026-${String(traslado.id).padStart(5, '0')}`,
    numeroGuiaEntrada: `GE-001-${String(traslado.id).padStart(7, '0')}`,
    fechaRecepcion: fechaHoy,
    qfReceptor: 'Ronny Fernando Mendoza Paucar (QF Reg. 28491)',
    conteoVerificado: true,
    cantidadRecibida: traslado.cantidadSugerida,
    precintoIntacto: true,
    precintoVerificado: guiaSalida.precintoSeguridad,
    temperaturaLlegada: '21.2 °C',
    estadoFisico: 'CONFORME_SIN_OBSERVACIONES',
    loteVerificado: 'LT-CONF-2026',
    vencimientoVerificado: '2028-12-31',
    observaciones: 'Recepción técnica y física conforme. Cajas íntegras y selladas según Manual BPA DIGEMID.'
  } : null);

  const isDermocosmetic = med?.categoria?.includes('Dermo') || med?.categoria?.includes('Higiene');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200 my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar con Selector de Documento (Salida SUNAT vs Entrada DIGEMID) */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Cadena de Custodia Farmacéutica • R.S. SUNAT & BPA DIGEMID</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Expediente Digital de Traslado: {traslado.codigo}
            </h2>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Pestañas de Documentos Oficiales */}
            <div className="bg-slate-800/90 p-1 rounded-xl flex items-center space-x-1 border border-slate-700">
              <button
                onClick={() => setActiveDocTab('salida')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                  activeDocTab === 'salida' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. Guía Salida (SUNAT)</span>
              </button>
              <button
                onClick={() => setActiveDocTab('entrada')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                  activeDocTab === 'entrada' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>2. Guía Entrada (DIGEMID)</span>
                {guiaEntrada && <Check className="w-3 h-3 text-emerald-300" />}
              </button>
            </div>

            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-slate-50/50" id="printable-guia">
          
          {/* =========================================================================
              DOCUMENTO 1: GUÍA DE REMISIÓN ELECTRÓNICA REMITENTE (SALIDA SUNAT)
              ========================================================================= */}
          {activeDocTab === 'salida' && (
            <div className="bg-white rounded-2xl border-2 border-slate-300 p-6 sm:p-8 space-y-6 shadow-sm">
              
              {/* Header SUNAT Oficial */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b-2 border-slate-900">
                <div className="md:col-span-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-black text-blue-950 tracking-tight">FARMACIAS PERUANAS S.A.</span>
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <strong>RUC:</strong> 20509872134<br />
                    <strong>Dirección Fiscal:</strong> Av. Guardia Civil Nro. 1321, Urb. Corpac, San Borja, Lima<br />
                    <strong>Cadenas Operativas:</strong> InkaFarma &amp; Mifarma (Cadena Farmacéutica Nacional)
                  </div>
                </div>

                <div className="border-2 border-slate-900 rounded-2xl p-4 text-center bg-slate-50/80 flex flex-col justify-center space-y-1">
                  <div className="text-xs font-bold text-slate-700">R.U.C. 20509872134</div>
                  <div className="text-xs font-black text-blue-950 uppercase tracking-wide">
                    GUÍA DE REMISIÓN ELECTRÓNICA REMITENTE
                  </div>
                  <div className="text-base font-black text-red-600 font-mono tracking-wider">
                    N° {guiaSalida.numeroGuia}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    Autorizado por R.S. N° 000123-2022/SUNAT
                  </div>
                </div>
              </div>

              {/* Puntos de Partida y Llegada */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-blue-800 font-black uppercase text-[11px]">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>PUNTO DE PARTIDA (SEDE ORIGEN / DESPACHANTE):</span>
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">{origen?.nombre}</div>
                  <div className="text-slate-600">{origen?.direccion}</div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Distrito: <strong className="text-slate-800">{origen?.distrito}</strong> • Cadena: {origen?.marca}
                  </div>
                </div>

                <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4">
                  <div className="flex items-center space-x-1.5 text-emerald-800 font-black uppercase text-[11px]">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>PUNTO DE LLEGADA (SEDE DESTINO / RECEPTORA):</span>
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">{destino?.nombre}</div>
                  <div className="text-slate-600">{destino?.direccion}</div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Distrito: <strong className="text-slate-800">{destino?.distrito}</strong> • Cadena: {destino?.marca}
                  </div>
                </div>
              </div>

              {/* Datos de Transporte y Traslado */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 font-semibold uppercase text-[10px] block">Fecha de Emisión:</span>
                  <div className="font-black text-slate-900 font-mono mt-0.5">{guiaSalida.fechaEmision}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold uppercase text-[10px] block">Motivo Traslado SUNAT:</span>
                  <div className="font-bold text-blue-900 mt-0.5">{traslado.motivo.replace(/_/g, ' ')}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold uppercase text-[10px] block">Modalidad de Transporte:</span>
                  <div className="font-bold text-slate-900 mt-0.5">Transporte Privado Express</div>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold uppercase text-[10px] block">Distancia &amp; Tiempo:</span>
                  <div className="font-black text-emerald-700 font-mono mt-0.5">{traslado.distanciaKm} km (~18 min)</div>
                </div>
              </div>

              {/* Datos del Vehículo y Conductor */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs p-3.5 bg-blue-50/60 rounded-xl border border-blue-200">
                <div>
                  <span className="text-blue-900 font-bold uppercase text-[10px] block">Conductor / Chofer:</span>
                  <div className="font-extrabold text-slate-900">{guiaSalida.conductor}</div>
                  <div className="text-[10px] text-slate-600 font-mono">Brevete: {guiaSalida.licenciaConducir}</div>
                </div>
                <div>
                  <span className="text-blue-900 font-bold uppercase text-[10px] block">Vehículo y Placa:</span>
                  <div className="font-extrabold text-slate-900">{guiaSalida.placaVehiculo}</div>
                  <div className="text-[10px] text-slate-600 truncate">{guiaSalida.marcaVehiculo}</div>
                </div>
                <div>
                  <span className="text-blue-900 font-bold uppercase text-[10px] block">Precinto de Valija &amp; Temperatura:</span>
                  <div className="font-mono font-black text-blue-950 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-blue-700" />
                    <span>{guiaSalida.precintoSeguridad}</span>
                  </div>
                  <div className="text-[10px] text-slate-600 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-emerald-600" />
                    <span>Temp. Despacho: <strong>{guiaSalida.temperaturaDespacho}</strong></span>
                  </div>
                </div>
              </div>

              {/* Tabla de Productos Despachados */}
              <div className="border-2 border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-900 text-white font-extrabold uppercase text-[11px]">
                    <tr>
                      <th className="px-3 py-2.5 text-center">Ítem</th>
                      <th className="px-3 py-2.5 text-left">Código EAN</th>
                      <th className="px-4 py-2.5 text-left">Descripción del Producto / Fármaco</th>
                      <th className="px-3 py-2.5 text-left">Registro Sanitario / NSO</th>
                      <th className="px-3 py-2.5 text-center">Lote</th>
                      <th className="px-3 py-2.5 text-right">Cant. Cajas</th>
                      <th className="px-3 py-2.5 text-right">Valor Ref.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    <tr>
                      <td className="px-3 py-3 text-center font-mono font-bold text-slate-500">01</td>
                      <td className="px-3 py-3 font-mono font-semibold text-slate-700">{med?.codigoEAN}</td>
                      <td className="px-4 py-3">
                        <div className="font-black text-slate-900 text-sm">{med?.nombreComercial}</div>
                        <div className="text-[11px] text-slate-600 font-medium">
                          {med?.principioActivo} • {med?.formaFarmaceutica || med?.presentacion}
                        </div>
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-slate-700">
                        {med?.registroSanitario}
                      </td>
                      <td className="px-3 py-3 text-center font-mono font-bold text-slate-800">
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          LT-AUT-2026
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-mono font-black text-blue-950 text-base">
                        {traslado.cantidadSugerida} cjs
                      </td>
                      <td className="px-3 py-3 text-right font-mono font-extrabold text-slate-800">
                        S/ {(med?.precioUnitario * traslado.cantidadSugerida).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* QR y Firmas de Salida */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t-2 border-slate-200 items-center">
                <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="w-16 h-16 bg-slate-900 flex items-center justify-center rounded-xl text-white shrink-0">
                    <QrCode className="w-12 h-12 text-cyan-300" />
                  </div>
                  <div className="text-[10px] text-slate-600 leading-tight">
                    <strong className="text-slate-900">Hash Digital SUNAT:</strong><br />
                    <span className="font-mono text-[9px] break-all font-bold text-blue-900">{guiaSalida.codigoHashSunat}</span><br />
                    <span>Comprobante validado electrónicamente en OSE Farmacias Peruanas.</span>
                  </div>
                </div>

                <div className="text-center border-t border-dashed border-slate-400 pt-3">
                  <div className="text-xs font-black text-slate-900">Despacho Farmacéutico</div>
                  <div className="text-[10px] text-slate-600">{guiaSalida.despachadoPor}</div>
                  <div className="text-[9px] text-slate-400">Colegio Químico Farmacéutico del Perú</div>
                </div>

                <div className="text-center border-t border-dashed border-slate-400 pt-3">
                  <div className="text-xs font-black text-slate-900">Transporte y Valija</div>
                  <div className="text-[10px] text-slate-600">{guiaSalida.conductor}</div>
                  <div className="text-[9px] text-slate-400">Placa: {guiaSalida.placaVehiculo} • Precinto: {guiaSalida.precintoSeguridad}</div>
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              DOCUMENTO 2: GUÍA DE ENTRADA Y ACTA DE RECEPCIÓN CONFORME (DIGEMID BPA)
              ========================================================================= */}
          {activeDocTab === 'entrada' && (
            <div className="bg-white rounded-2xl border-2 border-emerald-500 p-6 sm:p-8 space-y-6 shadow-sm">
              
              {/* Header DIGEMID Oficial */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b-2 border-emerald-800">
                <div className="md:col-span-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-black text-emerald-950 tracking-tight">ACTA DE RECEPCIÓN TÉCNICA</span>
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <strong>Normativa:</strong> D.S. N° 014-2011-SA &amp; R.M. N° 833-2015/MINSA (Manual de BPA - DIGEMID)<br />
                    <strong>Establecimiento Farmacéutico Receptor:</strong> {destino?.nombre}<br />
                    <strong>Dirección:</strong> {destino?.direccion}, {destino?.distrito}
                  </div>
                </div>

                <div className="border-2 border-emerald-700 rounded-2xl p-4 text-center bg-emerald-50/70 flex flex-col justify-center space-y-1">
                  <div className="text-xs font-bold text-emerald-800">DIGEMID • CONTROL DE CALIDAD BPA</div>
                  <div className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                    ACTA DE RECEPCIÓN Y CONFORMIDAD
                  </div>
                  <div className="text-base font-black text-emerald-700 font-mono tracking-wider">
                    {guiaEntrada ? guiaEntrada.numeroActaRecepcion : 'PENDIENTE DE RECEPCIÓN'}
                  </div>
                  <div className="text-[10px] text-slate-600 font-medium">
                    Guía Entrada: {guiaEntrada ? guiaEntrada.numeroGuiaEntrada : 'EN TRÁNSITO'}
                  </div>
                </div>
              </div>

              {!guiaEntrada ? (
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-amber-500/20 text-amber-800 rounded-full flex items-center justify-center mx-auto">
                    <Truck className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-base font-black text-amber-950">
                    Cargamento en Ruta • Pendiente de Arribo e Inspección Física
                  </h3>
                  <p className="text-xs text-amber-900 max-w-lg mx-auto">
                    La Guía de Salida SUNAT ya fue emitida y el furgón se encuentra en tránsito con el precinto <strong>{guiaSalida.precintoSeguridad}</strong>. Al arribar a la sede {destino?.nombre}, el Químico Farmacéutico realizará la verificación física y emitirá esta acta oficial.
                  </p>
                </div>
              ) : (
                <>
                  {/* Sede Receptora y Referencia de Salida */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div>
                      <span className="font-black text-slate-500 uppercase text-[10px] block">Guía de Salida de Referencia:</span>
                      <div className="font-extrabold text-blue-900 text-sm mt-0.5">{guiaSalida.numeroGuia}</div>
                      <div className="text-slate-600">Procedencia: <strong>{origen?.nombre}</strong></div>
                      <div className="text-slate-500 text-[11px]">Distancia recorrida: {traslado.distanciaKm} km</div>
                    </div>
                    <div>
                      <span className="font-black text-slate-500 uppercase text-[10px] block">Fecha y Hora de Recepción:</span>
                      <div className="font-black text-slate-900 text-sm font-mono mt-0.5">{guiaEntrada.fechaRecepcion}</div>
                      <div className="text-slate-600">Director Técnico Receptor: <strong>{guiaEntrada.qfReceptor}</strong></div>
                      <div className="text-emerald-700 text-[11px] font-bold">Estado: APROBADO CONFORME</div>
                    </div>
                  </div>

                  {/* Checklist de Evaluación Técnica DIGEMID (BPA) */}
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-slate-800 tracking-wider block">
                      Evaluación Organoléptica y Protocolo de Ingreso a Inventario (BPA):
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-950 block">1. Precinto de Seguridad Intacto</strong>
                          <span className="text-slate-600 text-[11px]">
                            Precinto <strong>{guiaEntrada.precintoVerificado}</strong> cotejado y sin signos de alteración o rotura.
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-950 block">2. Conteo Físico Conforme</strong>
                          <span className="text-slate-600 text-[11px]">
                            Se recibieron exactamente <strong>{guiaEntrada.cantidadRecibida} cajas</strong> declaradas en la guía de salida.
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-950 block">3. Temperatura al Arribo</strong>
                          <span className="text-slate-600 text-[11px]">
                            Lectura termométrica: <strong>{guiaEntrada.temperaturaLlegada}</strong> (Dentro del rango normativo 15°C - 25°C).
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-950 block">4. Lote &amp; Caducidad Validados</strong>
                          <span className="text-slate-600 text-[11px]">
                            Lote <strong>{guiaEntrada.loteVerificado}</strong> con vencimiento <strong>{guiaEntrada.vencimientoVerificado}</strong> (&gt;180 días).
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detalle del Producto Ingresado a Kardex */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <table className="min-w-full divide-y divide-slate-200 text-xs">
                      <thead className="bg-slate-100 text-slate-800 font-extrabold uppercase text-[11px]">
                        <tr>
                          <th className="px-3 py-2 text-left">Código</th>
                          <th className="px-4 py-2 text-left">Producto Recibido</th>
                          <th className="px-3 py-2 text-center">Lote Verificado</th>
                          <th className="px-3 py-2 text-right">Cant. Cajas</th>
                          <th className="px-3 py-2 text-center">Dictamen</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr>
                          <td className="px-3 py-3 font-mono text-slate-700">{med?.codigoEAN}</td>
                          <td className="px-4 py-3">
                            <div className="font-black text-slate-900">{med?.nombreComercial}</div>
                            <div className="text-[11px] text-slate-500">{med?.principioActivo} • {med?.registroSanitario}</div>
                          </td>
                          <td className="px-3 py-3 text-center font-mono font-bold text-slate-800">
                            {guiaEntrada.loteVerificado}
                          </td>
                          <td className="px-3 py-3 text-right font-mono font-black text-emerald-700 text-sm">
                            +{guiaEntrada.cantidadRecibida} cjs
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-full font-black text-[10px] uppercase border border-emerald-300">
                              CONFORME BPA
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Observaciones y Firma del QF Receptor */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                    <strong className="text-slate-900">Observaciones Técnicas:</strong> {guiaEntrada.observaciones}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 items-center">
                    <div className="text-xs text-slate-500">
                      <strong>Registro Oficial de Entrada:</strong> Este documento acredita el ingreso contable y físico al inventario de {destino?.nombre}, blindando la cadena de custodia y evitando pérdidas o mermas no registradas.
                    </div>

                    <div className="text-center border-t border-dashed border-slate-400 pt-3">
                      <div className="text-xs font-black text-emerald-950">{guiaEntrada.qfReceptor}</div>
                      <div className="text-[10px] text-slate-600">Director Técnico / Químico Farmacéutico Responsable</div>
                      <div className="text-[9px] text-slate-400">Colegio Químico Farmacéutico del Perú • Farmacias Peruanas S.A.</div>
                    </div>
                  </div>
                </>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="bg-slate-100 px-5 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
          <div className="text-xs text-slate-600 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Documentos válidos bajo R.S. N° 000123-2022/SUNAT y Manual BPA DIGEMID</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Documento</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
