import { Link, Navigate, useParams } from 'react-router-dom'
import SumateSection from '../components/SumateSection'
import { getArticleBySlug } from '../data/articles'
import { asset } from '../utils/asset'
import './ArticleDetailPage.css'

function ArticleDetailPage() {
  const { slug } = useParams()
  const article = getArticleBySlug(slug)

  if (!article) {
    return <Navigate to="/articulos" replace />
  }

  const titleBefore = article.titleBefore.trim()
  const imageClassName = article.imageWidth < 1000
    ? 'article-detail-image article-detail-image--native-size'
    : 'article-detail-image'

  return (
    <>
      <div className="article-detail-page">
        <div className="article-detail-shell">
          <Link to="/articulos" className="article-detail-back">← Volver a artículos</Link>

          <h1 className="article-detail-title">
            <span className="article-detail-title-before">{titleBefore}</span>
            <span className="article-detail-title-bold">{article.titleBold}</span>
          </h1>

          <div className="article-detail-meta" aria-label="Fecha y tiempo de lectura">
            <span className="article-detail-meta-date">30 Mayo <span className="article-detail-meta-year">2026</span></span>
            <span className="article-detail-meta-divider" aria-hidden="true" />
            <span className="article-detail-meta-time">6 min</span>
          </div>

          <img
            src={asset(article.image)}
            alt={article.titleBold}
            className={imageClassName}
            width={article.imageWidth}
            height={article.imageHeight}
            decoding="async"
          />

          <div className="article-detail-content-panel">
            <div className="article-detail-content-text">
              <p className="article-detail-content-body">
                <strong className="article-detail-section-heading">Why do we use it?</strong>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset’s Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum. 
                <strong className="article-detail-section-heading article-detail-section-heading-spaced">Why do we use it?</strong>
                 It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ‘Content here, content here’, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for ‘lorem ipsum’ will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). 
                 <strong className="article-detail-section-heading article-detail-section-heading-more-spaced">Where does it come from?</strong>
                 Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of “de Finibus Bonorum et Malorum” (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, “Lorem ipsum dolor sit amet..”, comes from a line in section 1.10.32.
              </p>
              <p className="article-detail-content-body article-detail-content-body-separated">
                The standard chunk of Lorem Ipsum used since 1966 is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from “de Finibus Bonorum et Malorum” by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
              </p>
              <div className="article-detail-bottom-container">
                <span className="article-detail-bottom-line" aria-hidden="true" />
                <div className="article-detail-bottom-copy">
                  <h2 className="article-detail-bottom-title">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </h2>
                  <p className="article-detail-bottom-text">
                    Lorem Ipsum has been the industry’s standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library,
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SumateSection />
    </>
  )
}

export default ArticleDetailPage
