/* Resolución de destinos de menú a `href`.
 *
 * Bravo ya sirve el menú resuelto en `GET /v1/public/menus`, así que esto NO se usa
 * para lo que viene de la API: ahí el `href` se usa TAL CUAL (mezcla absolutos de
 * artículo con relativos del resto, y prefijarlo rompe los enlaces a notas). Existe
 * para el camino del fallback, porque el Contrato 4 define el seed SIN `href` y el
 * sitio tiene que poder armarse sólo con `content/seed.json`.
 *
 * O sea que la regla queda escrita dos veces, una en cada repo. `menu.test.ts` es la
 * copia literal de la tabla del Contrato 3 y sirve de alarma si se separan.
 */
import type { MenuItem, MenuTarget, PublicMenuItem } from './manifest.ts'

interface Opciones {
  /**
   * `article_url_pattern` del tenant, con `{slug}`. En Bravo es absoluto y existe
   * siempre que el tenant tenga fila en `portal.tenant_sites`; acá es opcional
   * porque el seed se resuelve sin consultar nada.
   */
  patronArticulo?: string
}

/** `''` es la portada: `/`, no `//`. */
function rutaDePagina(slug: string): string {
  return slug === '' ? '/' : `/${slug}/`
}

/**
 * El `href` del destino, o `null` si no se puede resolver.
 *
 * `null` y no cadena vacía: el contrato promete `href: string`, así que un ítem sin
 * destino se descarta antes de llegar al HTML. Mejor un ítem de menos que un `<a>`
 * que no lleva a ningún lado horneado en el sitio.
 */
export function resolverHref(target: MenuTarget, opciones: Opciones = {}): string | null {
  switch (target.kind) {
    case 'page':
      /* El slug vacío es la portada, un destino válido: se comprueba que venga la
         propiedad, no que tenga contenido. */
      return typeof target.slug === 'string' ? rutaDePagina(target.slug) : null
    case 'route':
      return target.path || null
    case 'anchor':
      return typeof target.slug === 'string' && target.anchor
        ? `${rutaDePagina(target.slug)}#${target.anchor}`
        : null
    case 'url':
      return target.href || null
    case 'article': {
      if (!target.slug) return null
      /* Un patrón sin el marcador mandaría TODAS las notas a la misma URL, así que
         se ignora y manda el fallback. */
      if (opciones.patronArticulo?.includes('{slug}')) {
        return opciones.patronArticulo.replace('{slug}', target.slug)
      }
      /* El fallback genérico de Bravo es `/blog/<slug>/`, pero este sitio no tiene
         /blog: sus notas viven en /articulos/<slug>.
         SIN barra final a propósito, aunque las PÁGINAS sí la lleven: el
         `article_url_pattern` del tenant tampoco la tiene, así que ésta es la forma
         que va a devolver Bravo por el camino normal. Inventar acá una tercera forma
         haría que el mismo menú mezclara dos URLs distintas para la misma nota según
         de dónde saliera el ítem. Que las notas redirijan (301) es un problema real
         pero es de las 36, no de este fallback: va por el issue #50. */
      return `/articulos/${target.slug}`
    }
    default:
      /* Un `kind` que este tema no conoce: lo trae una versión más nueva del
         contrato. Se descarta en vez de romper el menú entero. */
      return null
  }
}

export function resolverMenu(items: MenuItem[], opciones: Opciones = {}): PublicMenuItem[] {
  return items.flatMap(({ children, ...item }) => {
    const href = resolverHref(item.target, opciones)
    if (href === null) return []
    return [
      {
        ...item,
        href,
        ...(children ? { children: resolverMenu(children, opciones) } : {}),
      },
    ]
  })
}

/**
 * Si un `href` sale de este sitio.
 *
 * Los ítems de artículo vienen con URL ABSOLUTA (del `article_url_pattern` del
 * tenant, que apunta a este mismo dominio) y el resto viene relativa: el mismo menú
 * mezcla las dos formas. El enrutador de React sólo sabe navegar las relativas, así
 * que ésta es la única pregunta que el tema le hace al href — y NO lo toca ni lo
 * normaliza (P11).
 */
export function esExterno(href: string): boolean {
  return /^[a-z][a-z0-9+.-]*:|^\/\//i.test(href)
}
