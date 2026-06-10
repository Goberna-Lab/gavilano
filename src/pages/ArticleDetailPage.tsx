import { Link, Navigate, useParams } from 'react-router-dom'
import { articles, getArticleBySlug } from '../data/articles'
import { asset } from '../utils/asset'
import './ArticleDetailPage.css'

function ArticleDetailPage() {
  const { slug } = useParams()
  const article = getArticleBySlug(slug)

  if (!article) {
    return <Navigate to="/articulos" replace />
  }

  const relatedArticles = articles.filter((item) => item.slug !== article.slug).slice(0, 2)

  return (
    <>
      <div className="article-detail-page">
        <div className="article-detail-shell">
          <Link to="/articulos" className="article-detail-back">← Volver a artículos</Link>

          <p className="article-detail-kicker">ANÁLISIS · 30 MAYO 2026 · 6 MIN</p>
          <h1 className="article-detail-title">
            <span className="article-detail-title-before">{article.titleBefore}</span>
            <span className="article-detail-title-bold">{article.titleBold}</span>
          </h1>

          <img src={asset(article.image)} alt={article.titleBold} className="article-detail-image" />

          <div className="article-detail-copy">
            <p className="article-detail-lead">{article.detailLead}</p>
            {article.body.map((paragraph) => (
              <p key={paragraph} className="article-detail-paragraph">{paragraph}</p>
            ))}
          </div>

          <section className="article-detail-related">
            <p className="article-detail-related-kicker">Más artículos</p>
            <div className="article-detail-related-grid">
              {relatedArticles.map((related) => (
                <Link key={related.slug} to={`/articulos/${related.slug}`} className="article-detail-related-card">
                  <img src={asset(related.image)} alt={related.titleBold} className="article-detail-related-image" />
                  <div className="article-detail-related-content">
                    <p className="article-detail-related-title">{related.titleBold}</p>
                    <p className="article-detail-related-link">Leer nota completa</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default ArticleDetailPage
