import { Component, Input } from '@angular/core';

//CIRCULO COMO TRAZO DE PATH (ASI CADA ICONO ES UN SOLO "d")
function c(cx: number, cy: number, r: number): string {
  return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
}

//ICONOS PROPIOS DE TRAZO (24 x 24). SE PIDEN POR NOMBRE: <app-icono nombre="libro" />
const ICONOS: Record<string, string> = {
  libro: 'M3 5.5C5.5 4.5 9 4.5 12 6.5c3-2 6.5-2 9-1V19c-2.5-1-6-1-9 1-3-2-6.5-2-9-1Z M12 6.5V20',
  maleta: 'M6 10a6 6 0 0 1 12 0v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z M9 6V4.5a3 3 0 0 1 6 0V6 M9 14h6v4H9Z',
  familia: c(8, 7, 3) + ' ' + c(17, 9.5, 2.2) + ' M2.5 20a5.5 5.5 0 0 1 11 0 M14 20a3.8 3.8 0 0 1 7.5 0',
  saber: 'M2 9l10-5 10 5-10 5Z M6 11v5c3 2.5 9 2.5 12 0v-5 M22 9v6',
  hojas: 'M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z M4 9h16 M4 15h16 M10 3v18',
  alerta: 'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4Z M10 21h4',
  camino: c(5, 19, 2) + ' ' + c(12, 12, 2) + ' ' + c(19, 5, 2) + ' M6.5 17.5 10.5 13.5 M13.5 10.5 17.5 6.5',
  examen: 'M9 3h6v3H9Z M7 4.5H6a1 1 0 0 0-1 1V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5.5a1 1 0 0 0-1-1h-1 M8.5 12l2 2 4-4 M8.5 17.5h7',
  escala: 'M3 8h18v8H3Z M7 8v3 M11 8v4 M15 8v3 M19 8v4',
  barras: 'M4 20h16 M7 17v-5 M12 17V7 M17 17v-8',
  mensaje: 'M4 5h16v11H9l-5 4Z M8 9h8 M8 12h5',
  usuarios: c(9, 8, 3) + ' M3 20a6 6 0 0 1 12 0 ' + c(17, 9, 2.4) + ' M16 14.3A5 5 0 0 1 21 19',
  diploma: 'M4 4h16v12H4Z M7.5 8h9 M7.5 11h5 ' + c(16, 16, 2.6) + ' M14.7 18.3 14 22l2-1 2 1-.7-3.7',
  casa: 'M3 11l9-7 9 7 M5 9.5V20h14V9.5 M10 20v-6h4v6',
  llave: c(8, 15, 4) + ' M11 12l9-9 M17 6l3 3 M14.5 8.5l2 2',
  escudo: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6Z M9 12l2 2 4-4',
  candado: 'M7 10h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z M8 10V7a4 4 0 0 1 8 0v3 M12 14v3',
  nube: 'M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9Z M12 11v5 M9.5 13.5 12 16l2.5-2.5',
  check: 'M5 12.5l4.5 4.5L19 7',
  parcial: 'M6 12h12',
  no: 'M7 7l10 10 M17 7 7 17',
  correo: 'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z M3 7l9 6 9-6',
  sol: c(12, 12, 4) + ' M12 2v2 M12 20v2 M2 12h2 M20 12h2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4',
  luna: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z',
  flecha: 'M5 12h14 M13 6l6 6-6 6',
  abajo: 'M12 5v14 M6 13l6 6 6-6',
  arriba: 'M12 19V5 M6 11l6-6 6 6',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  cerrar: 'M6 6l12 12 M18 6 6 18',
  mas: 'M12 5v14 M5 12h14',
  estrella: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z',
  reloj: c(12, 12, 9) + ' M12 7v5l3 2',
  huella: c(7, 9, 1.8) + ' ' + c(12, 6.5, 1.8) + ' ' + c(17, 9, 1.8) + ' M8 16.5c0-3 2-4.5 4-4.5s4 1.5 4 4.5c0 2-1.8 2.8-4 2.8s-4-.8-4-2.8Z',
  whatsapp: 'M4 20l1.3-4A8 8 0 1 1 8.4 19Z M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 1c-1.2-.5-2.5-1.8-3-3l1-1-1-2Z',
  play: 'M8 5v14l11-7Z',
  variable: 'M5 13.5c2.3-3.4 4.6-3.4 7 0s4.7 3.4 7 0',
};

@Component({
  selector: 'app-icono',
  standalone: false,
  template: `
    <svg [attr.width]="tamano" [attr.height]="tamano" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      [attr.stroke-width]="grosor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path [attr.d]="d" />
    </svg>
  `,
  styles: [`:host { display: inline-flex; line-height: 0; flex-shrink: 0; }`],
})
export class Icono {
  @Input() nombre = 'estrella';
  @Input() tamano = 24;
  @Input() grosor = 2;

  get d(): string {
    return ICONOS[this.nombre] ?? ICONOS['estrella'];
  }
}
