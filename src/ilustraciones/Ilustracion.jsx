import { colocar, ruta } from './catalogo.js'

/**
 * Dentro de un SVG: la ilustración hecha a mano si ya llegó, y si no, el dibujo
 * provisional que se le pase como hijo. (x, y) es el punto de apoyo y `ancho`
 * el ancho que ocupa la ilustración completa.
 */
export default function Ilustracion({ clave, x = 0, y = 0, ancho, children }) {
  const src = ruta(clave)
  if (!src) return children
  return <image href={src} {...colocar(clave, x, y, ancho)} preserveAspectRatio="xMidYMid meet" />
}
