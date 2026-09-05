# gavilano — reglas para Claude

Sitio/SPA de Goberna-Lab. Parte del ecosistema de agentes Goberna (ver más abajo).

## Stack
- **React 19 + Vite 8 + TypeScript** (estricto). **React Compiler activado** (`babel-plugin-react-compiler`)
  → NO hace falta `useMemo`/`useCallback` manuales; el compiler memoiza.
- ESLint (`eslint.config.js`, flat config) con `react-hooks` + `react-refresh`.
- **Sin backend, sin base de datos.** Es 100% frontend estático.

## Bravo — el cliente edita su sitio (nivel N2)

El contenido de las **cinco páginas** (`/`, `/biografia`, `/experiencia`, `/mi-aporte`,
`/propuestas`) sale de Bravo (tenant `gavilano`), no del código. Los artículos y el formulario ya
salían de ahí desde antes.

- **El contrato** está en `bravo/docs/SPEC-secciones-disenadas-v1.md`; cómo se aplica, en
  `bravo/docs/GUIA-migrar-un-sitio-a-bravo.md`. Si un cambio del tema necesita mover el contrato,
  se para y se avisa: es lo más rígido de Bravo.
- `src/lib/catalogo.ts` es la **fuente única** del catálogo: de ahí se emite `/site-manifest.json`
  en el build (plugin `bravo-site-manifest`) y contra eso se valida `content/seed.json`. No hay un
  `.json` a mano — se desincroniza el primer día.
- `src/lib/contenido.ts` le pone nombre a la forma del `content` de cada sección;
  `components/SectionRenderer.tsx` mapea `type` → componente con un `switch`.
- `content/seed.json` es el contenido de hoy como dato: es lo que el sitio dibuja **mientras Bravo
  no tenga páginas** y lo que se carga en Bravo para arrancar.

### Reglas que se rompen seguido

- **El contenido NUNCA es una clase CSS.** Lo que viaja son valores; el componente los aplica.
- **Un número de maquetación no es contenido**: el icono de cada pilar, el `+` de la cifra del
  medio, el recuadro del rótulo de tres cargos de la línea de tiempo y el `name` de cada campo del
  formulario viven en el componente, **indexados por la misma posición** que la lista. Por eso casi
  toda lista es `fixed-list` y por eso las cantidades están escritas en `catalogo.test.ts`: si el
  catálogo dice 6 y el componente tiene 5 constantes, el sitio se rompe **en runtime, no en el
  build**.
- **Los saltos de renglón viajan como `"\n"`**, nunca como `"<br>"` (ver `lib/texto.tsx`).
- **Al extraer texto a props, no cambies la cantidad de nodos de texto.** `<strong>X</strong> resto`
  es UN nodo con el espacio adentro; escribirlo `{' '}{resto}` crea dos y el navegador no lleva el
  kerning de uno al otro. Se ve sólo en una comparación píxel a píxel.
- **Los enlaces internos van con barra final.** Medido en producción: `/biografia` responde **301** a
  `/biografia/`. Es además la forma que Bravo le da a las páginas (`page` → `/<slug>/`), así que el
  menú queda coherente. Hay un test que lo exige.

### ⚠️ El build ahora DEPENDE de Bravo, y aborta si no contesta

`vite.config.ts` (plugin `bravo-contenido`) le pregunta a `/v1/public/pages` y `/v1/public/menus`
**durante el build** y hornea la respuesta en el bundle. Distingue dos casos que parecen el mismo:

| Qué pasó | Qué hace |
|---|---|
| La API contesta 200 y **no hay páginas** | Usa `content/seed.json` y avisa. Es la ventana legítima entre deployar el tema y cargar el seed. |
| La API **falla** (red, timeout, 5xx, JSON inválido) | **Corta el build.** |

Corta porque en ese caso no se puede distinguir «el cliente no cargó nada» de «el cliente ya editó
su portada y no la podemos leer»: armar el `dist/` con el seed le revertiría las ediciones en
silencio, y el `rsync --delete` del deploy se llevaría del docroot las carpetas de las páginas que
él haya creado. Un deploy que falla se reintenta; una portada que volvió sola hay que descubrirla.

Y un tercer caso que parece el primero y no lo es: **200 con otra forma** (Bravo cambia el sobre de
la respuesta, un proxy contesta `200 {"error":…}`, `BRAVO_API_URL` apunta a otro servicio que
también habla JSON). Eso **aborta**, porque «no encontré una lista `pages`» no es «el tenant no
tiene páginas» y avisar lo segundo sería afirmar una causa que nadie comprobó.

⚠️ **Al correr la fase 5, poner `SEED_YA_CARGADO_EN_PRODUCCION = true`** en `vite.config.ts`, en el
mismo PR. Mientras es `false`, cero páginas es esperable y se usa el seed. Una vez cargado el seed,
un cero deja de ser válido —significa que se despublicaron las páginas o que se perdió la versión
publicada— y seguir con el seed le revertiría el contenido al cliente con el deploy en verde. La
bandera está versionada y no en la caché del build anterior porque `npm ci` borra `node_modules/`
en los runners.

Para trabajar sin red: en `dev` **no** corta (avisa y usa el seed). `BRAVO_API_URL` y `BRAVO_TENANT`
apuntan a otro lado si hace falta.

⚠️ **CI lee el tenant VIVO del cliente.** `ci.yml` corre `npm run build` sin override, así que un PR
se pone rojo cuando `bravo.goberna.us` no contesta y se presenta como «tu PR rompió el build». Es
consistente con la política de arriba —no conviene deployar el tema con Bravo caído— pero conviene
saberlo antes de salir a buscar el error en el diff.

### ⚠️ Asimetría conocida: los ARTÍCULOS no cortan el build (issue #46)

`scripts/fetch-articles.mjs` tiene escrito «REGLA DE ORO: este script NUNCA rompe el build» y con
Bravo caído cae a los 8 artículos locales de `src/data/articles.ts`. Con 36 publicados en Bravo, eso
significa que **un build verde puede publicar 8 y el `rsync --delete` borrar las otras 28** del
docroot. Como `copy-404.mjs` deja el shell del SPA, no dan 404 duro: dan **soft-404 con la meta del
home**, o sea que se pierden en silencio también para Google. Es anterior a la migración de páginas
y tiene su propio issue: **no lo arregles de paso**.

### El SEO por página lo edita el cliente

`scripts/seo-prerender.mjs` ya no tiene la lista de rutas escrita a mano: la saca de las páginas, con
el `seo_title`, la `seo_description`, la imagen para compartir y el `noindex` que el cliente carga
desde su panel. Lee el archivo que dejó el plugin en `node_modules/.tmp/bravo-contenido.json` en vez
de volver a preguntarle a la API: si alguien publica entre las dos consultas, el bundle tendría una
página que el prerender no conoce y esa página saldría con el `<head>` del home.

Efecto secundario: una página que el cliente **cree desde el panel** obtiene su carpeta, su `<title>`
propio y su entrada en el `sitemap.xml` sin que nadie toque el código.

Los **artículos** siguen con `canonical` sin barra final (`/articulos/<slug>`), que también responde
301. Es el mismo arreglo de una línea pero toca 36 páginas vivas y queda fuera de esta migración.

### Sumar un cargo a la línea de tiempo

Los nueve cargos de `/experiencia` son una `fixed-list`, así que **el cliente no puede agregar uno**.
Es a propósito: el diseño le pone recuadro al rótulo de tres y cuerpo más chico a los años del
último, sin patrón semántico, y en v1 no hay tipo `select` para que eso viaje como contenido sin ser
texto libre. Para sumar el décimo: una entrada más en `catalogo.ts`, una más en el seed, y revisar
`RECUADRO`/`COMPACTO` en `components/ExperienciaLineaDeTiempo.tsx`.

### Ensayar el seed contra una Bravo local (antes de tocar la base del cliente)

Cargar el seed en producción es el único paso irreversible de esta migración. Se ensaya local:

```bash
# el contenedor de la receta del CLAUDE.md de bravo; identity.tenants es de nexus-control,
# así que en local el tenant se inserta a mano CON display_name
docker exec -i bravo_dev_db psql -U bravo -d bravo_dev <<'SQL'
INSERT INTO identity.tenants (slug, display_name) VALUES ('gavilano','Juan de Dios Gavilano')
  ON CONFLICT (slug) DO NOTHING;
INSERT INTO portal.tenant_sites (tenant_id, site_base_url, rebuild_repo, rebuild_workflow, article_url_pattern)
SELECT id,'https://juandediosgavilano.com','Goberna-Lab/gavilano','deploy.yml',
       'https://juandediosgavilano.com/articulos/{slug}'
FROM identity.tenants WHERE slug='gavilano' ON CONFLICT (tenant_id) DO NOTHING;
SQL

cd ../bravo
DATABASE_URL="postgres://bravo:bravo@localhost:5470/bravo_dev" JWT_SECRET=dev GITHUB_DISPATCH_TOKEN=placeholder \
  npm run seed-pages -w @goberna/bravo-api -- --tenant gavilano \
  --file /Users/milaa/goberna/gavilano-bravo/content/seed.json
```

Lo que hay que mirar no es que el script no falle, sino que **`/v1/public/menus` devuelva los mismos
`href` que el sitio dibuja con el seed**. Si no coinciden, el problema está en el seed o en las anclas.

⚠️ **Trampa al hacer este ensayo**: `BRAVO_API_URL` la comparten el plugin de páginas y
`scripts/fetch-articles.mjs`. Apuntarla a una Bravo local que no tiene los 36 artículos cambia las
tarjetas de la portada, y la comparación de píxeles se llena de diferencias que **no** son de las
páginas. Para una comparación limpia, hay que dejar los artículos constantes:

```bash
BRAVO_API_URL=https://bravo.goberna.us node scripts/fetch-articles.mjs   # los 36 de verdad
BRAVO_API_URL=http://localhost:4080 npx vite build                        # las páginas, de local
BRAVO_API_URL=http://localhost:4080 node scripts/seo-prerender.mjs && node scripts/copy-404.mjs
```

Medido así, el sitio armado **desde Bravo** sale con 0 píxeles de diferencia contra el armado desde
el seed, en las 5 páginas a 1920 y a 430.

### Comprobar que una página NUEVA de verdad aparece

Es la promesa de N2 y conviene demostrarla, no asumirla. Se levanta una Bravo de mentira que
devuelva una página que **no existe ni en el código ni en el seed**, se compila apuntándole, y tiene
que aparecer `dist/<slug>/index.html` con su `<title>` propio, su `canonical` y su línea en el
`sitemap.xml`. Si eso sale, el cliente puede crear páginas sin que nadie toque el repo.

### Tres cosas que el modelo N2 hace y conviene saber antes de que sorprendan

**«Súmate» son TRES instancias, no una.** Está en la portada, en biografía y en experiencia, hoy con
el mismo texto. Son independientes: el cliente edita la de la portada y las otras dos siguen
diciendo lo de antes. Además `SeccionSuelta` —la que dibuja el formulario en `/articulos` y en cada
nota— toma siempre **la primera**, que es la de la portada. Es inherente a que cada página tenga sus
propias secciones; vale decírselo al cliente en el traspaso.

**El fallback de páginas es todo-o-nada y el de menús es por clave.** O sea que puede pasar:
páginas de Bravo + menú del seed (si el cliente todavía no configuró el menú). Si además renombró un
slug, el menú del seed apunta a una página que ya no existe y el sitio manda al home —
`PaginaDeBravo` hace `<Navigate to="/">`— sin error en ningún lado. Nadie comprueba hoy que las dos
fuentes hablen de los mismos slugs.

**Las imágenes de contenido ya no pasan por `asset()`.** El seed guarda `/images/…` y el componente
lo usa tal cual, mientras los iconos y flechas de marca siguen usando `asset()` (que prefija
`BASE_URL`). No es un descuido: una imagen que el cliente suba desde el panel llega como URL de
Bravo, y prefijarle el base-path la rompería. La consecuencia es que con un `VITE_BASE_PATH`
distinto de `/` el sitio quedaría a medio romper — una razón más para lo que ya dice el bloque de
Deploy: **no setear `VITE_BASE_PATH`**.

### Código muerto

`PropuestasDetalleSection.tsx` y `ParallaxSection.tsx` no los importa nadie. No entran al catálogo.
Su limpieza es su propio PR.

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
- Comandos: `npm run dev` (local) · `npm run lint` · `npm test` · `npm run build` · `npm run preview`.
- **Tests: vitest** (`npm test`). Los tests tienen su **propio proyecto de TypeScript**
  (`tsconfig.test.json`) porque leen `public/` con `node:fs` y la app NO tiene `node` en sus
  `types` — así un componente que use `process` falla al compilar en vez de llegar al navegador.
- **Fidelidad visual**: ningún cambio en un componente de sección se da por terminado sin capturas
  Playwright a **1920 y 430** de las 5 páginas, rama contra base, contando píxeles con diferencia
  > 8/255 y con la fila de control (base contra sí misma). El método está en la §4 de la guía.

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
