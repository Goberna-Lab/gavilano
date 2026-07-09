import { useState } from 'react'
import { Link } from 'react-router-dom'
import SumateSection from '../components/SumateSection'
import { displayArticles, coverSrc, formatDate, readingMinutes } from '../data/articleSource'
import { asset } from '../utils/asset'
import './ArticlesPage.css'

const INITIAL_COUNT = 3

type DisplayArticle = (typeof displayArticles)[number]

function renderArticleCard(article: DisplayArticle) {
  return (
    <article className="articles-card" key={article.slug}>
      <img src={coverSrc(article)} alt={article.titleBold} className="articles-card-image" />
      <div className="articles-card-content">
        <p className="articles-card-label">{article.category || 'ANÁLISIS'}</p>
        <h2 className="articles-card-title">
          <span className="articles-card-title-bold">{article.titleBold}</span>
        </h2>
        <div className="articles-card-meta">
          <span className="articles-card-meta-date">{article.publishedAt ? formatDate(article.publishedAt) : '30 Mayo 2026'}</span>
          <span className="articles-card-meta-divider" aria-hidden="true" />
          <span className="articles-card-meta-time">{article.source === 'bravo' ? `${readingMinutes(article)} min` : '6 min'}</span>
        </div>
        <p className="articles-card-excerpt">{article.excerpt}</p>
        <Link to={`/articulos/${article.slug}`} className="articles-card-link">
          LEER NOTA COMPLETA
          <span className="articles-card-link-arrow" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

function ArticlesPage() {
  const [showAll, setShowAll] = useState(false)
  const hasMore = displayArticles.length > INITIAL_COUNT

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
              <span className="articles-page-title-main">UNA GESTIÓN{' '}<br className="articles-mobile-break" />PARA LOS </span>
              <br className="articles-mobile-break" />
              <span className="articles-page-title-accent">CARMELINOS</span>
            </h1>
            <p className="articles-page-copy">Infórmate sobre lo que pasa en el distrito</p>
          </div>
        </section>

        <section className="articles-grid" aria-label="Listado de artículos">
          {displayArticles.slice(0, INITIAL_COUNT).map(renderArticleCard)}
        </section>

        {hasMore ? (
          <div className={`articles-grid-collapse${showAll ? ' is-open' : ''}`}>
            <div className="articles-grid-collapse-inner">
              <div className="articles-grid articles-grid--extra" aria-hidden={!showAll}>
                {displayArticles.slice(INITIAL_COUNT).map(renderArticleCard)}
              </div>
            </div>
          </div>
        ) : null}

        {hasMore ? (
          <div className="articles-page-cta-wrap">
            <button type="button" className="articles-page-cta" onClick={() => setShowAll((prev) => !prev)}>
              <span className="articles-page-cta-text">{showAll ? 'VER MENOS' : 'VER TODO'}</span>
              <span className={`articles-page-cta-arrow${showAll ? ' articles-page-cta-arrow--up' : ''}`} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
      <SumateSection />
    </>
  )
}

export default ArticlesPage
