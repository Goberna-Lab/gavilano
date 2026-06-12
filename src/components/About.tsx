import { Link } from 'react-router-dom'
import './About.css'
import { asset } from '../utils/asset'

const iconSizes = [
  { width: 41, height: 30 },
  { width: 29, height: 30 },
  { width: 34, height: 30 },
  { width: 39, height: 30 },
]

const stats = [
  { title: 'Más obras', desc: 'para mejorar<br />nuestra ciudad', icon: asset('Trazado 14386.png') },
  { title: 'Más seguridad', desc: 'para vivir con tranquilidad', icon: asset('Trazado 14387.png') },
  { title: 'Más oportunidades', desc: 'para nuestros jovenes<br /> y familias', icon: asset('Trazado 14388.png') },
  { title: 'Más salud', desc: 'para una vida<br />digna', icon: asset('Trazado 14389.png') },
]

function About() {
  return (
    <section className="about" id="biografia">
      <div className="about-content">
        <h2 className="about-heading">CONÓCEME</h2>
        <p className="about-name-first">JUAN DE DIOS</p>
        <p className="about-name-last">GAVILANO</p>
        <p className="about-desc-line1">Vecino chalaco, abogado y servidor público.</p>
        <p className="about-desc-line2">He dedicado mi vida a trabajar por Carmen de la Legua Reynoso y el Perú.</p>
        <div className="about-stats">
          {stats.map((stat, i) => (
            <img key={`icon-${i}`} src={stat.icon} alt="" className="about-stat-icon" style={{ gridRow: 1, gridColumn: i * 2 + 1, width: iconSizes[i].width, height: iconSizes[i].height }} />
          ))}
          {stats.slice(0, -1).map((_, i) => (
            <div key={`div-${i}`} className="about-stat-divider" style={{ gridRow: '1 / -1', gridColumn: i * 2 + 2 }} />
          ))}
          {stats.map((stat, i) => (
            <p key={`title-${i}`} className="about-stat-title" style={{ gridRow: 2, gridColumn: i * 2 + 1 }}>{stat.title}</p>
          ))}
          {stats.map((stat, i) => (
            <div key={`descwrap-${i}`} className="about-stat-desc-wrap" style={{ gridRow: 3, gridColumn: i * 2 + 1 }}>
              <p className="about-stat-desc" dangerouslySetInnerHTML={{ __html: stat.desc }} />
            </div>
          ))}
        </div>
        <div className="about-stats-mobile" aria-label="Resumen de experiencia">
          {stats.map((stat, i) => (
            <div key={`mobile-stat-${stat.title}`} className="about-stat-mobile-card">
              <img src={stat.icon} alt="" className="about-stat-mobile-icon" style={{ width: iconSizes[i].width, height: iconSizes[i].height }} />
              <p className="about-stat-mobile-title">{stat.title}</p>
              <p className="about-stat-mobile-desc" dangerouslySetInnerHTML={{ __html: stat.desc }} />
            </div>
          ))}
        </div>
        <Link className="about-button" to="/biografia">
          <span className="about-button-text">CONOCE MI HISTORIA</span>
          <img src={asset('Trazado88.png')} alt="" className="about-button-icon" />
        </Link>
      </div>
      <img src={asset('IMG_0040.png')} alt="" className="about-image" />
    </section>
  )
}

export default About
