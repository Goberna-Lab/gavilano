/* El catálogo de secciones del tema — lo que Bravo puede instanciar en una página.
 *
 * Es la fuente única: de acá sale `/site-manifest.json` (lo emite el plugin
 * `bravo-site-manifest` de `vite.config.ts`) y contra esto se valida
 * `content/seed.json`. A propósito NO existe un `.json` escrito a mano: se
 * desincroniza del código el primer día y el panel termina dejando editar campos
 * que no cambian nada.
 *
 * CUATRO REGLAS QUE NO SE NEGOCIAN (contrato de temas, ADR 0003 del repo bravo):
 *
 * 1. Un nombre de clase CSS NUNCA es contenido. Este sitio tiene una hoja por
 *    componente, así que una clase que sólo viviera en el JSON del seed o de la
 *    API no la escribió nadie en el código: no está en ninguna hoja y el sitio se
 *    rompe SIN error de build. Lo editable son VALORES (una URL, un texto).
 *
 * 2. Un número de maquetación no es contenido. El icono de cada pilar y su
 *    medida, el `+` de la cifra del medio, el recuadro del rótulo de tres hitos
 *    de la línea de tiempo, la forma en que cada proyecto parte su bajada, el
 *    `name` de cada campo del formulario: nada de eso cambia el mensaje del
 *    sitio. Vive en el componente, indexado por la MISMA posición que la lista.
 *
 * 3. `list` cuando el cliente agrega y quita; `fixed-list` cuando el diseño manda
 *    cuántos son. Acá todas las listas son fijas y eso es una decisión, no un
 *    descuido: cada una tiene del otro lado una constante por posición.
 *
 * 4. Los enlaces INTERNOS van como `text`, no como `url`. El tipo `url` rinde un
 *    `<input type="url">` y el navegador RECHAZA `/biografia` por no tener
 *    esquema, así que el cliente no puede guardarlo. Este sitio no tiene ningún
 *    enlace externo editable, así que NO usa `url` en ningún campo.
 *
 * QUÉ NO ESTÁ ACÁ Y POR QUÉ (para no buscarlo):
 *
 * - Las imágenes que viven en CSS (`Banner-mobile.png` del hero móvil, el fondo
 *   de paralaje, los iconos decorativos de la página de propuestas). Cambiarlas
 *   desde el panel exigiría mover cada una a un `<img>` o a una variable CSS, y
 *   eso mueve píxeles. Quedan como imágenes de marca.
 * - La cédula del simulacro (`src/data/cedula.ts`): son los partidos de la ONPE y
 *   su orden, no copy del candidato. Editarla desde el panel sería poder
 *   equivocarse en material didáctico electoral.
 * - Las tarjetas de artículos: salen de Bravo por `/v1/public/articles`, que ya
 *   funciona (N1). Acá sólo se edita el encabezado de la sección.
 * - El botón HABLEMOS de la cabecera: no es un enlace, hace scroll al pie. No
 *   tiene `href`, así que no puede ser un ítem de menú.
 */
/* La extensión .ts es obligatoria y no es un descuido: `vite.config.ts` importa
   este archivo (para emitir el manifest) y vive en el proyecto de tsconfig.node,
   que resuelve con reglas de Node ESM. Sin la extensión, `tsc -b` falla con
   TS2835 aunque el resto del sitio importe sin ella. */
import type { ManifestField, SectionType, SiteManifestV2 } from './manifest.ts'

/* ── Atajos ──────────────────────────────────────────────────────────────── */

const texto = (key: string, label: string, help?: string): ManifestField => ({
  key,
  type: 'text',
  label,
  ...(help ? { help } : {}),
})

const area = (key: string, label: string, help?: string): ManifestField => ({
  key,
  type: 'textarea',
  label,
  ...(help ? { help } : {}),
})

const imagen = (key: string, label: string, help?: string): ManifestField => ({
  key,
  type: 'image',
  label,
  ...(help ? { help } : {}),
})

const AYUDA_ENLACE_INTERNO =
  'Destino dentro del sitio: una ruta como «/biografia» o un ancla como «#sumate».'

const AYUDA_SALTO =
  'Cada línea nueva es un salto de línea en el sitio; así está dibujado el diseño.'

const AYUDA_ALT = 'Se lee en voz alta a quien navega con lector de pantalla.'

const AYUDA_DESTACADO =
  'Va en negrita al principio del párrafo; el resto sigue en el campo de abajo.'

/* ── Portada ─────────────────────────────────────────────────────────────── */

const hero: SectionType = {
  key: 'hero',
  title: 'Portada',
  description: 'La foto a sangre con «EXPERIENCIA PARA SERVIR» y el botón.',
  icon: 'user',
  unique: true,
  fields: [
    texto('titulo', 'Primera palabra', 'La grande de arriba.'),
    texto('subtitulo', 'Segunda palabra'),
    texto('subtitulo2', 'Tercera palabra', 'La que va en cursiva, al lado del botón.'),
    texto('botonEtiqueta', 'Texto del botón'),
    texto('botonDestino', 'Destino del botón', AYUDA_ENLACE_INTERNO),
    imagen('imagenFondo', 'Fotografía de fondo', 'Sólo la de escritorio: la de móvil está en la hoja de estilos.'),
  ],
}

const conoceme: SectionType = {
  key: 'conoceme',
  title: 'Conóceme',
  description: 'El nombre, la presentación y los cuatro pilares con sus iconos.',
  icon: 'user',
  unique: true,
  fields: [
    texto('encabezado', 'Rótulo sobre el nombre'),
    texto('nombreLinea1', 'Nombre, primera línea'),
    texto('nombreLinea2', 'Nombre, segunda línea'),
    texto('descripcionLinea1', 'Presentación, primera línea'),
    texto('descripcionLinea2a', 'Presentación, segunda línea'),
    texto('descripcionLinea2b', 'Presentación, tercera línea'),
    {
      key: 'pilares',
      type: 'fixed-list',
      label: 'Pilares',
      help: 'Son cuatro y cada uno tiene su icono y su medida en el diseño; se cambia qué dicen, no cuántos son ni con qué icono van.',
      entries: [
        { label: 'Primero (icono de obras)' },
        { label: 'Segundo (icono de seguridad)' },
        { label: 'Tercero (icono de oportunidades)' },
        { label: 'Cuarto (icono de salud)' },
      ],
      fields: [
        texto('titulo', 'Título'),
        area('descripcion', 'Descripción', AYUDA_SALTO),
      ],
    },
    texto('botonEtiqueta', 'Texto del botón'),
    texto('botonDestino', 'Destino del botón', AYUDA_ENLACE_INTERNO),
    imagen('imagenEscritorio', 'Fotografía (escritorio)'),
    imagen('imagenMovil', 'Fotografía (móvil)'),
  ],
}

const unaVidaDeServicio: SectionType = {
  key: 'una-vida-de-servicio',
  title: 'Una vida de servicio',
  description: 'La frase «no vengo a improvisar», la cita y las tres cifras.',
  icon: 'award',
  unique: true,
  fields: [
    texto('encabezado', 'Rótulo'),
    texto('subtitulo', 'Titular, primera línea'),
    texto('subtituloItalica', 'Titular en cursiva'),
    texto('citaEscritorio', 'Cita (escritorio)', 'En escritorio entra en un solo renglón.'),
    area('citaMovil', 'Cita (móvil)', 'La misma frase, partida como la parte el diseño en pantallas chicas. Un renglón por línea.'),
    texto('tituloDerecha', 'Título de la columna derecha'),
    area('textoDerecha', 'Texto de la columna derecha'),
    {
      key: 'cifras',
      type: 'fixed-list',
      label: 'Cifras',
      help: 'Son tres. El «+» de la del medio es del diseño, no se escribe acá.',
      entries: [
        { label: 'Primera (años de servicio)' },
        { label: 'Segunda (lleva «+» delante)' },
        { label: 'Tercera (gestiones)' },
      ],
      fields: [
        texto('numero', 'Número', 'Va tal cual, así que «03» sale con el cero.'),
        area('etiqueta', 'Rótulo', AYUDA_SALTO),
      ],
    },
  ],
}

const experienciaDestacada: SectionType = {
  key: 'experiencia-destacada',
  title: 'Experiencia que construye',
  description: 'El retrato con «más de dos décadas de experiencia» y el botón.',
  icon: 'chart',
  unique: true,
  fields: [
    texto('rotulo', 'Rótulo sobre el titular'),
    texto('tituloPrimario', 'Titular, primera parte'),
    area('tituloSecundario', 'Titular, parte destacada', AYUDA_SALTO),
    texto('tituloSubtitulo', 'Bajada del titular'),
    texto('botonEtiqueta', 'Texto del botón'),
    texto('botonDestino', 'Destino del botón', AYUDA_ENLACE_INTERNO),
    imagen('imagenEscritorio', 'Retrato (escritorio)'),
    imagen('imagenMovil', 'Retrato (móvil)'),
    texto('imagenAlt', 'Descripción del retrato', AYUDA_ALT),
  ],
}

/* Los campos de «Mi aporte». Se declaran aparte porque hay DOS tipos de sección
   que los comparten: el de la portada y el de su página propia, que se dibujan con
   el mismo componente y una clase de más.
   Dos claves y no UN tipo con un campo «variante» por la regla 4 (P6): en v1 no
   existe el tipo de campo `select`, así que «variante» sería un `text` libre y el
   cliente podría escribir cualquier cosa que el componente no sabe traducir. Con
   dos tipos el picker queda explícito y no hay valor inválido posible. */
const camposAporte: ManifestField[] = [
  texto('encabezado', 'Rótulo'),
  texto('subtituloLinea1', 'Titular, primera línea'),
  texto('subtituloLinea2', 'Titular, segunda línea'),
  texto('subtituloItalica', 'Titular en cursiva'),
  texto('descEscritorio1', 'Bajada (escritorio), primera línea'),
  texto('descEscritorioConector', 'Bajada (escritorio), conector', 'La palabra suelta entre las dos líneas.'),
  texto('descEscritorio2a', 'Bajada (escritorio), segunda línea'),
  texto('descEscritorio2b', 'Bajada (escritorio), tercera línea'),
  texto('descEscritorioNota', 'Bajada (escritorio), remate'),
  texto('descMovil1', 'Bajada (móvil), primera línea', 'Sale entera en negrita.'),
  texto('descMovil2Destacado', 'Bajada (móvil), segunda línea en negrita'),
  texto('descMovil2Resto', 'Bajada (móvil), segunda línea, resto'),
  texto('descMovil3', 'Bajada (móvil), tercera línea'),
  texto('descMovilNota', 'Bajada (móvil), remate'),
  {
    key: 'proyectos',
    type: 'fixed-list',
    label: 'Proyectos',
    help: 'Son cinco y cada uno tiene su lugar en la barra de navegación y su forma de partir la bajada; se cambia qué dicen y con qué foto, no cuántos son.',
    entries: [
      { label: 'Casa del Adulto Mayor' },
      { label: 'Skate Park' },
      { label: 'FestiRock' },
      { label: 'Boulevard Morales Duárez' },
      { label: 'Carmen Digital' },
    ],
    fields: [
      texto('nombre', 'Nombre', 'Es lo que dice la pestaña de la barra.'),
      texto('destacado', 'Bajada en negrita', AYUDA_DESTACADO),
      area('resto', 'Bajada, resto'),
      imagen('imagen', 'Fotografía'),
    ],
  },
]

const miAporte: SectionType = {
  key: 'mi-aporte',
  title: 'Mi aporte al distrito',
  description: 'Los cinco proyectos con su barra de pestañas y su foto.',
  icon: 'star',
  unique: true,
  fields: camposAporte,
}

const miAportePagina: SectionType = {
  ...miAporte,
  key: 'mi-aporte-pagina',
  title: 'Mi aporte al distrito (página propia)',
  description: 'Lo mismo que en la portada, con la maquetación de página completa.',
}

const historias: SectionType = {
  key: 'historias',
  title: 'Historias que construyen futuro',
  description: 'El video de YouTube con su portada.',
  icon: 'image',
  unique: true,
  fields: [
    texto('textoLinea1', 'Titular, primera línea'),
    texto('textoLinea2', 'Titular, segunda línea'),
    texto('videoId', 'Identificador del video de YouTube', 'Es lo que va después de «v=» en la dirección del video. La portada la trae YouTube sola.'),
    texto('videoTitulo', 'Título del video', 'No se ve: lo anuncia un lector de pantalla.'),
  ],
}

const propuestasIntro: SectionType = {
  key: 'propuestas-intro',
  title: 'Mis propuestas',
  description: 'El bloque de «orden y oportunidades» de la portada.',
  icon: 'megaphone',
  unique: true,
  fields: [
    texto('encabezado', 'Rótulo'),
    texto('subtituloLinea1', 'Titular, primera línea'),
    texto('subtituloLinea2', 'Titular, segunda línea'),
    texto('subtituloLinea3', 'Titular, tercera línea'),
    texto('subtituloItalica', 'Titular en cursiva'),
    texto('descripcionDestacado', 'Bajada en negrita', AYUDA_DESTACADO),
    area('descripcionResto', 'Bajada, resto', AYUDA_SALTO),
  ],
}

const articulos: SectionType = {
  key: 'articulos',
  title: 'Mis artículos',
  description: 'El encabezado de las notas. Las tarjetas salen solas de los artículos publicados.',
  icon: 'newspaper',
  unique: true,
  fields: [
    texto('encabezado', 'Rótulo'),
    texto('subtituloLinea', 'Titular'),
    texto('subtituloItalica', 'Titular en cursiva'),
    {
      key: 'intro',
      type: 'fixed-list',
      label: 'Bajada',
      help: 'Son cuatro renglones y el diseño los parte así. En cada uno se elige qué parte va en negrita; dejá la negrita vacía si el renglón entero va normal.',
      entries: [
        { label: 'Primer renglón' },
        { label: 'Segundo renglón' },
        { label: 'Tercer renglón' },
        { label: 'Cuarto renglón' },
      ],
      fields: [
        texto('destacado', 'Parte en negrita'),
        texto('resto', 'Resto del renglón'),
      ],
    },
    texto('verTodosEtiqueta', 'Texto del enlace «ver todos»'),
    texto('verTodosDestino', 'Destino del enlace', AYUDA_ENLACE_INTERNO),
  ],
}

const simulacro: SectionType = {
  key: 'simulacro',
  title: 'Simulacro de voto',
  description: 'El encabezado del simulacro. La cédula es material de la ONPE y vive en el código.',
  icon: 'file',
  unique: true,
  fields: [
    texto('encabezado', 'Rótulo'),
    texto('tituloLinea', 'Titular'),
    texto('tituloItalica', 'Titular en cursiva'),
    area('intro', 'Instrucciones'),
  ],
}

const sumate: SectionType = {
  key: 'sumate',
  title: 'Súmate (formulario)',
  description: 'El formulario de contacto. Los mensajes llegan al panel, en «Mensajes».',
  icon: 'mail',
  unique: true,
  fields: [
    texto('encabezado', 'Rótulo'),
    texto('subtituloLinea1', 'Titular, primera línea'),
    texto('subtituloLinea2', 'Titular, segunda línea'),
    texto('subtituloItalica', 'Titular en cursiva'),
    texto('descTitulo', 'Título de la bajada'),
    area('descTexto', 'Texto de la bajada'),
    {
      key: 'campos',
      type: 'fixed-list',
      label: 'Campos del formulario',
      help: 'Son seis, en el orden del diseño. Cambiar lo que dicen no cambia lo que se guarda: el nombre interno de cada campo vive en el código. Quitar uno de acá no lo saca del formulario.',
      entries: [
        { label: 'Nombres' },
        { label: 'Apellidos' },
        { label: 'Correo' },
        { label: 'Teléfono' },
        { label: 'Motivo (lista desplegable)' },
        { label: 'Mensaje' },
      ],
      fields: [
        texto('etiqueta', 'Etiqueta'),
        texto('marcador', 'Texto de ejemplo', 'El gris que se ve antes de escribir. En el motivo es la opción «Seleccione».'),
      ],
    },
    {
      key: 'motivoOpciones',
      type: 'fixed-list',
      label: 'Opciones del motivo',
      help: 'Son cuatro. Se cambia lo que leen los visitantes; el valor que viaja al panel vive en el código, así que renombrarlas no rompe los mensajes ya recibidos.',
      entries: [
        { label: 'Quiero sumarme' },
        { label: 'Deseo más información' },
        { label: 'Tengo una propuesta' },
        { label: 'Otro' },
      ],
      fields: [texto('texto', 'Texto de la opción')],
    },
    texto('enviarEtiqueta', 'Texto del botón'),
    texto('enviandoEtiqueta', 'Texto del botón mientras envía'),
    area('errorTexto', 'Aviso de error'),
    area('exitoTexto', 'Aviso de envío recibido'),
  ],
}

/* ── Biografía ───────────────────────────────────────────────────────────── */

const biografiaHero: SectionType = {
  key: 'biografia-hero',
  title: 'Biografía — portada',
  description: 'La foto de cabecera con «una vida dedicada a…».',
  icon: 'user',
  unique: true,
  fields: [
    texto('titulo', 'Titular'),
    texto('subtituloLinea1', 'Titular grande, primera línea'),
    texto('subtituloLinea2', 'Titular grande, segunda línea'),
    imagen('imagen', 'Fotografía'),
  ],
}

/* Las cuatro tarjetas de la biografía son cuatro tipos y no uno repetido: cada
   una tiene su propio prefijo de clases en la hoja de estilos
   (`biografia-roots-*`, `-formation-*`, `-service-*`, `-results-*`) y su propia
   maquetación. Unificarlas cambiaría el HTML, y esta migración no mueve un píxel. */
const camposTarjetaBiografia = (conSalto: boolean): ManifestField[] => [
  imagen('icono', 'Icono'),
  texto('tituloLinea1', 'Título, primera línea'),
  texto('tituloLinea2', 'Título, segunda línea'),
  texto('textoDestacado', 'Primera frase en negrita', AYUDA_DESTACADO),
  area(
    'texto',
    'Resto del texto',
    conSalto ? 'Arranca en un renglón nuevo, debajo de la frase en negrita.' : undefined,
  ),
  imagen('imagen', 'Fotografía'),
  texto('imagenAlt', 'Descripción de la fotografía', AYUDA_ALT),
]

const biografiaRaices: SectionType = {
  key: 'biografia-raices',
  title: 'Biografía — mi vida y raíces',
  icon: 'heart',
  unique: true,
  fields: camposTarjetaBiografia(true),
}

const biografiaFormacion: SectionType = {
  key: 'biografia-formacion',
  title: 'Biografía — formación y juventud',
  icon: 'users',
  unique: true,
  fields: camposTarjetaBiografia(false),
}

const biografiaTrayectoria: SectionType = {
  key: 'biografia-trayectoria',
  title: 'Biografía — trayectoria política',
  icon: 'award',
  unique: true,
  fields: camposTarjetaBiografia(false),
}

const biografiaResultados: SectionType = {
  key: 'biografia-resultados',
  title: 'Biografía — visión de resultados',
  description: 'La última tarjeta, la que lleva tres frases en negrita repartidas por el texto.',
  icon: 'star',
  unique: true,
  fields: [
    imagen('icono', 'Icono'),
    texto('tituloLinea1', 'Título, primera línea'),
    texto('tituloLinea2', 'Título, segunda línea'),
    {
      key: 'tramos',
      type: 'fixed-list',
      label: 'Texto',
      help: 'El párrafo va partido en tres tramos y cada uno arranca con una frase en negrita; así está dibujado el diseño.',
      entries: [
        { label: 'Primer tramo' },
        { label: 'Segundo tramo' },
        { label: 'Tercer tramo' },
      ],
      fields: [
        texto('destacado', 'Frase en negrita'),
        area('texto', 'Texto que la sigue'),
      ],
    },
    imagen('imagen', 'Fotografía'),
    texto('imagenAlt', 'Descripción de la fotografía', AYUDA_ALT),
  ],
}

/* ── Experiencia ─────────────────────────────────────────────────────────── */

/* Los cargos van como `fixed-list` y NO como `list`, aunque una biografía política
   crezca y el cliente vaya a querer sumar el cargo del año que viene. El motivo es
   que el diseño le pone a tres de los nueve un recuadro alrededor del rótulo y al
   último los años en cuerpo más chico, sin ningún patrón semántico detrás: son
   decoración por posición. Con `list` esas dos marcas tendrían que viajar como
   contenido, y en v1 no hay tipo `select` (regla 4 / P6), así que serían dos campos
   de texto libre donde el cliente escribe una palabra mágica — el mismo agujero que
   evitamos en «Mi aporte». Elegimos que no se pueda sumar un cargo antes que dejar
   dos campos que se rompen con un typo y no avisan.
   Sumar el décimo es un cambio de código de cinco minutos: una entrada más acá, una
   más en el seed, y revisar RECUADRO/COMPACTO en el componente. */
const experienciaLineaDeTiempo: SectionType = {
  key: 'experiencia-linea-de-tiempo',
  title: 'Línea de tiempo',
  description: 'Los nueve cargos, del más reciente al más antiguo, y el resumen del final.',
  icon: 'calendar',
  unique: true,
  fields: [
    area('introTexto', 'Entrada', AYUDA_SALTO),
    area('introDestacado', 'Entrada, parte resaltada', AYUDA_SALTO),
    imagen('introImagen', 'Fotografía de la entrada'),
    texto('introImagenAlt', 'Descripción de la fotografía', AYUDA_ALT),
    {
      key: 'hitos',
      type: 'fixed-list',
      label: 'Cargos',
      help: 'Son nueve y van del más reciente al más antiguo. Se cambia qué dicen y con qué foto, no cuántos son ni de qué lado cae la foto. Sumar un cargo nuevo pide tocar el código; está explicado en el CLAUDE.md del repo.',
      entries: [
        { label: '2022 — Abogado' },
        { label: '2015–2017 — Asesoría' },
        { label: '2011–2014 — Consejero' },
        { label: '2007–2010 — Gestión (rótulo en recuadro)' },
        { label: '2003–2006 — Fiscalización (rótulo en recuadro)' },
        { label: '1999–2002 — Asesor' },
        { label: '1996–1998 — Liderazgo' },
        { label: '1994–1995 — Alcaldía (rótulo en recuadro)' },
        { label: '1993–1994 — Inicio (años en cuerpo más chico)' },
      ],
      fields: [
        texto('anio', 'Años'),
        texto('rotulo', 'Rótulo'),
        texto('cargo', 'Cargo'),
        area('detalle', 'Detalle', 'Opcional: dejalo vacío y no se dibuja.'),
        imagen('imagen', 'Fotografía'),
        texto('imagenAlt', 'Descripción de la fotografía', AYUDA_ALT),
      ],
    },
    texto('resumenTitulo', 'Título del resumen'),
    area('resumenTexto', 'Texto del resumen'),
  ],
}

/* ── Propuestas ──────────────────────────────────────────────────────────── */

const propuestasDetalle: SectionType = {
  key: 'propuestas-detalle',
  title: 'Propuestas — desarrollo',
  description: 'Las cinco categorías y el texto largo de la propuesta abierta.',
  icon: 'megaphone',
  unique: true,
  fields: [
    {
      key: 'categorias',
      type: 'fixed-list',
      label: 'Categorías',
      help: 'Son cinco y cada una tiene su icono en el diseño; se cambia cómo se llaman, no cuántas son.',
      entries: [
        { label: 'Educación y desarrollo' },
        { label: 'Juventud y oportunidades' },
        { label: 'Seguridad ciudadana' },
        { label: 'Desarrollo social' },
        { label: 'Modernización tecnológica' },
      ],
      fields: [texto('etiqueta', 'Nombre de la categoría')],
    },
    texto('titulo', 'Título'),
    texto('entradaDestacado', 'Entrada en negrita', AYUDA_DESTACADO),
    area('entradaResto', 'Entrada, resto'),
    {
      key: 'parrafos',
      type: 'fixed-list',
      label: 'Cuerpo',
      help: 'Tres párrafos. El tercero no lleva negrita: dejá ese campo vacío.',
      entries: [
        { label: 'Primer párrafo' },
        { label: 'Segundo párrafo' },
        { label: 'Tercer párrafo (sin negrita)' },
      ],
      fields: [
        texto('destacado', 'Frase en negrita'),
        area('texto', 'Texto'),
      ],
    },
    imagen('imagen', 'Fotografía'),
    texto('imagenAlt', 'Descripción de la fotografía', AYUDA_ALT),
  ],
}

/* ── El catálogo y el manifest ───────────────────────────────────────────── */

export const CATALOGO: SectionType[] = [
  hero,
  conoceme,
  unaVidaDeServicio,
  experienciaDestacada,
  miAporte,
  miAportePagina,
  historias,
  propuestasIntro,
  articulos,
  simulacro,
  sumate,
  biografiaHero,
  biografiaRaices,
  biografiaFormacion,
  biografiaTrayectoria,
  biografiaResultados,
  experienciaLineaDeTiempo,
  propuestasDetalle,
]

export const MANIFEST: SiteManifestV2 = {
  version: 2,
  sectionTypes: CATALOGO,
  menus: [
    { key: 'principal', label: 'Menú de la cabecera' },
    { key: 'pie', label: 'Enlaces del pie' },
  ],
  /* Lo que vive en el CÓDIGO del tema y por eso el menú puede apuntarlo aunque no
     sea una página de Bravo. `/articulos` y `/articulos/<slug>` siguen siendo
     rutas de código: las dibuja la lista de notas, que ya funciona (N1).

     CON barra final, y no es un descuido. El prerender escribe
     `dist/articulos/index.html`, así que el servidor sirve 200 en `/articulos/` y
     **301 a `/articulos/`** cuando le piden `/articulos`. Medido en producción el
     2026-09-05:

       /articulos   → 301 https://juandediosgavilano.com/articulos/
       /articulos/  → 200

     O sea que acá la regla es la contraria a la de Barrionuevo (donde el docroot
     no redirige y la barra sobraba): la URL que contesta sin rebote es la que
     lleva barra. Es además la forma que le va a dar Bravo a las páginas —el
     Contrato 3 resuelve `page` como `/${slug}/`— así que el menú entero queda
     coherente en vez de mezclar las dos formas. */
  fixedRoutes: [{ path: '/articulos/', label: 'Artículos' }],
  /* `preview` NO se declara todavía: la ruta /preview/ no existe (es la fase 6) y
     declararla dejaría al panel embebiendo un 404. */
}

/** El título de un tipo, para los avisos. Un tipo que no conoce vuelve tal cual. */
export function tituloDeTipo(key: string): string {
  return CATALOGO.find((tipo) => tipo.key === key)?.title ?? key
}
