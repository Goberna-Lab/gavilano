import './ArticulosSection.css'
import { Link } from 'react-router-dom'
import { asset } from '../utils/asset'
import { articles } from '../data/articles'

const cardBases = [520, 819, 1118]
const featuredArticles = articles.slice(0, cardBases.length)

function ArticulosSection() {
  return (
    <section className="articulos-section" id="articulos">
      <p className="articulos-heading">MIS ARTÍCULOS</p>
      <div className="articulos-subtitle-block">
        <p className="articulos-subtitle-line">IDEAS PARA LEVANTAR</p>
        <p className="articulos-subtitle-italic">NUESTRO DISTRITO</p>
      </div>

      <p className="articulos-view-all">
        <Link to="/articulos" className="articulos-view-all-link">
          <span className="articulos-view-all-text">VER TODOS</span>
          <span className="articulos-view-all-arrow" aria-hidden="true" />
        </Link>
      </p>

      {featuredArticles.map((article, i) => {
        const base = cardBases[i]
        const stackedTitle = true
        return (
          <div key={i}>
            {i !== 1 ? <div className="articulos-divider" style={{ top: i === 2 ? base - 50 : base - 20 }} /> : null}
            <div className="articulos-card-bg" style={{ top: base }} />
            <div className="articulos-image" style={{ top: base, backgroundImage: `url(${asset(article.image)})` }} />
            <p className="articulos-analisis" style={{ top: base + 63 }}>ANÁLISIS</p>
            <p className="articulos-title" style={{ top: base + (i === 1 ? -6 : i === 2 ? -31 : 0) }}>
              <span className="articulos-title-red">{article.titleBefore}</span>
              {stackedTitle ? <br /> : null}
              <strong className="articulos-title-bold-dark">{article.titleBold}</strong>
            </p>
            <p className="articulos-date" style={{ top: base + (i >= 1 ? 14 : 0) }}>23 MAYO 2026</p>
            <p className="articulos-min" style={{ top: base + 45 + (i >= 1 ? 14 : 0) }}>6 MIN</p>
            <p className="articulos-desc" style={{ top: base + 65 + (i === 1 ? 23 : i === 2 ? -1 : 0) }}>
              {article.excerpt}
            </p>
            <Link to={`/articulos/${article.slug}`} className="articulos-nota" style={{ top: base + 150 + (i >= 1 ? 14 : 0) }} aria-label={`Leer nota completa: ${article.titleBold}`}>
              LEER NOTA COMPLETA
              <span className="articulos-nota-arrow" aria-hidden="true" />
            </Link>
            {i === 0 ? <div className="articulos-divider" style={{ top: base + 263 }} /> : null}
            {i === 2 ? <div className="articulos-divider" style={{ top: base + 246 }} /> : null}
          </div>
        )
      })}
    </section>
  )
}

export default ArticulosSection
