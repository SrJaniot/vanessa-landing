import { Component, Input, signal } from '@angular/core';
import { TipoMockup } from '../mockup/mockup';
import { CapturasService } from '../../servicios/capturas.service';

//MUESTRA LA CAPTURA REAL SI EXISTE EN public/capturas/ (LA PONE OTRO AGENTE DESPUES).
//MIENTRAS NO EXISTA, SE VE LA PANTALLA RECREADA EN HTML (app-mockup) DENTRO DEL MISMO MARCO.
//marco: laptop (portatil con base), celular (telefono) o plano (ventana del navegador)
@Component({
  selector: 'app-captura',
  standalone: false,
  template: `
    <div class="marco" [class]="'marco-' + marco">
      <div class="marco-pantalla" [class.marco-celular]="marco === 'celular'">
        @if (!cargada()) {
          <app-mockup [tipo]="mockup" />
        }
        @if (capturas.tiene(archivo) && !fallo()) {
          <img [src]="archivo" [alt]="alt" loading="lazy" decoding="async"
            [class.oculta]="!cargada()" (load)="cargada.set(true)" (error)="fallo.set(true)" />
        }
        @if (!cargada()) {
          <span class="sr-only">{{ alt }}</span>
        }
      </div>
      @if (marco === 'laptop') {
        <div class="marco-base"></div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .marco { position: relative; }
    .marco-pantalla { position: relative; container-type: inline-size; overflow: hidden; background: var(--papel); }
    .marco-pantalla img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top center; }
    .marco-pantalla img.oculta { opacity: 0; }
    .marco-laptop .marco-pantalla { aspect-ratio: 16 / 10; border: .7em solid #1F2A44; border-radius: 1em 1em .3em .3em; box-shadow: 0 30px 60px -30px rgb(31 42 68 / .55); }
    .marco-base { height: .9em; margin: 0 -7%; background: linear-gradient(#C9D3E6, #9AA7C0); border-radius: 0 0 1.2em 1.2em; position: relative; }
    .marco-base::before { content: ''; position: absolute; left: 50%; top: 0; width: 16%; height: .35em; transform: translateX(-50%); background: #7F8BA6; border-radius: 0 0 .5em .5em; }
    .marco-celular .marco-pantalla, .marco-celular.marco-pantalla { aspect-ratio: 9 / 18.5; border: .55em solid #1F2A44; border-radius: 1.6em; box-shadow: 0 30px 50px -25px rgb(31 42 68 / .6); }
    .marco-plano .marco-pantalla { aspect-ratio: 16 / 11; border: 2px solid var(--linea); border-radius: 1.1em; box-shadow: var(--sombra); }
  `],
})
export class Captura {
  @Input() archivo = '';
  @Input() alt = '';
  @Input() mockup: TipoMockup = 'escritorio';
  @Input() marco: 'laptop' | 'celular' | 'plano' = 'plano';

  cargada = signal(false);
  fallo = signal(false);

  constructor(public capturas: CapturasService) { }
}
