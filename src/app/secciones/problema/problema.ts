import { Component, Input } from '@angular/core';
import { Contenido } from '../../Modelos/contenido.model';
import { SeccionBase } from '../seccion-base';

//EL PROBLEMA: SEIS TARJETAS CON CONTADORES ANIMADOS Y SU FUENTE
@Component({
  selector: 'app-problema',
  standalone: false,
  templateUrl: './problema.html',
})
export class Problema extends SeccionBase {
  @Input({ required: true }) c!: Contenido['problema'];

  protected override animaciones(gsap: any): void {
    gsap.from('.problema-icono', {
      scale: 0, rotation: -30, duration: .6, ease: 'back.out(2.2)', stagger: .08,
      scrollTrigger: { trigger: '.problema-rejilla', start: 'top 80%' },
    });
  }
}
