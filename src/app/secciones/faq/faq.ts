import { Component, Input } from '@angular/core';
import { Contenido } from '../../Modelos/contenido.model';
import { SeccionBase } from '../seccion-base';

//PREGUNTAS FRECUENTES (OBJECIONES DEL RECTOR) CON <details>: ACCESIBLES Y SIN JAVASCRIPT
@Component({
  selector: 'app-faq',
  standalone: false,
  template: `
    <section id="preguntas" tabindex="-1" class="seccion">
      <div class="contenedor grid lg:grid-cols-[.75fr_1.25fr] gap-10 items-start">
        <div class="lg:sticky lg:top-28">
          <span data-aparecer class="etiqueta-seccion">{{ c.etiqueta }}</span>
          <h2 data-aparecer class="titulo-seccion">{{ c.titulo }}</h2>
          <div data-aparecer class="mt-6 hidden lg:block"><app-pardo estado="piensa" [tamano]="150" [mirar]="true" /></div>
        </div>
        <div class="grid gap-3">
          @for (f of c.items; track f.pregunta; let i = $index) {
            <details data-aparecer class="faq card overflow-hidden group" [open]="i === 0">
              <summary class="flex items-center justify-between gap-4 p-5 font-titulo font-semibold text-[19px] leading-snug hover:text-sello">
                <span>{{ f.pregunta }}</span>
                <span class="faq-signo w-9 h-9 rounded-full bg-sello-suave text-sello grid place-items-center shrink-0 transition-transform duration-300"><app-icono nombre="mas" [tamano]="18" [grosor]="2.6" /></span>
              </summary>
              <div class="px-5 pb-5 -mt-1 text-grafito">
                <p class="m-0">{{ f.respuesta }}</p>
                @if (f.fuentes?.length) {
                  <ul class="list-none p-0 mt-3 mb-0 grid gap-1 text-[13px]">
                    @for (fu of f.fuentes; track fu.url) {
                      <li><a [href]="fu.url" target="_blank" rel="noopener" class="text-sello underline underline-offset-2">{{ fu.nombre }}</a></li>
                    }
                  </ul>
                }
              </div>
            </details>
          }
        </div>
      </div>
    </section>
  `,
})
export class Faq extends SeccionBase {
  @Input({ required: true }) c!: Contenido['faq'];
}
