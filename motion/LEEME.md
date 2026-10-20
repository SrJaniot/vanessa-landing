# Video «Pardo presenta Vanessa»

Video de motion graphics de unos 74 s, en 1920 × 1080 a 60 fps, para presentar Vanessa a los colegios. Pardo presenta la plataforma con globos de texto y blips tiernos en lugar de voz. La música y los efectos están hechos con código, sin muestras de terceros.

## Cómo está hecho

| Pieza | Archivo | Qué hace |
|---|---|---|
| Escena | `escena/index.html`, `escena/estilos.css` | Escenario de 1920 × 1080 con los colores y las fuentes de la landing (Fredoka y Nunito, en `escena/fuentes/`). |
| Pardo | `escena/pardo.js` | El mismo dibujo de `src/app/compartido/pardo/pardo.ts`, separado en partes (cola, brazos de cada estado, cabeza, orejas, ojos y bocas) para animarlas. |
| Guion | `escena/guion.js` | Una sola línea de tiempo de GSAP (`escena/vendor/gsap.min.js`, copiado de `node_modules`) con las 7 escenas y la lista de eventos de sonido (`window.__EVENTOS`). |
| Render | `render.mjs` | Abre Edge sin interfaz por CDP, llama `window.__seek(t)` en cada cuadro, captura la pantalla y se la pasa a ffmpeg. No graba en tiempo real. |
| Audio | `audio.py` | Con numpy y scipy, a partir de `salida/eventos.json`: música a 116 BPM (marimba, bajo, bombo, palmas, maraca y glockenspiel; Do – Sol – La m – Fa) y efectos (pop, whoosh, clic, destellos, ding, confeti, conteo, salto y blips de Pardo). La música baja 7 dB mientras hay globos. |
| Armado | `armar.py` | Normaliza el audio a −16 LUFS con pico de −1,5 dBTP (`loudnorm` en dos pasadas), lo codifica en AAC a 192 kbps, genera el MP4 H.264 `yuv420p` con `+faststart` y saca el póster y la hoja de contacto. |
| Capturas extra | `herramientas/capturar.mjs` | Capturas a `deviceScaleFactor` 2 de la demo (https://demovanessa.ejaniot.com), solo navegando: Por calificar, constructor del curso, estadísticas, alertas, simulacros y «Mis hijos» en el celular. Quedan en `escena/capturas/`. Las otras capturas vienen de `public/capturas/`. |

## Cómo volver a renderizar

Desde esta carpeta (`motion/`), con Node, Python (`py`, con numpy, scipy y Pillow), Edge y ffmpeg:

```
node render.mjs eventos        # 1. salida/eventos.json (tiempos de la animación)
py audio.py                    # 2. salida/mezcla.wav
node render.mjs video 60       # 3. salida/video-sin-audio.mp4 (unos 10 a 15 minutos)
py armar.py                    # 4. ../revision/motion/pardo-presenta.mp4, póster y hoja de contacto
```

### Versión vertical para celular (1080 × 1920)

Es la misma escena con otra composición (`index.html?formato=vertical`): mismo guion, mismos textos, mismos tiempos y la misma lista de eventos de sonido, así que usa la misma mezcla de audio. Se le agrega `--vertical` a los pasos:

```
node render.mjs eventos --vertical   # salida/eventos-vertical.json (debe ser igual a eventos.json)
node render.mjs video 60 --vertical  # salida/video-sin-audio-vertical.mp4
py armar.py --vertical               # ../revision/motion/pardo-presenta-vertical.mp4, -poster.jpg y -contacto.jpg
```

- Si ya existe `salida/mezcla.wav`, no hace falta repetir `py audio.py`.
- En `escena/guion.js`, `L(horizontal, vertical)` elige el valor de cada posición; el horizontal no cambia. `BANDA` es el globo estándar del vertical (a la izquierda de Pardo, con cola a la derecha).
- Zonas seguras del vertical para Reels, TikTok y Estados: nada importante en los primeros 250 px ni en los últimos 350 px (Pardo termina en y = 1550).
- En vertical los globos van a 46 px y las píldoras, las fuentes y las notas de demo un poco más grandes (`html.vertical` en `estilos.css`).
- Revisar sin renderizar todo: `node render.mjs fotos 12 30.5 --vertical` (en `salida/fotos-vertical/`) o `node render.mjs mosaico 3 --vertical` y `py herramientas/mosaico.py salida/mosaico-vertical salida/mosaico-vertical.jpg 9 216`.

### Versión S3Media (19/10/2026)

Es el mismo video con dos cambios en el cierre: el WhatsApp pasa a 313 478 8263 y aparece «Una solución de» con el logo de S3Media (`escena/capturas/s3media.png`). Se activa con `index.html?marca=s3media`. Los tiempos y los sonidos no cambian, así que usa la misma mezcla. No reemplaza al video de la landing: se entrega aparte.

```
node render.mjs video 60 --s3media              # salida/video-sin-audio-s3media.mp4
py armar.py --s3media                           # ../revision/motion/pardo-presenta-s3media.mp4
node render.mjs video 60 --s3media --vertical   # salida/video-sin-audio-s3media-vertical.mp4
py armar.py --s3media --vertical                # ../revision/motion/pardo-presenta-s3media-vertical.mp4
```

### Revisión

- Para revisar sin renderizar todo: `node render.mjs fotos 12 30.5` (cuadros sueltos en `salida/fotos/`) o `node render.mjs mosaico 3` (un cuadro cada 3 s) y luego `py herramientas/mosaico.py salida/mosaico salida/mosaico.jpg`.
- Para verlo en vivo en el navegador, con el servidor que levanta `render.mjs` o con cualquier servidor estático en la raíz de la landing: `/motion/escena/index.html?play` o `?t=23.5` para quedarse en un segundo.
- ffmpeg se busca en `C:/Users/esteb/Downloads/ffmpeg-7.1.1-essentials_build/bin/ffmpeg`; se cambia con la variable `FFMPEG`.
- `render.mjs` usa un servidor local en `127.0.0.1:4710` y Edge con depuración en el puerto 9350. Los dos se cierran al terminar.
- `salida/` es de trabajo y no se sube (`.gitignore`).

## Cómo cambiar algo

- **Textos, tiempos y posiciones:** en `escena/guion.js`, cada escena tiene su bloque. Los globos se escriben con `globo(t, 'texto con **resaltado**', { x, y, hasta })`. Si un globo queda muy corto para leerlo, `render.mjs` lo avisa en «AVISOS».
- **Si cambian los tiempos**, hay que repetir los 4 pasos: el audio sale de los mismos eventos.
- **Capturas nuevas:** `node herramientas/capturar.mjs`. Lee las cuentas de `V:/proyectos/Vanessa2/CUENTAS_DEMO_VANESSA.md` sin imprimir las claves y no guarda nada en la demo.

## Cifras y datos que aparecen

- «50 % de los estudiantes lleva una maleta de más del 15 % de su peso»: estudio de la Universidad CES, reportado por El Universal (febrero de 2025).
- «$976.300, paquete de 15 textos de primaria por estudiante en un colegio de Bucaramanga, 2026»: Circular 004 de 2026 de Comfenalco Santander (se presenta como ejemplo).
- Los números de las pantallas (60 estudiantes, 17 días de racha, simulacros, etc.) son del colegio demo «Los Leopardos» y se rotulan así.
- El quiz de la pizza con nota 5,0 es una recreación con los datos de ejemplo de la landing y lleva la nota «Recreación con datos de ejemplo». El mensaje de WhatsApp es ilustrativo y no tiene cifras.
