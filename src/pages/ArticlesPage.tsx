import { Link } from 'react-router-dom'
import SumateSection from '../components/SumateSection'
import { articles } from '../data/articles'
import { asset } from '../utils/asset'
import './ArticlesPage.css'

function ArticlesPage() {
  return (
    <>
      <div className="articles-page">
        <section className="articles-page-hero" aria-label="Blog de artículos">
          <div className="articles-page-hero-frame">
            <div className="articles-page-hero-banner">
              <img src={asset('Grupo 28345.png')} alt="Juan de Dios Gavilano" className="articles-page-hero-image" />
            </div>
            <p className="articles-page-breadcrumb">Inicio &gt; Blog</p>
          </div>

          <div className="articles-page-copy-block">
            <h1 className="articles-page-title">
              <span className="articles-page-title-main">UNA GESTIÓN PARA </span>
              <span className="articles-page-title-accent">LOS CARMELINOS</span>
            </h1>
            <p className="articles-page-copy">Infórmate sobre lo que pasa en el distrito</p>
          </div>
        </section>

        <section className="articles-grid" aria-label="Listado de artículos">
          {articles.map((article) => (
            <article className="articles-card" key={article.slug}>
              <img src={asset(article.image)} alt={article.titleBold} className="articles-card-image" />
              <div className="articles-card-content">
                <p className="articles-card-label">ANÁLISIS</p>
                <h2 className="articles-card-title">
                  <span className="articles-card-title-before">{article.titleBefore}</span>
                  <span className="articles-card-title-bold">{article.titleBold}</span>
                </h2>
                <div className="articles-card-meta">
                  <span className="articles-card-meta-date">30 Mayo 2026</span>
                  <span className="articles-card-meta-divider" aria-hidden="true" />
                  <span className="articles-card-meta-time">6 min</span>
                </div>
                <p className="articles-card-excerpt">{article.excerpt}</p>
                <Link to={`/articulos/${article.slug}`} className="articles-card-link">
                  LEER NOTA COMPLETA
                  <span className="articles-card-link-arrow" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </section>

        <div className="articles-page-cta-wrap">
          <Link to="/#articulos" className="articles-page-cta">
            <span className="articles-page-cta-text">VER TODO</span>
            <span className="articles-page-cta-arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <SumateSection />
    </>
  )
}

export default ArticlesPage
