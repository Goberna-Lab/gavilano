/* Estructura del sitio — páginas, secciones y menús.
 *
 * Salen de Bravo, HORNEADAS EN EL BUILD: el plugin `bravo-contenido` de
 * `vite.config.ts` pregunta por `/v1/public/pages` y `/v1/public/menus` mientras
 * compila y deja el resultado en el módulo virtual que se importa abajo. Por eso
 * estas funciones son síncronas y el contenido viaja dentro del bundle.
 *
 * No se piden desde el NAVEGADOR a propósito, aunque los artículos sí: sin eso
 * habría un parpadeo de carga en la portada y el sitio dependería de que la API esté
 * viva en cada visita. El precio es que un cambio publicado se ve recién después del
 * rebuild — que es justo lo que dispara el rebuild-on-publish.
 *
 * FALLBACK: si Bravo contesta bien pero todavía no tiene páginas para este tenant
 * (la ventana real entre deployar el tema y cargar el seed), el sitio se arma con
 * `content/seed.json` y NUNCA queda vacío. Si Bravo NO contesta, el build ya se
 * abortó antes de llegar acá — el porqué está en `vite.config.ts`.
 *
 * Este archivo es sólo cableado. La decisión de qué fuente gana está en `fuente.ts`,
 * que es donde se puede testear sin montar el módulo virtual.
 */
import deBravo from 'virtual:bravo/contenido'
import semilla from '../../content/seed.json'
import { elegirMenu, elegirPaginas } from './fuente.ts'
import type { Page, PublicMenuItem, SectionInstance, SeedFile } from './manifest.ts'

/* El JSON entra sin tipar (TypeScript no puede saber que `target.kind` es la unión y
   no `string`). La forma la verifica `seed.test.ts` contra el catálogo, que es una
   comprobación más fuerte que la que daría el tipo. */
const SEMILLA = semilla as unknown as SeedFile

/** Las páginas publicadas, en el orden que manda el dato. Nunca vacío. */
export function getPaginas(): Page[] {
  return elegirPaginas(deBravo, SEMILLA)
}

/** La página de un slug (`''` = portada), o `undefined` si no existe. */
export function paginaPorSlug(slug: string): Page | undefined {
  return getPaginas().find((pagina) => pagina.slug === slug)
}

/** Un menú por su key, con el `href` ya resuelto. */
export function getMenu(key: string): PublicMenuItem[] {
  return elegirMenu(key, deBravo, SEMILLA)
}

/**
 * La primera instancia de un tipo de sección, mirando la portada antes que el resto.
 *
 * Es para las rutas que viven en el CÓDIGO y no en Bravo (`/articulos` y
 * `/articulos/<slug>`), que igual dibujan una sección editable: el formulario de
 * «Súmate» está al pie de las dos. Sin esto habría que hornear una copia de ese
 * texto en el código, y el cliente editaría el del panel sin entender por qué el de
 * sus notas no cambia.
 */
export function primeraSeccionDeTipo(type: string): SectionInstance | undefined {
  for (const pagina of getPaginas()) {
    const seccion = pagina.sections.find((s) => s.type === type)
    if (seccion) return seccion
  }
  return undefined
}
