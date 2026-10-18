import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//INDICE DE CAPTURAS Y VIDEO DISPONIBLES: public/capturas/capturas.json -> { "archivos": ["rol-estudiante.png", ...] }
//SOLO SE PIDE AL SERVIDOR LO QUE ESTA EN LA LISTA: ASI NO HAY ERRORES 404 EN LA CONSOLA MIENTRAS FALTAN ARCHIVOS
//QUIEN AGREGUE UNA CAPTURA O EL VIDEO DEBE AGREGAR SU NOMBRE A ESA LISTA
@Injectable({
  providedIn: 'root'
})
export class CapturasService {

  private disponibles = signal<Set<string>>(new Set());

  constructor(private http: HttpClient) {
    this.http.get<{ archivos: string[] }>('capturas/capturas.json').subscribe({
      next: r => this.disponibles.set(new Set((r?.archivos ?? []).map(a => 'capturas/' + a.replace(/^capturas\//, '')))),
      error: () => this.disponibles.set(new Set()),
    });
  }

  tiene(ruta: string | undefined | null): boolean {
    return !!ruta && this.disponibles().has(ruta);
  }
}
