import Breadcrumb from '../components/Breadcrumb'
import AporteSection from '../components/AporteSection'

function MiAportePage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Mi Aporte' }]} />
      <AporteSection />
    </>
  )
}

export default MiAportePage
