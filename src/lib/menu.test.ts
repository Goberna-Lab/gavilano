/* `resolverHref` contra la tabla del Contrato 3.
 *
 * Esta regla está escrita DOS VECES: una en Bravo (que sirve el menú ya resuelto en
 * `/v1/public/menus`) y otra acá (que resuelve el seed, porque el Contrato 4 lo
 * define SIN `href`). Este archivo es la copia literal de esa tabla y sirve de
 * alarma si las dos se separan.
 */
import { describe, expect, it } from 'vitest'
import { esExterno, resolverHref, resolverMenu } from './menu.ts'
import type { MenuItem } from './manifest.ts'

describe('resolverHref — la tabla del Contrato 3', () => {
  it('page → /<slug>/', () => {
    expect(resolverHref({ kind: 'page', slug: 'biografia' })).toBe('/biografia/')
  })

  it('page con slug vacío es la portada → /, no //', () => {
    expect(resolverHref({ kind: 'page', slug: '' })).toBe('/')
  })

  it('route → el path tal cual', () => {
    expect(resolverHref({ kind: 'route', path: '/articulos/' })).toBe('/articulos/')
  })

  it('anchor → /<slug>/#<ancla>', () => {
    expect(resolverHref({ kind: 'anchor', slug: 'biografia', anchor: 'sumate' })).toBe(
      '/biografia/#sumate',
    )
  })

  it('anchor en la portada → /#<ancla>', () => {
    expect(resolverHref({ kind: 'anchor', slug: '', anchor: 'propuestas' })).toBe('/#propuestas')
  })

  it('url → el href tal cual', () => {
    expect(resolverHref({ kind: 'url', href: 'https://ejemplo.pe' })).toBe('https://ejemplo.pe')
  })

  it('article usa el patrón del tenant cuando lo hay', () => {
    expect(
      resolverHref(
        { kind: 'article', slug: 'una-nota' },
        { patronArticulo: 'https://juandediosgavilano.com/articulos/{slug}' },
      ),
    ).toBe('https://juandediosgavilano.com/articulos/una-nota')
  })

  it('article con un patrón SIN el marcador cae al fallback', () => {
    /* Un patrón mal cargado mandaría TODAS las notas a la misma URL. */
    expect(
      resolverHref({ kind: 'article', slug: 'una-nota' }, { patronArticulo: 'https://x.pe/notas' }),
    ).toBe('/articulos/una-nota')
  })

  it('article sin patrón cae a la ruta de este sitio, no a /blog/', () => {
    /* El fallback genérico de Bravo es `/blog/<slug>/` y este sitio no tiene /blog.
       Y va SIN barra, igual que el `article_url_pattern` del tenant: dos formas
       distintas para la misma nota en el mismo menú sería peor que el 301. */
    expect(resolverHref({ kind: 'article', slug: 'una-nota' })).toBe('/articulos/una-nota')
  })

  it('un destino que no se puede resolver devuelve null', () => {
    expect(resolverHref({ kind: 'url', href: '' })).toBeNull()
    expect(resolverHref({ kind: 'article', slug: '' })).toBeNull()
    expect(resolverHref({ kind: 'route', path: '' })).toBeNull()
  })

  it('un `kind` que este tema no conoce devuelve null en vez de romper', () => {
    /* Lo traería una versión más nueva del contrato. */
    expect(resolverHref({ kind: 'inventado' } as never)).toBeNull()
  })
})

describe('resolverMenu', () => {
  const item = (id: string, target: MenuItem['target']): MenuItem => ({
    id,
    label: id,
    target,
  })

  it('descarta el ítem que no se puede resolver, no el menú entero', () => {
    /* `PublicMenuItem` promete `href: string`, así que no hay forma de emitirlo sin
       romper el tipo: mejor un ítem de menos que un <a> sin destino horneado. */
    const menu = [
      item('bueno', { kind: 'page', slug: 'biografia' }),
      item('roto', { kind: 'url', href: '' }),
    ]
    expect(resolverMenu(menu).map((i) => i.id)).toEqual(['bueno'])
  })

  it('un hijo roto se descarta sin descartar al padre', () => {
    const menu: MenuItem[] = [
      {
        ...item('padre', { kind: 'page', slug: 'propuestas' }),
        children: [
          item('hijo-bueno', { kind: 'page', slug: 'biografia' }),
          item('hijo-roto', { kind: 'article', slug: '' }),
        ],
      },
    ]
    const [padre] = resolverMenu(menu)
    expect(padre.href).toBe('/propuestas/')
    expect(padre.children?.map((c) => c.id)).toEqual(['hijo-bueno'])
  })
})

describe('esExterno', () => {
  /* Lo ÚNICO que el tema le pregunta al href: el enrutador de React sólo sabe
     navegar las rutas relativas. No lo normaliza ni lo prefija (P11). */
  it('reconoce las absolutas, que es como vienen los ítems de artículo', () => {
    expect(esExterno('https://juandediosgavilano.com/articulos/x')).toBe(true)
    expect(esExterno('mailto:hola@ejemplo.pe')).toBe(true)
    expect(esExterno('//cdn.ejemplo.pe/x')).toBe(true)
  })

  it('deja pasar las relativas por el enrutador', () => {
    expect(esExterno('/biografia/')).toBe(false)
    expect(esExterno('/#propuestas')).toBe(false)
  })
})
