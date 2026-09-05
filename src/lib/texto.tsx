import { Fragment } from 'react'

/* Un campo de texto donde el diseño parte renglones a mano.
 *
 * El salto viaja como "\n" dentro del valor —un carácter, no marcado— y se dibuja
 * como `<br />`. Guardar "<br>" en el campo sería meter HTML en el contenido: el
 * panel lo mostraría crudo en su caja de texto y quien edite tendría que saber
 * marcado.
 *
 * ⚠️ Las dos banderas de abajo existen porque JSX **descarta** el espacio en blanco
 * que rodea un salto de línea del código fuente, así que el original escribía a mano
 * el espacio que quería conservar (`nuestras calles,{' '}`). Reproducirlo importa: la
 * cantidad de nodos de texto y dónde cae cada espacio mueven el antialiasing del
 * último glifo del renglón. En Barrionuevo eso fueron 108 píxeles distintos a 430 px
 * de ancho, invisibles a ojo y detectados sólo por la comparación píxel a píxel (P7b).
 */
interface RenglonesProps {
  texto: string
  /** Clase del `<br />`: algunos saltos sólo existen en un punto de ruptura. */
  claseSalto?: string
  /** Un espacio suelto ANTES de cada `<br />`, como nodo aparte. */
  espacioAntesDelSalto?: boolean
  /**
   * Un espacio al principio del primer renglón, DENTRO del mismo nodo de texto.
   * Es para cuando el renglón sigue a un `<strong>` en el mismo párrafo: el
   * original tenía un solo nodo de texto con el espacio adentro, y escribirlo
   * como `{' '}{texto}` crearía dos.
   */
  espacioInicial?: boolean
}

export function Renglones({
  texto,
  claseSalto,
  espacioAntesDelSalto = false,
  espacioInicial = false,
}: RenglonesProps) {
  return texto.split('\n').map((linea, i) => (
    <Fragment key={i}>
      {i > 0 && (
        <>
          {espacioAntesDelSalto ? ' ' : null}
          <br className={claseSalto} />
        </>
      )}
      {i === 0 && espacioInicial ? ` ${linea}` : linea}
    </Fragment>
  ))
}
