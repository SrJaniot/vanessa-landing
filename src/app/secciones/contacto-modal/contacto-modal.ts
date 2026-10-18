import { Component, ElementRef, HostListener, Input, ViewChild, effect } from '@angular/core';
import { Contenido } from '../../Modelos/contenido.model';
import { ContactoService } from '../../servicios/contacto.service';

//MODAL "AGENDA UNA DEMOSTRACION": ARMA EL MENSAJE ("Hola, soy … del colegio … con … estudiantes…")
//Y LO ABRE EN WHATSAPP (wa.me) O EN EL CORREO (mailto). MIENTRAS EL NUMERO O EL CORREO DIGAN "PENDIENTE", ESE BOTON QUEDA INACTIVO
@Component({
  selector: 'app-contacto-modal',
  standalone: false,
  templateUrl: './contacto-modal.html',
})
export class ContactoModal {
  @Input({ required: true }) c!: Contenido['contacto'];
  @ViewChild('dialogo') dialogo?: ElementRef<HTMLElement>;

  nombre = '';
  colegio = '';
  estudiantes: number | null = null;

  constructor(public contacto: ContactoService) {
    effect(() => {
      const abierto = this.contacto.abierto();
      document.body.style.overflow = abierto ? 'hidden' : '';
      if (abierto) setTimeout(() => this.dialogo?.nativeElement.querySelector<HTMLInputElement>('input')?.focus());
    });
  }

  get mensaje(): string {
    return this.c.mensajePlantilla
      .replace('{nombre}', this.nombre.trim() || '…')
      .replace('{colegio}', this.colegio.trim() || '…')
      .replace('{estudiantes}', this.estudiantes ? String(this.estudiantes) : '…');
  }

  get whatsappValido(): boolean {
    return ContactoService.valido(this.c.whatsapp);
  }

  get correoValido(): boolean {
    return ContactoService.valido(this.c.correo);
  }

  get enlaceWhatsapp(): string {
    const numero = (this.c.whatsapp || '').replace(/\D/g, '');
    return `https://wa.me/${numero}?text=${encodeURIComponent(this.mensaje)}`;
  }

  get enlaceCorreo(): string {
    return `mailto:${this.c.correo}?subject=${encodeURIComponent(this.c.asuntoCorreo)}&body=${encodeURIComponent(this.mensaje)}`;
  }

  @HostListener('document:keydown.escape')
  cerrar(): void {
    if (this.contacto.abierto()) this.contacto.cerrar();
  }

  atrapar(e: KeyboardEvent): void {
    if (e.key !== 'Tab' || !this.dialogo) return;
    const focos = Array.from(this.dialogo.nativeElement.querySelectorAll<HTMLElement>('input, button:not([disabled]), a[href]'));
    if (!focos.length) return;
    const primero = focos[0], ultimo = focos[focos.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  }
}
