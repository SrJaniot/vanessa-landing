import { Component, Input, OnDestroy, computed, signal } from '@angular/core';
import { Contenido } from '../../Modelos/contenido.model';
import { CapturasService } from '../../servicios/capturas.service';

//SECCION DE VIDEO: SOLO MUESTRA LOS VIDEOS QUE ESTAN EN public/capturas/ Y EN capturas.json
//VARIOS VIDEOS (PARDO PRESENTA Y EL RECORRIDO): BOTONES PARA ELEGIR. EN CELULAR (<= 640 px) USA LA VERSION VERTICAL SI EXISTE
//EL <video> USA preload="metadata": SI DA ERROR (404) SE OCULTA EL MARCO
@Component({
  selector: 'app-video',
  standalone: false,
  template: `
    @if (opciones().length) {
    <section id="video" tabindex="-1" class="seccion !pt-0">
      <div class="contenedor text-center">
        <span class="etiqueta-seccion">{{ c.etiqueta }}</span>
        <h2 class="titulo-seccion">{{ c.titulo }}</h2>
        @if (opciones().length > 1) {
          <div role="group" [attr.aria-label]="c.etiqueta" class="mt-8 mx-auto inline-flex flex-wrap justify-center gap-2 p-2 rounded-[22px] bg-hoja border border-linea shadow-[var(--sombra)]">
            @for (o of opciones(); track o.archivo; let i = $index) {
              <button type="button" [attr.aria-pressed]="elegido() === i" (click)="elegir(i)"
                class="min-h-[48px] px-5 rounded-2xl font-extrabold text-[15px] transition-all duration-300 cursor-pointer leading-tight"
                [class]="elegido() === i ? 'bg-sello text-sobre-tinta shadow-[inset_0_-4px_0_rgb(0_0_0/.18)]' : 'text-grafito hover:bg-sello-suave hover:text-sello'">
                {{ o.nombre }}
              </button>
            }
          </div>
        }
        <div [hidden]="fallo()" class="mt-8 mx-auto rounded-[26px] overflow-hidden border-[6px] border-hoja shadow-[0_30px_60px_-30px_rgb(31_42_68/.6)] bg-[#1F2A44]"
          [class]="vertical() ? 'max-w-[380px]' : 'max-w-[960px]'">
          <video class="block w-full" controls preload="metadata" playsinline [class]="vertical() ? 'aspect-[9/16]' : 'aspect-video'"
            [src]="archivo()" [attr.poster]="poster()" [attr.aria-label]="actual().descripcion"
            (loadedmetadata)="fallo.set(false)" (error)="fallo.set(true)"></video>
        </div>
      </div>
    </section>
    }
  `,
})
export class Video implements OnDestroy {
  @Input({ required: true }) c!: Contenido['video'];
  elegido = signal(0);
  fallo = signal(false);
  private consulta = typeof matchMedia === 'function' ? matchMedia('(max-width: 640px)') : null;
  private celular = signal(this.consulta?.matches ?? false);
  private alCambiar = (e: MediaQueryListEvent) => this.celular.set(e.matches);

  opciones = computed(() => (this.c?.videos ?? []).filter(v => this.capturas.tiene(v.archivo)));
  actual = computed(() => this.opciones()[Math.min(this.elegido(), this.opciones().length - 1)]);
  vertical = computed(() => this.celular() && this.capturas.tiene(this.actual().archivoVertical));
  archivo = computed(() => this.vertical() ? this.actual().archivoVertical! : this.actual().archivo);
  poster = computed(() => {
    const p = this.vertical() ? this.actual().posterVertical : this.actual().poster;
    return this.capturas.tiene(p) ? p! : null;
  });

  constructor(public capturas: CapturasService) {
    this.consulta?.addEventListener('change', this.alCambiar);
  }

  elegir(i: number) {
    this.fallo.set(false);
    this.elegido.set(i);
  }

  ngOnDestroy() {
    this.consulta?.removeEventListener('change', this.alCambiar);
  }
}
