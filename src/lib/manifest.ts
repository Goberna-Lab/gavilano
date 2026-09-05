/* Contrato con Bravo — copiado A MANO de `docs/SPEC-secciones-disenadas-v1.md`
 * del repo `bravo` (Contratos 1, 2 y 4).
 *
 * NO se importa del SDK `@goberna-lab/bravo` a proposito, por la misma razon por
 * la que no se importa en `lib/bravo.ts`: ese paquete vive en GitHub Packages y
 * obligaria a un GITHUB_TOKEN en el `npm ci` de `ci.yml`, que corre en
 * ubuntu-latest sin credenciales para ese scope. El contrato es el JSON, no el
 * paquete. Misma decision que `giampietri`, `barrionuevo`, `feijoo` y `metavida`.
 *
 * El costo: si la spec cambia, este archivo se actualiza a mano. Esa friccion es
 * deliberada — el manifest v2 es el contrato mas rigido de Bravo (ADR 0003) y no
 * deberia moverse solo.
 */

/* ── Manifest (lo sirve el sitio en /site-manifest.json) ─────────────────── */

/* Los ocho que existen en v1. NO se agregan tipos: `select` (enums) y `color`
   son deuda conocida de la spec y se absorben con `text` + `help` + un fallback
   seguro en el componente. */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'url'
  | 'number'
  | 'image'
  | 'list'
  | 'fixed-list'

export interface ManifestField {
  key: string
  type: FieldType
  label: string
  help?: string
  placeholder?: string
  example?: string
  max?: number
  min?: number
  required?: boolean
  paragraphs?: boolean
  /** Sub-campos de un `list` o `fixed-list`. Anida a cualquier profundidad. */
  fields?: ManifestField[]
  /** Las entradas fijas de un `fixed-list`: cuantas son y como se llaman. */
  entries?: { label: string; preview?: Record<string, string> }[]
  preview?: string
  addLabel?: string
  itemLabel?: string
}

/** Seccion fija (modelo v1: singletons del sitio). Este tema no usa ninguna. */
export interface ManifestSection {
  key: string
  title: string
  description?: string
  icon?: string
  fields: ManifestField[]
}

/** Un tipo de seccion del catalogo: se puede instanciar dentro de una pagina. */
export interface SectionType {
  key: string
  title: string
  description?: string
  /** Del allow-list del panel (`SectionIcon.tsx`). Uno que no este cae en un
      icono generico: no rompe nada, pero el arbol queda mudo. */
  icon?: string
  /** true = como mucho una instancia por pagina. */
  unique?: boolean
  fields: ManifestField[]
}

export interface SiteManifestV2 {
  version: 2
  sections?: ManifestSection[]
  sectionTypes: SectionType[]
  menus: { key: string; label: string }[]
  fixedRoutes?: { path: string; label: string }[]
  /**
   * Ruta del tema que dibuja una pagina recibida por `postMessage`
   * (Contrato 6). Sin esto el panel no muestra vista previa — y declararla
   * antes de que la ruta exista es prometer algo que no esta: se agrega recien
   * en la fase de la vista previa.
   */
  preview?: { path: string }
}

/* ── Datos (lo que devuelve la API publica y lo que trae el seed) ─────────── */

/** El contenido de una seccion: la forma la fija `fields` de su tipo. */
export type SectionValues = Record<string, unknown>

export interface SectionInstance {
  id: string
  type: string
  /** id del <section> en el HTML; destino de los items de menu tipo 'anchor'. */
  anchor?: string
  content: SectionValues
  /* `hidden` NO esta y no tiene que estar: una seccion oculta se filtra en
     `/v1/public/pages` (en Node) y en el mensaje de vista previa, asi que NINGUN
     tema la ve nunca. Implementarla aca seria una tercera copia de un filtro que
     ya corre dos veces. */
}

export interface Page {
  id: string
  /** '' = Portada. Sin barras. Unico por tenant. */
  slug: string
  title: string
  sort: number
  sections: SectionInstance[]
  seo_title: string | null
  seo_description: string | null
  og_image_url: string | null
  noindex: boolean
  published_at: string | null
}

export type MenuTarget =
  | { kind: 'page'; slug: string }
  | { kind: 'article'; slug: string }
  | { kind: 'route'; path: string }
  | { kind: 'anchor'; slug: string; anchor: string }
  | { kind: 'url'; href: string }

export interface MenuItem {
  id: string
  label: string
  target: MenuTarget
  newTab?: boolean
  /** Un solo nivel de anidamiento. */
  children?: MenuItem[]
}

/**
 * Lo que sirve `GET /v1/public/menus`: el mismo item con el `href` YA resuelto.
 *
 * Ojo con la forma del `href`: los items `article` traen URL ABSOLUTA (sale de
 * `article_url_pattern`, que es absoluto siempre que el tenant tenga fila en
 * `portal.tenant_sites`) y el resto viene relativa. O sea que un mismo menu
 * mezcla las dos formas. El tema lo usa TAL CUAL: no prefija, no normaliza y no
 * deduce "externo" de la forma del href — para eso esta `newTab`.
 */
export interface PublicMenuItem extends MenuItem {
  href: string
  children?: PublicMenuItem[]
}

/** `content/seed.json` (Contrato 4): misma forma que la API publica, sin `href`. */
export interface SeedFile {
  pages: Page[]
  menus: Record<string, MenuItem[]>
}
