import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  RefreshCcw, 
  Cookie, 
  Building2, 
  UserX, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function LegalModal({ initialTab = 'privacidad', onClose }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [arcoSubmitted, setArcoSubmitted] = useState(false);
  const [arcoForm, setArcoForm] = useState({
    nombre: '',
    dni: '',
    correo: '',
    derecho: 'CANCELACION', // ACCESO, RECTIFICACION, CANCELACION, OPOSICION
    motivo: ''
  });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Cerrar con tecla Escape (Accesibilidad punto 15)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleArcoSubmit = (e) => {
    e.preventDefault();
    setArcoSubmitted(true);
    setTimeout(() => {
      // Simulación de registro formal de solicitud ARCO
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Modal */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/30 border border-blue-500/40 rounded-xl text-blue-400">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-base font-extrabold text-white">
                Marco Legal, Privacidad y Derechos del Usuario
              </h2>
              <p className="text-xs text-slate-400">
                FARMACIAS PERUANAS S.A. • RUC 20509872134 • Ley N° 29733 & Normativa DIGEMID
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal de información legal"
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex flex-wrap gap-1.5 text-xs font-bold shrink-0">
          <button
            onClick={() => { setActiveTab('privacidad'); setArcoSubmitted(false); }}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'privacidad' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Política de Privacidad</span>
          </button>

          <button
            onClick={() => { setActiveTab('terminos'); setArcoSubmitted(false); }}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'terminos' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Términos y Condiciones</span>
          </button>

          <button
            onClick={() => { setActiveTab('devoluciones'); setArcoSubmitted(false); }}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'devoluciones' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Devoluciones (DIGEMID)</span>
          </button>

          <button
            onClick={() => { setActiveTab('cookies'); setArcoSubmitted(false); }}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cookies' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Cookie className="w-3.5 h-3.5" />
            <span>Cookies</span>
          </button>

          <button
            onClick={() => { setActiveTab('empresa'); setArcoSubmitted(false); }}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'empresa' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Datos Empresa & Libro Reclamaciones</span>
          </button>

          <button
            onClick={() => { setActiveTab('arco'); setArcoSubmitted(false); }}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'arco' ? 'bg-red-600 text-white shadow-sm' : 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            <span>Derechos ARCO / Eliminar Datos</span>
          </button>
        </div>

        {/* Modal Body / Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          
          {/* TAB 1: POLÍTICA DE PRIVACIDAD */}
          {activeTab === 'privacidad' && (
            <div className="space-y-3">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded-r-xl text-blue-900 font-medium">
                Conforme a la <strong>Ley N° 29733 (Ley de Protección de Datos Personales del Perú)</strong> y su Reglamento (D.S. 003-2013-JUS), 
                Farmacias Peruanas S.A. informa sobre el tratamiento legítimo de sus datos personales.
              </div>

              <h3 className="font-extrabold text-sm text-slate-900">1. Responsable del Banco de Datos</h3>
              <p>
                <strong>Razón Social:</strong> FARMACIAS PERUANAS S.A.<br />
                <strong>RUC:</strong> 20509872134<br />
                <strong>Domicilio Fiscal:</strong> Av. Defensores del Morro N° 1277, Chorrillos, Lima, Perú.<br />
                <strong>Banco de Datos:</strong> "Usuarios y Personal Farmacéutico SIIP", inscrito ante el Registro Nacional de Protección de Datos Personales.
              </p>

              <h3 className="font-extrabold text-sm text-slate-900">2. Finalidad y Minimización de Datos (Principio de Proporcionalidad)</h3>
              <p>
                El SIIP recopila exclusivamente los datos estrictamente indispensables para la operatividad logística y técnica: nombre completo, 
                número de DNI, correo electrónico corporativo, registro de colegiatura (CQFP) y sede laboral. <strong>No recolectamos datos sensibles ni hábitos de consumo innecesarios</strong>.
              </p>

              <h3 className="font-extrabold text-sm text-slate-900">3. Seguridad y Confidencialidad</h3>
              <p>
                Los datos viajan encriptados bajo protocolo TLS/HTTPS con cifrado AES-256 en reposo. Las contraseñas se almacenan hasheadas con salt criptográfico (BCrypt). 
                No se transfieren ni venden datos a terceros con fines comerciales.
              </p>
            </div>
          )}

          {/* TAB 2: TÉRMINOS Y CONDICIONES */}
          {activeTab === 'terminos' && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">1. Ámbito de Aplicación</h3>
              <p>
                El Sistema Inteligente de Inventario y Predicción (SIIP) es una plataforma corporativa desarrollada para optimizar la rotación de existencias 
                y eliminar los quiebres de stock en la red de InkaFarma y Mifarma.
              </p>

              <h3 className="font-extrabold text-sm text-slate-900">2. Responsabilidad del Químico Farmacéutico</h3>
              <p>
                El profesional farmacéutico es responsable del uso ético y confidencial de sus credenciales. Queda prohibida la manipulación arbitraria de 
                estados de stock o la aprobación fraudulenta de traslados sin respaldo de receta o verificación física de inventario.
              </p>

              <h3 className="font-extrabold text-sm text-slate-900">3. Validez de las Guías de Remisión</h3>
              <p>
                Toda Guía de Remisión Electrónica Remitente generada en el sistema cuenta con valor legal ante SUNAT (R.S. N° 000123-2022/SUNAT) y DIGEMID, 
                amparada en el código hash criptográfico y código QR de control.
              </p>
            </div>
          )}

          {/* TAB 3: DEVOLUCIONES Y DIGEMID */}
          {activeTab === 'devoluciones' && (
            <div className="space-y-3">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl text-amber-900 font-medium">
                Protocolo estricto conforme al <strong>Manual de Buenas Prácticas de Almacenamiento y Dispensación (DIGEMID / MINSA)</strong>.
              </div>

              <h3 className="font-extrabold text-sm text-slate-900">1. Retiro y Cuarentena de Lotes (Semáforo FEFO)</h3>
              <p>
                Los medicamentos en <strong>Semáforo Rojo (&lt; 30 días)</strong> son bloqueados automáticamente por el sistema para venta directa, 
                siendo destinados exclusivamente a devolución formal al laboratorio fabricante o canje por fecha de expiración garantizada.
              </p>

              <h3 className="font-extrabold text-sm text-slate-900">2. Devoluciones por Falla de Calidad o Reclamo de Paciente</h3>
              <p>
                Conforme a la Ley N° 29571 (Código de Protección al Consumidor), todo fármaco con alteración de empaque primario, rotura de cadena de frío 
                o alerta de seguridad emitida por DIGEMID da derecho inmediato al canje o restitución al paciente sin cobro adicional alguno.
              </p>
            </div>
          )}

          {/* TAB 4: POLÍTICA DE COOKIES */}
          {activeTab === 'cookies' && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">¿Qué cookies utilizamos?</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Cookies Técnicas de Sesión:</strong> Almacenan el token JWT temporal para mantener iniciada la sesión de forma segura (HttpOnly).</li>
                <li><strong>Cookies de Preferencias:</strong> Recuerdan la sucursal activa seleccionada por el usuario para acelerar la navegación.</li>
                <li><strong>Cookies de Prevención DoS:</strong> Monitorean ráfagas anómalas de consultas para aplicar Rate Limiting.</li>
              </ul>
              <p className="mt-2 text-slate-600">
                <strong>No utilizamos cookies de rastreo publicitario ni vendemos perfiles de navegación.</strong>
              </p>
            </div>
          )}

          {/* TAB 5: DATOS DE LA EMPRESA & LIBRO DE RECLAMACIONES */}
          {activeTab === 'empresa' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <div className="font-bold text-sm text-slate-900">Identificación del Proveedor del Servicio</div>
                <div><strong>Razón Social:</strong> FARMACIAS PERUANAS S.A.</div>
                <div><strong>RUC:</strong> 20509872134</div>
                <div><strong>Marcas Comerciales:</strong> InkaFarma / Mifarma</div>
                <div><strong>Dirección Central:</strong> Av. Defensores del Morro 1277, Chorrillos, Lima</div>
                <div><strong>Central Telefónica:</strong> (01) 314-2020 / Línea Ética: 0800-11100</div>
                <div><strong>Correo Oficial de Cumplimiento:</strong> privacidad@farmaciasperuanas.pe</div>
              </div>

              <div className="border border-blue-200 bg-blue-50/70 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-blue-950 text-xs">Libro de Reclamaciones Virtual</div>
                  <div className="text-[11px] text-blue-800">Conforme al D.S. N° 011-2011-PCM (Código de Protección y Defensa del Consumidor)</div>
                </div>
                <span className="text-[10px] bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs">
                  Hoja Virtual Activa
                </span>
              </div>
            </div>
          )}

          {/* TAB 6: DERECHOS ARCO & ELIMINACIÓN DE DATOS */}
          {activeTab === 'arco' && (
            <div className="space-y-3">
              <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded-r-xl text-red-900 font-medium">
                <strong>Ejercicio de Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición):</strong><br />
                Usted puede solicitar en cualquier momento la eliminación total o rectificación de sus datos personales conforme a la Ley N° 29733.
              </div>

              {arcoSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <div className="font-extrabold text-sm text-emerald-950">¡Solicitud ARCO Registrada Correctamente!</div>
                  <p className="text-emerald-800 text-xs max-w-md mx-auto">
                    Su solicitud ha sido radicada con código <strong>ARCO-2026-{Math.floor(1000 + Math.random() * 9000)}</strong>. 
                    Nuestro Oficial de Datos Personales responderá a su correo en un plazo máximo de 10 días hábiles conforme a ley.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleArcoSubmit} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Nombre Completo:</label>
                      <input 
                        type="text" 
                        required 
                        value={arcoForm.nombre}
                        onChange={(e) => setArcoForm({ ...arcoForm, nombre: e.target.value })}
                        placeholder="Ej. Ronny Mendoza Paucar" 
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">DNI / Carnet Extranjería:</label>
                      <input 
                        type="text" 
                        required 
                        maxLength={12}
                        value={arcoForm.dni}
                        onChange={(e) => setArcoForm({ ...arcoForm, dni: e.target.value })}
                        placeholder="8 dígitos DNI" 
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Correo Electrónico:</label>
                      <input 
                        type="email" 
                        required 
                        value={arcoForm.correo}
                        onChange={(e) => setArcoForm({ ...arcoForm, correo: e.target.value })}
                        placeholder="correo@ejemplo.com" 
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Derecho a Ejercer:</label>
                      <select 
                        value={arcoForm.derecho}
                        onChange={(e) => setArcoForm({ ...arcoForm, derecho: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="CANCELACION">CANCELACIÓN / ELIMINACIÓN DE DATOS</option>
                        <option value="OPOSICION">OPOSICIÓN AL TRATAMIENTO</option>
                        <option value="RECTIFICACION">RECTIFICACIÓN DE INFORMACIÓN</option>
                        <option value="ACCESO">ACCESO A LA INFORMACIÓN GUARDADA</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Motivo o Detalle de la Solicitud:</label>
                    <textarea 
                      rows={3} 
                      required
                      value={arcoForm.motivo}
                      onChange={(e) => setArcoForm({ ...arcoForm, motivo: e.target.value })}
                      placeholder="Describa brevemente el motivo de su solicitud de baja o rectificación..." 
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
                    >
                      Enviar Solicitud ARCO Formularia
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div>Protegido bajo la <strong>Ley de Protección de Datos Personales N° 29733</strong></div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition cursor-pointer"
          >
            Entendido / Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
