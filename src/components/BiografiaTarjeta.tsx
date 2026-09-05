import '../pages/BiografiaPage.css'
import type { ClasesTarjeta } from './biografiaClases'
import type { ContenidoBiografiaTarjeta, PropsSeccion } from '../lib/contenido'

/* Las tres tarjetas comparten la maquetación pero NO las clases: cada una tiene su
   propio prefijo en `BiografiaPage.css`, con sus medidas. Los nombres están en
   `biografiaClases.ts`. */
interface Props extends PropsSeccion<ContenidoBiografiaTarjeta> {
  clases: ClasesTarjeta
  /** La primera tarjeta baja de renglón después de la frase en negrita. */
  saltoTrasDestacado?: boolean
}

function BiografiaTarjeta({ content, anchor, clases, saltoTrasDestacado = false }: Props) {
  return (
    <section className={clases.card} aria-labelledby={clases.titleId} id={anchor}>
      <div className={clases.copy}>
        <img className={clases.icon} src={content.icono} alt="" />
        <h2 className={clases.title} id={clases.titleId}>
          <span>{content.tituloLinea1}</span>
          <span>{content.tituloLinea2}</span>
        </h2>
        <p className={clases.text}>
          <strong>{content.textoDestacado}</strong>
          {saltoTrasDestacado ? <br /> : null}
          {/* El espacio arranca el MISMO nodo de texto que el resto, como en el
              original: partirlo en {' '}{texto} crearía dos nodos (P7b). */}
          {` ${content.texto}`}
        </p>
      </div>
      <img className={clases.image} src={content.imagen} alt={content.imagenAlt} loading="lazy" />
    </section>
  )
}

export default BiografiaTarjeta
