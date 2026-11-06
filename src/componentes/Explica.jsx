import { useEffect, useId, useRef, useState } from 'react'
import { cita } from '../motor/contrato.js'

/**
 * El «!» de las pantallas: abre una explicación breve con su fuente, igual que
 * en el mapa. Va dentro de las ranuras, así que no deja pasar el clic: abrir
 * una explicación nunca coloca una tarjeta.
 */
export default function Explica({ titulo, fuente, children, className = '' }) {
  const [abierto, setAbierto] = useState(false)
  const caja = useRef(null)
  const id = useId()

  useEffect(() => {
    if (!abierto) return
    const fuera = (e) => { if (!caja.current?.contains(e.target)) setAbierto(false) }
    const tecla = (e) => { if (e.key === 'Escape') setAbierto(false) }
    document.addEventListener('pointerdown', fuera, true)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('pointerdown', fuera, true)
      document.removeEventListener('keydown', tecla)
    }
  }, [abierto])

  const alto = (e) => e.stopPropagation()

  return (
    <span className={`explica ${className}`} ref={caja} onClick={alto} onPointerDown={alto}>
      <button type="button" className="explica-boton" aria-expanded={abierto} aria-controls={id}
        aria-label={`Qué es ${titulo}`} title={`Qué es ${titulo}`} onClick={() => setAbierto((a) => !a)}>!</button>
      {abierto && (
        <span id={id} role="note" aria-label={titulo} className="explica-tarjeta">
          <strong>{titulo}</strong>
          <span className="explica-texto">{children}</span>
          <span className="fuente">{cita(fuente)}</span>
        </span>
      )}
    </span>
  )
}
