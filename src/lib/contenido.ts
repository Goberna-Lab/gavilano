/* La forma del `content` de cada tipo de sección — el mismo objeto que produce el
 * editor de campos del panel para los `fields` de ese tipo en `catalogo.ts`. Cada
 * componente recibe uno de éstos y NO sabe de dónde vino: puede ser Bravo o el seed.
 *
 * REGLA DEL CONTRATO DE TEMAS: acá nunca viaja un nombre de clase CSS. Lo que viaja
 * son VALORES —una URL, un texto— que el componente pasa a un `src` o dibuja. Una
 * clase que sólo existiera dentro del JSON no la escribió nadie en ninguna hoja de
 * estilos: el sitio se rompe SIN error de build.
 *
 * Y los números de maquetación NO son contenido: el icono de cada pilar y su medida,
 * el `+` de la cifra del medio, la forma en que cada proyecto parte su bajada, el
 * lado en que cae cada foto de la línea de tiempo y el `name` de cada campo del
 * formulario viven en el componente, indexados por posición. Por eso casi toda lista
 * es `fixed-list` en el catálogo.
 */
import type { SectionValues } from './manifest.ts'

/**
 * Lo que recibe todo componente de sección. Es `SectionInstance` sin `id` ni `type`:
 * eso lo consume el renderizador, no la sección.
 */
export interface PropsSeccion<T> {
  content: T
  /** Va al `<section>` PROPIO del componente, nunca a un envoltorio: el desfase del
      scroll bajo la cabecera pegajosa depende de en qué elemento cae. */
  anchor?: string
}

/**
 * Le pone nombre al contenido de una sección.
 *
 * El panel ya garantizó su forma contra el catálogo y `seed.test.ts` la comprueba en
 * el seed, así que acá no queda nada que validar: sólo decir de qué tipo es. Si el
 * tema empezara a validar habría dos fuentes de verdad.
 */
export function moldeDelCatalogo<T>(content: SectionValues): T {
  return content as T
}

/* ── Piezas que se repiten ───────────────────────────────────────────────── */

/** Un párrafo que arranca con una frase en negrita. */
export interface Tramo {
  destacado: string
  texto: string
}

/* ── Portada ─────────────────────────────────────────────────────────────── */

export interface ContenidoHero {
  titulo: string
  subtitulo: string
  subtitulo2: string
  botonEtiqueta: string
  botonDestino: string
  imagenFondo: string
}

export interface ContenidoConoceme {
  encabezado: string
  nombreLinea1: string
  nombreLinea2: string
  descripcionLinea1: string
  descripcionLinea2a: string
  descripcionLinea2b: string
  /** Exactamente 4: el icono de cada uno y su medida viven en el componente. */
  pilares: { titulo: string; descripcion: string }[]
  botonEtiqueta: string
  botonDestino: string
  imagenEscritorio: string
  imagenMovil: string
}

export interface ContenidoUnaVidaDeServicio {
  encabezado: string
  subtitulo: string
  subtituloItalica: string
  citaEscritorio: string
  /** Con saltos: el diseño la parte en dos renglones en pantallas chicas. */
  citaMovil: string
  tituloDerecha: string
  textoDerecha: string
  /** Exactamente 3. El `+` de la segunda es del diseño, no del contenido. */
  cifras: { numero: string; etiqueta: string }[]
}

export interface ContenidoExperienciaDestacada {
  rotulo: string
  tituloPrimario: string
  tituloSecundario: string
  tituloSubtitulo: string
  botonEtiqueta: string
  botonDestino: string
  imagenEscritorio: string
  imagenMovil: string
  imagenAlt: string
}

export interface ContenidoMiAporte {
  encabezado: string
  subtituloLinea1: string
  subtituloLinea2: string
  subtituloItalica: string
  descEscritorio1: string
  descEscritorioConector: string
  descEscritorio2a: string
  descEscritorio2b: string
  descEscritorioNota: string
  descMovil1: string
  descMovil2Destacado: string
  descMovil2Resto: string
  descMovil3: string
  descMovilNota: string
  /** Exactamente 5: la pestaña y la forma de la bajada de cada uno son del diseño. */
  proyectos: { nombre: string; destacado: string; resto: string; imagen: string }[]
}

export interface ContenidoHistorias {
  textoLinea1: string
  textoLinea2: string
  videoId: string
  videoTitulo: string
}

export interface ContenidoPropuestasIntro {
  encabezado: string
  subtituloLinea1: string
  subtituloLinea2: string
  subtituloLinea3: string
  subtituloItalica: string
  descripcionDestacado: string
  /** Con saltos: el diseño lo parte en cuatro renglones. */
  descripcionResto: string
}

export interface ContenidoArticulos {
  encabezado: string
  subtituloLinea: string
  subtituloItalica: string
  /** Exactamente 4 renglones; `destacado` vacío = el renglón entero va normal. */
  intro: { destacado: string; resto: string }[]
  verTodosEtiqueta: string
  verTodosDestino: string
}

export interface ContenidoSimulacro {
  encabezado: string
  tituloLinea: string
  tituloItalica: string
  intro: string
}

export interface ContenidoSumate {
  encabezado: string
  subtituloLinea1: string
  subtituloLinea2: string
  subtituloItalica: string
  descTitulo: string
  descTexto: string
  /** Exactamente 6, en el orden del diseño. El `name` de cada uno vive en el
      componente: quitar uno de acá no lo saca del formulario. */
  campos: { etiqueta: string; marcador: string }[]
  /** Exactamente 4. El valor que viaja al panel vive en el componente. */
  motivoOpciones: { texto: string }[]
  enviarEtiqueta: string
  enviandoEtiqueta: string
  errorTexto: string
  exitoTexto: string
}

/* ── Biografía ───────────────────────────────────────────────────────────── */

export interface ContenidoBiografiaHero {
  titulo: string
  subtituloLinea1: string
  subtituloLinea2: string
  imagen: string
}

/** Las tres tarjetas de una sola frase en negrita: raíces, formación, trayectoria. */
export interface ContenidoBiografiaTarjeta {
  icono: string
  tituloLinea1: string
  tituloLinea2: string
  textoDestacado: string
  texto: string
  imagen: string
  imagenAlt: string
}

/** La última, que lleva tres frases en negrita repartidas por el párrafo. */
export interface ContenidoBiografiaResultados {
  icono: string
  tituloLinea1: string
  tituloLinea2: string
  /** Exactamente 3. */
  tramos: Tramo[]
  imagen: string
  imagenAlt: string
}

/* ── Experiencia ─────────────────────────────────────────────────────────── */

export interface ContenidoExperienciaLineaDeTiempo {
  /** Con saltos; los `<br />` sólo se ven en escritorio. */
  introTexto: string
  introDestacado: string
  introImagen: string
  introImagenAlt: string
  /** Exactamente 9, del más reciente al más antiguo. El lado en que cae la foto,
      el recuadro del rótulo y el cuerpo de los años son del diseño, por posición. */
  hitos: {
    anio: string
    rotulo: string
    cargo: string
    /** Vacío = no se dibuja. */
    detalle: string
    imagen: string
    imagenAlt: string
  }[]
  resumenTitulo: string
  resumenTexto: string
}

/* ── Propuestas ──────────────────────────────────────────────────────────── */

export interface ContenidoPropuestasDetalle {
  /** Exactamente 5: el icono de cada una vive en el componente, por posición. */
  categorias: { etiqueta: string }[]
  titulo: string
  entradaDestacado: string
  entradaResto: string
  /** Exactamente 3; el tercero va sin negrita y los separadores son del diseño. */
  parrafos: Tramo[]
  imagen: string
  imagenAlt: string
}
