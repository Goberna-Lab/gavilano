import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import './hover-effects.css'
import './mobile.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// El sitio está diseñado en un canvas fijo de 1920px. Entre 1024 y 1919px lo
// escalamos con `zoom` para que entre exacto en el viewport al 100% (sin
// desbordarse / sin verse sobreescalado). ≥1920px se ve nativo; ≤1024px lo
// maneja mobile.css (layout responsive).
function fitCanvas() {
  const root = document.getElementById('root')
  if (!root) return
  const vw = window.innerWidth
  const z = vw > 1024 && vw < 1920 ? vw / 1920 : 1
  if (z !== 1) root.style.setProperty('zoom', String(z))
  else root.style.removeProperty('zoom')
  // Alto del viewport expresado en px del canvas 1920 (deshaciendo el zoom).
  // Permite que el hero llene EXACTO la altura visible: dentro del contexto
  // con `zoom`, `100dvh` resuelve al viewport físico y luego se re-escala, así
  // que no sirve para llenar; esto sí. Ver .hero en Hero.css.
  root.style.setProperty('--canvas-vh', `${window.innerHeight / z}px`)
}
fitCanvas()
window.addEventListener('resize', fitCanvas)
