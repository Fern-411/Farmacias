import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  Navigation,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit3,
  Eye,
  RefreshCw,
  FileText,
  Warehouse,
  Store,
  Clock,
  UserCheck,
  Layers,
  Compass,
  Sparkles,
  X,
  Save,
  Check,
  TrendingUp,
  Boxes
} from 'lucide-react';
import {
  SUCURSALES,
  getAllBranches,
  addNewBranch,
  updateExistingBranch,
  MEDICAMENTOS,
  INVENTARIO_DATA
} from '../services/mockData';

export default function BranchManagementPage({
  currentBranch,
  onSelectBranch,
  onNavigate
}) {
  const [branches, setBranches] = useState(() => getAllBranches());
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modales
  const [selectedBranchForModal, setSelectedBranchForModal] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Sincronizar datos reactivamente si cambian en otra vista
  useEffect(() => {
    const handleUpdate = () => {
      setBranches([...getAllBranches()]);
    };
    window.addEventListener('siip:data_updated', handleUpdate);
    return () => window.removeEventListener('siip:data_updated', handleUpdate);
  }, []);

  // Formulario de edición o creación
  const initialFormData = {
    id: null,
    marca: 'InkaFarma',
    nombre: '',
    codigo: '',
    direccion: '',
    distrito: 'San Isidro',
    departamento: 'Lima',
    telefono: '(01) 314-2020',
    lat: -12.0950,
    lng: -77.0320,
    esCentroDistribucion: false,
    referencia: '',
    instruccionRuta: '',
    directorTecnico: 'QF. Ronny Mendoza Paucar (CQFP 28491)',
    horarioAtencion: '24 Horas (Atención Continua)',
    registroDigemid: 'EE-FAR-2026-8840',
    tiempoEstimadoAutoMin: 10,
    tiempoEstimadoPieMin: 25
  };
  const [formData, setFormData] = useState(initialFormData);

  // Clasificación de región para cada sede
  const getBranchRegion = (b) => {
    const dep = (b.departamento || '').toLowerCase();
    if (dep.includes('lima') || dep.includes('callao')) return 'Lima Metropolitana';
    if (dep.includes('arequipa') || dep.includes('cusco') || dep.includes('puno') || dep.includes('tacna')) return 'Macro Sur';
    if (dep.includes('libertad') || dep.includes('lambayeque') || dep.includes('piura') || dep.includes('trujillo') || dep.includes('chiclayo')) return 'Macro Norte';
    if (dep.includes('junín') || dep.includes('junin') || dep.includes('huancayo') || dep.includes('ayacucho')) return 'Macro Centro';
    return 'Otras Regiones';
  };

  // Filtrado
  const filteredBranches = useMemo(() => {
    return branches.filter(b => {
      // Filtro marca
      if (brandFilter === 'InkaFarma' && b.marca !== 'InkaFarma') return false;
      if (brandFilter === 'Mifarma' && b.marca !== 'Mifarma') return false;
      if (brandFilter === 'CD' && !b.esCentroDistribucion) return false;

      // Filtro región
      if (regionFilter !== 'ALL') {
        const reg = getBranchRegion(b);
        if (reg !== regionFilter) return false;
      }

      // Filtro de búsqueda
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = (b.nombre || '').toLowerCase().includes(q);
        const matchCode = (b.codigo || '').toLowerCase().includes(q);
        const matchDist = (b.distrito || '').toLowerCase().includes(q);
        const matchDep = (b.departamento || '').toLowerCase().includes(q);
        const matchDir = (b.direccion || '').toLowerCase().includes(q);
        const matchQF = (b.directorTecnico || '').toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchDist && !matchDep && !matchDir && !matchQF) {
          return false;
        }
      }

      return true;
    });
  }, [branches, brandFilter, regionFilter, searchTerm]);

  // Métricas
  const stats = useMemo(() => {
    const total = branches.length;
    const inkafarmaCount = branches.filter(b => b.marca === 'InkaFarma').length;
    const mifarmaCount = branches.filter(b => b.marca === 'Mifarma').length;
    const cdCount = branches.filter(b => b.esCentroDistribucion).length;
    const depts = new Set(branches.map(b => b.departamento)).size;
    return { total, inkafarmaCount, mifarmaCount, cdCount, depts };
  }, [branches]);

  // Manejar apertura de modal de creación
  const handleOpenCreateModal = () => {
    const nextCode = 'SUC-' + String(branches.length + 1).padStart(3, '0');
    setEditingBranch(null);
    setFormData({
      ...initialFormData,
      codigo: nextCode,
      registroDigemid: `EE-FAR-2026-${Math.floor(1000 + Math.random() * 9000)}`
    });
    setIsEditModalOpen(true);
  };

  // Manejar apertura de modal de edición
  const handleOpenEditModal = (branch) => {
    setEditingBranch(branch);
    setFormData({
      id: branch.id,
      marca: branch.marca || 'InkaFarma',
      nombre: branch.nombre || '',
      codigo: branch.codigo || '',
      direccion: branch.direccion || '',
      distrito: branch.distrito || '',
      departamento: branch.departamento || 'Lima',
      telefono: branch.telefono || '',
      lat: branch.lat || -12.09,
      lng: branch.lng || -77.03,
      esCentroDistribucion: !!branch.esCentroDistribucion,
      referencia: branch.referencia || '',
      instruccionRuta: branch.instruccionRuta || '',
      directorTecnico: branch.directorTecnico || 'QF. Ronny Mendoza Paucar (CQFP 28491)',
      horarioAtencion: branch.horarioAtencion || '24 Horas (Atención Continua)',
      registroDigemid: branch.registroDigemid || 'EE-FAR-2026-8840',
      tiempoEstimadoAutoMin: branch.tiempoEstimadoAutoMin || 10,
      tiempoEstimadoPieMin: branch.tiempoEstimadoPieMin || 25
    });
    setIsEditModalOpen(true);
  };

  // Guardar sede (Crear o Editar)
  const handleSaveBranch = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.direccion.trim()) {
      alert('Por favor ingrese el nombre y la dirección de la sede.');
      return;
    }

    if (editingBranch) {
      updateExistingBranch(editingBranch.id, formData);
      setSaveSuccessMsg(`¡Sede "${formData.nombre}" actualizada con éxito!`);
    } else {
      const created = addNewBranch(formData);
      setSaveSuccessMsg(`¡Sede "${created.nombre}" registrada en el sistema!`);
    }

    setBranches([...getAllBranches()]);
    setTimeout(() => {
      setIsEditModalOpen(false);
      setSaveSuccessMsg('');
    }, 1200);
  };

  // Presets de coordenadas para ciudades peruanas
  const handleApplyPresetCoords = (city) => {
    switch(city) {
      case 'Lima':
        setFormData(p => ({ ...p, departamento: 'Lima', distrito: 'Miraflores', lat: -12.1192, lng: -77.0290 }));
        break;
      case 'Arequipa':
        setFormData(p => ({ ...p, departamento: 'Arequipa', distrito: 'Arequipa', lat: -16.3988, lng: -71.5369 }));
        break;
      case 'Cusco':
        setFormData(p => ({ ...p, departamento: 'Cusco', distrito: 'Cusco', lat: -13.5183, lng: -71.9772 }));
        break;
      case 'Trujillo':
        setFormData(p => ({ ...p, departamento: 'La Libertad', distrito: 'Trujillo', lat: -8.1118, lng: -79.0287 }));
        break;
      case 'Chiclayo':
        setFormData(p => ({ ...p, departamento: 'Lambayeque', distrito: 'Chiclayo', lat: -6.7714, lng: -79.8409 }));
        break;
      case 'Huancayo':
        setFormData(p => ({ ...p, departamento: 'Junín', distrito: 'Huancayo', lat: -12.0683, lng: -75.2100 }));
        break;
      default:
        break;
    }
  };

  // Obtener inventario de una sede específica
  const getBranchInventorySummary = (branchId) => {
    const inv = INVENTARIO_DATA[branchId] || [];
    const totalSkus = inv.length;
    const totalUnits = inv.reduce((acc, i) => acc + (i.stockActual || 0), 0);
    const criticals = inv.filter(i => i.estado === 'CRITICO' || i.stockActual <= (i.stockSeguridad * 0.5)).length;
    const overstock = inv.filter(i => i.estado === 'SOBRESTOCK' || i.stockActual >= (i.stockSeguridad * 2)).length;
    return { totalSkus, totalUnits, criticals, overstock, items: inv };
  };

  return (
    <div className="w-full space-y-6">

      {/* HEADER PRINCIPAL */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1.5">
            <span className="p-2.5 bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-xl shadow-md">
              <Building2 className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Gestión de Sedes, Sucursales y Centros de Distribución
                </h1>
                <span className="bg-cyan-100 text-cyan-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-cyan-200">
                  {branches.length} Sedes a Nivel Nacional
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                Red integrada InkaFarma & Mifarma (Intercorp Retail) con certificación BPA DIGEMID R.M. 833-2015/MINSA y geolocalización satelital WGS84.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end lg:self-center">
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-sm px-4 py-2.5 rounded-xl shadow-md transition transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Nueva Sede</span>
          </button>
        </div>
      </div>

      {/* TARJETAS DE KPIS Y RESUMEN ESTRATÉGICO */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sedes</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.total}</div>
          <div className="text-[11px] text-blue-700 font-bold mt-1">100% Interoperables</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Red InkaFarma</span>
            <Store className="w-4 h-4 text-blue-800" />
          </div>
          <div className="text-2xl font-black text-[#002B66]">{stats.inkafarmaCount}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Dispensación Farmacéutica</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Red Mifarma</span>
            <Store className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-600">{stats.mifarmaCount}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Locales Comerciales</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Centro Distribución</span>
            <Warehouse className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700">{stats.cdCount} CD</div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-1">Huachipa Central (24/7)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Regiones Perú</span>
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{stats.depts} Deptos.</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Lima, Sur, Norte, Centro</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">DIGEMID BPA</span>
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-cyan-700">100%</div>
          <div className="text-[11px] text-cyan-600 font-semibold mt-1">R.M. 833-2015 Certif.</div>
        </div>
      </div>

      {/* BARRA DE FILTROS Y CONTROLES */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Input de Búsqueda */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por sede, distrito, código o Q.F..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filtros de Marca y Región */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Marca */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setBrandFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                brandFilter === 'ALL' ? 'bg-white shadow-xs text-blue-800' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas ({branches.length})
            </button>
            <button
              onClick={() => setBrandFilter('InkaFarma')}
              className={`px-3 py-1.5 rounded-lg transition ${
                brandFilter === 'InkaFarma' ? 'bg-[#002B66] text-[#FFD100] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              InkaFarma ({stats.inkafarmaCount})
            </button>
            <button
              onClick={() => setBrandFilter('Mifarma')}
              className={`px-3 py-1.5 rounded-lg transition ${
                brandFilter === 'Mifarma' ? 'bg-[#D32F2F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mifarma ({stats.mifarmaCount})
            </button>
            <button
              onClick={() => setBrandFilter('CD')}
              className={`px-3 py-1.5 rounded-lg transition ${
                brandFilter === 'CD' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CD Huachipa ({stats.cdCount})
            </button>
          </div>

          {/* Región Selector */}
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todas las Regiones</option>
            <option value="Lima Metropolitana">Lima Metropolitana (10)</option>
            <option value="Macro Sur">Macro Sur (Arequipa, Cusco)</option>
            <option value="Macro Norte">Macro Norte (Trujillo, Chiclayo)</option>
            <option value="Macro Centro">Macro Centro (Huancayo)</option>
          </select>

          {/* Toggle de Vista: Grid vs Table */}
          <div className="flex items-center space-x-1 border border-slate-200 rounded-xl p-1 bg-slate-50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'grid' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Vista en Tarjetas Cuadrícula"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'table' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Vista en Tabla Corporativa"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* VISTA 1: TARJETAS EN CUADRÍCULA (GRID) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredBranches.map((branch) => {
            const isCurrent = currentBranch && currentBranch.id === branch.id;
            const isMifarma = branch.marca === 'Mifarma';
            const isCD = !!branch.esCentroDistribucion;
            const regionName = getBranchRegion(branch);
            const invSummary = getBranchInventorySummary(branch.id);

            return (
              <div
                key={branch.id}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs flex flex-col justify-between overflow-hidden ${
                  isCurrent 
                    ? 'ring-2 ring-blue-600 border-blue-500 bg-blue-50/20' 
                    : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                {/* Cabecera de la Tarjeta */}
                <div className="p-5 space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        isCD
                          ? 'bg-indigo-900 text-cyan-300'
                          : isMifarma 
                            ? 'bg-[#D32F2F] text-white' 
                            : 'bg-[#002B66] text-[#FFD100]'
                      }`}>
                        {branch.marca}
                      </span>
                      <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {branch.codigo}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {regionName}
                      </span>
                    </div>

                    {isCurrent && (
                      <span className="flex items-center space-x-1 text-[11px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Sede Conectada</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {branch.nombre}
                    </h3>
                    <p className="text-xs text-slate-600 flex items-center space-x-1.5 mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{branch.direccion} — {branch.distrito}, {branch.departamento}</span>
                    </p>
                  </div>

                  {/* Detalles Técnicos y Horario */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center space-x-1 text-slate-500 font-semibold">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Director Técnico:</span>
                      </span>
                      <span className="font-extrabold text-slate-800 truncate max-w-[190px]">
                        {branch.directorTecnico || 'QF. Colegiado QF-28491'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center space-x-1 text-slate-500 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Horario:</span>
                      </span>
                      <span className="font-bold text-slate-700">
                        {branch.horarioAtencion || '24 Horas (Continuo)'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center space-x-1 text-slate-500 font-semibold">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Teléfono / Anexo:</span>
                      </span>
                      <span className="font-bold text-slate-700">
                        {branch.telefono}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                      <span className="flex items-center space-x-1 text-slate-500 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Certificación BPA:</span>
                      </span>
                      <span className="font-black text-cyan-700">
                        VIGENTE (DIGEMID)
                      </span>
                    </div>
                  </div>

                  {/* Mini Indicadores de Stock Local */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">SKUs</div>
                      <div className="font-black text-slate-900">{invSummary.totalSkus || MEDICAMENTOS.length}</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Cajas Total</div>
                      <div className="font-black text-blue-700">{invSummary.totalUnits} u.</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">GPS</div>
                      <div className="font-mono text-[10px] font-bold text-slate-600">
                        {Number(branch.lat).toFixed(2)}, {Number(branch.lng).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer y Acciones de la Tarjeta */}
                <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedBranchForModal(branch)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-extrabold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
                      title="Ver Ficha Técnica 360° con Mapa e Inventario"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ficha 360°</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(branch)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                      title="Editar datos de la sede"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                  </div>

                  {isCurrent ? (
                    <span className="text-xs font-black text-emerald-700 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                      Activa
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectBranch(branch)}
                      className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-extrabold transition shadow-xs cursor-pointer active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Conectar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VISTA 2: TABLA CORPORATIVA DETALLADA */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="max-h-[680px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-900 text-white sticky top-0 z-10 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3.5">Código</th>
                  <th className="px-4 py-3.5">Marca</th>
                  <th className="px-4 py-3.5">Nombre de la Sede</th>
                  <th className="px-4 py-3.5">Ubicación / Dirección</th>
                  <th className="px-4 py-3.5">Región</th>
                  <th className="px-4 py-3.5">Director Técnico</th>
                  <th className="px-4 py-3.5">Teléfono</th>
                  <th className="px-4 py-3.5 text-center">Estado</th>
                  <th className="px-4 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredBranches.map((branch) => {
                  const isCurrent = currentBranch && currentBranch.id === branch.id;
                  const isMifarma = branch.marca === 'Mifarma';
                  const isCD = !!branch.esCentroDistribucion;
                  const regionName = getBranchRegion(branch);

                  return (
                    <tr
                      key={branch.id}
                      className={`hover:bg-blue-50/40 transition ${
                        isCurrent ? 'bg-blue-50/60 font-semibold' : ''
                      }`}
                    >
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-600">
                        {branch.codigo}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                          isCD
                            ? 'bg-indigo-900 text-cyan-300'
                            : isMifarma 
                              ? 'bg-[#D32F2F] text-white' 
                              : 'bg-[#002B66] text-[#FFD100]'
                        }`}>
                          {branch.marca}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-extrabold text-slate-900">
                        {branch.nombre}
                      </td>

                      <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate">
                        {branch.direccion} ({branch.distrito}, {branch.departamento})
                      </td>

                      <td className="px-4 py-3.5 font-semibold text-slate-700">
                        {regionName}
                      </td>

                      <td className="px-4 py-3.5 text-slate-800 font-medium">
                        {branch.directorTecnico || 'QF. Mendoza P.'}
                      </td>

                      <td className="px-4 py-3.5 text-slate-600">
                        {branch.telefono}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        {isCurrent ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-black rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Conectada</span>
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded">
                            Operativa
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => setSelectedBranchForModal(branch)}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-extrabold rounded-lg text-xs transition"
                          title="Ficha 360°"
                        >
                          Ficha
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(branch)}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold rounded-lg text-xs transition"
                          title="Editar Sede"
                        >
                          Editar
                        </button>

                        {!isCurrent && (
                          <button
                            onClick={() => onSelectBranch(branch)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs transition shadow-xs"
                          >
                            Conectar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: FICHA TÉCNICA 360° DE LA SEDE */}
      {selectedBranchForModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedBranchForModal(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header del Modal */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider ${
                  selectedBranchForModal.marca === 'Mifarma' ? 'bg-[#D32F2F] text-white' : 'bg-[#002B66] text-[#FFD100]'
                }`}>
                  {selectedBranchForModal.marca}
                </span>
                <div>
                  <h2 className="text-xl font-black">{selectedBranchForModal.nombre}</h2>
                  <p className="text-xs text-slate-300">
                    Código: <span className="font-mono font-bold text-cyan-300">{selectedBranchForModal.codigo}</span> • {selectedBranchForModal.departamento}, Perú
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBranchForModal(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del Modal con Scroll */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Sección 1: Datos de Ubicación y Guía de Llegada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Datos de contacto y técnico */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Datos Técnicos & Regulatorios</span>
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 font-semibold block">Dirección Legal:</span>
                      <span className="font-extrabold text-slate-900">{selectedBranchForModal.direccion}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-semibold block">Referencia Peatonal:</span>
                      <span className="font-semibold text-slate-700">{selectedBranchForModal.referencia || 'Frente a zona comercial principal'}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-500 font-semibold block">Registro DIGEMID:</span>
                        <span className="font-mono font-bold text-cyan-700">{selectedBranchForModal.registroDigemid || 'EE-FAR-2026-8840'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">Certificado BPA:</span>
                        <span className="font-bold text-emerald-700">R.M. 833-2015 Homologado</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 font-semibold block">Director Técnico Responsable:</span>
                      <span className="font-extrabold text-blue-900">{selectedBranchForModal.directorTecnico || 'QF. Ronny Mendoza Paucar (CQFP 28491)'}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-semibold block">Horario de Funcionamiento:</span>
                      <span className="font-extrabold text-slate-800">{selectedBranchForModal.horarioAtencion || '24 Horas Continuo'}</span>
                    </div>
                  </div>
                </div>

                {/* Vista del Mapa OpenStreetMap y Georreferencia */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                      <Compass className="w-4 h-4 text-indigo-600" />
                      <span>Geolocalización Satelital (WGS84)</span>
                    </h4>

                    {/* Iframe OpenStreetMap centrado en la sede */}
                    <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-300 relative shadow-inner">
                      <iframe
                        title="Ubicación de Sede"
                        className="w-full h-full border-0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedBranchForModal.lng - 0.008}%2C${selectedBranchForModal.lat - 0.008}%2C${selectedBranchForModal.lng + 0.008}%2C${selectedBranchForModal.lat + 0.008}&layer=mapnik&marker=${selectedBranchForModal.lat}%2C${selectedBranchForModal.lng}`}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-600">
                      Lat: {selectedBranchForModal.lat.toFixed(4)} | Lng: {selectedBranchForModal.lng.toFixed(4)}
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedBranchForModal.lat},${selectedBranchForModal.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-extrabold"
                    >
                      <span>Abrir en Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Sección 2: Inventario de Stock en esta Sede */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-black text-slate-800 uppercase">
                    <Boxes className="w-4 h-4 text-blue-600" />
                    <span>Inventario de Medicamentos y Productos en esta Sede</span>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">
                    Registros sincronizados en tiempo real
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="px-4 py-2">Medicamento / Producto</th>
                        <th className="px-4 py-2">Presentación</th>
                        <th className="px-4 py-2">Lote Principal</th>
                        <th className="px-4 py-2 text-right">Stock Actual</th>
                        <th className="px-4 py-2 text-center">Estado Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(INVENTARIO_DATA[selectedBranchForModal.id] || []).map((item) => {
                        const med = MEDICAMENTOS.find(m => m.id === item.medicamentoId);
                        if (!med) return null;
                        return (
                          <tr key={item.medicamentoId} className="hover:bg-slate-50">
                            <td className="px-4 py-2 font-extrabold text-slate-900">
                              {med.nombreComercial} ({med.principioActivo})
                            </td>
                            <td className="px-4 py-2 text-slate-600 font-medium">
                              {med.presentacion}
                            </td>
                            <td className="px-4 py-2 font-mono text-slate-600">
                              {item.lotePrincipal || 'LT-2026-X'}
                            </td>
                            <td className="px-4 py-2 text-right font-black text-blue-700">
                              {item.stockActual} cajas
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                item.stockActual >= (item.stockSeguridad * 2)
                                  ? 'bg-purple-100 text-purple-800'
                                  : item.stockActual <= (item.stockSeguridad * 0.5)
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {item.stockActual >= (item.stockSeguridad * 2)
                                  ? 'SOBRESTOCK'
                                  : item.stockActual <= (item.stockSeguridad * 0.5)
                                    ? 'CRÍTICO'
                                    : 'ÓPTIMO'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Footer del Modal */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Homologación DIGEMID • Sistema Interoperable InkaFarma & Mifarma
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedBranchForModal(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cerrar
                </button>
                {currentBranch?.id !== selectedBranchForModal.id && (
                  <button
                    onClick={() => {
                      onSelectBranch(selectedBranchForModal);
                      setSelectedBranchForModal(null);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition shadow-sm cursor-pointer"
                  >
                    Establecer como Sede Activa
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: CREACIÓN / EDICIÓN DE SEDE */}
      {isEditModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Cabecera */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-cyan-300" />
                <h3 className="text-lg font-black">
                  {editingBranch ? `Editar Sede: ${editingBranch.nombre}` : 'Registrar Nueva Sede Farmacéutica'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSaveBranch} className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {saveSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl flex items-center space-x-2 text-xs font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* Fila 1: Marca y Código */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Cadena / Marca *
                  </label>
                  <select
                    value={formData.marca}
                    onChange={(e) => setFormData(p => ({ ...p, marca: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="InkaFarma">InkaFarma</option>
                    <option value="Mifarma">Mifarma</option>
                    <option value="Intercorp Logistics">Intercorp Logistics (Centro de Distribución)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Código de Sede *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.codigo}
                    onChange={(e) => setFormData(p => ({ ...p, codigo: e.target.value }))}
                    placeholder="SUC-016"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Fila 2: Nombre de la Sede */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Nombre Comercial de la Sede *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData(p => ({ ...p, nombre: e.target.value }))}
                  placeholder="Ej: InkaFarma - Miraflores Pardo"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-extrabold text-slate-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Fila 3: Departamento y Distrito */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Departamento / Región *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.departamento}
                    onChange={(e) => setFormData(p => ({ ...p, departamento: e.target.value }))}
                    placeholder="Lima, Arequipa, Cusco, etc."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Distrito / Localidad *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.distrito}
                    onChange={(e) => setFormData(p => ({ ...p, distrito: e.target.value }))}
                    placeholder="Miraflores, Yanahuara, etc."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Fila 4: Dirección exacta */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Dirección Exacta *
                </label>
                <input
                  type="text"
                  required
                  value={formData.direccion}
                  onChange={(e) => setFormData(p => ({ ...p, direccion: e.target.value }))}
                  placeholder="Av. José Pardo 450, Miraflores"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Fila 5: Teléfono y Director Técnico */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) => setFormData(p => ({ ...p, telefono: e.target.value }))}
                    placeholder="(01) 314-2020 anexo 120"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Director Técnico (Q.F.)
                  </label>
                  <input
                    type="text"
                    value={formData.directorTecnico}
                    onChange={(e) => setFormData(p => ({ ...p, directorTecnico: e.target.value }))}
                    placeholder="QF. Ronny Mendoza (CQFP 28491)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Fila 6: Coordenadas Satelitales y Presets */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Coordenadas GPS (WGS84)</span>
                  </span>

                  {/* Presets de ciudades rápidas */}
                  <div className="flex items-center space-x-1 text-[10px]">
                    <span className="text-slate-400 font-semibold mr-1">Presets:</span>
                    {['Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Chiclayo', 'Huancayo'].map(city => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleApplyPresetCoords(city)}
                        className="px-2 py-0.5 bg-white border border-slate-300 hover:border-blue-500 rounded text-slate-700 font-bold hover:text-blue-700 transition"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Latitud</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={formData.lat}
                      onChange={(e) => setFormData(p => ({ ...p, lat: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Longitud</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={formData.lng}
                      onChange={(e) => setFormData(p => ({ ...p, lng: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Fila 7: Referencia e Instrucciones de Ruta */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Referencia Peatonal / Guía de Llegada
                </label>
                <textarea
                  rows={2}
                  value={formData.referencia}
                  onChange={(e) => setFormData(p => ({ ...p, referencia: e.target.value }))}
                  placeholder="Frente al parque central, a 1 cuadra de la avenida principal..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Fila 8: Checkbox Centro de Distribución */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="esCentroDist"
                  checked={formData.esCentroDistribucion}
                  onChange={(e) => setFormData(p => ({ ...p, esCentroDistribucion: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="esCentroDist" className="text-xs font-extrabold text-slate-700 cursor-pointer">
                  Esta sede opera como Centro de Distribución y Almacén Central (CD Logístico)
                </label>
              </div>

              {/* Botones de Acción */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingBranch ? 'Guardar Cambios' : 'Registrar Sede'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
