import { Injectable } from '@angular/core';

//CARGA GSAP Y SCROLLTRIGGER SOLO CUANDO HACEN FALTA (IMPORT LAZY: NO PESAN EN EL BUNDLE INICIAL)
//CON "REDUCIR MOVIMIENTO" NO SE CARGA NADA: LA PAGINA SE VE COMPLETA Y QUIETA
//LIBRERIAS CommonJS/ESM: EN PRODUCCION PUEDEN LLEGAR EN .default -> SIEMPRE m.default ?? m
@Injectable({
  providedIn: 'root'
})
export class AnimacionesService {

  private carga?: Promise<{ gsap: any; ScrollTrigger: any } | null>;

  get reducirMovimiento(): boolean {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  }

  cargar(): Promise<{ gsap: any; ScrollTrigger: any } | null> {
    if (this.reducirMovimiento) return Promise.resolve(null);
    if (!this.carga) {
      this.carga = Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
        .then(([mg, ms]: any[]) => {
          const gsap = mg.gsap ?? mg.default ?? mg;
          const ScrollTrigger = ms.ScrollTrigger ?? ms.default ?? ms;
          gsap.registerPlugin(ScrollTrigger);
          return { gsap, ScrollTrigger };
        })
        .catch(err => {
          console.warn('No se pudieron cargar las animaciones', err);
          return null;
        });
    }
    return this.carga;
  }

  //PREPARA LAS ANIMACIONES DE UNA SECCION DENTRO DE UN gsap.context (SE DESHACEN CON revert() AL DESTRUIR)
  //ADEMAS, TODO LO QUE TENGA data-aparecer DENTRO DE host SUBE Y APARECE AL ENTRAR EN PANTALLA
  async animar(host: HTMLElement, fn?: (gsap: any, ScrollTrigger: any) => void): Promise<{ revert(): void } | null> {
    const a = await this.cargar();
    if (!a) return null;
    const { gsap, ScrollTrigger } = a;
    return gsap.context(() => {
      const elementos = host.querySelectorAll('[data-aparecer]');
      if (elementos.length) {
        gsap.set(elementos, { autoAlpha: 0, y: 34 });
        ScrollTrigger.batch(elementos, {
          start: 'top 88%',
          once: true,
          onEnter: (lote: Element[]) => gsap.to(lote, { autoAlpha: 1, y: 0, duration: .7, ease: 'power3.out', stagger: .09, overwrite: true }),
        });
      }
      fn?.(gsap, ScrollTrigger);
    }, host);
  }
}
