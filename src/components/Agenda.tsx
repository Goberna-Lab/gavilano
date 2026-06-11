import './Agenda.css'

function Agenda() {
  return (
    <section className="agenda" id="experiencia">
      <div className="agenda-content">
        <h2 className="agenda-heading">UNA VIDA DE SERVICIO</h2>
        <p className="agenda-subtitle">NO VENGO A</p>
        <p className="agenda-subtitle-italic">IMPROVISAR.</p>
      </div>
      <div className="agenda-bar" />
      <p className="agenda-quote agenda-quote-desktop">Gobernar no es solo prometer. Gobernar es escuchar, tomar decisiones y cumplir.</p>
      <p className="agenda-quote agenda-quote-mobile">
        <span>Gobernar no es solo prometer. Gobernar es</span>
        <span>escuchar, tomar decisiones y cumplir.</span>
      </p>
      <div className="agenda-right-text-block">
        <p className="agenda-right-title">Conozco la gestión municipal desde adentro.</p>
        <p className="agenda-right-text">Mi trayectoria como Alcalde en Carmen de la Legua Reynoso, asesor en municipalidades y diferentes entidades del Estado me permite saber cómo funciona la administración pública y desde dónde empezar a ordenar nuestro distrito desde el primer día.</p>
      </div>
      <div className="agenda-stats-container">
        <div className="agenda-stats-col">
          <span className="agenda-stat-number">22</span>
          <span className="agenda-stat-label">AÑOS DE SERVICIO PÚBLICO</span>
        </div>
        <div className="agenda-stats-divider" />
        <div className="agenda-stats-col">
          <div className="agenda-stat-number-row">
            <span className="agenda-stat-plus">+</span>
            <span className="agenda-stat-number">30</span>
          </div>
          <span className="agenda-stat-label">OBRAS DE IMPACTO</span>
        </div>
        <div className="agenda-stats-divider" />
        <div className="agenda-stats-col">
          <span className="agenda-stat-number">03</span>
          <span className="agenda-stat-label">GESTIONES EXITOSAS</span>
        </div>
      </div>
    </section>
  )
}

export default Agenda
