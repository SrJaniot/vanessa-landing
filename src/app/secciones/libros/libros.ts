import { Component, Input, OnInit } from '@angular/core';
import { Contenido } from '../../Modelos/contenido.model';
import { SeccionBase } from '../seccion-base';

//"LOS LIBROS PUEDEN QUEDAR ATRAS": CALCULADORA DE AHORRO (VALORES EDITABLES) Y MALETA QUE SE ALIGERA
//EL COSTO POR DEFECTO ES UN EJEMPLO CON SU FUENTE (contenido.json); SI DICE "PENDIENTE" EL CAMPO QUEDA VACIO
@Component({
  selector: 'app-libros',
  standalone: false,
  templateUrl: './libros.html',
  styleUrl: './libros.scss',
})
export class Libros extends SeccionBase implements OnInit {
  @Input({ required: true }) c!: Contenido['libros'];

  estudiantes = 600;
  costo: number | null = null;
  porcentaje = 50;
  libros = [
    { color: '#FF6F59', alto: 58 }, { color: '#2FAE6B', alto: 66 }, { color: '#8B6CEF', alto: 52 },
    { color: '#FFC531', alto: 62 }, { color: '#2F7FE0', alto: 56 },
  ];
  private moneda = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

  ngOnInit(): void {
    this.estudiantes = this.c.calculadora.estudiantesPorDefecto;
    this.porcentaje = this.c.calculadora.porcentajePorDefecto;
    const v = this.c.calculadora.costoPorDefecto.valor;
    this.costo = typeof v === 'number' && isFinite(v) ? v : null;
  }

  get hayResultado(): boolean {
    return !!this.costo && this.costo > 0 && this.estudiantes > 0;
  }

  get ahorro(): string {
    return this.moneda.format(Math.max(0, (this.estudiantes || 0) * (this.costo || 0) * this.porcentaje / 100));
  }

  get ahorroEstudiante(): string {
    return this.moneda.format(Math.max(0, (this.costo || 0) * this.porcentaje / 100));
  }

  get fuera(): number {
    return Math.round(this.porcentaje / 100 * this.libros.length);
  }

  limitar(): void {
    if (this.estudiantes < 0) this.estudiantes = 0;
    if (this.estudiantes > 20000) this.estudiantes = 20000;
    if (this.costo !== null && this.costo < 0) this.costo = 0;
  }

  protected override animaciones(gsap: any): void {
    gsap.from('.maleta', { y: 60, rotation: -6, autoAlpha: 0, duration: 1, ease: 'elastic.out(1, .6)', scrollTrigger: { trigger: '.maleta', start: 'top 85%' } });
  }
}
