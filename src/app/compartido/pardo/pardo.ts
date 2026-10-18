import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

export type EstadoPardo = 'saluda' | 'celebra' | 'anima' | 'piensa' | 'lee';

//PARDO: LA MASCOTA DE VANESSA. UN CACHORRO DE LEOPARDO TIERNO (POR "LOS LEOPARDOS" DE BUCARAMANGA) CON SU MORRAL ESCOLAR
//estado: saluda (MANO ARRIBA), celebra (BRAZOS ARRIBA Y ESTRELLAS), anima (PUÑO DE ANIMO), piensa (MANO EN LA BARBILLA Y "?"), lee (LIBRO ABIERTO)
//tamano: ALTO EN PX (EL ANCHO SE CALCULA CON LA PROPORCION 200 x 220). CON "REDUCIR MOVIMIENTO" NO SE ANIMA
//LOS COLORES SON FIJOS: EL DIBUJO SE VE IGUAL EN CLARO Y EN OSCURO
//COPIA EXACTA DEL DIBUJO DE LA PLATAFORMA (frontend/vanessa2/src/app/compartido/pardo/pardo.ts). LO PROPIO DE LA LANDING:
//  mirar: LOS OJOS SIGUEN EL PUNTERO (UNOS PIXELES). cara: SOLO LA CABEZA (LOGO Y BARRA). vivo: FLOTA SUAVE
@Component({
  selector: 'app-pardo',
  standalone: false,
  template: `
    <svg [attr.viewBox]="cara ? '36 24 128 114' : '0 0 200 220'" [attr.width]="ancho" [attr.height]="tamano" role="img" [attr.aria-label]="descripcion" [attr.class]="'pardo pardo-' + estado + (vivo ? ' pardo-vivo' : '')">
      <!-- COLA, MORRAL, PIES, CUERPO Y TIRAS DEL MORRAL -->
      <g>
        <path d="M136 190 C 166 194, 182 170, 170 146" fill="none" stroke="#7A4B12" stroke-width="15" stroke-linecap="round"/>
        <path d="M136 190 C 166 194, 182 170, 170 146" fill="none" stroke="#F7B733" stroke-width="9.5" stroke-linecap="round"/>
        <circle cx="170" cy="147" r="5" fill="#9A5B16"/>
        <rect x="50" y="132" width="100" height="62" rx="20" fill="#2F7FE0" stroke="#1D4F94" stroke-width="3"/>
        <ellipse cx="80" cy="203" rx="17" ry="11" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
        <ellipse cx="120" cy="203" rx="17" ry="11" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
        <path d="M76 207 v-4 M84 207 v-4 M116 207 v-4 M124 207 v-4" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>
        <ellipse cx="100" cy="166" rx="40" ry="39" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
        <ellipse cx="100" cy="174" rx="23" ry="25" fill="#FFF2D6"/>
        <circle cx="70" cy="158" r="5" fill="#E39A2A" stroke="#9A5B16" stroke-width="2.4" stroke-dasharray="8.0 3.8"/>
        <circle cx="130" cy="158" r="5" fill="#E39A2A" stroke="#9A5B16" stroke-width="2.4" stroke-dasharray="8.0 3.8"/>
        <circle cx="74" cy="184" r="4" fill="#E39A2A" stroke="#9A5B16" stroke-width="2.4" stroke-dasharray="6.4 3.0"/>
        <circle cx="126" cy="184" r="4" fill="#E39A2A" stroke="#9A5B16" stroke-width="2.4" stroke-dasharray="6.4 3.0"/>
        <path d="M77 136 C 73 152, 72 168, 75 186" fill="none" stroke="#1D4F94" stroke-width="9" stroke-linecap="round"/>
        <path d="M77 136 C 73 152, 72 168, 75 186" fill="none" stroke="#2F7FE0" stroke-width="5.5" stroke-linecap="round"/>
        <path d="M123 136 C 127 152, 128 168, 125 186" fill="none" stroke="#1D4F94" stroke-width="9" stroke-linecap="round"/>
        <path d="M123 136 C 127 152, 128 168, 125 186" fill="none" stroke="#2F7FE0" stroke-width="5.5" stroke-linecap="round"/>
        <rect x="69" y="160" width="9" height="7" rx="2" fill="#FFC531" stroke="#C98A00" stroke-width="1.5"/>
        <rect x="122" y="160" width="9" height="7" rx="2" fill="#FFC531" stroke="#C98A00" stroke-width="1.5"/>
      </g>
      <!-- BRAZOS QUE VAN DETRAS DE LA CABEZA -->
      @if (!cara) {
      @switch (estado) {
        @case ('celebra') {
        <g class="pardo-brazos">
        <path d="M70 142 Q42 134 34 108" fill="none" stroke="#7A4B12" stroke-width="21" stroke-linecap="round"/>
        <path d="M70 142 Q42 134 34 108" fill="none" stroke="#F7B733" stroke-width="15" stroke-linecap="round"/>
        <circle cx="33" cy="102" r="11" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
        <path d="M29 108 v3 M33 109 v3 M37 108 v3" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M130 142 Q158 134 166 108" fill="none" stroke="#7A4B12" stroke-width="21" stroke-linecap="round"/>
        <path d="M130 142 Q158 134 166 108" fill="none" stroke="#F7B733" stroke-width="15" stroke-linecap="round"/>
        <circle cx="167" cy="102" r="11" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
        <path d="M163 108 v3 M167 109 v3 M171 108 v3" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>
        </g>
        }
        @case ('anima') {
        <path d="M70 142 Q58 158 64 174" fill="none" stroke="#7A4B12" stroke-width="21" stroke-linecap="round"/>
        <path d="M70 142 Q58 158 64 174" fill="none" stroke="#F7B733" stroke-width="15" stroke-linecap="round"/>
        <circle cx="64" cy="175" r="9.5" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
        <path d="M60 179.5 v3 M64 180.5 v3 M68 179.5 v3" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>
        <g class="pardo-puno">
        <path d="M130 142 Q162 150 158 124" fill="none" stroke="#7A4B12" stroke-width="21" stroke-linecap="round"/>
        <path d="M130 142 Q162 150 158 124" fill="none" stroke="#F7B733" stroke-width="15" stroke-linecap="round"/>
        <circle cx="158" cy="118" r="12" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
        <path d="M151 114 h10 M151 119 h10" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>
        </g>
        <path d="M176 104 l8 -5 M179 118 h9 M174 131 l8 4" stroke="#FF6F59" stroke-width="3" stroke-linecap="round"/>
        }
        @case ('piensa') {
        <path d="M70 142 Q58 158 64 174" fill="none" stroke="#7A4B12" stroke-width="21" stroke-linecap="round"/>
        <path d="M70 142 Q58 158 64 174" fill="none" stroke="#F7B733" stroke-width="15" stroke-linecap="round"/>
        <circle cx="64" cy="175" r="9.5" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
        <path d="M60 179.5 v3 M64 180.5 v3 M68 179.5 v3" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>
        }
        @case ('lee') {}
        @default {
        <path d="M70 142 Q58 158 64 174" fill="none" stroke="#7A4B12" stroke-width="21" stroke-linecap="round"/>
        <path d="M70 142 Q58 158 64 174" fill="none" stroke="#F7B733" stroke-width="15" stroke-linecap="round"/>
        <circle cx="64" cy="175" r="9.5" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
        <path d="M60 179.5 v3 M64 180.5 v3 M68 179.5 v3" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>
        <g class="pardo-mano">
        <path d="M130 142 Q158 134 166 108" fill="none" stroke="#7A4B12" stroke-width="21" stroke-linecap="round"/>
        <path d="M130 142 Q158 134 166 108" fill="none" stroke="#F7B733" stroke-width="15" stroke-linecap="round"/>
        <circle cx="167" cy="102" r="11" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
        <path d="M163 108 v3 M167 109 v3 M171 108 v3" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>
        </g>
        }
      }
      }
      <!-- OREJAS, CABEZA, MANCHAS Y HOCICO -->
      <g>
        <circle cx="60" cy="46" r="17" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
        <circle cx="140" cy="46" r="17" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
        <circle cx="61" cy="48" r="8.5" fill="#FFB49C"/>
        <circle cx="139" cy="48" r="8.5" fill="#FFB49C"/>
        <ellipse cx="100" cy="86" rx="55" ry="49" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
        <circle cx="91" cy="50" r="3.6" fill="#9A5B16"/>
        <circle cx="100" cy="45" r="4" fill="#9A5B16"/>
        <circle cx="109" cy="50" r="3.6" fill="#9A5B16"/>
        <circle cx="59" cy="84" r="4.5" fill="#E39A2A" stroke="#9A5B16" stroke-width="2.4" stroke-dasharray="7.2 3.4"/>
        <circle cx="141" cy="84" r="4.5" fill="#E39A2A" stroke="#9A5B16" stroke-width="2.4" stroke-dasharray="7.2 3.4"/>
        <circle cx="64" cy="66" r="2.6" fill="#9A5B16"/>
        <circle cx="136" cy="66" r="2.6" fill="#9A5B16"/>
        <circle cx="57" cy="100" r="2" fill="#9A5B16"/>
        <circle cx="143" cy="100" r="2" fill="#9A5B16"/>
        <ellipse cx="100" cy="110" rx="25" ry="17" fill="#FFF2D6"/>
      </g>
      <!-- OJOS (EN UN GRUPO QUE SE MUEVE CON EL PUNTERO) -->
      <g #mirada class="pardo-mirada">
      @switch (estado) {
        @case ('piensa') {
        <g class="pardo-ojos">
        <ellipse cx="78" cy="83" rx="10.5" ry="12.5" fill="#2A2233"/>
        <ellipse cx="122" cy="83" rx="10.5" ry="12.5" fill="#2A2233"/>
        <circle cx="77" cy="77.5" r="4.2" fill="#fff"/>
        <circle cx="121" cy="77.5" r="4.2" fill="#fff"/>
        <circle cx="82.75" cy="88" r="1.9" fill="#fff"/>
        <circle cx="126.75" cy="88" r="1.9" fill="#fff"/>
        </g>
        <path d="M112 66 Q122 60 132 65" fill="none" stroke="#7A4B12" stroke-width="2.6" stroke-linecap="round"/>
        }
        @case ('lee') {
        <g class="pardo-ojos">
        <ellipse cx="78" cy="88" rx="10.5" ry="12.5" fill="#2A2233"/>
        <ellipse cx="122" cy="88" rx="10.5" ry="12.5" fill="#2A2233"/>
        <circle cx="74.5" cy="90" r="4.2" fill="#fff"/>
        <circle cx="118.5" cy="90" r="4.2" fill="#fff"/>
        <circle cx="81.5" cy="93" r="1.9" fill="#fff"/>
        <circle cx="125.5" cy="93" r="1.9" fill="#fff"/>
        </g>
        }
        @default {
        <g class="pardo-ojos">
        <ellipse cx="78" cy="85" rx="10.5" ry="12.5" fill="#2A2233"/>
        <ellipse cx="122" cy="85" rx="10.5" ry="12.5" fill="#2A2233"/>
        <circle cx="74.5" cy="81" r="4.2" fill="#fff"/>
        <circle cx="118.5" cy="81" r="4.2" fill="#fff"/>
        <circle cx="81.5" cy="90" r="1.9" fill="#fff"/>
        <circle cx="125.5" cy="90" r="1.9" fill="#fff"/>
        </g>
        }
      }
      </g>
      <!-- MEJILLAS Y NARIZ -->
      <ellipse cx="64" cy="106" rx="8.5" ry="5.5" fill="#FF8E7A" opacity=".5"/>
        <ellipse cx="136" cy="106" rx="8.5" ry="5.5" fill="#FF8E7A" opacity=".5"/>
        <path d="M92.5 101 Q100 97 107.5 101 Q105 107 100 108.5 Q95 107 92.5 101 Z" fill="#5A3325"/>
        <ellipse cx="97.5" cy="101.5" rx="2.2" ry="1.2" fill="#fff" opacity=".55"/>
      <!-- BOCA -->
      @switch (estado) {
        @case ('celebra') {
        <path d="M100 108.5 v3" stroke="#5A3325" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M89 112 Q100 112 111 112 Q109 126 100 126 Q91 126 89 112 Z" fill="#8E2F3A" stroke="#5A3325" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M93.5 121 Q100 116 106.5 121 Q104 125.5 100 125.5 Q96 125.5 93.5 121 Z" fill="#FF8E9A"/>
        }
        @case ('anima') {
        <path d="M100 108.5 v3" stroke="#5A3325" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M89 112 Q100 112 111 112 Q109 126 100 126 Q91 126 89 112 Z" fill="#8E2F3A" stroke="#5A3325" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M93.5 121 Q100 116 106.5 121 Q104 125.5 100 125.5 Q96 125.5 93.5 121 Z" fill="#FF8E9A"/>
        }
        @case ('piensa') {
        <path d="M100 108.5 v3.5" stroke="#5A3325" stroke-width="2.4" stroke-linecap="round"/>
        <ellipse cx="103" cy="117" rx="3.6" ry="3" fill="#8E2F3A" stroke="#5A3325" stroke-width="2"/>
        }
        @default {
        <path d="M100 108.5 v3.5 M89 112 Q94.5 119 100 112 Q105.5 119 111 112" fill="none" stroke="#5A3325" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        }
      }
      <!-- LO QUE VA DELANTE: MANO EN LA BARBILLA, LIBRO O ESTRELLAS -->
      @if (!cara) {
      @switch (estado) {
        @case ('piensa') {
        <path d="M130 144 Q144 136 128 131" fill="none" stroke="#7A4B12" stroke-width="21" stroke-linecap="round"/>
        <path d="M130 144 Q144 136 128 131" fill="none" stroke="#F7B733" stroke-width="15" stroke-linecap="round"/>
        <circle cx="126" cy="131" r="10" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
        <path d="M122 136 v3 M126 137 v3 M130 136 v3" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="150" cy="58" r="3.5" fill="#fff" stroke="#8B6CEF" stroke-width="2.5"/>
        <circle cx="160" cy="44" r="5" fill="#fff" stroke="#8B6CEF" stroke-width="2.5"/>
        <circle cx="178" cy="22" r="16" fill="#fff" stroke="#8B6CEF" stroke-width="3"/>
        <path d="M172.5 17 Q172.5 11 178 11 Q184 11 184 16.5 Q184 20.5 178.5 22.5 V25.5" fill="none" stroke="#8B6CEF" stroke-width="3.2" stroke-linecap="round"/>
        <circle cx="178.5" cy="31" r="2.1" fill="#8B6CEF"/>
        }
        @case ('lee') {
        <path d="M70 142 Q60 158 70 172" fill="none" stroke="#7A4B12" stroke-width="21" stroke-linecap="round"/>
        <path d="M70 142 Q60 158 70 172" fill="none" stroke="#F7B733" stroke-width="15" stroke-linecap="round"/>
        <path d="M130 142 Q140 158 130 172" fill="none" stroke="#7A4B12" stroke-width="21" stroke-linecap="round"/>
        <path d="M130 142 Q140 158 130 172" fill="none" stroke="#F7B733" stroke-width="15" stroke-linecap="round"/>
        <path d="M100 160 Q80 151 58 155 L58 190 Q80 186 100 194 Q120 186 142 190 L142 155 Q120 151 100 160 Z" fill="#2F7FE0" stroke="#1D4F94" stroke-width="3" stroke-linejoin="round"/>
        <path d="M100 158 Q82 150 63 153 L63 185 Q82 181 100 189 Z" fill="#fff" stroke="#1D4F94" stroke-width="2" stroke-linejoin="round"/>
        <path d="M100 158 Q118 150 137 153 L137 185 Q118 181 100 189 Z" fill="#fff" stroke="#1D4F94" stroke-width="2" stroke-linejoin="round"/>
        <path d="M70 162 q13 -2 24 3 M70 170 q13 -2 24 3 M106 165 q11 -5 24 -3 M106 173 q11 -5 24 -3" fill="none" stroke="#9BBDEB" stroke-width="2" stroke-linecap="round"/>
        <circle cx="63" cy="172" r="9.5" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
        <path d="M59 176.5 v3 M63 177.5 v3 M67 176.5 v3" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="137" cy="172" r="9.5" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
        <path d="M133 176.5 v3 M137 177.5 v3 M141 176.5 v3" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>
        }
        @case ('celebra') {
        <polygon class="pardo-brillo" points="18.0,56.0 20.6,62.4 27.5,62.9 22.3,67.4 23.9,74.1 18.0,70.5 12.1,74.1 13.7,67.4 8.5,62.9 15.4,62.4" fill="#FFC531" stroke="#C98A00" stroke-width="2" stroke-linejoin="round"/>
        <polygon class="pardo-brillo" points="182.0,56.0 184.6,62.4 191.5,62.9 186.3,67.4 187.9,74.1 182.0,70.5 176.1,74.1 177.7,67.4 172.5,62.9 179.4,62.4" fill="#FFC531" stroke="#C98A00" stroke-width="2" stroke-linejoin="round"/>
        <polygon class="pardo-brillo" points="40.0,17.0 41.9,21.5 46.7,21.8 43.0,25.0 44.1,29.7 40.0,27.1 35.9,29.7 37.0,25.0 33.3,21.8 38.1,21.5" fill="#FFC531" stroke="#C98A00" stroke-width="2" stroke-linejoin="round"/>
        <polygon class="pardo-brillo" points="160.0,12.0 162.1,17.1 167.6,17.5 163.4,21.1 164.7,26.5 160.0,23.6 155.3,26.5 156.6,21.1 152.4,17.5 157.9,17.1" fill="#FFC531" stroke="#C98A00" stroke-width="2" stroke-linejoin="round"/>
        <circle class="pardo-brillo" cx="14" cy="36" r="3" fill="#FF6F59"/>
        <circle class="pardo-brillo" cx="188" cy="40" r="3" fill="#2FAE6B"/>
        <circle class="pardo-brillo" cx="100" cy="12" r="3" fill="#8B6CEF"/>
        <circle class="pardo-brillo" cx="184" cy="96" r="2.6" fill="#2F7FE0"/>
        }
      }
      }
    </svg>
  `,
  styles: [`
    :host { display: inline-block; line-height: 0; }
    .pardo-ojos { transform-box: fill-box; transform-origin: center; animation: pardo-parpadeo 5s infinite; }
    .pardo-saluda .pardo-mano { transform-box: view-box; transform-origin: 130px 142px; animation: pardo-saludar 1.2s ease-in-out .3s 3; }
    .pardo-celebra .pardo-brazos { transform-box: view-box; transform-origin: 100px 150px; animation: pardo-saltar .7s ease-in-out infinite alternate; }
    .pardo-celebra .pardo-brillo { transform-box: fill-box; transform-origin: center; animation: pardo-brillar 1.4s ease-in-out infinite; }
    .pardo-anima .pardo-puno { transform-box: view-box; transform-origin: 130px 142px; animation: pardo-puno .9s ease-in-out .2s 3; }
    @keyframes pardo-parpadeo { 0%, 94%, 100% { transform: scaleY(1); } 97% { transform: scaleY(.1); } }
    @keyframes pardo-saludar { 0%, 100% { transform: rotate(0); } 30% { transform: rotate(-14deg); } 70% { transform: rotate(8deg); } }
    @keyframes pardo-saltar { from { transform: translateY(0); } to { transform: translateY(-4px); } }
    @keyframes pardo-brillar { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(.7); opacity: .6; } }
    .pardo-vivo { animation: pardo-flotar 3.4s ease-in-out infinite; }
    .pardo-mirada { transition: transform .25s ease-out; }
    @keyframes pardo-flotar { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes pardo-puno { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-10deg); } }
    @media (prefers-reduced-motion: reduce) {
      .pardo-ojos, .pardo-mano, .pardo-brazos, .pardo-brillo, .pardo-puno, .pardo-vivo { animation: none !important; }
      .pardo-mirada { transition: none; }
    }
  `],
})
export class Pardo implements AfterViewInit, OnDestroy {
  @Input() estado: EstadoPardo = 'saluda';
  @Input() tamano = 120;
  @Input() cara = false;
  @Input() mirar = false;
  @Input() vivo = false;

  @ViewChild('mirada') mirada?: ElementRef<SVGGElement>;
  private alMover = (e: PointerEvent) => this.seguir(e);
  private pendiente = false;

  constructor(private host: ElementRef<HTMLElement>) { }

  get ancho(): number {
    return this.cara ? Math.round(this.tamano * 128 / 114) : Math.round(this.tamano * 200 / 220);
  }

  get descripcion(): string {
    const textos: Record<EstadoPardo, string> = {
      saluda: 'saludando con la mano',
      celebra: 'celebrando con los brazos arriba',
      anima: 'dándote ánimo con el puño arriba',
      piensa: 'pensando con la mano en la barbilla',
      lee: 'leyendo un libro',
    };
    if (this.cara) return 'Pardo, la mascota de Vanessa';
    return 'Pardo, la mascota, ' + (textos[this.estado] ?? textos.saluda);
  }

  ngAfterViewInit(): void {
    if (!this.mirar) return;
    let reducir = false;
    try { reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { reducir = false; }
    if (!reducir) window.addEventListener('pointermove', this.alMover, { passive: true });
  }

  ngOnDestroy(): void {
    window.removeEventListener('pointermove', this.alMover);
  }

  //LOS OJOS SE CORREN HASTA 3.5 PX HACIA EL PUNTERO (SIN DETECCION DE CAMBIOS: SE TOCA EL SVG DIRECTO)
  private seguir(e: PointerEvent): void {
    if (this.pendiente) return;
    this.pendiente = true;
    requestAnimationFrame(() => {
      this.pendiente = false;
      const g = this.mirada?.nativeElement;
      if (!g) return;
      const r = this.host.nativeElement.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * (this.cara ? .5 : .38);
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 300) * 3.5;
      g.style.transform = `translate(${(dx / d * k).toFixed(2)}px, ${(dy / d * k).toFixed(2)}px)`;
    });
  }
}
