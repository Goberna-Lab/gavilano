import { copyFile } from 'node:fs/promises'

// El 404 del SPA es el mismo shell del home. IMPORTANTE: este script corre DESPUÉS
// de seo-prerender.mjs, que reescribe dist/index.html con la meta de la ruta '/'
// (home). Por eso copiar dist/index.html deja el 404 con la meta del home — correcto.
// Si cambiás el orden del pipeline, revisá que el home siga quedando en la raíz.
await copyFile('dist/index.html', 'dist/404.html')
