import { useEffect, useRef, useState } from 'react'
import { actual } from '../destinos/catalogo.js'
import Mapa from './Mapa.jsx'
import Banda from './Banda.jsx'
import Expediente from './Expediente.jsx'
import { IconoBanda, IconoExpediente, IconoMusica } from './iconos.jsx'
import { LIENZO, PUNTOS } from './trazo.js'

/**
 * El mapa a pantalla completa, con los controles reducidos a botones redondos
 * arriba. La banda y el expediente se abren en un panel; solo uno a la vez.
 */
export default function PantallaMapa({ estado, taller, musica }) {
  const siguiente = actual(estado)
  const [panel, setPanel] = useState(null)
  const marco = useRef(null)
  const cabecera = useRef(null)

  // En teléfono el mapa se desliza de lado: al llegar, se centra en la siguiente parada.
  useEffect(() => {
    const m = marco.current
    if (!m || m.scrollWidth <= m.clientWidth) return
    const x = (PUNTOS[siguiente.id][0] / LIENZO.ancho) * m.scrollWidth
    m.scrollLeft = x - m.clientWidth / 2
  }, [siguiente.id])

  // El panel abierto se cierra con Esc o tocando fuera.
  useEffect(() => {
    if (!panel) return
    const fuera = (e) => { if (!cabecera.current?.contains(e.target)) setPanel(null) }
    const tecla = (e) => { if (e.key === 'Escape') setPanel(null) }
    document.addEventListener('pointerdown', fuera)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('pointerdown', fuera)
      document.removeEventListener('keydown', tecla)
    }
  }, [panel])

  const alternar = (nombre) => setPanel((p) => (p === nombre ? null : nombre))
  const tituloMusica = musica.sonido ? 'Apagar la música' : 'Encender la música'

  return (
    <div className="pantalla-mapa">
      <header className="cabecera-mapa" ref={cabecera}>
        <h1>Camino a Bremen</h1>
        <nav className="botones-redondos" aria-label="Controles">
          <button type="button" className="redondo" aria-pressed={musica.sonido === true}
            aria-label={tituloMusica} title={tituloMusica} onClick={() => musica.elegir(!musica.sonido)}>
            <IconoMusica callada={!musica.sonido} />
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

      <div className="marco-mapa">
        <div className="lienzo-mapa" ref={marco}>
          <Mapa estado={estado} />
        </div>

        {musica.sonido === null && (
          <section className="pregunta-musica" aria-label="Música">
            <p>La banda suena mientras juegas, y cada animal que se suma agrega su instrumento. ¿Con música?</p>
            <div className="acciones">
              <button type="button" className="primario" onClick={() => musica.elegir(true)}>Sí, con música</button>
              <button type="button" onClick={() => musica.elegir(false)}>Sin música</button>
            </div>
          </section>
        )}

        <section className="siguiente">
          <p className="eyebrow">Siguiente parada</p>
          <p className="nombre">{siguiente.nombre}</p>
          <a className="como-boton primario" href={`#destino-${siguiente.id}`}>Ir →</a>
        </section>
      </div>
    </div>
  )
}
