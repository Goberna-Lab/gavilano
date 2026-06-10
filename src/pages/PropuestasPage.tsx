import Breadcrumb from '../components/Breadcrumb'
import PropuestasSection from '../components/PropuestasSection'
import PropuestasDetalleSection from '../components/PropuestasDetalleSection'

function PropuestasPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Propuestas' }]} />
      <PropuestasSection />
      <PropuestasDetalleSection />
    </>
  )
}

export default PropuestasPage
