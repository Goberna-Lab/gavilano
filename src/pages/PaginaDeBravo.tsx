import { Navigate, useParams } from 'react-router-dom'
import { SectionRenderer } from '../components/SectionRenderer'
import { paginaPorSlug } from '../lib/paginas'

/* Una página editable, dibujada desde sus secciones.
 *
 * El slug sale de la URL (`''` es la portada). Si no hay página con ese slug, el
 * sitio manda al inicio — que es exactamente lo que hacía la ruta `*` antes de esta
 * fase, así que una dirección inventada se comporta igual que siempre.
 *
 * Esto es lo que hace que el cliente pueda CREAR una página nueva desde el panel y
 * que exista en el sitio sin que nadie toque el código: la ruta es paramétrica.
 */
function PaginaDeBravo({ slug: slugFijo }: { slug?: string }) {
  const params = useParams()
  const slug = slugFijo ?? params.slug ?? ''
  const pagina = paginaPorSlug(slug)

  if (!pagina) return <Navigate to="/" replace />

  return <SectionRenderer sections={pagina.sections} />
}

export default PaginaDeBravo
