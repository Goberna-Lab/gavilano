
import Breadcrumb from './Breadcrumb'
import '../pages/ExperienciaPage.css'
import { Renglones } from '../lib/texto'
import type { ContenidoExperienciaLineaDeTiempo, PropsSeccion } from '../lib/contenido'

/* Tres cosas del DISEÑO, indexadas por la misma posición que `content.hitos`:

   - el LADO en que cae la foto alterna sola desde el índice, así que no hace falta
     escribirlo;
   - el RECUADRO del rótulo lo llevan tres de los nueve, sin ningún patrón
     semántico detrás;
   - los AÑOS del último van en cuerpo más chico (64px → 58px) para que entren.

   Son decoración: no cambian el mensaje del sitio. Por eso los hitos son una
   `fixed-list` en el catálogo y no una `list` — con `list`, estas dos marcas
   tendrían que viajar como texto libre (en v1 no hay tipo `select`) y se romperían
   con un typo sin avisar. El precio es que sumar un décimo cargo pide tocar código:
   una entrada más en `catalogo.ts`, una más en el seed, y revisar estos dos arrays. */
const RECUADRO = new Set([3, 4, 7])
const COMPACTO = new Set([8])

const SALTO = 'experiencia-desktop-break'

function ExperienciaLineaDeTiempo({
  content,
  anchor,
}: PropsSeccion<ContenidoExperienciaLineaDeTiempo>) {
  return (
    <>
      <section className="experiencia-page-hero" aria-label="Experiencia" id={anchor}>
        <div className="experiencia-page-hero-container" />

        <div className="experiencia-timeline" aria-label="Línea de tiempo">
          <article className="experiencia-timeline-item experiencia-timeline-item--intro">
            <p className="experiencia-timeline-intro">
              <Renglones texto={content.introTexto} claseSalto={SALTO} espacioAntesDelSalto />
              <span className="experiencia-timeline-intro-highlight">
                <Renglones texto={content.introDestacado} claseSalto={SALTO} />
              </span>
            </p>
            <img
              className="experiencia-timeline-image experiencia-timeline-image--large"
              src={content.introImagen}
              alt={content.introImagenAlt}
              loading="lazy"
            />
          </article>

          <div className="experiencia-timeline-intro-divider" aria-hidden="true" />

          {content.hitos.map((hito, i) => (
            <article
              key={i}
              className={`experiencia-timeline-item experiencia-timeline-item--image-${i % 2 === 0 ? 'right' : 'left'}`}
            >
              <div className="experiencia-timeline-copy">
                <p className={`experiencia-timeline-year${COMPACTO.has(i) ? ' experiencia-timeline-year--compact' : ''}`}>
                  {hito.anio}
                </p>
                <p className={`experiencia-timeline-period${RECUADRO.has(i) ? ' experiencia-timeline-period--boxed' : ''}`}>
                  {hito.rotulo}
                </p>
                <p className="experiencia-timeline-role">{hito.cargo}</p>
                {hito.detalle ? (
                  <p className="experiencia-timeline-description">{hito.detalle}</p>
                ) : null}
              </div>
              <img
                className="experiencia-timeline-image experiencia-timeline-image--component"
                src={hito.imagen}
                alt={hito.imagenAlt}
                loading="lazy"
              />
            </article>
          ))}
        </div>

        <section className="experiencia-summary" aria-label="Resumen de experiencia">
          <h2 className="experiencia-summary-title">{content.resumenTitulo}</h2>
          <p className="experiencia-summary-text">{content.resumenTexto}</p>
        </section>
      </section>

      {/* La miga de pan es navegación del tema, no contenido: dice dónde está
          parado el visitante. Vive acá y no en el renderizador genérico porque es
          la única página que la tiene. */}
      <div className="breadcrumb-mobile-only">
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Experiencia' }]} />
      </div>
    </>
  )
}

export default ExperienciaLineaDeTiempo
