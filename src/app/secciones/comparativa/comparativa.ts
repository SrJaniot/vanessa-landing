import { Component, Input } from '@angular/core';
import { Contenido, ValorComparativa } from '../../Modelos/contenido.model';
import { SeccionBase } from '../seccion-base';

//COMPARATIVA POR CATEGORIAS (NO POR MARCAS). LOS VALORES ESTAN EN contenido.json: si, parcial, no o variable
@Component({
  selector: 'app-comparativa',
  standalone: false,
  templateUrl: './comparativa.html',
})
export class Comparativa extends SeccionBase {
  @Input({ required: true }) c!: Contenido['comparativa'];

  valores: ValorComparativa[] = ['si', 'parcial', 'variable', 'no'];

  icono(v: ValorComparativa): string {
    return v === 'si' ? 'check' : v === 'no' ? 'no' : v === 'variable' ? 'variable' : 'parcial';
  }

  clase(v: ValorComparativa): string {
    return v === 'si' ? 'bg-acento-verde text-white' : v === 'parcial' ? 'bg-acento-amarillo text-[#1F2A44]' : v === 'variable' ? 'bg-[#5A6480] text-white' : 'bg-white/10 text-white/70';
  }

  protected override animaciones(gsap: any): void {
    gsap.from('.comp-marca', { scale: 0, duration: .4, ease: 'back.out(2.5)', stagger: { each: .02, grid: 'auto' }, scrollTrigger: { trigger: '.tabla-comparativa', start: 'top 75%' } });
  }
}
