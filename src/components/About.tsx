import { Link } from 'react-router-dom'
import './About.css'
import { asset } from '../utils/asset'
import { Renglones } from '../lib/texto'
import type { ContenidoConoceme, PropsSeccion } from '../lib/contenido'

/* El icono de cada pilar y su medida son del DISEÑO, no del contenido: no cambian
   el mensaje del sitio y el Figma los dibujó de ese tamaño. Viven acá, indexados
   por la misma posición que `content.pilares` — si el catálogo declarara cinco
   entradas y esta lista tuviera cuatro, el sitio se rompería en runtime con un
   `undefined` y no en el build. Por eso la cantidad está escrita en un test. */
const ICONOS = [
  asset('Trazado 14386.png'),
  asset('Trazado 14387.png'),
  asset('Trazado 14388.png'),
  asset('Trazado 14389.png'),
]

const MEDIDAS = [
  { width: 41, height: 30 },
  { width: 29, height: 30 },
  { width: 34, height: 30 },
  { width: 39, height: 30 },
]

function About({ content, anchor }: PropsSeccion<ContenidoConoceme>) {
  const { pilares } = content

  return (
    <section className="about" id={anchor}>
      <div className="about-content">
        <h2 className="about-heading">{content.encabezado}</h2>
        <p className="about-name-first">{content.nombreLinea1}</p>
        <p className="about-name-last">{content.nombreLinea2}</p>
        <p className="about-desc-line1">{content.descripcionLinea1}</p>
        <p className="about-desc-line2">
          <span>{content.descripcionLinea2a}</span>
          <span>{content.descripcionLinea2b}</span>
        </p>
        <div className="about-stats">
          {pilares.map((_, i) => (
            <img key={`icon-${i}`} src={ICONOS[i]} alt="" className="about-stat-icon" style={{ gridRow: 1, gridColumn: i * 2 + 1, width: MEDIDAS[i].width, height: MEDIDAS[i].height }} />
          ))}
          {pilares.slice(0, -1).map((_, i) => (
            <div key={`div-${i}`} className="about-stat-divider" style={{ gridRow: '1 / -1', gridColumn: i * 2 + 2 }} />
          ))}
          {pilares.map((pilar, i) => (
            <p key={`title-${i}`} className="about-stat-title" style={{ gridRow: 2, gridColumn: i * 2 + 1 }}>{pilar.titulo}</p>
          ))}
          {pilares.map((pilar, i) => (
            <div key={`descwrap-${i}`} className="about-stat-desc-wrap" style={{ gridRow: 3, gridColumn: i * 2 + 1 }}>
              <p className="about-stat-desc"><Renglones texto={pilar.descripcion} /></p>
            </div>
          ))}
        </div>
        <div className="about-stats-mobile" aria-label="Resumen de experiencia">
          {pilares.map((pilar, i) => (
            <div key={`mobile-stat-${pilar.titulo}`} className="about-stat-mobile-card">
              <img src={ICONOS[i]} alt="" className="about-stat-mobile-icon" style={{ width: MEDIDAS[i].width, height: MEDIDAS[i].height }} />
              <p className="about-stat-mobile-title">{pilar.titulo}</p>
              <p className="about-stat-mobile-desc"><Renglones texto={pilar.descripcion} /></p>
            </div>
          ))}
        </div>
        <Link className="about-button" to={content.botonDestino}>
          <span className="about-button-text">{content.botonEtiqueta}</span>
          <img src={asset('Trazado88.png')} alt="" className="about-button-icon" />
        </Link>
        <img src={content.imagenMovil} alt="" className="about-mobile-image" loading="lazy" />
      </div>
      <img src={content.imagenEscritorio} alt="" className="about-image" loading="lazy" />
    </section>
  )
}

export default About
