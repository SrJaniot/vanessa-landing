import { Component, Input } from '@angular/core';
import { Contenido } from '../../Modelos/contenido.model';
import { SeccionBase } from '../seccion-base';

//COMO EMPEZAMOS: LINEA DE TIEMPO DONDE PARDO BAJA SIGUIENDO EL SCROLL Y VA ENCENDIENDO CADA PASO
@Component({
  selector: 'app-empezamos',
  standalone: false,
  template: `
    <section id="empezamos" tabindex="-1" class="seccion bg-hoja">
      <div class="contenedor">
        <div class="text-center max-w-[760px] mx-auto">
          <span data-aparecer class="etiqueta-seccion">{{ c.etiqueta }}</span>
          <h2 data-aparecer class="titulo-seccion">{{ c.titulo }}</h2>
          <p data-aparecer class="texto-seccion mx-auto">{{ c.texto }}</p>
        </div>
        <div class="linea-tiempo relative max-w-[720px] mx-auto mt-14">
          <div class="absolute left-[27px] sm:left-[35px] top-2 bottom-2 w-[6px] rounded-full bg-linea" aria-hidden="true">
            <div class="linea-relleno absolute inset-x-0 top-0 h-full rounded-full bg-gradient-to-b from-acento-azul via-acento-verde to-acento-amarillo origin-top"></div>
          </div>
          <div class="pardo-camina absolute left-[-120px] top-0 z-10 hidden lg:block" aria-hidden="true">
            <app-pardo estado="anima" [tamano]="92" />
          </div>
          <ol class="grid gap-8 list-none p-0 m-0">
            @for (p of c.pasos; track p.titulo; let i = $index) {
              <li data-aparecer class="paso relative pl-[76px] sm:pl-[118px]">
                <span class="paso-num absolute left-0 sm:left-[8px] top-0 w-[60px] h-[60px] rounded-full grid place-items-center font-titulo font-semibold text-[24px] bg-sello text-sobre-tinta border-4 border-hoja shadow-[var(--sombra)]">{{ i + 1 }}</span>
                <div class="card p-5 sm:p-6">
                  <h3 class="text-[21px]">{{ p.titulo }}</h3>
                  <p class="text-grafito mt-1.5 mb-0">{{ p.texto }}</p>
                </div>
              </li>
            }
          </ol>
        </div>
      </div>
    </section>
  `,
})
export class Empezamos extends SeccionBase {
  @Input({ required: true }) c!: Contenido['empezamos'];

  protected override animaciones(gsap: any): void {
    const linea = this.host.nativeElement.querySelector('.linea-tiempo') as HTMLElement;
    const pardo = this.host.nativeElement.querySelector('.pardo-camina') as HTMLElement;
    gsap.from('.linea-relleno', { scaleY: 0, ease: 'none', scrollTrigger: { trigger: linea, start: 'top 60%', end: 'bottom 60%', scrub: .4 } });
    gsap.to(pardo, {
      y: () => linea.offsetHeight - pardo.offsetHeight, ease: 'none',
      scrollTrigger: { trigger: linea, start: 'top 60%', end: 'bottom 60%', scrub: .6, invalidateOnRefresh: true },
    });
    gsap.utils.toArray('.paso-num').forEach((n: Element) => {
      gsap.from(n, { scale: .5, autoAlpha: .3, duration: .5, ease: 'back.out(2)', scrollTrigger: { trigger: n, start: 'top 62%' } });
    });
  }
}
