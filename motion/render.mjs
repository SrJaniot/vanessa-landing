// RENDER DETERMINISTA DEL VIDEO: EDGE SIN INTERFAZ, window.__seek(t) EN CADA CUADRO Y CAPTURA POR CDP -> ffmpeg
// USO:
//   node render.mjs eventos                 -> salida/eventos.json (LISTA DE SONIDOS PARA audio.py)
//   node render.mjs fotos 3 6.5 20          -> salida/fotos/t003.00.png ... (CUADROS SUELTOS PARA REVISAR)
//   node render.mjs mosaico 3               -> UN CUADRO CADA 3 s EN salida/mosaico/ (HOJA DE CONTACTO)
//   node render.mjs video [fps]             -> salida/video-sin-audio.mp4 (POR DEFECTO 60 fps)
// CON --vertical EN CUALQUIER POSICION SE RENDERIZA LA VERSION PARA CELULAR (1080 x 1920, index.html?formato=vertical)
// Y LOS ARCHIVOS LLEVAN EL SUFIJO -vertical: salida/eventos-vertical.json, salida/fotos-vertical/, salida/video-sin-audio-vertical.mp4
import http from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { abrirEdge } from './herramientas/cdp.mjs';

const AQUI = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const RAIZ = path.resolve(AQUI, '..');                       // CARPETA DE LA LANDING (PARA LEER public/capturas)
const SALIDA = path.join(AQUI, 'salida');
export const FFMPEG = process.env.FFMPEG ?? 'C:/Users/esteb/Downloads/ffmpeg-7.1.1-essentials_build/bin/ffmpeg';
mkdirSync(SALIDA, { recursive: true });

// SERVIDOR ESTATICO MINIMO SOLO EN 127.0.0.1 (LAS FUENTES NO CARGAN BIEN DESDE file://)
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json' };
const servidor = http.createServer((req, res) => {
  const ruta = path.join(RAIZ, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!ruta.startsWith(RAIZ) || !existsSync(ruta)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(ruta)] ?? 'application/octet-stream' });
  res.end(readFileSync(ruta));
});
await new Promise(r => servidor.listen(4710, '127.0.0.1', r));

const VERTICAL = process.argv.includes('--vertical');
// CON --s3media SE RENDERIZA LA VERSION CON EL WHATSAPP Y EL LOGO DE S3MEDIA (index.html?marca=s3media); LOS ARCHIVOS LLEVAN -s3media
const S3 = process.argv.includes('--s3media');
const ARGS = process.argv.filter(a => a !== '--vertical' && a !== '--s3media');
const [AN, AL] = VERTICAL ? [1080, 1920] : [1920, 1080];
const SUF = (S3 ? '-s3media' : '') + (VERTICAL ? '-vertical' : '');
const modo = ARGS[2] ?? 'eventos';
const e = await abrirEdge({ puerto: 9350, perfil: path.join(SALIDA, 'perfil-edge'), args: [`--window-size=${AN},${AL}`, '--force-device-scale-factor=1', '--disable-gpu-vsync', '--run-all-compositor-stages-before-draw'] });
try {
  await e.cdp('Emulation.setDeviceMetricsOverride', { width: AN, height: AL, deviceScaleFactor: 1, mobile: false });
  await e.cdp('Page.navigate', { url: 'http://127.0.0.1:4710/motion/escena/index.html?' + [VERTICAL && 'formato=vertical', S3 && 'marca=s3media'].filter(Boolean).join('&') });
  const ok = await e.hasta('window.__listo === true || !!window.__error', 30000);
  const error = await e.ev('window.__error || null');
  if (!ok || error) throw new Error('LA ESCENA NO CARGO: ' + error);
  const avisos = await e.ev('window.__AVISOS');
  if (avisos?.length) console.log('AVISOS:\n  ' + avisos.join('\n  '));
  const DUR = await e.ev('window.__DUR');
  const eventos = await e.ev('window.__EVENTOS');
  const escenas = await e.ev('window.__ESCENAS');
  writeFileSync(path.join(SALIDA, `eventos${SUF}.json`), JSON.stringify({ duracion: DUR, escenas, eventos }, null, 1));
  console.log('duracion', DUR.toFixed(2), 's,', eventos.length, 'eventos de sonido, escenas', JSON.stringify(escenas));

  const foto = async (t, archivo, formato = 'png') => {
    await e.ev(`window.__seek(${t})`);
    const r = await e.cdp('Page.captureScreenshot', { format: formato, ...(formato === 'jpeg' ? { quality: 94 } : {}), fromSurface: true });
    if (archivo) writeFileSync(archivo, Buffer.from(r.result.data, 'base64'));
    return Buffer.from(r.result.data, 'base64');
  };
  if (modo === 'fotos' || modo === 'mosaico') {
    const dir = path.join(SALIDA, modo + SUF); mkdirSync(dir, { recursive: true });
    const tiempos = modo === 'fotos' ? ARGS.slice(3).map(Number) : Array.from({ length: Math.floor(DUR / +(ARGS[3] ?? 3)) + 1 }, (_, i) => i * +(ARGS[3] ?? 3));
    for (const t of tiempos) { const f = path.join(dir, `t${t.toFixed(2).padStart(6, '0')}.png`); await foto(t, f); console.log('foto', f); }
  }
  if (modo === 'video') {
    const fps = +(ARGS[3] ?? 60), n = Math.round(DUR * fps);
    const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(fps), '-i', '-',
      '-c:v', 'libx264', '-preset', 'fast', '-crf', '12', '-pix_fmt', 'yuv420p', path.join(SALIDA, `video-sin-audio${SUF}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let i = 0; i < n; i++) {
      const b = await foto(i / fps, null, 'jpeg');
      if (!ff.stdin.write(b)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 300 === 0) console.log(`cuadro ${i}/${n} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    console.log('video listo en', ((Date.now() - t0) / 1000).toFixed(0), 's');
  }
  if (e.errores.length) console.log('ERRORES DE CONSOLA:\n  ' + e.errores.slice(0, 10).join('\n  '));
} finally {
  await e.cerrar();
  servidor.close();
}
