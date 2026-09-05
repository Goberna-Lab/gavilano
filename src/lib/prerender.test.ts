/* La copia de la regla de fallback que vive en el PRERENDER.
 *
 * `src/lib/fuente.ts` decide qué páginas DIBUJA el bundle; `scripts/seo-prerender.mjs`
 * decide a cuáles les escribe la carpeta, el `<head>` y la línea del sitemap. Son dos
 * procesos, así que la regla está escrita dos veces, y hasta este test no había NADA
 * que las atara: `scripts/` no entra en ningún `tsconfig`, no lo miraba ESLint y no lo
 * cubría ningún test.
 *
 * Si las dos se separan, el sitio dibuja un conjunto de páginas y el prerender
 * documenta otro. Una página que esté en el bundle y no acá no recibe su carpeta: el
 * hosting cae en `dist/404.html`, que `copy-404.mjs` llenó con el `<head>` del HOME.
 * Para un visitante se ve bien; para un buscador es un soft-404 con la meta
 * equivocada. Exit 0 en todos lados.
 *
 * Los casos son los MISMOS que `fuente.test.ts` le pasa a la otra copia. Ésa es la
 * gracia: si alguien cambia una y no la otra, uno de los dos archivos se pone rojo.
 */
import { describe, expect, it } from 'vitest'
// @ts-expect-error — es un .mjs sin tipos, a propósito: es un script de build.
import { paginasDelBuild } from '../../scripts/seo-prerender.mjs'

const pagina = (slug: string) => ({ slug, title: slug || 'Portada', sections: [] })

/** Simula los dos archivos que el script lee, sin tocar el disco. */
const lector = (cache: unknown, seed: unknown) => (ruta: string) =>
  ruta.includes('bravo-contenido') ? cache : seed

const SEMILLA = { pages: [pagina(''), pagina('biografia')] }

describe('paginasDelBuild — la misma regla que elegirPaginas', () => {
  it('usa lo de Bravo cuando hay algo publicado', () => {
    const deBravo = { pages: [pagina(''), pagina('propuestas')] }
    const { pages, fuente } = paginasDelBuild(lector(deBravo, SEMILLA))
    expect(pages.map((p: { slug: string }) => p.slug)).toEqual(['', 'propuestas'])
    expect(fuente).toBe('Bravo')
  })

  it('cae al seed cuando el build se armó con el seed (cache null)', () => {
    const { pages, fuente } = paginasDelBuild(lector(null, SEMILLA))
    expect(pages).toBe(SEMILLA.pages)
    expect(fuente).toBe('content/seed.json')
  })

  it('cae al seed cuando Bravo contestó pero sin páginas', () => {
    const { pages } = paginasDelBuild(lector({ pages: [] }, SEMILLA))
    expect(pages).toBe(SEMILLA.pages)
  })

  it('revienta si no hay páginas en ningún lado, en vez de escribir un sitio sin rutas', () => {
    /* Sin esto el prerender escribiría sólo `/articulos/` y los artículos, y el
       rsync --delete se llevaría las carpetas de las cinco páginas. */
    expect(() => paginasDelBuild(lector(null, { pages: [] }))).toThrow(/no hay páginas/)
  })

  it('dice de qué fuente salieron, porque es el dato que se mira cuando algo sale raro', () => {
    expect(paginasDelBuild(lector({ pages: [pagina('')] }, SEMILLA)).fuente).toBe('Bravo')
    expect(paginasDelBuild(lector(null, SEMILLA)).fuente).toBe('content/seed.json')
  })
})
