import { useEffect, useRef, useState } from 'react'
import Banda from './Banda.jsx'
import Expediente from './Expediente.jsx'
import { IconoBanda, IconoExpediente, IconoMusica } from './iconos.jsx'

/**
 * La cabecera de todas las pantallas: el título lleva al mapa y los botones
 * redondos quedan siempre en el mismo lugar. La banda y el expediente se abren
 * en un panel; solo uno a la vez.
 *
 * La música arranca apagada y solo suena si el estudiante la enciende aquí:
 * nunca sin permiso.
 */
export default function Cabecera({ estado, taller, musica }) {
  const [panel, setPanel] = useState(null)
  const caja = useRef(null)

  // El panel abierto se cierra con Esc o tocando fuera.
  useEffect(() => {
    if (!panel) return
    const fuera = (e) => { if (!caja.current?.contains(e.target)) setPanel(null) }
    const tecla = (e) => { if (e.key === 'Escape') setPanel(null) }
    document.addEventListener('pointerdown', fuera)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('pointerdown', fuera)
      document.removeEventListener('keydown', tecla)
    }
  }, [panel])

  const alternar = (nombre) => setPanel((p) => (p === nombre ? null : nombre))
  const suena = musica.sonido === true
  const tituloMusica = suena ? 'Apagar la música' : 'Encender la música'

  return (
    <header className="cabecera" ref={caja}>
      <a className="marca" href="#mapa">Camino a Bremen</a>
      <nav className="botones-redondos" aria-label="Controles">
        <button type="button" className="redondo" aria-pressed={suena}
          aria-label={tituloMusica} title={tituloMusica} onClick={() => musica.elegir(!suena)}>
          <IconoMusica callada={!suena} />
        </button>
        <button type="button" className="redondo" aria-expanded={panel === 'banda'}
          aria-controls="panel-banda" aria-label="La banda" title="La banda" onClick={() => alternar('banda')}>
          <IconoBanda />
        </button>
        <button type="button" className="redondo" aria-expanded={panel === 'expediente'}
          aria-controls="panel-expediente" aria-label="Tu expediente" title="Tu expediente"
          onClick={() => alternar('expediente')}>
          <IconoExpediente />
        </button>
      </nav>
      {panel === 'banda' && (
        <div className="panel-flotante" id="panel-banda"><Banda estado={estado} /></div>
      )}
      {panel === 'expediente' && (
        <div className="panel-flotante" id="panel-expediente"><Expediente taller={taller} /></div>
      )}
    </header>
  )
}
