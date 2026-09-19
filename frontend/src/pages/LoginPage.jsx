import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  AlertCircle,
  Building2,
  FileText
} from 'lucide-react';
import { SUCURSALES } from '../services/mockData';
import { sanitizeInput, loginRateLimiter, verifyHoneypot } from '../services/securityUtils';

export default function LoginPage({ onLoginSuccess, onOpenLegalModal }) {
  // Cuentas predefinidas vinculadas directamente a su sede y rol
  const demoUsers = [
    {
      id: 'qf_mendoza',
      label: 'Químico Farmacéutico',
      name: 'Ronny Mendoza Paucar',
      role: 'FARMACEUTICO',
      roleTitle: 'Químico Farmacéutico (Ventanilla)',
      username: 'qf_mendoza',
      password: 'password123',
      branch: SUCURSALES[0], // InkaFarma San Isidro
      badge: 'InkaFarma - San Isidro'
    },
    {
      id: 'admin_cd',
      label: 'Administrador CD',
      name: 'Ing. Carlos Ramos',
      role: 'ADMIN_CD',
      roleTitle: 'Administrador Centro Distribución',
      username: 'admin_cd_huachipa',
      password: 'password123',
      branch: SUCURSALES[7], // CD Huachipa
      badge: 'CD Huachipa Central'
    },
    {
      id: 'qf_miraflores',
      label: 'Farmacia Mifarma',
      name: 'Dra. Patricia Valdivia',
      role: 'FARMACEUTICO',
      roleTitle: 'Químico Farmacéutico (Sede)',
      username: 'qf_miraflores',
      password: 'password123',
      branch: SUCURSALES[1], // Mifarma Miraflores
      badge: 'Mifarma - Miraflores'
    }
  ];

  const [selectedUserKey, setSelectedUserKey] = useState('qf_mendoza');
  const [username, setUsername] = useState('qf_mendoza');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true); // Consentimiento explícito (Punto Legal 6)
  const [honeypot, setHoneypot] = useState(''); // Protección contra bots (Punto 12)
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSelectDemo = (user) => {
    setSelectedUserKey(user.id);
    setUsername(user.username);
    setPassword(user.password);
    setErrorMessage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Protección contra bots (Honeypot - Punto 12)
    if (!verifyHoneypot(honeypot)) {
      setErrorMessage('Detección de actividad automatizada sospechosa.');
      return;
    }

    // 2. Rate Limiting en Login (Punto 11)
    if (!loginRateLimiter.canProceed()) {
      const remaining = loginRateLimiter.getRemainingTimeSeconds();
      setErrorMessage(`Demasiados intentos. Por favor espere ${remaining} segundos (Protección Rate Limiting).`);
      return;
    }

    // 3. Validación de Consentimiento (Punto Legal 6)
    if (!acceptedTerms) {
      setErrorMessage('Debe aceptar la Política de Privacidad (Ley N° 29733) y Términos para continuar.');
      return;
    }

    // 4. Sanitización de Inputs (Punto 15)
    const cleanUsername = sanitizeInput(username);
    const matched = demoUsers.find(u => u.id === selectedUserKey) || demoUsers[0];
    
    // Autenticación con vinculación segura
    onLoginSuccess({
      username: cleanUsername,
      name: matched.name,
      role: matched.role,
      roleTitle: matched.roleTitle,
      branch: matched.branch
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        
        {/* Logo Badge */}
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-2xl shadow-xl mb-4">
          <span className="font-black text-2xl tracking-tight text-white">SIIP</span>
          <span className="text-xs bg-white text-blue-950 font-black px-2 py-0.5 rounded uppercase">v1.0</span>
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight">
          Sistema Inteligente de Inventario y Predicción
        </h1>
        <div className="mt-1 flex items-center justify-center space-x-2 text-sm font-bold text-slate-300">
          <span>Farmacias Peruanas:</span>
          <span className="text-yellow-400">InkaFarma</span>
          <span className="text-slate-500">|</span>
          <span className="text-red-400">Mifarma</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Curso Integrador I: Sistemas Software • Sección 20065
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-8 border border-slate-100 space-y-5">
          
          {/* Quick User Chips */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Ingreso Rápido por Perfil Autenticado:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {demoUsers.map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectDemo(user)}
                  aria-label={`Seleccionar perfil de ${user.label}`}
                  className={"py-2 px-2 rounded-xl text-center border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 " + (
                    selectedUserKey === user.id
                      ? "border-blue-600 bg-blue-50/90 font-bold text-blue-950 ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-600 text-[11px]"
                  )}
                >
                  <div className="text-[11px] font-extrabold truncate">{user.label}</div>
                  <div className="text-[9px] text-slate-400 truncate mt-0.5">{user.badge.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100"></div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Campo Trampa Honeypot contra Bots (Punto 12) */}
            <input 
              type="text" 
              name="hp_security_check" 
              value={honeypot} 
              onChange={(e) => setHoneypot(e.target.value)} 
              tabIndex={-1} 
              autoComplete="off" 
              className="hidden" 
              aria-hidden="true" 
            />

            {/* Usuario */}
            <div>
              <label htmlFor="login-username" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Usuario / Correo Corporativo
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" aria-hidden="true" />
                </div>
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  placeholder="usuario@farmaciasperuanas.pe"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Contraseña de Seguridad
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer focus-visible:ring-1 focus-visible:ring-blue-500 rounded"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox de Consentimiento Explícito (Punto Legal 6) */}
            <div className="pt-1">
              <label className="flex items-start space-x-2 text-slate-600 text-[11px] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>
                  Acepto la{' '}
                  <button 
                    type="button"
                    onClick={() => onOpenLegalModal('privacidad')}
                    className="text-blue-600 font-bold underline hover:text-blue-800"
                  >
                    Política de Privacidad (Ley 29733)
                  </button>{' '}
                  y los{' '}
                  <button 
                    type="button"
                    onClick={() => onOpenLegalModal('terminos')}
                    className="text-blue-600 font-bold underline hover:text-blue-800"
                  >
                    Términos de Servicio
                  </button>.
                </span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-xl shadow-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition-all cursor-pointer"
              >
                <span>Ingresar al Sistema SIIP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

          {/* Footer Info Legal & Seguridad */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <button 
              type="button"
              onClick={() => onOpenLegalModal('empresa')}
              className="hover:text-blue-600 flex items-center space-x-1 transition cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>RUC: 20509872134</span>
            </button>
            <button 
              type="button"
              onClick={() => onOpenLegalModal('arco')}
              className="text-red-500 hover:text-red-700 font-medium transition cursor-pointer"
            >
              Derechos ARCO
            </button>
          </div>

        </div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">FARMACIAS PERUANAS S.A. • InkaFarma & Mifarma</p>
        <p className="text-[11px] text-slate-400">Alumno: Mendoza Paucar Ronny Fernando • UTP 2026</p>
      </div>

    </div>
  );
}
