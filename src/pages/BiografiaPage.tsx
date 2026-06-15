import './BiografiaPage.css'
import SumateSection from '../components/SumateSection'

function BiografiaPage() {
  return (
    <>
      <section className="biografia-page-hero" aria-label="Biografía">
        <div className="biografia-page-hero-container">
          <img className="biografia-page-hero-image" src="/images/grupo325.png" alt="" />
          <div className="biografia-page-hero-copy">
            <p className="biografia-page-hero-title">UNA VIDA DEDICADA A</p>
            <p className="biografia-page-hero-subtitle">
              <span>CARMEN DE LA</span>
              <span>LEGUA REYNOSO</span>
            </p>
          </div>
        </div>
      </section>

      <section className="biografia-roots-card" aria-labelledby="biografia-roots-title">
        <div className="biografia-roots-copy">
          <img className="biografia-roots-icon" src="/images/Grupo 28338.png" alt="" />
          <h2 className="biografia-roots-title" id="biografia-roots-title">
            <span>MI VIDA Y RAÍCES EN</span>
            <span>CARMEN DE LA LEGUA</span>
          </h2>
          <p className="biografia-roots-text">
            <strong>Nací el 15 de enero de 1964.</strong><br/> Crecí como el penúltimo de once hermanos en un hogar donde el respeto y la humildad
            eran la base de todo. Un carmelino autóctono; los vecinos me ven caminar por el Jirón Mariano Melgar, mi casa de
            toda la vida, donde he pasado más de 50 años compartiendo sueños y desafíos con nuestra gente.
          </p>
        </div>
        <img className="biografia-roots-image" src="/images/Enmascarargrupo36.png" alt="Juan de Dios Gavilano" loading="lazy" />
      </section>

      <section className="biografia-formation-card" aria-labelledby="biografia-formation-title">
        <div className="biografia-formation-copy">
          <img className="biografia-formation-icon" src="/images/Grupo 28340.png" alt="" />
          <h2 className="biografia-formation-title" id="biografia-formation-title">
            <span>FORMACIÓN Y COMPROMISO</span>
            <span>CON LA JUVENTUD</span>
          </h2>
          <p className="biografia-formation-text">
            <strong>Mis primeros pasos los di en las aulas del Colegio 5030</strong> y, más tarde, en el histórico Colegio Nacional Mixto Raúl
            Porras Barrenechea. Desde muy joven, sentí que mi vocación estaba en el servicio comunitario. Por eso, en 1984,
            fundé el Club Deportivo y Cultural Bémfica para ofrecer a nuestros niños un camino sano a través del deporte. Esa
            misma pasión me llevó a ser cofundador de la Liga de Menores del distrito y de la Asociación Deportiva de la Unidad
            Vecinal N° 3, convencido de que el deporte es la mejor herramienta de transformación social.
          </p>
        </div>
        <img className="biografia-formation-image" src="/images/02.png" alt="Formación y compromiso con la juventud" loading="lazy" />
      </section>

      <section className="biografia-service-card" aria-labelledby="biografia-service-title">
        <div className="biografia-service-copy">
          <img className="biografia-service-icon" src="/images/Grupo 28342.png" alt="" />
          <h2 className="biografia-service-title" id="biografia-service-title">
            <span>TRAYECTORIA POLÍTICA Y</span>
            <span>VOCACIÓN DE SERVICIO</span>
          </h2>
          <p className="biografia-service-text">
            <strong>La confianza de mis vecinos me permitió el altísimo honor</strong> de ser elegido Alcalde de nuestro distrito en tres
            oportunidades. Además, he servido como Regidor y como Consejero Regional del Callao. Estudié Derecho en la
            Universidad Inca Garcilaso de la Vega, titulándome como abogado en 2014 para seguir defendiendo los intereses de mi
            pueblo, en apoyo a las herramientas legales.
          </p>
        </div>
        <img className="biografia-service-image" src="/images/03.png" alt="Trayectoria política y vocación de servicio" loading="lazy" />
      </section>

      <section className="biografia-results-card" aria-labelledby="biografia-results-title">
        <div className="biografia-results-copy">
          <img className="biografia-results-icon" src="/images/Grupo 28344.png" alt="" />
          <h2 className="biografia-results-title" id="biografia-results-title">
            <span>UNA VISIÓN DE RESULTADOS</span>
            <span>PARA EL FUTURO</span>
          </h2>
          <p className="biografia-results-text">
            <strong>A lo largo de estos años, he aprendido</strong> que la política sólo tiene valor cuando se traduce en bienestar para cada
            familia carmelina. Mi trayectoria no es solo una lista de cargos, sino una vida dedicada a escuchar y actuar por el
            distrito que me vio nacer. Hoy, mi <strong>COMPROMISO</strong> con ustedes sigue intacto, con la firme convicción de que el trabajo
            constante es la única vía para seguir entregando los <strong>RESULTADOS</strong> que nuestra comunidad merece.
          </p>
        </div>
        <img className="biografia-results-image" src="/images/04.png" alt="Una visión de resultados para el futuro" loading="lazy" />
      </section>

   
      <SumateSection />
    </>
  )
}

export default BiografiaPage
