import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './hover-effects.css'
import './mobile.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// El sitio está diseñado en un canvas fijo de 1920px. Entre 1024 y 1919px lo
// escalamos con `zoom` para que entre exacto en el viewport al 100% (sin
// desbordarse / sin verse sobreescalado). ≥1920px se ve nativo; ≤1023px lo
// maneja mobile.css (layout responsive).
function fitCanvas() {
  const root = document.getElementById('root')
  if (!root) return
  const vw = document.documentElement.clientWidth
  if (vw >= 1024 && vw < 1920) root.style.setProperty('zoom', String(vw / 1920))
  else root.style.removeProperty('zoom')
}
fitCanvas()
window.addEventListener('resize', fitCanvas)
