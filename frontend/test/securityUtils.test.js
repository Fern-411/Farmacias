import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  sanitizeInput, 
  validateMedicineCode, 
  validatePasswordStrength, 
  RateLimiter, 
  verifyHoneypot, 
  sanitizeUserOutput 
} from '../src/services/securityUtils.js';

test('SEC-01: Sanitización Anti-XSS de inputs maliciosos', () => {
  const xssPayload = '<script>alert("XSS")</script>&<img src=x onerror=alert(1)>';
  const clean = sanitizeInput(xssPayload);
  assert.equal(clean.includes('<script>'), false);
  assert.equal(clean.includes('</script>'), false);
  assert.equal(clean.includes('&lt;script&gt;'), true);
  assert.equal(clean.includes('&amp;'), true);
  assert.equal(clean.includes('&#x2F;'), true);
});

test('SEC-02: Validación de código farmacéutico EAN-13 y correlativo DIGEMID', () => {
  const validEan = validateMedicineCode('7751234567890');
  assert.equal(validEan.valid, true);

  const validInternal = validateMedicineCode('MED-AMOX-500');
  assert.equal(validInternal.valid, true);

  const sqlInjectionCode = validateMedicineCode("7751234' OR '1'='1");
  assert.equal(sqlInjectionCode.valid, false);

  const emptyCode = validateMedicineCode('');
  assert.equal(emptyCode.valid, false);
});

test('SEC-03: Validación de fortaleza de contraseñas (Mínimo 8 caracteres)', () => {
  const weak = validatePasswordStrength('12345');
  assert.equal(weak.valid, false);

  const strong = validatePasswordStrength('Farmacia#2026!');
  assert.equal(strong.valid, true);
});

test('SEC-04: Rate Limiting por ventana deslizante (Protección DoS y Fuerza Bruta)', () => {
  const limiter = new RateLimiter(3, 10);
  assert.equal(limiter.canProceed(), true); // Intento 1
  assert.equal(limiter.canProceed(), true); // Intento 2
  assert.equal(limiter.canProceed(), true); // Intento 3
  assert.equal(limiter.canProceed(), false); // Intento 4 -> BLOQUEADO
});

test('SEC-05: Verificación de trampa Bot / Honeypot', () => {
  // Usuario humano deja el honeypot vacío
  assert.equal(verifyHoneypot(''), true);
  assert.equal(verifyHoneypot(null), true);
  assert.equal(verifyHoneypot(undefined), true);

  // Script malicioso llena el campo oculto
  assert.equal(verifyHoneypot('spammer_bot_value'), false);
});

test('SEC-06: Minimización de datos sensibles en DTOs (Data Minimization)', () => {
  const rawUser = {
    id: 1,
    username: 'qf_mendoza',
    name: 'Ronny Mendoza',
    role: 'FARMACEUTICO',
    password: 'secret_plain_password',
    passwordHash: '$2a$12$e8J3kL9...hashed',
    token: 'jwt_secret_token_abc'
  };

  const safe = sanitizeUserOutput(rawUser);
  assert.equal(safe.username, 'qf_mendoza');
  assert.equal('password' in safe, false);
  assert.equal('passwordHash' in safe, false);
});
