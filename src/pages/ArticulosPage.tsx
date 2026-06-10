import Breadcrumb from '../components/Breadcrumb'
import ArticulosSection from '../components/ArticulosSection'

function ArticulosPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Artículos' }]} />
      <ArticulosSection />
    </>
  )
}

export default ArticulosPage
