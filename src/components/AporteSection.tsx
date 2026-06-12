import { useState } from 'react'
import './AporteSection.css'
import { asset } from '../utils/asset'

type Proyecto = {
  id: number
  nombre: string
  titulo: string
  descripcion?: string
  descripcionBold?: boolean
  imagen: string
  navClass: string
  tituloCompleto?: string
  tituloPrefix?: string
  tituloSuffix?: string
  tituloSuffixLines?: string[]
  tituloBreakAfterPrefix?: boolean
  ocultarDescripcion?: boolean
  tituloTop?: number
  tituloWidth?: number
}

const proyectos: Proyecto[] = [
  {
    id: 1,
    nombre: 'Casa del Adulto Mayor',
    titulo: '',
    tituloCompleto: 'Un espacio digno para cuidar, acompañar y reconocer a quienes hicieron historia en Carmen de la Legua Reynoso.',
    tituloTop: 48,
    tituloWidth: 611,
    imagen: asset('personas/senoras.png'),
    navClass: 'aporte-projects-nav-item-casa',
  },
  {
    id: 2,
    nombre: 'Skate Park',
    titulo: '',
    tituloPrefix: 'Un lugar para que los jóvenes',
    tituloSuffixLines: ['practiquen deporte, se expresen', 'y usen mejor su tiempo libre.'],
    tituloBreakAfterPrefix: true,
    descripcion: '',
    imagen: asset('SKATE.png'),
    navClass: 'aporte-projects-nav-item-skate',
    tituloTop: 86,
    tituloWidth: 640,
  },
  {
    id: 3,
    nombre: 'FestiRock',
    titulo: '',
    tituloPrefix: 'Arte, música y cultura',
    tituloSuffix: ' para promover el talento de nuestros jóvenes.',
    descripcion: '',
    imagen: asset('Imagen 876.png'),
    navClass: 'aporte-projects-nav-item-festirock',
    tituloTop: 48,
    tituloWidth: 576,
  },
  {
    id: 4,
    nombre: 'Boulevard Morales Duárez',
    titulo: '',
    tituloPrefix: 'Espacios públicos recuperados',
    tituloSuffix: ' para caminar, encontrarnos y vivir mejor el distrito.',
    descripcion: '',
    imagen: asset('Imagen 007.png'),
    navClass: 'aporte-projects-nav-item-boulevard',
    tituloTop: 48,
    tituloWidth: 607,
  },
  {
    id: 5,
    nombre: 'Carmen Digital',
    titulo: 'Tecnología y modernización',
    descripcion: 'Para acercar la municipalidad al vecino y simplificar cada trámite.',
    imagen: asset('Imagen 1022.png'),
    navClass: 'aporte-projects-nav-item-digital',
  },
]

function AporteSection() {
  const [proyectoActivo, setProyectoActivo] = useState(proyectos[0])

  const irAlProyecto = (proyectoId: number) => {
    const proyecto = proyectos.find((item) => item.id === proyectoId)
    if (proyecto) {
      setProyectoActivo(proyecto)
    }
  }

  const irAnterior = () => {
    setProyectoActivo((actual) => {
      const index = proyectos.findIndex((item) => item.id === actual.id)
      return proyectos[(index - 1 + proyectos.length) % proyectos.length]
    })
  }

  const irSiguiente = () => {
    setProyectoActivo((actual) => {
      const index = proyectos.findIndex((item) => item.id === actual.id)
      return proyectos[(index + 1) % proyectos.length]
    })
  }

  return (
    <section className="aporte-section" id="mi-aporte">
      <p className="aporte-heading">MI APORTE AL DISTRITO</p>
      <div className="aporte-subtitle-block">
        <p className="aporte-subtitle-line aporte-subtitle-line-first">PROYECTOS QUE</p>
        <div className="aporte-subtitle-second-row">
          <p className="aporte-subtitle-line aporte-subtitle-line-second">DEJARON</p>
          <p className="aporte-subtitle-italic">HUELLA.</p>
        </div>
      </div>
      <div className="aporte-description-group">
        <div className="aporte-description-first-row">
          <p className="aporte-description">Durante mi gestión, impulsamos espacios</p>
          <p className="aporte-description-connector">y</p>
        </div>
        <p className="aporte-description-text">
          programas que dejaron huella en Carmen de <br className="aporte-description-mobile-break" />la Legua Reynoso.
        </p>
        <p className="aporte-description-note">Estos son solo algunos,</p>
      </div>
      <nav className="aporte-projects-nav" aria-label="Proyectos destacados">
        {proyectos.map((proyecto) => {
          const isActive = proyectoActivo.id === proyecto.id

          return (
            <button
              key={proyecto.id}
              className={`aporte-projects-nav-item ${proyecto.navClass} ${isActive ? 'aporte-projects-nav-item-active' : ''}`}
              type="button"
              onClick={() => irAlProyecto(proyecto.id)}
              aria-pressed={isActive}
            >
              {proyecto.nombre}
            </button>
          )
        })}
        <div className="aporte-projects-nav-baseline" />
      </nav>
      <div className="aporte-projects-content">
        {!proyectoActivo.ocultarDescripcion ? (
          <div className="aporte-project-description aporte-project-content-transition" key={`description-${proyectoActivo.id}`}>
            <p
              className={`aporte-project-description-text ${(proyectoActivo.tituloPrefix || proyectoActivo.tituloCompleto) ? 'aporte-project-description-text-normal' : ''}`}
              style={{
                top: proyectoActivo.tituloTop ?? 0,
                width: proyectoActivo.tituloWidth ?? 556,
              }}
            >
              {proyectoActivo.tituloCompleto ? (
                <>
                  <span className="aporte-project-description-title-strong">{proyectoActivo.tituloCompleto.split(',')[0]}</span>
                  {proyectoActivo.tituloCompleto.slice(proyectoActivo.tituloCompleto.indexOf(','))}
                </>
              ) : proyectoActivo.tituloPrefix ? (
                <>
                  <span className="aporte-project-description-title-strong">{proyectoActivo.tituloPrefix}</span>
                  {proyectoActivo.tituloBreakAfterPrefix ? <br /> : null}
                  {proyectoActivo.tituloSuffixLines ? (
                    proyectoActivo.tituloSuffixLines.map((line, index) => (
                      <span key={line}>
                        {index > 0 ? <br /> : null}
                        {line}
                      </span>
                    ))
                  ) : (
                    proyectoActivo.tituloSuffix
                  )}
                </>
              ) : proyectoActivo.titulo ? (
                <strong>{proyectoActivo.titulo}</strong>
              ) : null}
            </p>
            {proyectoActivo.descripcion ? (
              <p className="aporte-project-description-subtext">
                {proyectoActivo.descripcionBold ? <strong>{proyectoActivo.descripcion}</strong> : proyectoActivo.descripcion}
              </p>
            ) : null}
          </div>
        ) : null}
        <button className="aporte-project-arrow aporte-project-arrow-left" type="button" aria-label="Proyecto anterior" onClick={irAnterior}>
          <span className="aporte-project-arrow-icon aporte-project-arrow-icon-left" />
        </button>
        <div
          className="aporte-project-image aporte-project-content-transition"
          key={`image-${proyectoActivo.id}`}
          style={{ backgroundImage: `url("${proyectoActivo.imagen}")` }}
        />
        <img
          className="aporte-project-image-mobile aporte-project-content-transition"
          key={`image-mobile-${proyectoActivo.id}`}
          src={proyectoActivo.imagen}
          alt={proyectoActivo.nombre}
        />
        <button className="aporte-project-arrow aporte-project-arrow-right" type="button" aria-label="Proyecto siguiente" onClick={irSiguiente}>
          <span className="aporte-project-arrow-icon aporte-project-arrow-icon-right" />
        </button>
      </div>
    </section>
  )
}

export default AporteSection
