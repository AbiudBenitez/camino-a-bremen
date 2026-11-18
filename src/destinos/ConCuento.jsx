import { useEffect, useRef, useState } from 'react'
import { CUENTOS } from './escenas.js'
import { Lamina } from './Escena.jsx'

/**
 * Cada minijuego abre con su página de libro, cada vez que se entra: primero el
 * cuento, y al pasar la hoja, la dinámica. App la monta con `key` por destino,
 * así que salir al mapa y volver la muestra de nuevo.
 */
export default function ConCuento({ id, children }) {
  const [leido, setLeido] = useState(false)
  const juego = useRef(null)

  // Al pasar la hoja, el foco va al título del juego: el lector de pantalla
  // anuncia dónde está y el teclado no se queda en un botón que ya no existe.
  useEffect(() => {
    if (!leido) return
    const titulo = juego.current?.querySelector('h1')
    if (!titulo) return
    titulo.setAttribute('tabindex', '-1')
    titulo.focus()
  }, [leido])

  const cuento = CUENTOS[id]
  if (!cuento || leido) return <div ref={juego}>{children}</div>

  return (
    <article className="escena">
      <a className="volver" href="#mapa">← Al mapa</a>
      <Lamina id={id} titulo={cuento.titulo} parrafos={cuento.parrafos}>
        <button type="button" className="primario" onClick={() => setLeido(true)}>Empezar →</button>
      </Lamina>
    </article>
  )
}
