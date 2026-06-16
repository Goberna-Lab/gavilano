import Breadcrumb from '../components/Breadcrumb'
import SumateSection from '../components/SumateSection'
import './ExperienciaPage.css'

function ExperienciaPage() {
  return (
    <>
      <section className="experiencia-page-hero" aria-label="Experiencia">
        <div className="experiencia-page-hero-container" />

        <div className="experiencia-timeline" aria-label="Línea de tiempo">
          <article className="experiencia-timeline-item experiencia-timeline-item--intro">
            <p className="experiencia-timeline-intro">
Toda una vida recorriendo{' '}
<br className="experiencia-desktop-break" />
nuestras calles,{' '}
<br className="experiencia-desktop-break" />
trabajando codo a codo
              <span className="experiencia-timeline-intro-highlight">
                contigo por el bienestar
                <br className="experiencia-desktop-break" />
                de nuestra comunidad.
              </span>
            </p>
            <img
              className="experiencia-timeline-image experiencia-timeline-image--large"
              src="/images/19990--2002.png"
              alt="Juan Diego Gavilano sosteniendo un diploma"
              loading="lazy"
            />
          </article>

          <div className="experiencia-timeline-intro-divider" aria-hidden="true" />

          <article className="experiencia-timeline-item experiencia-timeline-item--image-right">
            <div className="experiencia-timeline-copy">
              <p className="experiencia-timeline-year">2022</p>
              <p className="experiencia-timeline-period">ACTUALIDAD</p>
              <p className="experiencia-timeline-role">Abogado.</p>
            </div>
            <img
              className="experiencia-timeline-image experiencia-timeline-image--component"
              src="/images/componente14-2.png"
              alt="Experiencia profesional como abogado"
              loading="lazy"
            />
          </article>

          <article className="experiencia-timeline-item experiencia-timeline-item--image-left">
            <div className="experiencia-timeline-copy">
              <p className="experiencia-timeline-year">2015 – 2017</p>
              <p className="experiencia-timeline-period">ASESORÍA</p>
              <p className="experiencia-timeline-role">Asesor jurídico</p>
              <p className="experiencia-timeline-description">En gestión pública e instituciones del Estado.</p>
            </div>
            <img
              className="experiencia-timeline-image experiencia-timeline-image--component"
              src="/images/2015--2017.png"
              alt="Reunión de trabajo en instituciones del Estado"
              loading="lazy"
            />
          </article>

          <article className="experiencia-timeline-item experiencia-timeline-item--image-right">
            <div className="experiencia-timeline-copy">
              <p className="experiencia-timeline-year">2011 – 2014</p>
              <p className="experiencia-timeline-period">CONSEJERO</p>
              <p className="experiencia-timeline-role">Consejero regional del Callao.</p>
            </div>
            <img
              className="experiencia-timeline-image experiencia-timeline-image--component"
              src="/images/2011--2014.png"
              alt="Consejero regional del Callao"
              loading="lazy"
            />
          </article>

          <article className="experiencia-timeline-item experiencia-timeline-item--image-left">
            <div className="experiencia-timeline-copy">
              <p className="experiencia-timeline-year">2007 – 2010</p>
              <p className="experiencia-timeline-period experiencia-timeline-period--boxed">GESTIÓN</p>
              <p className="experiencia-timeline-role">Alcalde distrital de Carmen de la Legua Reynoso.</p>
            </div>
            <img
              className="experiencia-timeline-image experiencia-timeline-image--component"
              src="/images/2007--2010.png"
              alt="Gestión como alcalde distrital de Carmen de la Legua Reynoso"
              loading="lazy"
            />
          </article>

          <article className="experiencia-timeline-item experiencia-timeline-item--image-right">
            <div className="experiencia-timeline-copy">
              <p className="experiencia-timeline-year">2003 – 2006</p>
              <p className="experiencia-timeline-period experiencia-timeline-period--boxed">FISCALIZACIÓN</p>
              <p className="experiencia-timeline-role">Regidor distrital de Carmen de la Legua Reynoso.</p>
            </div>
            <img
              className="experiencia-timeline-image experiencia-timeline-image--component"
              src="/images/2003--2006.png"
              alt="Fiscalización como regidor distrital de Carmen de la Legua Reynoso"
              loading="lazy"
            />
          </article>

          <article className="experiencia-timeline-item experiencia-timeline-item--image-left">
            <div className="experiencia-timeline-copy">
              <p className="experiencia-timeline-year">1999 – 2002</p>
              <p className="experiencia-timeline-period">ASESOR</p>
              <p className="experiencia-timeline-role">Experiencia como gestor público municipal - Los Olivos</p>
              <p className="experiencia-timeline-description">Asesor de alcaldía y jefe de Participación Vecinal.</p>
            </div>
            <img
              className="experiencia-timeline-image experiencia-timeline-image--component"
              src="/images/componente15--.png"
              alt="Experiencia como gestor público municipal en Los Olivos"
              loading="lazy"
            />
          </article>

          <article className="experiencia-timeline-item experiencia-timeline-item--image-right">
            <div className="experiencia-timeline-copy">
              <p className="experiencia-timeline-year">1996 – 1998</p>
              <p className="experiencia-timeline-period">LIDERAZGO</p>
              <p className="experiencia-timeline-role">Alcalde distrital de Carmen de la Legua Reynoso.</p>
            </div>
            <img
              className="experiencia-timeline-image experiencia-timeline-image--component"
              src="/images/1996--1998.png"
              alt="Liderazgo como alcalde distrital de Carmen de la Legua Reynoso"
              loading="lazy"
            />
          </article>

          <article className="experiencia-timeline-item experiencia-timeline-item--image-left">
            <div className="experiencia-timeline-copy">
              <p className="experiencia-timeline-year">1994 – 1995</p>
              <p className="experiencia-timeline-period experiencia-timeline-period--boxed">ALCALDÍA</p>
              <p className="experiencia-timeline-role">Alcalde distrital de Carmen de la Legua Reynoso.</p>
              <p className="experiencia-timeline-description">Asesor de alcaldía y jefe de Participación Vecinal.</p>
            </div>
            <img
              className="experiencia-timeline-image experiencia-timeline-image--component"
              src="/images/1994--1995.png"
              alt="Alcaldía distrital de Carmen de la Legua Reynoso"
              loading="lazy"
            />
          </article>

          <article className="experiencia-timeline-item experiencia-timeline-item--image-right">
            <div className="experiencia-timeline-copy">
              <p className="experiencia-timeline-year experiencia-timeline-year--compact">1993 – 1994</p>
              <p className="experiencia-timeline-period">INICIO</p>
              <p className="experiencia-timeline-role">Teniente alcalde de Carmen de la Legua Reynoso.</p>
              <p className="experiencia-timeline-description">Asesor de alcaldía y jefe de Participación Vecinal.</p>
            </div>
            <img
              className="experiencia-timeline-image experiencia-timeline-image--component"
              src="/images/1993--1994.png"
              alt="Inicio como teniente alcalde de Carmen de la Legua Reynoso"
              loading="lazy"
            />
          </article>
        </div>

        <section className="experiencia-summary" aria-label="Resumen de experiencia">
          <h2 className="experiencia-summary-title">Más de dos décadas de experiencia en gestión municipal,</h2>
          <p className="experiencia-summary-text">
            Representación regional, asesoría pública y ejercicio profesional como abogado. Una trayectoria construida desde el
            trabajo local, la administración pública y el contacto directo con los vecinos.
          </p>
        </section>
      </section>

      <div className="breadcrumb-mobile-only">
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Experiencia' }]} />
      </div>
      <SumateSection />
    </>
  )
}

export default ExperienciaPage
