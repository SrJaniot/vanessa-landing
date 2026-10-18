import { Component, Input, signal } from '@angular/core';
import { Contenido } from '../../Modelos/contenido.model';
import { CapturasService } from '../../servicios/capturas.service';

//SECCION DE VIDEO: NO SE MUESTRA MIENTRAS EL MP4 NO ESTE EN public/capturas/ Y EN capturas.json (LO PONE OTRO AGENTE)
//EL <video> SE CREA OCULTO CON preload="metadata": SI CARGA, SE MUESTRA; SI DA ERROR (404), SIGUE OCULTA
@Component({
  selector: 'app-video',
  standalone: false,
  template: `
    @if (capturas.tiene(c.archivo)) {
    <section id="video" tabindex="-1" class="seccion !pt-0" [hidden]="!disponible()">
      <div class="contenedor text-center">
        <span class="etiqueta-seccion">{{ c.etiqueta }}</span>
        <h2 class="titulo-seccion">{{ c.titulo }}</h2>
        <div class="mt-10 mx-auto max-w-[960px] rounded-[26px] overflow-hidden border-[6px] border-hoja shadow-[0_30px_60px_-30px_rgb(31_42_68/.6)] bg-[#1F2A44]">
          <video class="block w-full aspect-video" controls preload="metadata" playsinline
            [src]="c.archivo" [attr.poster]="capturas.tiene(c.poster) ? c.poster : null" [attr.aria-label]="c.descripcion"
            (loadedmetadata)="disponible.set(true)" (error)="disponible.set(false)"></video>
        </div>
      </div>
    </section>
    }
  `,
})
export class Video {
  @Input({ required: true }) c!: Contenido['video'];
  disponible = signal(false);

  constructor(public capturas: CapturasService) { }
}
