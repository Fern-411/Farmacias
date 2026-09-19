import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X, Settings2 } from 'lucide-react';

export default function CookieConsentBanner({ onOpenLegalModal }) {
  const [visible, setVisible] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Siempre activas para funcionamiento del sistema
    analytics: false,
    security: true
  });

  useEffect(() => {
    const consent = localStorage.getItem('siip_cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('siip_cookie_consent', JSON.stringify({
      necessary: true,
      analytics: true,
      security: true,
      timestamp: new Date().toISOString()
    }));
    setVisible(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem('siip_cookie_consent', JSON.stringify({
      necessary: true,
      analytics: false,
      security: true,
      timestamp: new Date().toISOString()
    }));
    setVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('siip_cookie_consent', JSON.stringify({
      ...preferences,
      necessary: true,
      timestamp: new Date().toISOString()
    }));
    setVisible(false);
    setShowConfig(false);
  };

  if (!visible) return null;

  return (
    <div 
      role="region" 
      aria-label="Consentimiento de Cookies" 
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 text-slate-200 shadow-2xl transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        <div className="flex items-start space-x-3.5 flex-1">
          <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <span>Uso de Cookies y Privacidad en SIIP (Farmacias Peruanas)</span>
              <span className="text-[10px] bg-slate-800 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">
                Ley N° 29733
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Utilizamos cookies técnicas y de sesión esenciales para autenticación segura (JWT) y el cálculo de inventario georreferenciado. 
              No empleamos cookies publicitarias ni comercializamos sus datos con terceros. Puede revisar nuestra{' '}
              <button 
                type="button"
                onClick={() => onOpenLegalModal('cookies')}
                className="text-cyan-400 hover:text-cyan-300 underline font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded"
              >
                Política de Cookies
              </button>{' '}
              y{' '}
              <button 
                type="button"
                onClick={() => onOpenLegalModal('privacidad')}
                className="text-cyan-400 hover:text-cyan-300 underline font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded"
              >
                Política de Privacidad
              </button>.
            </p>

            {showConfig && (
              <div className="mt-3 p-3 bg-slate-800/90 rounded-xl border border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                <label className="flex items-center space-x-2 text-slate-300 cursor-not-allowed">
                  <input type="checkbox" checked disabled className="rounded text-blue-600" />
                  <span><strong>Cookies Técnicas</strong> (Obligatorias)</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-200 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={preferences.security}
                    onChange={(e) => setPreferences(p => ({ ...p, security: e.target.checked }))}
                    className="rounded text-blue-600 focus:ring-blue-500" 
                  />
                  <span>Seguridad y Prevención DoS</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-200 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences(p => ({ ...p, analytics: e.target.checked }))}
                    className="rounded text-blue-600 focus:ring-blue-500" 
                  />
                  <span>Telemetría de Rendimiento</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción sin patrones oscuros (Dark Patterns) */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0 justify-end text-xs font-semibold">
          {showConfig ? (
            <button
              type="button"
              onClick={handleSavePreferences}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              Guardar Preferencias
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfig(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 flex items-center gap-1.5 transition focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Settings2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Configurar</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleRejectNonEssential}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-600 transition focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Solo Esenciales
          </button>

          <button
            type="button"
            onClick={handleAcceptAll}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg transition focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Aceptar Todas
          </button>
        </div>

      </div>
    </div>
  );
}
