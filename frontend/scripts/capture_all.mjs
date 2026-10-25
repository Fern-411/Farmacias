import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\Ronny Mendoza\\.gemini\\antigravity\\brain\\0d8a0e1e-14ef-4338-b8be-33749b4f2178\\screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  console.log('Iniciando captura de vistas con Microsoft Edge...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1.5 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars']
  });

  const page = await browser.newPage();

  // 1. Pantalla de Login
  console.log('1. Capturando Login...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, '01_login.png') });

  // Autenticar como Químico Farmacéutico
  await page.evaluate(() => {
    const user = {
      username: 'qf_mendoza',
      name: 'Ronny Mendoza Paucar',
      role: 'FARMACEUTICO',
      roleTitle: 'Químico Farmacéutico (Ventanilla)'
    };
    const branch = {
      id: 1,
      nombre: 'InkaFarma San Isidro Central',
      marca: 'InkaFarma',
      direccion: 'Av. Rivera Navarrete 550',
      distrito: 'San Isidro',
      departamento: 'Lima',
      lat: -12.0931,
      lng: -77.0264,
      telefono: '(01) 314-2000'
    };
    localStorage.setItem('SIIP_AUTH_SESSION', JSON.stringify({ currentUser: user, currentBranch: branch }));
    localStorage.setItem('SIIP_CURRENT_TAB', 'dashboard');
    localStorage.setItem('SIIP_COOKIE_CONSENT', 'ACCEPTED');
  });

  // 2. Dashboard Principal
  console.log('2. Capturando Dashboard Principal...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, '02_dashboard.png') });

  // 3. Inventario Geocercano (Búsqueda y Sedes)
  console.log('3. Capturando Inventario Geocercano...');
  await page.evaluate(() => {
    localStorage.setItem('SIIP_CURRENT_TAB', 'search');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, '03_inventario_geocercano.png') });

  // 4. Modal "Solicitar Traslado"
  console.log('4. Capturando Modal Solicitar Traslado...');
  const transferButtons = await page.$$('button');
  for (const btn of transferButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Solicitar Traslado')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, '04_modal_solicitar_traslado.png') });

  // Cerrar modal presionando Escape
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 600));

  // 5. Modal "Ruta & Mapa"
  console.log('5. Capturando Modal Ruta & Mapa...');
  const routeButtons = await page.$$('button');
  for (const btn of routeButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Ruta & Mapa')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, '05_modal_ruta_mapa.png') });
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 600));

  // 6. Gestión de Productos
  console.log('6. Capturando Gestión de Productos...');
  await page.evaluate(() => {
    localStorage.setItem('SIIP_CURRENT_TAB', 'products');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, '06_gestion_productos.png') });

  // 7. Modal Kardex con trazabilidad FEFO
  console.log('7. Capturando Modal Kardex...');
  const kardexButtons = await page.$$('button');
  for (const btn of kardexButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Kardex')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '07_modal_kardex_trazabilidad.png') });
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 600));

  // 8. Gestión de Sedes
  console.log('8. Capturando Gestión de Sedes...');
  await page.evaluate(() => {
    localStorage.setItem('SIIP_CURRENT_TAB', 'branches');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, '08_gestion_sedes.png') });

  // 9. Alertas Predictivas
  console.log('9. Capturando Alertas Predictivas...');
  await page.evaluate(() => {
    localStorage.setItem('SIIP_CURRENT_TAB', 'alerts');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, '09_alertas_predictivas.png') });

  // 10. Gestión de Traslados
  console.log('10. Capturando Gestión de Traslados...');
  await page.evaluate(() => {
    localStorage.setItem('SIIP_CURRENT_TAB', 'transfers');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, '10_gestion_traslados.png') });

  // 11. Modal Guía de Remisión Electrónica GRE
  console.log('11. Capturando Guía de Remisión Electrónica SUNAT...');
  const guiaButtons = await page.$$('button');
  for (const btn of guiaButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && (text.includes('Guía') || text.includes('GRE') || text.includes('Despachar') || text.includes('Ver Guía'))) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, '11_modal_guia_remision.png') });

  console.log('¡Todas las 11 capturas generadas con éxito!');
  await browser.close();
}

run().catch(err => {
  console.error('Error en captura:', err);
  process.exit(1);
});
