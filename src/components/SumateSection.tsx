import { useState } from 'react'
import type { FormEvent } from 'react'
import './SumateSection.css'
import { asset } from '../utils/asset'

const BRAVO_CONTACT_URL = 'https://bravo.goberna.us/v1/public/contact'

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

function SumateSection() {
  const [status, setStatus] = useState<SubmitStatus>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    // Honeypot: bots fill this hidden field, humans never see it.
    if (String(data.get('website') ?? '').length > 0) {
      form.reset()
      setStatus('success')
      return
    }

    const name = [data.get('nombres'), data.get('apellidos')]
      .map((value) => String(value ?? '').trim())
      .filter(Boolean)
      .join(' ')
    const email = String(data.get('correo') ?? '').trim()
    const phone = String(data.get('telefono') ?? '').trim()
    const motivo = String(data.get('motivo') ?? '').trim()
    const message = String(data.get('mensaje') ?? '').trim()

    if (!name || (!email && !phone)) {
      setStatus('error')
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch(BRAVO_CONTACT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant: 'gavilano',
          name,
          email,
          phone,
          message,
          motivo,
        }),
        signal: AbortSignal.timeout(15_000),
      })

      if (!response.ok) throw new Error(`bravo contact failed: ${response.status}`)

      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="sumate-section">
      <div className="sumate-parallax" aria-hidden="true" />
      <div className="sumate-inner">
        <div className="sumate-left">
          <p className="sumate-heading">SÚMATE</p>
          <div className="sumate-subtitle-block">
            <p className="sumate-subtitle-line">EL DISTRITO SE </p>
            <p className="sumate-subtitle-line sumate-subtitle-line-2">CONSTRUYE</p>
            <p className="sumate-subtitle-italic">CONTIGO.</p>
          </div>
          <div className="sumate-desc-block">
            <p className="sumate-desc-title">Tu voz también importa.</p>
            <p className="sumate-desc-text">Escríbeme, comparte tu propuesta o súmate a este camino por Carmen de la Legua Reynoso.</p>
          </div>
        </div>

        <form className="sumate-white-box" aria-label="Formulario de contacto" onSubmit={handleSubmit}>
          <div className="sumate-grid">
            <div className="sumate-field">
              <label className="sumate-field-label" htmlFor="sumate-nombres">NOMBRES</label>
              <input id="sumate-nombres" name="nombres" className="sumate-field-input" placeholder="Tu nombre" type="text" autoComplete="given-name" required />
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

          {/* Honeypot — hidden from real visitors, invisible to screen readers. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="sumate-field-honeypot"
          />

          {status === 'error' ? (
            <p className="sumate-form-message sumate-form-message--error" role="alert">
              No pudimos enviar tu mensaje. Intenta de nuevo en unos minutos.
            </p>
          ) : null}
          {status === 'success' ? (
            <p className="sumate-form-message sumate-form-message--success" role="status">
              ¡Gracias! Recibimos tu mensaje.
            </p>
          ) : null}

          <button className="sumate-box-button" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'ENVIANDO…' : 'QUIERO SUMARME'}
            <img src={asset('Trazado88.png')} alt="" className="sumate-box-button-icon" />
          </button>
        </form>
      </div>
    </section>
  )
}

export default SumateSection
