import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Edit3, 
  Layers, 
  Search, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  Cloud, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowUpDown, 
  Eye, 
  ExternalLink, 
  X, 
  Save, 
  History, 
  Building2,
  DollarSign,
  Barcode,
  Check,
  Lock,
  Truck,
  LayoutGrid,
  List,
  Filter,
  Printer,
  ChevronRight,
  TrendingDown,
  RefreshCw,
  Copy
} from 'lucide-react';
import { 
  MEDICAMENTOS, 
  SUCURSALES, 
  INVENTARIO_DATA, 
  KARDEX_MOVIMIENTOS,
  CLOUDFLARE_R2_CONFIG,
  getMedicineImageUrl,
  addNewProduct,
  updateExistingProduct,
  adjustStockRecord,
  createTransferOrder
} from '../services/mockData';
import { sanitizeInput } from '../services/securityUtils';
import TransferRequestModal from '../components/TransferRequestModal';
import ProductDetailModal from '../components/ProductDetailModal';

export default function ProductManagementPage({ currentBranch, currentUser, onSelectTransfer }) {
  // Simulador de Rol RBAC interactivo para pruebas y evaluación
  const [activeRole, setActiveRole] = useState(currentUser?.role || 'ADMIN_CD'); // 'ADMIN_CD' | 'FARMACEUTICO' | 'AUDITOR'
  
  // Lista reactiva de medicamentos
  const [productsList, setProductsList] = useState([...MEDICAMENTOS]);
  const [kardexList, setKardexList] = useState([...KARDEX_MOVIMIENTOS]);
  const [dataVersion, setDataVersion] = useState(0);

  // Sincronización reactiva con almacenamiento persistente y otros módulos
  useEffect(() => {
    const handleUpdate = () => {
      setDataVersion(v => v + 1);
      setProductsList([...MEDICAMENTOS]);
      setKardexList([...KARDEX_MOVIMIENTOS]);
    };
    window.addEventListener('siip:data_updated', handleUpdate);
    return () => window.removeEventListener('siip:data_updated', handleUpdate);
  }, []);

  // Modo de visualización: Tabla vs Cuadrícula (Grid)
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL'); // 'ALL' | 'MARCA' | 'GENERICO'
  const [stockHealthFilter, setStockHealthFilter] = useState('ALL'); // 'ALL' | 'QUIEBRE' | 'ALERTA' | 'OPTIMO'

  // Modales
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productFormTab, setProductFormTab] = useState('comercial'); // 'comercial' | 'regulatorio' | 'logistica' | 'imagen'
  const [isEditMode, setIsEditMode] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isKardexModalOpen, setIsKardexModalOpen] = useState(false);
  const [kardexFilterType, setKardexFilterType] = useState('ALL');
  
  // Modal de Detalle 360°
  const [selectedProductForDetail, setSelectedProductForDetail] = useState(null);

  // Modal de Traslado
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedProductForTransfer, setSelectedProductForTransfer] = useState(null);
  
  // Producto en edición o para ajuste de stock
  const [currentEditingProduct, setCurrentEditingProduct] = useState(null);
  const [selectedProductForStock, setSelectedProductForStock] = useState(null);

  // Notificación de éxito
  const [notification, setNotification] = useState(null);

  // Formulario de Producto (Creación / Edición)
  const initialProductForm = {
    id: null,
    nombreComercial: '',
    principioActivo: '',
    familia: '',
    tipoProducto: 'MARCA', // 'MARCA' | 'GENERICO'
    marcaComercial: '',
    laboratorio: '',
    categoria: 'Dermocosmética y Piel',
    concentracion: '',
    formaFarmaceutica: 'Crema Hidratante',
    presentacion: '',
    cajasPorBulto: 24,
    codigoEAN: '',
    codigoCan: '',
    precioUnitario: 35.00,
    registroSanitario: '',
    requiereReceta: false,
    stockInicial: 20,
    umbralMinimo: 8,
    umbralSeguridad: 15,
    consumoPromedioDiario: 3.0,
    imagenR2: '',
    imagenLocal: '',
    imagenUrl: ''
  };
  const [productForm, setProductForm] = useState(initialProductForm);

  // Formulario de Ajuste de Stock
  const [stockAdjustmentForm, setStockAdjustmentForm] = useState({
    sucursalId: currentBranch?.id || 1,
    tipoMovimiento: 'ENTRADA_COMPRA', // 'ENTRADA_COMPRA' | 'AJUSTE_FISICO_POSITIVO' | 'AJUSTE_FISICO_NEGATIVO' | 'SALIDA_MERMA_ROTURA' | 'SALIDA_BAJA_VENCIMIENTO'
    cantidad: 10,
    motivo: '',
    documentoSustento: '',
    codigoLoteAfectado: 'LT-2026-A1'
  });

  // Verificación de Permisos RBAC
  const canCreateProduct = activeRole === 'ADMIN_CD' || activeRole === 'GERENCIA';
  const canEditProduct = activeRole === 'ADMIN_CD' || activeRole === 'GERENCIA';
  const canAdjustStock = activeRole === 'ADMIN_CD' || activeRole === 'FARMACEUTICO';

  // Categorías disponibles
  const categoriesList = [
    'ALL',
    'Antibióticos',
    'Analgésicos y Antipiréticos',
    'Antiinflamatorios',
    'Dermocosmética y Piel',
    'Higiene y Cuidado Personal',
    'Dispositivos Médicos y Primeros Auxilios',
    'Cardiovascular y Presión',
    'Diabetes y Endocrinología',
    'Gastroenterología'
  ];

  // Generador de Código de Barras EAN-13 válido (Prefijo 775 Perú)
  const handleGenerateEAN13 = () => {
    // 775 + 9 dígitos aleatorios
    const prefix = '775';
    let body = '';
    for (let i = 0; i < 9; i++) {
      body += Math.floor(Math.random() * 10).toString();
    }
    const full12 = prefix + body;
    // Cálculo de dígito verificador EAN-13
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(full12[i], 10);
      sum += (i % 2 === 0) ? digit : digit * 3;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    const generatedEAN = full12 + checkDigit.toString();
    setProductForm(prev => ({ ...prev, codigoEAN: generatedEAN }));
    showNotify(`¡Código EAN-13 oficial Perú generado: ${generatedEAN}!`);
  };

  // Búsqueda y filtrado compuesto
  const cleanTerm = sanitizeInput(searchTerm).toLowerCase();
  const filteredProducts = productsList.filter(p => {
    const matchSearch = 
      p.nombreComercial.toLowerCase().includes(cleanTerm) ||
      p.principioActivo.toLowerCase().includes(cleanTerm) ||
      p.marcaComercial.toLowerCase().includes(cleanTerm) ||
      p.registroSanitario.toLowerCase().includes(cleanTerm) ||
      p.codigoEAN.includes(cleanTerm);
      
    const matchCategory = selectedCategory === 'ALL' || p.categoria === selectedCategory;
    const matchType = selectedType === 'ALL' || p.tipoProducto === selectedType;

    // Filtro por salud de stock en la sede activa
    const inv = (INVENTARIO_DATA[currentBranch.id] || []).find(i => i.medicamentoId === p.id);
    const stock = inv ? inv.stockActual : 0;
    const min = p.umbralMinimo || 8;
    const seg = p.umbralSeguridad || 15;

    let matchHealth = true;
    if (stockHealthFilter === 'QUIEBRE') {
      matchHealth = stock <= min;
    } else if (stockHealthFilter === 'ALERTA') {
      matchHealth = stock > min && stock <= seg;
    } else if (stockHealthFilter === 'OPTIMO') {
      matchHealth = stock > seg;
    }

    return matchSearch && matchCategory && matchType && matchHealth;
  });

  // Métricas
  const totalProducts = productsList.length;
  const dermocosmeticsCount = productsList.filter(p => 
    p.categoria === 'Dermocosmética y Piel' || 
    p.categoria === 'Higiene y Cuidado Personal' || 
    p.categoria === 'Dispositivos Médicos y Primeros Auxilios'
  ).length;
  const brandCount = productsList.filter(p => p.tipoProducto === 'MARCA').length;
  const genericCount = productsList.filter(p => p.tipoProducto === 'GENERICO').length;

  const showNotify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 6000);
  };

  // Abrir Modal de Creación
  const handleOpenCreateModal = () => {
    setProductForm({
      ...initialProductForm,
      id: Date.now() % 100000,
      codigoEAN: `775${Math.floor(100000000 + Math.random() * 900000000)}4`
    });
    setProductFormTab('comercial');
    setIsEditMode(false);
    setIsProductModalOpen(true);
  };

  // Abrir Modal de Edición
  const handleOpenEditModal = (product) => {
    setProductForm({ ...product });
    setProductFormTab('comercial');
    setIsEditMode(true);
    setIsProductModalOpen(true);
  };

  // Abrir Modal de Ajuste de Stock
  const handleOpenStockModal = (product) => {
    setSelectedProductForStock(product);
    setStockAdjustmentForm({
      sucursalId: currentBranch?.id || 1,
      tipoMovimiento: 'ENTRADA_COMPRA',
      cantidad: 10,
      motivo: `Reposición de stock para ${product.nombreComercial}`,
      documentoSustento: `GR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      codigoLoteAfectado: `LT-${product.codigoEAN ? product.codigoEAN.slice(-6) : '2026'}`
    });
    setIsStockModalOpen(true);
  };

  // Abrir Modal de Traslado
  const handleOpenTransferModal = (product) => {
    setSelectedProductForTransfer(product);
    setIsTransferModalOpen(true);
  };

  const handleConfirmTransfer = (transferPayload) => {
    const newTransfer = createTransferOrder(transferPayload);
    if (onSelectTransfer) {
      onSelectTransfer(newTransfer);
    }
    showNotify(`¡Solicitud de traslado emitida para ${newTransfer.cantidadSugerida} cajas de "${selectedProductForTransfer?.nombreComercial}"!`);
  };

  // Guardar Producto (Alta o Edición)
  const handleSaveProduct = (e) => {
    e.preventDefault();

    if (!canCreateProduct && !isEditMode) {
      alert("No tiene permisos de Administrador para dar de alta productos.");
      return;
    }

    if (isEditMode) {
      const updated = updateExistingProduct(productForm.id, productForm);
      setProductsList(prev => prev.map(p => p.id === updated.id ? updated : p));
      showNotify(`¡Producto "${updated.nombreComercial}" actualizado con éxito! Ficha técnica y multimedia sincronizadas.`);
    } else {
      const created = addNewProduct(productForm);
      setProductsList(prev => [created, ...prev]);
      showNotify(`¡Nuevo producto "${created.nombreComercial}" registrado en el catálogo nacional e inicializado en todas las sedes!`);
    }

    setIsProductModalOpen(false);
  };

  // Subir / Simular Imagen de Archivo Local o Cloudflare R2
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({
          ...prev,
          imagenUrl: reader.result,
          imagenLocal: reader.result,
          imagenR2: `${file.name.toLowerCase().replace(/\s+/g, '-')}`
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Ejecutar Ajuste de Stock con Registro en Kardex
  const handleExecuteStockAdjustment = (e) => {
    e.preventDefault();

    if (!canAdjustStock) {
      alert("No tiene permisos para modificar stock.");
      return;
    }

    const qty = parseInt(stockAdjustmentForm.cantidad, 10);
    if (isNaN(qty) || qty <= 0) {
      alert("Ingrese una cantidad válida mayor a cero.");
      return;
    }

    let diff = qty;
    if (stockAdjustmentForm.tipoMovimiento.includes('NEGATIVO') || stockAdjustmentForm.tipoMovimiento.includes('SALIDA') || stockAdjustmentForm.tipoMovimiento.includes('MERMA')) {
      diff = -qty;
    }

    const result = adjustStockRecord(
      stockAdjustmentForm.sucursalId,
      selectedProductForStock.id,
      diff,
      stockAdjustmentForm.tipoMovimiento,
      `${stockAdjustmentForm.motivo} (Lote: ${stockAdjustmentForm.codigoLoteAfectado})`,
      stockAdjustmentForm.documentoSustento,
      currentUser?.name || 'Químico Farmacéutico Responsable'
    );

    setKardexList(prev => [result.nuevoKardex, ...prev]);
    setProductsList([...MEDICAMENTOS]);

    showNotify(`¡Ajuste aplicado! Stock de "${selectedProductForStock.nombreComercial}" pasó de ${result.stockAnterior} a ${result.stockNuevo} cajas en ${result.nuevoKardex.sucursalNombre}.`);
    setIsStockModalOpen(false);
  };

  // Filtrado de Kardex
  const filteredKardex = kardexList.filter(k => {
    if (kardexFilterType === 'ENTRADAS') return k.tipoMovimiento.includes('ENTRADA') || k.tipoMovimiento.includes('POSITIVO');
    if (kardexFilterType === 'SALIDAS') return k.tipoMovimiento.includes('SALIDA') || k.tipoMovimiento.includes('NEGATIVO') || k.tipoMovimiento.includes('MERMA');
    return true;
  });

  return (
    <div className="space-y-6 w-full">
      
      {/* Barra Superior con Selector de Rol RBAC y Acciones Principales */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Package className="w-4 h-4 text-blue-600" />
            <span>Módulo de Administración • Catálogo Nacional, Fichas 360° &amp; Kardex</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Gestión Integral de Medicamentos, Dermocosmética y Stock
          </h1>
          <p className="text-sm font-medium text-slate-700 mt-1">
            Control de productos con <strong>Ficha Técnica DIGEMID</strong>, fotos en <strong>Cloudflare R2</strong>, etiquetas de anaquel EAN-13 y kardex auditable por roles (RBAC).
          </p>
        </div>

        {/* Simulador de Rol RBAC y Botones de Creación / Kardex */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          {/* Selector de Rol */}
          <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center space-x-1">
            <span className="text-[10px] font-black uppercase text-slate-500 px-2">Rol:</span>
            <button
              onClick={() => setActiveRole('ADMIN_CD')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeRole === 'ADMIN_CD' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Permiso total: Crear, Editar, Ajustar Stock"
            >
              👑 Admin Central
            </button>
            <button
              onClick={() => setActiveRole('FARMACEUTICO')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeRole === 'FARMACEUTICO' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Permiso operativo: Ajustar stock en sede"
            >
              💊 Farmacéutico
            </button>
            <button
              onClick={() => setActiveRole('AUDITOR')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeRole === 'AUDITOR' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Solo lectura: Auditor DIGEMID"
            >
              🔒 Auditor (Lectura)
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsKardexModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs border border-slate-300 transition cursor-pointer shadow-xs"
            >
              <History className="w-4 h-4 text-blue-600" />
              <span>Ver Kardex ({kardexList.length})</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              disabled={!canCreateProduct}
              className={`inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-extrabold text-xs transition shadow-sm ${
                canCreateProduct 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white cursor-pointer" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
              title={canCreateProduct ? "Crear nuevo producto o medicamento" : "Requiere rol de Administrador"}
            >
              {canCreateProduct ? <Plus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>Nuevo Producto</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notificación de Éxito */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center justify-between text-sm font-bold shadow-sm animate-in fade-in">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tarjetas de Métricas del Catálogo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-extrabold uppercase text-slate-500 block">Total en Catálogo</span>
          <span className="text-2xl font-black font-mono text-slate-900">{totalProducts}</span>
          <span className="text-xs text-slate-600 block mt-0.5">Medicamentos y no medicinales</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-extrabold uppercase text-purple-700 block">Marcas Comerciales</span>
          <span className="text-2xl font-black font-mono text-purple-900">{brandCount}</span>
          <span className="text-xs text-purple-700 block mt-0.5">Innovadores con empaque comercial</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-extrabold uppercase text-emerald-700 block">Genéricos Oficiales</span>
          <span className="text-2xl font-black font-mono text-emerald-900">{genericCount}</span>
          <span className="text-xs text-emerald-700 block mt-0.5">Denominación Común (DCI)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-extrabold uppercase text-cyan-700 block">Dermocosmética &amp; Otros</span>
          <span className="text-2xl font-black font-mono text-cyan-900">{dermocosmeticsCount}</span>
          <span className="text-xs text-cyan-700 block mt-0.5">Cremas, solares y dispositivos</span>
        </div>
      </div>

      {/* Filtros, Buscador y Selector de Vista (Tabla vs Tarjetas) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Buscador */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Buscar por nombre (ej. CeraVe, Amoxidal), principio activo, EAN, registro o marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
            />
          </div>

          {/* Filtros de Tipo y Categoría */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Selector Tipo */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
              <button
                onClick={() => setSelectedType('ALL')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${selectedType === 'ALL' ? 'bg-white text-blue-900 shadow-xs font-black' : 'text-slate-600'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedType('MARCA')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${selectedType === 'MARCA' ? 'bg-purple-600 text-white shadow-xs font-black' : 'text-slate-600'}`}
              >
                🏷️ Marca
              </button>
              <button
                onClick={() => setSelectedType('GENERICO')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${selectedType === 'GENERICO' ? 'bg-emerald-600 text-white shadow-xs font-black' : 'text-slate-600'}`}
              >
                🧬 Genérico
              </button>
            </div>

            {/* Selector Categoría */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'Todas las Categorías' : cat}
                </option>
              ))}
            </select>

            {/* Selector de Modo de Vista (Tabla vs Tarjetas) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${viewMode === 'table' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                title="Vista Tabla Detallada"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                title="Vista Cuadrícula de Tarjetas"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chips de Filtro Rápido por Salud de Stock en la Sede Activa */}
        <div className="flex items-center space-x-2 pt-1 overflow-x-auto text-xs">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
            Stock en {currentBranch.nombre}:
          </span>
          <button
            onClick={() => setStockHealthFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              stockHealthFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todos ({productsList.length})
          </button>
          <button
            onClick={() => setStockHealthFilter('QUIEBRE')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              stockHealthFilter === 'QUIEBRE' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-800 hover:bg-red-100'
            }`}
          >
            ⚠️ Quiebre Crítico (&lt;= Mínimo)
          </button>
          <button
            onClick={() => setStockHealthFilter('ALERTA')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              stockHealthFilter === 'ALERTA' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            ⚡ Alerta Stock Bajo
          </button>
          <button
            onClick={() => setStockHealthFilter('OPTIMO')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              stockHealthFilter === 'OPTIMO' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            ✓ Abastecido / Óptimo
          </button>
        </div>
      </div>

      {/* =========================================================================
          VISTA 1: TABLA PRINCIPAL DE CATÁLOGO
          ========================================================================= */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
              <thead className="bg-slate-900 text-white font-extrabold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-3 py-3.5 text-center">Empaque</th>
                  <th className="px-4 py-3.5 text-left">Producto &amp; Marca</th>
                  <th className="px-4 py-3.5 text-left">Principio Activo / Fórmula</th>
                  <th className="px-3 py-3.5 text-left">Categoría</th>
                  <th className="px-3 py-3.5 text-center">Registro DIGEMID</th>
                  <th className="px-3 py-3.5 text-right">Precio PVP</th>
                  <th className="px-3 py-3.5 text-center">Stock Sede</th>
                  <th className="px-4 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredProducts.map(product => {
                  const isMarca = product.tipoProducto === 'MARCA';
                  const invItem = (INVENTARIO_DATA[currentBranch.id] || []).find(i => i.medicamentoId === product.id);
                  const stock = invItem ? invItem.stockActual : 0;
                  const isLow = stock <= (product.umbralMinimo || 8);
                  const isSafe = stock > (product.umbralSeguridad || 15);

                  return (
                    <tr key={product.id} className="hover:bg-blue-50/40 transition">
                      {/* Imagen / Empaque */}
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => setSelectedProductForDetail(product)}
                          className="w-14 h-14 rounded-xl bg-slate-50 p-1 border border-slate-200 mx-auto flex items-center justify-center shadow-xs cursor-pointer hover:border-blue-500 hover:scale-105 transition"
                          title="Clic para ver Ficha Técnica 360°"
                        >
                          <img
                            src={getMedicineImageUrl(product)}
                            alt={product.nombreComercial}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=150&q=80";
                            }}
                          />
                        </button>
                      </td>

                      {/* Producto & Marca */}
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                            isMarca ? "bg-purple-100 text-purple-900 border border-purple-200" : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                          }`}>
                            {product.marcaComercial || (isMarca ? 'Marca Comercial' : 'Genérico DCI')}
                          </span>
                          {product.requiereReceta && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                              Receta
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedProductForDetail(product)}
                          className="font-black text-slate-900 hover:text-blue-700 text-left cursor-pointer text-xs sm:text-sm block"
                        >
                          {product.nombreComercial}
                        </button>
                        <div className="text-[11px] text-slate-600 font-medium">
                          {product.laboratorio} • {product.presentacion}
                        </div>
                      </td>

                      {/* Principio Activo */}
                      <td className="px-4 py-3 text-slate-700">
                        <div className="font-bold text-slate-900">{product.principioActivo}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{product.concentracion}</div>
                      </td>

                      {/* Categoría */}
                      <td className="px-3 py-3">
                        <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 whitespace-nowrap block w-fit">
                          {product.categoria}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium block mt-1">
                          {product.formaFarmaceutica}
                        </span>
                      </td>

                      {/* Registro Sanitario */}
                      <td className="px-3 py-3 text-center font-mono text-xs text-slate-700">
                        <div className="font-bold text-slate-900">{product.registroSanitario}</div>
                        <div className="text-[10px] text-slate-500">EAN: {product.codigoEAN}</div>
                      </td>

                      {/* Precio Unitario */}
                      <td className="px-3 py-3 text-right font-mono font-black text-sm text-slate-900">
                        S/ {product.precioUnitario.toFixed(2)}
                      </td>

                      {/* Stock en Sede */}
                      <td className="px-3 py-3 text-center">
                        <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-full ${
                          isLow ? "bg-red-100 text-red-800 border border-red-300" : 
                          isSafe ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                          "bg-amber-100 text-amber-900 border border-amber-300"
                        }`}>
                          {stock} cjs
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-1 font-semibold">
                          {isLow ? '⚠️ Quiebre' : isSafe ? '✓ Abastecido' : '⚡ Alerta'}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Botón Ver Ficha 360° */}
                          <button
                            onClick={() => setSelectedProductForDetail(product)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-300 transition cursor-pointer"
                            title="Ver Ficha Técnica 360° y Stock Multisede"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                          </button>

                          {/* Botón Solicitar Traslado Inter-Sedes */}
                          <button
                            onClick={() => handleOpenTransferModal(product)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl font-bold text-xs border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 transition cursor-pointer"
                            title="Solicitar cajas de este producto desde otra sede"
                          >
                            <Truck className="w-3.5 h-3.5 text-blue-600" />
                            <span className="hidden sm:inline">Trasladar</span>
                          </button>

                          {/* Botón Ajustar Stock */}
                          <button
                            onClick={() => handleOpenStockModal(product)}
                            disabled={!canAdjustStock}
                            className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl font-bold text-xs border transition ${
                              canAdjustStock 
                                ? "bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border-slate-300 cursor-pointer" 
                                : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                            }`}
                            title={canAdjustStock ? "Ajustar stock en kardex" : "Sin permiso para ajustar stock"}
                          >
                            <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="hidden sm:inline">Stock</span>
                          </button>

                          {/* Botón Editar Producto */}
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            disabled={!canEditProduct}
                            className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl font-bold text-xs border transition ${
                              canEditProduct 
                                ? "bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200 cursor-pointer" 
                                : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                            }`}
                            title={canEditProduct ? "Editar ficha técnica e imagen" : "Requiere rol de Administrador"}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                            <span className="hidden sm:inline">Editar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          VISTA 2: CUADRÍCULA DE TARJETAS VISUALES (GRID)
          ========================================================================= */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => {
            const isMarca = product.tipoProducto === 'MARCA';
            const invItem = (INVENTARIO_DATA[currentBranch.id] || []).find(i => i.medicamentoId === product.id);
            const stock = invItem ? invItem.stockActual : 0;
            const min = product.umbralMinimo || 8;
            const seg = product.umbralSeguridad || 15;
            const isLow = stock <= min;

            return (
              <div 
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between space-y-3 hover:shadow-md transition group"
              >
                {/* Header Tarjeta */}
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                    isMarca ? "bg-purple-100 text-purple-900 border border-purple-200" : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                  }`}>
                    {product.marcaComercial || (isMarca ? 'Marca Comercial' : 'Genérico DCI')}
                  </span>
                  
                  <span className="text-xs font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                    S/ {product.precioUnitario.toFixed(2)}
                  </span>
                </div>

                {/* Foto Central del Empaque con Zoom */}
                <div 
                  onClick={() => setSelectedProductForDetail(product)}
                  className="w-full aspect-square max-h-44 bg-slate-50 rounded-2xl border border-slate-200 p-2 flex items-center justify-center overflow-hidden cursor-pointer group-hover:bg-blue-50/30 transition relative"
                >
                  <img
                    src={getMedicineImageUrl(product)}
                    alt={product.nombreComercial}
                    className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80";
                    }}
                  />
                  <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                    EAN: {product.codigoEAN.slice(-5)}
                  </span>
                </div>

                {/* Título y Datos */}
                <div>
                  <h3 
                    onClick={() => setSelectedProductForDetail(product)}
                    className="font-black text-slate-900 hover:text-blue-700 text-sm leading-snug cursor-pointer line-clamp-2"
                  >
                    {product.nombreComercial}
                  </h3>
                  <p className="text-xs text-slate-600 truncate mt-0.5">
                    {product.principioActivo}
                  </p>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                    {product.laboratorio} • {product.presentacion}
                  </div>
                </div>

                {/* Medidor de Stock en Sede Activa */}
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">Stock en {currentBranch.marca}:</span>
                    <span className="font-mono font-black text-slate-900">
                      {stock} cjs
                    </span>
                  </div>
                  
                  {/* Barra de Progreso */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isLow ? 'bg-red-600' : (stock <= seg ? 'bg-amber-500' : 'bg-emerald-600')
                      }`}
                      style={{ width: `${Math.min(100, (stock / Math.max(1, seg * 1.5)) * 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span>Mín: {min} cjs</span>
                    <span className={`font-black ${isLow ? 'text-red-700' : 'text-emerald-700'}`}>
                      {isLow ? '⚠️ Quiebre' : '✓ Normal'}
                    </span>
                  </div>
                </div>

                {/* Botones de Acción de Tarjeta */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    onClick={() => setSelectedProductForDetail(product)}
                    className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ficha</span>
                  </button>

                  <button
                    onClick={() => handleOpenTransferModal(product)}
                    className="py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Trasladar</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: ALTA Y EDICIÓN DE PRODUCTO CON PESTAÑAS Y GENERADOR EAN-13
          ========================================================================= */}
      {isProductModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in overflow-y-auto"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header Modal */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-blue-500/20 text-cyan-300 rounded-2xl border border-blue-400/30">
                  {isEditMode ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {isEditMode ? `Editar Producto: ${productForm.nombreComercial}` : 'Alta de Nuevo Producto en Catálogo'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Ficha Técnica DIGEMID, Parámetros Logísticos e Imagen en Cloudflare R2
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pestañas de Navegación del Formulario */}
            <div className="flex items-center space-x-1 border-b border-slate-200 px-6 pt-3 bg-slate-50 overflow-x-auto">
              <button
                type="button"
                onClick={() => setProductFormTab('comercial')}
                className={`px-3.5 py-2 rounded-t-xl text-xs font-black transition cursor-pointer flex items-center space-x-1.5 ${
                  productFormTab === 'comercial' ? 'bg-white text-blue-900 border-t-2 border-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>1. Comercial</span>
              </button>

              <button
                type="button"
                onClick={() => setProductFormTab('regulatorio')}
                className={`px-3.5 py-2 rounded-t-xl text-xs font-black transition cursor-pointer flex items-center space-x-1.5 ${
                  productFormTab === 'regulatorio' ? 'bg-white text-blue-900 border-t-2 border-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>2. DIGEMID &amp; Receta</span>
              </button>

              <button
                type="button"
                onClick={() => setProductFormTab('logistica')}
                className={`px-3.5 py-2 rounded-t-xl text-xs font-black transition cursor-pointer flex items-center space-x-1.5 ${
                  productFormTab === 'logistica' ? 'bg-white text-blue-900 border-t-2 border-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Barcode className="w-3.5 h-3.5" />
                <span>3. Precios &amp; EAN-13</span>
              </button>

              <button
                type="button"
                onClick={() => setProductFormTab('imagen')}
                className={`px-3.5 py-2 rounded-t-xl text-xs font-black transition cursor-pointer flex items-center space-x-1.5 ${
                  productFormTab === 'imagen' ? 'bg-white text-blue-900 border-t-2 border-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>4. Foto R2</span>
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-5 flex-1">
              
              {/* TAB 1: COMERCIAL */}
              {productFormTab === 'comercial' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase text-slate-700 block mb-1">Tipo de Producto *</label>
                      <select
                        value={productForm.tipoProducto}
                        onChange={(e) => setProductForm({ ...productForm, tipoProducto: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                      >
                        <option value="MARCA">🏷️ Marca Comercial Innovadora</option>
                        <option value="GENERICO">🧬 Genérico DCI Oficial</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-slate-700 block mb-1">Categoría Terapéutica / Cosmética *</label>
                      <select
                        value={productForm.categoria}
                        onChange={(e) => setProductForm({ ...productForm, categoria: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                      >
                        <option value="Antibióticos">Antibióticos</option>
                        <option value="Analgésicos y Antipiréticos">Analgésicos y Antipiréticos</option>
                        <option value="Antiinflamatorios">Antiinflamatorios</option>
                        <option value="Dermocosmética y Piel">🧴 Dermocosmética y Piel</option>
                        <option value="Higiene y Cuidado Personal">🧼 Higiene y Cuidado Personal</option>
                        <option value="Dispositivos Médicos y Primeros Auxilios">🩹 Dispositivos Médicos</option>
                        <option value="Cardiovascular y Presión">Cardiovascular y Presión</option>
                        <option value="Diabetes y Endocrinología">Diabetes y Endocrinología</option>
                        <option value="Gastroenterología">Gastroenterología</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-slate-700 block mb-1">Nombre Comercial *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. CeraVe Crema Hidratante / Amoxidal 500"
                        value={productForm.nombreComercial}
                        onChange={(e) => setProductForm({ ...productForm, nombreComercial: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-slate-700 block mb-1">Principio Activo / Fórmula *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. 3 Ceramidas + Ácido Hialurónico / Amoxicilina"
                        value={productForm.principioActivo}
                        onChange={(e) => setProductForm({ ...productForm, principioActivo: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-slate-700 block mb-1">Marca Comercial / Línea</label>
                      <input
                        type="text"
                        placeholder="Ej. CeraVe / Megalabs / Genfar / Bayer"
                        value={productForm.marcaComercial}
                        onChange={(e) => setProductForm({ ...productForm, marcaComercial: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-slate-700 block mb-1">Laboratorio Fabricante *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. L'Oréal / Megalabs Perú / Química Suiza"
                        value={productForm.laboratorio}
                        onChange={(e) => setProductForm({ ...productForm, laboratorio: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: REGULATORIO */}
              {productFormTab === 'regulatorio' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase text-slate-700 block mb-1">Registro Sanitario / NSO DIGEMID *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. NSOC41234-19PE / EE-04892 (DIGEMID)"
                        value={productForm.registroSanitario}
                        onChange={(e) => setProductForm({ ...productForm, registroSanitario: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-slate-700 block mb-1">Concentración / Potencia</label>
                      <input
                        type="text"
                        placeholder="Ej. 500 mg / SPF 50+ / 5% Dexpantenol"
                        value={productForm.concentracion}
                        onChange={(e) => setProductForm({ ...productForm, concentracion: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-slate-700 block mb-1">Forma Farmacéutica</label>
                      <input
                        type="text"
                        placeholder="Ej. Cápsula Blanda / Crema Hidratante / Frasco Líquido"
                        value={productForm.formaFarmaceutica}
                        onChange={(e) => setProductForm({ ...productForm, formaFarmaceutica: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-slate-700 block mb-1">Presentación Comercial</label>
                      <input
                        type="text"
                        placeholder="Ej. Pote x 453 g / Caja x 16 Cápsulas"
                        value={productForm.presentacion}
                        onChange={(e) => setProductForm({ ...productForm, presentacion: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <label className="text-xs font-black uppercase text-slate-800 block">
                        Condición de Dispensación:
                      </label>
                      <span className="text-[11px] text-slate-500">
                        Los productos de dermocosmética y venta libre no requieren prescripción médica obligatoria.
                      </span>
                    </div>

                    <label className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.requiereReceta}
                        onChange={(e) => setProductForm({ ...productForm, requiereReceta: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-xs font-black text-slate-800">
                        Exige Receta Médica
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 3: LOGÍSTICA & EAN-13 */}
              {productFormTab === 'logistica' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-black uppercase text-slate-700 block mb-1">Precio Unitario PVP (S/.) *</label>
                      <input
                        type="number"
                        step="0.10"
                        min="0.5"
                        required
                        value={productForm.precioUnitario}
                        onChange={(e) => setProductForm({ ...productForm, precioUnitario: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-black text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-slate-700 block mb-1">Cajas por Bulto / Fardo</label>
                      <input
                        type="number"
                        min="1"
                        value={productForm.cajasPorBulto}
                        onChange={(e) => setProductForm({ ...productForm, cajasPorBulto: parseInt(e.target.value) || 24 })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-slate-700 block mb-1">Consumo Diario Estimado (CPD)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.5"
                        value={productForm.consumoPromedioDiario}
                        onChange={(e) => setProductForm({ ...productForm, consumoPromedioDiario: parseFloat(e.target.value) || 3.0 })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-slate-700 block mb-1">Stock Inicial Sedes (cjs)</label>
                      <input
                        type="number"
                        min="1"
                        value={productForm.stockInicial}
                        onChange={(e) => setProductForm({ ...productForm, stockInicial: parseInt(e.target.value) || 20 })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-slate-700 block mb-1">Umbral Mínimo (Quiebre)</label>
                      <input
                        type="number"
                        min="1"
                        value={productForm.umbralMinimo}
                        onChange={(e) => setProductForm({ ...productForm, umbralMinimo: parseInt(e.target.value) || 8 })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-slate-700 block mb-1">Umbral Seguridad (Óptimo)</label>
                      <input
                        type="number"
                        min="1"
                        value={productForm.umbralSeguridad}
                        onChange={(e) => setProductForm({ ...productForm, umbralSeguridad: parseInt(e.target.value) || 15 })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Bloque Código de Barras EAN-13 con Generador */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase text-slate-700">
                        Código de Barras EAN-13 Oficial (Estándar GS1 Perú)
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateEAN13}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 font-black text-xs rounded-lg border border-blue-300 transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Generar EAN-13 Válido</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        required
                        placeholder="7750XXXXXXXXX"
                        value={productForm.codigoEAN}
                        onChange={(e) => setProductForm({ ...productForm, codigoEAN: e.target.value })}
                        className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono font-black text-blue-950"
                      />
                      <span className="text-xs font-bold text-slate-500 font-mono">
                        {productForm.codigoEAN.length}/13 dígitos
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: FOTO EN CLOUDFLARE R2 */}
              {productFormTab === 'imagen' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-3">
                    <div className="flex items-center space-x-2 text-amber-950 font-bold text-xs">
                      <Cloud className="w-4 h-4 text-amber-700" />
                      <span>Almacenamiento Cloudflare R2 Oficial: <strong>/{CLOUDFLARE_R2_CONFIG.bucketName}</strong></span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                      <div className="sm:col-span-2 space-y-2">
                        <div>
                          <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">
                            Nombre del Objeto en Bucket R2:
                          </label>
                          <input
                            type="text"
                            placeholder="ej. cerave-crema-hidratante-453g.webp"
                            value={productForm.imagenR2}
                            onChange={(e) => setProductForm({ ...productForm, imagenR2: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">
                            O subir archivo desde el computador:
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="w-full text-xs text-slate-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Previsualizador */}
                      <div className="flex flex-col items-center justify-center p-2 bg-white rounded-2xl border border-slate-200 text-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase mb-1">Vista Previa</span>
                        <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                          <img
                            src={productForm.imagenLocal || productForm.imagenUrl || getMedicineImageUrl(productForm)}
                            alt="Preview"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80";
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones del Formulario */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancelar
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white transition shadow-sm cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isEditMode ? 'Guardar Cambios' : 'Registrar en Catálogo'}</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: AJUSTE DE STOCK CON MOTIVOS OFICIALES DIGEMID
          ========================================================================= */}
      {isStockModalOpen && selectedProductForStock && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in overflow-y-auto"
          onClick={() => setIsStockModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                  <ArrowUpDown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Ajuste Físico de Inventario / Kardex
                  </h3>
                  <p className="text-xs text-slate-300">
                    {selectedProductForStock.nombreComercial} ({selectedProductForStock.presentacion})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsStockModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteStockAdjustment} className="p-6 space-y-4">
              
              {/* Información de Sede */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 block">Sede Activa</span>
                  <span className="text-xs font-black text-slate-900">{currentBranch.nombre}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase text-slate-500 block">Stock Actual</span>
                  <span className="text-xl font-black font-mono text-blue-950">
                    {(INVENTARIO_DATA[currentBranch.id] || []).find(i => i.medicamentoId === selectedProductForStock.id)?.stockActual || 0} cjs
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">Tipo de Movimiento DIGEMID *</label>
                <select
                  value={stockAdjustmentForm.tipoMovimiento}
                  onChange={(e) => setStockAdjustmentForm({ ...stockAdjustmentForm, tipoMovimiento: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="ENTRADA_COMPRA">📥 Ingreso por Compra / Recepción de Laboratorio (+)</option>
                  <option value="AJUSTE_FISICO_POSITIVO">🔍 Ajuste Físico Positivo por Conteo Cíclico (+)</option>
                  <option value="AJUSTE_FISICO_NEGATIVO">🔻 Diferencia de Inventario / Conteo Físico (-)</option>
                  <option value="SALIDA_MERMA_ROTURA">⚠️ Merma / Baja por Envase Roto o Daño Operativo (-)</option>
                  <option value="SALIDA_BAJA_VENCIMIENTO">🛑 Baja Técnica por Vencimiento para Destrucción (-)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-slate-700 block mb-1">Cantidad Cajas *</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    required
                    value={stockAdjustmentForm.cantidad}
                    onChange={(e) => setStockAdjustmentForm({ ...stockAdjustmentForm, cantidad: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-black text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-700 block mb-1">Lote Afectado</label>
                  <input
                    type="text"
                    required
                    value={stockAdjustmentForm.codigoLoteAfectado}
                    onChange={(e) => setStockAdjustmentForm({ ...stockAdjustmentForm, codigoLoteAfectado: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">Motivo y Justificación Técnica *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Justifique la causa conforme al Manual de BPA de DIGEMID..."
                  value={stockAdjustmentForm.motivo}
                  onChange={(e) => setStockAdjustmentForm({ ...stockAdjustmentForm, motivo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">Documento Sustento (Guía / Acta / Factura)</label>
                <input
                  type="text"
                  placeholder="Ej. GR-001-9821 / ACTA-MERMA-2026"
                  value={stockAdjustmentForm.documentoSustento}
                  onChange={(e) => setStockAdjustmentForm({ ...stockAdjustmentForm, documentoSustento: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Aplicar en Kardex</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: HISTORIAL AUDITABLE DE KARDEX CON FILTROS E IMPRESIÓN
          ========================================================================= */}
      {isKardexModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in overflow-y-auto"
          onClick={() => setIsKardexModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-blue-500/20 text-cyan-300 rounded-xl border border-blue-400/30">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Libro de Movimientos de Kardex (Auditoría DIGEMID)
                  </h3>
                  <p className="text-xs text-slate-300">
                    Registro inmutable de entradas por compra, salidas por traslado, conteos cíclicos y mermas
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Kardex</span>
                </button>

                <button 
                  onClick={() => setIsKardexModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filtros de Kardex */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Filtrar:</span>
                <button
                  onClick={() => setKardexFilterType('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    kardexFilterType === 'ALL' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  Todos ({kardexList.length})
                </button>
                <button
                  onClick={() => setKardexFilterType('ENTRADAS')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    kardexFilterType === 'ENTRADAS' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  }`}
                >
                  📥 Solo Entradas
                </button>
                <button
                  onClick={() => setKardexFilterType('SALIDAS')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    kardexFilterType === 'SALIDAS' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-900 border border-red-200'
                  }`}
                >
                  🔻 Solo Salidas / Mermas
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-100 text-slate-800 font-extrabold uppercase text-[11px]">
                  <tr>
                    <th className="px-3 py-3 text-left">Fecha &amp; Hora</th>
                    <th className="px-3 py-3 text-left">Sede</th>
                    <th className="px-4 py-3 text-left">Producto</th>
                    <th className="px-3 py-3 text-center">Tipo Movimiento</th>
                    <th className="px-3 py-3 text-center">Cantidad</th>
                    <th className="px-3 py-3 text-center">Stock</th>
                    <th className="px-4 py-3 text-left">Motivo &amp; Documento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredKardex.map(k => (
                    <tr key={k.id} className="hover:bg-slate-50">
                      <td className="px-3 py-3 font-mono text-slate-600 font-medium">{k.fecha}</td>
                      <td className="px-3 py-3 font-extrabold text-slate-900">{k.sucursalNombre}</td>
                      <td className="px-4 py-3 font-extrabold text-slate-900">{k.medicamentoNombre}</td>
                      <td className="px-3 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase ${
                          k.tipoMovimiento.includes('ENTRADA') || k.tipoMovimiento.includes('POSITIVO')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {k.tipoMovimiento.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center font-mono font-black text-sm">
                        {k.tipoMovimiento.includes('ENTRADA') || k.tipoMovimiento.includes('POSITIVO') ? `+${k.cantidad}` : `-${k.cantidad}`} cjs
                      </td>
                      <td className="px-3 py-3 text-center font-mono text-slate-700">
                        {k.stockAnterior} → <strong className="text-slate-950 font-black">{k.stockNuevo}</strong>
                      </td>
                      <td className="px-4 py-3 text-slate-700 max-w-xs">
                        <div className="font-semibold text-slate-900">{k.motivo}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Doc: {k.documentoSustento} • {k.usuario}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsKardexModalOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cerrar Historial
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: FICHA TÉCNICA 360° & EXPEDIENTE OFICIAL DE PRODUCTO
          ========================================================================= */}
      {selectedProductForDetail && (
        <ProductDetailModal
          product={selectedProductForDetail}
          currentBranch={currentBranch}
          isOpen={Boolean(selectedProductForDetail)}
          onClose={() => setSelectedProductForDetail(null)}
          onOpenTransfer={handleOpenTransferModal}
          onOpenStockAdjust={handleOpenStockModal}
        />
      )}

      {/* =========================================================================
          MODAL 5: SOLICITUD DE TRASLADO INTER-SEDES CON SELECTOR DE CANTIDAD
          ========================================================================= */}
      {isTransferModalOpen && selectedProductForTransfer && (
        <TransferRequestModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          medicine={selectedProductForTransfer}
          currentBranch={currentBranch}
          onConfirmTransfer={handleConfirmTransfer}
        />
      )}

    </div>
  );
}
