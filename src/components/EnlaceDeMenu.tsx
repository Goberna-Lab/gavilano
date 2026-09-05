import { Link } from 'react-router-dom'
import { esExterno } from '../lib/menu'
import type { PublicMenuItem } from '../lib/manifest'

/* Un ítem de menú, con el `href` que le llegó y SIN tocarlo.
 *
 * `/v1/public/menus` mezcla dos formas en la misma lista: los ítems de artículo
 * traen URL absoluta (sale del `article_url_pattern` del tenant) y el resto viene
 * relativa. Prefijar o «arreglar» una rompe la otra (P11). Lo único que el tema
 * decide es con qué elemento navegarla: el enrutador de React sólo sabe moverse por
 * las relativas, así que una absoluta sale como `<a>` y recarga la página.
 */
export function EnlaceDeMenu({
  item,
  className,
  onClick,
}: {
  item: PublicMenuItem
  className?: string
  onClick?: () => void
}) {
  const extra = item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  if (esExterno(item.href)) {
    return (
      <a href={item.href} className={className} onClick={onClick} {...extra}>
        {item.label}
      </a>
    )
  }

  return (
    <Link to={item.href} className={className} onClick={onClick} {...extra}>
      {item.label}
    </Link>
  )
}
