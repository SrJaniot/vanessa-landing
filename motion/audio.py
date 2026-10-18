# AUDIO DEL VIDEO HECHO CON CODIGO (SIN MUESTRAS DE TERCEROS): MUSICA ESCOLAR A 116 BPM Y EFECTOS SINTETIZADOS
# LEE salida/eventos.json (LA MISMA LISTA DE EVENTOS QUE ARMA LA ANIMACION) Y ESCRIBE salida/musica.wav, salida/efectos.wav Y salida/mezcla.wav
# USO: py audio.py
import json, os, wave
import numpy as np
from scipy import signal

AQUI = os.path.dirname(os.path.abspath(__file__))
SAL = os.path.join(AQUI, 'salida')
SR = 48000
datos = json.load(open(os.path.join(SAL, 'eventos.json'), encoding='utf8'))
DUR = datos['duracion']
EV = datos['eventos']
ESC = datos['escenas']
N = int(DUR * SR) + SR
rng = np.random.default_rng(1810)

def mf(m): return 440.0 * 2 ** ((m - 69) / 12)
def t_(d): return np.arange(int(d * SR)) / SR
def env_exp(d, tau, ataque=0.004):
    t = t_(d); e = np.exp(-t / tau)
    a = int(ataque * SR)
    if a > 0: e[:a] *= np.linspace(0, 1, a)
    return e
def poner(buf, x, t, g=1.0, pan=0.0):
    i = int(round(t * SR))
    if i >= buf.shape[1] or i + len(x) <= 0: return
    if i < 0: x = x[-i:]; i = 0
    x = x[:buf.shape[1] - i]
    gl, gr = g * np.sqrt((1 - pan) / 2) * 1.414, g * np.sqrt((1 + pan) / 2) * 1.414
    buf[0, i:i + len(x)] += x * gl
    buf[1, i:i + len(x)] += x * gr
def banda(x, f1, f2, orden=2):
    sos = signal.butter(orden, [f1, f2], btype='band', fs=SR, output='sos'); return signal.sosfilt(sos, x)
def paso_bajo(x, f, orden=2):
    sos = signal.butter(orden, f, btype='low', fs=SR, output='sos'); return signal.sosfilt(sos, x)
def paso_alto(x, f, orden=2):
    sos = signal.butter(orden, f, btype='high', fs=SR, output='sos'); return signal.sosfilt(sos, x)
def ruido(d): return rng.uniform(-1, 1, int(d * SR))

# ---------------- INSTRUMENTOS ----------------
def marimba(m, d=0.9, v=1.0):
    f = mf(m); t = t_(d)
    x = (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.42)
         + 0.32 * np.sin(2 * np.pi * 4.0 * f * t) * np.exp(-t / 0.07)
         + 0.10 * np.sin(2 * np.pi * 9.9 * f * t) * np.exp(-t / 0.02))
    a = int(0.002 * SR); x[:a] *= np.linspace(0, 1, a)
    return x * v
def glock(m, d=1.4, v=1.0):
    f = mf(m); t = t_(d)
    x = (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.6) + 0.35 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t / 0.18)
         + 0.15 * np.sin(2 * np.pi * 5.4 * f * t) * np.exp(-t / 0.06))
    a = int(0.001 * SR); x[:a] *= np.linspace(0, 1, a)
    return x * v
def bajo(m, d=0.45, v=1.0):
    f = mf(m); t = t_(d)
    x = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t) + 0.08 * np.sin(2 * np.pi * 3 * f * t)
    e = np.minimum(1, t / 0.008) * np.exp(-t / 0.35)
    r = int(0.03 * SR); e[-r:] *= np.linspace(1, 0, r)
    return x * e * v
def bombo(v=1.0):
    t = t_(0.32); f = 48 + 90 * np.exp(-t / 0.035)
    fase = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(fase) * np.exp(-t / 0.11) * v
def palmas(v=1.0):
    x = banda(ruido(0.16), 900, 4500) * env_exp(0.16, 0.045, 0.001)
    return x * v * 1.6
def maraca(v=1.0):
    return paso_alto(ruido(0.07), 5000) * env_exp(0.07, 0.018, 0.003) * v

# ---------------- MUSICA ----------------
BPM = 116; BEAT = 60 / BPM; COMPAS = 4 * BEAT
musica = np.zeros((2, N))
# I - V - vi - IV EN DO MAYOR (ACORDES COMO MIDI DE LA FUNDAMENTAL Y SUS NOTAS)
ACORDES = [(48, [60, 64, 67, 72]), (43, [59, 62, 67, 71]), (45, [57, 60, 64, 69]), (41, [57, 60, 65, 69])]
PATRON = [(0, 0, 1.0), (1, 2, .55), (2, 1, .75), (3, 2, .5), (4, 3, .9), (5, 2, .5), (6, 1, .7), (7, 2, .55)]
MELODIA = [  # (CORCHEA DENTRO DE 2 COMPASES, MIDI) PENTATONICA DE DO
    (0, 76), (2, 79), (3, 81), (4, 79), (6, 76), (8, 74), (10, 76), (12, 79),
    (16, 81), (18, 79), (19, 76), (20, 74), (22, 72), (24, 74), (26, 76)]
fin = next((e['t'] for e in EV if e['tipo'] == 'fin'), DUR - 0.6)
ultimo = int((fin - 1.0) // COMPAS)               # COMPAS DEL ACORDE FINAL
def seccion(tc):
    if tc < ESC['e2'] - 0.3: return 'intro'
    if tc < ESC['e4']: return 'llena'
    if tc < ESC['e5']: return 'media'
    if tc < ESC['e6']: return 'llena'
    if tc < ESC['e7']: return 'suave'
    return 'final'
for c in range(ultimo):
    t0 = c * COMPAS; s = seccion(t0)
    raiz, notas = ACORDES[c % 4]
    for (o, i, v) in PATRON:
        if s == 'intro' and c < 1 and o % 2: continue
        poner(musica, marimba(notas[i], 0.8, v * 0.32), t0 + o * BEAT / 2, pan=-0.25)
    if not (s == 'intro' and c < 1):
        for b in range(4):
            poner(musica, bajo(raiz - 12 + (7 if b == 2 and s != 'suave' else 0), BEAT * 0.9, 0.5), t0 + b * BEAT)
        for k in range(8):
            poner(musica, maraca(0.10 if k % 2 else 0.05), t0 + k * BEAT / 2, pan=0.35)
    if s in ('llena', 'final', 'media'):
        for b in range(4):
            if b in (0, 2) or (s != 'media' and b == 3 and c % 2): poner(musica, bombo(0.5), t0 + b * BEAT + (BEAT / 2 if b == 3 else 0))
            if b in (1, 3): poner(musica, palmas(0.14), t0 + b * BEAT, pan=0.1)
    if s in ('llena', 'final') and (c >= 3):
        mitad = c % 2
        for (o, m) in MELODIA:
            if (o >= 16) == bool(mitad):
                poner(musica, glock(m + 12 if s == 'final' else m, 1.0, 0.11), t0 + (o - 16 * mitad) * BEAT / 2, pan=0.3)
    if s == 'intro' and c == 0:
        for k, m in enumerate([84, 88, 91, 96]): poner(musica, glock(m, 1.4, 0.08), 0.15 + k * 0.09, pan=0.4)
# ACORDE FINAL CON GOLPE Y CASCADA DE GLOCKENSPIEL
tf = ultimo * COMPAS
poner(musica, bombo(0.6), tf); poner(musica, palmas(0.18), tf)
poner(musica, bajo(36, 2.6, 0.6), tf)
for k, m in enumerate([60, 64, 67, 72, 76]): poner(musica, marimba(m, 2.8, 0.3), tf + k * 0.03, pan=-0.2)
for k, m in enumerate([79, 84, 88, 91, 96]): poner(musica, glock(m, 2.2, 0.07), tf + 0.12 + k * 0.07, pan=0.3)
# COLCHON SUAVE DEL ACORDE FINAL HASTA EL ULTIMO CUADRO (PARA QUE EL CIERRE NO QUEDE EN SILENCIO)
dpad = DUR - tf + 0.2; tp = t_(dpad)
pad = sum(np.sin(2 * np.pi * mf(m) * tp + k) * (1 + 0.15 * np.sin(2 * np.pi * 4.5 * tp)) for k, m in enumerate([48, 60, 64, 67, 72]))
pad *= np.minimum(1, tp / 0.4) * 0.035
poner(musica, pad, tf)
# REVERB SENCILLA (RUIDO CON CAIDA EXPONENCIAL) PARA DAR AIRE
ir = rng.standard_normal(int(1.1 * SR)) * np.exp(-np.arange(int(1.1 * SR)) / SR / 0.28)
ir = paso_bajo(ir, 5000) * 0.012
for ch in range(2): musica[ch] += signal.fftconvolve(musica[ch], ir)[:N] * (1 if ch == 0 else 0.92)
# ENTRADA Y SALIDA SUAVES
musica[:, :int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))
cola = int(DUR * SR)
fade = int(0.6 * SR)
musica[:, cola - fade:cola] *= np.linspace(1, 0.02, fade)
musica[:, cola:] = 0

# DUCKING: LA MUSICA BAJA (-7 dB) MIENTRAS HAY UN GLOBO DE PARDO
g = np.ones(N)
for e in EV:
    if e['tipo'] == 'globo':
        a, b = int(e['t'] * SR), int(e['t1'] * SR)
        g[a:b] = np.minimum(g[a:b], 0.42)
g = paso_bajo(np.concatenate([np.ones(SR), g]), 4, 1)[SR:]   # RAMPAS SUAVES
musica *= g

# ---------------- EFECTOS ----------------
fx = np.zeros((2, N))
def sweep(f0, f1, d, curva=1.0):
    t = t_(d); f = f0 + (f1 - f0) * (t / d) ** curva
    return np.sin(2 * np.pi * np.cumsum(f) / SR)
def sfx_pop(v=1):
    return sweep(380, 980, 0.09, 0.6) * env_exp(0.09, 0.03, 0.002) * 0.5 * v
def sfx_whoosh(d=0.55, v=1, f0=250, f1=3500):
    n = ruido(d); t = t_(d)
    # FILTRO PASABANDA QUE SE MUEVE (BIQUAD POR BLOQUES)
    out = np.zeros_like(n); bloque = 256
    zi = None
    for i in range(0, len(n), bloque):
        p = i / len(n); fc = f0 * (f1 / f0) ** (np.sin(np.pi * p) ** 1.2)
        sos = signal.butter(2, [fc * 0.7, min(fc * 1.4, 20000)], btype='band', fs=SR, output='sos')
        if zi is None: zi = signal.sosfilt_zi(sos) * 0
        out[i:i + bloque], zi = signal.sosfilt(sos, n[i:i + bloque], zi=zi)
    e = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5
    return out * e * 1.4 * v
def sfx_clic(v=1):
    t = t_(0.03); return (np.sin(2 * np.pi * 2600 * t) * np.exp(-t / 0.006) + paso_alto(ruido(0.03), 3000) * np.exp(-t / 0.003) * .6) * 0.35 * v
def sfx_destello(v=1):
    x = np.zeros(int(0.7 * SR)); notas = [96, 100, 103, 108, 103, 105, 100]
    for k, m in enumerate(notas[:6]):
        s = glock(m, 0.4, 0.18); i = int(k * 0.055 * SR); x[i:i + len(s)] += s[:len(x) - i]
    return x * v
def sfx_ding(v=1, notas=(79, 84)):
    x = np.zeros(int(1.6 * SR))
    for k, m in enumerate(notas):
        s = glock(m, 1.3, 0.35); s[:int(SR * 1.0)] += marimba(m - 12, 1.0, 0.15); i = int(k * 0.11 * SR); x[i:i + len(s)] += s[:len(x) - i]
    return x * v
def sfx_confeti(v=1):
    d = 1.4; x = np.zeros(int(d * SR))
    pop = banda(ruido(0.06), 500, 6000) * env_exp(0.06, 0.012, 0.001) * 0.9
    x[:len(pop)] += pop
    for k in range(70):
        tt = rng.uniform(0.05, d - 0.05) ** 1.0 * (rng.uniform() ** 0.5)
        s = banda(ruido(0.012), 3000, 9000) * env_exp(0.012, 0.003, 0.0005) * rng.uniform(0.05, 0.18) * (1 - tt / d)
        i = int(tt * SR); x[i:i + len(s)] += s[:len(x) - i]
    return x * v
def sfx_conteo(d, v=1):
    x = np.zeros(int((d + 0.5) * SR)); k = 0; t = 0.0
    while t < d:
        f = 1 - (1 - min(1, t / d)) ** 3
        s = np.sin(2 * np.pi * (900 + 900 * f) * t_(0.025)) * env_exp(0.025, 0.006, 0.001) * 0.12
        i = int(t * SR); x[i:i + len(s)] += s[:len(x) - i]
        t += 0.045 + 0.06 * f; k += 1
    s = glock(91, 0.5, 0.15); i = int(d * SR); x[i:i + len(s)] += s[:len(x) - i]
    return x * v
def sfx_salto(v=1):
    t = t_(0.22); f = 220 + 520 * (t / 0.22) ** 0.7 + 25 * np.sin(2 * np.pi * 28 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(0.22, 0.09, 0.004) * 0.35 * v
def sfx_aterriza(v=1):
    t = t_(0.18); return (np.sin(2 * np.pi * np.cumsum(140 * np.exp(-t / 0.05) + 60) / SR) * np.exp(-t / 0.06) + paso_bajo(ruido(0.18), 900) * np.exp(-t / 0.03) * 0.5) * 0.55 * v
def sfx_golpe(v=1):
    t = t_(0.45); return (np.sin(2 * np.pi * np.cumsum(90 * np.exp(-t / 0.08) + 45) / SR) * np.exp(-t / 0.14) + paso_bajo(ruido(0.45), 600) * np.exp(-t / 0.05)) * 0.75 * v
def sfx_libro(v=1):
    t = t_(0.12); return (paso_bajo(ruido(0.12), 1500) * np.exp(-t / 0.025) + np.sin(2 * np.pi * 180 * t) * np.exp(-t / 0.03) * .5) * 0.4 * v
def sfx_boing(v=1):
    t = t_(0.5); f = 330 * (1 + 0.25 * np.sin(2 * np.pi * 14 * t) * np.exp(-t / 0.2))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(0.5, 0.15, 0.003) * 0.3 * v
def sfx_trazo(v=1):
    t = t_(0.28); return banda(ruido(0.28), 1800, 5000) * np.sin(np.pi * t / 0.28) ** 2 * 0.35 * v
def sfx_papel(v=1):
    t = t_(0.45); return banda(ruido(0.45), 600, 5000) * np.sin(np.pi * t / 0.45) ** 1.5 * 0.4 * v
def sfx_sello(v=1):
    return sfx_golpe(0.7) [:int(0.3 * SR)] * v
def sfx_mensaje(v=1):
    x = np.zeros(int(0.6 * SR))
    for k, m in enumerate([81, 88]):
        s = sweep(mf(m) * 0.9, mf(m), 0.12) * env_exp(0.12, 0.05, 0.002) * 0.35; i = int(k * 0.12 * SR); x[i:i + len(s)] += s
    return x * v
def sfx_subida(d, v=1):
    x = np.zeros(int((d + 1.0) * SR)); notas = [72, 74, 76, 79, 81, 84, 86, 88]
    for k, m in enumerate(notas):
        s = glock(m, 0.8, 0.12); i = int(k * d / len(notas) * SR); x[i:i + len(s)] += s[:len(x) - i]
    return x * v
# BLIPS DE PARDO (ESTILO "ANIMALES QUE HABLAN"): TONO CORTO Y TIERNO QUE CAMBIA CON LA VOCAL
VOCAL = {'a': 0, 'á': 0, 'e': 3, 'é': 3, 'i': 7, 'í': 7, 'o': -2, 'ó': -2, 'u': -4, 'ú': -4}
def sfx_blip(c, v=1):
    semi = VOCAL.get(c, rng.integers(-2, 3)) + rng.uniform(-0.4, 0.4)
    f0 = 560 * 2 ** (semi / 12); d = 0.06; t = t_(d)
    f = f0 * (1.06 - 0.12 * t / d)
    fase = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(fase) + 0.30 * np.sin(3 * fase) + 0.12 * np.sin(5 * fase) + 0.18 * np.sin(2 * fase)
    e = np.minimum(1, t / 0.004) * np.exp(-t / 0.028)
    return paso_bajo(x * e, 4200) * 0.55 * v

for e in EV:
    t, k, v = e['t'], e['tipo'], e.get('v', 1)
    if k == 'pop': poner(fx, sfx_pop(v), t)
    elif k == 'whoosh': poner(fx, sfx_whoosh(0.6, v * 0.9), t - 0.08)
    elif k == 'whoosh-corto': poner(fx, sfx_whoosh(0.32, v * 0.6, 400, 4500), t - 0.04)
    elif k == 'swipe': poner(fx, sfx_whoosh(0.4, 0.4, 200, 1500), t)
    elif k == 'clic': poner(fx, sfx_clic(v), t)
    elif k == 'destello': poner(fx, sfx_destello(v), t, pan=0.2)
    elif k == 'ding': poner(fx, sfx_ding(v * 0.9), t)
    elif k == 'correcto': poner(fx, sfx_ding(v, (76, 84)), t)
    elif k == 'confeti': poner(fx, sfx_confeti(v), t, pan=-0.1)
    elif k == 'conteo': poner(fx, sfx_conteo(e['dur'], v), t)
    elif k == 'salto': poner(fx, sfx_salto(v), t)
    elif k == 'aterriza': poner(fx, sfx_aterriza(v), t)
    elif k == 'golpe': poner(fx, sfx_golpe(v), t)
    elif k == 'libro': poner(fx, sfx_libro(v), t, pan=-0.4)
    elif k == 'boing': poner(fx, sfx_boing(v), t)
    elif k == 'trazo': poner(fx, sfx_trazo(v), t)
    elif k == 'papel': poner(fx, sfx_papel(v), t)
    elif k == 'sello': poner(fx, sfx_sello(v), t); poner(fx, sfx_ding(0.6, (84, 91)), t + 0.05)
    elif k == 'mensaje': poner(fx, sfx_mensaje(v), t)
    elif k == 'subida': poner(fx, sfx_subida(e['dur'], v), t)
    elif k == 'nota': poner(fx, marimba([72, 74, 76, 79, 81, 84, 86, 88][e['n'] % 8], 0.6, 0.28), t, pan=0.1)
    elif k == 'blip': poner(fx, sfx_blip(e['c'], v), t, pan=0.15)

def guardar(nombre, x):
    x = np.clip(x, -1, 1)
    with wave.open(os.path.join(SAL, nombre), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x.T * 32767).astype('<i2').tobytes())
mezcla = musica * 0.9 + fx * 1.0
mezcla = mezcla[:, :int(DUR * SR)]
pico = np.abs(mezcla).max()
print('pico antes de normalizar', round(float(pico), 3))
mezcla *= 0.7 / pico            # NIVEL DE TRABAJO; loudnorm DEJA EL VOLUMEN FINAL EN -16 LUFS
guardar('musica.wav', musica[:, :int(DUR * SR)] * 0.7 / pico)
guardar('efectos.wav', fx[:, :int(DUR * SR)] * 0.7 / pico)
guardar('mezcla.wav', mezcla)
print('audio listo', round(DUR, 2), 's')
