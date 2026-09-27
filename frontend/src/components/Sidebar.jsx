import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  AlertTriangle, 
  Truck, 
  Layers,
  ShieldCheck,
  Scale,
  PackagePlus,
  Building2
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  onSelectTab, 
  alertsCount, 
  transfersCount,
  onOpenLegalModal 
}) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard General',
      icon: LayoutDashboard,
      badge: null,
      desc: 'KPIs, disponibilidad y quiebres'
    },
    {
      id: 'search',
      label: 'Inventario Geocercano',
      icon: Search,
      badge: '<10km',
      desc: 'Búsqueda de stock en radio de 10km'
    },
    {
      id: 'products',
      label: 'Gestión de Productos',
      icon: PackagePlus,
      badge: 'Nuevo',
      badgeColor: 'bg-indigo-600 text-white',
      desc: 'Alta, dermocosmética y stock'
    },
    {
      id: 'branches',
      label: 'Gestión de Sedes',
      icon: Building2,
      badge: '15 Red',
      badgeColor: 'bg-cyan-600 text-white',
      desc: '15 Sedes InkaFarma, Mifarma & CD'
    },
    {
      id: 'alerts',
      label: 'Alertas Predictivas',
      icon: AlertTriangle,
      badge: alertsCount > 0 ? alertsCount : null,
      badgeColor: 'bg-amber-500 text-white',
      desc: 'Caducidades (90/60/30d) y quiebres'
    },
    {
      id: 'transfers',
      label: 'Gestión de Traslados',
      icon: Truck,
      badge: transfersCount > 0 ? transfersCount : null,
      badgeColor: 'bg-emerald-500 text-white',
      desc: 'Sugerencias y Guías de Remisión'
    },
    {
      id: 'diagrams',
      label: 'Diagramas & Casos de Uso',
      icon: Layers,
      badge: 'UTP',
      badgeColor: 'bg-blue-600 text-white',
      desc: 'BPMN, UML, DER, Gantt y WBS'
    },
    {
      id: 'compliance',
      label: 'Seguridad & Legal (40)',
      icon: ShieldCheck,
      badge: '100%',
      badgeColor: 'bg-emerald-600 text-white',
      desc: '20 Seguridad + 20 Anti-Demandas'
    }
  ];

  return (
    <aside 
      className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto z-20 self-start shadow-xl"
      aria-label="Menú Lateral de Navegación"
    >
      <div className="p-4 space-y-6">
        
        {/* Project Tag */}
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" aria-hidden="true"></span>
            <span>PROYECTO INTEGRADOR I</span>
          </div>
          <div className="text-[11px] text-slate-300 mt-1 font-medium">
            Mendoza Paucar Ronny Fernando
          </div>
          <div className="text-[10px] text-slate-400">
            Sección 20065 • UTP 2026
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-1.5" aria-label="Módulos Principales">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Módulos del Sistema
          </div>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={"w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 " + (
                  isActive 
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/30 font-bold" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <div className="flex items-center space-x-3 text-left">
                  <Icon className={"w-4 h-4 " + (isActive ? "text-white" : "text-slate-400")} aria-hidden="true" />
                  <div>
                    <div>{item.label}</div>
                  </div>
                </div>

                {item.badge && (
                  <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + (item.badgeColor || "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30")}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Footer Info & Enlaces Legales */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Meta Merma:</span>
          <span className="text-emerald-400 font-bold">-22% Vencidos</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Disponibilidad:</span>
          <span className="text-cyan-400 font-bold">99.9% Uptime</span>
        </div>

        {/* Links de Transparencia y Ley 29733 */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <button
            type="button"
            onClick={() => onOpenLegalModal('privacidad')}
            className="hover:text-cyan-400 transition underline cursor-pointer"
          >
            Privacidad (Ley 29733)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onOpenLegalModal('arco')}
            className="hover:text-red-400 transition underline cursor-pointer"
          >
            Derechos ARCO
          </button>
        </div>
      </div>
    </aside>
  );
}
