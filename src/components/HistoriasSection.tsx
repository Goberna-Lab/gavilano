import { useState } from 'react'
import './HistoriasSection.css'

const VIDEO_ID = 'ZsJY9RuoX_M'

function HistoriasSection() {
  const [playing, setPlaying] = useState(false)

  return (
    <section className="historias-section">
      <p className="historias-text">
        <span>HISTORIAS QUE CONSTRUYEN</span>
        <span>FUTURO</span>
      </p>
      <div className="historias-video">
        {playing ? (
          <iframe
            className="historias-video-frame"
            src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
            title="Historias que construyen futuro"
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
              backgroundImage: `url("https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg")`,
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
