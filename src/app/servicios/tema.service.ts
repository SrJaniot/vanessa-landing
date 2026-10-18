import { Injectable } from '@angular/core';

//MODO CLARO POR DEFECTO (COMO LA PLATAFORMA). EL OSCURO ES OPCIONAL CON EL BOTON DE LA BARRA
//SE RECUERDA EN localStorage SOLO COMO COMODIDAD (SI EL NAVEGADOR LO BLOQUEA, SIGUE EN CLARO)
@Injectable({
  providedIn: 'root'
})
export class TemaService {

  private clave = 'vanessa-landing-tema';
  oscuro = false;

  iniciar(): void {
    let guardado: string | null = null;
    try { guardado = localStorage.getItem(this.clave); } catch { guardado = null; }
    this.aplicar(guardado === 'dark');
  }

  alternar(): void {
    this.aplicar(!this.oscuro);
    try { localStorage.setItem(this.clave, this.oscuro ? 'dark' : 'light'); } catch { /* sin almacenamiento */ }
  }

  private aplicar(oscuro: boolean): void {
    this.oscuro = oscuro;
    document.documentElement.setAttribute('data-theme', oscuro ? 'dark' : 'light');
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', oscuro ? '#141A2B' : '#FFF8EC');
  }
}
