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

  if (!Array.isArray(paginas.pages) || paginas.pages.length === 0) {
    console.warn(
      `[bravo] ⚠️  el tenant '${BRAVO.tenant}' no tiene páginas publicadas; se usa content/seed.json`,
    )
    return null
  }

  console.log(
    `[bravo] ${paginas.pages.length} página(s) y ${Object.keys(menus.menus ?? {}).length} menú(s) desde Bravo`,
  )
  return { pages: paginas.pages, menus: menus.menus ?? {} }
}

function contenidoDeBravo(): Plugin {
  let estricto = false
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
