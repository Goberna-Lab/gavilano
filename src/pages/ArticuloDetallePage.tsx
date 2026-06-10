import { useParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'

function ArticuloDetallePage() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Artículos', to: '/articulos' },
          { label: slug ?? '' },
        ]}
      />
      <section style={{ padding: '48px', minHeight: '400px' }}>
        <h1>{slug}</h1>
        <p>Contenido del artículo (pendiente de diseño).</p>
      </section>
    </>
  )
}

export default ArticuloDetallePage
