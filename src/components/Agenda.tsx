import { Fragment } from 'react'
import './Agenda.css'
import { Renglones } from '../lib/texto'
import type { ContenidoUnaVidaDeServicio, PropsSeccion } from '../lib/contenido'

/* El `+` delante de la cifra del medio es del diseño: va en su propio `<span>`
   dentro de una fila aparte, así que no puede viajar pegado al número. */
const LLEVA_MAS = [false, true, false]

function Agenda({ content, anchor }: PropsSeccion<ContenidoUnaVidaDeServicio>) {
  return (
    <section className="agenda" id={anchor}>
      <div className="agenda-content">
        <h2 className="agenda-heading">{content.encabezado}</h2>
        <p className="agenda-subtitle">{content.subtitulo}</p>
        <p className="agenda-subtitle-italic">{content.subtituloItalica}</p>
      </div>
      <div className="agenda-bar" />
      <p className="agenda-quote agenda-quote-desktop">{content.citaEscritorio}</p>
      <p className="agenda-quote agenda-quote-mobile">
        {content.citaMovil.split('\n').map((linea, i) => (
          <span key={i}>{linea}</span>
        ))}
      </p>
      <div className="agenda-right-text-block"> 
        <p className="agenda-right-title">{content.tituloDerecha}</p>
        <p className="agenda-right-text">{content.textoDerecha}</p>
      </div>
      <div className="agenda-stats-container">
        {content.cifras.map((cifra, i) => (
          <Fragment key={i}>
            {i > 0 && <div className="agenda-stats-divider" />}
            <div className="agenda-stats-col">
              {LLEVA_MAS[i] ? (
                <div className="agenda-stat-number-row">
                  <span className="agenda-stat-plus">+</span>
                  <span className="agenda-stat-number">{cifra.numero}</span>
                </div>
              ) : (
                <span className="agenda-stat-number">{cifra.numero}</span>
              )}
              <span className="agenda-stat-label"><Renglones texto={cifra.etiqueta} /></span>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  )
}

export default Agenda
