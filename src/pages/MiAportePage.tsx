import Breadcrumb from '../components/Breadcrumb'
import AporteSection from '../components/AporteSection'

function MiAportePage() {
  return (
    <>
      <div className="breadcrumb-mobile-only">
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Mi Aporte' }]} />
      </div>
      <AporteSection className="aporte-section-page" />
    </>
  )
}

export default MiAportePage
