/* El módulo virtual que el plugin `bravo-contenido` de `vite.config.ts` resuelve en
   el build: las páginas y los menús que Bravo tenía EN ESE MOMENTO, o `null` si el
   tenant todavía no tiene nada publicado. Ver `lib/paginas.ts`. */
declare module 'virtual:bravo/contenido' {
  import type { Page, PublicMenuItem } from './manifest.ts'

  const contenido: { pages: Page[]; menus: Record<string, PublicMenuItem[]> } | null
  export default contenido
}
