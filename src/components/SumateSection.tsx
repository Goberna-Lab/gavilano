import './SumateSection.css'
import { asset } from '../utils/asset'

function SumateSection() {
  return (
    <section className="sumate-section">
      <div className="sumate-inner">
        <div className="sumate-left">
          <p className="sumate-heading">SÚMATE</p>
          <div className="sumate-subtitle-block">
            <p className="sumate-subtitle-line">EL DISTRITO QUE</p>
            <p className="sumate-subtitle-line sumate-subtitle-line-2">CONSTRUYE</p>
            <p className="sumate-subtitle-italic">CONTIGO.</p>
          </div>
          <div className="sumate-desc-block">
            <p className="sumate-desc-title">Tu voz también importa.</p>
            <p className="sumate-desc-text">Escríbeme, comparte tu propuesta o súmate a este camino por Carmen de la Legua Reynoso.</p>
          </div>
        </div>

        <form className="sumate-white-box" aria-label="Formulario de contacto" onSubmit={(event) => event.preventDefault()}>
          <div className="sumate-grid">
            <div className="sumate-field">
              <label className="sumate-field-label" htmlFor="sumate-nombres">NOMBRES</label>
              <input id="sumate-nombres" name="nombres" className="sumate-field-input" placeholder="Tu nombre" type="text" autoComplete="given-name" />
            </div>
            <div className="sumate-field">
              <label className="sumate-field-label" htmlFor="sumate-apellidos">APELLIDOS</label>
              <input id="sumate-apellidos" name="apellidos" className="sumate-field-input" placeholder="Tus apellidos" type="text" autoComplete="family-name" />
            </div>
            <div className="sumate-field">
              <label className="sumate-field-label" htmlFor="sumate-correo">CORREO</label>
              <input id="sumate-correo" name="correo" className="sumate-field-input" placeholder="tu@correo.com" type="email" autoComplete="email" />
            </div>
            <div className="sumate-field">
              <label className="sumate-field-label" htmlFor="sumate-telefono">TELÉFONO</label>
              <input id="sumate-telefono" name="telefono" className="sumate-field-input" placeholder="+51 000 000 000" type="tel" autoComplete="tel" />
            </div>
            <div className="sumate-field sumate-field--full">
              <label className="sumate-field-label" htmlFor="sumate-motivo">MOTIVO DEL MENSAJE</label>
              <select id="sumate-motivo" name="motivo" className="sumate-field-input sumate-field-select" defaultValue="" required>
                <option value="" disabled>
                  Seleccione
                </option>
                <option value="quiero-sumarme">Quiero sumarme</option>
                <option value="mas-informacion">Deseo más información</option>
                <option value="tengo-propuesta">Tengo una propuesta</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className="sumate-field sumate-field--full">
              <label className="sumate-field-label" htmlFor="sumate-mensaje">MENSAJE OPCIONAL</label>
              <textarea id="sumate-mensaje" name="mensaje" className="sumate-field-input sumate-field-textarea" placeholder="Cuéntanos cómo te gustaría sumarte" />
            </div>
          </div>
          <button className="sumate-box-button" type="submit">QUIERO SUMARME <img src={asset('Trazado88.png')} alt="" className="sumate-box-button-icon" /></button>
        </form>
      </div>
    </section>
  )
}

export default SumateSection
