// src/data/bravoTypes.ts
// Contrato del endpoint público de Bravo + forma unificada que consumen los componentes.
//
// Bravo (bravo.goberna.us) sirve los artículos publicados en snake_case desde
// GET /api/public/articles?tenant=gavilano  (snapshot inmutable, no el borrador).
// Este módulo NO depende del DOM ni de import.meta — lo puede importar tanto el
// código del SPA como el script de prerender SEO (node).

/** Forma cruda tal como la devuelve la API pública de Bravo (snake_case). */
export interface BravoPublicArticle {
  slug: string
  title: string
  excerpt: string | null
  body_html: string | null
  cover_image_url: string | null
  category: string | null
  seo_title: string | null
  seo_description: string | null
  og_image_url: string | null
  canonical_url: string | null
  noindex: boolean
  published_at: string
}

/** Forma unificada que renderiza el sitio (Bravo o fallback local conviven acá). */
export interface DisplayArticle {
  slug: string
  /** Nombre de asset local (resolver con asset()) o URL absoluta si imageIsAbsolute. */
  image: string
  imageIsAbsolute: boolean
  imageWidth?: number
  imageHeight?: number
  /** Prefijo de título en color (solo artículos locales con título partido). */
  titleBefore: string
  /** Título principal (para Bravo es el título plano completo). */
  titleBold: string
  excerpt: string
  detailLead: string
  /** Párrafos en texto plano (artículos locales). */
  body: string[]
  /** Cuerpo HTML (artículos de Bravo, vía TipTap). */
  bodyHtml?: string
  category?: string
  /** ISO date (artículos de Bravo). */
  publishedAt?: string
  // ─── SEO (artículos de Bravo) ───
  seoTitle?: string
  seoDescription?: string
  ogImageUrl?: string
  canonicalUrl?: string
  noindex?: boolean
  source: 'bravo' | 'local'
}

const s = (v: string | null | undefined): string => (typeof v === 'string' ? v : '')

/** Mapea un artículo crudo de Bravo a la forma unificada del sitio. */
export function mapBravoToDisplay(a: BravoPublicArticle): DisplayArticle {
  const cover = s(a.cover_image_url)
  // Solo tratamos como portada usable una URL absoluta http(s). Una ruta relativa
  // (p. ej. /media/x) resolvería contra el dominio del sitio (incorrecto, el medio
  // vive en bravo.goberna.us) → la descartamos y coverSrc cae al asset por defecto.
  const absolute = /^https?:\/\//i.test(cover)
  return {
    slug: a.slug,
    image: absolute ? cover : '',
    imageIsAbsolute: absolute,
    titleBefore: '',
    titleBold: s(a.title),
    excerpt: s(a.excerpt),
    detailLead: s(a.excerpt),
    body: [],
    bodyHtml: s(a.body_html),
    category: s(a.category) || undefined,
    publishedAt: a.published_at,
    seoTitle: s(a.seo_title) || undefined,
    seoDescription: s(a.seo_description) || undefined,
    ogImageUrl: s(a.og_image_url) || undefined,
    canonicalUrl: s(a.canonical_url) || undefined,
    noindex: Boolean(a.noindex),
    source: 'bravo',
  }
}
