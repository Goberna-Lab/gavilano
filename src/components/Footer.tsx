import { Link } from 'react-router-dom'
import './Footer.css'
import { asset } from '../utils/asset'

type FooterLink =
  | { label: string; to: string; preventNavigation?: boolean }

const linkColumns: FooterLink[][] = [
  [
    { label: 'biografía', to: '/biografia' },
    { label: 'experiencia', to: '/experiencia' },
    { label: 'mi aporte', to: '/mi-aporte' },
  ],
  [
    { label: 'propuestas', to: '/propuestas', preventNavigation: true },
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

        <div className="footer-component-icon" aria-hidden="true" />

        <div className="footer-qr" aria-label="QR code">
          <div className="footer-qr-box">
            <img src={asset('qr.png')} alt="QR" className="footer-qr-image" />
          </div>
        </div>

        <button className="scroll-top" type="button" onClick={scrollToTop} aria-label="Volver arriba">
          <img src={asset('flechaaup.png')} alt="" className="scroll-top-image" />
        </button>
      </div>
    </footer>
  )
}

export default Footer
