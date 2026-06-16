// scripts/seo-prerender.mjs — POSTBUILD (corre después de `vite build`).
//
// El sitio es un SPA React (canvas fijo 1920px). Sin esto, el HTML inicial de
// CADA ruta es el mismo shell vacío con un <title> en inglés → SEO nulo y los
// crawlers de WhatsApp/Facebook/X (que NO ejecutan JS) no ven nada.
//
// Este script, por cada ruta (home + secciones + cada artículo), escribe un
// dist/<ruta>/index.html = copia del shell construido con el <head> correcto:
// title, description, canonical, Open Graph, Twitter card, JSON-LD. Además genera
// sitemap.xml y robots.txt. El cuerpo sigue hidratando en cliente; lo que ganamos
// es la meta por página servida en el HTML inicial.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = join(ROOT, 'dist')
const GENERATED = join(ROOT, 'src/data/bravo-articles.generated.ts')

const SITE = 'https://juandediosgavilano.com'
const NAME = 'Juan de Dios Gavilano'
const DEFAULT_OG = `${SITE}/images/og-gavilano.jpg`
const DEFAULT_DESC =
  'Juan de Dios Gavilano, candidato a la Alcaldía de Carmen de la Legua Reynoso 2026. Experiencia, propuestas y trabajo por el distrito.'

// ─── Rutas estáticas (las secciones del SPA) ───────────────────────────────────
const STATIC_ROUTES = [
  { path: '/', title: `${NAME} — Alcalde de Carmen de la Legua Reynoso 2026`, description: DEFAULT_DESC, type: 'website' },
  { path: '/biografia', title: `Biografía — ${NAME}`, description: `Conoce la trayectoria de ${NAME}: vecino chalaco, abogado y servidor público al servicio de Carmen de la Legua Reynoso.` },
  { path: '/experiencia', title: `Experiencia — ${NAME}`, description: `La experiencia de gestión municipal de ${NAME} en Carmen de la Legua Reynoso.` },
  { path: '/mi-aporte', title: `Mi Aporte — ${NAME}`, description: `Las obras y aportes de ${NAME} al distrito de Carmen de la Legua Reynoso.` },
  { path: '/propuestas', title: `Propuestas — ${NAME}`, description: 'Educación, seguridad, juventud, desarrollo social y modernización: las propuestas para Carmen de la Legua Reynoso.' },
  { path: '/articulos', title: `Artículos — ${NAME}`, description: 'Ideas y análisis para levantar nuestro distrito. Infórmate sobre lo que pasa en Carmen de la Legua Reynoso.' },
]

// Fallback de artículos para SEO si Bravo aún no tiene ninguno publicado.
// Son los 6 artículos semilla de src/data/articles.ts (contenido estático que
// rara vez cambia). Una vez que Bravo tiene artículos, ESOS mandan.
const LOCAL_FALLBACK = [
  { slug: 'seguridad-serenazgo', title: 'Seguridad como Cimiento del Desarrollo: La historia del cuerpo de Serenazgo Municipal', description: 'Es un error común pensar que la seguridad es un fin en sí mismo. En realidad, es el suelo sobre el cual se construye todo lo demás.' },
  { slug: 'educacion-tecnologia', title: 'Educación y Tecnología: Apostando por el futuro de los estudiantes carmelinos', description: 'En un distrito como el nuestro, la escuela debe ser el centro de una transformación real.' },
  { slug: 'seguridad-digital', title: 'Seguridad Digital: El Cimiento Tecnológico que Transformó Carmen de la Legua Reynoso', description: 'La modernización digital no es un lujo: es una forma concreta de ahorrar tiempo, ordenar trámites y acercar la municipalidad al vecino.' },
  { slug: 'limpieza-urbana', title: 'Gestión Sanitaria y Limpieza: Los Pilares de un Distrito Saludable y Ordenado', description: 'Vivir en un entorno limpio no es un lujo. La limpieza pública es un servicio esencial para la salud y el orden de la ciudad.' },
  { slug: 'cercania-vecinal', title: 'Nutrición y Solidaridad: El Legado de los Programas Alimentarios en Carmen de la Legua Reynoso', description: 'Un niño mal alimentado no aprende con libertad ni puede desarrollar todo su potencial.' },
  { slug: 'parques-vida', title: 'Sanidad Ambiental: Un Compromiso con nuestro Distrito', description: 'Transformar la cara del distrito desde lo más básico: limpieza, cuidado del ambiente y orden en cada barrio.' },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

function readBravoArticles() {
  try {
    const txt = readFileSync(GENERATED, 'utf8')
    // Anclar en la asignación: el `[` del tipo (`BravoPublicArticle[]`) aparece ANTES
    // del `=` y arruinaría el slice. Buscamos el `[` que abre el array LITERAL.
    const eq = txt.indexOf('=', txt.indexOf('bravoArticlesRaw'))
    const start = txt.indexOf('[', eq)
    const end = txt.lastIndexOf(']')
    if (eq === -1 || start === -1 || end === -1 || end < start) return []
    const arr = JSON.parse(txt.slice(start, end + 1))
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

/** Lista efectiva de artículos para SEO (Bravo si hay, si no los locales). */
function articleRoutes() {
  const bravo = readBravoArticles()
  if (bravo.length > 0) {
    return bravo.map((a) => ({
      path: `/articulos/${a.slug}`,
      title: a.seo_title || `${a.title} — ${NAME}`,
      description: a.seo_description || a.excerpt || DEFAULT_DESC,
      ogImage: isAbsUrl(a.og_image_url) ? a.og_image_url : (isAbsUrl(a.cover_image_url) ? a.cover_image_url : DEFAULT_OG),
      canonical: a.canonical_url || `${SITE}/articulos/${a.slug}`,
      noindex: Boolean(a.noindex),
      publishedAt: a.published_at || null,
      type: 'article',
    }))
  }
  return LOCAL_FALLBACK.map((a) => ({
    path: `/articulos/${a.slug}`,
    title: `${a.title} — ${NAME}`,
    description: a.description,
    ogImage: DEFAULT_OG,
    canonical: `${SITE}/articulos/${a.slug}`,
    noindex: false,
    publishedAt: null,
    type: 'article',
  }))
}

const isAbsUrl = (u) => /^https?:\/\//i.test(u || '')

function jsonLd(obj) {
  // Escapamos `<` para que un `</script>` dentro de un string no cierre el bloque.
  return `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`
}

function metaFor(route) {
  const canonical = route.canonical || `${SITE}${route.path === '/' ? '/' : route.path}`
  const ogImage = route.ogImage || DEFAULT_OG
  const ogType = route.type === 'article' ? 'article' : 'website'
  const robots = route.noindex ? 'noindex, nofollow' : 'index, follow'
  const lines = [
    `<meta name="description" content="${esc(route.description)}">`,
    `<link rel="canonical" href="${esc(canonical)}">`,
    `<meta name="robots" content="${robots}">`,
    `<meta property="og:type" content="${ogType}">`,
    `<meta property="og:site_name" content="${esc(NAME)}">`,
    `<meta property="og:locale" content="es_PE">`,
    `<meta property="og:title" content="${esc(route.title)}">`,
    `<meta property="og:description" content="${esc(route.description)}">`,
    `<meta property="og:url" content="${esc(canonical)}">`,
    `<meta property="og:image" content="${esc(ogImage)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(route.title)}">`,
    `<meta name="twitter:description" content="${esc(route.description)}">`,
    `<meta name="twitter:image" content="${esc(ogImage)}">`,
  ]
  if (route.type === 'article') {
    lines.push(
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: route.title,
        description: route.description,
        image: [ogImage],
        ...(route.publishedAt ? { datePublished: route.publishedAt, dateModified: route.publishedAt } : {}),
        author: { '@type': 'Person', name: NAME },
        publisher: { '@type': 'Organization', name: NAME, logo: { '@type': 'ImageObject', url: DEFAULT_OG } },
        mainEntityOfPage: canonical,
      }),
    )
  } else if (route.path === '/') {
    lines.push(
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: NAME,
        jobTitle: 'Candidato a Alcalde de Carmen de la Legua Reynoso',
        url: SITE,
        image: DEFAULT_OG,
      }),
    )
  }
  return lines.join('\n    ')
}

/** Quita meta que vamos a re-inyectar, para que el resultado no tenga duplicados. */
function stripExistingMeta(html) {
  return html
    .replace(/\s*<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/\s*<meta\s+name=["']robots["'][^>]*>/gi, '')
    .replace(/\s*<meta\s+property=["']og:[^"']*["'][^>]*>/gi, '')
    .replace(/\s*<meta\s+name=["']twitter:[^"']*["'][^>]*>/gi, '')
    .replace(/\s*<link\s+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/\s*<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>/gi, '')
}

function renderHtml(template, route) {
  let html = stripExistingMeta(template)
  html = html.replace(/<html[^>]*>/i, '<html lang="es">')
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(route.title)}</title>`)
  html = html.replace('</head>', `    ${metaFor(route)}\n  </head>`)
  return html
}

function writeRoute(template, route) {
  const html = renderHtml(template, route)
  if (route.path === '/') {
    writeFileSync(join(DIST, 'index.html'), html)
    return
  }
  const dir = join(DIST, route.path.replace(/^\//, ''))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}

function buildSitemap(routes) {
  const today = new Date().toISOString().slice(0, 10)
  const urls = routes
    .filter((r) => !r.noindex)
    .map((r) => {
      const loc = `${SITE}${r.path === '/' ? '/' : r.path}`
      const lastmod = r.publishedAt ? r.publishedAt.slice(0, 10) : today
      return `  <url>\n    <loc>${esc(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

function buildRobots() {
  return `User-agent: *\nAllow: /\nDisallow: /panel\nDisallow: /panel/\n\nSitemap: ${SITE}/sitemap.xml\n`
}

// ─── Main ──────────────────────────────────────────────────────────────────────
function main() {
  const indexPath = join(DIST, 'index.html')
  if (!existsSync(indexPath)) {
    console.error('[seo-prerender] dist/index.html no existe — ¿corrió vite build?')
    process.exit(1)
  }
  const template = readFileSync(indexPath, 'utf8')
  const routes = [...STATIC_ROUTES, ...articleRoutes()]

  for (const route of routes) writeRoute(template, route)

  writeFileSync(join(DIST, 'sitemap.xml'), buildSitemap(routes))
  writeFileSync(join(DIST, 'robots.txt'), buildRobots())

  const articleCount = routes.filter((r) => r.type === 'article').length
  console.log(`[seo-prerender] ${routes.length} rutas con <head> propio (${articleCount} artículos) + sitemap.xml + robots.txt`)
}

main()
