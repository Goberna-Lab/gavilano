import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { SeccionSuelta } from '../components/SeccionSuelta'
import {
  getDisplayArticleBySlug,
  coverSrc,
  formatDate,
  readingMinutes,
} from '../data/articleSource'
import { sanitizeHtml } from '../utils/sanitizeHtml'
import './ArticleDetailPage.css'

function ArticleDetailPage() {
  const { slug } = useParams()
  const article = getDisplayArticleBySlug(slug)

  // Meta para navegación client-side (el prerender cubre la carga inicial/crawlers;
  // esto cubre cuando el usuario llega por el router sin recargar).
  useEffect(() => {
    if (!article) return
    const prevTitle = document.title
    document.title = article.seoTitle || `${article.titleBold} — Juan de Dios Gavilano`
    const desc = article.seoDescription || article.excerpt
    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
    }
    if (desc) tag.setAttribute('content', desc)
    return () => {
      document.title = prevTitle
    }
  }, [article])

  if (!article) {
    return <Navigate to="/articulos" replace />
  }

  const titleBefore = article.titleBefore.trim()
  const imageClassName = (article.imageWidth ?? 9999) < 1000
    ? 'article-detail-image article-detail-image--native-size'
    : 'article-detail-image'
  const dateLabel = article.publishedAt ? formatDate(article.publishedAt) : '30 Mayo 2026'
  const timeLabel = article.source === 'bravo' ? `${readingMinutes(article)} min` : '6 min'

  return (
    <>
      <div className="article-detail-page">
        <div className="article-detail-shell">
          <Link to="/articulos" className="article-detail-back">← Volver a artículos</Link>

          <h1 className="article-detail-title">
            {titleBefore ? <span className="article-detail-title-before">{titleBefore}</span> : null}
            <span className="article-detail-title-bold">{article.titleBold}</span>
          </h1>

          <div className="article-detail-meta" aria-label="Fecha y tiempo de lectura">
            <span className="article-detail-meta-date">{dateLabel}</span>
            <span className="article-detail-meta-divider" aria-hidden="true" />
            <span className="article-detail-meta-time">{timeLabel}</span>
          </div>

          <img
            src={coverSrc(article)}
            alt={article.titleBold}
            className={imageClassName}
            width={article.imageWidth}
            height={article.imageHeight}
            decoding="async"
          />

          <div className="article-detail-content-panel">
            <div className="article-detail-content-text">
              {article.bodyHtml ? (
                <div
                  className="article-detail-body-html"
                  // Contenido de primera parte (CMS del propio cliente), saneado.
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.bodyHtml) }}
                />
              ) : (
                <>
                  {article.detailLead ? (
                    <p className="article-detail-content-body">
                      <strong className="article-detail-section-heading">{article.detailLead}</strong>
                    </p>
                  ) : null}
                  {article.body.map((para, i) => (
                    <p key={i} className="article-detail-content-body article-detail-content-body-separated">
                      {para}
                    </p>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <SeccionSuelta tipo="sumate" />
    </>
  )
}

export default ArticleDetailPage
