import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import PaginaDeBravo from './pages/PaginaDeBravo'
import ArticlesPage from './pages/ArticlesPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import './App.css'

function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

/* Las páginas del sitio ya no están escritas acá: salen del contenido, por slug.
 * `/articulos` y `/articulos/:slug` siguen siendo rutas de CÓDIGO —las dibuja la
 * lista de notas, que ya funcionaba— y por eso van declaradas en `fixedRoutes` del
 * manifest, para que el menú pueda apuntarlas.
 *
 * El orden importa poco: el enrutador prefiere un segmento literal a uno
 * paramétrico, así que `/articulos` le gana a `/:slug` aunque estuviera después.
 */
function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<PaginaDeBravo slug="" />} />
        <Route path="/articulos" element={<ArticlesPage />} />
        <Route path="/articulos/:slug" element={<ArticleDetailPage />} />
        <Route path="/:slug" element={<PaginaDeBravo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
