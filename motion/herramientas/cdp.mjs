// AYUDANTE MINIMO DE EDGE SIN INTERFAZ POR CDP (CAPTURAS Y RENDER DEL VIDEO)
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

export const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
export const esperar = ms => new Promise(r => setTimeout(r, ms));

export async function abrirEdge({ puerto = 9344, perfil, args = [] }) {
  perfil = path.resolve(perfil); mkdirSync(perfil, { recursive: true });
  const proc = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${puerto}`, `--user-data-dir=${perfil}`, '--no-first-run',
    '--disable-sync', '--no-default-browser-check', '--hide-scrollbars', '--mute-audio', '--lang=es-CO', ...args, 'about:blank'], { stdio: 'ignore' });
  let ws;
  for (let i = 0; i < 150 && !ws; i++) {
    try {
      const l = await (await fetch(`http://127.0.0.1:${puerto}/json`)).json();
      const p = l.find(t => t.type === 'page');
      if (p) ws = new WebSocket(p.webSocketDebuggerUrl);
    } catch { }
    if (!ws) await esperar(200);
  }
  if (ws.readyState !== 1) await new Promise(r => ws.onopen = r);
  let id = 0; const pend = new Map(); const errores = [];
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
    if (m.method === 'Runtime.exceptionThrown') errores.push('EXCEPCION ' + (m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text).slice(0, 300));
    if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) errores.push(m.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 300));
    if (m.method === 'Page.javascriptDialogOpening') cdp('Page.handleJavaScriptDialog', { accept: false });
  };
  const cdp = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async x => {
    const r = await cdp('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true });
    if (r.result?.exceptionDetails) errores.push('EVAL ' + (r.result.exceptionDetails.exception?.description ?? '').slice(0, 300));
    return r.result?.result?.value;
  };
  const hasta = async (x, ms = 15000) => { for (let t = 0; t < ms; t += 250) { if (await ev(x)) return true; await esperar(250); } return false; };
  await cdp('Page.enable'); await cdp('Runtime.enable');
  const cerrar = async () => { try { ws.close(); } catch { } try { proc.kill(); } catch { } await esperar(800); };
  return { cdp, ev, hasta, cerrar, errores, proc };
}
