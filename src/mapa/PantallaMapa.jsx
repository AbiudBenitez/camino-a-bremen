import { useEffect, useRef } from 'react'
import { actual, recorrido } from '../destinos/catalogo.js'
import { PASOS_MAPA } from '../destinos/instrucciones.js'
import ComoSeJuega from '../componentes/ComoSeJuega.jsx'
import Mapa from './Mapa.jsx'
import Conceptos from './Conceptos.jsx'
import LineaEtapas from './LineaEtapas.jsx'
import { ALTURA, ESCALA, LIENZO, PUNTOS } from './trazo.js'

const angosta = () => typeof window !== 'undefined' && Boolean(window.matchMedia?.('(max-width: 52rem)').matches)

/** El mapa a pantalla completa, con una burbuja sobre la siguiente parada. */
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

  const [x, y] = PUNTOS[siguiente.id]
  const cima = y - ALTURA[siguiente.id] * ESCALA[siguiente.id] - 12

  return (
    <div className="marco-mapa">
      <div className="lienzo-mapa" ref={marco}>
        <div className="lienzo">
          <Mapa estado={estado} />
          <Conceptos estado={estado} />
          {/* La siguiente parada se señala donde está, no en un cuadro aparte que tape la isla. */}
          <a className="burbuja" href={`#destino-${siguiente.id}`}
            style={{ left: `${(x / LIENZO.ancho) * 100}%`, top: `${(cima / LIENZO.alto) * 100}%` }}>
            <span className="eyebrow">Sigue</span>
            <span className="nombre">{siguiente.nombre} →</span>
          </a>
        </div>
      </div>
      <LineaEtapas estado={estado} />
      {/* Abierto la primera vez; ya en camino, plegado para dejarle el mapa al mapa. En
          pantalla angosta va bajo el cronograma y abierto taparía la burbuja de «Sigue». */}
      <ComoSeJuega className="en-el-mapa" pasos={PASOS_MAPA} plegado={recorrido(estado, 'molino') || angosta()} />
    </div>
  )
}
