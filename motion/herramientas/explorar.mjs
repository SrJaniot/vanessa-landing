// EXPLORACION DE SOLO LECTURA DE LA DEMO (NO GUARDA NADA). LAS CLAVES SE LEEN DEL ARCHIVO DE CUENTAS, NUNCA SE IMPRIMEN
import { readFileSync } from 'node:fs';
import { abrirEdge, esperar } from './cdp.mjs';
const SITIO = 'https://demovanessa.ejaniot.com';
const md = readFileSync('V:/proyectos/Vanessa2/CUENTAS_DEMO_VANESSA.md', 'utf8');
const claves = Object.fromEntries([...md.matchAll(/^\| [^|]+ \| `(\d+)` \| `([^`]+)` \|/gm)].map(m => [m[1], m[2]]));
const e = await abrirEdge({ puerto: 9345, perfil: process.env.PERFIL, args: ['--host-resolver-rules=MAP demovanessa.ejaniot.com 192.168.1.102'] });
await e.cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
async function entrar(doc) {
  await e.cdp('Page.navigate', { url: SITIO + '/seguridad/ingreso' }); await esperar(2000);
  await e.ev("localStorage.clear(); localStorage.setItem('tema','light'); true");
  await e.cdp('Page.navigate', { url: SITIO + '/seguridad/ingreso' });
  await e.hasta("!!document.querySelector('#documento_ingreso')");
  await e.ev(`(() => { for (const [s, v] of [['#documento_ingreso', ${JSON.stringify(doc)}], ['#clave_ingreso', ${JSON.stringify(claves[doc])}]]) { const el = document.querySelector(s); el.value = v; el.dispatchEvent(new Event('input', {bubbles:true})); } document.querySelector('form button[type=submit]').click(); return true; })()`);
  await e.hasta("!location.pathname.startsWith('/seguridad')"); await esperar(3000);
}
const ir = async (ruta, ms = 3500) => { await e.cdp('Page.navigate', { url: SITIO + ruta }); await esperar(ms); };
const texto = n => e.ev(`document.body.innerText.split(String.fromCharCode(10)).filter(Boolean).join(' | ').slice(0, ${n})`);
const enlaces = () => e.ev(`[...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href') + ' :: ' + a.innerText.trim().slice(0,50)).filter((x,i,arr)=>arr.indexOf(x)===i).join(String.fromCharCode(10))`);
const paso = process.argv[2];
if (paso === 'est') {
  await entrar(process.argv[3] ?? '1104500001');
  await ir('/curso/mis-cursos'); console.log(await enlaces());
  const cursos = await e.ev(`[...document.querySelectorAll('a[href*="/curso/c/"]')].map(a=>a.getAttribute('href')).filter((x,i,a)=>a.indexOf(x)===i)`);
  for (const c of cursos ?? []) { await ir(c); console.log('\n### ' + c + '\n' + await texto(2500)); console.log(await enlaces()); }
}
if (paso === 'ruta') { await entrar(process.argv[3]); await ir(process.argv[4], 5000); console.log(await texto(4000)); console.log(await enlaces()); }
console.log('ERRORES', e.errores.slice(0, 5));
await e.cerrar();
