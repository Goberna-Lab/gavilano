/* Del dato al componente: `SectionInstance.type` elige qué sección se rinde y
 * `content` entra como props.
 *
 * El `switch` no es un mapa `{ tipo: Componente }` a propósito: cada sección tiene
 * su propia forma de `content`, así que el mapa obligaría a un tipo común y
 * perderíamos la comprobación de que a cada componente le llega lo que ese
 * componente pide. Acá el molde se aplica una vez por rama, al lado del componente
 * que lo consume.
 *
 * Un tipo que este tema no implementa NO se rinde y avisa por consola. Pasa cuando
 * Bravo tiene una sección que el tema todavía no conoce (otra versión del catálogo):
 * el resto de la página sale igual.
 *
 * ⚠️ El ORDEN de los imports de acá abajo es el mismo en que el sitio cargaba sus
 * hojas de estilo antes de esta fase (Hero → … → Súmate → Biografía → Experiencia →
 * Propuestas). No es estética: decide el orden de la cascada, y esta fase no mueve
 * un píxel.
 */
import { Fragment, type ReactNode } from 'react'

import Hero from './Hero'
import About from './About'
import Agenda from './Agenda'
import ImageSection from './ImageSection'
import AporteSection from './AporteSection'
import HistoriasSection from './HistoriasSection'
import PropuestasSection from './PropuestasSection'
import ArticulosSection from './ArticulosSection'
import SimulacroSection from './SimulacroSection'
import SumateSection from './SumateSection'
import BiografiaHero from './BiografiaHero'
import BiografiaTarjeta from './BiografiaTarjeta'
import {
  CLASES_FORMACION,
  CLASES_RAICES,
  CLASES_TRAYECTORIA,
} from './biografiaClases'
import BiografiaResultados from './BiografiaResultados'
import ExperienciaLineaDeTiempo from './ExperienciaLineaDeTiempo'
import PropuestasDetalle from './PropuestasDetalle'

import type {
  ContenidoArticulos,
  ContenidoBiografiaHero,
  ContenidoBiografiaResultados,
  ContenidoBiografiaTarjeta,
  ContenidoConoceme,
  ContenidoExperienciaDestacada,
  ContenidoExperienciaLineaDeTiempo,
  ContenidoHero,
  ContenidoHistorias,
  ContenidoMiAporte,
  ContenidoPropuestasDetalle,
  ContenidoPropuestasIntro,
  ContenidoSimulacro,
  ContenidoSumate,
  ContenidoUnaVidaDeServicio,
} from '../lib/contenido'
import { moldeDelCatalogo as como } from '../lib/contenido'
import { tituloDeTipo } from '../lib/catalogo'
import type { SectionInstance } from '../lib/manifest'

function renderizarSeccion(seccion: SectionInstance): ReactNode {
  const { type, anchor, content } = seccion

  switch (type) {
    case 'hero':
      return <Hero content={como<ContenidoHero>(content)} anchor={anchor} />
    case 'conoceme':
      return <About content={como<ContenidoConoceme>(content)} anchor={anchor} />
    case 'una-vida-de-servicio':
      return <Agenda content={como<ContenidoUnaVidaDeServicio>(content)} anchor={anchor} />
    case 'experiencia-destacada':
      return <ImageSection content={como<ContenidoExperienciaDestacada>(content)} anchor={anchor} />
    case 'mi-aporte':
      return <AporteSection content={como<ContenidoMiAporte>(content)} anchor={anchor} />
    case 'mi-aporte-pagina':
      /* Misma sección, con la maquetación de página completa. La clase es del
         diseño, así que no viaja como contenido: la elige el tipo. */
      return (
        <AporteSection
          content={como<ContenidoMiAporte>(content)}
          anchor={anchor}
          className="aporte-section-page"
        />
      )
    case 'historias':
      return <HistoriasSection content={como<ContenidoHistorias>(content)} anchor={anchor} />
    case 'propuestas-intro':
      return <PropuestasSection content={como<ContenidoPropuestasIntro>(content)} anchor={anchor} />
    case 'articulos':
      return <ArticulosSection content={como<ContenidoArticulos>(content)} anchor={anchor} />
    case 'simulacro':
      return <SimulacroSection content={como<ContenidoSimulacro>(content)} anchor={anchor} />
    case 'sumate':
      return <SumateSection content={como<ContenidoSumate>(content)} anchor={anchor} />
    case 'biografia-hero':
      return <BiografiaHero content={como<ContenidoBiografiaHero>(content)} anchor={anchor} />
    case 'biografia-raices':
      return (
        <BiografiaTarjeta
          content={como<ContenidoBiografiaTarjeta>(content)}
          anchor={anchor}
          clases={CLASES_RAICES}
          saltoTrasDestacado
        />
      )
    case 'biografia-formacion':
      return (
        <BiografiaTarjeta
          content={como<ContenidoBiografiaTarjeta>(content)}
          anchor={anchor}
          clases={CLASES_FORMACION}
        />
      )
    case 'biografia-trayectoria':
      return (
        <BiografiaTarjeta
          content={como<ContenidoBiografiaTarjeta>(content)}
          anchor={anchor}
          clases={CLASES_TRAYECTORIA}
        />
      )
    case 'biografia-resultados':
      return (
        <BiografiaResultados content={como<ContenidoBiografiaResultados>(content)} anchor={anchor} />
      )
    case 'experiencia-linea-de-tiempo':
      return (
        <ExperienciaLineaDeTiempo
          content={como<ContenidoExperienciaLineaDeTiempo>(content)}
          anchor={anchor}
        />
      )
    case 'propuestas-detalle':
      return (
        <PropuestasDetalle content={como<ContenidoPropuestasDetalle>(content)} anchor={anchor} />
      )
    default:
      console.warn(
        `[secciones] el tema no implementa el tipo '${tituloDeTipo(type)}' (sección ${seccion.id}): no se rinde. ` +
          'Los tipos que sí conoce están en src/lib/catalogo.ts.',
      )
      return null
  }
}

/* Fragment y no un elemento envolvente: el ancla tiene que caer en el <section>
   propio de cada componente, o el desfase del scroll bajo la cabecera pegajosa
   cambia y los enlaces del menú dejan de aterrizar donde aterrizaban (P10). */
export function SectionRenderer({ sections }: { sections: SectionInstance[] }) {
  return sections.map((seccion) => (
    <Fragment key={seccion.id}>{renderizarSeccion(seccion)}</Fragment>
  ))
}
