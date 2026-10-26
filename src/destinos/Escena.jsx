import { destino } from './catalogo.js'
import { ESCENAS } from './escenas.js'
import { DIBUJO } from '../mapa/indice.js'

/**
 * Un tramo de cuento entre minijuegos. Llegar es leer y seguir: no hay nada que
 * contestar, porque aquí el ejercicio es el camino.
 *
 * Un minijuego que todavía no se construye se muestra con su escena y lo dice;
 * se puede seguir para que el mapa se recorra completo mientras se construye.
 */
export default function Escena({ id, despachar }) {
  const d = destino(id)
  const escena = ESCENAS[id]
  const Dibujo = DIBUJO[id]
  const enConstruccion = d.tipo === 'juego' && d.construido === false

  const seguir = () => {
    despachar({ tipo: 'llegar', destino: id })
    window.location.hash = '#mapa'
  }

  return (
    <article className="escena">
      <a className="volver" href="#mapa">← Al mapa</a>
      <svg className="escena-dibujo" viewBox="-60 -50 120 110" aria-hidden="true"><Dibujo girando /></svg>
      <h1>{escena?.titulo ?? d.nombre}</h1>
      {escena?.parrafos.map((p, i) => <p key={i}>{p}</p>)}
      {enConstruccion && (
        <p className="en-construccion">
          El juego de este destino se está construyendo. Puedes seguir el camino mientras tanto.
        </p>
      )}
      <button type="button" className="primario" onClick={seguir}>
        {enConstruccion ? 'Seguir el camino' : (escena?.seguir ?? 'Seguir el camino')} →
      </button>
    </article>
  )
}
