//FORMA DE public/contenido/contenido.json (TODO EL TEXTO DE LA LANDING)
//LAS CIFRAS EXTERNAS LLEVAN valor "PENDIENTE" HASTA QUE SE CONFIRMEN CON SU fuente

export type EstadoPardo = 'saluda' | 'celebra' | 'anima' | 'piensa' | 'lee';
export type ColorAcento = 'azul' | 'amarillo' | 'verde' | 'coral' | 'morado';
export type ValorComparativa = 'si' | 'parcial' | 'no' | 'variable';

export interface CifraExterna {
  valor: string | number;
  prefijo?: string;
  sufijo?: string;
  unidad?: string;
  descripcion?: string;
  decimales?: number;
  fuente: string;
  fuenteNombre?: string;
}

export interface Fuente { nombre: string; url: string; }

export interface Enlace { texto: string; ancla: string; }

export interface MensajeGuia { estado: EstadoPardo; texto: string; }

export interface Contenido {
  sitio: { marca: string; lema: string; saltar: string };
  contacto: {
    whatsapp: string;
    correo: string;
    textoBoton: string;
    textoCorreo: string;
    asuntoCorreo: string;
    mensajePlantilla: string;
    precio: string;
    modal: {
      titulo: string; texto: string;
      campoNombre: string; campoNombreEjemplo: string;
      campoColegio: string; campoColegioEjemplo: string;
      campoEstudiantes: string; campoEstudiantesEjemplo: string;
      vistaPrevia: string; botonWhatsapp: string; botonCorreo: string;
      notaPendiente: string; cerrar: string;
    };
  };
  nav: { enlaces: Enlace[]; menu: string; temaOscuro: string; temaClaro: string };
  guia: { nombre: string; ocultar: string; mostrar: string; mensajes: Record<string, MensajeGuia> };
  portada: {
    etiqueta: string; titular: string; titularResaltado: string; subtitulo: string;
    roles: string[]; globo: string; ctaSecundario: string;
    insignias: { valor: string; texto: string }[];
    mockup: { capturaEscritorio: string; altEscritorio: string; capturaCelular: string; altCelular: string };
  };
  problema: {
    etiqueta: string; titulo: string; texto: string; notaCifras: string; pendiente: string; fuente: string;
    items: { icono: string; color: ColorAcento; titulo: string; texto: string; cifra?: CifraExterna; pregunta?: string }[];
  };
  libros: {
    etiqueta: string; titulo: string; texto: string; puntos: string[];
    pregunta: { texto: string; respuesta: string };
    circular: { texto: string; fuente: string; fuenteNombre: string };
    calculadora: {
      titulo: string; etiquetaEstudiantes: string; estudiantesPorDefecto: number;
      etiquetaCosto: string; costoPorDefecto: CifraExterna; costoPendiente: string;
      etiquetaPorcentaje: string; porcentajePorDefecto: number;
      resultadoTitulo: string; resultadoVacio: string; porEstudiante: string; notaHonesta: string;
    };
    maleta: { titulo: string; texto: string; pesoActual: CifraExterna; etiquetaPeso: string; pendiente: string };
  };
  recorrido: {
    etiqueta: string; titulo: string; texto: string;
    boton: string;
    roles: { id: string; nombre: string; pardo: EstadoPardo; globo: string; titulo: string; puntos: string[]; captura: string; alt: string }[];
  };
  modulos: {
    etiqueta: string; titulo: string; texto: string; verDetalle: string; virtud: string; diferencia: string; cerrar: string; cta: string; boton: string;
    items: ModuloLanding[];
  };
  demos: {
    etiqueta: string; titulo: string; texto: string;
    pregunta: { titulo: string; contexto: string; enunciado: string; opciones: string[]; correcta: number; bien: string; mal: string; inicio: string; otraVez: string };
    tablero: { titulo: string; subtitulo: string; barras: { grupo: string; valor: number }[]; nota: string; aviso: string };
    alerta: { titulo: string; estudiante: string; motivo: string; estados: string[]; acciones: string[]; notas: string[] };
    whatsapp: { titulo: string; contacto: string; estadoContacto: string; escribiendo: string; hora: string; mensaje: string; otraVez: string; nota: string };
  };
  video: {
    etiqueta: string; titulo: string;
    videos: { nombre: string; archivo: string; poster?: string; archivoVertical?: string; posterVertical?: string; descripcion: string }[];
  };
  comparativa: {
    etiqueta: string; titulo: string; texto: string; caracteristica: string; columnas: string[];
    leyenda: Record<ValorComparativa, string>; nota: string; deslizar: string;
    filas: { caracteristica: string; valores: ValorComparativa[] }[];
  };
  seguridad: { etiqueta: string; titulo: string; texto: string; items: { icono: string; titulo: string; texto: string; fuente?: string; fuenteNombre?: string }[] };
  empezamos: { etiqueta: string; titulo: string; texto: string; pasos: { titulo: string; texto: string }[] };
  faq: { etiqueta: string; titulo: string; items: { pregunta: string; respuesta: string; fuentes?: Fuente[] }[] };
  cierre: { titulo: string; texto: string; globo: string };
  pie: { texto: string; subtexto: string; arriba: string };
}

export interface ModuloLanding {
  id: string; icono: string; color: ColorAcento; nombre: string;
  virtud: string; diferencia: string; detalle: string[];
}
