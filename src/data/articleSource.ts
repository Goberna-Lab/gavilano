// src/data/articleSource.ts
// Fuente única de artículos para el sitio.
// El sitio debe respetar los artículos locales definidos en articles.ts.
import { articles as localArticles, type Article } from './articles'
import { mapBravoToDisplay, type DisplayArticle } from './bravoTypes'
import { bravoArticlesRaw } from './bravo-articles.generated'
import { asset } from '../utils/asset'

const DEFAULT_COVER = 'alcaldegavi.png'

function mapLocalToDisplay(a: Article): DisplayArticle {
  return {
    slug: a.slug,
    image: a.image,
    imageIsAbsolute: false,
    imageWidth: a.imageWidth,
    imageHeight: a.imageHeight,
    titleBefore: a.titleBefore,
    titleBold: a.titleBold,
    excerpt: a.excerpt,
    detailLead: a.detailLead,
    body: a.body,
    source: 'local',
  }
}

/**
 * Lista activa de artículos. Prioriza los artículos publicados en Bravo
 * (horneados en build por scripts/fetch-articles.mjs); si no hay ninguno
 * horneado, cae a los artículos locales de articles.ts.
 */
const bravoArticles: DisplayArticle[] = bravoArticlesRaw.map(mapBravoToDisplay)
export const displayArticles: DisplayArticle[] =
  bravoArticles.length > 0 ? bravoArticles : localArticles.map(mapLocalToDisplay)

export function getDisplayArticleBySlug(slug: string | undefined): DisplayArticle | null {
  if (!slug) return null
  return displayArticles.find((a) => a.slug === slug) ?? null
}

/** URL lista para usar en <img>/background: absoluta (Bravo) o asset local. */
export function coverSrc(a: DisplayArticle): string {
  if (a.imageIsAbsolute && a.image) return a.image
  return asset(a.image || DEFAULT_COVER)
}

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function parts(iso: string): { d: number; month: string; y: number } | null {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return { d: date.getUTCDate(), month: MONTHS_ES[date.getUTCMonth()], y: date.getUTCFullYear() }
}

/** "30 Mayo 2026" — vacío si no hay fecha válida. */
export function formatDate(iso: string | undefined): string {
  if (!iso) return ''
  const p = parts(iso)
  return p ? `${p.d} ${p.month} ${p.y}` : ''
}

/** "23 MAYO 2026" (mayúsculas, para las tarjetas del home). */
export function formatDateUpper(iso: string | undefined): string {
  return formatDate(iso).toUpperCase()
}

/** Minutos de lectura estimados a partir del cuerpo (HTML o párrafos). */
export function readingMinutes(a: DisplayArticle): number {
  const text = a.bodyHtml
    ? a.bodyHtml.replace(/<[^>]*>/g, ' ')
    : a.body.join(' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
