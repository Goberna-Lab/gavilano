import { Link } from 'react-router-dom'
import logo from '/images/logo-gavilano.svg'
import './Header.css'

const navItems = [
  { label: 'BIOGRAFIA', to: '/biografia' },
  { label: 'EXPERIENCIA', to: '/experiencia' },
  { label: 'MI APORTE', to: '/mi-aporte' },
  { label: 'PROPUESTAS', to: '/propuestas' },
  { label: 'ARTICULOS', to: '/articulos' },
]

function Header() {
  return (
    <header className="header">
      <Link to="/">
        <img src={logo} className="header-logo" alt="Gavilano" />
      </Link>
      <nav className="header-nav">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="header-nav-item"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

export default Header
