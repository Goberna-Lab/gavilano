# project-profile — gavilano

Lo lee el agente `worktree-merge-supervisor` (plugin `goberna-agents` de `Goberna-Lab/platform`)
para adaptarse a este repo.

## Stack
- **React 19 + Vite 8 + TypeScript** estricto, **React Compiler** (`babel-plugin-react-compiler`).
- ESLint flat config. SPA estático, **sin backend ni DB**.
- Package manager: **npm** (`package-lock.json`).

## Migraciones / DB / contrato
- **Sin DB propia y sin migraciones**, pero **YA NO es «todo frontend»**: desde la migración a
  Bravo N2 hay un **contrato** y una **dependencia de red en el build**.
- **Contrato**: el manifest v2 de Bravo (`bravo/docs/SPEC-secciones-disenadas-v1.md`). Lo declara
  `src/lib/catalogo.ts` y de ahí se emite `/site-manifest.json`. Es el contrato más rígido de
  Bravo: si un cambio del tema lo necesita mover, se para y se avisa.
- **La misma forma está escrita en tres lugares** y sólo la ata un test:
  `src/lib/catalogo.ts` (lo que el panel deja editar) · `src/lib/contenido.ts` (lo que el
  componente recibe) · `content/seed.json` (el contenido de hoy). `src/lib/seed.test.ts` los cruza.
- **El build llama a `bravo.goberna.us`** (`vite.config.ts`, plugin `bravo-contenido`) y **aborta**
  si la API falla o contesta con otra forma. Un PR puede ponerse rojo por una caída de Bravo y no
  por su propio código.
- **La regla de fallback está duplicada a propósito** entre `src/lib/fuente.ts` (bundle) y
  `scripts/seo-prerender.mjs` (otro proceso). `src/lib/prerender.test.ts` le pasa a la copia del
  script los mismos casos que `fuente.test.ts` a la del bundle: es lo único que las ata.

## Hotspots (shared-core — colisión = HIGH)
| Path | Por qué |
|---|---|
| `vite.config.ts` | Config de build/base-path; un merge mal → assets rotos en Pages. |
| `tsconfig*.json` | Config TS (app/node/base). |
| `eslint.config.js` | Reglas de lint; el CI y el deploy fallan si rompe. |
| `index.html` | Entry HTML único. |
| `src/index.css` · `src/App.css` · `src/mobile.css` · `src/hover-effects.css` | CSS global (tokens, layout, responsive). Dos ramas tocándolos = conflicto visual. |
| `package.json` + `package-lock.json` | Deps/lockfile. |
| `src/App.tsx` · `src/main.tsx` | Composición raíz de la app. |
| `src/lib/catalogo.ts` | **El contrato con Bravo.** Cambiarlo cambia lo que el panel del cliente deja editar. |
| `content/seed.json` | El contenido del sitio como dato. Dos ramas tocándolo = conflicto de contenido. |
| `src/components/SectionRenderer.tsx` | `type` → componente. El orden de sus imports fija el orden de la cascada de CSS. |
| `scripts/seo-prerender.mjs` | Escribe el `<head>`, el sitemap y una carpeta por página. |

## Deploy
- `main` → **vps2** (`juandediosgavilano.com`), por **rsync** del build a nginx (estilo edwards).
  Pipeline gated vía `deploy-rsync-reusable@v1.0.0`: build (`base '/'`) + guard dist-vacío + rsync
  `--delete` al docroot `/srv/nexus-containers/gavilano/public`. Runner `vps2-gavilano-runner`.
- DNS Cloudflare (proxied, SSL flexible) → vps2. **PRs corren CI** (lint + build) antes de mergear.

## Supervisor: **COMPLETO** para lo que toque la capa de contenido

Era LITE cuando el repo era «todo frontend». Ya no: hay contrato con Bravo, el build depende de una
API externa y la misma forma está escrita en tres archivos. Corré el supervisor completo si el PR
toca `src/lib/`, `content/seed.json`, `scripts/` o `vite.config.ts`.

Sigue alcanzando el LITE para un cambio de CSS o de una vista suelta, donde el riesgo real siguen
siendo dos ramas tocando el CSS global a la vez.

### Lo que más falla en silencio acá (mirar esto primero)
1. **Cardinalidad**: una `fixed-list` del catálogo tiene del otro lado una constante del componente
   indexada por la MISMA posición. Si el catálogo declara N y el componente tiene N-1, el sitio se
   rompe **en runtime, no en el build**. `catalogo.test.ts` fija los números, pero **los compara
   contra literales escritos en el test**, no contra las constantes del componente: atrapa «cambié
   el catálogo y no el test», no «cambié el componente». Ése es el eslabón todavía humano.
2. **Nodos de texto**: al mover texto a props, `<strong>X</strong> resto` es UN nodo con el espacio
   adentro. Partirlo crea dos y el navegador no lleva el kerning de uno al otro. No se ve a ojo.
3. **Un 200 con la forma equivocada** no es «no hay páginas»: tiene que abortar el build, no caer
   al seed.
