import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '/images/logo-gavilano.svg'
import './Header.css'

type NavItem =
  | { label: string; to: string; preventNavigation?: boolean }

const navItems: NavItem[] = [
  { label: 'BIOGRAFIA', to: '/biografia' },
  { label: 'EXPERIENCIA', to: '/experiencia' },
  { label: 'MI APORTE', to: '/mi-aporte' },
  //{ label: 'PROPUESTAS', to: '/propuestas', preventNavigation: true },
  { label: 'ARTICULOS', to: '/articulos' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`header${menuOpen ? ' header--menu-open' : ''}`}>
      <button
        className="header-hamburger"
        type="button"
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span className="header-hamburger-line" />
        <span className="header-hamburger-line" />
        <span className="header-hamburger-line" />
      </button>
      <Link to="/" className="header-logo-link" aria-label="Ir al inicio" onClick={closeMenu}>
        <img src={logo} className="header-logo" alt="Gavilano" />
      </Link>
      <div className="header-divider" aria-hidden="true" />
      <nav className={`header-nav${menuOpen ? ' header-nav--open' : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="header-nav-item"
            onClick={item.preventNavigation ? (event) => event.preventDefault() : closeMenu}
          >
            {item.label}
          </Link>
        ))}
        <button className="header-nav-hablemos" type="button" onClick={() => { closeMenu(); setTimeout(() => document.querySelector('.footer')?.scrollIntoView({ behavior: 'smooth' }), 100) }}>
          HABLEMOS
        </button>
      </nav>
    </header>
  )
}

export default Header
