import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './SimulacroSection.css'
import { asset } from '../utils/asset'
import {
  columnas,
  CEDULA_TITULO,
  FILA_CORRECTA,
  INSTRUCCION_COLUMNA,
} from '../data/cedula'
import type { ContenidoSimulacro, PropsSeccion } from '../lib/contenido'

type Resultado = 'exito' | 'fallo'

/** Mismo corte que mobile.css: abajo de esto la cédula es un carrusel. */
const CONSULTA_MOVIL = '(max-width: 1024px)'

/** Espera antes del auto-avance: da tiempo a ver caer el aspa en la casilla. */
const RETARDO_AVANCE = 350

/** Aspa ✗ que el usuario "dibuja" dentro del recuadro, como en la cédula real. */
function Aspa() {
  return (
    <svg className="simulacro-aspa" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M5 5 L19 19 M19 5 L5 19"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** En desktop las 4 columnas van lado a lado; el carrusel es solo de móvil. */
function useEsMovil() {
  const [esMovil, setEsMovil] = useState(false)

  useEffect(() => {
    const consulta = window.matchMedia(CONSULTA_MOVIL)
    const actualizar = () => setEsMovil(consulta.matches)
    actualizar()
    consulta.addEventListener('change', actualizar)
    return () => consulta.removeEventListener('change', actualizar)
  }, [])

  return esMovil
}

function comportamientoScroll(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

function SimulacroSection({ content, anchor }: PropsSeccion<ContenidoSimulacro>) {
  const [marcas, setMarcas] = useState<Record<string, string>>({})
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [columnaActiva, setColumnaActiva] = useState(0)

  const esMovil = useEsMovil()
  const navRef = useRef<HTMLElement>(null)
  const carruselRef = useRef<HTMLDivElement>(null)
  const columnaRefs = useRef<(HTMLFieldSetElement | null)[]>([])
  const accionesRef = useRef<HTMLDivElement>(null)
  const temporizador = useRef<number | null>(null)
  // De dónde vino ESTA interacción. El auto-avance existe para ahorrarle
  // scroll al pulgar; con teclado solo alejaría el viewport del foco (WCAG
  // 3.2.2 On Input), y para eso ya está "Siguiente". No sirve mirar el
  // hardware con matchMedia('(pointer: coarse)'): hay híbridos con pantalla
  // táctil y teclado, lo que importa es el evento.
  const vinoDePuntero = useRef(false)

  const marcadas = columnas.filter((columna) => marcas[columna.id]).length
  const completo = marcadas === columnas.length

  useEffect(
    () => () => {
      if (temporizador.current !== null) window.clearTimeout(temporizador.current)
    },
    [],
  )

  function cancelarAvance() {
    if (temporizador.current !== null) {
      window.clearTimeout(temporizador.current)
      temporizador.current = null
    }
  }

  /** Mueve solo el scroll del carrusel; el foco únicamente si se pide. */
  function irAColumna(indice: number, mueveFoco = false) {
    setColumnaActiva(indice)

    const carrusel = carruselRef.current
    if (!carrusel) return

    carrusel.scrollTo({ left: carrusel.clientWidth * indice, behavior: comportamientoScroll() })

    if (mueveFoco) {
      // preventScroll: el scroll lo manejamos nosotros, que el foco no lo pise.
      columnaRefs.current[indice]?.focus({ preventScroll: true })
    }
  }

  /** Deja ver el aspa recién puesta antes de mover nada. */
  function programarTrasVerLaMarca(accion: () => void) {
    cancelarAvance()
    temporizador.current = window.setTimeout(() => {
      temporizador.current = null
      accion()
    }, RETARDO_AVANCE)
  }

  /** Móvil: pasa a la columna siguiente del carrusel. */
  function avanzarDeColumna(indice: number) {
    irAColumna(indice + 1)
    // La columna nueva entra a la misma altura de scroll que la anterior: sin
    // esto el usuario aterriza a mitad de la tabla. Subimos hasta la navegación
    // (no hasta el carrusel) para que el rótulo "Columna N de 4" y los puntos
    // queden a la vista junto con la cabecera de la columna.
    const anclaArriba = navRef.current ?? carruselRef.current
    anclaArriba?.scrollIntoView({ behavior: comportamientoScroll(), block: 'start' })
  }

  /** Con las 4 columnas marcadas, el bloque de acciones está arriba de la
   *  cédula: hay que subir hasta él o el usuario no ve el botón ni el
   *  resultado. Vale para desktop y para móvil. */
  function revelarAcciones() {
    accionesRef.current?.scrollIntoView({ behavior: comportamientoScroll(), block: 'center' })
  }

  /** El usuario deslizó con el dedo: sincronizamos el rótulo y los puntos. */
  function alDeslizar() {
    const carrusel = carruselRef.current
    if (!carrusel || carrusel.clientWidth === 0) return

    const indice = Math.round(carrusel.scrollLeft / carrusel.clientWidth)
    if (indice !== columnaActiva && indice >= 0 && indice < columnas.length) {
      setColumnaActiva(indice)
    }
  }

  function marcar(columnaId: string, filaId: string, indice: number) {
    // Si la columna ya tenía marca, el usuario está corrigiendo: no lo
    // catapultamos hacia adelante otra vez.
    const esPrimeraMarca = !marcas[columnaId]
    const marcasNuevas = { ...marcas, [columnaId]: filaId }

    setMarcas(marcasNuevas)
    setResultado(null)

    const desdePuntero = vinoDePuntero.current
    vinoDePuntero.current = false
    if (!desdePuntero || !esPrimeraMarca) return

    if (columnas.every((columna) => marcasNuevas[columna.id])) {
      programarTrasVerLaMarca(revelarAcciones)
    } else if (esMovil && indice < columnas.length - 1) {
      programarTrasVerLaMarca(() => avanzarDeColumna(indice))
    }
  }

  function verificar() {
    cancelarAvance()
    const acierta = columnas.every((columna) => marcas[columna.id] === FILA_CORRECTA)
    setResultado(acierta ? 'exito' : 'fallo')
  }

  function reiniciar() {
    cancelarAvance()
    setMarcas({})
    setResultado(null)
    irAColumna(0)
  }

  return (
    <section className="simulacro-section" id={anchor}>
      <div className="simulacro-inner">
        <p className="simulacro-heading">{content.encabezado}</p>

        <div className="simulacro-title-block">
          <p className="simulacro-title-line">{content.tituloLinea}</p>
          <p className="simulacro-title-italic">{content.tituloItalica}</p>
        </div>

        <p className="simulacro-intro">{content.intro}</p>

        <div className="simulacro-acciones" ref={accionesRef}>
          <p className="simulacro-progreso">
            Marcaste <strong>{marcadas}</strong> de {columnas.length} columnas
          </p>

          <div className="simulacro-botones">
            <button
              type="button"
              className="simulacro-boton"
              onClick={verificar}
              disabled={!completo}
            >
              Verificar mi voto
            </button>
            {marcadas > 0 ? (
              <button
                type="button"
                className="simulacro-boton simulacro-boton-secundario"
                onClick={reiniciar}
              >
                {resultado === 'exito' ? 'Jugar de nuevo' : 'Reiniciar'}
              </button>
            ) : null}
          </div>

          <div className="simulacro-resultado" role="status" aria-live="polite">
            {resultado === 'exito' ? (
              <p className="simulacro-resultado-exito">
                ¡Objetivo cumplido!{' '}
                <a className="simulacro-resultado-cta" href="#sumate">
                  Ahora sumate a la campaña
                </a>
              </p>
            ) : null}
            {resultado === 'fallo' ? (
              <p className="simulacro-resultado-fallo">¡Fallaste! Inténtalo de nuevo</p>
            ) : null}
          </div>
        </div>

        <div className="simulacro-cedula">
          <p className="simulacro-cedula-titulo">{CEDULA_TITULO}</p>
          <p className="simulacro-cedula-aviso">CÉDULA NO OFICIAL</p>

          {esMovil ? (
            <nav
              className="simulacro-nav"
              aria-label="Navegación entre columnas de la cédula"
              ref={navRef}
            >
              <p className="simulacro-nav-rotulo" aria-live="polite">
                Columna {columnaActiva + 1} de {columnas.length} ·{' '}
                <span className="simulacro-nav-rotulo-titulo">{columnas[columnaActiva].titulo}</span>
              </p>

              <div className="simulacro-nav-controles">
                <button
                  type="button"
                  className="simulacro-nav-flecha"
                  onClick={() => irAColumna(columnaActiva - 1, true)}
                  disabled={columnaActiva === 0}
                >
                  Anterior
                </button>

                <ol className="simulacro-nav-puntos">
                  {columnas.map((columna, indice) => (
                    <li key={columna.id}>
                      <button
                        type="button"
                        className={`simulacro-nav-punto${
                          marcas[columna.id] ? ' simulacro-nav-punto-marcado' : ''
                        }`}
                        aria-current={indice === columnaActiva ? 'true' : undefined}
                        aria-label={`Ir a la columna ${indice + 1}, ${columna.titulo}${
                          marcas[columna.id] ? ' (ya marcada)' : ' (sin marcar)'
                        }`}
                        onClick={() => irAColumna(indice, true)}
                      />
                    </li>
                  ))}
                </ol>

                <button
                  type="button"
                  className="simulacro-nav-flecha"
                  onClick={() => irAColumna(columnaActiva + 1, true)}
                  disabled={columnaActiva === columnas.length - 1}
                >
                  Siguiente
                </button>
              </div>
            </nav>
          ) : null}

          <div className="simulacro-columnas" ref={carruselRef} onScroll={esMovil ? alDeslizar : undefined}>
            {columnas.map((columna, indice) => (
              <fieldset
                key={columna.id}
                className="simulacro-columna"
                style={{ '--columna-color': columna.color } as CSSProperties}
                ref={(nodo) => {
                  columnaRefs.current[indice] = nodo
                }}
                tabIndex={-1}
                onKeyDown={() => {
                  vinoDePuntero.current = false
                }}
              >
                <legend className="simulacro-columna-legend">
                  <span className="simulacro-columna-titulo">{columna.titulo}</span>
                  {columna.subtitulo ? (
                    <span className="simulacro-columna-subtitulo">{columna.subtitulo}</span>
                  ) : null}
                </legend>

                <p className="simulacro-columna-instruccion">{INSTRUCCION_COLUMNA}</p>

                <div className="simulacro-filas">
                  {columna.filas.map((fila) => {
                    const marcada = marcas[columna.id] === fila.id
                    return (
                      <label
                        key={fila.id}
                        className={`simulacro-fila${marcada ? ' simulacro-fila-marcada' : ''}`}
                        onPointerDown={() => {
                          vinoDePuntero.current = true
                        }}
                      >
                        <input
                          type="radio"
                          className="simulacro-radio"
                          name={`simulacro-${columna.id}`}
                          value={fila.id}
                          checked={marcada}
                          onChange={() => marcar(columna.id, fila.id, indice)}
                          aria-label={fila.nombre ?? 'Fila sin organización política'}
                        />
                        <span className="simulacro-fila-nombre">{fila.nombre}</span>
                        <span className="simulacro-recuadro">
                          {/* alt vacío a propósito: el nombre del partido ya lo anuncia el
                              aria-label de la fila, repetirlo lo haría sonar dos veces. */}
                          {fila.logo ? (
                            <img
                              className="simulacro-logo"
                              src={asset(`cedula/${fila.logo}`)}
                              alt=""
                              width={44}
                              height={44}
                              loading="lazy"
                              decoding="async"
                            />
                          ) : null}
                          {marcada ? <Aspa /> : null}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <p className="simulacro-cedula-pie">Material didáctico, fuente: ONPE</p>
        </div>
      </div>
    </section>
  )
}

export default SimulacroSection
