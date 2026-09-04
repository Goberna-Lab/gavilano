// Datos de la cédula "ELECCIONES REGIONALES Y MUNICIPALES 2026 — Carmen de la
// Legua Reynoso". Réplica didáctica: los colores por columna son los del
// documento original (ver SimulacroSection.css), no los de la paleta del sitio.
//
// Las filas en blanco existen en la cédula real y también son marcables:
// marcarlas cuenta como respuesta incorrecta.

export type Fila = {
  id: string
  nombre: string | null
  logo: string | null
}

export type Columna = {
  id: string
  titulo: string
  subtitulo?: string
  color: string
  filas: Fila[]
}

/** Fila correcta (Fuerza Popular) en las 4 columnas. */
export const FILA_CORRECTA = 'f8'

export const INSTRUCCION_COLUMNA =
  'Marque con una cruz + o un aspa ✗ dentro del recuadro del símbolo de su preferencia'

export const CEDULA_TITULO = 'ELECCIONES REGIONALES Y MUNICIPALES 2026'

const vacia = (id: string): Fila => ({ id, nombre: null, logo: null })

export const columnas: Columna[] = [
  {
    id: 'gobernador',
    titulo: 'Gobernador y Vicegobernador Regional',
    color: '#C2EBEF',
    filas: [
      vacia('f1'),
      { id: 'f2', nombre: 'Partido Acción Popular', logo: 'accion-popular.png' },
      { id: 'f3', nombre: 'Renovación Popular', logo: 'renovacion-popular.png' },
      vacia('f4'),
      vacia('f5'),
      { id: 'f6', nombre: 'Partido Popular Cristiano', logo: 'ppc.png' },
      { id: 'f7', nombre: 'Frepap', logo: 'frepap.png' },
      { id: 'f8', nombre: 'Fuerza Popular', logo: 'fuerza-popular.png' },
      { id: 'f9', nombre: 'Avanza País', logo: 'avanza-pais.png' },
      vacia('f10'),
      { id: 'f11', nombre: 'Partido del Buen Gobierno', logo: 'buen-gobierno.png' },
      { id: 'f12', nombre: 'Somos Perú', logo: 'somos-peru.png' },
      vacia('f13'),
    ],
  },
  {
    id: 'consejero',
    titulo: 'Consejero Regional',
    subtitulo: 'Provincia de Callao',
    color: '#DFBDD6',
    filas: [
      vacia('f1'),
      { id: 'f2', nombre: 'Partido Acción Popular', logo: 'accion-popular.png' },
      { id: 'f3', nombre: 'Renovación Popular', logo: 'renovacion-popular.png' },
      vacia('f4'),
      vacia('f5'),
      { id: 'f6', nombre: 'Partido Popular Cristiano', logo: 'ppc.png' },
      { id: 'f7', nombre: 'Frepap', logo: 'frepap.png' },
      { id: 'f8', nombre: 'Fuerza Popular', logo: 'fuerza-popular.png' },
      { id: 'f9', nombre: 'Avanza País', logo: 'avanza-pais.png' },
      vacia('f10'),
      { id: 'f11', nombre: 'Partido del Buen Gobierno', logo: 'buen-gobierno.png' },
      { id: 'f12', nombre: 'Somos Perú', logo: 'somos-peru.png' },
      vacia('f13'),
    ],
  },
  {
    id: 'provincia',
    titulo: 'Provincia del Callao',
    color: '#CFB9B2',
    filas: [
      vacia('f1'),
      vacia('f2'),
      { id: 'f3', nombre: 'Renovación Popular', logo: 'renovacion-popular.png' },
      vacia('f4'),
      vacia('f5'),
      { id: 'f6', nombre: 'Partido Popular Cristiano', logo: 'ppc.png' },
      vacia('f7'),
      { id: 'f8', nombre: 'Fuerza Popular', logo: 'fuerza-popular.png' },
      vacia('f9'),
      vacia('f10'),
      { id: 'f11', nombre: 'Partido del Buen Gobierno', logo: 'buen-gobierno.png' },
      { id: 'f12', nombre: 'Somos Perú', logo: 'somos-peru.png' },
      { id: 'f13', nombre: 'Alianza Regional por el Perú', logo: 'alianza-regional.png' },
    ],
  },
  {
    id: 'distrito',
    titulo: 'Distrito de Carmen de la Legua Reynoso',
    color: '#C3E7CE',
    filas: [
      { id: 'f1', nombre: 'Alianza Para el Progreso', logo: 'alianza-para-el-progreso.png' },
      { id: 'f2', nombre: 'Acción Popular', logo: 'accion-popular.png' },
      { id: 'f3', nombre: 'Renovación Popular', logo: 'renovacion-popular.png' },
      { id: 'f4', nombre: 'Partido Demócrata Verde', logo: 'democrata-verde.png' },
      { id: 'f5', nombre: 'Partido Político PRIN', logo: 'prin.png' },
      vacia('f6'),
      vacia('f7'),
      { id: 'f8', nombre: 'Fuerza Popular', logo: 'fuerza-popular.png' },
      { id: 'f9', nombre: 'Avanza País', logo: 'avanza-pais.png' },
      { id: 'f10', nombre: 'Primero la gente', logo: 'primero-la-gente.png' },
      vacia('f11'),
      vacia('f12'),
      vacia('f13'),
    ],
  },
]
