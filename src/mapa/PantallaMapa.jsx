import { useEffect, useRef } from 'react'
import { actual } from '../destinos/catalogo.js'
import Mapa from './Mapa.jsx'
import { LIENZO, PUNTOS } from './trazo.js'

/** El mapa a pantalla completa, con la siguiente parada flotando encima. */
export default function PantallaMapa({ estado }) {
  const siguiente = actual(estado)
  const marco = useRef(null)

  // En teléfono el mapa se desliza de lado: al llegar, se centra en la siguiente parada.
  useEffect(() => {
    const m = marco.current
    if (!m || m.scrollWidth <= m.clientWidth) return
    const x = (PUNTOS[siguiente.id][0] / LIENZO.ancho) * m.scrollWidth
    m.scrollLeft = x - m.clientWidth / 2
  }, [siguiente.id])

  return (
    <div className="marco-mapa">
      <div className="lienzo-mapa" ref={marco}>
        <Mapa estado={estado} />
      </div>
      <section className="siguiente">
        <p className="eyebrow">Siguiente parada</p>
        <p className="nombre">{siguiente.nombre}</p>
        <a className="como-boton primario" href={`#destino-${siguiente.id}`}>Ir →</a>
      </section>
    </div>
  )
}
