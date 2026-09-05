import './ArticulosSection.css'
import { Link } from 'react-router-dom'
import { asset } from '../utils/asset'
import { displayArticles, coverSrc, formatDateUpper, readingMinutes } from '../data/articleSource'
import type { ContenidoArticulos, PropsSeccion } from '../lib/contenido'

const cardGap = 250
const cardBases = [520, 520 + cardGap, 520 + cardGap * 2]
const dividerStart = cardBases[0] - 20
const dividerGap = cardGap
const featuredArticles = displayArticles.slice(0, cardBases.length)

function ArticulosSection({ content, anchor }: PropsSeccion<ContenidoArticulos>) {
  return (
    <section className="articulos-section" id={anchor}>
      <p className="articulos-heading">{content.encabezado}</p>
      <div className="articulos-subtitle-block">
        <p className="articulos-subtitle-line">{content.subtituloLinea}</p>
        <p className="articulos-subtitle-italic">{content.subtituloItalica}</p>
      </div>

      <p className="articulos-intro">
        {content.intro.map((renglon, i) => (
          <span key={i}>
            {renglon.destacado ? <strong>{renglon.destacado}</strong> : null}
            {/* Con negrita delante, el espacio va DENTRO del mismo nodo de texto
                (P7b). Sin negrita, el renglón entero es el nodo. */}
            {renglon.resto ? (renglon.destacado ? ` ${renglon.resto}` : renglon.resto) : null}
          </span>
        ))}
      </p>

      <p className="articulos-view-all">
        <Link to={content.verTodosDestino} className="articulos-view-all-link">
          <span className="articulos-view-all-text">{content.verTodosEtiqueta}</span>
          <span className="articulos-view-all-arrow" aria-hidden="true" />
        </Link>
      </p>

      {featuredArticles.map((article, i) => {
        const base = cardBases[i]
        const dividerTop = dividerStart + i * dividerGap
        const nextDividerTop = dividerStart + (i + 1) * dividerGap
        const image = article.source === 'local' && i === 0 ? asset('capturita.png') : coverSrc(article)
        return (
          <div key={i} className={`articulos-card-wrapper ${i > 0 ? 'articulos-card-hidden-mobile' : ''}`}>
            {i === 0 ? <div className="articulos-divider" style={{ top: dividerTop }} /> : null}
            <div className="articulos-card-bg" style={{ top: base }} />
            <div className={`articulos-image ${i === 0 ? 'articulos-image-first' : ''}`} style={{ top: base, backgroundImage: `url(${image})` }} />
            <p className="articulos-analisis" style={{ top: base + 92 }}>ANÁLISIS</p>
            <div className="articulos-text-block" style={{ top: base }}>
              <p className={`articulos-title ${i === 0 ? 'articulos-title-first' : ''}`}>
                <strong className="articulos-title-bold-dark">{article.titleBold}</strong>
              </p>
              <p className="articulos-desc">
                {article.excerpt}
              </p>
            </div>
            <p className="articulos-date" style={{ top: base + (i >= 1 ? 14 : 0) }}>
              {article.publishedAt ? (
                formatDateUpper(article.publishedAt)
              ) : (
                <>
                  <span className="articulos-date-desktop">23 MAYO 2026</span>
                  <span className="articulos-date-mobile">30 MAYO 2026</span>
                </>
              )}
            </p>
            <p className="articulos-min" style={{ top: base + 45 + (i >= 1 ? 14 : 0) }}>{article.source === 'bravo' ? `${readingMinutes(article)} MIN` : '6 MIN'}</p>
            <Link to={`/articulos/${article.slug}`} className="articulos-nota" style={{ top: base + 150 + (i >= 1 ? 14 : 0) }} aria-label={`Leer nota completa: ${article.titleBold}`}>
              LEER NOTA COMPLETA
              <span className="articulos-nota-arrow" aria-hidden="true" />
            </Link>
            <div className="articulos-divider" style={{ top: nextDividerTop }} />
          </div>
        )
      })}
    </section>
  )
}

export default ArticulosSection
