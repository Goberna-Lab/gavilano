import { Fragment } from 'react'
import '../pages/BiografiaPage.css'
import type { ContenidoBiografiaResultados, PropsSeccion } from '../lib/contenido'

/* La última tarjeta es su propio tipo porque su párrafo lleva TRES frases en
   negrita repartidas, no una sola al principio como las otras tres. */
function BiografiaResultados({ content, anchor }: PropsSeccion<ContenidoBiografiaResultados>) {
  const { tramos } = content

  return (
    <section className="biografia-results-card" aria-labelledby="biografia-results-title" id={anchor}>
      <div className="biografia-results-copy">
        <img className="biografia-results-icon" src={content.icono} alt="" />
        <h2 className="biografia-results-title" id="biografia-results-title">
          <span>{content.tituloLinea1}</span>
          <span>{content.tituloLinea2}</span>
        </h2>
        <p className="biografia-results-text">
          {tramos.map((tramo, i) => (
            <Fragment key={i}>
              <strong>{tramo.destacado}</strong>
              {/* Los tramos del medio cierran con un espacio porque el siguiente
                  abre con un <strong>; el último no lo lleva. Espacios y texto en
                  el MISMO nodo, como en el original (P7b). */}
              {i < tramos.length - 1 ? ` ${tramo.texto} ` : ` ${tramo.texto}`}
            </Fragment>
          ))}
        </p>
      </div>
      <img className="biografia-results-image" src={content.imagen} alt={content.imagenAlt} loading="lazy" />
    </section>
  )
}

export default BiografiaResultados
