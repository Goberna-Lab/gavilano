import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import BiografiaPage from './pages/BiografiaPage'
import ExperienciaPage from './pages/ExperienciaPage'
import MiAportePage from './pages/MiAportePage'
import PropuestasPage from './pages/PropuestasPage'
import ArticulosPage from './pages/ArticulosPage'
import ArticuloDetallePage from './pages/ArticuloDetallePage'
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

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/biografia" element={<BiografiaPage />} />
        <Route path="/experiencia" element={<ExperienciaPage />} />
        <Route path="/mi-aporte" element={<MiAportePage />} />
        <Route path="/propuestas" element={<PropuestasPage />} />
        <Route path="/articulos" element={<ArticulosPage />} />
        <Route path="/articulos/:slug" element={<ArticuloDetallePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
