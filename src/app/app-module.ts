import { LOCALE_ID, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { CompartidoModule } from './compartido/compartido-module';
import { App } from './app';
import { Barra } from './secciones/barra/barra';
import { Portada } from './secciones/portada/portada';
import { Problema } from './secciones/problema/problema';
import { Libros } from './secciones/libros/libros';
import { Recorrido } from './secciones/recorrido/recorrido';
import { Modulos } from './secciones/modulos/modulos';
import { Demos } from './secciones/demos/demos';
import { Video } from './secciones/video/video';
import { Comparativa } from './secciones/comparativa/comparativa';
import { Seguridad } from './secciones/seguridad/seguridad';
import { Empezamos } from './secciones/empezamos/empezamos';
import { Faq } from './secciones/faq/faq';
import { Asesoria } from './secciones/asesoria/asesoria';
import { Cierre } from './secciones/cierre/cierre';
import { Guia } from './secciones/guia/guia';
import { ContactoModal } from './secciones/contacto-modal/contacto-modal';

//FECHAS Y NUMEROS EN ESPAÑOL DE COLOMBIA
registerLocaleData(localeEsCo, 'es-CO');

//UNA SOLA PAGINA (SIN ROUTER): LAS SECCIONES SE NAVEGAN CON ANCLAS
@NgModule({
  declarations: [
    App, Barra, Portada, Problema, Libros, Recorrido, Modulos, Demos, Video,
    Comparativa, Seguridad, Empezamos, Faq, Asesoria, Cierre, Guia, ContactoModal,
  ],
  imports: [
    BrowserModule,
    CompartidoModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'es-CO' },
  ],
  bootstrap: [App]
})
export class AppModule { }
