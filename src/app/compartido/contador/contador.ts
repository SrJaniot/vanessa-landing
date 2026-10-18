import { AfterViewInit, Component, ElementRef, Input, OnDestroy, signal } from '@angular/core';
import { CifraExterna } from '../../Modelos/contenido.model';

//CIFRA QUE CUENTA DESDE 0 CUANDO ENTRA EN PANTALLA (FORMATO es-CO: 976.300 Y 3,44)
//SI EL VALOR NO ES UN NUMERO (POR EJEMPLO "PENDIENTE"), SE MUESTRA COMO MARCADOR Y NO SE INVENTA NADA
@Component({
  selector: 'app-contador',
  standalone: false,
  template: `
    @if (esNumero) {
      <span class="tabular-nums">{{ cifra.prefijo }}{{ texto() }}{{ cifra.sufijo }}</span>
    } @else {
      <span class="cifra-pendiente">{{ pendiente }}</span>
    }
  `,
})
export class Contador implements AfterViewInit, OnDestroy {
  @Input({ required: true }) cifra!: CifraExterna;
  @Input() pendiente = 'PENDIENTE';

  texto = signal('0');
  private observador?: IntersectionObserver;
  private cuadro = 0;

  constructor(private el: ElementRef<HTMLElement>) { }

  get esNumero(): boolean {
    return typeof this.cifra?.valor === 'number' && isFinite(this.cifra.valor);
  }

  private formatear(n: number): string {
    const dec = this.cifra.decimales ?? 0;
    return new Intl.NumberFormat('es-CO', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);
  }

  ngAfterViewInit(): void {
    if (!this.esNumero) return;
    const final = this.cifra.valor as number;
    let reducir = false;
    try { reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { reducir = false; }
    if (reducir || typeof IntersectionObserver === 'undefined') {
      this.texto.set(this.formatear(final));
      return;
    }
    this.observador = new IntersectionObserver(entradas => {
      if (!entradas[0].isIntersecting) return;
      this.observador?.disconnect();
      const inicio = performance.now();
      const dura = 1600;
      const paso = (t: number) => {
        const p = Math.min(1, (t - inicio) / dura);
        const suave = 1 - Math.pow(1 - p, 3);
        this.texto.set(this.formatear(final * suave));
        if (p < 1) this.cuadro = requestAnimationFrame(paso);
      };
      this.cuadro = requestAnimationFrame(paso);
    }, { threshold: 0.4 });
    this.observador.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observador?.disconnect();
    cancelAnimationFrame(this.cuadro);
  }
}
