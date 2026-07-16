# gavilano — reglas para Claude

Sitio/SPA de Goberna-Lab. Parte del ecosistema de agentes Goberna (ver más abajo).

## Stack
- **React 19 + Vite 8 + TypeScript** (estricto). **React Compiler activado** (`babel-plugin-react-compiler`)
  → NO hace falta `useMemo`/`useCallback` manuales; el compiler memoiza.
- ESLint (`eslint.config.js`, flat config) con `react-hooks` + `react-refresh`.
- **Sin backend, sin base de datos.** Es 100% frontend estático.

## Deploy
- **`main` → vps2** (`juandediosgavilano.com`), por **rsync** del build a nginx (igual que edwardsinfante).
  Pipeline gated vía `Goberna-Lab/platform` (reusable rsync, pinned `@v1.0.0`): build (`base '/'`) →
  guard de dist-vacío → `rsync --delete` al docroot `/srv/nexus-containers/gavilano/public`.
- Corre en el runner self-hosted **`vps2-gavilano-runner`** (label `gavilano`). NO usa GitHub Pages.
- DNS en Cloudflare (proxied, SSL flexible) → vps2. Base path = `/` (dominio raíz): NO setees
  `VITE_BASE_PATH`, o los assets quedan en `/gavilano/` y el sitio carga en blanco.

## Flujo de trabajo
- **`main` = producción** (lo que se ve en Pages). **No pushees directo a `main`**: rama feature + PR.
- Cada **PR corre CI** (`ci.yml`: lint + typecheck + build en ubuntu). Mergeá solo con el CI en verde.
- Commits: conventional (`feat:`, `fix:`, `chore:`). PRs chicos y revisables.
- Comandos: `npm run dev` (local) · `npm run lint` · `npm run build` · `npm run preview`.

## Agentes del equipo
Instalá los agentes/skills de Goberna-Lab (supervisor de merges, especialistas, design-system, etc.):
```
/plugin marketplace add Goberna-Lab/platform
/plugin install goberna-agents@goberna-tools
/plugin install goberna-specialists@goberna-tools
/plugin install goberna-skills@goberna-tools
```
Antes de un PR que toque varios archivos, pedile al agente `worktree-merge-supervisor` un veredicto
(lee `.claude/project-profile.md`). Para UI seguí la skill `goberna-design-system`.

## Hotspots (coordiná si dos ramas los tocan)
`vite.config.ts` · `eslint.config.js` · `tsconfig*.json` · `index.html` · CSS global en `src/` ·
`package.json` + `package-lock.json`.

## Agent skills

### Issue tracker

GitHub Issues del repo (via gh CLI). Ver `docs/agents/issue-tracker.md`.

### Triage labels

Los 5 labels canónicos por defecto. Ver `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` en la raíz. Ver `docs/agents/domain.md`.
