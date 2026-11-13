import { useState } from 'react'

// En un teléfono en horizontal los pasos abiertos tapan el juego entero: ahí
// arrancan plegados, con el rótulo a la vista para abrirlos de un toque.
const BAJA = '(orientation: landscape) and (max-height: 34rem)'
const abiertoAlEntrar = () => typeof window === 'undefined' || !window.matchMedia?.(BAJA).matches

/** Los pasos de un minijuego, bajo el título. Se pueden plegar para dejarle la pantalla al juego. */
export default function ComoSeJuega({ pasos }) {
  const [abierto, setAbierto] = useState(abiertoAlEntrar)
  return (
    <details className="como-se-juega" open={abierto} onToggle={(e) => setAbierto(e.currentTarget.open)}>
      <summary>Cómo se juega</summary>
      <ol>{pasos.map((p) => <li key={p}>{p}</li>)}</ol>
    </details>
  )
}
