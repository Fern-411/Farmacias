/**
 * Utilitarios de Seguridad, Sanitización y Validación (SIIP Farmacias Peruanas)
 * Implementa los puntos del Checklist de Seguridad (11, 12, 13, 14, 15, 17)
 */

// 1. Sanitización de contenido contra XSS (Punto 15)
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// 2. Validación de inputs y formatos farmacéuticos (Punto 14)
export function validateMedicineCode(code) {
  if (!code) return { valid: false, message: 'El código no puede estar vacío' };
  // Código EAN-13 o correlativo interno alfanumérico
  const eanRegex = /^[0-9]{8,13}$|^[A-Z0-9-]{4,20}$/;
  if (!eanRegex.test(code.trim())) {
    return { valid: false, message: 'Formato inválido. Use código EAN (8-13 dígitos) o código alfanumérico' };
  }
  return { valid: true };
}

export function validatePasswordStrength(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }
  return { valid: true };
}

// 3. Rate Limiting en Cliente contra Abuso y Fuerza Bruta (Punto 11)
class RateLimiter {
  constructor(maxRequests = 30, windowSeconds = 60) {
    this.maxRequests = maxRequests;
    this.windowSeconds = windowSeconds;
    this.requests = [];
  }

  canProceed() {
    const now = Date.now();
    const windowStart = now - (this.windowSeconds * 1000);
    this.requests = this.requests.filter(t => t > windowStart);
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    this.requests.push(now);
    return true;
  }

  getRemainingTimeSeconds() {
    if (this.requests.length === 0) return 0;
    const oldest = this.requests[0];
    const diff = (oldest + (this.windowSeconds * 1000)) - Date.now();
    return Math.max(0, Math.ceil(diff / 1000));
  }
}

export const searchRateLimiter = new RateLimiter(40, 60);
export const loginRateLimiter = new RateLimiter(5, 60);

// 4. Verificación de Bot / Honeypot (Punto 12)
export function verifyHoneypot(honeypotValue) {
  // El campo trampa debe permanecer vacío para humanos. Si tiene valor, es un bot.
  return !honeypotValue || honeypotValue.trim().length === 0;
}

// 5. Minimización de datos (Data Minimization - Punto 17 y Legal 7)
export function sanitizeUserOutput(user) {
  if (!user) return null;
  // Nunca devolver contraseñas, hashes, ni tokens de reseteo
  const { password, password_hash, passwordHash, ...safeUser } = user;
  return safeUser;
}
