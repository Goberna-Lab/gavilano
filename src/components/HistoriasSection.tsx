import './HistoriasSection.css'

function HistoriasSection() {
  return (
    <section className="historias-section">
      <p className="historias-text">HISTORIAS QUE CONSTRUYEN FUTURO</p>
      <iframe
        className="historias-video"
        src="https://www.youtube.com/embed/ZsJY9RuoX_M"
        title="Historias que construyen futuro"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </section>
  )
}

export default HistoriasSection
