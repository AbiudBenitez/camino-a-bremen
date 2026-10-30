import { useCallback, useEffect, useState } from 'react'
import { MESA, colocar, enMesa, normalizar } from '../../arrastre/colocacion.js'
import { Mesa, Pieza, Ranura } from '../../arrastre/Mesa.jsx'
import { evaluar } from '../../motor/motor.js'
import { cita, fuente } from '../../motor/contrato.js'
import { CUPO_PILA, HISTORIAS, LO_QUE_IMPORTA, PILA, historia } from '../../motor/reglas/casa.js'
import { DECIDIDO, TARJETAS, tarjeta } from '../../motor/reglas/molino.js'
import { borrador, entregado } from '../../estado/taller.js'
import { recorrido } from '../catalogo.js'
import { enmudecer } from '../../sonido/musica.js'
import Hallazgos from '../../componentes/Hallazgos.jsx'
import Ilustracion from '../../ilustraciones/Ilustracion.jsx'
import { ANIMAL } from '../../mapa/indice.js'
import './casa.css'

const PESO = 320
const EMPIRISMO = fuente('Guía de Scrum', 'Teoría de Scrum: empirismo')
const PIRAMIDE = ['gallo', 'gato', 'perro', 'burro']

/** El hatillo tal como salió del molino. Si no hay uno entregado, el del burro, y se dice. */
function hatilloDelMolino(estado) {
  const col = normalizar(entregado(estado, 'molino')?.colocaciones)
  const propio = (col.dentro?.length ?? 0) + (col.fuera?.length ?? 0) > 0
  const lista = (lugar) => (propio ? col[lugar] ?? [] : TARJETAS.filter((t) => t.va === lugar).map((t) => t.id))
  return { propio, dentro: lista('dentro'), fuera: lista('fuera') }
}

/**
 * La casa de los ladrones. Primero el giro: el hatillo del estudiante no tiene
 * lugar para la casa, ni dentro ni fuera del alcance, y la música se apaga.
 * Luego el backlog de esa noche: el burro dice qué importa, el estudiante apila
 * historias por valor y escribe una propia. Si el orden es bueno, los ladrones
 * huyen. No se puede perder: se corrige y se vuelve a cantar.
 */
export default function Casa({ estado, despachar }) {
  const [momento, setMomento] = useState(() => (recorrido(estado, 'casa') ? 'backlog' : 'giro'))

  useEffect(() => {
    enmudecer(momento !== 'listo')
    return () => enmudecer(false)
  }, [momento])

  return (
    <article className="casa">
      <div className="casa-titulo">
        <a className="volver" href="#mapa">← Al mapa</a>
        <h1>La casa de los ladrones</h1>
      </div>
      {momento === 'giro' && <Giro estado={estado} onSeguir={() => setMomento('backlog')} />}
      {momento === 'backlog' && <Backlog estado={estado} despachar={despachar} onListo={() => setMomento('listo')} />}
      {momento === 'listo' && <Listo estado={estado} />}
    </article>
  )
}

function Giro({ estado, onSeguir }) {
  const hatillo = hatilloDelMolino(estado)
  return (
    <section className="giro" aria-labelledby="giro-titulo">
      <p className="giro-entrada">
        Desde la punta del árbol, el gallo vio una luz. Es una casa, y adentro hay ladrones comiendo.
      </p>
      <div className="hatillo-viejo">
        <p className="ranura-etiqueta">{hatillo.propio ? 'Tu hatillo, tal como salió del molino' : 'El hatillo del burro'}</p>
        <div className="hatillo-columnas">
          <div><h2>Dentro del alcance</h2><ul>{hatillo.dentro.map((id) => <li key={id}>{tarjeta(id)?.texto}</li>)}</ul></div>
          <div><h2>Fuera del alcance</h2><ul>{hatillo.fuera.map((id) => <li key={id}>{tarjeta(id)?.texto}</li>)}</ul></div>
        </div>
        <p className="tarjeta-intrusa" aria-hidden="true">La casa de los ladrones</p>
      </div>
      <div className="giro-golpe">
        <h2 id="giro-titulo">No cabe en ningún lado.</h2>
        <p>
          La casa de los ladrones no está en tu hatillo: ni dentro ni fuera del alcance. Nadie la
          previó. El enfoque decía: <q>{DECIDIDO.enfoque}</q>
        </p>
        <p>
          Con lo que se sabía en el molino, el plan tenía sentido. Desde aquí ya no hay plan de doce
          días: hay que decidir qué hacer esta noche, con lo que se ve.
        </p>
        <p className="fuente">{cita(EMPIRISMO)}</p>
        <button type="button" className="primario" onClick={onSeguir}>Decidir qué hacer esta noche →</button>
      </div>
    </section>
  )
}

function Backlog({ estado, despachar, onListo }) {
  const datos = borrador(estado, 'casa')
  const col = normalizar(datos.colocaciones)
  const pila = col[PILA] ?? []
  const propia = datos.propia && typeof datos.propia === 'object' ? datos.propia : {}
  const fuera = hatilloDelMolino(estado).fuera
  const [nota, setNota] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [leyendo, setLeyendo] = useState(false)

  const escribir = useCallback((campo, valor) => {
    despachar({ tipo: 'escribir', artefacto: 'casa', campo, valor })
  }, [despachar])

  const alColocar = (pieza, ranura, indice) => {
    const nuevas = colocar(col, pieza, ranura, { indice, cupo: ranura === PILA ? CUPO_PILA : undefined })
    const error = evaluar('casa', { ...datos, colocaciones: nuevas }).hallazgos
      .find((h) => h.regla === 'casa.solo-valor' && h.campo === pieza)
    if (error) { setNota({ pieza, mensaje: error.mensaje, fuente: error.fuente }); return }
    setNota(null)
    setResultado(null)
    escribir('colocaciones', nuevas)
  }

  const cantar = () => {
    setLeyendo(true)
    setResultado(null)
    const r = evaluar('casa', datos)
    setTimeout(() => {
      setLeyendo(false)
      despachar({ tipo: 'entregar', artefacto: 'casa', resumen: r.resumen })
      if (r.resumen.pasa) {
        despachar({ tipo: 'llegar', destino: 'casa' })
        onListo()
      } else {
        setResultado(r)
      }
    }, PESO)
  }

  const desorden = resultado?.hallazgos.some((h) => h.regla === 'casa.ordenada')

  return (
    <Mesa onColocar={alColocar} nombrePieza={(p) => historia(p)?.texto ?? p}
      nombreRanura={(r) => (r === PILA ? 'la pila' : 'la mesa')} className="noche-casa">
      <Ranura id={MESA} etiqueta="Lo que podría hacer la banda" className="opciones">
        {enMesa(HISTORIAS.map((h) => h.id), col).map((id) => <Pieza key={id} id={id}>{historia(id).texto}</Pieza>)}
      </Ranura>

      <section className="pila-y-banda" aria-label="La pila: el backlog de esta noche">
        <Ranura id={PILA} etiqueta="La pila · arriba lo que más importa" className="pila">
          {pila.map((id, i) => (
            <Pieza key={id} id={id} en={PILA} indice={i}>{historia(id)?.texto ?? id}</Pieza>
          ))}
        </Ranura>
        <div className="piramide" aria-hidden="true">
          {PIRAMIDE.map((a) => {
            const Animal = ANIMAL[a]
            return (
              <svg key={a} viewBox="0 0 60 50" className={`piso ${a}`}>
                <Ilustracion clave={`animal-${a}`} x={30} y={45} ancho={60}><Animal /></Ilustracion>
              </svg>
            )
          })}
        </div>
      </section>

      <aside className="burro-po" aria-label="Lo que dice el burro">
        <p className="ranura-etiqueta">El burro, que hace de Product Owner</p>
        <ul>{LO_QUE_IMPORTA.map((l) => <li key={l}>{l}</li>)}</ul>

        <div className="nota-margen" role="status">
          {nota && (
            <>
              <p className="nota-tarjeta">«{historia(nota.pieza)?.texto}» regresó a la mesa.</p>
              <p>{nota.mensaje}</p>
              <p className="fuente">{cita(nota.fuente)}</p>
            </>
          )}
        </div>

        <fieldset className="historia-propia">
          <legend>Tu historia: algo que dejaste fuera en el molino</legend>
          {fuera.length > 0 && (
            <p className="lo-de-fuera">{fuera.map((id) => <span key={id}>{tarjeta(id)?.texto}</span>)}</p>
          )}
          {[['como', 'Como', 'banda'], ['quiero', 'quiero', 'arreglar el techo'], ['para', 'para', 'no mojarnos']]
            .map(([k, etiqueta, ejemplo]) => (
              <label key={k} className="parte">
                <span>{etiqueta}</span>
                <input type="text" id={`propia-${k}`} value={propia[k] ?? ''} placeholder={ejemplo}
                  onChange={(e) => escribir('propia', { ...propia, [k]: e.target.value })} />
              </label>
            ))}
        </fieldset>
      </aside>

      <div className="pie-casa">
        {desorden && <p className="tibio">El estruendo sale tibio: los ladrones se asoman a la ventana, pero no huyen.</p>}
        <button type="button" className="primario" onClick={cantar} disabled={leyendo}>
          {leyendo ? 'La banda toma aire…' : 'Cantar frente a la ventana'}
        </button>
        <Hallazgos key={estado.artefactos.casa?.intentos ?? 0} resultado={resultado} />
      </div>
    </Mesa>
  )
}

function Listo({ estado }) {
  const pila = normalizar(entregado(estado, 'casa')?.colocaciones)[PILA] ?? []
  return (
    <section className="salida" role="status">
      <h2>¡El estruendo los espanta!</h2>
      <p>
        El burro rebuzna, el perro ladra, el gato maúlla y el gallo canta, todos a la vez. Los
        ladrones huyen al bosque. La casa es suya, por esta noche.
      </p>
      <p className="ranura-etiqueta">El backlog con el que lo lograron</p>
      <ol className="backlog-final">{pila.map((id) => <li key={id}>{historia(id)?.texto}</li>)}</ol>
      <a className="como-boton primario" href="#mapa">Al camino →</a>
    </section>
  )
}
