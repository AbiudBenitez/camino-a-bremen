import { useEffect, useRef, useState } from 'react'
import { CONCEPTOS } from '../destinos/catalogo.js'
import { cita } from '../motor/contrato.js'
import { LIENZO, PUNTOS, visibles } from './trazo.js'

/**
 * Un botón «!» junto a cada destino visible: en pocas palabras, qué es lo que
 * se aprende ahí y de dónde sale. Solo uno abierto a la vez. Lo que sigue bajo
 * las nubes no tiene botón: el giro no se adelanta.
 */
export default function Conceptos({ estado }) {
  const [abierto, setAbierto] = useState(null)
  const caja = useRef(null)

  useEffect(() => {
    if (!abierto) return
    const fuera = (e) => { if (!caja.current?.contains(e.target)) setAbierto(null) }
    const tecla = (e) => { if (e.key === 'Escape') setAbierto(null) }
    document.addEventListener('pointerdown', fuera)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('pointerdown', fuera)
      document.removeEventListener('keydown', tecla)
    }
  }, [abierto])

  return (
    <div ref={caja}>
      {visibles(estado).map((d) => {
        const c = CONCEPTOS[d.id]
        if (!c) return null
        const [x, y] = PUNTOS[d.id]
        const id = `concepto-${d.id}`
        // La explicación se abre hacia adentro del mapa para no salirse por un borde.
        const lado = x < LIENZO.ancho * 0.25 ? 'izq' : x > LIENZO.ancho * 0.75 ? 'der' : 'centro'
        const vertical = y > LIENZO.alto / 2 ? 'arriba' : 'abajo'
        return (
          <div key={d.id} className="concepto-ancla"
            style={{ left: `${((x - 78) / LIENZO.ancho) * 100}%`, top: `${((y - 40) / LIENZO.alto) * 100}%` }}>
            <button type="button" className="concepto-boton" aria-expanded={abierto === d.id}
              aria-controls={id} aria-label={`Qué es ${c.concepto}`} title={`Qué es ${c.concepto}`}
              onClick={() => setAbierto((a) => (a === d.id ? null : d.id))}>!</button>
            {abierto === d.id && (
              <section id={id} className={`concepto-tarjeta ${lado} ${vertical}`} aria-label={c.concepto}>
                <p className="concepto-metodo">{d.metodo}</p>
                <h2>{c.concepto}</h2>
                <p>{c.explicacion}</p>
                <p className="fuente">{cita(c.fuente)}</p>
              </section>
            )}
          </div>
        )
      })}
    </div>
  )
}
