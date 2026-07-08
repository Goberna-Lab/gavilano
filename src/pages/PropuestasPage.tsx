import './PropuestasPage.css'
import { asset } from '../utils/asset'

const proposalItems = [
  { label: 'EDUCACIÓN Y DESARROLLO', icon: asset('educacion.png') },
  { label: 'JUVENTUD Y OPORTUNIDADES', icon: asset('juventud.png') },
  { label: 'SEGURIDAD CIUDADANA', icon: asset('seguridad.png') },
  { label: 'DESARROLLO SOCIAL', icon: asset('desarrollo.png') },
  { label: 'MODERNIZACIÓN TECNOLÓGICA', icon: asset('tecnologia.png'), active: true },
]

function PropuestasPage() {
  return (
    <section className="propuestas-detail" aria-labelledby="propuestas-detail-title">
      <nav className="propuestas-detail-nav" aria-label="Categorías de propuestas">
        {proposalItems.map((item) => (
          <button
            className={`propuestas-detail-nav-item${item.active ? ' propuestas-detail-nav-item--active' : ''}`}
            type="button"
            key={item.label}
          >
            <img src={item.icon} alt="" className="propuestas-detail-nav-icon" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <article className="propuestas-detail-copy">
        <h1 className="propuestas-detail-title" id="propuestas-detail-title">
          MODERNIZACIÓN TECNOLÓGICA
        </h1>
        <p className="propuestas-detail-lead">
          <strong>Llevaremos la municipalidad hacia el futuro.</strong> Implementaremos conectividad e internet inalámbrico gratuito en espacios públicos, poniendo la tecnología y la digitalización de trámites al servicio real de cada vecino.
        </p>
        <div className="propuestas-detail-divider" />
        <p className="propuestas-detail-body">
          <strong>El futuro ya llegó y Carmen de la Legua Reynoso</strong> no puede quedarse rezagada en el pasado. Se acabaron las colas interminables y los trámites lentos que solo le quitan tiempo valioso a los vecinos. Vamos a transformar la municipalidad en una institución ágil, transparente y tecnológica.
          <br /><br />
          <strong>Implementaremos una red de conectividad con internet inalámbrico gratuito</strong> en nuestras principales plazas, parques y espacios públicos. Esto permitirá que nuestros escolares y universitarios tengan un acceso libre para estudiar, y que los vecinos estén siempre comunicados.
          <br /><br />
          <strong>Digitalizaremos los servicios municipales a través de una aplicación y plataforma web amigable,</strong> donde podrás realizar trámites, reportar incidencias de seguridad o limpieza, y consultar tus pagos desde tu celular. La tecnología estará, por fin, al servicio real del ciudadano.
        </p>
      </article>

      <img
        className="propuestas-detail-image"
        src={asset('WhatsApp Image 2026-07-08 at 10.46.25.jpeg')}
        alt="Equipo de seguridad ciudadana de Carmen de la Legua Reynoso"
        loading="lazy"
      />
    </section>
  )
}

export default PropuestasPage
