import './PropuestasPage.css'
import { asset } from '../utils/asset'

const proposalItems = [
  { label: 'EDUCACIÓN Y DESARROLLO', icon: asset('educacion.png'), active: true },
  { label: 'JUVENTUD Y OPORTUNIDADES', icon: asset('juventud.png') },
  { label: 'SEGURIDAD CIUDADANA', icon: asset('seguridad.png') },
  { label: 'DESARROLLO SOCIAL', icon: asset('desarrollo.png') },
  { label: 'MODERNIZACIÓN TECNOLÓGICA', icon: asset('tecnologia.png') },
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
          EDUCACIÓN Y DESARROLLO
        </h1>
        <p className="propuestas-detail-lead">
          <strong>Estoy convencido de que la educación es la herramienta más poderosa</strong> para transformar nuestro distrito. Impulsaré el acceso formativo integral para que ningún niño ni joven carmelino se quede sin la oportunidad de superarse.
        </p>
        <div className="propuestas-detail-divider" />
        <p className="propuestas-detail-body">
          <strong>Durante mis años de servicio, he aprendido que el verdadero cemento de un distrito no está solo en las pistas,</strong> sino en la mente y el corazón de sus niños y jóvenes. La educación no puede ser un privilegio en Carmen de la Legua Reynoso; tiene que ser el motor que rompa los círculos de la pobreza y abra puertas que antes parecían cerradas.
          <br /><br />
          <strong>Mi compromiso es total:</strong> implementaremos un sistema de apoyo integral que no solo fortalezca las escuelas del distrito, sino que dote a las familias de las herramientas necesarias para que ningún estudiante abandone las aulas por falta de recursos. Vamos a potenciar los espacios comunales, transformándolos en centros de estudio modernos y equipados.
          <br />
          Una comunidad que estudia es una comunidad que progresa y se defiende. Por eso, desde el primer día de gestión, nos enfocaremos en que cada rincón de nuestro distrito respire cultura, valores y superación académica para asegurar el futuro de nuestras familias.
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
