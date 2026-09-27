import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Car, 
  Footprints, 
  Phone, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  Share2, 
  Layers, 
  Package,
  ShieldCheck
} from 'lucide-react';

export default function RouteMapModal({ 
  isOpen, 
  onClose, 
  sourceBranch, 
  targetBranch, 
  medicine 
}) {
  const [copied, setCopied] = useState(false);
  const [mapMode, setMapMode] = useState('osm'); // 'osm' | 'schematic'

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !targetBranch || !sourceBranch) return null;

  const isMifarma = targetBranch.marca === 'Mifarma';
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${sourceBranch.lat},${sourceBranch.lng}&destination=${targetBranch.lat},${targetBranch.lng}`;

  // Bounding box para OpenStreetMap Embed
  const minLat = Math.min(sourceBranch.lat, targetBranch.lat) - 0.015;
  const maxLat = Math.max(sourceBranch.lat, targetBranch.lat) + 0.015;
  const minLng = Math.min(sourceBranch.lng, targetBranch.lng) - 0.015;
  const maxLng = Math.max(sourceBranch.lng, targetBranch.lng) + 0.015;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${targetBranch.lat}%2C${targetBranch.lng}`;

  const handleCopyWhatsappGuide = () => {
    const text = `🏥 *FARMACIAS PERUANAS - INFORMACIÓN DE DISPONIBILIDAD*\n` +
      `Estimado(a) paciente, tenemos stock de *${medicine?.nombreComercial || 'su medicamento'}* en nuestra sede:\n\n` +
      `📍 *${targetBranch.nombre}*\n` +
      `🏢 *Dirección:* ${targetBranch.direccion} (${targetBranch.distrito})\n` +
      `📌 *Referencia:* ${targetBranch.referencia || 'Frente a zona comercial'}\n` +
      `📦 *Stock disponible:* ${targetBranch.stock || 'Disponible'} cajas\n` +
      `⏱️ *Tiempo estimado:* ${targetBranch.tiempoEstimadoAutoMin || 8} min en auto / ${targetBranch.tiempoEstimadoPieMin || 25} min a pie\n` +
      `📞 *Teléfono:* ${targetBranch.telefono}\n\n` +
      `🗺️ *Ver ruta en Google Maps:* ${googleMapsUrl}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="route-modal-title"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <span className={"text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider " + (
              isMifarma ? "bg-red-600 text-white" : "bg-blue-900 text-yellow-400"
            )}>
              {targetBranch.marca}
            </span>
            <div>
              <h2 id="route-modal-title" className="text-base font-extrabold text-slate-900">
                Minimapa de Geolocalización y Guía de Ruta
              </h2>
              <p className="text-xs text-slate-500">
                Orientación al paciente desde <strong>{sourceBranch.nombre}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition cursor-pointer"
            aria-label="Cerrar modal de ruta"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Card Resumen de Disponibilidad en Destino */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 rounded-2xl shadow-sm">
            <div className="md:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-800/60 px-2 py-0.5 rounded">
                Sede con Stock Confirmado
              </span>
              <h3 className="text-base font-bold text-white mt-1">{targetBranch.nombre}</h3>
              <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>{targetBranch.direccion} — {targetBranch.distrito}</span>
              </p>
              {targetBranch.referencia && (
                <p className="text-[11px] text-cyan-200 italic mt-1">
                  Ref: {targetBranch.referencia}
                </p>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex flex-col justify-center items-center text-center border border-white/20">
              <span className="text-[10px] uppercase font-bold text-slate-300">Stock para Entrega</span>
              <div className="text-2xl font-black font-mono text-emerald-400 my-0.5">
                {targetBranch.stock} <span className="text-xs font-normal text-white">cajas</span>
              </div>
              <span className="text-[10px] text-slate-300">
                {medicine?.nombreComercial || 'Medicamento'}
              </span>
            </div>
          </div>

          {/* Minimapa Interactivo */}
          <div className="bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-white px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 font-bold text-slate-700">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span>Visualización Geográfica (Distancia: {targetBranch.distanciaKm} km)</span>
              </div>
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setMapMode('osm')}
                  className={"px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer " + (
                    mapMode === 'osm' ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Mapa Interactivo OSM
                </button>
                <button
                  onClick={() => setMapMode('schematic')}
                  className={"px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer " + (
                    mapMode === 'schematic' ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Plano Esquemático
                </button>
              </div>
            </div>

            {/* Vista 1: OpenStreetMap interactivo real */}
            {mapMode === 'osm' && (
              <div className="relative w-full h-64 bg-slate-200">
                <iframe
                  title="Minimapa de Rutas"
                  src={osmEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] text-slate-700 font-medium border border-slate-200 shadow-xs">
                  📍 Marcador rojo: Sede <strong>{targetBranch.nombre}</strong>
                </div>
              </div>
            )}

            {/* Vista 2: Esquema vectorial pedagógico */}
            {mapMode === 'schematic' && (
              <div className="p-6 bg-slate-900 text-white relative flex flex-col justify-center min-h-[256px]">
                <div className="flex items-center justify-between max-w-lg mx-auto w-full relative z-10">
                  {/* Origen */}
                  <div className="flex flex-col items-center text-center w-36">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 border-2 border-white flex items-center justify-center shadow-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-blue-400 mt-2">Sede Actual</span>
                    <span className="text-xs font-bold text-white line-clamp-1">{sourceBranch.nombre}</span>
                    <span className="text-[10px] text-slate-400">{sourceBranch.distrito}</span>
                  </div>

                  {/* Trayecto / Distancia */}
                  <div className="flex-1 px-4 flex flex-col items-center">
                    <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold font-mono">
                      <Car className="w-4 h-4 animate-bounce" />
                      <span>{targetBranch.distanciaKm} km</span>
                    </div>
                    <div className="w-full border-t-2 border-dashed border-cyan-400/60 my-2 relative">
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
                    </div>
                    <span className="text-[10px] text-slate-400">
                      ~{targetBranch.tiempoEstimadoAutoMin || 8} min auto • ~{targetBranch.tiempoEstimadoPieMin || 25} min a pie
                    </span>
                  </div>

                  {/* Destino */}
                  <div className="flex flex-col items-center text-center w-36">
                    <div className={"w-12 h-12 rounded-2xl border-2 border-white flex items-center justify-center shadow-lg " + (
                      isMifarma ? "bg-red-600" : "bg-emerald-600"
                    )}>
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 mt-2">Sede con Stock</span>
                    <span className="text-xs font-bold text-white line-clamp-1">{targetBranch.nombre}</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-300">
                      {targetBranch.stock} cajas
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Guía Verbal para el Químico Farmacéutico (Script de Ventanilla) */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <Share2 className="w-4 h-4 text-amber-700" />
              <span>Instrucciones de Orientación al Paciente (Script de Ventanilla)</span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed italic bg-white/70 p-3 rounded-xl border border-amber-100">
              "Estimado(a) paciente, en este momento nos quedan pocas unidades en esta sede, pero en nuestra farmacia hermana <strong>{targetBranch.nombre}</strong> (en <strong>{targetBranch.direccion}</strong>) cuentan con <strong>{targetBranch.stock} cajas disponibles</strong>. Le queda a solo <strong>{targetBranch.tiempoEstimadoAutoMin || 7} minutos en auto</strong> ({targetBranch.distanciaKm} km). Si gusta, le comparto la ruta directa a su celular o le genero una solicitud de reserva."
            </p>

            {targetBranch.instruccionRuta && (
              <div className="text-[11px] text-amber-900 font-medium flex items-start gap-1.5 pt-1">
                <Navigation className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span><strong>Ruta sugerida:</strong> {targetBranch.instruccionRuta}</span>
              </div>
            )}
          </div>

          {/* Información Adicional y Tiempos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center space-x-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">En Taxi / Auto</span>
                <span className="text-xs font-black text-slate-900">
                  ~{targetBranch.tiempoEstimadoAutoMin || 8} minutos
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Caminando</span>
                <span className="text-xs font-black text-slate-900">
                  ~{targetBranch.tiempoEstimadoPieMin || 24} minutos
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center space-x-3">
              <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Teléfono Directo</span>
                <span className="text-xs font-black text-slate-900">
                  {targetBranch.telefono}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyWhatsappGuide}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "¡Guía Copiada al Portapapeles!" : "Copiar Guía para Paciente (WhatsApp)"}</span>
          </button>

          <div className="flex items-center space-x-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <span>Abrir en Google Maps GPS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
