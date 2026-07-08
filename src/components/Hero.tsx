import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'
import { asset } from '../utils/asset'

function Hero() {
  const [fontReady, setFontReady] = useState(() => {
    if (typeof document === 'undefined' || !document.fonts) return true
    return document.fonts.check('800 1em "Bebas Neue"')
  })

  useEffect(() => {
    if (fontReady) return

    if (!document.fonts) {
      const fallbackTimer = window.setTimeout(() => setFontReady(true), 0)
      return () => window.clearTimeout(fallbackTimer)
    }

    if (document.fonts.check('800 1em "Bebas Neue"')) {
      const fallbackTimer = window.setTimeout(() => setFontReady(true), 0)
      return () => window.clearTimeout(fallbackTimer)
    }

    let cancelled = false
    const fallbackTimer = window.setTimeout(() => {
      if (!cancelled) setFontReady(true)
    }, 1200)

    document.fonts
      .load('800 1em "Bebas Neue"')
      .then(() => {
        window.clearTimeout(fallbackTimer)
        if (!cancelled) setFontReady(true)
      })
      .catch(() => {
        window.clearTimeout(fallbackTimer)
        if (!cancelled) setFontReady(true)
      })

    return () => {
      cancelled = true
      window.clearTimeout(fallbackTimer)
    }
  }, [fontReady])

  return (
    <section className={`hero ${fontReady ? 'hero--font-ready' : ''}`}>
      <img
        className="hero-bg-image"
        src={asset('PT_WEB_01.png')}
        alt=""
        fetchPriority="high"
        decoding="async"
      />
      <div className="hero-mobile-portrait" aria-hidden="true" />
      <div className="hero-content">
        <h1 className="hero-title">EXPERIENCIA</h1>
        <p className="hero-subtitle">PARA</p>
        <div className="hero-serve-group">
          <p className="hero-subtitle2">SERVIR</p>
          <Link className="hero-button" to="/biografia">
            <span className="hero-button-text">CONOCE MI HISTORIA</span>
            <img src={asset('Trazado88.png')} alt="" className="hero-button-icon" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
