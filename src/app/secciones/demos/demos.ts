import { Component, ElementRef, Input, OnDestroy, ViewChild, computed, signal } from '@angular/core';
import { Contenido, EstadoPardo } from '../../Modelos/contenido.model';
import { SeccionBase } from '../seccion-base';

//MINI DEMOS RECREADAS EN HTML (NO SON CAPTURAS): PREGUNTA CON PARDO, TABLERO, ALERTA CON SEGUIMIENTO Y WHATSAPP DEL ACUDIENTE
@Component({
  selector: 'app-demos',
  standalone: false,
  templateUrl: './demos.html',
})
export class Demos extends SeccionBase implements OnDestroy {
  @Input({ required: true }) c!: Contenido['demos'];
  @ViewChild('confeti') confeti?: ElementRef<HTMLElement>;
  @ViewChild('telefono') telefono?: ElementRef<HTMLElement>;

  //PREGUNTA
  elegida = signal<number | null>(null);
  resultado = computed(() => {
    const e = this.elegida();
    if (e === null) return null;
    return e === this.c.pregunta.correcta ? 'bien' : 'mal';
  });
  estadoPardo = computed<EstadoPardo>(() => this.resultado() === 'bien' ? 'celebra' : this.resultado() === 'mal' ? 'anima' : 'piensa');

  //ALERTA: 0 NUEVA, 1 EN SEGUIMIENTO, 2 CERRADA
  pasoAlerta = signal(0);

  //WHATSAPP
  chat = signal<'esperando' | 'escribiendo' | 'recibido'>('esperando');
  private temporizador: ReturnType<typeof setTimeout> | null = null;
  private observador?: IntersectionObserver;
  private gsap: any = null;

  responder(i: number): void {
    this.elegida.set(i);
    if (i === this.c.pregunta.correcta) this.lanzarConfeti();
  }

  reiniciarPregunta(): void {
    this.elegida.set(null);
  }

  avanzarAlerta(): void {
    this.pasoAlerta.set((this.pasoAlerta() + 1) % 3);
  }

  enviarMensaje(): void {
    if (this.temporizador) clearTimeout(this.temporizador);
    if (this.reducir) { this.chat.set('recibido'); return; }
    this.chat.set('escribiendo');
    this.temporizador = setTimeout(() => this.chat.set('recibido'), 1700);
  }

  private lanzarConfeti(): void {
    const caja = this.confeti?.nativeElement;
    if (!caja || !this.gsap) return;
    const colores = ['#FFC531', '#FF6F59', '#2FAE6B', '#2F7FE0', '#8B6CEF'];
    for (let i = 0; i < 36; i++) {
      const p = document.createElement('span');
      p.style.cssText = `position:absolute;left:50%;top:40%;width:${6 + Math.random() * 6}px;height:${8 + Math.random() * 8}px;border-radius:2px;background:${colores[i % 5]};`;
      caja.appendChild(p);
      this.gsap.to(p, {
        x: (Math.random() - .5) * 420, y: -120 - Math.random() * 160, rotation: Math.random() * 720, duration: .9, ease: 'power2.out',
        onComplete: () => this.gsap.to(p, { y: '+=260', autoAlpha: 0, duration: 1, ease: 'power1.in', onComplete: () => p.remove() }),
      });
    }
  }

  protected override animaciones(gsap: any): void {
    this.gsap = gsap;
    //LAS BARRAS DEL TABLERO CRECEN AL ENTRAR EN PANTALLA
    gsap.from('.demo-barra', { scaleX: 0, transformOrigin: '0 50%', duration: 1.2, ease: 'power3.out', stagger: .12, scrollTrigger: { trigger: '.demo-tablero', start: 'top 80%' } });
  }

  override ngAfterViewInit(): Promise<void> {
    //EL CELULAR RECIBE EL MENSAJE CUANDO SE VE EN PANTALLA
    const tel = this.telefono?.nativeElement;
    if (tel && typeof IntersectionObserver !== 'undefined') {
      this.observador = new IntersectionObserver(e => {
        if (e[0].isIntersecting) { this.observador?.disconnect(); this.enviarMensaje(); }
      }, { threshold: .5 });
      this.observador.observe(tel);
    } else {
      this.chat.set('recibido');
    }
    return super.ngAfterViewInit();
  }

  override ngOnDestroy(): void {
    this.observador?.disconnect();
    if (this.temporizador) clearTimeout(this.temporizador);
    super.ngOnDestroy();
  }
}
