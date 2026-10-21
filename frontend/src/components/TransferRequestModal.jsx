import React, { useState, useEffect } from 'react';
import { 
  X, 
  Truck, 
  ArrowRight, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Package, 
  Info,
  Layers,
  DollarSign,
  Search,
  MapPin
} from 'lucide-react';
import { 
  SUCURSALES, 
  INVENTARIO_DATA, 
  getMedicineImageUrl, 
  calcularDistanciaHaversine 
} from '../services/mockData';

export default function TransferRequestModal({ 
  isOpen, 
  onClose, 
  medicine, 
  currentBranch, 
  initialTargetBranch = null,
  onConfirmTransfer 
}) {
  // Manejo de tecla Escape para cerrar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtros de búsqueda para las sedes donantes
  const [donorRegionFilter, setDonorRegionFilter] = useState('ALL');
  const [donorSearchTerm, setDonorSearchTerm] = useState('');
  const [selectedOriginId, setSelectedOriginId] = useState(null);
  const [quantity, setQuantity] = useState(5);
  const [motivo, setMotivo] = useState('QUIEBRE_VENTANILLA');
  const [prioridad, setPrioridad] = useState('URGENTE');
  const [observaciones, setObservaciones] = useState('');

  // Sincronizar sede origen y cantidad por defecto al abrir el modal
  useEffect(() => {
    if (isOpen && medicine) {
      if (initialTargetBranch && initialTargetBranch.stock > 0) {
        setSelectedOriginId(initialTargetBranch.id);
        const s = initialTargetBranch.stock || 25;
        setQuantity(Math.min(25, Math.max(1, Math.floor(s / 2))));
      } else {
        const dest = currentBranch || SUCURSALES[0];
        const branchesWithStock = SUCURSALES
          .filter(s => s.id !== dest.id)
          .map(suc => {
            const invList = INVENTARIO_DATA[suc.id] || [];
            const item = invList.find(i => i.medicamentoId === medicine.id);
            return { id: suc.id, stock: item ? item.stockActual : 0 };
          })
          .filter(s => s.stock > 0)
          .sort((a, b) => b.stock - a.stock);

        if (branchesWithStock.length > 0) {
          setSelectedOriginId(branchesWithStock[0].id);
          setQuantity(Math.min(25, Math.max(1, Math.floor(branchesWithStock[0].stock / 2))));
        }
      }
    }
  }, [isOpen, medicine, initialTargetBranch, currentBranch]);

  // Condición de renderizado: SOLO después de haber llamado a todos los hooks incondicionalmente
  if (!isOpen || !medicine) return null;

  // Sucursal de destino (habitualmente la sede actual donde falta stock)
  const destBranch = currentBranch || SUCURSALES[0];

  // Buscar todas las sucursales donantes disponibles que tengan stock del producto
  const availableBranches = SUCURSALES
    .filter(s => s.id !== destBranch.id)
    .map(suc => {
      const invList = INVENTARIO_DATA[suc.id] || [];
      const item = invList.find(i => i.medicamentoId === medicine.id);
      const stock = item ? item.stockActual : 0;
      const distancia = calcularDistanciaHaversine(destBranch.lat, destBranch.lng, suc.lat, suc.lng);
      return {
        ...suc,
        stock,
        distanciaKm: distancia,
        estadoStock: item ? item.estado : 'SIN_STOCK',
        diasAutonomia: item ? item.diasAutonomia : 0
      };
    })
    .filter(s => s.stock > 0)
    .sort((a, b) => b.stock - a.stock); // Primero las que tienen más excedente

  const filteredBranches = availableBranches.filter(b => {
    if (donorRegionFilter !== 'ALL') {
      const dep = (b.departamento || '').toLowerCase();
      if (donorRegionFilter === 'Lima' && !dep.includes('lima') && !dep.includes('callao')) return false;
      if (donorRegionFilter === 'Sur' && !dep.includes('arequipa') && !dep.includes('cusco')) return false;
      if (donorRegionFilter === 'Norte' && !dep.includes('libertad') && !dep.includes('lambayeque')) return false;
      if (donorRegionFilter === 'Centro' && !dep.includes('junin') && !dep.includes('huancayo')) return false;
    }
    if (donorSearchTerm.trim()) {
      const q = donorSearchTerm.toLowerCase();
      return (b.nombre || '').toLowerCase().includes(q) || (b.distrito || '').toLowerCase().includes(q);
    }
    return true;
  });

  // Sede origen seleccionada
  const activeOriginId = selectedOriginId || initialTargetBranch?.id || availableBranches[0]?.id || 2;
  const originBranch = availableBranches.find(b => b.id === Number(activeOriginId)) || availableBranches[0] || {
    id: 2,
    nombre: 'Mifarma Miraflores Ovalo Gutiérrez',
    marca: 'Mifarma',
    distrito: 'Miraflores',
    stock: 95,
    distanciaKm: 2.3
  };

  // Stock actual en mi sede (destino)
  const destInvList = INVENTARIO_DATA[destBranch.id] || [];
  const destItem = destInvList.find(i => i.medicamentoId === medicine.id);
  const destCurrentStock = destItem ? destItem.stockActual : 0;

  // Cantidad solicitada
  const maxAllowed = Math.max(1, originBranch.stock);
  const suggestedAmount = Math.min(25, Math.max(5, Math.floor(originBranch.stock / 2)));

  // Proyecciones de stock
  const destProjectedStock = destCurrentStock + Number(quantity || 0);
  const originProjectedStock = Math.max(0, originBranch.stock - Number(quantity || 0));

  const valorTotalSoles = (medicine.precioUnitario || 0) * Number(quantity || 0);

  const handleQuantityChange = (val) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setQuantity('');
    } else {
      const clamped = Math.max(1, Math.min(num, maxAllowed));
      setQuantity(clamped);
    }
  };

  const handleStep = (delta) => {
    const current = Number(quantity) || 0;
    const next = Math.max(1, Math.min(current + delta, maxAllowed));
    setQuantity(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalQty = Number(quantity);
    if (!finalQty || finalQty < 1) return;

    const transferPayload = {
      origenSucursalId: originBranch.id,
      destinoSucursalId: destBranch.id,
      medicamentoId: medicine.id,
      cantidadSugerida: finalQty,
      motivo,
      justificacion: observaciones || `Solicitud por ${motivo.replace(/_/g, ' ').toLowerCase()} desde ${destBranch.nombre} hacia ${originBranch.nombre}.`,
      prioridad
    };

    onConfirmTransfer(transferPayload);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[92vh] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-blue-500/20 text-cyan-300 rounded-2xl border border-blue-400/30 shrink-0">
              <Truck className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800">
                  Caso de Uso CU03 • Solicitud de Traslado Inter-Sedes
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Presione ESC o haga clic afuera para salir
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Solicitar Traslado de Stock Farmacéutico
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Seleccione la sede donante con excedente, indique las cajas exactas y emita la solicitud inmediata.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer shrink-0 ml-2"
            aria-label="Cerrar modal"
            title="Cerrar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form con Scroll Vertical Amplio */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Ficha del Producto Seleccionado */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-xl border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
              <img 
                src={getMedicineImageUrl(medicine)} 
                alt={medicine.nombreComercial} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80';
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                  medicine.tipoProducto === 'MARCA' ? 'bg-purple-100 text-purple-900 border border-purple-200' : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}>
                  {medicine.marcaComercial || (medicine.tipoProducto === 'MARCA' ? 'Marca Comercial' : 'Genérico DCI')}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                  {medicine.categoria || 'Farmacia'}
                </span>
                {medicine.requiereReceta && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                    Bajo Receta
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                {medicine.nombreComercial}
              </h3>
              <p className="text-xs text-slate-600 truncate font-medium">
                {medicine.principioActivo} • {medicine.concentracion || medicine.presentacion}
              </p>
              <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                Reg: <strong>{medicine.registroSanitario}</strong> • EAN: {medicine.codigoEAN}
              </div>
            </div>
          </div>

          {/* Selector de Sede Origen (Donante) con Filtros y Scroll Espacioso */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-black uppercase text-slate-800 tracking-wider">
                  1. Sede Donante con Stock Disponible:
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  {availableBranches.length} sedes cuentan con existencias activas para abastecimiento.
                </span>
              </div>

              {/* Filtro rápido por macrorregión */}
              <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
                <button
                  type="button"
                  onClick={() => setDonorRegionFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    donorRegionFilter === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todas ({availableBranches.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDonorRegionFilter('Lima')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    donorRegionFilter === 'Lima' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lima
                </button>
                <button
                  type="button"
                  onClick={() => setDonorRegionFilter('Sur')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    donorRegionFilter === 'Sur' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sur
                </button>
                <button
                  type="button"
                  onClick={() => setDonorRegionFilter('Norte')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    donorRegionFilter === 'Norte' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Norte
                </button>
                <button
                  type="button"
                  onClick={() => setDonorRegionFilter('Centro')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    donorRegionFilter === 'Centro' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Centro
                </button>
              </div>
            </div>

            {/* Cuadrícula de sedes con scroll cómodo y sin apretujes */}
            <div className="max-h-56 overflow-y-auto pr-1.5 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {filteredBranches.map(suc => {
                  const isSelected = originBranch.id === suc.id;
                  const isMifarma = suc.marca === 'Mifarma';
                  const isCD = !!suc.esCentroDistribucion;

                  return (
                    <button
                      type="button"
                      key={suc.id}
                      onClick={() => {
                        setSelectedOriginId(suc.id);
                        if (quantity > suc.stock) setQuantity(suc.stock);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/90 ring-2 ring-blue-600/40 shadow-xs' 
                          : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      {/* Lado Izquierdo: Marca, Nombre y Distrito */}
                      <div className="flex-1 min-w-0 mr-3">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                            isCD
                              ? 'bg-indigo-950 text-cyan-300'
                              : isMifarma 
                                ? 'bg-[#D32F2F] text-white' 
                                : 'bg-[#002B66] text-[#FFD100]'
                          }`}>
                            {suc.marca}
                          </span>
                          <span className="text-xs font-black text-slate-900 truncate block">
                            {suc.nombre}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{suc.distrito} ({suc.departamento}) • <strong className="font-mono text-blue-700">{suc.distanciaKm} km</strong></span>
                        </div>
                      </div>

                      {/* Lado Derecho: Stock Disponible SIN CORTARSE */}
                      <div className="text-right shrink-0 pl-3 border-l border-slate-100">
                        <span className="text-sm font-black font-mono text-emerald-800 block whitespace-nowrap">
                          {suc.stock} cjs
                        </span>
                        <span className="text-[10px] uppercase font-extrabold text-emerald-700 block whitespace-nowrap">
                          Disponible
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selector de Cantidad Exacta */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-black uppercase text-slate-800 tracking-wider block">
                  2. Cantidad Exacta de Cajas a Solicitar:
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  Ingrese el número exacto o use los incrementos rápidos.
                </span>
              </div>
              <div className="text-right bg-blue-100/60 px-3 py-1 rounded-xl border border-blue-200">
                <span className="text-xs text-slate-600 font-bold">Máximo en sede origen:</span>
                <span className="text-xs font-mono font-black text-blue-900 ml-1.5">{originBranch.stock} cjs</span>
              </div>
            </div>

            {/* Stepper y Campo Numérico Directo */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleStep(-1)}
                disabled={quantity <= 1}
                className="w-12 h-12 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-300 text-slate-800 rounded-2xl font-black text-lg flex items-center justify-center transition shadow-xs cursor-pointer active:scale-95 shrink-0"
                title="Disminuir 1 caja"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="relative flex-1">
                <input
                  type="number"
                  min="1"
                  max={maxAllowed}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="w-full text-center text-2xl font-mono font-black text-blue-950 py-2.5 bg-white border-2 border-blue-400 focus:border-blue-600 rounded-2xl outline-none shadow-inner"
                  required
                />
                <span className="absolute right-5 top-3.5 text-xs font-extrabold text-slate-400 uppercase pointer-events-none">
                  Cajas
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleStep(1)}
                disabled={quantity >= maxAllowed}
                className="w-12 h-12 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-300 text-slate-800 rounded-2xl font-black text-lg flex items-center justify-center transition shadow-xs cursor-pointer active:scale-95 shrink-0"
                title="Aumentar 1 caja"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Presets Rápidos: +1, +5, +10, +25, Sugerido, Max */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-black text-slate-500 uppercase mr-1">Rápido:</span>
              <button
                type="button"
                onClick={() => setQuantity(1)}
                className="px-3 py-1.5 bg-white hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 transition cursor-pointer"
              >
                1 cja
              </button>
              <button
                type="button"
                onClick={() => handleStep(5)}
                className="px-3 py-1.5 bg-white hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 transition cursor-pointer"
              >
                +5 cjas
              </button>
              <button
                type="button"
                onClick={() => handleStep(10)}
                className="px-3 py-1.5 bg-white hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 transition cursor-pointer"
              >
                +10 cjas
              </button>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(25, maxAllowed))}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-xl text-xs font-bold text-blue-900 transition cursor-pointer"
              >
                25 cjas (Lote Estándar)
              </button>
              <button
                type="button"
                onClick={() => setQuantity(suggestedAmount)}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-xl text-xs font-extrabold text-purple-900 transition cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Sugerido IA ({suggestedAmount})</span>
              </button>
              <button
                type="button"
                onClick={() => setQuantity(maxAllowed)}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-extrabold text-amber-900 transition cursor-pointer ml-auto"
              >
                Máximo ({maxAllowed})
              </button>
            </div>
          </div>

          {/* SIMULADOR DE IMPACTO EN AMBAS SEDES (Antes y Después) */}
          <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white shadow-xs space-y-3">
            <span className="text-xs font-black uppercase text-slate-700 tracking-wider block">
              3. Simulación de Inventario Traslado (Antes ➔ Después):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Sede Destino (Mi Sede) */}
              <div className="bg-red-50/50 border border-red-200 rounded-2xl p-3.5">
                <span className="text-[10px] font-black text-red-800 uppercase tracking-wider block">Mi Sede (Receptora):</span>
                <div className="font-extrabold text-sm text-slate-900 mt-0.5 truncate">{destBranch.nombre}</div>
                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-red-100">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">Stock Actual:</span>
                    <span className="font-mono font-black text-sm text-red-600">
                      {destCurrentStock} cjs ({destCurrentStock <= 5 ? 'Quiebre' : 'Bajo'})
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-medium block">Stock Proyectado:</span>
                    <span className="font-mono font-black text-sm text-emerald-700">
                      {destProjectedStock} cjs (Óptimo)
                    </span>
                  </div>
                </div>
              </div>

              {/* Sede Origen (Donante) */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-3.5">
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">Sede Origen (Donante):</span>
                <div className="font-extrabold text-sm text-slate-900 mt-0.5 truncate">{originBranch.nombre}</div>
                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-emerald-100">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">Stock Actual:</span>
                    <span className="font-mono font-black text-sm text-slate-700">
                      {originBranch.stock} cjs (Excedente)
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-medium block">Stock Restante:</span>
                    <span className="font-mono font-black text-sm text-blue-900">
                      {originProjectedStock} cjs (Seguro)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra Financiera Resumen */}
            <div className="flex items-center justify-between bg-slate-50 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 mt-2 border border-slate-200">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Valoración Comercial del Lote en Tránsito:</span>
              </span>
              <strong className="text-slate-900 font-mono text-sm font-black">
                S/ {valorTotalSoles.toFixed(2)} PEN
              </strong>
            </div>
          </div>

          {/* Motivo y Prioridad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">
                4. Motivo Operativo:
              </label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              >
                <option value="QUIEBRE_VENTANILLA">Quiebre inminente en ventanilla (receta en mano)</option>
                <option value="PREDICCION_QUIEBRE_7_DIAS">Predicción de quiebre por algoritmo IA (7 días)</option>
                <option value="CAMPANA_PROMOCIONAL">Campaña dermatológica / salud de temporada</option>
                <option value="ROTACION_VENCIMIENTO">Reubicación preventiva por rotación FEFO</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">
                Prioridad de Despacho:
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setPrioridad('NORMAL')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    prioridad === 'NORMAL' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Normal (4h)
                </button>
                <button
                  type="button"
                  onClick={() => setPrioridad('URGENTE')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                    prioridad === 'URGENTE' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Urgente (1-2h)
                </button>
                <button
                  type="button"
                  onClick={() => setPrioridad('CRITICO')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                    prioridad === 'CRITICO' ? 'bg-red-600 text-white shadow-xs animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Crítico Express
                </button>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-xl transition cursor-pointer"
            >
              Cancelar (Esc)
            </button>

            <button
              type="submit"
              disabled={!quantity || quantity < 1}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 text-white text-xs font-black rounded-xl transition shadow-md hover:shadow-lg cursor-pointer transform active:scale-95"
            >
              <Truck className="w-4 h-4" />
              <span>Emitir Solicitud ({quantity} Cajas)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
