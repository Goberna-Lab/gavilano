import { useState } from 'react'
import type { FormEvent } from 'react'
import './SumateSection.css'
import { asset } from '../utils/asset'
import type { ContenidoSumate, PropsSeccion } from '../lib/contenido'

const BRAVO_CONTACT_URL = 'https://bravo.goberna.us/v1/public/contact'

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

/* El `name` de cada campo es lo que viaja a Bravo y con lo que quedan guardados
   los mensajes ya recibidos: NO es contenido y no se edita desde el panel.
   Renombrar la etiqueta que ve el visitante es seguro; cambiar esto rompería la
   continuidad de los leads. Va indexado por la misma posición que
   `content.campos`, igual que el tipo de control y el ancho de cada uno. */
const CAMPOS = [
  { name: 'nombres', control: 'input', type: 'text', autoComplete: 'given-name', required: true },
  { name: 'apellidos', control: 'input', type: 'text', autoComplete: 'family-name' },
  { name: 'correo', control: 'input', type: 'email', autoComplete: 'email' },
  { name: 'telefono', control: 'input', type: 'tel', autoComplete: 'tel' },
  { name: 'motivo', control: 'select', required: true, ancho: 'full' },
  { name: 'mensaje', control: 'textarea', ancho: 'full' },
] as const

/* Los valores que viajan al panel. Renombrar una opción en el panel cambia lo que
   lee el visitante, no lo que queda guardado. */
const VALORES_MOTIVO = ['quiero-sumarme', 'mas-informacion', 'tengo-propuesta', 'otro']

function SumateSection({ content, anchor }: PropsSeccion<ContenidoSumate>) {
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
    <section className="sumate-section" id={anchor}>
      <div className="sumate-parallax" aria-hidden="true" />
      <div className="sumate-inner">
        <div className="sumate-left">
          <p className="sumate-heading">{content.encabezado}</p>
          <div className="sumate-subtitle-block">
            <p className="sumate-subtitle-line">{content.subtituloLinea1}</p>
            <p className="sumate-subtitle-line sumate-subtitle-line-2">{content.subtituloLinea2}</p>
            <p className="sumate-subtitle-italic">{content.subtituloItalica}</p>
          </div>
          <div className="sumate-desc-block">
            <p className="sumate-desc-title">{content.descTitulo}</p>
            <p className="sumate-desc-text">{content.descTexto}</p>
          </div>
        </div>

        <form className="sumate-white-box" aria-label="Formulario de contacto" onSubmit={handleSubmit}>
          <div className="sumate-grid">
            {content.campos.map((campo, i) => {
              const def = CAMPOS[i]
              const id = `sumate-${def.name}`
              const ancho = 'ancho' in def && def.ancho === 'full' ? ' sumate-field--full' : ''
              return (
                <div className={`sumate-field${ancho}`} key={def.name}>
                  <label className="sumate-field-label" htmlFor={id}>{campo.etiqueta}</label>
                  {def.control === 'select' ? (
                    <select id={id} name={def.name} className="sumate-field-input sumate-field-select" defaultValue="" required>
                      <option value="" disabled>
                        {campo.marcador}
                      </option>
                      {content.motivoOpciones.map((opcion, j) => (
                        <option value={VALORES_MOTIVO[j]} key={VALORES_MOTIVO[j]}>{opcion.texto}</option>
                      ))}
                    </select>
                  ) : def.control === 'textarea' ? (
                    <textarea id={id} name={def.name} className="sumate-field-input sumate-field-textarea" placeholder={campo.marcador} />
                  ) : (
                    <input id={id} name={def.name} className="sumate-field-input" placeholder={campo.marcador} type={def.type} autoComplete={def.autoComplete} required={'required' in def ? def.required : undefined} />
                  )}
                </div>
              )
            })}
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
              {content.errorTexto}
            </p>
          ) : null}
          {status === 'success' ? (
            <p className="sumate-form-message sumate-form-message--success" role="status">
              {content.exitoTexto}
            </p>
          ) : null}

          <button className="sumate-box-button" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? content.enviandoEtiqueta : content.enviarEtiqueta}
            <img src={asset('Trazado88.png')} alt="" className="sumate-box-button-icon" />
          </button>
        </form>
      </div>
    </section>
  )
}

export default SumateSection
