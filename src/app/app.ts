import { Component, OnInit, signal } from '@angular/core';
import { Contenido } from './Modelos/contenido.model';
import { ContenidoService } from './servicios/contenido.service';
import { TemaService } from './servicios/tema.service';
import { AnimacionesService } from './servicios/animaciones.service';

//LANDING DE VENTA DE VANESSA: UNA SOLA PAGINA. TODO EL TEXTO SALE DE public/contenido/contenido.json
@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
})
export class App implements OnInit {
  contenido = signal<Contenido | null>(null);
  error = signal(false);

  constructor(private servicio: ContenidoService, private tema: TemaService, private anim: AnimacionesService) { }

  ngOnInit(): void {
    this.tema.iniciar();
    this.servicio.ObtenerContenido().subscribe({
      next: c => {
        this.contenido.set(c);
        //CUANDO YA ESTAN TODAS LAS SECCIONES, SCROLLTRIGGER RECALCULA POSICIONES (LAS IMAGENES Y FUENTES CAMBIAN LOS ALTOS)
        window.addEventListener('load', () => this.refrescar());
        document.fonts?.ready.then(() => this.refrescar());
        setTimeout(() => this.refrescar(), 1200);
      },
      error: () => this.error.set(true),
    });
  }

  private async refrescar(): Promise<void> {
    const a = await this.anim.cargar();
    a?.ScrollTrigger.refresh();
  }
}
