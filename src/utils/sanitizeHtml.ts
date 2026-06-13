// src/utils/sanitizeHtml.ts
// Saneador mínimo y sin dependencias para el HTML de artículos que viene de Bravo.
// El contenido es de primera parte (lo escribe el cliente en su propio CMS), pero
// igual quitamos vectores de XSS antes de meterlo en dangerouslySetInnerHTML:
//   - <script> y <style> completos
//   - atributos on*= (onclick, onload, ...)
//   - URLs javascript:/data: en href/src
// No es un sanitizer completo tipo DOMPurify; es defensa en profundidad barata.
export function sanitizeHtml(html: string): string {
  if (!html) return ''
  return html
    .replace(/<\s*(script|style)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    // [\s/] cubre el separador `/` de atributos (ej. <svg/onload=...>), no solo whitespace.
    .replace(/[\s/]on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/[\s/]on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/[\s/]on\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/(href|src|srcset|xlink:href)\s*=\s*"(?:javascript|data):[^"]*"/gi, '$1="#"')
    .replace(/(href|src|srcset|xlink:href)\s*=\s*'(?:javascript|data):[^']*'/gi, "$1='#'")
}
