/* Comprobaciones del catálogo — la red que sostiene una promesa.
 *
 * `/site-manifest.json` es una PROMESA: le dice al panel del cliente que este tema
 * sabe dibujar lo que ahí se declara. Un error en el catálogo no rompe ningún build:
 * rompe la confianza del cliente, que edita un campo y no ve cambiar nada. Por eso
 * lo que se comprueba acá es justo lo que falla en silencio.
 */
import { describe, expect, it } from 'vitest'
import { CATALOGO, MANIFEST, tituloDeTipo } from './catalogo.ts'
import type { ManifestField } from './manifest.ts'

/* Copia del allow-list de `SectionIcon.tsx` del panel (paquete `bravo-admin`).
   Un icono que no esté en la lista NO rompe: cae en un icono genérico. Pero el
   árbol de secciones queda mudo, que es un modo de fallar que nadie mira. */
const ICONOS = new Set([
  'phone', 'mail', 'email', 'link', 'user', 'users', 'image', 'images',
  'gallery', 'chart', 'impact', 'file', 'megaphone', 'map-pin', 'star',
  'award', 'calendar', 'globe', 'heart', 'newspaper',
])

const TIPOS_DE_CAMPO = new Set([
  'text', 'textarea', 'email', 'url', 'number', 'image', 'list', 'fixed-list',
])

/** Recorre un campo y sus sub-campos, con la ruta de cada uno. */
function* recorrer(
  campos: ManifestField[],
  prefijo: string,
): Generator<{ campo: ManifestField; ruta: string }> {
  for (const campo of campos) {
    const ruta = `${prefijo}.${campo.key}`
    yield { campo, ruta }
    if (campo.fields) yield* recorrer(campo.fields, `${ruta}[]`)
  }
}

function todosLosCampos() {
  return CATALOGO.flatMap((tipo) => [...recorrer(tipo.fields, tipo.key)])
}

describe('el manifest', () => {
  it('es v2 y declara el catálogo completo', () => {
    expect(MANIFEST.version).toBe(2)
    expect(MANIFEST.sectionTypes).toBe(CATALOGO)
    expect(CATALOGO.length).toBeGreaterThan(0)
  })

  it('declara los dos menús que el tema rinde', () => {
    expect(MANIFEST.menus.map((m) => m.key).sort()).toEqual(['pie', 'principal'])
  })

  it('declara las rutas fijas CON barra final', () => {
    /* Este hosting sirve `dist/articulos/index.html` y **301 a `/articulos/`**
       cuando le piden `/articulos` (medido en producción el 2026-09-05). Así que
       la barra es la que evita el rebote, no la que lo causa — al revés que en
       Barrionuevo. Y es además la forma que Bravo le da a las páginas (Contrato 3
       resuelve `page` como `/<slug>/`), así que el menú queda todo igual. */
    for (const ruta of MANIFEST.fixedRoutes ?? []) {
      expect(ruta.path.startsWith('/')).toBe(true)
      expect(ruta.path).toMatch(/\/$/)
    }
  })

  it('no promete una vista previa que todavía no existe', () => {
    /* Declarar `preview` antes de que la ruta /preview/ exista deja al panel
       embebiendo un 404. Se agrega en la fase que construye esa ruta. */
    expect(MANIFEST.preview).toBeUndefined()
  })

  it('no declara secciones fijas (modelo v1)', () => {
    /* El modelo `site-content` es el anterior: singleton por sitio, sin orden y sin
       vista previa. Sólo `edwards` lo usa y no hay que expandirlo. */
    expect(MANIFEST.sections).toBeUndefined()
  })
})

describe('los tipos de sección', () => {
  it('tienen claves únicas', () => {
    const claves = CATALOGO.map((tipo) => tipo.key)
    expect(new Set(claves).size).toBe(claves.length)
  })

  it('tienen título y un icono que el panel sabe dibujar', () => {
    for (const tipo of CATALOGO) {
      expect(tipo.title, `${tipo.key} sin título`).toBeTruthy()
      expect(ICONOS, `icono de ${tipo.key}`).toContain(tipo.icon)
    }
  })

  it('tienen claves en minúsculas y con guiones', () => {
    /* La clave es el CONTRATO: es lo que queda guardado en cada instancia y lo que
       el renderizador compara. Una mayúscula o un espacio no rompen nada visible
       hoy, pero dejan una sección que el tema nunca va a poder dibujar. */
    for (const tipo of CATALOGO) {
      expect(tipo.key, `clave de ${tipo.title}`).toMatch(/^[a-z][a-z0-9-]*$/)
    }
  })

  it('tienen al menos un campo editable', () => {
    for (const tipo of CATALOGO) {
      expect(tipo.fields.length, `${tipo.key} sin campos`).toBeGreaterThan(0)
    }
  })

  it('son todos únicos por página', () => {
    /* Este sitio no tiene ninguna sección que se repita dentro de una misma página:
       cada una es un bloque del diseño. Si algún día una deja de serlo, este test
       obliga a decirlo a propósito. */
    for (const tipo of CATALOGO) {
      expect(tipo.unique, `${tipo.key} debería ser unique`).toBe(true)
    }
  })
})

describe('los campos', () => {
  it('tienen claves únicas entre hermanos', () => {
    const grupos: Record<string, string[]> = {}
    for (const tipo of CATALOGO) {
      const juntar = (campos: ManifestField[], prefijo: string) => {
        grupos[prefijo] = campos.map((c) => c.key)
        for (const campo of campos) {
          if (campo.fields) juntar(campo.fields, `${prefijo}.${campo.key}[]`)
        }
      }
      juntar(tipo.fields, tipo.key)
    }
    for (const [prefijo, claves] of Object.entries(grupos)) {
      expect(new Set(claves).size, `claves repetidas en ${prefijo}`).toBe(claves.length)
    }
  })

  it('usan sólo los ocho tipos que existen en v1', () => {
    for (const { campo, ruta } of todosLosCampos()) {
      expect(TIPOS_DE_CAMPO, `tipo de ${ruta}`).toContain(campo.type)
    }
  })

  it('tienen etiqueta', () => {
    for (const { campo, ruta } of todosLosCampos()) {
      expect(campo.label, `${ruta} sin etiqueta`).toBeTruthy()
    }
  })

  it('NUNCA declaran `url`', () => {
    /* Todos los enlaces editables de este sitio son internos (`/biografia`,
       `#sumate`) y el tipo `url` rinde un <input type="url"> que el navegador
       rechaza sin esquema: el cliente no podría guardarlos. Los únicos enlaces
       externos del sitio (el teléfono y el correo del pie) no son editables. */
    const url = todosLosCampos()
      .filter(({ campo }) => campo.type === 'url')
      .map(({ ruta }) => ruta)
    expect(url).toEqual([])
  })

  it('dan sub-campos a cada lista', () => {
    for (const { campo, ruta } of todosLosCampos()) {
      if (campo.type !== 'list' && campo.type !== 'fixed-list') continue
      expect(campo.fields?.length, `${ruta} sin sub-campos`).toBeGreaterThan(0)
    }
  })

  it('dan entradas a cada `fixed-list`, y sólo a ésas', () => {
    /* Sin `entries` un `fixed-list` rinde CERO filas: el panel las saca de ahí, no
       del valor guardado. Es el modo de fallar más caro del catálogo, porque el
       campo aparece con su título y vacío, como si no tuviera contenido. */
    for (const { campo, ruta } of todosLosCampos()) {
      if (campo.type === 'fixed-list') {
        expect(campo.entries?.length, `${ruta} sin entradas`).toBeGreaterThan(0)
        for (const entrada of campo.entries ?? []) {
          expect(entrada.label, `una entrada de ${ruta} sin rótulo`).toBeTruthy()
        }
      } else {
        expect(campo.entries, `${ruta} no es fixed-list y trae entradas`).toBeUndefined()
      }
    }
  })
})

describe('las listas fijas que el componente indexa por posición', () => {
  /* Estas cantidades NO son decoración: del otro lado hay una constante en el
     componente —el icono de cada pilar y su medida, el `+` de la cifra del medio,
     la forma en que cada proyecto parte su bajada, el recuadro del rótulo de tres
     cargos, el `name` de cada campo del formulario— indexada por la MISMA posición.
     Si el catálogo dice 6 entradas y el componente tiene 7 constantes, el sitio se
     rompe en runtime con un `undefined`, no en el build. Por eso se escriben acá.

     Cambiar una cantidad es cambiar el diseño: toca el componente y este número. */
  const ESPERADAS: Record<string, number> = {
    'conoceme.pilares': 4,
    'una-vida-de-servicio.cifras': 3,
    'mi-aporte.proyectos': 5,
    'mi-aporte-pagina.proyectos': 5,
    'articulos.intro': 4,
    'sumate.campos': 6,
    'sumate.motivoOpciones': 4,
    'biografia-resultados.tramos': 3,
    'experiencia-linea-de-tiempo.hitos': 9,
    'propuestas-detalle.categorias': 5,
    'propuestas-detalle.parrafos': 3,
  }

  it('tienen la cantidad de entradas que el componente espera', () => {
    const reales = Object.fromEntries(
      todosLosCampos()
        .filter(({ campo }) => campo.type === 'fixed-list')
        .map(({ campo, ruta }) => [ruta, campo.entries?.length ?? 0]),
    )
    expect(reales).toEqual(ESPERADAS)
  })
})

describe('los dos tipos que comparten componente', () => {
  /* «Mi aporte» se dibuja con el mismo componente en la portada y en su página
     propia; lo único que cambia es una clase de maquetación, que no puede viajar
     como contenido. Si los campos se separaran, el cliente tendría dos secciones
     que dicen ser la misma y no lo son. */
  it('declaran exactamente los mismos campos', () => {
    const portada = CATALOGO.find((t) => t.key === 'mi-aporte')
    const pagina = CATALOGO.find((t) => t.key === 'mi-aporte-pagina')
    expect(portada?.fields).toBe(pagina?.fields)
  })
})

describe('tituloDeTipo', () => {
  it('devuelve el título del catálogo', () => {
    expect(tituloDeTipo('hero')).toBe('Portada')
  })

  it('devuelve la clave cruda de un tipo que el tema no declara', () => {
    expect(tituloDeTipo('seccion-de-otro-tema')).toBe('seccion-de-otro-tema')
  })
})
