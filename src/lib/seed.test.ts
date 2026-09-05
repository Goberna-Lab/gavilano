/* `content/seed.json` contra el catálogo.
 *
 * El seed es el contenido de HOY como dato: es lo que el sitio dibuja mientras Bravo
 * no tenga páginas, y es lo que se va a cargar en Bravo para arrancar. No se puede
 * tipar desde el JSON (TypeScript infiere `string` donde el contrato pide una unión),
 * así que la forma se comprueba acá — y contra el catálogo, que es lo que de verdad
 * importa: un campo de menos no da error de build, sale como un hueco en el sitio.
 *
 * Este archivo es también la única comprobación de que el catálogo (fase 1) y los
 * componentes (fase 2) hablan del mismo contenido.
 */
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import semilla from '../../content/seed.json'
import { CATALOGO, MANIFEST } from './catalogo.ts'
import type { ManifestField, SeedFile, SectionValues } from './manifest.ts'
import { resolverMenu } from './menu.ts'

const SEMILLA = semilla as unknown as SeedFile
const PUBLIC = fileURLToPath(new URL('../../public', import.meta.url))

const tipoDe = new Map(CATALOGO.map((t) => [t.key, t]))

/** Recorre un objeto de contenido contra los campos que lo describen. */
function revisar(
  fields: ManifestField[],
  valores: SectionValues,
  donde: string,
  recogido: { imagenes: string[]; destinos: string[] },
): string[] {
  const problemas: string[] = []
  const declaradas = new Set(fields.map((f) => f.key))

  for (const sobrante of Object.keys(valores).filter((k) => !declaradas.has(k))) {
    problemas.push(`${donde}: la clave '${sobrante}' no está en el catálogo`)
  }

  for (const field of fields) {
    const valor = valores[field.key]
    const ruta = `${donde}.${field.key}`

    if (valor === undefined) {
      problemas.push(`${ruta}: falta`)
      continue
    }

    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'email':
      case 'url':
        if (typeof valor !== 'string') problemas.push(`${ruta}: debería ser texto`)
        /* Todo campo de texto cuyo valor sea un destino se junta para comprobarlo
           aparte: un enlace interno a una ruta que nadie genera no da error, deja al
           visitante en el shell del SPA con la meta del home. */
        else if (/^[#/]/.test(valor)) recogido.destinos.push(valor)
        break
      case 'number':
        if (typeof valor !== 'number') problemas.push(`${ruta}: debería ser número`)
        break
      case 'image':
        if (typeof valor !== 'string') problemas.push(`${ruta}: debería ser texto`)
        else if (valor) recogido.imagenes.push(valor)
        break
      case 'list':
      case 'fixed-list': {
        if (!Array.isArray(valor)) {
          problemas.push(`${ruta}: debería ser una lista`)
          break
        }
        if (field.type === 'fixed-list') {
          const esperadas = field.entries?.length ?? 0
          if (valor.length !== esperadas) {
            problemas.push(
              `${ruta}: la lista fija pide ${esperadas} entradas y trae ${valor.length}`,
            )
          }
        }
        valor.forEach((item, i) => {
          problemas.push(
            ...revisar(field.fields ?? [], item as SectionValues, `${ruta}[${i}]`, recogido),
          )
        })
        break
      }
    }
  }
  return problemas
}

const recogido = { imagenes: [] as string[], destinos: [] as string[] }
const problemas = SEMILLA.pages.flatMap((pagina) =>
  pagina.sections.flatMap((seccion) => {
    const tipo = tipoDe.get(seccion.type)
    if (!tipo) {
      return [`página '${pagina.slug}': el tipo '${seccion.type}' no está en el catálogo`]
    }
    return revisar(
      tipo.fields,
      seccion.content,
      `${pagina.slug || '(portada)'}/${seccion.type}`,
      recogido,
    )
  }),
)

describe('content/seed.json contra el catálogo', () => {
  it('cada sección trae exactamente los campos que declara su tipo', () => {
    expect(problemas).toEqual([])
  })

  it('trae las cinco páginas del sitio y ningún slug se repite', () => {
    const slugs = SEMILLA.pages.map((p) => p.slug)
    expect(slugs).toEqual(['', 'biografia', 'experiencia', 'mi-aporte', 'propuestas'])
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('cada página trae su SEO, que es lo que el prerender va a hornear', () => {
    for (const pagina of SEMILLA.pages) {
      expect(pagina.seo_title, `${pagina.slug} sin seo_title`).toBeTruthy()
      expect(pagina.seo_description, `${pagina.slug} sin seo_description`).toBeTruthy()
      expect(pagina.noindex, `${pagina.slug} noindex`).toBe(false)
    }
  })

  it('respeta el `unique` del catálogo', () => {
    for (const pagina of SEMILLA.pages) {
      const cuenta = new Map<string, number>()
      for (const s of pagina.sections) cuenta.set(s.type, (cuenta.get(s.type) ?? 0) + 1)
      for (const [tipo, n] of cuenta) {
        if (tipoDe.get(tipo)?.unique) expect(`${tipo}:${n}`).toBe(`${tipo}:1`)
      }
    }
  })

  it('no repite anclas dentro de una página', () => {
    for (const pagina of SEMILLA.pages) {
      const anclas = pagina.sections.map((s) => s.anchor).filter(Boolean)
      expect(new Set(anclas).size).toBe(anclas.length)
    }
  })

  it('no repite ids de sección en todo el seed', () => {
    /* El id es la key de React en el renderizador y lo que el panel usa para
       encontrar una sección. Dos iguales serían dos secciones que se pisan. */
    const ids = SEMILLA.pages.flatMap((p) => p.sections.map((s) => s.id))
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('todas las imágenes que nombra existen en public/', () => {
    /* La comprobación que atrapa una mudanza a medias: una imagen que siguiera en
       src/assets/ no existe en ninguna URL servible.
       Se le saca la query antes de mirar el disco: la foto de «Conóceme» lleva un
       `?v=` para romper la caché del navegador y ese sufijo no es parte del
       nombre del archivo. */
    const faltan = [...new Set(recogido.imagenes)]
      .filter((src) => src.startsWith('/'))
      .filter((src) => !existsSync(PUBLIC + src.split('?')[0]))
    expect(faltan).toEqual([])
  })
})

describe('los destinos internos del contenido llevan a algún lado', () => {
  const anclas = new Set(
    SEMILLA.pages.flatMap((p) => p.sections.map((s) => s.anchor).filter(Boolean)),
  )
  const rutas = new Set([
    ...(MANIFEST.fixedRoutes ?? []).map((r) => r.path),
    ...SEMILLA.pages.map((p) => (p.slug === '' ? '/' : `/${p.slug}/`)),
  ])

  it('cada ancla (#algo) es una sección que existe', () => {
    const rotas = recogido.destinos
      .filter((d) => d.startsWith('#'))
      .filter((d) => !anclas.has(d.slice(1)))
    expect(rotas).toEqual([])
  })

  it('cada ruta (/algo) está declarada en el manifest o es una página', () => {
    const rotas = recogido.destinos
      .filter((d) => d.startsWith('/'))
      .filter((d) => !rutas.has(d))
    expect(rotas).toEqual([])
  })

  it('los destinos internos llevan barra final', () => {
    /* Este hosting 301 de `/biografia` a `/biografia/` (medido 2026-09-05). Sin la
       barra, cada visitante que entra por ese enlace paga un rebote y el crawler
       ve una redirección donde debería haber una página. */
    const sinBarra = recogido.destinos.filter((d) => d.startsWith('/') && !d.endsWith('/'))
    expect(sinBarra).toEqual([])
  })
})

describe('los menús del seed apuntan a sitios que existen', () => {
  it('declara los dos menús que el manifest promete', () => {
    expect(Object.keys(SEMILLA.menus).sort()).toEqual(MANIFEST.menus.map((m) => m.key).sort())
  })

  for (const clave of ['principal', 'pie']) {
    const menu = SEMILLA.menus[clave] ?? []

    it(`«${clave}»: ningún ítem se descarta por no poder resolverse`, () => {
      expect(menu.length).toBeGreaterThan(0)
      expect(resolverMenu(menu)).toHaveLength(menu.length)
    })

    it(`«${clave}»: las rutas fijas que usa están declaradas en el manifest`, () => {
      const declaradas = new Set((MANIFEST.fixedRoutes ?? []).map((r) => r.path))
      const usadas = menu
        .filter((i) => i.target.kind === 'route')
        .map((i) => (i.target as { path: string }).path)
      expect(usadas.filter((p) => !declaradas.has(p))).toEqual([])
    })

    it(`«${clave}»: cada página a la que apunta existe en el seed`, () => {
      const slugs = new Set(SEMILLA.pages.map((p) => p.slug))
      const rotas = menu
        .filter((i) => i.target.kind === 'page')
        .map((i) => (i.target as { slug: string }).slug)
        .filter((slug) => !slugs.has(slug))
      expect(rotas).toEqual([])
    })
  }
})
