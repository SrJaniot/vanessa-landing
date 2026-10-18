import { Component, ElementRef, HostListener, Input, ViewChild, signal } from '@angular/core';
import { Contenido, ModuloLanding } from '../../Modelos/contenido.model';
import { SeccionBase } from '../seccion-base';

//MODULOS: UNA TARJETA POR MODULO. AL TOCARLA SE ABRE EL DETALLE ANIMADO DESDE LA TARJETA (DIALOGO ACCESIBLE)
@Component({
  selector: 'app-modulos',
  standalone: false,
  templateUrl: './modulos.html',
})
export class Modulos extends SeccionBase {
  @Input({ required: true }) c!: Contenido['modulos'];
  @ViewChild('dialogo') dialogo?: ElementRef<HTMLElement>;

  elegido = signal<ModuloLanding | null>(null);
  private gsap: any = null;
  private origen: HTMLElement | null = null;

  abrir(m: ModuloLanding, e: Event): void {
    this.origen = e.currentTarget as HTMLElement;
    const r = this.origen.getBoundingClientRect();
    this.elegido.set(m);
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const d = this.dialogo?.nativeElement;
      if (!d) return;
      d.focus();
      if (this.gsap) {
        //EL DETALLE CRECE DESDE LA POSICION DE LA TARJETA
        const dr = d.getBoundingClientRect();
        this.gsap.from(d, {
          x: r.left + r.width / 2 - (dr.left + dr.width / 2), y: r.top + r.height / 2 - (dr.top + dr.height / 2),
          scale: .35, autoAlpha: 0, duration: .55, ease: 'power3.out',
        });
        this.gsap.from(d.querySelectorAll('.det-animar'), { autoAlpha: 0, y: 16, stagger: .05, delay: .25, duration: .4 });
      }
    });
  }

  @HostListener('document:keydown.escape')
  cerrar(): void {
    if (!this.elegido()) return;
    this.elegido.set(null);
    document.body.style.overflow = '';
    setTimeout(() => this.origen?.focus());
  }

  //MANTIENE EL FOCO DENTRO DEL DIALOGO CON TAB
  atrapar(e: KeyboardEvent): void {
    if (e.key !== 'Tab' || !this.dialogo) return;
    const focos = this.dialogo.nativeElement.querySelectorAll<HTMLElement>('button, a[href]');
    if (!focos.length) return;
    const primero = focos[0], ultimo = focos[focos.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  }

  protected override animaciones(gsap: any): void {
    this.gsap = gsap;
    gsap.from('.modulo-tarjeta', {
      autoAlpha: 0, y: 40, rotation: () => gsap.utils.random(-4, 4), duration: .6, ease: 'back.out(1.6)', stagger: { each: .05, from: 'start' },
      scrollTrigger: { trigger: '.modulos-rejilla', start: 'top 82%' },
    });
  }

  override ngOnDestroy(): void {
    document.body.style.overflow = '';
    super.ngOnDestroy();
  }
}
