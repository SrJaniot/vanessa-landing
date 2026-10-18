import { Component, HostListener, Input, signal } from '@angular/core';
import { Contenido } from '../../Modelos/contenido.model';
import { TemaService } from '../../servicios/tema.service';
import { ContactoService } from '../../servicios/contacto.service';

//BARRA SUPERIOR FIJA: LOGO, ENLACES A LAS SECCIONES, MODO OSCURO Y "AGENDA UNA DEMOSTRACION". EN EL CELULAR, MENU DESPLEGABLE
@Component({
  selector: 'app-barra',
  standalone: false,
  templateUrl: './barra.html',
})
export class Barra {
  @Input({ required: true }) c!: Contenido;
  menuAbierto = signal(false);
  solida = signal(false);
  progreso = signal(0);
  private pendiente = false;

  constructor(public tema: TemaService, public contacto: ContactoService) { }

  @HostListener('window:scroll')
  alDesplazar(): void {
    if (this.pendiente) return;
    this.pendiente = true;
    requestAnimationFrame(() => {
      this.pendiente = false;
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      this.solida.set(window.scrollY > 20);
      this.progreso.set(alto > 0 ? Math.min(1, window.scrollY / alto) : 0);
    });
  }

  @HostListener('document:keydown.escape')
  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  ir(ancla: string, evento: Event): void {
    evento.preventDefault();
    this.menuAbierto.set(false);
    const destino = document.getElementById(ancla);
    if (!destino) return;
    destino.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    destino.focus({ preventScroll: true });
  }

  arriba(evento: Event): void {
    this.ir('inicio', evento);
  }
}
