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

export default defineConfig({
  base,
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    siteManifest(),
  ],
})
