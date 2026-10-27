import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Phone, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Map,
  Cloud,
  Layers,
  Sparkles,
  Info,
  Tag,
  Check,
  Building2,
  ExternalLink
} from 'lucide-react';
import { 
  MEDICAMENTOS, 
  INVENTARIO_DATA, 
  getSucursalesCercanas,
  getMedicineImageUrl,
  CLOUDFLARE_R2_CONFIG,
  createTransferOrder 
} from '../services/mockData';
import { sanitizeInput } from '../services/securityUtils';
import RouteMapModal from '../components/RouteMapModal';
import TransferRequestModal from '../components/TransferRequestModal';

export default function InventorySearchPage({ currentBranch, onSelectTransfer }) {
  const [, setForceUpdate] = useState(0);
  useEffect(() => {
    const onDataUpdated = () => setForceUpdate(v => v + 1);
    window.addEventListener('siip:data_updated', onDataUpdated);
    return () => window.removeEventListener('siip:data_updated', onDataUpdated);
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedId, setSelectedMedId] = useState(101);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'MARCA' | 'GENERICO'
  const [requestSuccessMsg, setRequestSuccessMsg] = useState(null);
  const [dataVersion, setDataVersion] = useState(0);

  // Sincronización reactiva con cambios de inventario
  React.useEffect(() => {
    const handleUpdate = () => setDataVersion(v => v + 1);
    window.addEventListener('siip:data_updated', handleUpdate);
    return () => window.removeEventListener('siip:data_updated', handleUpdate);
  }, []);
  
  // Estado para el modal de minimapa de geolocalización y guía de ruta
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedTargetBranch, setSelectedTargetBranch] = useState(null);

  // Modal interactivo de Solicitud de Traslado con selector de cantidad
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedTransferBranch, setSelectedTransferBranch] = useState(null);

  // Control dinámico de sedes: ver 5, 10 o todas las 15 sedes del país con filtros
  const [branchLimit, setBranchLimit] = useState('ALL'); // 5 | 10 | 'ALL'
  const [branchRegionFilter, setBranchRegionFilter] = useState('ALL'); // 'ALL' | 'Lima' | 'Sur' | 'Norte' | 'Centro'
  const [branchSearch, setBranchSearch] = useState('');

  const cleanSearch = sanitizeInput(searchTerm);

  // Filtrado compuesto: Búsqueda de texto + Categoría terapéutica + Tipo (Marca vs Genérico)
  const filteredMeds = MEDICAMENTOS.filter(m => {
    const matchSearch = 
      m.nombreComercial.toLowerCase().includes(cleanSearch.toLowerCase()) ||
      m.principioActivo.toLowerCase().includes(cleanSearch.toLowerCase()) ||
      m.marcaComercial.toLowerCase().includes(cleanSearch.toLowerCase()) ||
      (m.familia && m.familia.toLowerCase().includes(cleanSearch.toLowerCase())) ||
      m.codigoEAN.includes(cleanSearch);
    
    const medCat = m.categoria || m.familia || 'Medicamentos';
    const matchCategory = filterCategory === 'ALL' || medCat === filterCategory;
    const matchType = filterType === 'ALL' || m.tipoProducto === filterType;

    return matchSearch && matchCategory && matchType;
  });

  const activeMed = MEDICAMENTOS.find(m => m.id === selectedMedId) || MEDICAMENTOS[0];
  const localInv = (INVENTARIO_DATA[currentBranch.id] || []).find(i => i.medicamentoId === activeMed.id);
  const localStock = localInv ? localInv.stockActual : 0;
  const localEstado = localInv ? localInv.estado : 'SIN_STOCK';

  // Variantes de la misma familia terapéutica (ej. Amoxidal, Trixan, Amoxicilina Genérica, etc.)
  const familyVariants = MEDICAMENTOS.filter(m => m.familia === activeMed.familia);

  const allNearbyBranches = getSucursalesCercanas(currentBranch.id, activeMed.id, null);
  
  const filteredNearbyBranches = allNearbyBranches.filter(b => {
    // Filtro por macrorregión
    if (branchRegionFilter === 'Lima' && !b.departamento?.includes('Lima')) return false;
    if (branchRegionFilter === 'Sur' && b.departamento !== 'Arequipa' && b.departamento !== 'Cusco') return false;
    if (branchRegionFilter === 'Norte' && b.departamento !== 'La Libertad' && b.departamento !== 'Lambayeque') return false;
    if (branchRegionFilter === 'Centro' && b.departamento !== 'Junín') return false;

    // Filtro por término de búsqueda en sedes
    if (branchSearch.trim()) {
      const q = branchSearch.toLowerCase();
      const match = 
        b.nombre.toLowerCase().includes(q) ||
        b.distrito.toLowerCase().includes(q) ||
        b.direccion.toLowerCase().includes(q) ||
        (b.departamento && b.departamento.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const displayedNearbyBranches = branchLimit === 'ALL' 
    ? filteredNearbyBranches 
    : filteredNearbyBranches.slice(0, Number(branchLimit));
  const categories = ['ALL', ...new Set(MEDICAMENTOS.map(m => m.categoria || m.familia || 'Medicamentos').filter(Boolean))];

  const handleOpenRouteMap = (targetBranch) => {
    setSelectedTargetBranch(targetBranch);
    setMapModalOpen(true);
  };

  const handleOpenTransferModal = (targetBranch) => {
    setSelectedTransferBranch(targetBranch);
    setIsTransferModalOpen(true);
  };

  const handleConfirmTransfer = (transferPayload) => {
    let newTransfer;
    if (transferPayload.isExpress !== false) {
      newTransfer = executeDirectTransfer(transferPayload);
      setRequestSuccessMsg(
        `¡Traslado Express completado con éxito! Se transfirieron ${newTransfer.cantidadSugerida} cajas de ${activeMed.nombreComercial} desde ${selectedTransferBranch?.nombre || 'Sede Donante'}. Stock actualizado y persistido en el sistema (Guía GRE SUNAT ${newTransfer.guiaSalida?.numeroGuia}).`
      );
    } else {
      newTransfer = createTransferOrder(transferPayload);
      setRequestSuccessMsg(
        `¡Solicitud registrada para transferir ${newTransfer.cantidadSugerida} cajas de ${activeMed.nombreComercial} desde ${selectedTransferBranch?.nombre || 'Sede Donante'}!`
      );
    }

    if (onSelectTransfer) {
      onSelectTransfer(newTransfer);
    }

    setTimeout(() => setRequestSuccessMsg(null), 6000);
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* Header Bar Principal con Alto Contraste y Cobertura Completa */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Navigation className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>Caso de Uso CU01 • Red Nacional Farmacias Peruanas (15 Sedes)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Consulta de Inventario Multisede, Marcas y Geolocalización
          </h1>
          <p className="text-sm font-medium text-slate-700 mt-1">
            Distinga entre <strong>Marcas Comerciales</strong> y <strong>Genéricos DCI</strong>, consulte fotos en <strong>Cloudflare R2</strong> y oriente al paciente con el minimapa nacional.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Badge Cloudflare R2 con enlace público verificado */}
          <a
            href={CLOUDFLARE_R2_CONFIG.publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3.5 py-2 rounded-2xl text-xs text-amber-950 font-bold transition shadow-xs"
            title="Ver bucket público de Cloudflare R2 configurado en .env"
          >
            <Cloud className="w-4 h-4 text-amber-600" />
            <span>Cloudflare R2: <strong>/{CLOUDFLARE_R2_CONFIG.bucketName}</strong></span>
            <ExternalLink className="w-3 h-3 text-amber-700" />
          </a>

          <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-2xl text-xs text-blue-950 font-bold">
            <MapPin className="w-4 h-4 text-blue-700" />
            <span>Red Nacional: <strong>15 Sedes en Perú</strong></span>
          </div>
        </div>
      </div>

      {requestSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center justify-between text-sm font-bold shadow-sm">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{requestSuccessMsg}</span>
          </div>
        </div>
      )}

      {/* Grid Principal: Columna Izquierda (Buscador y Lista) + Columna Derecha (Ficha y Tabla de Sedes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start w-full">
        
        {/* COLUMNA IZQUIERDA: Buscador, Filtros y Lista de Fármacos */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
            {/* Input de Búsqueda */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Buscar por nombre, principio activo o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>

            {/* Selector de Tipo: Marca Comercial vs Genérico */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
              <button
                onClick={() => setFilterType('ALL')}
                className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                  filterType === 'ALL' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos ({MEDICAMENTOS.length})
              </button>
              <button
                onClick={() => setFilterType('MARCA')}
                className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                  filterType === 'MARCA' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏷️ De Marca
              </button>
              <button
                onClick={() => setFilterType('GENERICO')}
                className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                  filterType === 'GENERICO' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🧬 Genéricos
              </button>
            </div>

            {/* Categorías Terapéuticas */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-semibold">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                    filterCategory === cat
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat === 'ALL' ? 'Todas las Categorías' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Fármacos con Foto Real, Marca y Tipografía de Alto Contraste */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
            {filteredMeds.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No se encontraron medicamentos para el criterio ingresado.
              </div>
            ) : (
              filteredMeds.map(med => {
                const isSelected = med.id === activeMed.id;
                const inv = (INVENTARIO_DATA[currentBranch.id] || []).find(i => i.medicamentoId === med.id);
                const stock = inv ? inv.stockActual : 0;
                const isLow = stock <= med.umbralMinimo;
                const isMarca = med.tipoProducto === 'MARCA';

                return (
                  <div
                    key={med.id}
                    onClick={() => setSelectedMedId(med.id)}
                    className={`p-3.5 cursor-pointer transition flex items-center space-x-3.5 ${
                      isSelected 
                        ? "bg-blue-50/90 border-l-4 border-blue-600" 
                        : "hover:bg-slate-50"
                    }`}
                  >
                    {/* Caja / Foto de Envase Real */}
                    <div className="w-14 h-14 rounded-xl bg-white p-1 border border-slate-200 overflow-hidden shrink-0 shadow-xs flex items-center justify-center">
                      <img
                        src={getMedicineImageUrl(med)}
                        alt={med.nombreComercial}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                          isMarca ? 'bg-purple-100 text-purple-900 border border-purple-200' : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}>
                          {isMarca ? 'Marca' : 'Genérico'}
                        </span>
                        <span className="text-[11px] font-bold text-slate-600">
                          {med.laboratorio}
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm font-extrabold text-slate-900 truncate mt-0.5">
                        {med.nombreComercial}
                      </div>
                      <div className="text-xs text-slate-600 truncate">
                        {med.presentacion}
                      </div>
                      <div className="text-xs text-blue-700 font-mono font-bold mt-0.5">
                        S/. {med.precioUnitario.toFixed(2)}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-mono font-extrabold px-2.5 py-1 rounded-full block ${
                        isLow ? "bg-red-100 text-red-800 border border-red-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}>
                        {stock} cjs
                      </span>
                      <span className="text-[10px] text-slate-600 font-bold block mt-1">en mi sede</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* COLUMNA DERECHA: Ficha de Producto Activo y Tabla de Disponibilidad Georreferenciada */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          
          {/* Tarjeta Ejecutiva del Producto Seleccionado (Fondo Claro con Alto Contraste) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              
              <div className="flex items-center space-x-4">
                {/* Imagen del Envase Real Ampliada */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 p-2 border-2 border-slate-200 shrink-0 shadow-sm flex items-center justify-center">
                  <img
                    src={getMedicineImageUrl(activeMed)}
                    alt={activeMed.nombreComercial}
                    className="w-full h-full object-contain hover:scale-105 transition duration-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80";
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-lg border border-blue-200">
                      {activeMed.categoria}
                    </span>
                    <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${
                      activeMed.tipoProducto === 'MARCA' 
                        ? 'bg-purple-100 text-purple-900 border-purple-300' 
                        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}>
                      {activeMed.tipoProducto === 'MARCA' ? `🏷️ Marca: ${activeMed.marcaComercial}` : '🧬 Genérico Oficial (DCI)'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      EAN: {activeMed.codigoEAN}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {activeMed.nombreComercial}
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700">
                    {activeMed.principioActivo} • {activeMed.presentacion}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    Laboratorio: <strong className="text-slate-900">{activeMed.laboratorio}</strong> • Registro Sanitario DIGEMID: <strong className="text-slate-900">{activeMed.registroSanitario}</strong>
                  </p>
                </div>
              </div>

              {/* Indicador de Stock en Sede del Usuario */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl text-center min-w-[140px] shrink-0 shadow-md">
                <span className="text-[11px] text-slate-300 block font-bold uppercase tracking-wider">Stock en mi Sede</span>
                <span className="text-3xl font-black font-mono text-emerald-400 my-0.5 block">{localStock}</span>
                <span className="text-xs text-slate-200 font-semibold block">cajas disponibles</span>
              </div>

            </div>

            {/* Selector Rápido de Variantes / Marcas de la Misma Familia (Amoxidal, Trixan, Genérico) */}
            {familyVariants.length > 1 && (
              <div className="pt-3 border-t border-slate-200">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Opciones terapéuticas de {activeMed.familia} (Marca vs. Genérico):</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {familyVariants.map(variant => {
                    const isCurrent = variant.id === activeMed.id;
                    const varInv = (INVENTARIO_DATA[currentBranch.id] || []).find(i => i.medicamentoId === variant.id);
                    const varStock = varInv ? varInv.stockActual : 0;
                    const isMarca = variant.tipoProducto === 'MARCA';

                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedMedId(variant.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer border ${
                          isCurrent
                            ? "bg-blue-600 text-white border-blue-700 shadow-sm ring-2 ring-blue-300"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isMarca ? 'bg-purple-400' : 'bg-emerald-400'}`} />
                        <span>{variant.nombreComercial}</span>
                        <span className={`text-[11px] font-mono font-extrabold px-1.5 py-0.5 rounded ${
                          isCurrent ? "bg-blue-800 text-white" : "bg-slate-200 text-slate-700"
                        }`}>
                          {varStock} cjs
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* TABLA COMPARATIVA DE DISPONIBILIDAD EN SEDES CON FILTRO Y SCROLL COMPLETO */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Header de la Tabla con Filtros Dinámicos de Visualización */}
            <div className="p-4 sm:p-5 border-b border-slate-200 space-y-3 bg-slate-50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Disponibilidad en Sedes de la Red ({displayedNearbyBranches.length} de {allNearbyBranches.length} disponibles)</span>
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    Haga scroll hacia abajo para explorar toda la red. Clic en <strong>"Ruta &amp; Mapa"</strong> para geolocalización o <strong>"Solicitar Traslado"</strong>.
                  </p>
                </div>

                {/* Selector de Límite de Sedes */}
                <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-black uppercase text-slate-500 px-1.5">Ver:</span>
                  <button
                    onClick={() => setBranchLimit(5)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      branchLimit === 5 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    5 Sedes
                  </button>
                  <button
                    onClick={() => setBranchLimit(10)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      branchLimit === 10 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    10 Sedes
                  </button>
                  <button
                    onClick={() => setBranchLimit('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      branchLimit === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todas ({allNearbyBranches.length})
                  </button>
                </div>
              </div>

              {/* Filtros por Macrorregión y Búsqueda Rápida en Sedes */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-1 border-t border-slate-200/70">
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-bold">
                  <span className="text-[10px] uppercase text-slate-500">Región:</span>
                  <button
                    onClick={() => setBranchRegionFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                      branchRegionFilter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    Nacional (Todas)
                  </button>
                  <button
                    onClick={() => setBranchRegionFilter('Lima')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                      branchRegionFilter === 'Lima' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    Lima Metro
                  </button>
                  <button
                    onClick={() => setBranchRegionFilter('Sur')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                      branchRegionFilter === 'Sur' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    Sur (Arequipa / Cusco)
                  </button>
                  <button
                    onClick={() => setBranchRegionFilter('Norte')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                      branchRegionFilter === 'Norte' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    Norte (Trujillo / Chiclayo)
                  </button>
                  <button
                    onClick={() => setBranchRegionFilter('Centro')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                      branchRegionFilter === 'Centro' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    Centro (Huancayo)
                  </button>
                </div>

                <div className="relative w-full sm:w-56 shrink-0">
                  <input
                    type="text"
                    placeholder="Filtrar por distrito o sede..."
                    value={branchSearch}
                    onChange={(e) => setBranchSearch(e.target.value)}
                    className="w-full pl-3 pr-2 py-1 text-xs font-medium bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Contenedor con Scroll Vertical para explorar todas las 15 sedes */}
            <div className="overflow-x-auto max-h-[620px] overflow-y-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
                <thead className="bg-slate-100 text-slate-800 font-extrabold uppercase text-[11px] tracking-wider sticky top-0 z-10 shadow-xs">
                  <tr>
                    <th className="px-3 py-3.5 text-center">N°</th>
                    <th className="px-4 py-3.5 text-left">Marca y Sucursal</th>
                    <th className="px-4 py-3.5 text-left">Dirección y Distrito</th>
                    <th className="px-3 py-3.5 text-center">Distancia</th>
                    <th className="px-3 py-3.5 text-center">Stock</th>
                    <th className="px-3 py-3.5 text-center">Autonomía</th>
                    <th className="px-3 py-3.5 text-center">Estado</th>
                    <th className="px-4 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {displayedNearbyBranches.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500 font-semibold">
                        No se encontraron sucursales para el filtro seleccionado.
                      </td>
                    </tr>
                  ) : (
                    displayedNearbyBranches.map((branch, idx) => {
                    const isOverstock = branch.estadoStock === 'SOBRESTOCK';
                    const isMifarma = branch.marca === 'Mifarma';

                    return (
                      <tr key={branch.id} className="hover:bg-blue-50/40 transition">
                        <td className="px-3 py-4 text-center font-extrabold text-slate-500">
                          #{idx + 1}
                        </td>
                        
                        {/* Marca InkaFarma / Mifarma con Alto Contraste */}
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                              isMifarma ? "bg-[#D32F2F] text-white" : "bg-[#002B66] text-[#FFD100]"
                            }`}>
                              {branch.marca}
                            </span>
                            <span className="font-extrabold text-slate-900">{branch.nombre}</span>
                          </div>
                          <div className="text-xs text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{branch.telefono}</span>
                          </div>
                        </td>

                        {/* Dirección y Distrito con Letras Visibles */}
                        <td className="px-4 py-4 text-slate-700">
                          <div className="font-bold text-slate-900">{branch.direccion}</div>
                          <div className="text-xs text-slate-600 font-medium">
                            Distrito: <strong className="text-slate-800">{branch.distrito}</strong> • {branch.referencia || 'Zona comercial'}
                          </div>
                        </td>

                        {/* Distancia */}
                        <td className="px-3 py-4 text-center">
                          <span className="bg-blue-50 text-blue-900 font-mono font-extrabold px-2.5 py-1 rounded-xl border border-blue-200 text-xs">
                            {branch.distanciaKm} km
                          </span>
                        </td>

                        {/* Stock Disponible */}
                        <td className="px-3 py-4 text-center font-mono font-black text-sm text-slate-900">
                          {branch.stock} cjs
                        </td>

                        {/* Autonomía */}
                        <td className="px-3 py-4 text-center font-bold text-slate-700">
                          {branch.diasAutonomia} d
                        </td>

                        {/* Estado */}
                        <td className="px-3 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full font-extrabold text-[11px] uppercase tracking-wide border ${
                            isOverstock 
                              ? 'bg-purple-100 text-purple-900 border-purple-300' 
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}>
                            {branch.estadoStock.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Acciones: Botón Ruta y Botón Solicitar */}
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {/* BOTÓN RUTA Y MINIMAPA */}
                            <button
                              onClick={() => handleOpenRouteMap(branch)}
                              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl font-bold text-xs bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-800 border border-slate-300 transition cursor-pointer shadow-xs"
                              title="Ver en minimapa y orientar al paciente"
                            >
                              <Map className="w-3.5 h-3.5 text-blue-600" />
                              <span>Ruta &amp; Mapa</span>
                            </button>

                            {/* BOTÓN SOLICITAR TRASLADO CON SELECTOR DE CANTIDAD */}
                            <button
                              onClick={() => handleOpenTransferModal(branch)}
                              disabled={branch.stock === 0}
                              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-extrabold text-xs transition shadow-xs cursor-pointer ${
                                isOverstock 
                                  ? "bg-emerald-700 hover:bg-emerald-800 text-white" 
                                  : "bg-blue-600 hover:bg-blue-700 text-white"
                              }`}
                              title="Solicitar cantidad exacta de cajas"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Solicitar Traslado</span>
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  }))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL DE MINIMAPA Y GUÍA DE RUTA PARA EL PACIENTE */}
      {mapModalOpen && selectedTargetBranch && (
        <RouteMapModal
          isOpen={mapModalOpen}
          onClose={() => setMapModalOpen(false)}
          sourceBranch={currentBranch}
          targetBranch={selectedTargetBranch}
          medicine={activeMed}
        />
      )}

      {/* MODAL DE SOLICITUD DE TRASLADO INTERACTIVA CON SELECTOR DE CANTIDAD */}
      {isTransferModalOpen && activeMed && (
        <TransferRequestModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          medicine={activeMed}
          currentBranch={currentBranch}
          initialTargetBranch={selectedTransferBranch}
          onConfirmTransfer={handleConfirmTransfer}
        />
      )}

    </div>
  );
}
