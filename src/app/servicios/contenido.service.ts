import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contenido } from '../Modelos/contenido.model';

@Injectable({
  providedIn: 'root'
})
export class ContenidoService {

  //EL CONTENIDO ES UN JSON ESTATICO: SE EDITA public/contenido/contenido.json Y SE VUELVE A SUBIR
  //LA RUTA ES RELATIVA PARA QUE FUNCIONE CON CUALQUIER base-href (GITHUB PAGES)
  private urlContenido = 'contenido/contenido.json';

  constructor(private http: HttpClient) { }

  ObtenerContenido(): Observable<Contenido> {
    return this.http.get<Contenido>(this.urlContenido);
  }

  //UNA CIFRA EXTERNA SOLO SE USA SI YA TIENE UN NUMERO (MIENTRAS DIGA "PENDIENTE" SE MUESTRA COMO PENDIENTE)
  static esNumero(valor: unknown): valor is number {
    return typeof valor === 'number' && isFinite(valor);
  }
}
