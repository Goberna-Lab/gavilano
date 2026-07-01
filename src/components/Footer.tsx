import { Link } from 'react-router-dom'
import './Footer.css'
import { asset } from '../utils/asset'

type FooterLink =
  | { label: string; to: string; preventNavigation?: boolean }

const linkColumns: FooterLink[][] = [
  [
    { label: 'biografía', to: '/biografia' },
    { label: 'experiencia', to: '/experiencia' },
    { label: 'propuestas', to: '/propuestas' },
  ],
  [
    //{ label: 'propuestas', to: '/propuestas', preventNavigation: true },
    { label: 'artículos', to: '/articulos' },
  ],
]

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-group-icon" aria-hidden="true" />
        <p className="footer-links-label footer-links-label--primary" aria-hidden="true">Enlaces</p>
        <p className="footer-links-label footer-links-label--secondary" aria-hidden="true">Enlaces</p>
        <p className="footer-contact-label" aria-hidden="true">Contacto</p>

        {linkColumns.map((column, index) => (
          <div
            className={`footer-links ${index === 0 ? 'footer-links--primary' : 'footer-links--secondary'}`}
            key={`footer-column-${index}`}
          >
            {column.map((item) => (
              item.preventNavigation ? (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={(event) => event.preventDefault()}
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        ))}

        <div className="footer-contact">
          <a href="tel:+51997091206">
            <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" fill="none" strokeWidth="1.8" aria-hidden="true">
              <path d="M3.5 2.5h2.2l1 2.6-1.3 1.2a8 8 0 0 0 4.3 4.3l1.2-1.3 2.6 1v2.2c0 .7-.6 1.3-1.3 1.2C7.3 13.3 2.7 8.7 2.3 3.8c-.1-.7.5-1.3 1.2-1.3z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            +51 997 091 206
          </a>
          <a href="mailto:alcaldecdlr@juandediosgavilano.com">
            <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" fill="none" strokeWidth="1.8" aria-hidden="true">
              <rect x="2" y="3.5" width="12" height="9" rx="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2.5 4.2 8 8.5l5.5-4.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            alcaldecdlr@juandediosgavilano.com
          </a>
        </div>

        <div className="footer-component-icon" aria-hidden="true" />

        <div className="footer-qr" aria-label="QR code">
          <div className="footer-qr-box">
            <img src={asset('qr.png')} alt="QR" className="footer-qr-image" loading="lazy" />
          </div>
        </div>

        <button className="scroll-top" type="button" onClick={scrollToTop} aria-label="Volver arriba">
          <img src={asset('flechaaup.png')} alt="" className="scroll-top-image" loading="lazy" />
        </button>
      </div>
    </footer>
  )
}

export default Footer
