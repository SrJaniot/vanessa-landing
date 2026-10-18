import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Pardo } from './pardo/pardo';
import { Icono } from './icono/icono';
import { Mockup } from './mockup/mockup';
import { Captura } from './captura/captura';
import { Contador } from './contador/contador';

//PIEZAS QUE USAN VARIAS SECCIONES: PARDO, ICONOS, PANTALLAS RECREADAS, CAPTURAS Y CONTADORES
@NgModule({
  declarations: [Pardo, Icono, Mockup, Captura, Contador],
  imports: [CommonModule, FormsModule],
  exports: [Pardo, Icono, Mockup, Captura, Contador, CommonModule, FormsModule],
})
export class CompartidoModule { }
