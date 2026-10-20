import { Component, Input } from '@angular/core';
import { Contenido } from '../../Modelos/contenido.model';
import { ContactoService } from '../../servicios/contacto.service';
import { SeccionBase } from '../seccion-base';

//CIERRE: PARDO CELEBRA, LLAMADO A LA ACCION (DEMOSTRACION Y CORREO) Y PIE DE PAGINA
@Component({
  selector: 'app-cierre',
  standalone: false,
  template: `
    <section id="cierre" tabindex="-1" class="relative overflow-hidden pt-24 pb-16 bg-gradient-to-b from-papel to-[var(--cielo)]">
      <div class="contenedor text-center relative">
        <div class="cierre-pardo inline-flex flex-col items-center">
          <p class="globo globo-abajo text-[17px] mb-4">{{ c.cierre.globo }}</p>
          <app-pardo estado="celebra" [tamano]="190" [mirar]="true" [vivo]="true" />
        </div>
        <h2 data-aparecer class="titulo-seccion !text-[clamp(2.2rem,6vw,4rem)] max-w-[820px] mx-auto">{{ c.cierre.titulo }}</h2>
        <p data-aparecer class="texto-seccion mx-auto">{{ c.cierre.texto }}</p>
        <div data-aparecer class="flex flex-wrap justify-center gap-3 mt-8">
          <button type="button" class="btn-primary text-[17px]" (click)="contacto.abrir()"><app-icono nombre="whatsapp" [tamano]="20" /> {{ c.contacto.textoBoton }}</button>
          @if (correoValido) {
            <a class="btn-secondary" [href]="'mailto:' + c.contacto.correo + '?subject=' + asunto"><app-icono nombre="correo" [tamano]="20" /> {{ c.contacto.textoCorreo }}</a>
          } @else {
            <button type="button" class="btn-secondary" (click)="contacto.abrir()"><app-icono nombre="correo" [tamano]="20" /> {{ c.contacto.textoCorreo }}</button>
          }
        </div>
        <p data-aparecer class="mt-4 font-bold text-grafito">{{ c.contacto.precio }}</p>
      </div>
      <footer class="contenedor mt-20 mb-28 pt-8 border-t border-tinta/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[14px] text-grafito">
        <div class="flex items-center gap-3 text-center sm:text-left">
          <app-pardo [cara]="true" [tamano]="40" />
          <div>
            <p class="m-0 font-bold text-tinta">{{ c.pie.texto }}</p>
            <p class="m-0">{{ c.pie.subtexto }}</p>
          </div>
        </div>
        @if (c.pie.marca; as m) {
          <div class="flex items-center gap-3">
            <div class="text-right leading-snug">
              <p class="m-0">Desarrollada por <b class="text-tinta whitespace-nowrap">{{ m.autor }}</b></p>
              <p class="m-0">{{ m.texto }}</p>
            </div>
            <img [src]="m.logo" [alt]="m.alt" width="168" height="66" loading="lazy" class="h-[66px] w-auto rounded-2xl shadow-[0_10px_24px_-14px_rgb(9_18_35/.7)]">
          </div>
        }
        <a href="#inicio" class="inline-flex items-center gap-1.5 font-bold text-sello" (click)="arriba($event)"><app-icono nombre="arriba" [tamano]="16" /> {{ c.pie.arriba }}</a>
      </footer>
    </section>
  `,
})
export class Cierre extends SeccionBase {
  @Input({ required: true }) c!: Contenido;

  get correoValido(): boolean {
    return ContactoService.valido(this.c.contacto.correo);
  }

  get asunto(): string {
    return encodeURIComponent(this.c.contacto.asuntoCorreo);
  }

  arriba(e: Event): void {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: this.reducir ? 'auto' : 'smooth' });
  }

  protected override animaciones(gsap: any): void {
    gsap.from('.cierre-pardo', { scale: .3, rotation: 15, duration: 1, ease: 'elastic.out(1, .5)', scrollTrigger: { trigger: '.cierre-pardo', start: 'top 85%' } });
  }
}
