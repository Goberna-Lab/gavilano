import Breadcrumb from '../components/Breadcrumb'
import HistoriasSection from '../components/HistoriasSection'

function ExperienciaPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Experiencia' }]} />
      <HistoriasSection />
    </>
  )
}

export default ExperienciaPage
