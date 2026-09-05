import { useState } from 'react'
import './HistoriasSection.css'
import type { ContenidoHistorias, PropsSeccion } from '../lib/contenido'

function HistoriasSection({ content, anchor }: PropsSeccion<ContenidoHistorias>) {
  const [playing, setPlaying] = useState(false)
  const { videoId } = content

  return (
    <section className="historias-section" id={anchor}>
      <p className="historias-text">
        <span>{content.textoLinea1}</span>
        <span>{content.textoLinea2}</span>
      </p>
      <div className="historias-video">
        {playing ? (
          <iframe
            className="historias-video-frame"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={content.videoTitulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="historias-video-facade"
            onClick={() => setPlaying(true)}
            aria-label="Reproducir video"
            style={{
              backgroundImage: `url("https://img.youtube.com/vi/${videoId}/maxresdefault.jpg")`,
            }}
          >
            <span className="historias-video-overlay" />
            <span className="historias-video-play" aria-hidden="true">
              <svg viewBox="0 0 24 28" focusable="false">
                <path d="M3 2 L22 14 L3 26 Z" fill="#FFFFFF" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </section>
  )
}

export default HistoriasSection
