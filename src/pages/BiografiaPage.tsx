import Breadcrumb from '../components/Breadcrumb'
import About from '../components/About'
import ImageSection from '../components/ImageSection'
import './BiografiaPage.css'

function BiografiaPage() {
  return (
    <>
      <section className="biografia-page-hero" aria-label="Biografía">
        <div className="biografia-page-hero-container">
          <img className="biografia-page-hero-image" src="/images/grupo325.png" alt="" />
        </div>
      </section>

      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Biografía' }]} />
      <About />
      <ImageSection />
    </>
  )
}

export default BiografiaPage
