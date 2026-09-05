import { Link } from 'react-router-dom'
import './ImageSection.css'
import { asset } from '../utils/asset'
import { Renglones } from '../lib/texto'
import type { ContenidoExperienciaDestacada, PropsSeccion } from '../lib/contenido'

function ImageSection({ content, anchor }: PropsSeccion<ContenidoExperienciaDestacada>) {
  return (
    <section className="image-section" aria-labelledby="image-section-title" id={anchor}>
      <div className="image-section-bg" aria-hidden="true" />
      <picture className="image-section-picture">
        <source media="(max-width: 1024px)" srcSet={content.imagenMovil} />
        <img
          src={content.imagenEscritorio}
          alt={content.imagenAlt}
          className="image-section-portrait"
          loading="lazy"
        />
      </picture>

      <div className="image-section-copy">
        <p className="image-section-kicker">{content.rotulo}</p>
        <h2 className="image-section-title" id="image-section-title">
          <span className="image-section-title-primary">{content.tituloPrimario}</span>
          <span className="image-section-title-secondary">
            <Renglones texto={content.tituloSecundario} />
          </span>
          <span className="image-section-title-subtitle">{content.tituloSubtitulo}</span>
        </h2>
        <Link className="image-section-button" to={content.botonDestino}>
          <span className="image-section-button-text">{content.botonEtiqueta}</span>
          <img src={asset('Trazado88.png')} alt="" className="image-section-button-icon" />
        </Link>
      </div>
    </section>
  )
}

export default ImageSection
