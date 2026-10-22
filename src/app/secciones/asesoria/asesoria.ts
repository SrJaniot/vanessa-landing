import { Component, Input } from '@angular/core';
import { Contenido } from '../../Modelos/contenido.model';
import { SeccionBase } from '../seccion-base';

//ASESORIA: CORREOS Y TELEFONOS DE LOS ASESORES (ESCRIBIR, LLAMAR O ABRIR WHATSAPP)
@Component({
  selector: 'app-asesoria',
  standalone: false,
  template: `
    <section id="asesoria" tabindex="-1" class="seccion bg-hoja">
      <div class="contenedor">
        <div class="text-center max-w-[760px] mx-auto">
          <span data-aparecer class="etiqueta-seccion">{{ c.etiqueta }}</span>
          <h2 data-aparecer class="titulo-seccion">{{ c.titulo }}</h2>
          <p data-aparecer class="texto-seccion mx-auto">{{ c.texto }}</p>
        </div>
        <div class="grid md:grid-cols-2 gap-6 max-w-[980px] mx-auto mt-12">
          <div data-aparecer class="card p-6 sm:p-7">
            <div class="flex items-center gap-3">
              <span class="w-12 h-12 rounded-full bg-sello-suave text-sello grid place-items-center shrink-0"><app-icono nombre="correo" [tamano]="24" /></span>
              <h3 class="text-[21px] m-0">{{ c.correosTitulo }}</h3>
            </div>
            <ul class="list-none p-0 mt-5 mb-0 grid gap-3">
              @for (co of c.correos; track co) {
                <li>
                  <a [href]="'mailto:' + co + '?subject=' + asunto" class="flex items-center gap-3 min-h-[52px] px-4 rounded-2xl border border-linea font-bold text-tinta hover:border-sello hover:text-sello transition-colors">
                    <app-icono nombre="correo" [tamano]="18" class="shrink-0 text-sello" />
                    <span class="min-w-0 py-2 leading-snug"><span class="inline-block">{{ co.split('@')[0] }}</span><span class="inline-block">&#64;{{ co.split('@')[1] }}</span></span>
                  </a>
                </li>
              }
            </ul>
          </div>
          <div data-aparecer class="card p-6 sm:p-7">
            <div class="flex items-center gap-3">
              <span class="w-12 h-12 rounded-full bg-[#DFF5E8] text-[#1B7A4A] grid place-items-center shrink-0"><app-icono nombre="whatsapp" [tamano]="24" /></span>
              <h3 class="text-[21px] m-0">{{ c.telefonosTitulo }}</h3>
            </div>
            <ul class="list-none p-0 mt-5 mb-0 grid gap-3">
              @for (t of c.telefonos; track t.numero) {
                <li class="flex flex-wrap items-center justify-between gap-3 min-h-[52px] pl-4 pr-2 py-2 rounded-2xl border border-linea">
                  <span class="font-titulo font-semibold text-[21px] text-tinta whitespace-nowrap">{{ t.texto }}</span>
                  <span class="flex gap-2">
                    <a [href]="'https://wa.me/' + t.numero + '?text=' + mensaje" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-xl bg-[#1B7A4A] text-white font-bold text-[15px] hover:brightness-110" [attr.aria-label]="c.whatsapp + ' ' + t.texto">
                      <app-icono nombre="whatsapp" [tamano]="18" /> {{ c.whatsapp }}
                    </a>
                    <a [href]="'tel:+' + t.numero" class="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-xl bg-sello-suave text-sello font-bold text-[15px] hover:brightness-95" [attr.aria-label]="c.llamar + ' ' + t.texto">
                      <app-icono nombre="telefono" [tamano]="18" /> {{ c.llamar }}
                    </a>
                  </span>
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Asesoria extends SeccionBase {
  @Input({ required: true }) c!: Contenido['asesoria'];

  get asunto(): string {
    return encodeURIComponent(this.c.asuntoCorreo);
  }

  get mensaje(): string {
    return encodeURIComponent(this.c.mensajeWhatsapp);
  }
}
