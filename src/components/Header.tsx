import { Link } from 'react-router-dom'
import logo from '/images/logo-gavilano.svg'
import './Header.css'

type NavItem =
  | { label: string; to: string; preventNavigation?: boolean }

const navItems: NavItem[] = [
  { label: 'BIOGRAFIA', to: '/biografia' },
  { label: 'EXPERIENCIA', to: '/experiencia' },
  { label: 'MI APORTE', to: '/mi-aporte' },
  { label: 'PROPUESTAS', to: '/propuestas', preventNavigation: true },
  { label: 'ARTICULOS', to: '/articulos' },
]

function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-logo-link" aria-label="Ir al inicio">
        <img src={logo} className="header-logo" alt="Gavilano" />
      </Link>
      <nav className="header-nav">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="header-nav-item"
            onClick={item.preventNavigation ? (event) => event.preventDefault() : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

export default Header
