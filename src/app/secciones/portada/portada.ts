import { Component, Input } from '@angular/core';
import { Contenido } from '../../Modelos/contenido.model';
import { SeccionBase } from '../seccion-base';

//PORTADA: PARDO SALUDA CON SU GLOBO, TITULAR, ROLES, LLAMADO A LA ACCION Y EL PORTATIL + CELULAR ANIMADOS
@Component({
  selector: 'app-portada',
  standalone: false,
  templateUrl: './portada.html',
})
export class Portada extends SeccionBase {
  @Input({ required: true }) c!: Contenido;

  protected override animaciones(gsap: any): void {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('[data-intro]', { autoAlpha: 0, y: 40, duration: .8, stagger: .1 })
      .from('.portada-pardo', { autoAlpha: 0, scale: .4, rotation: -12, transformOrigin: '50% 100%', duration: .9, ease: 'back.out(1.8)' }, .2)
      .from('.portada-globo', { autoAlpha: 0, scale: .6, transformOrigin: '0% 100%', duration: .5, ease: 'back.out(2)' }, .8)
      .from('.portada-laptop', { autoAlpha: 0, y: 90, rotationX: 18, duration: 1.1 }, .3)
      .from('.portada-celular', { autoAlpha: 0, x: 70, rotation: 10, duration: 1 }, .6);

    //UTILES QUE FLOTAN Y PARALAJE SUAVE AL BAJAR
    gsap.utils.toArray('.decor').forEach((el: Element, i: number) => {
      gsap.to(el, { y: i % 2 ? 14 : -16, rotation: i % 2 ? 8 : -8, duration: 2.6 + i * .4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
    gsap.to('.portada-laptop', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: this.host.nativeElement, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.portada-celular', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: this.host.nativeElement, start: 'top top', end: 'bottom top', scrub: true } });
  }

  irA(ancla: string, e: Event): void {
    e.preventDefault();
    document.getElementById(ancla)?.scrollIntoView({ behavior: this.reducir ? 'auto' : 'smooth' });
  }
}
