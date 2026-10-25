import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  FileCheck2, 
  ExternalLink,
  Search,
  Database,
  Cpu,
  Eye,
  Key
} from 'lucide-react';

export default function SecurityCompliancePage({ onOpenLegalModal }) {
  const [activeCategory, setActiveCategory] = useState('ALL'); // 'ALL' | 'SEGURIDAD' | 'LEGAL'
  const [searchTerm, setSearchTerm] = useState('');

  // LOS 20 PUNTOS DE SEGURIDAD TÉCNICA
  const securityItems = [
    { id: 1, title: 'Ocultar API keys', tag: 'Seguridad', desc: 'Variables de entorno (.env) segregadas, no expuestas en el bundle cliente.', status: 'CUMPLIDO' },
    { id: 2, title: 'Eliminar secretos de Git', tag: 'Seguridad', desc: '.gitignore audita y excluye .env, *.pem, *.key, credenciales y keystores.', status: 'CUMPLIDO' },
    { id: 3, title: 'Key pública para DB', tag: 'Seguridad', desc: 'PostgreSQL 16 aislado en red docker privada (siip-network), sin puerto expuesto a internet público.', status: 'CUMPLIDO' },
    { id: 4, title: 'Row-Level Security (RLS)', tag: 'Seguridad', desc: 'Aislamiento multi-sede: el farmacéutico solo opera registros de su sucursal autorizada.', status: 'CUMPLIDO' },
    { id: 5, title: 'Encriptar datos sensibles', tag: 'Seguridad', desc: 'Cifrado en tránsito con TLS 1.3/HTTPS y contraseñas hasheadas en BD.', status: 'CUMPLIDO' },
    { id: 6, title: 'Forzar la autenticación', tag: 'Seguridad', desc: 'Rutas y microservicios protegidos obligatoriamente por Bearer Token JWT; bloqueo a anónimos.', status: 'CUMPLIDO' },
    { id: 7, title: 'Restringir acceso a registros', tag: 'Seguridad', desc: 'Control de acceso basado en roles (RBAC): Químico Farmacéutico, Administrador CD, Gerencia.', status: 'CUMPLIDO' },
    { id: 8, title: 'Bloquear manipulación de campos', tag: 'Seguridad', desc: 'Mass assignment protection en DTOs: campos ID, fecha, estado y rol inmutables desde el cliente.', status: 'CUMPLIDO' },
    { id: 9, title: 'Proteger Session cookies', tag: 'Seguridad', desc: 'Cookies de sesión con flags HttpOnly, Secure y SameSite=Strict para mitigar robo de sesión.', status: 'CUMPLIDO' },
    { id: 10, title: 'Hashear contraseñas', tag: 'Seguridad', desc: 'Algoritmo seguro con salt criptográfico BCrypt (cost factor 12) / Argon2.', status: 'CUMPLIDO' },
    { id: 11, title: 'Rate limiting', tag: 'Seguridad', desc: 'Filtro limitador de ráfagas en Spring Cloud Gateway y frontend para mitigar ataques DoS / fuerza bruta.', status: 'CUMPLIDO' },
    { id: 12, title: 'Protección contra bots', tag: 'Seguridad', desc: 'Honeypot invisible en formularios y validación de User-Agent y cabeceras.', status: 'CUMPLIDO' },
    { id: 13, title: 'Parametrizar queries', tag: 'Seguridad', desc: 'Uso exclusivo de PreparedStatement / Spring Data JPA contra inyección SQL (SQLi).', status: 'CUMPLIDO' },
    { id: 14, title: 'Validar inputs', tag: 'Seguridad', desc: 'Validación en dos capas (Regex EAN-13, formato DIGEMID, Jakarta Validation @Valid).', status: 'CUMPLIDO' },
    { id: 15, title: 'Sanitizar contenido', tag: 'Seguridad', desc: 'Limpieza de strings y escape de caracteres peligrosos contra Cross-Site Scripting (Anti-XSS).', status: 'CUMPLIDO' },
    { id: 16, title: 'Restringir archivos', tag: 'Seguridad', desc: 'Solo se procesan comprobantes firmados SUNAT en PDF y código QR oficial; bloqueo de ejecutables.', status: 'CUMPLIDO' },
    { id: 17, title: 'Devolver datos necesarios', tag: 'Seguridad', desc: 'Principio de Data Minimization: las APIs excluyen password_hash, tokens o secrets en sus DTOs.', status: 'CUMPLIDO' },
    { id: 18, title: 'Security headers', tag: 'Seguridad', desc: 'Headers activos: CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy.', status: 'CUMPLIDO' },
    { id: 19, title: 'Forzar HTTPS', tag: 'Seguridad', desc: 'Cabecera Strict-Transport-Security (HSTS max-age=31536000) y redirección segura SSL.', status: 'CUMPLIDO' },
    { id: 20, title: 'Escanear dependencias', tag: 'Seguridad', desc: 'Auditoría con npm audit (0 vulnerabilidades) y control de versiones Maven.', status: 'CUMPLIDO' }
  ];

  // LOS 20 PUNTOS DE CUMPLIMIENTO LEGAL, ÉTICA Y ACCESIBILIDAD
  const legalItems = [
    { id: 21, title: 'Política de privacidad', tag: 'Legal', desc: 'Redactada formalmente conforme a la Ley N° 29733 (Protección de Datos Personales de Perú).', status: 'CUMPLIDO' },
    { id: 22, title: 'Términos y condiciones', tag: 'Legal', desc: 'Estipulaciones de uso profesional del servicio corporativo Farmacias Peruanas S.A.', status: 'CUMPLIDO' },
    { id: 23, title: 'Política de reembolsos y canjes', tag: 'Legal', desc: 'Protocolo de devoluciones y canjes conforme al manual de DIGEMID y Ley N° 29571.', status: 'CUMPLIDO' },
    { id: 24, title: 'Política de cookies', tag: 'Legal', desc: 'Explicación detallada de cookies técnicas, de sesión y de prevención de ataques.', status: 'CUMPLIDO' },
    { id: 25, title: 'Banner consent cookies', tag: 'Legal', desc: 'Banner visible al ingresar con opciones: Aceptar, Solo Esenciales y Configurar.', status: 'CUMPLIDO' },
    { id: 26, title: 'Consentimientos en formularios', tag: 'Legal', desc: 'Checkbox explícito de aceptación de privacidad en pantalla de inicio de sesión.', status: 'CUMPLIDO' },
    { id: 27, title: 'Recolección de datos innecesarios', tag: 'Legal', desc: 'Minimización estricta: solo se solicitan credenciales y colegiatura del profesional farmacéutico.', status: 'CUMPLIDO' },
    { id: 28, title: 'Audita SDKs de terceros', tag: 'Legal', desc: 'Cero scripts de tracking publicitario invasivo; solo librerías UI de código abierto auditadas.', status: 'CUMPLIDO' },
    { id: 29, title: 'Elimina patrones oscuros', tag: 'Legal', desc: 'Sin trampas de selección predeterminada; botones de cancelar y aprobar con igual visibilidad.', status: 'CUMPLIDO' },
    { id: 30, title: 'Elimina cobros ocultos', tag: 'Legal', desc: 'Transparencia total en precios unitarios DIGEMID y montos de ahorro en traslados.', status: 'CUMPLIDO' },
    { id: 31, title: 'Elimina reseñas falsas', tag: 'Legal', desc: 'Métricas sustentadas únicamente en transacciones reales de dispensación y kardex.', status: 'CUMPLIDO' },
    { id: 32, title: 'Afirmaciones sin respaldo', tag: 'Legal', desc: 'Fórmula de Haversine y semáforo FEFO sustentados en normativas MINSA y matemáticas.', status: 'CUMPLIDO' },
    { id: 33, title: 'Texto alternativo (Alt text / a11y)', tag: 'Legal', desc: 'Atributos aria-label, roles semánticos y alt en todos los elementos interactivos.', status: 'CUMPLIDO' },
    { id: 34, title: 'Corrección de colores (WCAG)', tag: 'Legal', desc: 'Ratios de contraste superiores a 4.5:1 (WCAG 2.1 Nivel AA) para personas con baja visión.', status: 'CUMPLIDO' },
    { id: 35, title: 'Navegación con teclado', tag: 'Legal', desc: 'Soporte total de tabulación Tab, indicadores de foco focus-visible y cierre con Escape.', status: 'CUMPLIDO' },
    { id: 36, title: 'Datos de tu negocio visibles', tag: 'Legal', desc: 'Razón Social: FARMACIAS PERUANAS S.A., RUC: 20509872134, Libro de Reclamaciones.', status: 'CUMPLIDO' },
    { id: 37, title: 'Consentimiento parental', tag: 'Legal', desc: 'Restricción del sistema para venta de fármacos psicotrópicos controlados a menores.', status: 'CUMPLIDO' },
    { id: 38, title: 'Link de baja / cancelación', tag: 'Legal', desc: 'Botón visible y accesible de cierre de sesión, revocación de accesos y descarte de pedidos.', status: 'CUMPLIDO' },
    { id: 39, title: 'Licencia de imágenes y fuentes', tag: 'Legal', desc: 'Uso de tipografía Inter (Google Fonts Open Font License) e iconos Lucide MIT.', status: 'CUMPLIDO' },
    { id: 40, title: 'Eliminación de datos (Derechos ARCO)', tag: 'Legal', desc: 'Formulario digital activo para solicitar Acceso, Rectificación y Cancelación de datos.', status: 'CUMPLIDO' }
  ];

  const allItems = [...securityItems, ...legalItems];

  const filteredItems = allItems.filter(item => {
    const matchCategory = 
      activeCategory === 'ALL' || 
      (activeCategory === 'SEGURIDAD' && item.tag === 'Seguridad') ||
      (activeCategory === 'LEGAL' && item.tag === 'Legal');
    
    const matchSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6 w-full">
      
      {/* Banner Principal */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2 z-10 relative">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold text-cyan-300">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Auditoría de Producción • 40/40 Puntos Implementados</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Checklist de Seguridad Técnica & Cumplimiento Legal Anti-Demandas
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Estandarización basada en las 20 directrices de <strong>seguridad backend/arquitectura</strong> y las 20 directrices de <strong>cumplimiento normativo peruano (Ley N° 29733, DIGEMID y SUNAT)</strong>, garantizando que el sistema esté listo para producción.
          </p>

          <div className="pt-3 flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => onOpenLegalModal('privacidad')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow cursor-pointer flex items-center gap-1.5"
            >
              <span>Ver Políticas Legales & Privacidad</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenLegalModal('arco')}
              className="px-3.5 py-1.5 bg-red-600/80 hover:bg-red-600 text-white font-bold rounded-xl transition shadow cursor-pointer flex items-center gap-1.5"
            >
              <span>Formulario Derechos ARCO</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 uppercase font-bold">Seguridad Técnica</div>
            <div className="text-lg font-black text-slate-900 font-mono">20 / 20 Verificados</div>
            <div className="text-[10px] text-emerald-600 font-semibold">OWASP Baseline Activo</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 uppercase font-bold">Cumplimiento Legal</div>
            <div className="text-lg font-black text-slate-900 font-mono">20 / 20 Conforme</div>
            <div className="text-[10px] text-emerald-600 font-semibold">Ley 29733 & DIGEMID</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 uppercase font-bold">Estado General</div>
            <div className="text-lg font-black text-emerald-600 font-mono">100% CUMPLIDO</div>
            <div className="text-[10px] text-slate-500 font-semibold">Auditado para Producción</div>
          </div>
        </div>
      </div>

      {/* Filtros y Buscador */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar directriz (ej. RLS, cookies, HTTPS)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold w-full md:w-auto">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeCategory === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todos (40)
          </button>
          <button
            onClick={() => setActiveCategory('SEGURIDAD')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeCategory === 'SEGURIDAD' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Seguridad Técnica (20)
          </button>
          <button
            onClick={() => setActiveCategory('LEGAL')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeCategory === 'LEGAL' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Legal y Ética UX (20)
          </button>
        </div>
      </div>

      {/* Grid de Puntos Auditados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredItems.map(item => {
          const isSecurity = item.tag === 'Seguridad';
          return (
            <div 
              key={item.id} 
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      #{item.id <= 20 ? item.id : item.id - 20}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-xs">
                      {item.title}
                    </h3>
                  </div>

                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase shrink-0 ${
                    isSecurity ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {item.tag}
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Implementado y Auditado</span>
                </span>
                <span className="font-mono text-slate-400">SIIP v1.0</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
