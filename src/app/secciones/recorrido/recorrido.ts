import { Component, ElementRef, Input, QueryList, ViewChildren, signal } from '@angular/core';
import { Contenido } from '../../Modelos/contenido.model';
import { TipoMockup } from '../../compartido/mockup/mockup';
import { SeccionBase } from '../seccion-base';

//RECORRIDO GUIADO POR PARDO, POR ROL: PESTAÑAS ACCESIBLES (FLECHAS, INICIO, FIN) Y PANEL ANIMADO CON GSAP
@Component({
  selector: 'app-recorrido',
  standalone: false,
  templateUrl: './recorrido.html',
})
export class Recorrido extends SeccionBase {
  @Input({ required: true }) c!: Contenido['recorrido'];
  @ViewChildren('pestana') pestanas!: QueryList<ElementRef<HTMLButtonElement>>;

  activo = signal(0);
  private gsap: any = null;

  get rol() {
    return this.c.roles[this.activo()];
  }

  mockupDe(id: string): TipoMockup {
    return (['estudiante', 'profesor', 'coordinacion', 'acudiente'].includes(id) ? id : 'escritorio') as TipoMockup;
  }

  elegir(i: number, foco = false): void {
    if (i === this.activo()) return;
    this.activo.set(i);
    if (foco) this.pestanas.get(i)?.nativeElement.focus();
    //EL PANEL NUEVO ENTRA DESDE UN LADO Y PARDO DA UN SALTITO
    setTimeout(() => {
      if (!this.gsap) return;
      const host = this.host.nativeElement;
      this.gsap.fromTo(host.querySelectorAll('.rol-animar'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .5, stagger: .06, ease: 'power2.out', overwrite: true });
      this.gsap.fromTo(host.querySelector('.rol-pardo'), { scale: .7, rotation: -8 }, { scale: 1, rotation: 0, duration: .7, ease: 'back.out(2.4)' });
    });
  }

  teclado(e: KeyboardEvent, i: number): void {
    const n = this.c.roles.length;
    const mapa: Record<string, number> = { ArrowRight: (i + 1) % n, ArrowDown: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 };
    if (e.key in mapa) {
      e.preventDefault();
      this.elegir(mapa[e.key], true);
    }
  }

  protected override animaciones(gsap: any): void {
    this.gsap = gsap;
  }
}
