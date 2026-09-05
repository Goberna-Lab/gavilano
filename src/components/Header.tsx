import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '/images/logo-gavilano-2027.png'
import './Header.css'
import { EnlaceDeMenu } from './EnlaceDeMenu'
import { getMenu } from '../lib/paginas'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const items = getMenu('principal')

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
        {items.map((item) => (
          <EnlaceDeMenu key={item.id} item={item} className="header-nav-item" onClick={closeMenu} />
        ))}
        {/* HABLEMOS no es un ítem de menú: no tiene destino, hace scroll al pie.
            Por eso no puede salir de Bravo — un ítem sin `href` no existe en el
            contrato. */}
        <button className="header-nav-hablemos" type="button" onClick={() => { closeMenu(); setTimeout(() => document.querySelector('.footer')?.scrollIntoView({ behavior: 'smooth' }), 100) }}>
          HABLEMOS
        </button>
      </nav>
    </header>
  )
}

export default Header
