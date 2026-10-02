import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  Barcode, 
  Printer, 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ArrowUpDown, 
  ExternalLink, 
  Cloud, 
  Layers, 
  FileText, 
  DollarSign, 
  Thermometer, 
  Calendar,
  Tag,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  SUCURSALES, 
  INVENTARIO_DATA, 
  LOTES_CADUCIDAD, 
  KARDEX_MOVIMIENTOS,
  CLOUDFLARE_R2_CONFIG,
  getMedicineImageUrl,
  calcularDistanciaHaversine
} from '../services/mockData';

export default function ProductDetailModal({ 
  product, 
  currentBranch, 
  isOpen, 
  onClose, 
  onOpenTransfer, 
  onOpenStockAdjust 
}) {
  const [activeTab, setActiveTab] = useState('multisede'); // 'multisede' | 'lotes' | 'kardex' | 'etiqueta'

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  // Stock en la sede actual
  const currentInvList = INVENTARIO_DATA[currentBranch.id] || [];
  const currentItem = currentInvList.find(i => i.medicamentoId === product.id);
  const currentStock = currentItem ? currentItem.stockActual : 0;
  const currentStatus = currentItem ? currentItem.estado : 'SIN_STOCK';

  // Stock en todas las sedes con distancia respecto a la sede activa
  const branchStocks = SUCURSALES.map(suc => {
    const inv = INVENTARIO_DATA[suc.id] || [];
    const item = inv.find(i => i.medicamentoId === product.id);
    const stock = item ? item.stockActual : 0;
    const distancia = calcularDistanciaHaversine(currentBranch.lat, currentBranch.lng, suc.lat, suc.lng);
    return {
      ...suc,
      stock,
      distanciaKm: distancia,
      estadoStock: item ? item.estado : 'SIN_STOCK',
      diasAutonomia: item ? item.diasAutonomia : 0,
      lote: item ? item.lotePrincipal : 'N/A'
    };
  });

  const totalNationalStock = branchStocks.reduce((acc, b) => acc + b.stock, 0);

  // Lotes específicos de este producto
  const productLots = LOTES_CADUCIDAD.filter(l => l.medicamentoId === product.id);

  // Kardex específico de este producto
  const productKardex = KARDEX_MOVIMIENTOS.filter(k => k.medicamentoId === product.id);

  const isDermocosmetic = product.categoria?.includes('Dermo') || product.categoria?.includes('Higiene') || product.categoria?.includes('Dispositivos');
  const isMarca = product.tipoProducto === 'MARCA';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200 my-auto flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar con Gradiente y Acciones */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/20 text-cyan-300 rounded-2xl border border-blue-400/30 shrink-0">
              <Package className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                  isMarca ? 'bg-purple-900/80 text-purple-200 border border-purple-700' : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                }`}>
                  {product.marcaComercial || (isMarca ? 'Marca Comercial' : 'Genérico DCI')}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-900/80 text-cyan-200 border border-blue-700">
                  {product.categoria}
                </span>
                {product.requiereReceta ? (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-900/80 text-amber-200 border border-amber-700">
                    Bajo Receta Médica
                  </span>
                ) : (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-teal-900/80 text-teal-200 border border-teal-700">
                    Venta Libre (OTC)
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {product.nombreComercial}
              </h2>
              <p className="text-xs text-slate-300">
                Ficha Técnica Integral 360° • Registro DIGEMID {product.registroSanitario}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-center">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700 cursor-pointer"
              title="Imprimir Ficha Técnica Oficial"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cuerpo del Modal con Información 360° */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6" id="printable-ficha">
          
          {/* Ficha Resumen: Grid de 3 Columnas (Foto & Empaque / Datos Regulatorios / Métricas Stock) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            
            {/* Columna 1: Empaque & Cloudflare R2 (4 cols) */}
            <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-between space-y-3 text-center">
              <div className="w-full aspect-square max-w-[200px] bg-white rounded-2xl border border-slate-200 p-2 flex items-center justify-center overflow-hidden shadow-xs relative">
                <img
                  src={getMedicineImageUrl(product)}
                  alt={product.nombreComercial}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-xs">
                  R2 Cloud
                </span>
              </div>

              {/* Código de Barras EAN-13 Simulado */}
              <div className="w-full bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                  Código de Barras EAN-13
                </span>
                {/* Barras SVG */}
                <div className="flex justify-center items-center space-x-0.5 py-1">
                  {[3,1,4,1,2,3,1,4,2,1,3,2,4,1,2,3,1,4,2,3,1,2,4,1,3].map((w, idx) => (
                    <div 
                      key={idx} 
                      className={`bg-slate-900 h-9 rounded-xs ${idx % 2 === 0 ? 'opacity-100' : 'opacity-80'}`}
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
                <div className="font-mono font-black text-xs text-slate-900 tracking-widest">
                  {product.codigoEAN || '775098765001'}
                </div>
              </div>

              {/* Enlace Bucket R2 */}
              <a
                href={CLOUDFLARE_R2_CONFIG.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300 transition w-full justify-center"
              >
                <Cloud className="w-3.5 h-3.5 text-amber-600" />
                <span className="truncate">R2: /{product.imagenR2 || 'empaque.webp'}</span>
                <ExternalLink className="w-3 h-3 text-amber-700" />
              </a>
            </div>

            {/* Columna 2: Ficha Técnica Regulatoria DIGEMID (5 cols) */}
            <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-black uppercase text-blue-900 tracking-wider flex items-center gap-1 mb-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Especificaciones Técnicas &amp; DIGEMID</span>
                </span>

                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <dt className="text-slate-500 font-semibold">Principio Activo:</dt>
                    <dd className="font-black text-slate-900 text-right">{product.principioActivo}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <dt className="text-slate-500 font-semibold">Laboratorio Fabricante:</dt>
                    <dd className="font-bold text-slate-800 text-right">{product.laboratorio}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <dt className="text-slate-500 font-semibold">Concentración / Fórmula:</dt>
                    <dd className="font-bold text-slate-800 text-right">{product.concentracion || 'Fórmula Estándar'}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <dt className="text-slate-500 font-semibold">Forma Farmacéutica:</dt>
                    <dd className="font-bold text-slate-800 text-right">{product.formaFarmaceutica || product.presentacion}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <dt className="text-slate-500 font-semibold">Presentación Comercial:</dt>
                    <dd className="font-bold text-slate-800 text-right">{product.presentacion}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <dt className="text-slate-500 font-semibold">Registro DIGEMID / NSO:</dt>
                    <dd className="font-mono font-black text-blue-950 text-right">{product.registroSanitario}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-slate-500 font-semibold">Cajas por Bulto:</dt>
                    <dd className="font-mono font-bold text-slate-800 text-right">{product.cajasPorBulto || 24} cajas / fardo</dd>
                  </div>
                </dl>
              </div>

              {/* Conservación y Almacenamiento BPA */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center space-x-2 text-[11px] text-slate-700">
                <Thermometer className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Conservación BPA:</strong> Almacenar a menos de 25°C, protegido de la luz solar directa y humedad relativa &lt;65%.
                </span>
              </div>
            </div>

            {/* Columna 3: Métricas de Stock & Acciones Inmediatas (3 cols) */}
            <div className="md:col-span-3 bg-blue-50/50 border border-blue-200 rounded-2xl p-4 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider block mb-2">
                  Stock Sede: {currentBranch.nombre}
                </span>

                <div className="bg-white p-3.5 rounded-xl border border-blue-200 text-center space-y-1">
                  <span className="text-3xl font-black font-mono text-blue-950 block">
                    {currentStock}
                  </span>
                  <span className="text-xs font-bold text-slate-500 block uppercase">
                    Cajas Disponibles
                  </span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase mt-1 ${
                    currentStock <= (product.umbralMinimo || 8)
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {currentStock <= (product.umbralMinimo || 8) ? '⚠️ Quiebre Inminente' : '✓ Nivel Seguro'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">PVP Unitario:</span>
                    <span className="font-mono font-black text-sm text-slate-900">
                      S/ {product.precioUnitario?.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Stock Nacional:</span>
                    <span className="font-mono font-black text-sm text-emerald-700">
                      {totalNationalStock} cjs
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de Acción Inmediata */}
              <div className="space-y-2 pt-2 border-t border-blue-200">
                <button
                  onClick={() => {
                    onClose();
                    onOpenTransfer(product);
                  }}
                  className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Solicitar Traslado de Stock</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenStockAdjust(product);
                  }}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ajustar Stock en Kardex</span>
                </button>
              </div>

            </div>

          </div>

          {/* Pestañas Inferiores: Stock Multisede / Lotes FEFO / Kardex / Etiqueta de Anaquel */}
          <div className="space-y-3">
            <div className="flex items-center space-x-1 border-b border-slate-200 pb-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('multisede')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === 'multisede' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Stock Multisede Nacional ({branchStocks.length} Sedes)</span>
              </button>

              <button
                onClick={() => setActiveTab('lotes')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === 'lotes' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Lotes FEFO &amp; Vencimientos ({productLots.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('kardex')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === 'kardex' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Movimientos de Kardex ({productKardex.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('etiqueta')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === 'etiqueta' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Barcode className="w-3.5 h-3.5 text-emerald-400" />
                <span>Etiqueta de Anaquel (Shelf Tag)</span>
              </button>
            </div>

            {/* TAB 1: STOCK MULTISEDE NACIONAL */}
            {activeTab === 'multisede' && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-100 text-slate-800 font-extrabold uppercase text-[11px]">
                    <tr>
                      <th className="px-4 py-2.5 text-left">Marca &amp; Sede</th>
                      <th className="px-4 py-2.5 text-left">Dirección &amp; Distrito</th>
                      <th className="px-3 py-2.5 text-center">Distancia</th>
                      <th className="px-3 py-2.5 text-center">Stock Actual</th>
                      <th className="px-3 py-2.5 text-center">Autonomía</th>
                      <th className="px-3 py-2.5 text-center">Estado</th>
                      <th className="px-4 py-2.5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {branchStocks.map(b => {
                      const isCurrent = b.id === currentBranch.id;
                      const hasSurplus = b.stock > (product.umbralSeguridad || 15);
                      return (
                        <tr key={b.id} className={isCurrent ? "bg-blue-50/60 font-semibold" : "hover:bg-slate-50"}>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                                b.marca === 'Mifarma' ? 'bg-red-600 text-white' : 'bg-blue-900 text-yellow-300'
                              }`}>
                                {b.marca}
                              </span>
                              <span className="font-extrabold text-slate-900">{b.nombre}</span>
                              {isCurrent && (
                                <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  Tu Sede
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {b.direccion} ({b.distrito})
                          </td>
                          <td className="px-3 py-3 text-center font-mono font-bold text-slate-700">
                            {isCurrent ? '0.0 km' : `${b.distanciaKm} km`}
                          </td>
                          <td className="px-3 py-3 text-center font-mono font-black text-sm text-slate-900">
                            {b.stock} cjs
                          </td>
                          <td className="px-3 py-3 text-center font-bold text-slate-600">
                            {b.diasAutonomia} d
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] uppercase ${
                              b.stock === 0 ? 'bg-red-100 text-red-800' :
                              hasSurplus ? 'bg-purple-100 text-purple-900' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {b.stock === 0 ? 'QUIEBRE' : hasSurplus ? 'EXCEDENTE' : 'ÓPTIMO'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {!isCurrent && b.stock > 0 && (
                              <button
                                onClick={() => {
                                  onClose();
                                  onOpenTransfer(product, b);
                                }}
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 font-extrabold text-xs rounded-lg border border-blue-300 transition cursor-pointer"
                              >
                                Trasladar desde aquí
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: LOTES FEFO & VENCIMIENTOS */}
            {activeTab === 'lotes' && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                {productLots.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    No se registran lotes en riesgo de vencimiento inminente para este producto (&gt;180 días de vida útil).
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-100 text-slate-800 font-extrabold uppercase text-[11px]">
                      <tr>
                        <th className="px-4 py-2.5 text-left">Código de Lote</th>
                        <th className="px-4 py-2.5 text-left">Sede Almacén</th>
                        <th className="px-3 py-2.5 text-center">Fecha Expiración</th>
                        <th className="px-3 py-2.5 text-center">Días Restantes</th>
                        <th className="px-3 py-2.5 text-center">Cajas</th>
                        <th className="px-3 py-2.5 text-center">Semáforo FEFO</th>
                        <th className="px-4 py-2.5 text-left">Protocolo DIGEMID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {productLots.map(l => (
                        <tr key={l.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono font-bold text-slate-900">{l.codigoLote}</td>
                          <td className="px-4 py-3 font-bold text-slate-800">
                            {SUCURSALES.find(s => s.id === l.sucursalId)?.nombre}
                          </td>
                          <td className="px-3 py-3 text-center font-mono font-bold text-slate-700">{l.fechaVencimiento}</td>
                          <td className="px-3 py-3 text-center font-mono font-black text-slate-900">{l.diasRestantes} d</td>
                          <td className="px-3 py-3 text-center font-mono font-bold text-blue-900">{l.cantidad} cjs</td>
                          <td className="px-3 py-3 text-center">
                            <span className={`px-2.5 py-1 rounded-full font-black text-[10px] uppercase ${
                              l.semaforo === 'ROJO' ? 'bg-red-600 text-white' : 'bg-amber-400 text-slate-950'
                            }`}>
                              {l.semaforo}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{l.accionRecomendada}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* TAB 3: MOVIMIENTOS DE KARDEX */}
            {activeTab === 'kardex' && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                {productKardex.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    Sin movimientos recientes de Kardex para este producto.
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-100 text-slate-800 font-extrabold uppercase text-[11px]">
                      <tr>
                        <th className="px-4 py-2.5 text-left">Fecha &amp; Hora</th>
                        <th className="px-4 py-2.5 text-left">Sede</th>
                        <th className="px-3 py-2.5 text-center">Tipo Movimiento</th>
                        <th className="px-3 py-2.5 text-center">Cantidad</th>
                        <th className="px-3 py-2.5 text-center">Stock</th>
                        <th className="px-4 py-2.5 text-left">Motivo &amp; Documento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {productKardex.map(k => (
                        <tr key={k.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono text-slate-600">{k.fecha}</td>
                          <td className="px-4 py-3 font-bold text-slate-900">{k.sucursalNombre}</td>
                          <td className="px-3 py-3 text-center">
                            <span className="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase bg-slate-100 text-slate-800">
                              {k.tipoMovimiento.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-center font-mono font-black text-sm">
                            {k.tipoMovimiento.includes('ENTRADA') ? `+${k.cantidad}` : `-${k.cantidad}`} cjs
                          </td>
                          <td className="px-3 py-3 text-center font-mono text-slate-700">
                            {k.stockAnterior} → <strong>{k.stockNuevo}</strong>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            <div>{k.motivo}</div>
                            <div className="text-[10px] font-mono text-slate-400">Doc: {k.documentoSustento} • {k.usuario}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* TAB 4: ETIQUETA DE ANAQUEL (SHELF TAG) */}
            {activeTab === 'etiqueta' && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Vista Previa de Etiqueta Térmica de Góndola / Anaquel (Formato Estándar Farmacias Peruanas):
                </span>

                {/* Tarjeta de Etiqueta Estilo InkaFarma/Mifarma */}
                <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 max-w-sm w-full shadow-md space-y-2 text-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                    <span className="text-xs font-black tracking-wider uppercase text-blue-900">
                      FARMACIAS PERUANAS S.A.
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      POS-TAG-2026
                    </span>
                  </div>

                  <div className="pt-1">
                    <h4 className="text-sm font-black text-slate-900 uppercase leading-snug">
                      {product.nombreComercial}
                    </h4>
                    <p className="text-[11px] text-slate-600 font-semibold truncate">
                      {product.principioActivo}
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Reg: {product.registroSanitario}
                    </div>
                  </div>

                  {/* Precio Grande */}
                  <div className="flex items-baseline justify-between bg-amber-50 p-2.5 rounded-xl border border-amber-300 my-2">
                    <span className="text-xs font-black text-amber-950 uppercase">Precio Regular:</span>
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-800 mr-1">S/</span>
                      <span className="text-2xl font-black font-mono text-slate-950">
                        {product.precioUnitario?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Código de Barras */}
                  <div className="text-center pt-1 border-t border-slate-200">
                    <div className="flex justify-center items-center space-x-0.5 py-1">
                      {[2,1,3,1,2,4,1,2,3,1,4,2,1,3,2,4,1,2,3,1,2].map((w, idx) => (
                        <div 
                          key={idx} 
                          className="bg-slate-900 h-8 rounded-xs"
                          style={{ width: `${w * 1.8}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono font-black text-slate-900 tracking-widest block">
                      {product.codigoEAN || '775098765001'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePrint}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Etiqueta Térmica</span>
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Ficha validada conforme a Buenas Prácticas de Almacenamiento (BPA DIGEMID)</span>
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Cerrar Expediente
          </button>
        </div>

      </div>
    </div>
  );
}
