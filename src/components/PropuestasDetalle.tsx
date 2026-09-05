import { Fragment } from 'react'
import '../pages/PropuestasPage.css'
import { asset } from '../utils/asset'
import type { ContenidoPropuestasDetalle, PropsSeccion } from '../lib/contenido'

/* El icono de cada categoría es del diseño y va por posición. La primera es la
   que se dibuja activa: hoy los botones no navegan (el sitio tiene una sola
   propuesta escrita), así que «activa» es maquetación, no estado. */
const ICONOS = [
  asset('educacion.png'),
  asset('juventud.png'),
  asset('seguridad.png'),
  asset('desarrollo.png'),
  asset('tecnologia.png'),
]

function PropuestasDetalle({ content, anchor }: PropsSeccion<ContenidoPropuestasDetalle>) {
  const { parrafos } = content

  return (
    <section className="propuestas-detail" aria-labelledby="propuestas-detail-title" id={anchor}>
      <nav className="propuestas-detail-nav" aria-label="Categorías de propuestas">
        {content.categorias.map((categoria, i) => (
          <button
            className={`propuestas-detail-nav-item${i === 0 ? ' propuestas-detail-nav-item--active' : ''}`}
            type="button"
            key={categoria.etiqueta}
          >
            <img src={ICONOS[i]} alt="" className="propuestas-detail-nav-icon" />
            <span>{categoria.etiqueta}</span>
          </button>
        ))}
      </nav>

      <article className="propuestas-detail-copy">
        <h1 className="propuestas-detail-title" id="propuestas-detail-title">
          {content.titulo}
        </h1>
        <p className="propuestas-detail-lead">
          <strong>{content.entradaDestacado}</strong>
          {` ${content.entradaResto}`}
        </p>
        <div className="propuestas-detail-divider" />
        <p className="propuestas-detail-body">
          {parrafos.map((parrafo, i) => (
            <Fragment key={i}>
              {/* Los separadores son del diseño: párrafo aparte después del
                  primero, renglón nuevo después del segundo. */}
              {i === 1 ? (
                <>
                  <br />
                  <br />
                </>
              ) : null}
              {i === 2 ? <br /> : null}
              {parrafo.destacado ? <strong>{parrafo.destacado}</strong> : null}
              {parrafo.destacado ? ` ${parrafo.texto}` : parrafo.texto}
            </Fragment>
          ))}
        </p>
      </article>

      <img
        className="propuestas-detail-image"
        src={content.imagen}
        alt={content.imagenAlt}
        loading="lazy"
      />
    </section>
  )
}

export default PropuestasDetalle
