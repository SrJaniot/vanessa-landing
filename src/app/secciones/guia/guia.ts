import { AfterViewInit, Component, Input, OnDestroy, computed, effect, signal, untracked } from '@angular/core';
import { Contenido, MensajeGuia } from '../../Modelos/contenido.model';

//PARDO GUIA: FLOTA ABAJO A LA DERECHA Y CAMBIA DE ESTADO Y DE GLOBO SEGUN LA SECCION QUE SE ESTA LEYENDO
//NO APARECE EN LA PORTADA (AHI YA ESTA EL PARDO GRANDE). EL GLOBO SALE AL CAMBIAR DE SECCION Y SE RECOGE SOLO
//A LOS POCOS SEGUNDOS PARA NO TAPAR EL CONTENIDO. TOCAR A PARDO LO ABRE O LO CIERRA
@Component({
  selector: 'app-guia',
  standalone: false,
  template: `
    @if (visible()) {
      <aside class="fixed z-40 right-3 bottom-3 sm:right-5 sm:bottom-5 flex items-end gap-2 pointer-events-none" [attr.aria-label]="c.guia.nombre">
        @if (globoAbierto()) {
          @for (m of [mensaje()]; track m.texto) {
            <div class="pointer-events-auto relative globo globo-derecha !text-[13.5px] sm:!text-[15px] max-w-[200px] sm:max-w-[260px] mb-7 animate-[globo-pop_.35s_ease-out]" aria-live="polite">
              {{ m.texto }}
              <button type="button" (click)="globoAbierto.set(false)" class="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-tinta text-papel grid place-items-center cursor-pointer" [attr.aria-label]="c.guia.ocultar">
                <app-icono nombre="cerrar" [tamano]="14" [grosor]="3" />
              </button>
            </div>
          }
        }
        <button type="button" (click)="alternar()" class="pointer-events-auto cursor-pointer bg-transparent border-0 p-0 drop-shadow-[0_10px_14px_rgb(31_42_68/.3)] transition-transform hover:scale-105"
          [attr.aria-label]="globoAbierto() ? c.guia.ocultar : c.guia.mostrar" [attr.aria-expanded]="globoAbierto()">
          <app-pardo [estado]="mensaje().estado" [tamano]="tamano" [mirar]="true" />
        </button>
      </aside>
    }
  `,
})
export class Guia implements AfterViewInit, OnDestroy {
  @Input({ required: true }) c!: Contenido;

  seccion = signal('portada');
  globoAbierto = signal(true);
  visible = computed(() => this.seccion() !== 'portada');
  mensaje = computed<MensajeGuia>(() => this.c.guia.mensajes[this.seccion()] ?? this.c.guia.mensajes['portada']);
  tamano = window.innerWidth < 640 ? 70 : 96;
  private observador?: IntersectionObserver;
  private temporizador: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      this.seccion();
      untracked(() => this.mostrarUnRato());
    });
  }

  private mostrarUnRato(): void {
    this.globoAbierto.set(true);
    if (this.temporizador) clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => this.globoAbierto.set(false), window.innerWidth < 640 ? 3500 : 6000);
  }

  alternar(): void {
    if (this.temporizador) clearTimeout(this.temporizador);
    this.globoAbierto.set(!this.globoAbierto());
  }

  ngAfterViewInit(): void {

    if (typeof IntersectionObserver === 'undefined') return;
    //UNA SECCION ES "LA ACTUAL" CUANDO CRUZA LA FRANJA DEL MEDIO DE LA PANTALLA
    this.observador = new IntersectionObserver(entradas => {
      for (const e of entradas) {
        if (e.isIntersecting) {
          const id = (e.target as HTMLElement).id;
          this.seccion.set(id === 'inicio' ? 'portada' : id);
        }
      }
    }, { rootMargin: '-45% 0px -50% 0px' });
    setTimeout(() => {
      document.querySelectorAll('section[id]').forEach(s => this.observador?.observe(s));
    });
  }

  ngOnDestroy(): void {
    this.observador?.disconnect();
    if (this.temporizador) clearTimeout(this.temporizador);
  }
}
