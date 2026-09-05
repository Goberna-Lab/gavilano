import './PropuestasSection.css'
import { Renglones } from '../lib/texto'
import type { ContenidoPropuestasIntro, PropsSeccion } from '../lib/contenido'

function PropuestasSection({ content, anchor }: PropsSeccion<ContenidoPropuestasIntro>) {
  return (
    <section className="propuestas-section" id={anchor}>
      <p className="propuestas-text">{content.encabezado}</p>
      <div className="propuestas-subtitle-block">
        <p className="propuestas-subtitle-line">{content.subtituloLinea1}</p>
        <p className="propuestas-subtitle-line propuestas-subtitle-line-2">{content.subtituloLinea2}</p>
        <p className="propuestas-subtitle-line propuestas-subtitle-line-3">{content.subtituloLinea3}</p>
      </div>
      <p className="propuestas-subtitle-italic">{content.subtituloItalica}</p>
      <div className="propuestas-description-block">
        <p className="propuestas-description-text">
          <strong>{content.descripcionDestacado}</strong>
          {/* `espacioInicial`: el original tenía UN nodo de texto que arrancaba con
              el espacio de después del </strong>. Escribirlo como {' '}{texto}
              crearía dos nodos y movería el antialiasing del renglón (P7b). */}
          <Renglones texto={content.descripcionResto} espacioInicial />
        </p>
      </div>
    </section>
  )
}

export default PropuestasSection
