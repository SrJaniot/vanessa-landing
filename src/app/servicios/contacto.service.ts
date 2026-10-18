import { Injectable, signal } from '@angular/core';

//ABRE Y CIERRA EL MODAL "AGENDA UNA DEMOSTRACION" DESDE CUALQUIER SECCION
@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  abierto = signal(false);
  private origen: HTMLElement | null = null;

  abrir(): void {
    this.origen = document.activeElement as HTMLElement | null;
    this.abierto.set(true);
  }

  cerrar(): void {
    this.abierto.set(false);
    //EL FOCO VUELVE AL BOTON QUE ABRIO EL MODAL (ACCESIBILIDAD)
    setTimeout(() => this.origen?.focus(), 0);
  }

  static valido(valor: string | undefined | null): boolean {
    return !!valor && valor.trim() !== '' && valor.trim().toUpperCase() !== 'PENDIENTE';
  }
}
