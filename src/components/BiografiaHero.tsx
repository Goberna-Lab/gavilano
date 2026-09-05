/* La hoja de estilos se queda en `pages/` y se importa desde acá: moverla junto al
   componente cambiaría el orden en que entra al bundle, y con él el orden de la
   cascada. Esta fase no mueve un píxel. */
import '../pages/BiografiaPage.css'
import type { ContenidoBiografiaHero, PropsSeccion } from '../lib/contenido'

function BiografiaHero({ content, anchor }: PropsSeccion<ContenidoBiografiaHero>) {
  return (
    <section className="biografia-page-hero" aria-label="Biografía" id={anchor}>
      <div className="biografia-page-hero-container">
        <img className="biografia-page-hero-image" src={content.imagen} alt="" />
        <div className="biografia-page-hero-copy">
          <p className="biografia-page-hero-title">{content.titulo}</p>
          <p className="biografia-page-hero-subtitle">
            <span>{content.subtituloLinea1}</span>
            <span>{content.subtituloLinea2}</span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default BiografiaHero
