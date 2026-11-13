import { useState } from 'react'

// En un teléfono en horizontal los pasos abiertos tapan el juego entero: ahí
// arrancan plegados, con el rótulo a la vista para abrirlos de un toque.
const BAJA = '(orientation: landscape) and (max-height: 34rem)'
const abiertoAlEntrar = () => typeof window === 'undefined' || !window.matchMedia?.(BAJA).matches

/**
 * Los pasos de un minijuego, bajo el título. Se pueden plegar para dejarle la
 * pantalla al juego. `plegado` lo hace arrancar cerrado en cualquier pantalla.
 */
export default function ComoSeJuega({ pasos, plegado = false, className = '' }) {
  const [abierto, setAbierto] = useState(() => !plegado && abiertoAlEntrar())
  return (
    <details className={`como-se-juega ${className}`.trim()} open={abierto} onToggle={(e) => setAbierto(e.currentTarget.open)}>
      <summary>Cómo se juega</summary>
      <ol>{pasos.map((p) => <li key={p}>{p}</li>)}</ol>
    </details>
  )
}
