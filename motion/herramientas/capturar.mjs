// CAPTURAS EXTRA DE LA DEMO (SOLO NAVEGA, NO GUARDA NADA) A deviceScaleFactor 2
// USO: node herramientas/capturar.mjs   (LEE LAS CLAVES DE V:/proyectos/Vanessa2/CUENTAS_DEMO_VANESSA.md SIN IMPRIMIRLAS)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { abrirEdge, esperar } from './cdp.mjs';
const SITIO = 'https://demovanessa.ejaniot.com';
const OUT = new URL('../escena/capturas/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
mkdirSync(OUT, { recursive: true });
const md = readFileSync('V:/proyectos/Vanessa2/CUENTAS_DEMO_VANESSA.md', 'utf8');
const claves = Object.fromEntries([...md.matchAll(/^\| [^|]+ \| `(\d+)` \| `([^`]+)` \|/gm)].map(m => [m[1], m[2]]));
const e = await abrirEdge({ puerto: 9346, perfil: process.env.PERFIL ?? 'perfil-capturas', args: ['--host-resolver-rules=MAP demovanessa.ejaniot.com 192.168.1.102'] });
const pantalla = (w, h, movil = false) => e.cdp('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: movil });
async function entrar(doc) {
  await pantalla(1280, 800);
  await e.cdp('Page.navigate', { url: SITIO + '/seguridad/ingreso' }); await esperar(2000);
  await e.ev("localStorage.clear(); localStorage.setItem('tema','light'); true");
  await e.cdp('Page.navigate', { url: SITIO + '/seguridad/ingreso' });
  await e.hasta("!!document.querySelector('#documento_ingreso')");
  await e.ev(`(() => { for (const [s, v] of [['#documento_ingreso', ${JSON.stringify(doc)}], ['#clave_ingreso', ${JSON.stringify(claves[doc])}]]) { const el = document.querySelector(s); el.value = v; el.dispatchEvent(new Event('input', {bubbles:true})); } document.querySelector('form button[type=submit]').click(); return true; })()`);
  await e.hasta("!location.pathname.startsWith('/seguridad')"); await esperar(3000);
}
const ir = async (ruta, ms = 4500) => { await e.cdp('Page.navigate', { url: SITIO + ruta }); await esperar(ms); };
const clicTexto = (sel, txt) => e.ev(`(() => { const el = [...document.querySelectorAll(${JSON.stringify(sel)})].filter(x => x.offsetParent !== null).find(x => x.innerText.trim().includes(${JSON.stringify(txt)})); el?.click(); return !!el; })()`);
async function foto(nombre, completa = false) {
  await esperar(1200);
  const p = { format: 'png' };
  if (completa) {
    const alto = Math.min(2400, await e.ev('document.documentElement.scrollHeight')); const ancho = await e.ev('window.innerWidth');
    Object.assign(p, { captureBeyondViewport: true, clip: { x: 0, y: 0, width: ancho, height: alto, scale: 1 } });
  }
  const r = await e.cdp('Page.captureScreenshot', p);
  writeFileSync(OUT + nombre + '.png', Buffer.from(r.result.data, 'base64')); console.log('captura', nombre);
}
// PROFESORA LUZ MARINA: BANDEJA POR CALIFICAR
await entrar('63456789'); await ir('/curso/calificar'); await foto('pro-calificar');
// PROFESOR ANDRES: CONSTRUCTOR DEL CURSO (TEMAS Y LECCIONES)
await entrar('91501234'); await ir('/curso/cursos/1'); await clicTexto('[role=tab], button, a', 'Contenido'); await esperar(1500);
await e.ev('window.scrollTo(0, 900); true'); await foto('pro-temas');
// COORDINADORA: ESTADISTICAS (RESUMEN Y SIMULACROS) Y ALERTAS
await entrar('63512345'); await ir('/curso/estadisticas', 6000); await foto('coo-resumen');
await clicTexto('[role=tab], button', 'Simulacros'); await esperar(3000); await e.ev('window.scrollTo(0, 420); true'); await foto('coo-simulacros');
await ir('/curso/alertas', 5000); await e.ev('window.scrollTo(0, 230); true'); await foto('coo-alertas');
// ACUDIENTE CLAUDIA EN EL CELULAR
await entrar('63541278'); await pantalla(390, 844, true); await ir('/curso/mis-hijos', 5000); await foto('acu-hijos-cel');
const hijo = await e.ev(`(() => { const a = [...document.querySelectorAll('a, button')].find(x => /Samuel/.test(x.innerText)); a?.click(); return !!a; })()`);
await esperar(4000); console.log('detalle', hijo); await foto('acu-detalle-cel'); await e.ev('window.scrollTo(0, 700); true'); await foto('acu-detalle-cel-2');
// ESTUDIANTE VALENTINA EN EL CELULAR: CAMINO DE TEMAS
await entrar('1104500001'); await pantalla(390, 844, true); await ir('/curso/c/1', 5000); await e.ev(`(() => { const h = [...document.querySelectorAll('h2,h3')].find(x => /camino/i.test(x.innerText)); h?.scrollIntoView({block:'start'}); window.scrollBy(0,-20); return !!h; })()`); await foto('est-camino-cel');
console.log('ERRORES', e.errores.slice(0, 8));
await e.cerrar();
