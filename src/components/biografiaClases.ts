/* Los nombres de clase de las tres tarjetas de biografía.
 *
 * Viven en su propio archivo y no junto al componente porque un módulo que exporta
 * un componente Y constantes rompe el fast refresh de Vite (`react-refresh`).
 *
 * Van escritos enteros y no armados con `biografia-${prefijo}-copy` para que
 * buscarlos en el repo los encuentre: cada uno existe tal cual en
 * `pages/BiografiaPage.css`, con sus propias medidas. Ésa es la razón por la que
 * las tres tarjetas son tres tipos de sección distintos y no uno repetido —
 * unificarlas cambiaría el HTML.
 */
export interface ClasesTarjeta {
  card: string
  copy: string
  icon: string
  title: string
  titleId: string
  text: string
  image: string
}

export const CLASES_RAICES: ClasesTarjeta = {
  card: 'biografia-roots-card',
  copy: 'biografia-roots-copy',
  icon: 'biografia-roots-icon',
  title: 'biografia-roots-title',
  titleId: 'biografia-roots-title',
  text: 'biografia-roots-text',
  image: 'biografia-roots-image',
}

export const CLASES_FORMACION: ClasesTarjeta = {
  card: 'biografia-formation-card',
  copy: 'biografia-formation-copy',
  icon: 'biografia-formation-icon',
  title: 'biografia-formation-title',
  titleId: 'biografia-formation-title',
  text: 'biografia-formation-text',
  image: 'biografia-formation-image',
}

export const CLASES_TRAYECTORIA: ClasesTarjeta = {
  card: 'biografia-service-card',
  copy: 'biografia-service-copy',
  icon: 'biografia-service-icon',
  title: 'biografia-service-title',
  titleId: 'biografia-service-title',
  text: 'biografia-service-text',
  image: 'biografia-service-image',
}
