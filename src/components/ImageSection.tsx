import { Link } from 'react-router-dom'
import './ImageSection.css'
import { asset } from '../utils/asset'

function ImageSection() {
  return (
    <section className="image-section" aria-labelledby="image-section-title">
      <div className="image-section-bg" aria-hidden="true" />
      <picture className="image-section-picture">
        <source media="(max-width: 1024px)" srcSet={asset('IMG_0049.png')} />
        <img
          src={asset('gavilanoo.png')}
          alt="Gavilano"
          className="image-section-portrait"
          loading="lazy"
        />
      </picture>

      <div className="image-section-copy">
        <p className="image-section-kicker">Experiencia que construye</p>
        <h2 className="image-section-title" id="image-section-title">
          <span className="image-section-title-primary">Más de dos</span>
          <span className="image-section-title-secondary">
            décadas de<br />
            experiencia
          </span>
          <span className="image-section-title-subtitle">En gestión municipal</span>
        </h2>
        <Link className="image-section-button" to="/experiencia">
          <span className="image-section-button-text">EXPERIENCIA</span>
          <img src={asset('Trazado88.png')} alt="" className="image-section-button-icon" />
        </Link>
      </div>
    </section>
  )
}

export default ImageSection
