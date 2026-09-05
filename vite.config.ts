import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { MANIFEST } from './src/lib/catalogo.ts'

// https://vite.dev/config/
const base = process.env.VITE_BASE_PATH ?? '/'

const RUTA_MANIFEST = '/site-manifest.json'

/* La forma mínima del `middlewares` de Vite que usa `servir`, para no depender de
   los tipos de Connect (que no son una dependencia declarada de este repo). */
type Connect = {
  use: (
    handler: (
      req: { url?: string },
      res: { setHeader: (n: string, v: string) => void; end: (body: string) => void },
      next: () => void,
    ) => void,
  ) => void
}

/* Sirve el catálogo de secciones desde el MISMO origen que el panel embebido.
 *
 * El panel lo busca en `${location.origin}/site-manifest.json` (no le declaramos
 * `manifestUrl` en public/panel/index.html), y sin él no muestra «Mi sitio»: es el
 * archivo que le dice a Bravo QUÉ sabe dibujar este tema.
 *
 * Se emite desde `catalogo.ts` en vez de vivir como JSON en public/ a propósito: un
 * JSON a mano se desincroniza del código el primer día y el panel deja editar campos
 * que no cambian nada. Acá hay una sola fuente y el build la exporta.
 */
function siteManifest(): Plugin {
  const cuerpo = () => JSON.stringify(MANIFEST, null, 2)

  /* Mismo handler en `dev` y en `preview`: los dos sirven en localhost y ahí el
     panel local le pide el manifest al origen del dev server. */
  const servir = (server: { middlewares: Connect }) => {
    server.middlewares.use((req, res, next) => {
      if (req.url?.split('?')[0] !== RUTA_MANIFEST) return next()
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(cuerpo())
    })
  }

  return {
    name: 'bravo-site-manifest',
    configureServer: servir,
    configurePreviewServer: servir,
    generateBundle() {
      /* Fuera de assets/ y sin hash: la URL tiene que ser exactamente
         /site-manifest.json, que es la única que el panel sabe pedir. */
      this.emitFile({ type: 'asset', fileName: 'site-manifest.json', source: cuerpo() })
    },
  }
}

/* ── El contenido de las páginas, horneado en el build ────────────────────── */

/* Mismos valores y mismos nombres que `scripts/fetch-articles.mjs`, que pregunta por
   los artículos: si alguna vez apuntan a lugares distintos, el sitio mezclaría el
   contenido de dos entornos sin avisar. */
const BRAVO = {
  apiUrl: process.env.BRAVO_API_URL ?? 'https://bravo.goberna.us',
  tenant: process.env.BRAVO_TENANT ?? 'gavilano',
}

/**
 * ¿El seed ya se cargó en la base de PRODUCCIÓN de este tenant (fase 5 de la guía)?
 *
 * Mientras es `false`, que la API devuelva cero páginas es esperable y el sitio se
 * arma con `content/seed.json`. Una vez cargado el seed, un cero deja de ser un
 * estado válido y pasa a ser una alarma: significa que se despublicaron las páginas
 * o que la versión publicada se perdió, y seguir adelante con el seed le revertiría
 * el contenido al cliente con el deploy en verde.
 *
 * ⚠️ Se pone en `true` en el MISMO PR que corre la fase 5. Está acá, versionado, y
 * no en el archivo de caché del build anterior, porque `npm ci` borra
 * `node_modules/` en los runners y esa memoria no sobreviviría.
 */
const SEED_YA_CARGADO_EN_PRODUCCION = false

const ID_CONTENIDO = 'virtual:bravo/contenido'
const ID_RESUELTO = '\0' + ID_CONTENIDO

/* Dónde queda el mismo dato para `scripts/seo-prerender.mjs`, que corre DESPUÉS y en
   otro proceso. Comparte el archivo en vez de volver a preguntarle a la API: si
   alguien publica entre las dos consultas, el bundle tendría una página que el
   prerender no conoce, y esa página saldría con el <head> del home (P16b). */
const CACHE = 'node_modules/.tmp/bravo-contenido.json'

const TIMEOUT_MS = 15000

async function pedir(ruta: string): Promise<unknown> {
  const url = `${BRAVO.apiUrl}${ruta}?tenant=${encodeURIComponent(BRAVO.tenant)}`
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!res.ok) throw new Error(`GET ${ruta} respondió ${res.status}`)
  return res.json()
}

/**
 * Las páginas y menús publicados, o `null` si hay que armar el sitio con el seed.
 *
 * Los dos casos en que Bravo «no da páginas» son DISTINTOS y acá se tratan distinto.
 * Es la decisión más importante de esta fase, así que va escrita entera:
 *
 * 1. **La API contesta 200 y no hay páginas.** Es legítimo y esperado: es la ventana
 *    entre deployar el tema y cargar el seed en la base del cliente. El sitio sale
 *    con `content/seed.json`, que es el contenido de hoy, y se avisa por el log.
 *
 * 2. **La API falla** (red, timeout, 5xx, JSON inválido). Acá NO se puede distinguir
 *    «el cliente todavía no cargó nada» de «el cliente ya editó su portada y no
 *    podemos leerla». Armar el `dist/` con el seed en ese caso le REVIERTE las
 *    ediciones sin decírselo a nadie, y el `rsync --delete` del deploy se lleva del
 *    docroot las carpetas de las páginas que él haya creado. Por eso se corta el
 *    build: un deploy que falla se reintenta y el sitio vivo no se toca, mientras que
 *    una portada que volvió sola a la versión de julio hay que descubrirla.
 *
 * (En Barrionuevo la conclusión es la misma por otro camino: allá el hosting no tiene
 * fallback de SPA y una página sin carpeta da un 404 duro. Acá `copy-404.mjs` deja el
 * shell del SPA, así que el daño no es un 404 sino una reversión silenciosa.)
 */
async function contenidoPublicado(estricto: boolean) {
  let paginas: { pages?: unknown[] }
  let menus: { menus?: Record<string, unknown[]> }
  try {
    ;[paginas, menus] = (await Promise.all([
      pedir('/v1/public/pages'),
      pedir('/v1/public/menus'),
    ])) as [{ pages?: unknown[] }, { menus?: Record<string, unknown[]> }]
  } catch (error) {
    const detalle = error instanceof Error ? error.message : String(error)
    if (!estricto) {
      /* En `dev` no hay rsync ni docroot que arruinar: se avisa y se sigue con el
         seed, que es lo que hace falta para trabajar sin red. */
      console.warn(`[bravo] ⚠️  no se pudo leer el contenido (${detalle}); se usa content/seed.json`)
      return null
    }
    throw new Error(
      `[bravo] no se pudo leer el contenido de Bravo: ${detalle}. ` +
        'Se aborta el build a propósito: armar el sitio con el seed cuando Bravo SÍ tenía ' +
        'páginas le revertiría al cliente lo que haya editado, y el rsync --delete del deploy ' +
        'se llevaría las carpetas de sus páginas. ' +
        `Comprobar: curl -s "${BRAVO.apiUrl}/v1/public/pages?tenant=${BRAVO.tenant}"`,
      { cause: error },
    )
  }

  /* Un 200 con la FORMA equivocada no es «no hay páginas»: es un fallo, y de los
     que más engañan. Puede ser que Bravo haya cambiado el sobre de la respuesta,
     que un proxy conteste 200 con un `{error:…}`, o que BRAVO_API_URL apunte a otro
     servicio que también habla JSON. Antes esto caía en la misma rama que «el
     tenant no cargó nada» y el aviso afirmaba una causa que nadie había
     comprobado — el mismo modo de fallar que el aborto existe para evitar, pero
     disfrazado de caso normal y con el deploy en verde. */
  if (!Array.isArray(paginas.pages)) {
    const recibido = JSON.stringify(paginas).slice(0, 200)
    throw new Error(
      `[bravo] ${BRAVO.apiUrl} contestó 200 pero sin una lista \`pages\`. ` +
        'No es «el tenant todavía no tiene páginas»: es una respuesta con otra forma, ' +
        'así que se aborta el build igual que con un fallo de red. ' +
        `Recibido: ${recibido}`,
    )
  }

  if (paginas.pages.length === 0) {
    /* Cero páginas es legítimo SÓLO mientras el seed no esté cargado en la base del
       cliente (la fase 5 de la guía). Después, un cero significa que algo se
       despublicó o que una migración se llevó puesta la versión publicada, y armar
       el sitio con el seed de julio le revertiría el contenido con el deploy en
       verde. Por eso la bandera de abajo, y por eso se cambia en el MISMO PR que
       corre la fase 5. */
    if (SEED_YA_CARGADO_EN_PRODUCCION) {
      throw new Error(
        `[bravo] el tenant '${BRAVO.tenant}' devolvió CERO páginas y el seed ya está cargado en producción. ` +
          'Eso no es un tenant sin migrar: algo se despublicó o la versión publicada desapareció. ' +
          'Se aborta antes de que el rsync --delete se lleve las carpetas de las páginas vivas. ' +
          `Comprobar: curl -s "${BRAVO.apiUrl}/v1/public/pages?tenant=${BRAVO.tenant}"`,
      )
    }
    console.warn(
      `[bravo] ⚠️  el tenant '${BRAVO.tenant}' no tiene páginas publicadas todavía; se usa content/seed.json`,
    )
    return null
  }

  /* El módulo virtual se declara como `Page[]` (`lib/bravo-contenido.d.ts`) sobre lo
     que en realidad es `unknown[]`: ese `.d.ts` es una promesa, no una comprobación.
     El camino del SEED sí está validado contra el catálogo (`seed.test.ts`), así que
     sin esto el único camino sin validar sería justo el que corre en producción.
     No se valida el contenido de cada sección —eso es del panel contra el catálogo—
     sino lo mínimo que rompe fuera del render: una página sin `slug` hace que el
     prerender escriba `dist/undefined/index.html`, y una con `sections` que no es
     lista revienta al dibujar. */
  const malas = paginas.pages
    .map((p, i) => {
      const pagina = p as { slug?: unknown; sections?: unknown }
      if (typeof pagina.slug !== 'string') return `#${i}: sin \`slug\` de texto`
      if (!Array.isArray(pagina.sections)) return `'${pagina.slug}': \`sections\` no es una lista`
      return null
    })
    .filter(Boolean)

  if (malas.length > 0) {
    throw new Error(
      `[bravo] ${BRAVO.apiUrl} devolvió páginas con una forma que este tema no sabe dibujar: ` +
        `${malas.join(' · ')}. Se aborta el build en vez de hornear un sitio roto.`,
    )
  }

  /* Una página cuyo slug pisa una ruta del código no se dibuja nunca: el enrutador
     prefiere el segmento literal. El cliente la crea desde el panel y no pasa nada,
     sin ningún error. Avisar es lo único que se puede hacer desde acá. */
  const rutasFijas = new Set((MANIFEST.fixedRoutes ?? []).map((r) => r.path.replace(/^\/|\/$/g, '')))
  for (const p of paginas.pages as { slug: string }[]) {
    if (rutasFijas.has(p.slug)) {
      console.warn(
        `[bravo] ⚠️  la página '${p.slug}' tiene el mismo slug que una ruta fija del tema: ` +
          'el sitio va a dibujar la del código y la del panel no se va a ver nunca.',
      )
    }
  }

  console.log(
    `[bravo] ${paginas.pages.length} página(s) y ${Object.keys(menus.menus ?? {}).length} menú(s) desde Bravo`,
  )
  return { pages: paginas.pages, menus: menus.menus ?? {} }
}

function contenidoDeBravo(): Plugin {
  /* Arranca en `true`: si alguna vez `configResolved` dejara de correr, el fallo
     seguro es cortar el build, no armar el sitio con el seed sin avisar. */
  let estricto = true
  return {
    name: 'bravo-contenido',
    configResolved(config) {
      estricto = config.command === 'build'
    },
    resolveId(id) {
      return id === ID_CONTENIDO ? ID_RESUELTO : undefined
    },
    async load(id) {
      if (id !== ID_RESUELTO) return undefined
      const contenido = await contenidoPublicado(estricto)
      if (estricto) {
        await mkdir(dirname(CACHE), { recursive: true })
        await writeFile(CACHE, JSON.stringify(contenido))
      }
      return `export default ${JSON.stringify(contenido)}\n`
    },
  }
}

export default defineConfig({
  base,
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    siteManifest(),
    contenidoDeBravo(),
  ],
})
