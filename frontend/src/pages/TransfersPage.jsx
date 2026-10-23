import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  ArrowRight, 
  ShieldCheck,
  Search,
  Filter,
  Lock,
  Thermometer,
  Clock,
  ClipboardCheck,
  Building2,
  Sparkles,
  Package,
  Printer,
  Eye,
  AlertTriangle,
  Check,
  X,
  MapPin
} from 'lucide-react';
import { 
  TRASLADOS_SUGERIDOS, 
  SUCURSALES, 
  MEDICAMENTOS, 
  getMedicineImageUrl,
  dispatchTransferOrder,
  receiveTransferOrder,
  rejectTransferOrder
} from '../services/mockData';
import { sanitizeInput } from '../services/securityUtils';
import GuiaRemisionModal from '../components/GuiaRemisionModal';

export default function TransfersPage({ extraTransfers = [] }) {
  // Combinar traslados persistidos con las solicitudes dinámicas
  const [transfers, setTransfers] = useState(() => {
    const map = new Map();
    extraTransfers.forEach(t => map.set(t.id, t));
    TRASLADOS_SUGERIDOS.forEach(t => {
      if (!map.has(t.id)) map.set(t.id, t);
    });
    return Array.from(map.values());
  });

  // Sincronización reactiva con almacenamiento persistente
  React.useEffect(() => {
    const handleSync = () => {
      const map = new Map();
      extraTransfers.forEach(t => map.set(t.id, t));
      TRASLADOS_SUGERIDOS.forEach(t => {
        if (!map.has(t.id)) map.set(t.id, t);
      });
      setTransfers(Array.from(map.values()));
    };
    window.addEventListener('siip:data_updated', handleSync);
    return () => window.removeEventListener('siip:data_updated', handleSync);
  }, [extraTransfers]);

  // Filtros
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'PENDIENTE' | 'EN_TRANSITO' | 'RECEPCIONADO'
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [selectedGuiaTraslado, setSelectedGuiaTraslado] = useState(null);
  const [initialGuiaTab, setInitialGuiaTab] = useState('salida');
  
  // Modal de Despacho (Guía Salida SUNAT)
  const [dispatchingTransfer, setDispatchingTransfer] = useState(null);
  const [dispatchForm, setDispatchForm] = useState({
    conductor: 'Carlos Mendoza Quispe',
    licenciaConducir: 'Q-45892110',
    placaVehiculo: 'BCV-912',
    marcaVehiculo: 'Mercedes-Benz Sprinter Furgón Isotérmico',
    precintoSeguridad: 'PREC-SEC-88219',
    temperaturaDespacho: '20.5 °C'
  });

  // Modal de Recepción (Guía Entrada & Acta DIGEMID)
  const [receivingTransfer, setReceivingTransfer] = useState(null);
  const [receptionForm, setReceptionForm] = useState({
    qfReceptor: 'Ronny Fernando Mendoza Paucar (QF Reg. 28491)',
    temperaturaLlegada: '21.2 °C',
    observaciones: 'Recepción técnica y física conforme. Cajas íntegras y selladas según Manual BPA DIGEMID.',
    checkCount: true,
    checkSeal: true,
    checkTemp: true,
    checkIntegrity: true
  });

  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 6000);
  };

  // Abrir modal de Despacho
  const handleOpenDispatchModal = (transfer) => {
    const randomPrecinto = `PREC-SEC-${Math.floor(10000 + Math.random() * 90000)}`;
    setDispatchForm({
      conductor: 'Carlos Mendoza Quispe',
      licenciaConducir: 'Q-45892110',
      placaVehiculo: 'BCV-912',
      marcaVehiculo: 'Mercedes-Benz Sprinter Furgón Isotérmico',
      precintoSeguridad: randomPrecinto,
      temperaturaDespacho: '20.5 °C'
    });
    setDispatchingTransfer(transfer);
  };

  // Confirmar Despacho: Emite Guía Salida SUNAT, descuenta stock en origen y pasa a EN_TRANSITO
  const handleConfirmDispatch = (e) => {
    e.preventDefault();
    if (!dispatchingTransfer) return;

    const updated = dispatchTransferOrder(dispatchingTransfer.id, dispatchForm);
    if (updated) {
      setTransfers(prev => prev.map(t => t.id === updated.id ? { ...updated } : t));
      setDispatchingTransfer(null);
      showNotification(`¡Traslado ${updated.codigo} despachado! Se emitió la Guía de Remisión de Salida SUNAT con precinto ${dispatchForm.precintoSeguridad}.`);
      
      // Abrir la guía de salida recién generada
      setSelectedGuiaTraslado(updated);
      setInitialGuiaTab('salida');
    }
  };

  // Abrir modal de Recepción
  const handleOpenReceiveModal = (transfer) => {
    setReceptionForm({
      qfReceptor: 'Ronny Fernando Mendoza Paucar (QF Reg. 28491)',
      temperaturaLlegada: '21.4 °C',
      observaciones: `Recepción técnica y física de ${transfer.cantidadSugerida} cajas verificada conforme a Guía de Salida SUNAT.`,
      checkCount: true,
      checkSeal: true,
      checkTemp: true,
      checkIntegrity: true
    });
    setReceivingTransfer(transfer);
  };

  // Confirmar Recepción: Emite Guía Entrada DIGEMID, suma stock a destino y pasa a RECEPCIONADO_CONFORME
  const handleConfirmReceive = (e) => {
    e.preventDefault();
    if (!receivingTransfer) return;

    const updated = receiveTransferOrder(receivingTransfer.id, receptionForm);
    if (updated) {
      setTransfers(prev => prev.map(t => t.id === updated.id ? { ...updated } : t));
      setReceivingTransfer(null);
      showNotification(`¡Traslado ${updated.codigo} recepcionado conforme! Se sumaron ${updated.cantidadSugerida} cajas al inventario y se emitió el Acta BPA DIGEMID.`);
      
      // Abrir el acta de recepción recién generada
      setSelectedGuiaTraslado(updated);
      setInitialGuiaTab('entrada');
    }
  };

  // Rechazar Solicitud formalmente
  const handleRejectTransfer = (transferId) => {
    const updated = rejectTransferOrder(transferId);
    if (updated) {
      setTransfers(prev => prev.map(t => t.id === transferId ? { ...updated } : t));
    } else {
      setTransfers(prev => prev.map(t => t.id === transferId ? { ...t, estado: 'RECHAZADO' } : t));
    }
    showNotification(`Solicitud de traslado rechazada formalmente.`);
  };

  // Abrir visor de guías
  const handleViewGuia = (transfer, tab = 'salida') => {
    setSelectedGuiaTraslado(transfer);
    setInitialGuiaTab(tab);
  };

  // Filtrado reactivo
  const cleanSearch = sanitizeInput(searchTerm).toLowerCase();
  const filtered = transfers.filter(t => {
    const med = MEDICAMENTOS.find(m => m.id === t.medicamentoId);
    const origen = SUCURSALES.find(s => s.id === t.origenSucursalId);
    const destino = SUCURSALES.find(s => s.id === t.destinoSucursalId);

    const matchesSearch = 
      t.codigo.toLowerCase().includes(cleanSearch) ||
      (med && med.nombreComercial.toLowerCase().includes(cleanSearch)) ||
      (med && med.principioActivo.toLowerCase().includes(cleanSearch)) ||
      (origen && origen.nombre.toLowerCase().includes(cleanSearch)) ||
      (destino && destino.nombre.toLowerCase().includes(cleanSearch));

    if (!matchesSearch) return false;

    if (activeTab === 'PENDIENTE') return t.estado === 'PENDIENTE_APROBACION';
    if (activeTab === 'EN_TRANSITO') return t.estado === 'EN_TRANSITO';
    if (activeTab === 'RECEPCIONADO') return t.estado === 'RECEPCIONADO_CONFORME';

    return true;
  });

  // KPIs
  const countPendientes = transfers.filter(t => t.estado === 'PENDIENTE_APROBACION').length;
  const countTransito = transfers.filter(t => t.estado === 'EN_TRANSITO').length;
  const countRecepcionados = transfers.filter(t => t.estado === 'RECEPCIONADO_CONFORME').length;

  const totalAhorro = transfers
    .filter(t => t.estado === 'EN_TRANSITO' || t.estado === 'RECEPCIONADO_CONFORME')
    .reduce((acc, t) => acc + (t.ahorroEstimadoSoles || 0), 0);

  return (
    <div className="space-y-6 w-full">
      
      {/* Header Principal */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Casos de Uso CU03 &amp; CU05 • Cadena de Custodia Logística Inter-Sedes</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Gestión Integral de Traslados de Stock (SUNAT &amp; DIGEMID)
          </h1>
          <p className="text-sm font-medium text-slate-700 mt-1">
            Controle el ciclo completo: <strong>Guía de Salida (GRE SUNAT)</strong> ➔ <strong>Monitoreo en Tránsito con Precinto</strong> ➔ <strong>Guía de Entrada &amp; Acta de Recepción Conforme (BPA DIGEMID)</strong>.
          </p>
        </div>

        {/* Badge de Ahorro y Eficiencia */}
        <div className="flex items-center space-x-3 bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl shrink-0">
          <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-800 uppercase font-black tracking-wider block">
              Ahorro por Quiebres Evitados:
            </span>
            <span className="text-base font-black text-emerald-950 font-mono">
              S/ {(totalAhorro + 3250.00).toFixed(2)} PEN
            </span>
          </div>
        </div>
      </div>

      {/* Banner de Notificación */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-bold animate-in fade-in shadow-sm">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Tarjetas KPI de las 3 Fases del Traslado */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        
        {/* KPI 1: Total */}
        <button
          onClick={() => setActiveTab('ALL')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'ALL' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase mb-1">
            <span className={activeTab === 'ALL' ? 'text-slate-300' : 'text-slate-500'}>Total Registros</span>
            <Package className="w-4 h-4 opacity-70" />
          </div>
          <div className="text-2xl font-black font-mono">{transfers.length}</div>
          <div className={`text-[10px] mt-1 font-semibold ${activeTab === 'ALL' ? 'text-slate-300' : 'text-slate-500'}`}>
            Traslados registrados
          </div>
        </button>

        {/* KPI 2: Fase 1 - Pendientes de Despacho (Guía Salida) */}
        <button
          onClick={() => setActiveTab('PENDIENTE')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'PENDIENTE' ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md ring-2 ring-amber-400' : 'bg-white text-slate-800 border-slate-200 hover:bg-amber-50/50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-black uppercase mb-1">
            <span className={activeTab === 'PENDIENTE' ? 'text-slate-900' : 'text-amber-800'}>1. Por Despachar</span>
            <FileText className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-950">{countPendientes}</div>
          <div className="text-[10px] mt-1 font-bold text-amber-900">
            Requieren Guía Salida SUNAT
          </div>
        </button>

        {/* KPI 3: Fase 2 - En Tránsito (Vehículo en Ruta) */}
        <button
          onClick={() => setActiveTab('EN_TRANSITO')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'EN_TRANSITO' ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-400' : 'bg-white text-slate-800 border-slate-200 hover:bg-blue-50/50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-black uppercase mb-1">
            <span className={activeTab === 'EN_TRANSITO' ? 'text-white' : 'text-blue-800'}>2. En Tránsito</span>
            <Truck className="w-4 h-4 text-cyan-300 animate-pulse" />
          </div>
          <div className="text-2xl font-black font-mono text-white">{countTransito}</div>
          <div className={`text-[10px] mt-1 font-bold ${activeTab === 'EN_TRANSITO' ? 'text-blue-100' : 'text-blue-700'}`}>
            Furgón en ruta con precinto
          </div>
        </button>

        {/* KPI 4: Fase 3 - Conforme (Recepcionado DIGEMID) */}
        <button
          onClick={() => setActiveTab('RECEPCIONADO')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'RECEPCIONADO' ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-400' : 'bg-white text-slate-800 border-slate-200 hover:bg-emerald-50/50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-black uppercase mb-1">
            <span className={activeTab === 'RECEPCIONADO' ? 'text-emerald-100' : 'text-emerald-800'}>3. Conformes</span>
            <ClipboardCheck className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="text-2xl font-black font-mono text-white">{countRecepcionados}</div>
          <div className={`text-[10px] mt-1 font-bold ${activeTab === 'RECEPCIONADO' ? 'text-emerald-100' : 'text-emerald-700'}`}>
            Con Acta Entrada DIGEMID
          </div>
        </button>

      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Buscador */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por código, producto o sede..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
          />
        </div>

        {/* Pestañas de Estado */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todos ({transfers.length})
          </button>
          <button
            onClick={() => setActiveTab('PENDIENTE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'PENDIENTE' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            1. Por Despachar ({countPendientes})
          </button>
          <button
            onClick={() => setActiveTab('EN_TRANSITO')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'EN_TRANSITO' ? 'bg-blue-600 text-white font-black' : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
            }`}
          >
            2. En Ruta ({countTransito})
          </button>
          <button
            onClick={() => setActiveTab('RECEPCIONADO')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'RECEPCIONADO' ? 'bg-emerald-600 text-white font-black' : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            3. Conformes ({countRecepcionados})
          </button>
        </div>
      </div>

      {/* TABLA PRINCIPAL DE TRASLADOS Y CADENA DE CUSTODIA */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
            <thead className="bg-slate-900 text-white font-extrabold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3.5 text-left">Código &amp; Fecha</th>
                <th className="px-4 py-3.5 text-left">Producto / Fármaco</th>
                <th className="px-4 py-3.5 text-left">Sede Origen (Donante)</th>
                <th className="px-4 py-3.5 text-left">Sede Destino (Quiebre)</th>
                <th className="px-3 py-3.5 text-center">Cant. Cajas</th>
                <th className="px-4 py-3.5 text-left">Estado Logístico</th>
                <th className="px-4 py-3.5 text-right">Acción de Custodia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filtered.map(transfer => {
                const origen = SUCURSALES.find(s => s.id === transfer.origenSucursalId);
                const destino = SUCURSALES.find(s => s.id === transfer.destinoSucursalId);
                const med = MEDICAMENTOS.find(m => m.id === transfer.medicamentoId);

                const isPending = transfer.estado === 'PENDIENTE_APROBACION';
                const isTransit = transfer.estado === 'EN_TRANSITO';
                const isReceived = transfer.estado === 'RECEPCIONADO_CONFORME';
                const isRejected = transfer.estado === 'RECHAZADO';

                return (
                  <tr key={transfer.id} className="hover:bg-blue-50/30 transition">
                    
                    {/* Código y Fecha */}
                    <td className="px-4 py-4">
                      <div className="font-mono font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 w-fit text-xs">
                        {transfer.codigo}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{transfer.fechaSugerencia}</span>
                      </div>
                    </td>

                    {/* Producto */}
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={getMedicineImageUrl(med)}
                            alt={med?.nombreComercial}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=150&q=80';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                            med?.tipoProducto === 'MARCA' ? 'bg-purple-100 text-purple-900' : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {med?.marcaComercial || 'Genérico'}
                          </span>
                          <div className="font-extrabold text-slate-900 truncate mt-0.5 text-xs sm:text-sm">
                            {med?.nombreComercial}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {med?.principioActivo} • {med?.categoria}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Sede Origen */}
                    <td className="px-4 py-4">
                      <div className="font-bold text-blue-950 text-xs">{origen?.nombre}</div>
                      <div className="text-[10px] text-slate-500">
                        {origen?.distrito} • <span className="font-semibold text-slate-700">{origen?.marca}</span>
                      </div>
                    </td>

                    {/* Sede Destino */}
                    <td className="px-4 py-4">
                      <div className="font-bold text-red-950 text-xs">{destino?.nombre}</div>
                      <div className="text-[10px] text-slate-500">
                        {destino?.distrito} • <span className="font-semibold text-slate-700">{destino?.marca}</span>
                      </div>
                    </td>

                    {/* Cantidad Cajas (Número exacto solicitado) */}
                    <td className="px-3 py-4 text-center">
                      <span className="font-mono font-black text-sm text-blue-950 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl block w-fit mx-auto">
                        {transfer.cantidadSugerida} cjs
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold block mt-1">
                        S/ {transfer.ahorroEstimadoSoles?.toFixed(2)}
                      </span>
                    </td>

                    {/* Estado Logístico y Línea de Tiempo */}
                    <td className="px-4 py-4">
                      {isPending && (
                        <div className="space-y-1">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                            <Clock className="w-3 h-3" />
                            <span>1. Espera Guía Salida</span>
                          </span>
                          <div className="text-[10px] text-slate-500">
                            Origen debe autorizar y despachar
                          </div>
                        </div>
                      )}

                      {isTransit && (
                        <div className="space-y-1.5">
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-900 border border-blue-300">
                            <Truck className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                            <span>2. Furgón en Ruta</span>
                          </span>
                          <div className="text-[10px] font-mono text-slate-700 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>{transfer.guiaSalida?.precintoSeguridad}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Placa: <strong>{transfer.guiaSalida?.placaVehiculo}</strong> (~15 min)
                          </div>
                        </div>
                      )}

                      {isReceived && (
                        <div className="space-y-1">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>3. Conforme en Sede</span>
                          </span>
                          <div className="text-[10px] text-slate-600 font-mono">
                            {transfer.guiaEntrada?.numeroActaRecepcion || 'ACTA-BPA'}
                          </div>
                          <div className="text-[10px] text-emerald-800 font-bold">
                            Stock sumado a inventario
                          </div>
                        </div>
                      )}

                      {isRejected && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                          <XCircle className="w-3 h-3" />
                          <span>Rechazado</span>
                        </span>
                      )}
                    </td>

                    {/* Acciones de Custodia */}
                    <td className="px-4 py-4 text-right">
                      
                      {/* FASE 1: DESPACHAR CON GUÍA DE SALIDA SUNAT */}
                      {isPending && (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenDispatchModal(transfer)}
                            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold rounded-xl text-xs transition shadow-xs cursor-pointer"
                            title="Emitir Guía de Remisión Electrónica Remitente SUNAT y asignar precinto"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Despachar (Guía Salida)</span>
                          </button>
                          <button
                            onClick={() => handleRejectTransfer(transfer.id)}
                            className="p-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 rounded-xl transition cursor-pointer"
                            title="Rechazar solicitud"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* FASE 2: RECEPCIONAR CON GUÍA DE ENTRADA DIGEMID */}
                      {isTransit && (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenReceiveModal(transfer)}
                            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-xl text-xs transition shadow-sm cursor-pointer"
                            title="Verificar bultos en destino, emitir Acta BPA y sumar stock"
                          >
                            <ClipboardCheck className="w-3.5 h-3.5" />
                            <span>Recepcionar (Guía Entrada)</span>
                          </button>

                          <button
                            onClick={() => handleViewGuia(transfer, 'salida')}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition cursor-pointer"
                            title="Ver Guía de Salida SUNAT con QR"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                          </button>
                        </div>
                      )}

                      {/* FASE 3: VER EXPEDIENTE COMPLETO CON AMBAS GUÍAS */}
                      {isReceived && (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleViewGuia(transfer, 'salida')}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-blue-900 font-bold rounded-xl text-xs border border-slate-300 transition cursor-pointer"
                            title="Ver Guía de Remisión de Salida SUNAT"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>Guía Salida</span>
                          </button>

                          <button
                            onClick={() => handleViewGuia(transfer, 'entrada')}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-black rounded-xl text-xs border border-emerald-300 transition cursor-pointer"
                            title="Ver Guía de Entrada y Acta DIGEMID"
                          >
                            <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Guía Entrada</span>
                          </button>
                        </div>
                      )}

                      {isRejected && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Sin Acciones</span>
                      )}

                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: DESPACHO Y EMISIÓN DE GUÍA DE SALIDA SUNAT
          ========================================================================= */}
      {dispatchingTransfer && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setDispatchingTransfer(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-blue-500/20 text-cyan-300 rounded-2xl border border-blue-400/30">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                    Fase 1: Emisión GRE Remitente SUNAT
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white mt-1">
                    Despacho de Valija y Guía de Salida
                  </h3>
                  <p className="text-xs text-slate-300">
                    Sede Origen: {SUCURSALES.find(s => s.id === dispatchingTransfer.origenSucursalId)?.nombre}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDispatchingTransfer(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="p-5 sm:p-6 space-y-4">
              
              <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-bold block">Producto a Despachar:</span>
                  <div className="font-extrabold text-slate-900 text-sm">
                    {MEDICAMENTOS.find(m => m.id === dispatchingTransfer.medicamentoId)?.nombreComercial}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 font-bold block">Cantidad:</span>
                  <span className="font-mono font-black text-blue-950 text-base">
                    {dispatchingTransfer.cantidadSugerida} Cajas
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-700 block mb-1">
                    Nombre del Conductor:
                  </label>
                  <input
                    type="text"
                    value={dispatchForm.conductor}
                    onChange={(e) => setDispatchForm(prev => ({ ...prev, conductor: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-700 block mb-1">
                    Licencia de Conducir:
                  </label>
                  <input
                    type="text"
                    value={dispatchForm.licenciaConducir}
                    onChange={(e) => setDispatchForm(prev => ({ ...prev, licenciaConducir: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-700 block mb-1">
                    Placa del Vehículo:
                  </label>
                  <input
                    type="text"
                    value={dispatchForm.placaVehiculo}
                    onChange={(e) => setDispatchForm(prev => ({ ...prev, placaVehiculo: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-700 block mb-1">
                    Precinto de Seguridad Valija:
                  </label>
                  <input
                    type="text"
                    value={dispatchForm.precintoSeguridad}
                    onChange={(e) => setDispatchForm(prev => ({ ...prev, precintoSeguridad: e.target.value }))}
                    className="w-full bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 font-mono font-black text-amber-950 outline-none focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-700 block mb-1">
                  Temperatura de Despacho (°C):
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={dispatchForm.temperaturaDespacho}
                    onChange={(e) => setDispatchForm(prev => ({ ...prev, temperaturaDespacho: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 outline-none focus:bg-white"
                    required
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap font-medium">
                    (Rango DIGEMID 15°C - 25°C)
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 font-medium">
                ⚠️ <strong>Aviso Legal SUNAT:</strong> Al presionar "Emitir GRE y Despachar", el sistema descontará automáticamente las {dispatchingTransfer.cantidadSugerida} cajas del inventario de la farmacia donante y generará la Guía Electrónica con código QR legal.
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setDispatchingTransfer(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition shadow-md cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>Emitir GRE y Despachar Valija</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: RECEPCIÓN Y EMISIÓN DE GUÍA DE ENTRADA DIGEMID (BPA)
          ========================================================================= */}
      {receivingTransfer && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setReceivingTransfer(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-5 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-400/30">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    Fase 3: Recepción BPA DIGEMID
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white mt-1">
                    Acta de Recepción y Guía de Entrada
                  </h3>
                  <p className="text-xs text-slate-300">
                    Sede Receptora: {SUCURSALES.find(s => s.id === receivingTransfer.destinoSucursalId)?.nombre}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setReceivingTransfer(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReceive} className="p-5 sm:p-6 space-y-4">
              
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-bold block">Producto Recibido:</span>
                  <div className="font-extrabold text-slate-900 text-sm">
                    {MEDICAMENTOS.find(m => m.id === receivingTransfer.medicamentoId)?.nombreComercial}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Precinto declarado: <strong>{receivingTransfer.guiaSalida?.precintoSeguridad}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 font-bold block">Conteo Físico:</span>
                  <span className="font-mono font-black text-emerald-900 text-base">
                    +{receivingTransfer.cantidadSugerida} Cajas
                  </span>
                </div>
              </div>

              {/* Checklist de Verificación BPA */}
              <div className="space-y-2 text-xs">
                <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider block">
                  Protocolo de Inspección en Ventanilla (BPA DIGEMID):
                </span>

                <label className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={receptionForm.checkCount}
                    onChange={(e) => setReceptionForm(prev => ({ ...prev, checkCount: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 rounded"
                    required
                  />
                  <span className="text-slate-800 font-bold">
                    Conteo conforme: Se contaron físicamente exactamente {receivingTransfer.cantidadSugerida} cajas sin faltantes ni sobrantes.
                  </span>
                </label>

                <label className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={receptionForm.checkSeal}
                    onChange={(e) => setReceptionForm(prev => ({ ...prev, checkSeal: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 rounded"
                    required
                  />
                  <span className="text-slate-800 font-bold">
                    Precinto intacto: El precinto de valija no presenta roturas, manipulación ni cortes.
                  </span>
                </label>

                <label className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={receptionForm.checkTemp}
                    onChange={(e) => setReceptionForm(prev => ({ ...prev, checkTemp: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 rounded"
                    required
                  />
                  <span className="text-slate-800 font-bold">
                    Cadena térmica conforme: Temperatura al arribo dentro del estándar 15°C - 25°C.
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-700 block mb-1">
                    Químico Farmacéutico Receptor:
                  </label>
                  <input
                    type="text"
                    value={receptionForm.qfReceptor}
                    onChange={(e) => setReceptionForm(prev => ({ ...prev, qfReceptor: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 outline-none focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-700 block mb-1">
                    Temperatura Registrada (°C):
                  </label>
                  <input
                    type="text"
                    value={receptionForm.temperaturaLlegada}
                    onChange={(e) => setReceptionForm(prev => ({ ...prev, temperaturaLlegada: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 outline-none focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-700 block mb-1">
                  Observaciones Técnicas en Acta:
                </label>
                <input
                  type="text"
                  value={receptionForm.observaciones}
                  onChange={(e) => setReceptionForm(prev => ({ ...prev, observaciones: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setReceivingTransfer(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Firmar Acta y Sumar Stock</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: VISOR EXPEDIENTE DIGITAL SUNAT & DIGEMID (Guía Salida & Entrada)
          ========================================================================= */}
      {selectedGuiaTraslado && (
        <GuiaRemisionModal 
          traslado={selectedGuiaTraslado} 
          initialTab={initialGuiaTab}
          onClose={() => setSelectedGuiaTraslado(null)} 
        />
      )}

    </div>
  );
}
