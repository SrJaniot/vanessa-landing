# HOJA DE CONTACTO: UNE LOS CUADROS DE UNA CARPETA EN UNA REJILLA CON SU TIEMPO
# USO: py herramientas/mosaico.py <carpeta> <salida.jpg> [columnas] [ancho_celda]
import sys, glob, os
from PIL import Image, ImageDraw, ImageFont
carpeta, salida = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4
w = int(sys.argv[4]) if len(sys.argv) > 4 else 480
fs = sorted(glob.glob(os.path.join(carpeta, '*.png')) + glob.glob(os.path.join(carpeta, '*.jpg')))
# ALTO DE CADA CELDA SEGUN LA PROPORCION DE LOS CUADROS (16:9 EN HORIZONTAL, 9:16 EN VERTICAL)
w0, h0 = Image.open(fs[0]).size
h = w * h0 // w0
filas = (len(fs) + cols - 1) // cols
m = Image.new('RGB', (cols * (w + 8) + 8, filas * (h + 34) + 8), (40, 44, 58))
d = ImageDraw.Draw(m)
try: f = ImageFont.truetype('arial.ttf', 20)
except Exception: f = ImageFont.load_default()
for i, p in enumerate(fs):
    x, y = 8 + (i % cols) * (w + 8), 8 + (i // cols) * (h + 34)
    m.paste(Image.open(p).convert('RGB').resize((w, h), Image.LANCZOS), (x, y + 26))
    d.text((x, y + 2), os.path.splitext(os.path.basename(p))[0].lstrip('t').lstrip('0') + ' s', fill=(255, 255, 255), font=f)
m.save(salida, quality=88)
print(salida, m.size)
