import { Link } from 'react-router-dom'
import './Hero.css'
import { asset } from '../utils/asset'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg-overlay" />
      <div className="hero-mobile-portrait" aria-hidden="true" />
      <div className="hero-content">
        <h1 className="hero-title">EXPERIENCIA</h1>
        <p className="hero-subtitle">PARA</p>
        <p className="hero-subtitle2">SERVIR</p>
      </div>
      <Link className="hero-button" to="/biografia">
        <span className="hero-button-text">CONOCE MI HISTORIA</span>
        <img src={asset('Trazado88.png')} alt="" className="hero-button-icon" />
      </Link>
    </section>
  )
}

export default Hero
