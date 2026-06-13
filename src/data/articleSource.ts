// src/data/articleSource.ts
// Fuente única de artículos para el sitio. Combina:
//   1. Artículos publicados en Bravo (horneados en build → bravo-articles.generated.ts)
//   2. Los 6 artículos locales (articles.ts) como FALLBACK total.
//
// Regla (modelo edwards): si Bravo tiene ≥1 artículo publicado, esos son LOS
// artículos del sitio. Si Bravo no respondió o no hay ninguno, el sitio muestra
// los locales. Nunca queda vacío.
import { articles as localArticles, type Article } from './articles'
import { bravoArticlesRaw } from './bravo-articles.generated'
import { mapBravoToDisplay, type DisplayArticle } from './bravoTypes'
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

const bravoArticles: DisplayArticle[] = bravoArticlesRaw.map(mapBravoToDisplay)

/** Lista activa: Bravo si hay, si no los locales. */
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
