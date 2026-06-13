// scripts/fetch-articles.mjs — PREBUILD (corre antes de tsc/vite).
//
// Baja los artículos publicados de Bravo y los hornea en
// src/data/bravo-articles.generated.ts para que el sitio los sirva sin depender
// de la red en runtime (modelo build-time, igual que edwards).
//
// Endpoint real: GET {API_URL}/v1/public/articles?tenant=gavilano&status=published
//
// REGLA DE ORO: este script NUNCA rompe el build. Cualquier error (red, timeout,
// non-2xx, JSON inválido, tenant inexistente → 404) deja el archivo con un array
// vacío y el sitio cae al fallback local (articleSource.ts).
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../src/data/bravo-articles.generated.ts')

const API_URL = process.env.BRAVO_API_URL ?? 'https://bravo.goberna.us'
const TENANT = process.env.BRAVO_TENANT ?? 'gavilano'
const TIMEOUT_MS = 15_000

const str = (v) => (typeof v === 'string' ? v : null)

function normalize(a) {
  return {
    slug: String(a.slug ?? ''),
    title: String(a.title ?? ''),
    excerpt: str(a.excerpt),
    body_html: str(a.body_html),
    cover_image_url: str(a.cover_image_url),
    category: str(a.category),
    seo_title: str(a.seo_title),
    seo_description: str(a.seo_description),
    og_image_url: str(a.og_image_url),
    canonical_url: str(a.canonical_url),
    noindex: Boolean(a.noindex),
    published_at: String(a.published_at ?? ''),
  }
}

function render(list) {
  const body = list.length
    ? JSON.stringify(list, null, 2)
    : '[]'
  return `// src/data/bravo-articles.generated.ts
// GENERADO EN BUILD por scripts/fetch-articles.mjs — NO editar a mano.
import type { BravoPublicArticle } from './bravoTypes'

export const bravoArticlesRaw: BravoPublicArticle[] = ${body}
`
}

async function main() {
  const url = `${API_URL}/v1/public/articles?tenant=${encodeURIComponent(TENANT)}&status=published`
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { accept: 'application/json' } })
    if (!res.ok) {
      console.warn(`[fetch-articles] ${res.status} de ${url} → fallback local`)
      await writeFile(OUT, render([]))
      return
    }
    const data = await res.json()
    if (!Array.isArray(data)) {
      console.warn('[fetch-articles] respuesta no es array → fallback local')
      await writeFile(OUT, render([]))
      return
    }
    const list = data.filter((a) => a && a.slug && a.title).map(normalize)
    await writeFile(OUT, render(list))
    console.log(`[fetch-articles] ${list.length} artículo(s) de Bravo horneados.`)
  } catch (err) {
    console.warn(`[fetch-articles] error (${err?.name ?? 'unknown'}) → fallback local`)
    await writeFile(OUT, render([]))
  } finally {
    clearTimeout(timer)
  }
}

await main()
