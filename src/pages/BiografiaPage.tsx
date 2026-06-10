import Breadcrumb from '../components/Breadcrumb'
import About from '../components/About'
import ImageSection from '../components/ImageSection'

function BiografiaPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Biografía' }]} />
      <About />
      <ImageSection />
    </>
  )
}

export default BiografiaPage
