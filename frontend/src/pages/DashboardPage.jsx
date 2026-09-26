import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Search,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { MEDICAMENTOS, INVENTARIO_DATA, LOTES_CADUCIDAD, TRASLADOS_SUGERIDOS } from '../services/mockData';

export default function DashboardPage({ currentBranch, onNavigate }) {
  const [dataVersion, setDataVersion] = React.useState(0);

  React.useEffect(() => {
    const handleUpdate = () => setDataVersion(v => v + 1);
    window.addEventListener('siip:data_updated', handleUpdate);
    return () => window.removeEventListener('siip:data_updated', handleUpdate);
  }, []);

  const invLocal = INVENTARIO_DATA[currentBranch.id] || INVENTARIO_DATA[1];
  
  const quiebresCount = invLocal.filter(i => i.estado === 'QUIEBRE_CRITICO').length;

  const dataCategorias = [
    { categoria: 'Antibióticos', stockTotal: 180, demandaDiaria: 28 },
    { categoria: 'Analgésicos', stockTotal: 340, demandaDiaria: 45 },
    { categoria: 'Antiinflamatorios', stockTotal: 260, demandaDiaria: 32 },
    { categoria: 'Cardiovascular', stockTotal: 140, demandaDiaria: 18 },
    { categoria: 'Diabetes', stockTotal: 195, demandaDiaria: 22 },
    { categoria: 'Gastroenterología', stockTotal: 210, demandaDiaria: 29 }
  ];

  const dataSemaforoVencimiento = [
    { name: 'Óptimo (>90 días)', value: 68, color: '#10b981' },
    { name: 'Amarillo (60-90 días)', value: 18, color: '#f59e0b' },
    { name: 'Naranja (30-60 días)', value: 10, color: '#f97316' },
    { name: 'Crítico (<30 días)', value: 4, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6 w-full">
      
      {/* Header Banner with Location Context */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Panel de Control Ejecutivo • Gestión Predictiva de Stock</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            {currentBranch.nombre}
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            {currentBranch.direccion} • {currentBranch.distrito} | Red Farmacias Peruanas
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => onNavigate('search')}
            className="inline-flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg transition cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Buscar Stock &lt;10km</span>
          </button>

          <button
            onClick={() => onNavigate('transfers')}
            className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-700 transition cursor-pointer"
          >
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Gestionar Traslados ({TRASLADOS_SUGERIDOS.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Tasa de Quiebre */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tasa de Quiebre de Stock</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">3.2%</span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingDown className="w-3 h-3 mr-0.5" /> -11.3%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {quiebresCount} fármacos en riesgo crítico en esta sede
          </p>
        </div>

        {/* KPI 2: Reducción de Merma por Vencidos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Reducción de Mermas</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-700">-21.4%</span>
            <span className="text-xs font-semibold text-slate-500">/ Meta: -22%</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            Ahorro de S/ 8,200 en fármacos reubicados
          </p>
        </div>

        {/* KPI 3: Lotes en Riesgo de Caducidad */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Alertas FEFO (&lt;90 días)</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-amber-700">{LOTES_CADUCIDAD.length} Lotes</span>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
              3 Críticos &lt;30d
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Valor en riesgo: S/ 5,384.10 monetizado
          </p>
        </div>

        {/* KPI 4: Disponibilidad / Nivel de Servicio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nivel de Servicio (OTIF)</span>
            <div className="p-2 bg-cyan-50 text-cyan-700 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">96.8%</span>
            <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded">
              Objetivo &gt;95%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            99.9% uptime en sincronización microservicios
          </p>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bar Chart: Stock vs Demanda */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Demanda Diaria vs Stock Disponible por Categoría</h2>
              <p className="text-xs text-slate-500">Evaluación de balance de carga para prevención de quiebres</p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-600 rounded"></span> Stock Físico</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-cyan-400 rounded"></span> Demanda x Día</span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataCategorias} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="categoria" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <Bar dataKey="stockTotal" name="Stock Disponible (Cajas)" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="demandaDiaria" name="Demanda Diaria Promedio" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Semáforo de Caducidad */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Semáforo de Caducidad (FEFO)</h2>
            <p className="text-xs text-slate-500">Distribución de lotes para reducción del 22% en mermas</p>
          </div>

          <div className="h-52 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataSemaforoVencimiento}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {dataSemaforoVencimiento.map((entry, index) => (
                    <Cell key={"cell-" + index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => value + "% del inventario"}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-100 pt-3">
            {dataSemaforoVencimiento.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600 font-medium">{item.name.split(' ')[0]}: <strong>{item.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Critical Items in Local Branch */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Monitoreo Inmediato de Medicamentos en {currentBranch.nombre}</h2>
            <p className="text-xs text-slate-500">Estado de inventario en tiempo real sincronizado con el microservicio</p>
          </div>
          <button 
            onClick={() => onNavigate('search')}
            className="text-xs text-cyan-600 hover:text-cyan-700 font-bold flex items-center gap-1 cursor-pointer"
          >
            Ver Catálogo Completo &lt;10km <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Medicamento</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Lote Activo</th>
                <th className="px-4 py-3 text-center">Stock Actual</th>
                <th className="px-4 py-3 text-center">Stock Seguridad</th>
                <th className="px-4 py-3 text-center">Autonomía (Días)</th>
                <th className="px-4 py-3 text-center">Estado SIIP</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {invLocal.map(item => {
                const med = MEDICAMENTOS.find(m => m.id === item.medicamentoId);
                const isCritico = item.estado === 'QUIEBRE_CRITICO';
                const isSobrestock = item.estado === 'SOBRESTOCK';

                return (
                  <tr key={item.medicamentoId} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{med?.nombreComercial}</div>
                      <div className="text-[11px] text-slate-500">{med?.principioActivo} • EAN: {med?.codigoEAN}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{med?.categoria}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-semibold">{item.lotePrincipal}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-slate-900 text-sm">
                      {item.stockActual}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500 font-medium">
                      {item.stockSeguridad}
                    </td>
                    <td className="px-4 py-3 text-center font-mono">
                      <span className={"px-2 py-0.5 rounded-full font-bold text-[11px] " + (
                        item.diasAutonomia <= 2 ? 'bg-red-100 text-red-700' :
                        item.diasAutonomia <= 5 ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      )}>
                        {item.diasAutonomia} días
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={"px-2.5 py-1 rounded-full font-bold text-[10px] tracking-wide uppercase " + (
                        isCritico ? 'bg-red-600 text-white animate-pulse' :
                        isSobrestock ? 'bg-purple-100 text-purple-800' :
                        item.estado === 'ALERTA_BAJA' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      )}>
                        {item.estado.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isCritico ? (
                        <button
                          onClick={() => onNavigate('search')}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[11px] transition shadow cursor-pointer"
                        >
                          Localizar en &lt;10km
                        </button>
                      ) : (
                        <button
                          onClick={() => onNavigate('search')}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-[11px] transition cursor-pointer"
                        >
                          Ver Sedes
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

    </div>
  );
}
