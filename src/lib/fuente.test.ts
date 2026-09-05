/* La decisión de qué fuente gana: Bravo o el seed.
 *
 * Es la parte de la fase 4 que se rompe en silencio. Nada de esto da un error: el
 * sitio sale, pero con el contenido equivocado — o con la cabecera vacía, que ya pasó
 * del lado de Bravo (la vista previa perdió el menú del borrador al mudar un
 * componente y nadie lo vio hasta producción, #74).
 */
import { describe, expect, it } from 'vitest'
import { elegirMenu, elegirPaginas, type ContenidoDeBravo } from './fuente.ts'
import type { Page, PublicMenuItem, SeedFile } from './manifest.ts'

const pagina = (slug: string): Page => ({
  id: `id-${slug || 'portada'}`,
  slug,
  title: slug || 'Portada',
  sort: 0,
  sections: [],
  seo_title: null,
  seo_description: null,
  og_image_url: null,
  noindex: false,
  published_at: null,
})

const SEMILLA: SeedFile = {
  pages: [pagina(''), pagina('biografia')],
  menus: {
    principal: [
      { id: 'm1', label: 'BIOGRAFIA', target: { kind: 'page', slug: 'biografia' } },
    ],
    pie: [{ id: 'p1', label: 'artículos', target: { kind: 'route', path: '/articulos/' } }],
  },
}

const deBravo = (parcial: Partial<ContenidoDeBravo>): ContenidoDeBravo => ({
  pages: [],
  menus: {},
  ...parcial,
})

describe('elegirPaginas', () => {
  it('usa lo de Bravo cuando hay algo publicado', () => {
    const contenido = deBravo({ pages: [pagina(''), pagina('propuestas')] })
    expect(elegirPaginas(contenido, SEMILLA).map((p) => p.slug)).toEqual(['', 'propuestas'])
  })

  it('cae al seed cuando Bravo no contestó (null)', () => {
    expect(elegirPaginas(null, SEMILLA)).toBe(SEMILLA.pages)
  })

  it('cae al seed cuando Bravo contestó pero no hay páginas publicadas', () => {
    /* La ventana real entre deployar el tema y correr el seed en producción. El
       sitio NO puede quedar vacío ahí. */
    expect(elegirPaginas(deBravo({ pages: [] }), SEMILLA)).toBe(SEMILLA.pages)
  })
})

describe('elegirMenu', () => {
  it('usa el menú de Bravo con su href TAL CUAL', () => {
    /* Los ítems de artículo traen URL absoluta y el resto relativa: prefijar o
       normalizar uno rompe el otro (P11). */
    const absoluto: PublicMenuItem[] = [
      {
        id: 'b2',
        label: 'Una nota',
        target: { kind: 'article', slug: 'una-nota' },
        href: 'https://juandediosgavilano.com/articulos/una-nota',
      },
    ]
    const resuelto = elegirMenu('principal', deBravo({ menus: { principal: absoluto } }), SEMILLA)
    expect(resuelto[0].href).toBe('https://juandediosgavilano.com/articulos/una-nota')
  })

  it('cae al seed y lo resuelve cuando Bravo no contestó', () => {
    expect(elegirMenu('principal', null, SEMILLA).map((i) => i.href)).toEqual(['/biografia/'])
  })

  it('el fallback es POR CLAVE, no por respuesta entera', () => {
    /* Un tenant puede tener páginas cargadas y todavía no haber creado su menú. La
       cabecera tiene que salir con los enlaces del seed, no vacía: un pie sin
       enlaces es un sitio roto que no da ningún error. */
    const conPaginasSinMenu = deBravo({ pages: [pagina('')], menus: {} })
    expect(elegirMenu('principal', conPaginasSinMenu, SEMILLA).map((i) => i.href)).toEqual([
      '/biografia/',
    ])
  })

  it('con el menú principal cargado en Bravo, el del pie igual cae al seed', () => {
    /* El caso concreto de este sitio: son DOS menús y el cliente puede crear uno
       solo. El otro no puede salir vacío. */
    const soloPrincipal = deBravo({
      pages: [pagina('')],
      menus: {
        principal: [
          { id: 'b1', label: 'X', target: { kind: 'route', path: '/articulos/' }, href: '/articulos/' },
        ],
      },
    })
    expect(elegirMenu('pie', soloPrincipal, SEMILLA).map((i) => i.href)).toEqual(['/articulos/'])
  })

  it('un menú que Bravo devuelve VACÍO también cae al seed', () => {
    expect(elegirMenu('principal', deBravo({ menus: { principal: [] } }), SEMILLA)).toHaveLength(1)
  })

  it('una clave que no existe en ningún lado devuelve lista vacía, no rompe', () => {
    expect(elegirMenu('inventado', deBravo({}), SEMILLA)).toEqual([])
  })
})
