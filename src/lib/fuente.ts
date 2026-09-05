/* De qué fuente sale cada cosa: Bravo o el seed.
 *
 * Esta decisión vive aparte de `paginas.ts` porque `paginas.ts` importa el módulo
 * virtual que el build resuelve pidiéndole a la API, y eso no se puede montar en un
 * test sin red. Acá no hay ni red ni módulo virtual: entra el dato de Bravo (o
 * `null`) y sale lo que el sitio tiene que dibujar. Es la parte que se puede romper
 * en silencio, así que es la parte que se testea.
 */
import type { MenuItem, Page, PublicMenuItem, SeedFile } from './manifest.ts'
import { resolverMenu } from './menu.ts'

/** Lo que devuelve el módulo virtual: lo publicado en Bravo, o `null`. */
export interface ContenidoDeBravo {
  pages: Page[]
  menus: Record<string, PublicMenuItem[]>
}

export function elegirPaginas(deBravo: ContenidoDeBravo | null, semilla: SeedFile): Page[] {
  return deBravo?.pages.length ? deBravo.pages : semilla.pages
}

/**
 * El menú de una clave, con el `href` ya resuelto.
 *
 * El fallback es POR CLAVE y no por respuesta entera: un tenant puede tener páginas
 * cargadas y todavía no haber creado su menú, y ahí la cabecera tiene que salir con
 * los enlaces del seed en vez de vacía. Un pie sin enlaces es un sitio roto que no
 * da ningún error.
 *
 * Lo que viene de Bravo se usa TAL CUAL: los ítems de artículo traen URL absoluta
 * (sale del `article_url_pattern` del tenant) y el resto viene relativa, así que
 * prefijar o «normalizar» uno rompe el otro. Sólo el seed pasa por `resolverMenu`,
 * porque el Contrato 4 lo define SIN `href`.
 */
export function elegirMenu(
  key: string,
  deBravo: ContenidoDeBravo | null,
  semilla: SeedFile,
): PublicMenuItem[] {
  const deLaApi = deBravo?.menus?.[key]
  if (deLaApi?.length) return deLaApi
  const delSeed: MenuItem[] = semilla.menus[key] ?? []
  return resolverMenu(delSeed)
}
