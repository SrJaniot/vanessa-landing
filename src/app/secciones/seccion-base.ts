import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';
import { AnimacionesService } from '../servicios/animaciones.service';
import { ContactoService } from '../servicios/contacto.service';

//BASE DE CADA SECCION: CARGA GSAP (LAZY), ANIMA LO QUE TENGA data-aparecer Y DESHACE TODO AL DESTRUIR
//CADA SECCION SOBREESCRIBE animaciones() CON LO SUYO
@Directive()
export abstract class SeccionBase implements AfterViewInit, OnDestroy {
  protected anim = inject(AnimacionesService);
  protected host = inject<ElementRef<HTMLElement>>(ElementRef);
  contacto = inject(ContactoService);
  private ctx: { revert(): void } | null = null;
  private destruido = false;

  async ngAfterViewInit(): Promise<void> {
    const ctx = await this.anim.animar(this.host.nativeElement, (gsap, st) => this.animaciones(gsap, st));
    if (this.destruido) ctx?.revert();
    else this.ctx = ctx;
  }

  protected animaciones(_gsap: any, _st: any): void { }

  get reducir(): boolean {
    return this.anim.reducirMovimiento;
  }

  ngOnDestroy(): void {
    this.destruido = true;
    this.ctx?.revert();
  }
}
