/* Estructura del sitio — páginas, secciones y menús.
 *
 * Por ahora salen SÓLO de `content/seed.json`: el contenido de hoy, como dato. La
 * fase siguiente le pone delante lo publicado en Bravo y deja al seed de respaldo,
 * y para eso este archivo es el único lugar que hay que tocar — las vistas ya
 * preguntan acá y no saben de dónde sale.
 */
import semilla from '../../content/seed.json'
import { resolverMenu } from './menu.ts'
import type { Page, PublicMenuItem, SectionInstance, SeedFile } from './manifest.ts'

/* El JSON entra sin tipar (TypeScript no puede saber que `target.kind` es la unión y
   no `string`). La forma la verifica `seed.test.ts` contra el catálogo, que es una
   comprobación más fuerte que la que daría el tipo. */
const SEMILLA = semilla as unknown as SeedFile

/** Las páginas publicadas, en el orden que manda el dato. Nunca vacío. */
export function getPaginas(): Page[] {
  return SEMILLA.pages
}

/** La página de un slug (`''` = portada), o `undefined` si no existe. */
export function paginaPorSlug(slug: string): Page | undefined {
  return getPaginas().find((pagina) => pagina.slug === slug)
}

/** Un menú por su key, con el `href` ya resuelto. */
export function getMenu(key: string): PublicMenuItem[] {
  return resolverMenu(SEMILLA.menus[key] ?? [])
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
