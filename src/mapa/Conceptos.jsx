import { useEffect, useRef, useState } from 'react'
import { CONCEPTOS, abierto as estaAbierto, recorrido } from '../destinos/catalogo.js'
import { cita } from '../motor/contrato.js'
import { ESCALA, LIENZO, PUNTOS, visibles } from './trazo.js'

/**
 * Los rótulos del mapa: el nombre del destino y lo que se aprende ahí, con un
 * «!» arriba a la derecha que lo explica en pocas palabras y con su fuente. Lo
 * cerrado lleva candado arriba a la izquierda. Van en HTML sobre el mapa, así
 * funcionan igual sobre el dibujo provisional que sobre la ilustración.
 *
 * Solo una explicación abierta a la vez. Lo que sigue bajo la bruma no tiene
 * rótulo: el giro no se adelanta.
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
        const k = ESCALA[d.id]
        const id = `concepto-${d.id}`
        const cerrado = !estaAbierto(estado, d.id)
        const hecho = recorrido(estado, d.id)
        // La explicación se abre hacia adentro del mapa para no salirse por un borde.
        const lado = x < LIENZO.ancho * 0.25 ? 'izq' : x > LIENZO.ancho * 0.75 ? 'der' : 'centro'
        const vertical = y > LIENZO.alto * 0.6 ? 'arriba' : 'abajo'
        return (
          <div key={d.id} className={`rotulo${hecho ? ' hecho' : ''}${cerrado ? ' cerrado' : ''}`}
            style={{ left: `${(x / LIENZO.ancho) * 100}%`, top: `${((y + 14 + 6 * k) / LIENZO.alto) * 100}%`,
              '--k': Math.min(1.15, 0.8 + 0.2 * k) }}>
            <span className="rotulo-nombre">{d.nombre}</span>
            <span className="rotulo-concepto">{c.concepto}</span>
            {cerrado && (
              <span className="rotulo-candado" title="Se abre al recorrer el destino anterior">
                <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                  <rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
                <span className="oculto-visual">Cerrado</span>
              </span>
            )}
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
