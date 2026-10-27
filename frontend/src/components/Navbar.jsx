import React from 'react';
import { 
  Building2, 
  Bell, 
  UserCircle, 
  ShieldCheck, 
  ChevronDown,
  LogOut,
  Sparkles,
  MapPin,
  Scale,
  Database,
  RotateCcw
} from 'lucide-react';
import { SUCURSALES, resetFactoryData } from '../services/mockData';

export default function Navbar({ 
  currentUser, 
  currentBranch, 
  onSelectBranch, 
  onLogout,
  criticalAlertsCount,
  onNavigate,
  onOpenLegalModal
}) {
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md border-b border-slate-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & System Title */}
        <div 
          className="flex items-center space-x-3 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1" 
          onClick={() => onNavigate('dashboard')}
          tabIndex={0}
          role="button"
          aria-label="Ir al Dashboard General"
        >
          <div className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 rounded-lg shadow">
            <span className="font-black text-xl tracking-tight text-white">SIIP</span>
            <span className="text-xs bg-white text-blue-900 font-bold px-1.5 py-0.5 rounded uppercase">v1.0</span>
          </div>
          <div className="hidden md:block">
            <div className="text-xs text-slate-400 font-medium tracking-wide">FARMACIAS PERUANAS</div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span className="text-yellow-400">InkaFarma</span>
              <span className="text-slate-500">|</span>
              <span className="text-red-400">Mifarma</span>
            </div>
          </div>
        </div>

        {/* Central Branch Selector (Active Location - Multi-tenancy RLS) */}
        <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs shadow-inner max-w-md">
          <MapPin className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
          <span className="text-slate-400 hidden sm:inline whitespace-nowrap">Sede Activa:</span>
          <select 
            value={currentBranch.id}
            onChange={(e) => {
              const selected = SUCURSALES.find(s => s.id === parseInt(e.target.value));
              if (selected) onSelectBranch(selected);
            }}
            aria-label="Seleccionar sucursal activa"
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer pr-1 truncate"
          >
            {SUCURSALES.map(suc => (
              <option key={suc.id} value={suc.id} className="bg-slate-800 text-white">
                {suc.marca !== 'Corporativo' ? "[" + suc.marca + "] " : ""}{suc.nombre} ({suc.distrito} - {suc.departamento || 'Lima'})
              </option>
            ))}
          </select>
        </div>

        {/* Right Section: Compliance, Notifications & User Profile */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Indicador de Persistencia Real LocalDB */}
          <div className="hidden xl:flex items-center space-x-1.5 py-1 px-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-[11px] font-bold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>LocalDB Persistente</span>
          </div>

          {/* Botón de Reinicio de Demo / Restablecer Fábrica */}
          <button
            onClick={() => {
              if (window.confirm('¿Desea restablecer todos los datos a valores iniciales de fábrica? Se limpiarán los cambios de stock, transferencias y productos creados.')) {
                resetFactoryData();
              }
            }}
            className="hidden xl:flex items-center space-x-1 py-1 px-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-semibold transition cursor-pointer"
            title="Restablecer Datos Iniciales de Fábrica"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Demo</span>
          </button>

          {/* Quick Legal / Compliance button */}
          <button
            onClick={() => onNavigate('compliance')}
            className="hidden sm:flex items-center space-x-1.5 py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 border border-slate-700 rounded-xl text-xs font-bold transition focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
            title="Ver Auditoría de 40 Puntos de Seguridad y Ley"
            aria-label="Ver Auditoría de Seguridad y Cumplimiento Legal"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline">Auditoría 40 Puntos</span>
          </button>

          {/* Notifications Button */}
          <button 
            onClick={() => onNavigate('alerts')}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400"
            title="Ver Alertas Predictivas"
            aria-label={`Ver Alertas Predictivas (${criticalAlertsCount} críticas)`}
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            {criticalAlertsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-slate-900 animate-pulse">
                {criticalAlertsCount}
              </span>
            )}
          </button>

          <div className="h-6 w-px bg-slate-700" aria-hidden="true"></div>

          {/* User Role Badge */}
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-cyan-600/30 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold text-xs">
              {currentUser.role?.includes('FARMACEUTICO') ? 'QF' : currentUser.role?.includes('ADMIN_CD') ? 'CD' : currentUser.role?.includes('SUPERVISOR') ? 'SUP' : currentUser.role?.includes('ASISTENTE') ? 'TEC' : currentUser.role?.includes('AUDITOR') ? 'AUD' : 'SIIP'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-cyan-400 font-medium">{currentUser.roleTitle}</div>
            </div>
          </div>

          {/* Logout (Link de baja/cierre - Punto Legal 18) */}
          <button 
            onClick={onLogout}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-red-400"
            title="Cerrar Sesión Segura (Revocar Token)"
            aria-label="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
}
