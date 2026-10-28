import { banda } from '../destinos/catalogo.js'
import { ANIMAL } from './indice.js'
import Ilustracion from '../ilustraciones/Ilustracion.jsx'

const NOMBRE = { burro: 'el burro', perro: 'el perro', gato: 'el gato', gallo: 'el gallo' }

/** Solo los que ya van en el camino. Sin huecos por llenar: no es una colección. */
export default function Banda({ estado }) {
  const quienes = banda(estado)
  const lista = quienes.map((a) => NOMBRE[a])
  const texto = lista.length === 1 ? `Va ${lista[0]}, solo.`
    : `Van ${lista.slice(0, -1).join(', ')} y ${lista.at(-1)}.`

  return (
    <figure className="banda">
      <div className="banda-fila" aria-hidden="true">
        {quienes.map((a) => {
          const Animal = ANIMAL[a]
          return (
            <svg key={a} viewBox="0 0 60 50" className={`animal ${a}`}>
              <Ilustracion clave={`animal-${a}`} x={30} y={45} ancho={60}><Animal /></Ilustracion>
            </svg>
          )
        })}
      </div>
      <figcaption>{texto}</figcaption>
    </figure>
  )
}
