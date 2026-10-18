import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Search,
  Filter,
  ArrowUpDown,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  DollarSign,
  Truck,
  Sparkles
} from 'lucide-react';
import { 
  LOTES_CADUCIDAD, 
  MEDICAMENTOS, 
  SUCURSALES, 
  INVENTARIO_DATA 
} from '../services/mockData';
import { sanitizeInput } from '../services/securityUtils';

export default function PredictiveAlertsPage({ currentBranch, onNavigate }) {
  const [dataVersion, setDataVersion] = useState(0);

  React.useEffect(() => {
    const handleUpdate = () => setDataVersion(v => v + 1);
    window.addEventListener('siip:data_updated', handleUpdate);
    return () => window.removeEventListener('siip:data_updated', handleUpdate);
  }, []);

  const [activeTab, setActiveTab] = useState('vencimientos'); // 'vencimientos' | 'quiebres'
  const [filterSemaforo, setFilterSemaforo] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const cleanSearch = sanitizeInput(searchTerm);

  // Lotes con filtro de búsqueda y semáforo
  const filteredLotes = LOTES_CADUCIDAD.filter(l => {
    const med = MEDICAMENTOS.find(m => m.id === l.medicamentoId);
    const suc = SUCURSALES.find(s => s.id === l.sucursalId);
    const matchSearch = 
      l.codigoLote.toLowerCase().includes(cleanSearch.toLowerCase()) ||
      (med && med.nombreComercial.toLowerCase().includes(cleanSearch.toLowerCase())) ||
      (med && med.registroSanitario.toLowerCase().includes(cleanSearch.toLowerCase())) ||
      (suc && suc.nombre.toLowerCase().includes(cleanSearch.toLowerCase()));
    
    const matchSemaforo = filterSemaforo === 'ALL' || l.semaforo === filterSemaforo;
    return matchSearch && matchSemaforo;
  });

  // Quiebres predictivos a 7 días
  const quiebresPredictivos = [];
  SUCURSALES.forEach(suc => {
    const inv = INVENTARIO_DATA[suc.id] || [];
    inv.forEach(item => {
      if (item.diasAutonomia <= 7.0 && !suc.esCentroDistribucion) {
        const med = MEDICAMENTOS.find(m => m.id === item.medicamentoId);
        quiebresPredictivos.push({
          sucursal: suc,
          medicamento: med,
          stockActual: item.stockActual,
          stockSeguridad: item.stockSeguridad,
          diasAutonomia: item.diasAutonomia,
          consumoDiario: med?.consumoPromedioDiario || 5.0,
          lote: item.lotePrincipal
        });
      }
    });
  });

  const totalMonetarioEnRiesgo = LOTES_CADUCIDAD.reduce((acc, curr) => acc + curr.impactoMonetario, 0);

  return (
    <div className="space-y-6 w-full">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Casos de Uso CU02 & CU04 • Reporte Tabular de Caducidades y Predicción</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">
            Control de Vencimientos FEFO & Riesgo de Quiebres
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tablas estructuradas según el estándar SRS para cumplir la meta de <strong>reducción del 22% en mermas</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-amber-50 border border-amber-200 p-3 rounded-2xl">
          <div className="p-2 bg-amber-500 text-white rounded-xl">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-amber-800 uppercase font-bold block">Pérdida Económica en Riesgo:</span>
            <span className="text-sm font-black text-amber-900 font-mono">
              S/ {totalMonetarioEnRiesgo.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('vencimientos')}
          className={"flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer " + (
            activeTab === 'vencimientos'
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          <Clock className="w-4 h-4" />
          <span>Reporte Tabular de Caducidades (90, 60 y 30 días)</span>
          <span className="bg-amber-500 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            {LOTES_CADUCIDAD.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('quiebres')}
          className={"flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer " + (
            activeTab === 'quiebres'
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span>Tabla de Riesgo de Quiebre (&le; 7 días)</span>
          <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            {quiebresPredictivos.length}
          </span>
        </button>
      </div>

      {/* TAB 1: REPORTE TABULAR EXCEL-STYLE DE CADUCIDADES */}
      {activeTab === 'vencimientos' && (
        <div className="space-y-4">
          
          {/* Controls Bar: Search + Filter Buttons */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por lote, medicamento o sede..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto text-xs">
              <button
                onClick={() => setFilterSemaforo('ALL')}
                className={"px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer " + (
                  filterSemaforo === 'ALL' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                Todos ({LOTES_CADUCIDAD.length})
              </button>
              <button
                onClick={() => setFilterSemaforo('ROJO')}
                className={"px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer " + (
                  filterSemaforo === 'ROJO' ? "bg-red-600 text-white" : "bg-red-50 text-red-700 hover:bg-red-100"
                )}
              >
                Crítico &lt;30d (3)
              </button>
              <button
                onClick={() => setFilterSemaforo('NARANJA')}
                className={"px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer " + (
                  filterSemaforo === 'NARANJA' ? "bg-orange-600 text-white" : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                )}
              >
                Alerta 30-60d (2)
              </button>
              <button
                onClick={() => setFilterSemaforo('AMARILLO')}
                className={"px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer " + (
                  filterSemaforo === 'AMARILLO' ? "bg-amber-500 text-slate-950" : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                )}
              >
                Atención 60-90d (2)
              </button>
            </div>

          </div>

          {/* TABLA PRINCIPAL EXCEL-STYLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-800 text-white font-bold uppercase text-[11px]">
                  <tr>
                    <th className="px-4 py-3 text-left">Código Lote</th>
                    <th className="px-4 py-3 text-left">Medicamento / Principio Activo</th>
                    <th className="px-4 py-3 text-left">Reg. DIGEMID</th>
                    <th className="px-4 py-3 text-left">Ubicación / Sede</th>
                    <th className="px-4 py-3 text-center">Fecha Venc.</th>
                    <th className="px-4 py-3 text-center">Días Restantes</th>
                    <th className="px-4 py-3 text-center">Semáforo FEFO</th>
                    <th className="px-4 py-3 text-right">Cant. Cajas</th>
                    <th className="px-4 py-3 text-right">Impacto S/.</th>
                    <th className="px-4 py-3 text-left">Acción Recomendada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredLotes.map(lote => {
                    const med = MEDICAMENTOS.find(m => m.id === lote.medicamentoId);
                    const suc = SUCURSALES.find(s => s.id === lote.sucursalId);
                    const isRojo = lote.semaforo === 'ROJO';
                    const isNaranja = lote.semaforo === 'NARANJA';

                    return (
                      <tr key={lote.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-mono font-bold text-slate-800">
                          <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {lote.codigoLote}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{med?.nombreComercial}</div>
                          <div className="text-[10px] text-slate-500">{med?.principioActivo} • {med?.categoria}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600 text-[11px]">
                          {med?.registroSanitario}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-800">{suc?.nombre}</div>
                          <div className="text-[10px] text-slate-500">{suc?.distrito} ({suc?.marca})</div>
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-medium text-slate-700">
                          {lote.fechaVencimiento}
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-extrabold text-sm text-slate-900">
                          {lote.diasRestantes}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={"inline-block px-2.5 py-1 rounded-full font-black text-[10px] uppercase text-white shadow-xs " + (
                            isRojo ? 'bg-red-600 animate-pulse' :
                            isNaranja ? 'bg-orange-500' : 'bg-amber-500 text-slate-950'
                          )}>
                            {isRojo ? 'CRÍTICO <30D' : isNaranja ? 'ALERTA 30-60D' : 'ATENCIÓN 60-90D'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 text-sm">
                          {lote.cantidad}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-extrabold text-red-600 text-sm">
                          S/ {lote.impactoMonetario.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-slate-700 text-[11px] max-w-xs font-medium">
                          {lote.accionRecomendada}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div>Mostrando <strong>{filteredLotes.length}</strong> lotes monitoreados bajo estándar DIGEMID / FEFO</div>
              <div className="text-emerald-700 font-bold">Meta Cumplida: Reducción estimada del 21.4% de mermas</div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: TABLA DE QUIEBRES PREDICTIVOS */}
      {activeTab === 'quiebres' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-800 text-white font-bold uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3 text-left">Sucursal Afectada</th>
                  <th className="px-4 py-3 text-left">Medicamento</th>
                  <th className="px-4 py-3 text-left">Categoría</th>
                  <th className="px-4 py-3 text-center">Stock Actual</th>
                  <th className="px-4 py-3 text-center">Stock Seguridad</th>
                  <th className="px-4 py-3 text-center">Consumo Diario (CPD)</th>
                  <th className="px-4 py-3 text-center">Días de Autonomía</th>
                  <th className="px-4 py-3 text-center">Severidad</th>
                  <th className="px-4 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {quiebresPredictivos.map((q, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{q.sucursal.nombre}</div>
                      <div className="text-[10px] text-slate-500">{q.sucursal.distrito} • {q.sucursal.marca}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{q.medicamento?.nombreComercial}</div>
                      <div className="text-[10px] text-slate-500">{q.medicamento?.principioActivo}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{q.medicamento?.categoria}</td>
                    <td className="px-4 py-3 text-center font-bold text-red-600 text-sm font-mono">
                      {q.stockActual} cjs
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-slate-500 font-medium">
                      {q.stockSeguridad} cjs
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-slate-700">
                      {q.consumoDiario} / día
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-red-100 text-red-800 font-mono font-bold px-2 py-0.5 rounded-full text-xs">
                        {q.diasAutonomia} días
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-red-600 text-white font-black px-2 py-0.5 rounded text-[10px] uppercase animate-pulse">
                        CRÍTICA
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onNavigate('transfers')}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Ver Sugerencia</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
