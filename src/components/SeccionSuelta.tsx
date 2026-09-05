import { SectionRenderer } from './SectionRenderer'
import { primeraSeccionDeTipo } from '../lib/paginas'

/**
 * Una sección editable dibujada FUERA de una página de Bravo.
 *
 * `/articulos` y `/articulos/<slug>` son rutas del código —las dibuja la lista de
 * notas, que ya funcionaba— pero las dos terminan con el formulario de «Súmate»,
 * que sí es contenido editable. Esto lo toma de donde el cliente lo edita (la
 * portada) en vez de tener una copia horneada en el código: si hubiera dos, el
 * cliente cambiaría el del panel y el de sus notas seguiría diciendo lo de antes.
 *
 * Pasa por el mismo `SectionRenderer` que las páginas, así que hay un solo lugar
 * donde un `type` se convierte en un componente. Si la sección no existe en el
 * contenido, no se dibuja nada: la nota se lee igual.
 */
export function SeccionSuelta({ tipo }: { tipo: string }) {
  const seccion = primeraSeccionDeTipo(tipo)
  return seccion ? <SectionRenderer sections={[seccion]} /> : null
}
