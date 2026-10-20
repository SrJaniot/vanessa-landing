// GUION DEL VIDEO "PARDO PRESENTA VANESSA": UNA SOLA LINEA DE TIEMPO MAESTRA (tl) Y LA LISTA DE EVENTOS DE SONIDO (EV)
// render.mjs LLAMA window.__seek(t) EN CADA CUADRO Y LEE window.__EVENTOS PARA GENERAR EL AUDIO CON LA MISMA SINCRONIA.
(async function () {
  // ---------- UTILIDADES ----------
  const tl = gsap.timeline({ paused: true });
  const EV = [], AVISOS = [], CONTADORES = [];
  const evento = (t, tipo, extra = {}) => EV.push({ t: +t.toFixed(4), tipo, ...extra });
  const $ = s => document.querySelector(s);
  const crear = (padre, html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); const el = d.firstElementChild; (typeof padre === 'string' ? $(padre) : padre).appendChild(el); return el; };
  let semilla = 20261018;
  const rnd = () => { semilla |= 0; semilla = semilla + 0x6D2B79F5 | 0; let t = Math.imul(semilla ^ semilla >>> 15, 1 | semilla); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const entre = (a, b) => a + rnd() * (b - a);
  const COP = n => '$' + Math.round(n).toLocaleString('es-CO').replace(/,/g, '.');
  const dec = (n, d) => n.toFixed(d).replace('.', ',');
  const C = { tinta: '#1F2A44', sello: '#1B66C9', papel: '#FFF8EC', azul: '#2F7FE0', amarillo: '#FFC531', verde: '#2FAE6B', coral: '#FF6F59', morado: '#8B6CEF', linea: '#EADFC9', grafito: '#5A6480' };
  const DUR = 75;
  // FORMATO: HORIZONTAL 1920 x 1080 (POR DEFECTO) O VERTICAL 1080 x 1920 PARA CELULAR (?formato=vertical).
  // EN VERTICAL SOLO CAMBIA LA COMPOSICION: LOS TIEMPOS, LOS TEXTOS Y LA LISTA DE EVENTOS DE SONIDO SON LOS MISMOS.
  // L(h, v) DEVUELVE EL VALOR HORIZONTAL O EL VERTICAL. EN VERTICAL SE DEJAN LIBRES ~250 px ARRIBA Y ~350 px ABAJO (BOTONES DE REELS, TIKTOK Y ESTADOS).
  const V = new URLSearchParams(location.search).get('formato') === 'vertical';
  const ANCHO = V ? 1080 : 1920, ALTO = V ? 1920 : 1080;
  const L = (h, v) => V ? v : h;
  // VERSION S3MEDIA (?marca=s3media): SOLO CAMBIA EL WHATSAPP DEL CIERRE Y AGREGA SU LOGO. LOS TIEMPOS Y LOS SONIDOS SON LOS MISMOS
  const S3 = new URLSearchParams(location.search).get('marca') === 's3media';
  // EN VERTICAL PARDO VA ABAJO A LA DERECHA Y SU GLOBO A SU IZQUIERDA (COLA A LA DERECHA), SALVO DONDE SE INDICA
  const BANDA = { der: 700, y: 1440, cola: 'der', ancho: 620 };

  // CARGA DE FUENTES E IMAGENES ANTES DE ARMAR (PARA MEDIR LOS GLOBOS Y QUE NINGUN CUADRO SALGA SIN IMAGEN)
  await Promise.all([document.fonts.load('600 40px Fredoka'), document.fonts.load('500 40px Fredoka'), document.fonts.load('700 30px Nunito'), document.fonts.load('900 30px Nunito')]);
  const RUTAS = {
    celular: '../../public/capturas/portada-celular.png', estudiante: '../../public/capturas/rol-estudiante.png',
    profesor: '../../public/capturas/rol-profesor.png', temas: 'capturas/pro-temas.png', calificar: 'capturas/pro-calificar.png',
    resumen: 'capturas/coo-resumen.png', alertas: 'capturas/coo-alertas.png', simulacros: 'capturas/coo-simulacros.png',
    acudiente: 'capturas/acu-detalle-cel.png',
  };
  const IMG = {};
  await Promise.all(Object.entries(RUTAS).map(([k, src]) => new Promise(ok => { const i = new Image(); i.onload = () => { IMG[k] = { src, w: i.naturalWidth, h: i.naturalHeight }; i.decode().then(ok, ok); }; i.onerror = () => { AVISOS.push('NO CARGO ' + src); ok(); }; i.src = src; })));

  // ---------- ESCENAS ----------
  const escenas = {};
  function escena(id) { const el = crear('#escenas', `<section class="escena" id="${id}"></section>`); escenas[id] = el; return el; }
  const fijar = (el, props, t) => t <= 0 ? gsap.set(el, props) : tl.set(el, props, t);
  function mostrar(t, id) { fijar(escenas[id], { visibility: 'visible' }, t); }
  function ocultar(t, id) { tl.set(escenas[id], { visibility: 'hidden' }, t); }
  function cambiar(t, de, a) { if (de) ocultar(t, de); mostrar(t, a); evento(t, 'escena', { id: a }); }
  function mancha(padre, x, y, r, color, op = .5) { return crear(padre, `<div class="abs" style="left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:${color};opacity:${op}"></div>`); }

  // TEXTO CON PALABRAS Y LETRAS SEPARADAS (**negrita** SE PINTA EN AZUL)
  function letras(texto) {
    const partes = texto.split(/(\*\*[^*]+\*\*)/).filter(Boolean);
    let html = '';
    for (const p of partes) {
      const neg = p.startsWith('**'); const t = neg ? p.slice(2, -2) : p;
      const pal = t.split(/( )/).map(w => w === ' ' ? ' ' : `<span class="palabra">${[...w].map(c => `<span class="letra">${c}</span>`).join('')}</span>`).join('');
      html += neg ? `<b>${pal}</b>` : pal;
    }
    return html;
  }
  // TITULO QUE ENTRA LETRA A LETRA CON REBOTE
  function titulo(padre, t, texto, { x, y, tam = 64, ancho = 1000, color = C.tinta, peso = 600, stag = .018, sonido = true, clase = '' }) {
    const el = crear(padre, `<div class="abs titulo ${clase}" style="left:${x}px;top:${y}px;width:${ancho}px;font-size:${tam}px;color:${color};font-weight:${peso}">${letras(texto)}</div>`);
    const ls = el.querySelectorAll('.letra');
    tl.fromTo(ls, { y: tam * .6, opacity: 0, scale: .6 }, { y: 0, opacity: 1, scale: 1, duration: .45, ease: 'back.out(2.4)', stagger: stag }, t);
    if (sonido) evento(t, 'whoosh-corto', { v: .5 });
    return el;
  }
  function salir(t, els, { y = -30, dur = .3 } = {}) { tl.to(els, { opacity: 0, y, duration: dur, ease: 'power2.in' }, t); }
  function aparecer(t, el, { y = 30, dur = .5, ease = 'power3.out', sonido = null } = {}) { tl.fromTo(el, { opacity: 0, y }, { opacity: 1, y: 0, duration: dur, ease }, t); if (sonido) evento(t, sonido); }
  function pop(t, el, { dur = .5, desde = 0, ease = 'back.out(2.2)', sonido = 'pop', rot = 0 } = {}) { tl.fromTo(el, { scale: desde, opacity: 0, rotation: rot }, { scale: 1, opacity: 1, rotation: 0, duration: dur, ease }, t); if (sonido) evento(t, sonido); }
  function pildora(padre, t, texto, color, icono, { x = 110, y = 56 } = {}) {
    const el = crear(padre, `<div class="pildora" style="left:${x}px;top:${y}px"><i style="background:${color}">${icono}</i>${texto}</div>`);
    pop(t, el, { desde: .3 }); return el;
  }
  function contador(t, el, de, a, dur, fmt) { CONTADORES.push({ t, dur, de, a, el, fmt }); el.textContent = fmt(de); evento(t, 'conteo', { dur }); }
  const ICO = {
    estudiante: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>',
    profesor: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    coordinacion: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    familia: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 20c0-2.5 1-4.3 3-4.3s3 1.8 3 4.3"/></svg>',
    problema: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"><path d="M12 7v6M12 17h.01"/></svg>',
    libro: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"><path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6 0-8 1.5Z"/><path d="M12 6v14"/></svg>',
  };

  // ---------- PARDO ----------
  $('#pardo-respira').innerHTML = '<div class="sombra-pardo"></div>' + window.svgPardo();
  const P = { pos: $('#pardo-pos'), salto: $('#pardo-salto'), squash: $('#pardo-squash'), sombra: $('.sombra-pardo') };
  const todosGrupos = [...document.querySelectorAll('#pardo-respira .p-pose')];
  const bocas = { sonrisa: $('#p-boca-sonrisa'), abierta: $('#p-boca-abierta'), media: $('#p-boca-media'), piensa: $('#p-boca-piensa') };
  const CAMBIOS_POSE = [];
  function ponerBoca(t, cual) { for (const [k, el] of Object.entries(bocas)) tl.set(el, { opacity: k === cual ? 1 : 0 }, t); }
  function pose(t, estado) {
    const p = POSES[estado];
    for (const g of todosGrupos) tl.set(g, { opacity: p.grupos.includes(g.id) ? 1 : 0 }, t);
    ponerBoca(t, p.boca); CAMBIOS_POSE.push({ t, estado });
    // PEQUEÑO REBOTE AL CAMBIAR DE POSE (SQUASH Y STRETCH)
    tl.to(P.squash, { keyframes: [{ scaleX: 1.07, scaleY: .93, duration: .08 }, { scaleX: .96, scaleY: 1.05, duration: .1 }, { scaleX: 1, scaleY: 1, duration: .22, ease: 'elastic.out(1,.5)' }] }, t);
  }
  const poseEn = t => { let e = 'saluda'; for (const c of CAMBIOS_POSE) if (c.t <= t + 1e-6) e = c.estado; return e; };
  // AL INICIO: TODO OCULTO SALVO LA POSE INICIAL
  gsap.set(todosGrupos, { opacity: 0 }); gsap.set(Object.values(bocas), { opacity: 0 });
  for (const id of POSES.saluda.grupos) gsap.set('#' + id, { opacity: 1 }); gsap.set(bocas.sonrisa, { opacity: 1 });
  CAMBIOS_POSE.push({ t: 0, estado: 'saluda' });

  function pardoEn(t, x, y, s = 1) { fijar(P.pos, { x, y, scale: s }, t); }
  // SALTO CON ANTICIPACION, ESTIRAMIENTO EN EL AIRE Y APLASTAMIENTO AL CAER
  function salto(t, x, y, s = null, { dur = .75, alto = 170, sonido = true } = {}) {
    tl.to(P.squash, { scaleX: 1.14, scaleY: .84, duration: .12, ease: 'power2.out' }, t - .12);
    if (x !== null) tl.to(P.pos, { x, y, ...(s ? { scale: s } : {}), duration: dur, ease: 'power1.inOut' }, t);
    tl.to(P.salto, { y: -alto, duration: dur / 2, ease: 'power2.out' }, t);
    tl.to(P.salto, { y: 0, duration: dur / 2, ease: 'power2.in' }, t + dur / 2);
    tl.to(P.squash, { scaleX: .88, scaleY: 1.14, duration: .14, ease: 'power2.out' }, t);
    tl.to(P.squash, { scaleX: 1, scaleY: 1, duration: .2 }, t + .2);
    tl.to(P.squash, { scaleX: 1.2, scaleY: .8, duration: .08, ease: 'power2.out' }, t + dur);
    tl.to(P.squash, { scaleX: 1, scaleY: 1, duration: .5, ease: 'elastic.out(1.1,.35)' }, t + dur + .08);
    tl.to(P.sombra, { scale: .55, opacity: .5, duration: dur / 2, ease: 'power2.out' }, t);
    tl.to(P.sombra, { scale: 1, opacity: 1, duration: dur / 2, ease: 'power2.in' }, t + dur / 2);
    if (sonido) { evento(t, 'salto'); evento(t + dur, 'aterriza'); }
  }
  function brinco(t, alto = 60) { salto(t, null, null, null, { dur: .45, alto, sonido: false }); evento(t, 'salto', { v: .6 }); }
  function saludar(t, veces = 3) { const kf = []; for (let i = 0; i < veces; i++) kf.push({ rotation: -18, duration: .18, ease: 'sine.inOut' }, { rotation: 10, duration: .18, ease: 'sine.inOut' }); kf.push({ rotation: 0, duration: .2 }); tl.to('#p-mano', { keyframes: kf, svgOrigin: '130 142' }, t); }
  function celebrar(t, veces = 4) { const kf = []; for (let i = 0; i < veces; i++) kf.push({ y: -7, duration: .16, ease: 'sine.out' }, { y: 0, duration: .16, ease: 'sine.in' }); tl.to('#p-brazos', { keyframes: kf }, t); tl.fromTo('#p-frente-celebra .p-brillo', { scale: .3 }, { scale: 1, duration: .5, ease: 'back.out(3)', stagger: .04, transformOrigin: '50% 50%' }, t); }
  function animar(t, veces = 3) { const kf = []; for (let i = 0; i < veces; i++) kf.push({ rotation: -14, duration: .16 }, { rotation: 0, duration: .16 }); tl.to('#p-puno', { keyframes: kf, svgOrigin: '130 142' }, t); }
  function inclinar(t, grados, dur = .4) { tl.to('#p-cabeza', { rotation: grados, svgOrigin: '100 130', duration: dur, ease: 'back.out(2)' }, t); }
  function oreja(t, lado = 'izq') { tl.to('#p-oreja-' + lado, { keyframes: [{ rotation: lado === 'izq' ? -16 : 16, duration: .08 }, { rotation: 0, duration: .3, ease: 'elastic.out(1,.4)' }], svgOrigin: lado === 'izq' ? '68 60' : '132 60' }, t); }
  // HABLAR: LA BOCA SE ABRE Y SE CIERRA MIENTRAS SALE EL TEXTO DEL GLOBO
  function hablar(t0, t1) {
    const base = POSES[poseEn(t0)].boca; let t = t0, i = 0;
    while (t < t1 - .05) { ponerBoca(t, i % 3 === 2 ? base : (i % 2 ? 'media' : 'abierta')); t += .09 + (i % 3) * .02; i++; }
    ponerBoca(t1, base);
  }
  // MOVIMIENTOS DE FONDO PARA TODO EL VIDEO: RESPIRAR, COLA, PARPADEO Y OREJAS
  tl.to('#pardo-respira', { scaleY: 1.022, scaleX: .99, duration: 1.15, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(DUR / 1.15) }, 0);
  tl.fromTo('#p-cola', { rotation: -6 }, { rotation: 9, svgOrigin: '136 190', duration: .5, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(DUR / .5) }, 0);
  for (let t = 1.2; t < DUR; t += entre(2.4, 4.0)) {
    tl.to('.p-ojos', { scaleY: .08, transformOrigin: '50% 60%', duration: .06, ease: 'power1.in' }, t);
    tl.to('.p-ojos', { scaleY: 1, duration: .1, ease: 'power1.out' }, t + .07);
  }
  for (let t = 2.5; t < DUR; t += entre(4, 7)) oreja(t, rnd() < .5 ? 'izq' : 'der');

  // ---------- GLOBOS DE TEXTO ----------
  function globo(t, texto, { x, der = null, y, hasta, cola = 'abajo', cx = 80, tam = L(40, 46), ancho = null }) {
    const el = crear('#capa-globos', `<div class="globo cola-${cola}" style="${der === null ? 'left:' + x : 'right:' + (ANCHO - der)}px;bottom:${ALTO - y}px;font-size:${tam}px;${ancho ? 'width:' + ancho + 'px;' : ''}--cx:${cx}px;--ox:${cola === 'abajo' ? cx + 18 + 'px' : cola === 'izq' ? '0%' : '100%'};--oy:100%">${letras(texto)}</div>`);
    gsap.set(el, { opacity: 0 });
    tl.fromTo(el, { scale: 0, opacity: 0, rotation: cola === 'der' ? 5 : -5 }, { scale: 1, opacity: 1, rotation: 0, duration: .45, ease: 'back.out(2.2)', immediateRender: false }, t);
    evento(t, 'pop', { v: .8 });
    const ls = [...el.querySelectorAll('.letra')];
    const t0 = t + .3, vel = 1 / 30;
    gsap.set(ls, { opacity: 0 });
    ls.forEach((l, i) => {
      const tt = t0 + i * vel;
      tl.fromTo(l, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .08, immediateRender: false }, tt);
      if (i % 2 === 0 && /[a-záéíóúñü0-9]/i.test(l.textContent)) evento(tt, 'blip', { c: l.textContent.toLowerCase() });
    });
    const t1 = t0 + ls.length * vel;
    hablar(t0, t1);
    const palabras = texto.split(/\s+/).length;
    const necesario = t1 + Math.max(1.0, palabras * .12);
    if (hasta < necesario) AVISOS.push(`GLOBO CORTO "${texto.slice(0, 30)}": termina ${hasta.toFixed(2)}, necesita ${necesario.toFixed(2)}`);
    tl.to(el, { scale: .5, opacity: 0, duration: .25, ease: 'back.in(2)' }, hasta);
    evento(t, 'globo', { t1: hasta + .25 });
    return el;
  }

  // ---------- CURSOR Y EFECTOS ----------
  const cur = $('#cursor');
  function cursorMostrar(t, x, y) { tl.set(cur, { x: x - 8, y: y - 6 }, t); tl.fromTo(cur, { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .25, ease: 'back.out(2)', immediateRender: false }, t); }
  function cursorA(t, x, y, dur = .6) { tl.to(cur, { x: x - 8, y: y - 6, duration: dur, ease: 'power2.inOut' }, t); }
  function cursorOcultar(t) { tl.to(cur, { opacity: 0, scale: .6, duration: .2 }, t); }
  function clic(t, x, y, color = C.azul) {
    tl.to(cur, { keyframes: [{ scale: .8, duration: .07 }, { scale: 1, duration: .15, ease: 'back.out(3)' }] }, t);
    const o = crear('#capa-efectos', `<div class="onda" style="left:${x}px;top:${y}px;border-color:${color}"></div>`);
    tl.fromTo(o, { scale: .2, opacity: 1 }, { scale: 1.6, opacity: 0, duration: .5, ease: 'power2.out', immediateRender: false }, t);
    gsap.set(o, { opacity: 0 });
    evento(t, 'clic');
  }
  const estrellaSvg = (r, color) => { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; p.push((r + Math.cos(a) * rr).toFixed(1) + ',' + (r + Math.sin(a) * rr).toFixed(1)); } return `<svg width="${2 * r}" height="${2 * r}" viewBox="0 0 ${2 * r} ${2 * r}"><polygon points="${p.join(' ')}" fill="${color}" stroke="#C98A00" stroke-width="${r > 20 ? 3 : 1.5}" stroke-linejoin="round"/></svg>`; };
  function destellos(t, x, y, { n = 9, radio = 130, sonido = true } = {}) {
    for (let i = 0; i < n; i++) {
      const r = entre(9, 18), a = i / n * Math.PI * 2 + entre(-.3, .3), d = radio * entre(.6, 1.1);
      const el = crear('#capa-efectos', `<div class="abs" style="left:${x - r}px;top:${y - r}px">${estrellaSvg(r, i % 3 ? C.amarillo : '#FFF3CC')}</div>`);
      gsap.set(el, { opacity: 0 });
      tl.fromTo(el, { x: 0, y: 0, scale: .2, opacity: 1, rotation: 0 }, { x: Math.cos(a) * d, y: Math.sin(a) * d, scale: 1, rotation: entre(-120, 120), duration: .55, ease: 'power3.out', immediateRender: false }, t);
      tl.to(el, { opacity: 0, scale: .3, duration: .35, ease: 'power1.in' }, t + .45);
    }
    if (sonido) evento(t, 'destello');
  }
  function confeti(t, x, y, { n = 80, fuerza = 700, ancho = 200, sonido = true } = {}) {
    const colores = [C.azul, C.amarillo, C.verde, C.coral, C.morado];
    for (let i = 0; i < n; i++) {
      const w = entre(12, 22), h = entre(8, 14), x0 = x + entre(-ancho / 2, ancho / 2);
      const el = crear('#capa-efectos', `<div class="abs" style="left:${x0}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${rnd() < .3 ? '50%' : '3px'};background:${colores[i % 5]}"></div>`);
      gsap.set(el, { opacity: 0 });
      const vx = entre(-1, 1) * fuerza * .55, vy = -entre(.55, 1) * fuerza, td = entre(1.6, 2.4), tt = t + entre(0, .08);
      tl.fromTo(el, { x: 0, y: 0, opacity: 1, rotation: 0 }, { x: vx * .55, y: vy * .5, rotation: entre(-360, 360), duration: .5, ease: 'power2.out', immediateRender: false }, tt);
      tl.to(el, { x: vx * .9 + entre(-60, 60), y: vy * .5 + L(900, 1400), rotation: entre(-720, 720), duration: td, ease: 'power1.in' }, tt + .5);
      tl.to(el, { opacity: 0, duration: .4 }, tt + .5 + td - .4);
    }
    if (sonido) evento(t, 'confeti');
  }

  // ---------- DISPOSITIVOS CON CAMARA (ZOOM, PANEO Y FOCO CON DESENFOQUE) ----------
  function dispositivo(padre, tipo, { x, y, w, h }) {
    const el = crear(padre, `<div class="${tipo}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><div class="marco"></div>${tipo === 'portatil' ? '<div class="camara-web"></div><div class="teclado"></div>' : '<div class="isla"></div>'}<div class="pantalla"></div></div>`);
    const pant = el.querySelector('.pantalla');
    const borde = tipo === 'portatil' ? { l: 22, t: 24, r: 22, b: 22 } : { l: 16, t: 16, r: 16, b: 16 };
    return { el, pant, x, y, W: w - borde.l - borde.r, H: h - borde.t - borde.b, ox: x + borde.l, oy: y + borde.t };
  }
  function capa(disp, clave, { visible = true } = {}) {
    const im = IMG[clave];
    const cam = crear(disp.pant, `<div class="cam" style="width:${im.w}px;height:${im.h}px"><img class="base" src="${im.src}" width="${im.w}" height="${im.h}"><img class="nitida" src="${im.src}" width="${im.w}" height="${im.h}"><div class="resalte"></div></div>`);
    const c = { disp, cam, im, base: cam.querySelector('.base'), nitida: cam.querySelector('.nitida'), resalte: cam.querySelector('.resalte'), estado: null };
    gsap.set(c.base, { filter: 'blur(0px) brightness(1) saturate(1)' });
    gsap.set(cam, { opacity: visible ? 1 : 0 });
    camara(null, c, { cx: im.w / 2, cy: 0, z: 1 });
    return c;
  }
  // cx, cy: PUNTO DE LA IMAGEN (PIXELES NATIVOS) QUE QUEDA EN EL CENTRO; z: ZOOM SOBRE "AJUSTAR AL ANCHO"
  function camara(t, c, { cx, cy, z = 1 }, dur = 1, ease = 'power2.inOut') {
    const { W, H } = c.disp, s = W / c.im.w * z;
    let x = W / 2 - cx * s, y = H / 2 - cy * s;
    x = Math.min(0, Math.max(W - c.im.w * s, x)); y = Math.min(0, Math.max(Math.min(0, H - c.im.h * s), y));
    c.estado = { x, y, s };
    if (t === null) gsap.set(c.cam, { x, y, scale: s });
    else tl.to(c.cam, { x, y, scale: s, duration: dur, ease }, t);
  }
  const punto = (c, px, py) => ({ x: c.disp.ox + c.estado.x + px * c.estado.s, y: c.disp.oy + c.estado.y + py * c.estado.s });
  function foco(t, c, { x, y, w, h }, dur = .6, color = C.coral) {
    const { w: W, h: H } = c.im;
    tl.to(c.nitida, { clipPath: `inset(${y}px ${W - x - w}px ${H - y - h}px ${x}px round 26px)`, duration: dur, ease: 'power2.inOut' }, t);
    tl.to(c.base, { filter: 'blur(6px) brightness(0.9) saturate(0.85)', duration: dur, ease: 'power2.inOut' }, t);
    tl.set(c.resalte, { left: x - 10, top: y - 10, width: w + 20, height: h + 20, borderColor: color }, t);
    tl.fromTo(c.resalte, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: .45, ease: 'back.out(2)', immediateRender: false }, t + dur * .6);
  }
  function sinFoco(t, c, dur = .4) {
    tl.to(c.nitida, { clipPath: `inset(0px 0px 0px 0px round 0px)`, duration: dur }, t);
    tl.to(c.base, { filter: 'blur(0px) brightness(1) saturate(1)', duration: dur }, t);
    tl.to(c.resalte, { opacity: 0, duration: dur * .6 }, t);
  }
  function recorte(padre, clave, { x, y, w, h }, { left, top, escala }) {
    const im = IMG[clave];
    return crear(padre, `<div class="recorte" style="left:${left}px;top:${top}px;width:${w * escala}px;height:${h * escala}px;background-image:url(${im.src});background-size:${im.w * escala}px ${im.h * escala}px;background-position:${-x * escala}px ${-y * escala}px"></div>`);
  }

  // ---------- TRANSICIONES (LAPICES, HOJA DE CUADERNO, ESTRELLA) ----------
  function lapiz(color, largo, alto) {
    return `<svg width="${largo}" height="${alto}" viewBox="0 0 ${largo} ${alto}">
      <rect x="150" y="0" width="${largo - 300}" height="${alto}" fill="${color}"/>
      <rect x="150" y="${alto * .33}" width="${largo - 300}" height="${alto * .08}" fill="#fff" opacity=".22"/>
      <rect x="150" y="${alto * .7}" width="${largo - 300}" height="${alto * .07}" fill="#000" opacity=".08"/>
      <rect x="${largo - 150}" y="0" width="70" height="${alto}" fill="#B9C0CF"/><rect x="${largo - 128}" y="0" width="10" height="${alto}" fill="#8E97AA"/><rect x="${largo - 104}" y="0" width="10" height="${alto}" fill="#8E97AA"/>
      <rect x="${largo - 80}" y="0" width="80" height="${alto}" rx="30" fill="#FF9AA8"/>
      <path d="M150 0 L0 ${alto / 2} L150 ${alto} Z" fill="#F6D7A7"/><path d="M48 ${alto * .34} L0 ${alto / 2} L48 ${alto * .66} Z" fill="${C.tinta}"/>
    </svg>`;
  }
  function trLapices(t) {
    const base = [C.amarillo, C.azul, C.coral, C.verde, C.morado];
    const colores = V ? Array.from({ length: 13 }, (_, i) => base[i % 5]) : [C.amarillo, C.azul, C.coral, C.verde, C.morado, C.amarillo, C.azul];
    const alto = 172, largo = 2500, paso = .025 * 7 / colores.length;
    colores.forEach((col, i) => {
      const el = crear('#capa-transicion', `<div class="abs" style="left:0;top:${i * 156 - 14}px">${lapiz(col, largo, alto)}</div>`);
      const dentro = -(largo - ANCHO) / 2 + (i % 2 ? 60 : -60);
      gsap.set(el, { x: 2000 });
      tl.fromTo(el, { x: 2000 }, { x: dentro, duration: .42, ease: 'power3.out', immediateRender: false }, t + i * paso);
      tl.to(el, { x: -2700, duration: .45, ease: 'power3.in' }, t + .62 + i * paso);
    });
    evento(t, 'whoosh'); evento(t + .62, 'whoosh', { v: .6 });
    return t + .55;
  }
  function trPapel(t) {
    const el = crear('#capa-transicion', `<div class="abs" style="left:-20px;top:0;width:${ANCHO + 40}px;height:${ALTO + 100}px;background:#fff;border-radius:40px 40px 0 0;box-shadow:0 -20px 40px rgb(31 42 68 / .2);background-image:repeating-linear-gradient(#fff 0 58px, #BFD6F6 58px 61px);">
      <div class="abs" style="left:${L(200, 150)}px;top:0;bottom:0;width:4px;background:#FF8E7A"></div>
      ${L([200, 540, 880], [300, 960, 1620]).map(y => `<div class="abs" style="left:${L(70, 50)}px;top:${y}px;width:54px;height:54px;border-radius:50%;background:${C.papel};box-shadow:inset 0 4px 8px rgb(31 42 68 / .2)"></div>`).join('')}</div>`);
    gsap.set(el, { y: ALTO + 120 });
    tl.fromTo(el, { y: ALTO + 120, rotation: 2 }, { y: -40, rotation: 0, duration: .45, ease: 'power3.out', immediateRender: false }, t);
    tl.to(el, { y: -(ALTO + 220), rotation: -2, duration: .45, ease: 'power3.in' }, t + .62);
    evento(t, 'whoosh', { v: .8 }); evento(t + .62, 'papel');
    return t + .5;
  }
  function trEstrella(t) {
    const el = crear('#capa-transicion', `<div class="abs" style="left:${ANCHO / 2 - 200}px;top:${ALTO / 2 - 200}px">${estrellaSvg(200, C.amarillo)}</div>`);
    gsap.set(el, { scale: 0 });
    tl.fromTo(el, { scale: 0, rotation: -60 }, { scale: 13, rotation: 30, duration: .5, ease: 'power2.in', immediateRender: false }, t);
    tl.to(el, { scale: 0, rotation: 120, duration: .5, ease: 'power2.out' }, t + .58);
    for (let i = 0; i < 6; i++) {
      // EN VERTICAL SE LLAMA A entre() IGUAL (MISMA SEMILLA) Y SE LLEVA LA POSICION AL CUADRO VERTICAL
      const sx = entre(150, 1700), sy = entre(100, 900);
      const s = crear('#capa-transicion', `<div class="abs" style="left:${L(sx, 100 + (sx - 150) / 1550 * 860)}px;top:${L(sy, 280 + (sy - 100) / 800 * 1260)}px">${estrellaSvg(40, i % 2 ? C.coral : C.azul)}</div>`);
      gsap.set(s, { scale: 0 });
      tl.fromTo(s, { scale: 0, rotation: 0 }, { scale: 1, rotation: 90, duration: .3, ease: 'back.out(2)', immediateRender: false }, t + .6 + i * .04);
      tl.to(s, { scale: 0, duration: .25 }, t + .95 + i * .03);
    }
    evento(t, 'whoosh', { v: .8 }); evento(t + .58, 'destello');
    return t + .53;
  }

  // ================= ESCENA 1: INTRO (LOGO, PARDO SALUDA) =================
  const e1 = escena('e1');
  if (V) { mancha(e1, 960, 300, 260, '#FFF3CC', .9); mancha(e1, 60, 1300, 300, '#E6F0FD', .9); mancha(e1, 1000, 1700, 200, '#DFF5E8', .9); }
  else { mancha(e1, 1700, 160, 260, '#FFF3CC', .9); mancha(e1, 180, 900, 300, '#E6F0FD', .9); mancha(e1, 1500, 1000, 180, '#DFF5E8', .9); }
  const logo = crear(e1, `<div class="abs" style="left:${L(520, 420)}px;top:${L(200, 380)}px;width:240px;height:240px">
    <div class="abs" style="inset:0;background:#FFF8EC;border:6px solid ${C.linea};border-radius:58px;transform:rotate(-4deg);box-shadow:0 18px 30px -18px rgb(31 42 68 / .4)"></div>
    <svg class="abs" style="left:0;top:0" width="240" height="240" viewBox="0 0 240 240">
      <path id="v-izq" d="M70 70 L120 168" stroke="${C.azul}" stroke-width="30" stroke-linecap="round" fill="none"/>
      <path id="v-der" d="M170 70 L120 168" stroke="${C.coral}" stroke-width="30" stroke-linecap="round" fill="none"/>
    </svg>
    <div id="v-estrella" class="abs" style="left:150px;top:140px">${estrellaSvg(30, C.amarillo)}</div></div>`);
  const marca = crear(e1, `<div class="abs titulo" style="${L('left:800px;top:218px', 'left:0;width:1080px;text-align:center;top:650px')};font-size:190px;font-weight:600">${[...'Vanessa'].map(c => `<span class="letra">${c}</span>`).join('')}</div>`);
  const lema = crear(e1, `<div class="abs titulo" style="${L('left:0;width:1920px;text-align:center;top:470px;font-size:56px', 'left:60px;width:960px;text-align:center;top:890px;font-size:60px;line-height:1.15')};font-weight:500;color:${C.grafito}">La plataforma escolar <span style="color:${C.sello}">hecha para Colombia</span></div>`);
  cambiar(0, null, 'e1');
  gsap.set(['#v-izq', '#v-der'], { strokeDasharray: 120, strokeDashoffset: 120 });
  pop(.2, logo.firstElementChild, { rot: -30 });
  tl.to('#v-izq', { strokeDashoffset: 0, duration: .35, ease: 'power2.out' }, .45); evento(.45, 'trazo');
  tl.to('#v-der', { strokeDashoffset: 0, duration: .35, ease: 'power2.out' }, .75); evento(.75, 'trazo', { v: .8 });
  tl.fromTo('#v-estrella', { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: .55, ease: 'back.out(3)' }, 1.05);
  destellos(1.1, L(700, 600), L(370, 550), { n: 8, radio: 110 });
  marca.querySelectorAll('.letra').forEach((l, i) => { tl.fromTo(l, { y: 120, opacity: 0, scaleY: .5 }, { y: 0, opacity: 1, scaleY: 1, duration: .5, ease: 'back.out(3)' }, 1.3 + i * .07); evento(1.3 + i * .07, 'nota', { n: i }); });
  aparecer(2.05, lema, { y: 24 });
  // PARDO ENTRA DE UN SALTO DESDE LA DERECHA
  pardoEn(0, L(2150, 1300), L(640, 1220), 1.25);
  salto(2.5, L(820, 70), L(640, 1220), 1.25, { dur: .85, alto: 260 });
  saludar(3.45, 3); inclinar(3.45, -6); inclinar(5.6, 0);
  globo(3.55, '¡Hola! Soy **Pardo** y te muestro **Vanessa**.', L({ x: 1170, y: 840, cola: 'izq', hasta: 6.35, ancho: 520 }, { x: 450, y: 1440, cola: 'izq', hasta: 6.35, ancho: 570 }));

  // ================= ESCENA 2: EL PROBLEMA (MALETA Y LIBROS) =================
  const e2 = escena('e2');
  if (V) { mancha(e2, 740, 1260, 420, '#FFF3CC', .9); mancha(e2, 1000, 320, 200, '#FFE6E1', .9); }
  else { mancha(e2, 640, 620, 420, '#FFF3CC', .9); mancha(e2, 1750, 140, 200, '#FFE6E1', .9); }
  // EN VERTICAL: TEXTOS ARRIBA, MALETA ABAJO A LA DERECHA Y PARDO ABAJO A LA IZQUIERDA CON EL GLOBO ENCIMA
  const MX = L(440, 480), MY = L(280, 930);
  const corte2 = trLapices(6.35);
  cambiar(corte2, 'e1', 'e2');
  pose(corte2, 'piensa'); pardoEn(corte2, L(40, 20), L(650, 1220), 1.05);
  const maleta = crear(e2, `<div class="abs" style="left:${MX}px;top:${MY}px;width:520px;height:640px;transform-origin:50% 100%">
    <div id="libros" class="abs" style="left:70px;top:0;width:380px;height:200px"></div>
    <svg class="abs" style="left:0;top:80px" width="520" height="560" viewBox="0 0 520 560">
      <path d="M180 70 Q180 10 260 10 Q340 10 340 70" fill="none" stroke="#B8432F" stroke-width="22" stroke-linecap="round"/>
      <rect x="40" y="60" width="440" height="480" rx="80" fill="${C.coral}" stroke="#B8432F" stroke-width="8"/>
      <rect x="40" y="60" width="440" height="150" rx="80" fill="#FF8E7A" stroke="#B8432F" stroke-width="8"/>
      <rect x="110" y="290" width="300" height="190" rx="40" fill="#FF8E7A" stroke="#B8432F" stroke-width="7"/>
      <path d="M140 330 H380" stroke="#B8432F" stroke-width="6" stroke-dasharray="14 10"/>
      <rect x="240" y="312" width="40" height="22" rx="8" fill="${C.amarillo}" stroke="#8A5A00" stroke-width="4"/>
      <circle cx="260" cy="400" r="34" fill="#FFF3CC" stroke="#B8432F" stroke-width="5"/>
      <path d="M244 400 h32 M260 384 v32" stroke="#B8432F" stroke-width="6" stroke-linecap="round"/>
    </svg>
    <div id="gotas" class="abs" style="left:-40px;top:120px;width:600px;height:200px"></div>
    <div id="peso" class="abs titulo" style="left:110px;top:600px;width:300px;text-align:center;font-size:44px;color:#B8432F">¡uf!</div></div>`);
  const colLibros = [[C.azul, 'Matemáticas'], [C.verde, 'Ciencias'], [C.morado, 'Inglés'], [C.amarillo, 'Sociales'], [C.coral, 'Lenguaje']];
  const libros = colLibros.map(([col, nom], i) => crear('#libros', `<div class="abs" style="left:${20 + i * 66}px;top:${40 + (i % 2) * 22 + (i === 2 ? -18 : 0)}px;width:60px;height:${190 - (i % 3) * 14}px;background:${col};border:5px solid rgb(31 42 68 / .55);border-radius:8px;transform:rotate(${(i - 2) * 3}deg)">
    <div class="abs" style="left:6px;right:6px;top:20px;height:8px;background:#fff;opacity:.6;border-radius:4px"></div><div class="abs" style="left:6px;right:6px;top:36px;height:8px;background:#fff;opacity:.6;border-radius:4px"></div></div>`));
  // GOTAS DE ESFUERZO
  const gotas = [[20, 30], [520, 10], [560, 90]].map(([x, y]) => crear('#gotas', `<svg class="abs" style="left:${x}px;top:${y}px" width="34" height="48" viewBox="0 0 34 48"><path d="M17 2 Q32 26 30 34 A13 13 0 0 1 4 34 Q2 26 17 2Z" fill="#8DB8FF" stroke="#1B66C9" stroke-width="3"/></svg>`));
  tl.fromTo(maleta, { y: L(-900, -1600) }, { y: 0, duration: .5, ease: 'power3.in', immediateRender: false }, corte2 + .15); gsap.set(maleta, { y: L(-900, -1600) });
  tl.to(maleta, { keyframes: [{ scaleY: .82, scaleX: 1.12, duration: .1 }, { scaleY: 1, scaleX: 1, duration: .5, ease: 'elastic.out(1,.35)' }] }, corte2 + .65);
  evento(corte2 + .65, 'golpe');
  // LA MALETA SE TAMBALEA DE LO PESADA
  tl.to(maleta, { rotation: 2.5, duration: .35, ease: 'sine.inOut', yoyo: true, repeat: 7, transformOrigin: '50% 100%' }, corte2 + 1.2);
  gotas.forEach((g, i) => { tl.fromTo(g, { opacity: 0, y: -10 }, { opacity: 1, y: 30, duration: .6, ease: 'power1.in', immediateRender: false }, corte2 + 1.3 + i * .35); tl.to(g, { opacity: 0, duration: .3 }, corte2 + 1.9 + i * .35); gsap.set(g, { opacity: 0 }); });
  pop(corte2 + 1.0, $('#peso'), { sonido: null });
  const p2 = pildora(e2, corte2 + .5, 'El problema', C.coral, ICO.problema, L({ x: 1060, y: 150 }, { x: 60, y: 270 }));
  const t2 = titulo(e2, corte2 + .7, 'Maletas pesadas, todos los días', L({ x: 1060, y: 240, tam: 64, ancho: 780 }, { x: 60, y: 350, tam: 72, ancho: 960 }));
  const cifra = crear(e2, `<div class="abs titulo" style="left:${L(1060, 60)}px;top:${L(410, 515)}px;font-size:170px;color:${C.coral}">0 %</div>`);
  pop(corte2 + 1.1, cifra, { desde: .4, sonido: null }); contador(corte2 + 1.2, cifra, 0, 50, 1.2, v => Math.round(v) + ' %');
  const txt2 = crear(e2, `<div class="abs texto" style="${L('left:1066px;top:610px;width:740px;font-size:34px', 'left:480px;top:548px;width:560px;font-size:38px')};line-height:1.3;color:${C.tinta}">de los estudiantes lleva una maleta de <b>más del 15 % de su peso.</b></div>`);
  aparecer(corte2 + 1.9, txt2);
  const f2 = crear(e2, `<div class="abs fuente" style="${L('left:1066px;top:720px;width:740px', 'left:66px;top:730px;width:950px')}">Fuente: estudio de la Universidad CES, reportado por El Universal (febrero de 2025).</div>`);
  aparecer(corte2 + 2.3, f2, { y: 10 });
  globo(corte2 + 1.0, '¡Uf! ¡Cuánto pesa!', L({ x: 60, y: 600, cola: 'abajo', cx: 150, hasta: corte2 + 3.4 }, { x: 30, y: 1190, cola: 'abajo', cx: 122, hasta: corte2 + 3.4, ancho: 430 }));
  inclinar(corte2 + 1.2, 8);
  // EL GIRO: LOS LIBROS SALEN VOLANDO Y QUEDAN ATRAS
  const giro = corte2 + 3.7;
  salir(giro, [p2, t2, cifra, txt2, f2], { y: -40 });
  tl.to($('#peso'), { opacity: 0, duration: .2 }, giro);
  inclinar(giro, 0); pose(giro, 'anima'); animar(giro + .1);
  libros.forEach((l, i) => {
    const tt = giro + .35 + i * .16;
    tl.to(l, { x: -480 - i * 70 + 380, y: -340 + (i % 2) * 60, rotation: -200 - i * 40, duration: .45, ease: 'power2.out' }, tt);
    tl.to(l, { x: -300 - i * 60, y: 520 - i * 8, rotation: -90 + i * 4, scale: .55, duration: .45, ease: 'power2.in' }, tt + .45);
    tl.to(l, { opacity: .35, duration: .4 }, tt + .9);
    evento(tt, 'whoosh-corto', { v: .7 }); evento(tt + .9, 'libro');
  });
  tl.to(maleta, { scale: .86, y: 40, duration: .5, ease: 'back.out(2)' }, giro + 1.3);
  evento(giro + 1.3, 'boing');
  // SALE UNA TABLETA CON VANESSA DE LA MALETA
  const tableta = crear(e2, `<div class="abs" style="left:${MX + 120}px;top:${MY - 30}px;width:280px;height:420px;border-radius:40px;background:#1F2A44;box-shadow:0 0 0 0 rgb(255 197 49 / .0), 0 30px 50px -20px rgb(31 42 68 / .6)">
    <div class="abs" style="left:12px;top:12px;right:12px;bottom:12px;border-radius:30px;overflow:hidden;background:#FFF8EC"><img src="${IMG.celular.src}" style="width:100%;display:block"></div></div>`);
  gsap.set(tableta, { opacity: 0 });
  const brillo = crear(e2, `<div class="abs" style="left:${MX + 10}px;top:${MY - 130}px;width:500px;height:620px;border-radius:50%;background:radial-gradient(closest-side, rgb(255 211 94 / .85), rgb(255 211 94 / 0))"></div>`);
  e2.insertBefore(brillo, maleta); gsap.set(brillo, { opacity: 0 });
  tl.fromTo(brillo, { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .6, ease: 'power2.out', immediateRender: false }, giro + 1.5);
  tl.fromTo(tableta, { opacity: 0, y: 260, scale: .5, rotation: -10 }, { opacity: 1, y: 0, scale: 1, rotation: 4, duration: .7, ease: 'back.out(1.8)', immediateRender: false }, giro + 1.55);
  tl.to(tableta, { y: -16, duration: 1.2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, giro + 2.3);
  destellos(giro + 1.9, MX + 260, MY + 140, { n: 12, radio: 220, sonido: false }); evento(giro + 1.9, 'ding');
  pose(giro + 1.8, 'celebra'); celebrar(giro + 1.85); brinco(giro + 1.85, 70);
  const t2b = titulo(e2, giro + 2.0, 'Los libros pueden **quedarse atrás**', L({ x: 1060, y: 170, tam: 86, ancho: 800, stag: .022 }, { x: 60, y: 270, tam: 78, ancho: 960, stag: .022 }));
  const s2 = crear(e2, `<div class="abs texto" style="${L('left:1066px;top:390px;width:760px;font-size:34px', 'left:66px;top:455px;width:950px;font-size:38px')};line-height:1.35;color:${C.tinta}">Los textos del colegio viven en Vanessa, por temas, y se reutilizan cada año.</div>`);
  aparecer(giro + 2.6, s2);
  const chip = crear(e2, `<div class="tarjeta" style="${L('left:1060px;top:560px;width:780px', 'left:60px;top:582px;width:960px')};padding:26px 34px">
    <div class="texto" style="font-size:${L(26, 30)}px;color:${C.grafito}">Ejemplo de lo que paga hoy una familia:</div>
    <div class="titulo" style="font-size:${L(78, 80)}px;color:${C.sello};margin:6px 0"><span id="cop">$0</span></div>
    <div class="texto" style="font-size:${L(26, 30)}px;color:${C.tinta}">paquete de 15 textos de primaria por estudiante en un colegio de Bucaramanga, 2026.</div>
    <div class="fuente" style="margin-top:12px">Fuente: Circular 004 de 2026, Comfenalco Santander.</div></div>`);
  pop(giro + 3.0, chip, { desde: .6 }); contador(giro + 3.2, $('#cop'), 0, 976300, 1.1, COP);
  globo(giro + 3.2, '¡Menos gasto y menos peso!', L({ x: 60, y: 600, cola: 'abajo', cx: 150, hasta: giro + 5.4, ancho: 400 }, { x: 30, y: 1190, cola: 'abajo', cx: 122, hasta: giro + 5.4, ancho: 430 }));

  // ================= ESCENA 3: ESTUDIANTE =================
  const e3 = escena('e3');
  if (V) { mancha(e3, 980, 1500, 380, '#E6F0FD', .9); mancha(e3, 120, 330, 220, '#FFF3CC', .8); }
  else { mancha(e3, 1650, 950, 380, '#E6F0FD', .9); mancha(e3, 300, 120, 220, '#FFF3CC', .8); }
  // EN VERTICAL: TITULO ARRIBA, CELULAR A LA IZQUIERDA Y PARDO ABAJO A LA DERECHA CON EL GLOBO ENCIMA
  const CEL = L({ x: 300, y: 110, w: 420, h: 870 }, { x: 60, y: 545, w: 440, h: 910 });
  const TIT = L({ x: 820, y: 220, tam: 66, ancho: 980 }, { x: 60, y: 350, tam: 70, ancho: 960 });
  const PIL = L({ x: 820, y: 130 }, { x: 60, y: 270 });
  const GLOBO_CEL = { x: 530, y: 1190, cola: 'abajo', cx: 327, ancho: 510 };
  const ABAJO = L(1000, 1500);
  const corte3 = trPapel(giro + 5.5);
  cambiar(corte3, 'e2', 'e3');
  pose(corte3, 'saluda'); pardoEn(corte3, L(1480, 725), L(650, 1220), 1.1);
  const tel = dispositivo(e3, 'celular', CEL);
  const cCel = capa(tel, 'celular'); camara(null, cCel, { cx: 390, cy: 0, z: 1.06 });
  tl.fromTo(tel.el, { y: ABAJO, rotation: 8 }, { y: 0, rotation: 0, duration: .7, ease: 'back.out(1.4)', immediateRender: false }, corte3 + .2); gsap.set(tel.el, { y: ABAJO });
  evento(corte3 + .2, 'whoosh-corto');
  const p3 = pildora(e3, corte3 + .4, 'Estudiante', C.azul, ICO.estudiante, PIL);
  const t3 = titulo(e3, corte3 + .6, 'Su camino de temas, con estrellas', TIT);
  // PANEO HASTA EL CAMINO DE TEMAS Y ESTRELLAS
  camara(corte3 + 1.4, cCel, { cx: 390, cy: 1160, z: 1.06 }, 1.2);
  evento(corte3 + 1.4, 'swipe');
  foco(corte3 + 2.7, cCel, { x: 40, y: 1095, w: 700, h: 230 }, .5, C.amarillo);
  [[145, 1140], [283, 1140], [420, 1140]].forEach(([px, py], i) => {
    const tt = corte3 + 3.1 + i * .28, pt = punto(cCel, px, py);
    const st = crear('#capa-efectos', `<div class="abs" style="left:${pt.x - 26}px;top:${pt.y - 26}px">${estrellaSvg(26, C.amarillo)}</div>`);
    gsap.set(st, { opacity: 0 });
    tl.fromTo(st, { scale: 0, opacity: 1, rotation: -90 }, { scale: 1.5, rotation: 0, duration: .35, ease: 'back.out(3)', immediateRender: false }, tt);
    tl.to(st, { scale: 0, opacity: 0, duration: .3 }, tt + .55);
    destellos(tt, pt.x, pt.y, { n: 6, radio: 70, sonido: false }); evento(tt, 'nota', { n: 2 + i * 2 });
  });
  pose(corte3 + 2.6, 'anima'); animar(corte3 + 2.7);
  globo(corte3 + 1.1, '¡Cada tema que terminas gana una **estrella**!', L({ x: 1150, y: 610, cola: 'abajo', cx: 380, hasta: corte3 + 4.6, ancho: 640 }, { ...GLOBO_CEL, hasta: corte3 + 4.6 }));
  const pt4 = punto(cCel, 528, 1170);
  cursorMostrar(corte3 + 3.8, L(900, 820), L(900, 1300)); cursorA(corte3 + 3.95, pt4.x, pt4.y, .55); clic(corte3 + 4.6, pt4.x, pt4.y);
  cursorOcultar(corte3 + 5.0);
  // QUIZ (RECREACION CON LOS DATOS DE EJEMPLO DE LA LANDING)
  const q0 = corte3 + 5.0;
  tl.to(tel.el, { x: -900, rotation: -10, duration: .5, ease: 'power3.in' }, q0); evento(q0, 'whoosh-corto');
  salir(q0, [t3], { y: -20, dur: .25 });
  const t3b = titulo(e3, q0 + .3, 'Quiz calificado al instante', { ...TIT, sonido: false });
  // MEDIDAS DEL QUIZ: TARJETA (x, y, w, h), PREGUNTA (pw, pt), OPCIONES (oy: ARRIBA, oc: SEPARACION DE COLUMNAS, ow: ANCHO), RETRO (ry) Y PIZZA (zx, zy)
  const QZ = L({ x: 110, y: 340, w: 1100, h: 600, pw: 820, pt: 40, oy: 290, oc: 510, ow: 490, ry: 528, zx: 900, zy: 90, chip: 24, retro: 28 },
    { x: 60, y: 520, w: 960, h: 650, pw: 640, pt: 42, oy: 330, oc: 444, ow: 420, ry: 572, zx: 740, zy: 110, chip: 26, retro: 30 });
  const quiz = crear(e3, `<div class="tarjeta" style="left:${QZ.x}px;top:${QZ.y}px;width:${QZ.w}px;height:${QZ.h}px;padding:40px 48px">
    <div class="abs texto" style="left:48px;top:36px;font-size:${QZ.chip}px;color:${C.sello};background:#E6F0FD;padding:8px 18px;border-radius:999px">Matemáticas 6A · Tema: Fracciones</div>
    <div class="abs titulo" style="left:48px;top:100px;width:${QZ.pw}px;font-size:${QZ.pt}px;font-weight:500;line-height:1.25">Sofía comió 1/4 de la pizza y Tomás 2/4. ¿Qué parte de la pizza comieron entre los dos?</div>
    ${['2/8', '3/4', '3/8', '1/2'].map((o, i) => `<div class="abs opcion" id="op${i}" style="left:${48 + (i % 2) * QZ.oc}px;top:${QZ.oy + Math.floor(i / 2) * 116}px;width:${QZ.ow}px;height:96px;border:4px solid ${C.linea};border-radius:24px;background:#fff;display:flex;align-items:center;gap:20px;padding:0 22px;font-family:Fredoka;font-weight:600;font-size:44px">
      <span style="display:grid;place-items:center;width:52px;height:52px;border-radius:50%;background:#EEE9FD;color:#6B4FD8;font-size:28px">${'ABCD'[i]}</span>${o}</div>`).join('')}
    <div id="retro" class="abs texto" style="left:48px;top:${QZ.ry}px;font-size:${QZ.retro}px;color:${C.verde}">¡Muy bien! 1/4 + 2/4 = 3/4. ¡Ganaste una estrella!</div>
    <svg class="abs" style="left:${QZ.zx}px;top:${QZ.zy}px" width="150" height="150" viewBox="0 0 150 150"><circle cx="75" cy="75" r="68" fill="#FFD98A" stroke="#C98A00" stroke-width="5"/><circle cx="75" cy="75" r="56" fill="#FF8E7A"/>
      <path id="pz" d="M75 75 L75 19 A56 56 0 1 1 19 75 Z" fill="#FFC531" opacity="0"/>${[0, 90, 180, 270].map(a => `<path d="M75 75 L${75 + 56 * Math.sin(a * Math.PI / 180)} ${75 - 56 * Math.cos(a * Math.PI / 180)}" stroke="#C98A00" stroke-width="4"/>`).join('')}
      <circle cx="58" cy="50" r="7" fill="#B8432F"/><circle cx="100" cy="98" r="7" fill="#B8432F"/><circle cx="52" cy="100" r="6" fill="#B8432F"/></svg></div>`);
  // EN VERTICAL LA NOTA VA DEBAJO DE LA TARJETA, A LA IZQUIERDA, Y EL GLOBO ENTRE LA NOTA Y PARDO
  const NOTA = L({ x: 1170, y: 560 }, { x: 60, y: 1235 });
  const nota = crear(e3, `<div class="abs" style="left:${NOTA.x}px;top:${NOTA.y}px;width:250px;height:250px;border-radius:50%;background:${C.verde};border:10px solid #fff;box-shadow:0 20px 40px -16px rgb(27 122 74 / .7);display:grid;place-items:center;text-align:center">
    <div><div class="titulo" style="font-size:104px;color:#fff;line-height:.9">5,0</div><div class="titulo" style="font-size:34px;color:#fff;font-weight:500">Superior</div></div></div>`);
  const ej = crear(e3, `<div class="nota-demo" style="left:${QZ.x}px;top:${QZ.y + QZ.h + 22}px">Recreación con datos de ejemplo</div>`);
  gsap.set([quiz, nota, ej, '#retro'], { opacity: 0 });
  pop(q0 + .35, quiz, { desde: .7, ease: 'back.out(1.6)' }); aparecer(q0 + .7, ej, { y: 10 });
  const op1 = $('#op1');
  cursorMostrar(q0 + 1.0, L(1000, 820), L(1000, 1300)); cursorA(q0 + 1.1, QZ.x + 48 + QZ.oc + 300, QZ.y + QZ.oy + 50, .6);
  clic(q0 + 1.8, QZ.x + 48 + QZ.oc + 300, QZ.y + QZ.oy + 50, C.verde);
  tl.to(op1, { backgroundColor: '#DFF5E8', borderColor: C.verde, color: '#1B7A4A', scale: 1.04, duration: .25 }, q0 + 1.85);
  tl.to(op1, { scale: 1, duration: .3, ease: 'back.out(3)' }, q0 + 2.1);
  evento(q0 + 1.9, 'correcto');
  tl.to('#pz', { opacity: 1, duration: .3 }, q0 + 1.95);
  cursorOcultar(q0 + 2.3);
  aparecer(q0 + 2.1, $('#retro'), { y: 12 });
  tl.fromTo(nota, { scale: 3, opacity: 0, rotation: -40 }, { scale: 1, opacity: 1, rotation: -10, duration: .35, ease: 'power3.in', immediateRender: false }, q0 + 2.3);
  tl.to(nota, { keyframes: [{ scale: .9, duration: .06 }, { scale: 1, duration: .3, ease: 'elastic.out(1,.4)' }] }, q0 + 2.65);
  evento(q0 + 2.65, 'sello'); confeti(q0 + 2.7, NOTA.x + 125, NOTA.y + 80, { n: 90, fuerza: 760, ancho: 160 });
  pose(q0 + 2.65, 'celebra'); celebrar(q0 + 2.7); brinco(q0 + 2.7, 80);
  globo(q0 + 2.75, '¡5,0! ¡Lo lograste!', L({ x: 1460, y: 610, cola: 'abajo', cx: 120, hasta: q0 + 4.7 }, { ...BANDA, ancho: 370, hasta: q0 + 4.7 }));
  // RACHA DE DIAS SEGUIDOS (CAPTURA REAL DE "MI PROGRESO")
  const r0 = q0 + 4.7;
  tl.to([quiz, nota, ej], { y: L(900, 1500), duration: .45, ease: 'power3.in' }, r0); evento(r0, 'whoosh-corto');
  salir(r0, [t3b], { y: -20, dur: .25 });
  titulo(e3, r0 + .3, 'Y su racha de días seguidos', { ...TIT, sonido: false });
  const lap3 = dispositivo(e3, 'portatil', L({ x: 110, y: 350, w: 1060, h: 640 }, { x: 80, y: 545, w: 920, h: 560 }));
  const cEst = capa(lap3, 'estudiante'); camara(null, cEst, { cx: 800, cy: 0, z: 1 });
  gsap.set(lap3.el, { y: L(900, 1500) });
  tl.fromTo(lap3.el, { y: L(900, 1500) }, { y: 0, duration: .6, ease: 'back.out(1.3)', immediateRender: false }, r0 + .35);
  camara(r0 + 1.1, cEst, { cx: 870, cy: 360, z: 1.3 }, 1.0);
  foco(r0 + 1.9, cEst, { x: 885, y: 352, w: 322, h: 150 }, .5, C.amarillo);
  { const pt = punto(cEst, 1046, 427); destellos(r0 + 2.4, pt.x, pt.y, { n: 10, radio: 150, sonido: false }); evento(r0 + 2.4, 'ding'); }
  pose(r0 + .4, 'anima'); animar(r0 + 2.4);
  globo(r0 + 1.0, '¡**17 días** seguidos! ¡Qué buena racha!', L({ x: 1250, y: 610, cola: 'abajo', cx: 280, hasta: r0 + 3.7, ancho: 560 }, { ...BANDA, hasta: r0 + 3.7 }));

  // ================= ESCENA 4: PROFESOR =================
  const e4 = escena('e4');
  if (V) { mancha(e4, 980, 1500, 380, '#DFF5E8', .9); mancha(e4, 1000, 300, 200, '#FFF3CC', .8); }
  else { mancha(e4, 1650, 980, 380, '#DFF5E8', .9); mancha(e4, 1800, 120, 200, '#FFF3CC', .8); }
  // TITULO Y PILDORA DE LAS ESCENAS 4 Y 5 (EN VERTICAL, ARRIBA Y A TODO EL ANCHO)
  const PIL2 = L({ x: 110, y: 56 }, { x: 60, y: 270 });
  const TIT2 = L({ x: 110, y: 140, tam: 58, ancho: 1300 }, { x: 60, y: 350, tam: 64, ancho: 960 });
  const GLOBO_DER = L({ x: 1280, y: 610, cola: 'abajo', cx: 260, ancho: 580 }, BANDA);
  const corte4 = trEstrella(r0 + 3.8);
  cambiar(corte4, 'e3', 'e4');
  pose(corte4, 'lee'); pardoEn(corte4, L(1480, 725), L(650, 1220), 1.1);
  const lap4 = dispositivo(e4, 'portatil', L({ x: 110, y: 250, w: 1120, h: 700 }, { x: 80, y: 545, w: 920, h: 580 }));
  const cPro = capa(lap4, 'profesor'), cTem = capa(lap4, 'temas', { visible: false }), cCal = capa(lap4, 'calificar', { visible: false });
  camara(null, cPro, { cx: 800, cy: 0, z: 1 });
  gsap.set(lap4.el, { y: L(900, 1500) });
  tl.fromTo(lap4.el, { y: L(900, 1500) }, { y: 0, duration: .6, ease: 'back.out(1.3)', immediateRender: false }, corte4 + .2); evento(corte4 + .2, 'whoosh-corto');
  pildora(e4, corte4 + .35, 'Profesor', C.verde, ICO.profesor, PIL2);
  const t4 = titulo(e4, corte4 + .55, 'Arma su curso una vez, por temas y lecciones', TIT2);
  camara(corte4 + 1.2, cPro, { cx: 640, cy: 560, z: 1.45 }, 1.1);
  foco(corte4 + 2.3, cPro, { x: 215, y: 535, w: 820, h: 160 }, .5, C.verde);
  evento(corte4 + 2.6, 'destello');
  globo(corte4 + 1.3, '¡Y lo publica a **todos sus grupos**!', { ...GLOBO_DER, hasta: corte4 + 3.9 });
  const tt4 = corte4 + 4.0;
  tl.to(cTem.cam, { opacity: 1, duration: .35 }, tt4); evento(tt4, 'swipe');
  camara(null, cTem, { cx: 1100, cy: 520, z: 1.12 });
  camara(tt4, cTem, { cx: 1150, cy: 460, z: 1.2 }, 1.2, 'sine.inOut');
  pose(tt4, 'anima');
  { const a = punto(cTem, 1860, 800); cursorMostrar(tt4 + .5, L(1000, 820), L(950, 1300)); cursorA(tt4 + .6, a.x, a.y, .7); clic(tt4 + 1.4, a.x, a.y); destellos(tt4 + 1.45, a.x, a.y, { n: 7, radio: 90 }); cursorOcultar(tt4 + 1.9); }
  // BANDEJA POR CALIFICAR
  const tc4 = tt4 + 2.3;
  tl.to(cCal.cam, { opacity: 1, duration: .35 }, tc4); evento(tc4, 'swipe');
  salir(tc4, [t4], { y: -20, dur: .25 });
  titulo(e4, tc4 + .3, 'Y revisa lo escrito en «Por calificar»', { ...TIT2, sonido: false });
  camara(null, cCal, { cx: 1280, cy: 0, z: 1 });
  camara(tc4 + .4, cCal, { cx: 720, cy: 470, z: 1.6 }, 1.0);
  foco(tc4 + 1.3, cCal, { x: 340, y: 412, w: 680, h: 120 }, .45, C.verde);
  sinFoco(tc4 + 2.5, cCal);
  camara(tc4 + 2.5, cCal, { cx: 1300, cy: 1120, z: 1.15 }, 1.0);
  { const a = punto(cCal, 2346, 1171); cursorMostrar(tc4 + 3.0, L(900, 820), L(1000, 1300)); cursorA(tc4 + 3.1, a.x, a.y, .5); clic(tc4 + 3.7, a.x, a.y); cursorOcultar(tc4 + 4.0); }
  pose(tc4 + .5, 'lee');
  globo(tc4 + .9, '¡Todo lo escrito, en **un solo lugar**!', { ...GLOBO_DER, hasta: tc4 + 4.05 });

  // ================= ESCENA 5: COORDINACION =================
  const e5 = escena('e5');
  if (V) { mancha(e5, 980, 1500, 380, '#EEE9FD', .95); mancha(e5, 80, 1450, 220, '#E6F0FD', .9); }
  else { mancha(e5, 1650, 980, 380, '#EEE9FD', .95); mancha(e5, 140, 1000, 220, '#E6F0FD', .9); }
  const corte5 = trLapices(tc4 + 4.2);
  cambiar(corte5, 'e4', 'e5');
  pose(corte5, 'piensa'); pardoEn(corte5, L(1480, 725), L(650, 1220), 1.1);
  pildora(e5, corte5 + .25, 'Coordinación y rectoría', C.morado, ICO.coordinacion, PIL2);
  const t5 = titulo(e5, corte5 + .45, 'Todo el colegio, de un vistazo', TIT2);
  // TARJETAS DE CIFRAS EN 2 x 2: x0, y0, PASO EN x E y, ANCHO, ALTO Y TAMAÑO DEL NUMERO
  const TJ = L({ x: 110, y: 290, dx: 600, dy: 320, w: 570, h: 290, n: 130 }, { x: 60, y: 520, dx: 490, dy: 290, w: 470, h: 270, n: 120 });
  const datos = [['Estudiantes', 60, v => Math.round(v), C.azul, '#E6F0FD'], ['Activos en la semana', 58, v => Math.round(v), C.verde, '#DFF5E8'], ['Avance promedio', 84.9, v => dec(v, 1) + ' %', C.morado, '#EEE9FD'], ['Alertas abiertas', 11, v => Math.round(v), C.coral, '#FFE6E1']];
  const tarjetas = datos.map(([nom, val, fmt, col, suave], i) => {
    const el = crear(e5, `<div class="tarjeta" style="left:${TJ.x + (i % 2) * TJ.dx}px;top:${TJ.y + Math.floor(i / 2) * TJ.dy}px;width:${TJ.w}px;height:${TJ.h}px;padding:34px 40px;border-color:${col}55;background:linear-gradient(160deg,#fff 55%,${suave})">
      <div class="texto" style="font-size:32px;color:${C.grafito}">${nom}</div><div class="titulo n" style="font-size:${TJ.n}px;color:${col};margin-top:10px">0</div></div>`);
    pop(corte5 + .8 + i * .15, el, { desde: .5, sonido: i ? 'pop' : 'pop' });
    contador(corte5 + 1.1 + i * .15, el.querySelector('.n'), 0, val, 1.3, fmt);
    return el;
  });
  const demo5 = crear(e5, `<div class="nota-demo" style="left:${TJ.x}px;top:${L(930, 1100)}px">Datos del colegio demo «Los Leopardos»</div>`);
  aparecer(corte5 + 1.4, demo5, { y: 10 });
  globo(corte5 + 1.2, 'Coordinación ve todo el colegio **en vivo**.', { ...GLOBO_DER, ...L({ ancho: 560 }, {}), hasta: corte5 + 3.9 });
  // ALERTA TEMPRANA: TARJETAS QUE APARECEN (RECORTES DE LA CAPTURA REAL)
  const a5 = corte5 + 4.1;
  tl.to(tarjetas, { scale: .6, opacity: 0, duration: .3, stagger: .05, ease: 'back.in(2)' }, a5);
  salir(a5, [t5, demo5], { y: -20, dur: .25 });
  const t5b = titulo(e5, a5 + .3, 'Alerta temprana, antes de que sea tarde', { ...TIT2, sonido: false });
  // EN VERTICAL LOS 4 CONTADORES VAN EN 2 x 2 (ESCALA .9) Y LAS FILAS DE ALERTAS A TODO EL ANCHO (ESCALA .444)
  const esc = L(.54, .444), escT = L(.54, .9);
  [[317, 45, 521, 201], [865, 45, 521, 201], [1411, 45, 521, 201], [1958, 45, 521, 201]].forEach((r, i) => {
    const pos = V ? { left: 60 + (i % 2) * (521 * escT + 21), top: 520 + Math.floor(i / 2) * (201 * escT + 18) } : { left: 110 + (r[0] - 317) * esc, top: 270 };
    const el = recorte(e5, 'alertas', { x: r[0], y: r[1], w: r[2], h: r[3] }, { ...pos, escala: escT });
    gsap.set(el, { opacity: 0 });
    pop(a5 + .5 + i * .14, el, { desde: .3, rot: -6 });
  });
  [[662, 192], [854, 193], [1047, 236]].forEach(([y, h], i) => {
    const el = recorte(e5, 'alertas', { x: 317, y, w: 2161, h }, { left: L(110, 60), top: L(420, 922) + (y - 662) * esc + i * 14, escala: esc });
    gsap.set(el, { opacity: 0 });
    tl.fromTo(el, { x: 1400, opacity: 0 }, { x: 0, opacity: 1, duration: .5, ease: 'back.out(1.4)', immediateRender: false }, a5 + 1.2 + i * .25);
    evento(a5 + 1.2 + i * .25, 'whoosh-corto', { v: .7 });
  });
  pose(a5 + .3, 'piensa'); inclinar(a5 + .4, 6);
  globo(a5 + 1.0, 'Así nadie se queda atrás sin que lo notemos.', { ...GLOBO_DER, ...L({ ancho: 560 }, {}), hasta: a5 + 4.0 });
  // SIMULACROS SABER 11 EN EL TIEMPO
  const s5 = a5 + 4.2;
  tl.to('#e5 .recorte', { y: -60, opacity: 0, duration: .35, stagger: .03, ease: 'power2.in' }, s5);
  inclinar(s5, 0);
  titulo(e5, s5 + .35, 'Simulacros Saber 11 en el tiempo', { ...TIT2, sonido: false });
  salir(s5, [t5b], { y: -20, dur: .25 });
  const escS = L(.53, .444), GX = L(110, 60), GY = L(280, 540);
  const graf = recorte(e5, 'simulacros', { x: 317, y: 371, w: 2161, h: 922 }, { left: GX, top: GY, escala: escS });
  gsap.set(graf, { opacity: 0 });
  pop(s5 + .4, graf, { desde: .7, ease: 'back.out(1.5)' });
  const tapa = crear(graf, `<div class="abs" style="left:${(430 - 317) * escS}px;top:${(705 - 371) * escS}px;width:${(2440 - 430) * escS}px;height:${(860 - 705) * escS}px;background:#fff;transform-origin:100% 50%"></div>`);
  tl.fromTo(tapa, { scaleX: 1 }, { scaleX: 0, duration: 1.5, ease: 'power1.inOut', immediateRender: false }, s5 + 1.0);
  evento(s5 + 1.0, 'subida', { dur: 1.5 });
  { const x = GX + (2374 - 317) * escS, y = GY + (803 - 371) * escS; destellos(s5 + 2.5, x, y, { n: 10, radio: 120, sonido: false }); evento(s5 + 2.5, 'ding'); }
  const demoS = crear(e5, `<div class="nota-demo" style="left:${GX}px;top:${L(800, 975)}px">Puntaje global estimado (0 a 500) · colegio demo</div>`);
  aparecer(s5 + .9, demoS, { y: 10 });
  pose(s5 + 2.4, 'celebra'); celebrar(s5 + 2.45); brinco(s5 + 2.45, 60);
  globo(s5 + .6, '¡Simulacros **Saber** todo el año!', { ...GLOBO_DER, ...L({ ancho: 560 }, {}), hasta: s5 + 3.6 });

  // ================= ESCENA 6: FAMILIA =================
  const e6 = escena('e6');
  if (V) { mancha(e6, 980, 1500, 380, '#FFF3CC', .95); mancha(e6, 120, 330, 220, '#FFE6E1', .8); }
  else { mancha(e6, 1650, 980, 380, '#FFF3CC', .95); mancha(e6, 240, 160, 220, '#FFE6E1', .8); }
  const corte6 = trPapel(s5 + 3.75);
  cambiar(corte6, 'e5', 'e6');
  pose(corte6, 'saluda'); pardoEn(corte6, L(1480, 725), L(650, 1220), 1.1);
  const tel6 = dispositivo(e6, 'celular', CEL);
  const cAcu = capa(tel6, 'acudiente'); camara(null, cAcu, { cx: 390, cy: 0, z: 1 });
  gsap.set(tel6.el, { y: ABAJO });
  tl.fromTo(tel6.el, { y: ABAJO, rotation: 8 }, { y: 0, rotation: 0, duration: .7, ease: 'back.out(1.4)', immediateRender: false }, corte6 + .2); evento(corte6 + .2, 'whoosh-corto');
  pildora(e6, corte6 + .4, 'Acudiente', '#E39A2A', ICO.familia, PIL);
  const t6 = titulo(e6, corte6 + .6, 'La familia, informada a tiempo', TIT);
  camara(corte6 + 1.4, cAcu, { cx: 390, cy: 1000, z: 1 }, 1.1); evento(corte6 + 1.4, 'swipe');
  foco(corte6 + 2.5, cAcu, { x: 66, y: 958, w: 648, h: 286 }, .5, '#E39A2A');
  saludar(corte6 + .3, 2);
  globo(corte6 + 1.1, 'Claudia sabe cómo va Samuel, sin esperar al **boletín**.', L({ x: 1150, y: 610, cola: 'abajo', cx: 380, hasta: corte6 + 4.7, ancho: 640 }, { ...GLOBO_CEL, hasta: corte6 + 4.7 }));
  // RESUMEN SEMANAL POR WHATSAPP (BURBUJA ILUSTRATIVA, SIN CIFRAS)
  const w6 = corte6 + 4.85;
  tl.to(tel6.el, { x: -900, rotation: -10, duration: .5, ease: 'power3.in' }, w6); evento(w6, 'whoosh-corto');
  salir(w6, [t6], { y: -20, dur: .25 });
  titulo(e6, w6 + .3, 'Resumen semanal por WhatsApp', { ...TIT, sonido: false });
  const chat = crear(e6, `<div class="celular" style="left:${CEL.x}px;top:${CEL.y}px;width:${CEL.w}px;height:${CEL.h}px"><div class="marco"></div><div class="isla"></div>
    <div class="pantalla" style="background:#EFE7DC;background-image:var(--patron)">
      <div class="abs" style="left:0;right:0;top:0;height:150px;background:#1B7A4A;display:flex;align-items:flex-end;gap:14px;padding:0 22px 20px">
        <div style="width:58px;height:58px;border-radius:50%;background:#FFF8EC;display:grid;place-items:center;overflow:hidden"><svg width="52" height="46" viewBox="36 24 128 114">${window.svgPardo().match(/<g id="p-cabeza">[\s\S]*?<g id="p-mirada">/)[0].replace('<g id="p-mirada">', '').replace(/ id="[^"]+"/g, '')}<ellipse cx="78" cy="85" rx="10.5" ry="12.5" fill="#2A2233"/><ellipse cx="122" cy="85" rx="10.5" ry="12.5" fill="#2A2233"/><path d="M92.5 101 Q100 97 107.5 101 Q105 107 100 108.5 Q95 107 92.5 101 Z" fill="#5A3325"/></g></svg></div>
        <div><div class="titulo" style="color:#fff;font-size:27px">Colegio Los Leopardos</div><div class="texto" id="estado-chat" style="color:#DFF5E8;font-size:20px">en línea</div></div></div>
      <div id="escribiendo" class="abs" style="left:22px;top:190px;background:#fff;border-radius:22px;padding:18px 22px;display:flex;gap:8px">${[0, 1, 2].map(i => `<span class="punto-e" style="width:14px;height:14px;border-radius:50%;background:#AEB6CA;display:block"></span>`).join('')}</div>
      <div id="burbuja" class="abs texto" style="left:22px;top:190px;width:${L(330, 350)}px;background:#fff;border-radius:6px 26px 26px 26px;padding:20px 22px;font-size:${L(23, 25)}px;line-height:1.35;color:${C.tinta};box-shadow:0 4px 0 rgb(0 0 0 / .06);transform-origin:0 0">
        Hola, Claudia. Este es el <b style="color:${C.sello}">resumen semanal</b> de Samuel en Vanessa: lo que estudió cada día, los temas por repasar y lo que cierra la próxima semana. ¡Buen fin de semana!
        <div style="text-align:right;font-size:17px;color:${C.grafito};margin-top:6px">viernes ✓✓</div></div>
    </div></div>`);
  gsap.set(chat, { y: ABAJO }); gsap.set(['#escribiendo', '#burbuja'], { opacity: 0 });
  tl.fromTo(chat, { y: ABAJO, rotation: 8 }, { y: 0, rotation: 0, duration: .7, ease: 'back.out(1.4)', immediateRender: false }, w6 + .35); evento(w6 + .35, 'whoosh-corto');
  tl.to('#escribiendo', { opacity: 1, duration: .2 }, w6 + 1.0);
  tl.to('.punto-e', { y: -8, duration: .2, yoyo: true, repeat: 5, stagger: .1, ease: 'sine.inOut' }, w6 + 1.0);
  tl.to('#escribiendo', { opacity: 0, duration: .1 }, w6 + 2.1);
  tl.fromTo('#burbuja', { opacity: 0, scale: .3 }, { opacity: 1, scale: 1, duration: .45, ease: 'back.out(2)', immediateRender: false }, w6 + 2.1);
  evento(w6 + 2.1, 'mensaje');
  const aut = crear(e6, `<div class="tarjeta texto" style="${L('left:820px;top:330px', 'left:530px;top:560px;width:500px')};padding:18px 28px;font-size:${L(28, 32)}px;color:${C.tinta};display:flex;gap:16px;align-items:center"><span style="display:grid;place-items:center;flex:none;width:44px;height:44px;border-radius:50%;background:#DFF5E8;color:#1B7A4A;font-size:28px">✓</span>Solo si el acudiente lo autoriza (Ley 1581)</div>`);
  pop(w6 + 2.7, aut, { desde: .6 });
  pose(w6 + 2.2, 'celebra'); celebrar(w6 + 2.25);
  globo(w6 + 2.5, '¡Y cada semana le llega su resumen!', L({ x: 1280, y: 610, cola: 'abajo', cx: 260, hasta: w6 + 5.1, ancho: 560 }, { ...GLOBO_CEL, hasta: w6 + 5.1 }));

  // ================= ESCENA 7: CIERRE =================
  const e7 = escena('e7');
  if (V) { mancha(e7, 820, 1380, 470, '#FFF3CC', .95); mancha(e7, 80, 330, 240, '#E6F0FD', .9); mancha(e7, 100, 1500, 200, '#DFF5E8', .9); }
  else { mancha(e7, 1560, 700, 470, '#FFF3CC', .95); mancha(e7, 130, 120, 240, '#E6F0FD', .9); mancha(e7, 140, 1000, 200, '#DFF5E8', .9); }
  const corte7 = trEstrella(w6 + 5.25);
  cambiar(corte7, 'e6', 'e7');
  pose(corte7, 'saluda'); pardoEn(corte7, L(2150, 1300), L(680, 1220), 1.4);
  const logo7 = crear(e7, `<div class="abs" style="left:${L(150, 140)}px;top:${L(110, 290)}px;width:180px;height:180px">
    <div class="abs" style="inset:0;background:#FFF8EC;border:5px solid ${C.linea};border-radius:44px;transform:rotate(-4deg);box-shadow:0 14px 24px -14px rgb(31 42 68 / .4)"></div>
    <svg class="abs" style="left:0;top:0" width="180" height="180" viewBox="0 0 240 240"><path id="v7-izq" d="M70 70 L120 168" stroke="${C.azul}" stroke-width="30" stroke-linecap="round" fill="none"/><path id="v7-der" d="M170 70 L120 168" stroke="${C.coral}" stroke-width="30" stroke-linecap="round" fill="none"/></svg>
    <div id="v7-estrella" class="abs" style="left:110px;top:104px">${estrellaSvg(23, C.amarillo)}</div></div>`);
  gsap.set(['#v7-izq', '#v7-der'], { strokeDasharray: 120, strokeDashoffset: 120 });
  pop(corte7 + .2, logo7.firstElementChild, { rot: -30 });
  tl.to('#v7-izq', { strokeDashoffset: 0, duration: .3 }, corte7 + .4); tl.to('#v7-der', { strokeDashoffset: 0, duration: .3 }, corte7 + .6); evento(corte7 + .4, 'trazo');
  tl.fromTo('#v7-estrella', { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: .5, ease: 'back.out(3)' }, corte7 + .85);
  const marca7 = crear(e7, `<div class="abs titulo" style="left:${L(370, 345)}px;top:${L(112, 292)}px;font-size:150px">${[...'Vanessa'].map(c => `<span class="letra">${c}</span>`).join('')}</div>`);
  marca7.querySelectorAll('.letra').forEach((l, i) => { tl.fromTo(l, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: 'back.out(3)' }, corte7 + .9 + i * .06); evento(corte7 + .9 + i * .06, 'nota', { n: i }); });
  const lema7 = crear(e7, `<div class="abs titulo" style="${L('left:155px;top:330px', 'left:60px;width:960px;text-align:center;top:505px;line-height:1.15')};font-size:54px;font-weight:500;color:${C.grafito}">La plataforma escolar <span style="color:${C.sello}">hecha para Colombia</span></div>`);
  aparecer(corte7 + 1.5, lema7);
  // EN VERTICAL EL BOTON VA CENTRADO (left/right 0 Y margin auto, PARA NO CHOCAR CON LAS TRANSFORMACIONES DE GSAP)
  const BOT = L({ y: 450, cx: 155 + 330 }, { y: 680, cx: 540 });
  const boton = crear(e7, `<div class="abs titulo" style="${L('left:155px', 'left:0;right:0;margin:0 auto;width:fit-content')};top:${BOT.y}px;padding:28px 50px;border-radius:26px;background:${C.sello};color:#fff;font-size:50px;box-shadow:0 10px 0 #12498F, 0 24px 40px -16px rgb(27 102 201 / .7)">Agenda una demostración</div>`);
  pop(corte7 + 2.0, boton, { desde: .4 });
  const contactos = [
    ['#2FAE6B', '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7Z" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/>', S3 ? 'WhatsApp 313 478 8263' : 'WhatsApp 305 229 5353'],
    ['#FF6F59', '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="#fff" stroke-width="2.2"/><path d="m3 7 9 6 9-6" fill="none" stroke="#fff" stroke-width="2.2"/>', 'estebanjaniot10@gmail.com'],
    ['#2F7FE0', '<circle cx="12" cy="12" r="9" fill="none" stroke="#fff" stroke-width="2.2"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="#fff" stroke-width="2"/>', 'srjaniot.github.io/vanessa-landing'],
  ].map(([col, ico, txt], i) => {
    const el = crear(e7, `<div class="abs texto" style="left:${L(160, 110)}px;top:${L(640, 860) + i * L(100, 96)}px;display:flex;align-items:center;gap:22px;font-size:${L(42, 44)}px;font-weight:800;color:${C.tinta}"><span style="display:grid;place-items:center;width:70px;height:70px;border-radius:50%;background:${col}"><svg width="38" height="38" viewBox="0 0 24 24">${ico}</svg></span>${txt}</div>`);
    tl.fromTo(el, { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: .5, ease: 'back.out(1.6)', immediateRender: false }, corte7 + 3.4 + i * .2); gsap.set(el, { opacity: 0 });
    evento(corte7 + 3.4 + i * .2, 'pop', { v: .6 });
    return el;
  });
  if (S3) {
    const LOGO = L({ x: 160, y: 950, w: 290 }, { x: 110, y: 1135, w: 280 });
    const s3 = crear(e7, `<div class="abs texto" style="left:${LOGO.x}px;top:${LOGO.y}px;display:flex;align-items:center;gap:18px;font-size:${L(26, 30)}px;font-weight:800;color:${C.grafito};white-space:nowrap">Una solución de<img src="capturas/s3media.png" alt="S3Media" style="width:${LOGO.w}px;border-radius:22px;box-shadow:0 14px 28px -14px rgb(9 18 35 / .7)"></div>`);
    tl.fromTo(s3, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'back.out(1.6)', immediateRender: false }, corte7 + 4.2); gsap.set(s3, { opacity: 0 });
  }
  salto(corte7 + .9, L(1300, 670), L(680, 1220), 1.4, { dur: .85, alto: 240 });
  { const bx = BOT.cx, by = BOT.y + 62; cursorMostrar(corte7 + 2.4, L(900, 820), L(1000, 1250)); cursorA(corte7 + 2.5, bx + 120, by, .6); clic(corte7 + 3.15, bx + 120, by); tl.to(boton, { keyframes: [{ scale: .95, duration: .08 }, { scale: 1, duration: .35, ease: 'elastic.out(1,.4)' }] }, corte7 + 3.15); destellos(corte7 + 3.2, bx + 120, by, { n: 12, radio: 220, sonido: false }); cursorOcultar(corte7 + 3.6); }
  pose(corte7 + 3.2, 'celebra'); celebrar(corte7 + 3.25, 6); confeti(corte7 + 3.2, L(1510, 820), L(300, 1100), { n: 120, fuerza: 900, ancho: L(600, 420) });
  brinco(corte7 + 3.25, 90);
  globo(corte7 + 4.0, '¡Me encantaría conocer **tu colegio**!', L({ x: 1150, y: 545, cola: 'abajo', cx: 300, hasta: corte7 + 7.6, ancho: 600 }, { ...BANDA, der: 600, ancho: 540, hasta: corte7 + 7.6 }));
  pose(corte7 + 6.5, 'saluda'); saludar(corte7 + 6.6, 4);
  evento(corte7 + 8.3, 'fin');

  // ---------- LISTO PARA EL RENDER ----------
  const final = corte7 + 8.9;
  tl.set({}, {}, final);
  function seek(t) {
    tl.seek(t, false);
    for (const c of CONTADORES) {
      const f = Math.min(1, Math.max(0, (t - c.t) / c.dur));
      const e = 1 - Math.pow(1 - f, 3);
      c.el.textContent = c.fmt(c.de + (c.a - c.de) * e);
    }
    return true;
  }
  EV.sort((a, b) => a.t - b.t);
  window.__seek = seek;
  window.__DUR = final;
  window.__EVENTOS = EV;
  window.__AVISOS = AVISOS;
  window.__FORMATO = V ? 'vertical' : 'horizontal';
  window.__ESCENAS = { e1: 0, e2: corte2, e3: corte3, e4: corte4, e5: corte5, e6: corte6, e7: corte7 };
  seek(0);
  const q = new URLSearchParams(location.search);
  if (q.has('t')) seek(+q.get('t'));
  if (q.has('play')) { const t0 = performance.now(); const f = () => { seek((performance.now() - t0) / 1000); requestAnimationFrame(f); }; f(); }
  window.__listo = true;
})().catch(e => { window.__error = String(e && e.stack || e); console.error(e); });
