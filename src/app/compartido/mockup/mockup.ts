import { Component, Input } from '@angular/core';

export type TipoMockup = 'escritorio' | 'celular' | 'estudiante' | 'profesor' | 'coordinacion' | 'acudiente';

//PANTALLAS RECREADAS EN HTML (SE MUESTRAN MIENTRAS NO EXISTA LA CAPTURA REAL EN public/capturas/)
//SON ILUSTRACIONES: VAN CON aria-hidden Y LA CAPTURA DESCRIBE LA PANTALLA CON SU alt
//TODO SE MIDE EN em Y LA LETRA BASE SALE DEL ANCHO DEL MARCO (cqw), ASI ESCALAN COMPLETAS EN CUALQUIER PANTALLA
@Component({
  selector: 'app-mockup',
  standalone: false,
  templateUrl: './mockup.html',
  styleUrl: './mockup.scss',
})
export class Mockup {
  @Input() tipo: TipoMockup = 'escritorio';

  semana = [
    { dia: 'L', min: 35 }, { dia: 'M', min: 20 }, { dia: 'M', min: 0 }, { dia: 'J', min: 45 },
    { dia: 'V', min: 30 }, { dia: 'S', min: 10 }, { dia: 'D', min: 0 },
  ];
  grados = [
    { g: '6°', v: 78 }, { g: '7°', v: 64 }, { g: '8°', v: 71 }, { g: '9°', v: 58 }, { g: '10°', v: 83 }, { g: '11°', v: 89 },
  ];
  temas = [
    { nombre: 'Números naturales', estrellas: 3, estado: 'hecho' },
    { nombre: 'Fracciones', estrellas: 1, estado: 'actual' },
    { nombre: 'Decimales', estrellas: 0, estado: 'cerrado' },
    { nombre: 'Proporciones', estrellas: 0, estado: 'cerrado' },
  ];
  estrellas = [1, 2, 3];
}
