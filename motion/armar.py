# ARMADO FINAL: AUDIO A -16 LUFS (loudnorm EN DOS PASADAS), VIDEO H.264 yuv420p CON +faststart, POSTER Y HOJA DE CONTACTO
# USO: py armar.py   (ANTES: node render.mjs video 60  Y  py audio.py)
#      py armar.py --vertical   (VERSION PARA CELULAR: ANTES node render.mjs video 60 --vertical; USA LA MISMA MEZCLA DE AUDIO)
import json, os, re, subprocess, sys
VERTICAL = '--vertical' in sys.argv
SUF = '-vertical' if VERTICAL else ''
AQUI = os.path.dirname(os.path.abspath(__file__))
SAL = os.path.join(AQUI, 'salida')
DEST = os.path.normpath(os.path.join(AQUI, '..', 'revision', 'motion'))
FF = os.environ.get('FFMPEG', 'C:/Users/esteb/Downloads/ffmpeg-7.1.1-essentials_build/bin/ffmpeg')
os.makedirs(DEST, exist_ok=True)
LIMITE_MB = 19.5 if VERTICAL else 24.5
def ff(*args, capturar=False):
    r = subprocess.run([FF, '-hide_banner', '-y', *args], capture_output=True, text=True, encoding='utf8', errors='replace')
    if r.returncode != 0: print(r.stderr[-3000:]); sys.exit(1)
    return r.stderr

ev0 = json.load(open(os.path.join(SAL, 'eventos.json'), encoding='utf8'))
video = os.path.join(SAL, f'video-sin-audio{SUF}.mp4')
mezcla = os.path.join(SAL, 'mezcla.wav')
# 1. MEDIR Y NORMALIZAR EL AUDIO (OBJETIVO -16 LUFS, PICO REAL -1.5 dBTP)
filtro = 'alimiter=limit=0.89:attack=3:release=60:level=false,loudnorm=I=-16:TP=-1.5:LRA=11'
med = ff('-i', mezcla, '-af', filtro + ':print_format=json', '-f', 'null', '-')
m = json.loads(re.search(r'\{[^{}]*"input_i"[^{}]*\}', med, re.S).group(0))
print('audio medido: I', m['input_i'], 'TP', m['input_tp'], 'LRA', m['input_lra'])
f2 = (f"{filtro}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000")
audio = os.path.join(SAL, f'audio-final{SUF}.m4a')
ff('-i', mezcla, '-af', f2, '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', audio)

# 2. VIDEO FINAL: PRIMERO CRF; SI PASA DEL LIMITE, DOS PASADAS CON TASA FIJA
salida = os.path.join(DEST, f'pardo-presenta{SUF}.mp4')
# LAS CAPTURAS JPEG LLEGAN EN RANGO COMPLETO (yuvj420p): SE PASAN A RANGO DE TV Y BT.709 PARA QUE TODOS LOS REPRODUCTORES VEAN LOS MISMOS COLORES
comun = ['-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.2', '-movflags', '+faststart']
ff('-i', video, '-i', audio, '-map', '0:v', '-map', '1:a', *comun, '-crf', '19', '-maxrate', '4M', '-bufsize', '8M', '-c:a', 'copy', '-shortest', salida)
mb = os.path.getsize(salida) / 1e6
print('con CRF 19:', round(mb, 1), 'MB')
if mb > LIMITE_MB:
    kbps = int((LIMITE_MB - 0.6) * 8000 / ev0['duracion']) - 200
    log = os.path.join(SAL, 'pasada')
    ff('-i', video, *comun, '-b:v', f'{kbps}k', '-pass', '1', '-passlogfile', log, '-an', '-f', 'mp4', os.devnull if os.name != 'nt' else 'NUL')
    ff('-i', video, '-i', audio, '-map', '0:v', '-map', '1:a', *comun, '-b:v', f'{kbps}k', '-pass', '2', '-passlogfile', log, '-c:a', 'copy', '-shortest', salida)
    print('dos pasadas a', kbps, 'kbps:', round(os.path.getsize(salida) / 1e6, 1), 'MB')

# 3. POSTER (CUADRO DEL CIERRE) Y HOJA DE CONTACTO (UN CUADRO CADA 3 s)
ev = json.load(open(os.path.join(SAL, 'eventos.json'), encoding='utf8'))
t_poster = ev['escenas']['e7'] + 7.2
ff('-ss', f'{t_poster:.2f}', '-i', salida, '-frames:v', '1', '-q:v', '2', os.path.join(DEST, f'pardo-presenta{SUF}-poster.jpg'))
dir_m = os.path.join(SAL, 'contacto' + SUF); os.makedirs(dir_m, exist_ok=True)
for f in os.listdir(dir_m): os.remove(os.path.join(dir_m, f))
t = 0.0
while t < ev['duracion']:
    ff('-ss', f'{t:.2f}', '-i', salida, '-frames:v', '1', os.path.join(dir_m, f't{t:06.2f}.png'))
    t += 3
subprocess.run([sys.executable, os.path.join(AQUI, 'herramientas', 'mosaico.py'), dir_m, os.path.join(DEST, f'pardo-presenta{SUF}-contacto.jpg'), *(['9', '216'] if VERTICAL else ['5', '384'])], check=True)
print('listo:', salida)
