import { Component, Input } from '@angular/core';
import { Contenido } from '../../Modelos/contenido.model';
import { SeccionBase } from '../seccion-base';

//SEGURIDAD Y DATOS: TARJETAS CON LO QUE CUIDA LA PLATAFORMA (LEY 1581, ROLES, RESPALDOS...)
@Component({
  selector: 'app-seguridad',
  standalone: false,
  template: `
    <section id="seguridad" tabindex="-1" class="seccion">
      <div class="contenedor grid lg:grid-cols-[.8fr_1.2fr] gap-10 items-start">
        <div class="lg:sticky lg:top-28">
          <span data-aparecer class="etiqueta-seccion">{{ c.etiqueta }}</span>
          <h2 data-aparecer class="titulo-seccion">{{ c.titulo }}</h2>
          <p data-aparecer class="texto-seccion">{{ c.texto }}</p>
          <div data-aparecer class="mt-6 hidden lg:block"><app-pardo estado="lee" [tamano]="150" [vivo]="true" /></div>
        </div>
        <ul class="grid sm:grid-cols-2 gap-4 list-none p-0">
          @for (it of c.items; track it.titulo; let i = $index) {
            <li data-aparecer class="card p-5" [class]="['acento-azul','acento-verde','acento-morado','acento-amarillo','acento-coral','acento-azul'][i % 6]">
              <span class="icono-acento w-12 h-12 rounded-2xl grid place-items-center"><app-icono [nombre]="it.icono" [tamano]="26" /></span>
              <h3 class="text-[19px] mt-3">{{ it.titulo }}</h3>
              <p class="text-grafito mt-1.5 mb-0 text-[15px]">{{ it.texto }}</p>
              @if (it.fuente) {
                <a [href]="it.fuente" target="_blank" rel="noopener" class="inline-block mt-2 text-[13px] text-sello underline underline-offset-2">{{ it.fuenteNombre || it.fuente }}</a>
              }
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class Seguridad extends SeccionBase {
  @Input({ required: true }) c!: Contenido['seguridad'];
}
