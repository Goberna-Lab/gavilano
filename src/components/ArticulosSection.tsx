import './ArticulosSection.css'
import { Link } from 'react-router-dom'
import { asset } from '../utils/asset'
import { displayArticles, coverSrc, formatDateUpper, readingMinutes } from '../data/articleSource'

const cardBases = [520, 790, 1060]
const dividerStart = cardBases[0] - 20
const dividerGap = 270
const descOffsets = [95, 98, 89]
const featuredArticles = displayArticles.slice(0, cardBases.length)

function ArticulosSection() {
  return (
    <section className="articulos-section" id="articulos">
      <p className="articulos-heading">MIS ARTÍCULOS</p>
      <div className="articulos-subtitle-block">
        <p className="articulos-subtitle-line">IDEAS PARA LEVANTAR</p>
        <p className="articulos-subtitle-italic">NUESTRO DISTRITO</p>
      </div>

      <p className="articulos-intro">
        <span><strong>Quiero una Carmen donde los vecinos</strong></span>
        <span><strong>vivan</strong> tranquilos, donde la municipalidad</span>
        <span>funcione y donde cada familia sienta que</span>
        <span>el distrito vuelve a avanzar.</span>
      </p>

      <p className="articulos-view-all">
        <Link to="/articulos" className="articulos-view-all-link">
          <span className="articulos-view-all-text">VER TODOS</span>
          <span className="articulos-view-all-arrow" aria-hidden="true" />
        </Link>
      </p>

      {featuredArticles.map((article, i) => {
        const base = cardBases[i]
        const dividerTop = dividerStart + i * dividerGap
        const nextDividerTop = dividerStart + (i + 1) * dividerGap
        const stackedTitle = article.titleBefore.trim().length > 0
        const image = article.source === 'local' && i === 0 ? asset('capturita.png') : coverSrc(article)
        return (
          <div key={i} className={`articulos-card-wrapper ${i > 0 ? 'articulos-card-hidden-mobile' : ''}`}>
            {i === 0 ? <div className="articulos-divider" style={{ top: dividerTop }} /> : null}
            <div className="articulos-card-bg" style={{ top: base }} />
            <div className={`articulos-image ${i === 0 ? 'articulos-image-first' : ''}`} style={{ top: base, backgroundImage: `url(${image})` }} />
            <p className="articulos-analisis" style={{ top: base + 92 }}>ANÁLISIS</p>
            <p className={`articulos-title ${i === 0 ? 'articulos-title-first' : ''}`} style={{ top: base + (i === 0 ? 5 : i === 1 ? -6 : 0) }}>
              <span className="articulos-title-red">{article.titleBefore}</span>
              {stackedTitle ? <br /> : null}
              <strong className="articulos-title-bold-dark">{article.titleBold}</strong>
            </p>
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
            <p className="articulos-desc" style={{ top: base + descOffsets[i] }}>
              {article.excerpt}
            </p>
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
