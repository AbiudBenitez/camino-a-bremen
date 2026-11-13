import { destino } from './catalogo.js'
import { ESCENAS } from './escenas.js'
import { ANIMAL, DIBUJO } from '../mapa/indice.js'
import Ilustracion from '../ilustraciones/Ilustracion.jsx'

/**
 * La página de libro: la lámina con el lugar, el burro a un lado y quien se
 * suma al otro, y abajo el texto. La usan las escenas y la página de cuento que
 * abre cada minijuego.
 */
export function Lamina({ id, titulo, parrafos = [], children }) {
  const d = destino(id)
  const Dibujo = DIBUJO[id]
  const Nuevo = d?.animal && d.animal !== 'burro' ? ANIMAL[d.animal] : null
  const Burro = ANIMAL.burro

  return (
    <div className="lamina">
      <svg className="escena-dibujo" viewBox="0 0 600 230" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        <rect width="600" height="230" fill="var(--cielo)" />
        <ellipse cx="300" cy="250" rx="420" ry="90" fill="var(--pasto)" />
        <ellipse cx="300" cy="262" rx="420" ry="90" fill="var(--pasto-2)" opacity="0.5" />
        {Dibujo && (
          <Ilustracion clave={`destino-${id}`} x={300} y={182} ancho={200}>
            <g transform="translate(300 130) scale(2)"><Dibujo girando /></g>
          </Ilustracion>
        )}
        <Ilustracion clave="animal-burro" x={97} y={205} ancho={114}>
          <g transform="translate(40 120) scale(1.9)"><Burro /></g>
        </Ilustracion>
        {Nuevo && (
          <Ilustracion clave={`animal-${d.animal}`} x={502} y={213} ancho={114}>
            <g transform="translate(445 128) scale(1.9)"><Nuevo /></g>
          </Ilustracion>
        )}
      </svg>
      <div className="pagina">
        <h1>{titulo ?? d?.nombre}</h1>
        {parrafos.map((p, i) => <p key={i}>{p}</p>)}
        {children}
      </div>
    </div>
  )
}

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
  const enConstruccion = d.tipo === 'juego' && d.construido === false

  const seguir = () => {
    despachar({ tipo: 'llegar', destino: id })
    window.location.hash = '#mapa'
  }

  return (
    <article className="escena">
      <a className="volver" href="#mapa">← Al mapa</a>
      <Lamina id={id} titulo={escena?.titulo} parrafos={escena?.parrafos}>
        {enConstruccion && (
          <p className="en-construccion">
            El juego de este destino se está construyendo. Puedes seguir el camino mientras tanto.
          </p>
        )}
        <button type="button" className="primario" onClick={seguir}>
          {enConstruccion ? 'Seguir el camino' : (escena?.seguir ?? 'Seguir el camino')} →
        </button>
      </Lamina>
    </article>
  )
}
