import { useState } from 'react'
import { MESA, colocar, enMesa, normalizar } from '../../arrastre/colocacion.js'
import { Mesa, Pieza, Ranura } from '../../arrastre/Mesa.jsx'
import { evaluar } from '../../motor/motor.js'
import { ACERCA, CUADRANTES, INTERESADOS, PERSONAJES, personaje } from '../../motor/reglas/perro.js'
import { borrador } from '../../estado/taller.js'
import Hallazgos from '../../componentes/Hallazgos.jsx'
import Explica from '../../componentes/Explica.jsx'
import ComoSeJuega from '../../componentes/ComoSeJuega.jsx'
import { PASOS } from '../instrucciones.js'
import NotaFlotante from '../../componentes/NotaFlotante.jsx'
import { Perro as DibujoPerro } from '../../mapa/dibujos.jsx'
import Ilustracion from '../../ilustraciones/Ilustracion.jsx'
import './perro.css'

const PESO = 320
const NOMBRE = Object.fromEntries(CUADRANTES.map((c) => [c.id, c.nombre]))

/**
 * El perro: los interesados en la matriz de poder e interés. El perro de caza
 * husmea a quién le importa el viaje y quién puede detenerlo; cada personaje va
 * a su cuadrante o se queda en la mesa si no es interesado. Una tarjeta mal
 * puesta regresa con su nota, que apunta al eje que falló.
 */
export default function Perro({ estado, despachar }) {
  const datos = borrador(estado, 'perro')
  const col = normalizar(datos.colocaciones)
  const [nota, setNota] = useState(null)
  const [olfateo, setOlfateo] = useState(0)
  const [resultado, setResultado] = useState(null)
  const [leyendo, setLeyendo] = useState(false)
  const [listo, setListo] = useState(false)

  const alColocar = (id, ranura, indice) => {
    const nuevas = colocar(col, id, ranura, { indice })
    const error = evaluar('perro', { ...datos, colocaciones: nuevas }).hallazgos
      .find((h) => h.regla === 'perro.en-su-cuadrante' && h.campo === id)
    if (error) { setNota({ tarjeta: personaje(id)?.texto ?? id, mensaje: error.mensaje, fuente: error.fuente }); return }
    setNota(null)
    setResultado(null)
    if (ranura !== MESA) setOlfateo((n) => n + 1)
    despachar({ tipo: 'escribir', artefacto: 'perro', campo: 'colocaciones', valor: nuevas })
  }

  const seguir = () => {
    setLeyendo(true)
    setResultado(null)
    const r = evaluar('perro', datos)
    setTimeout(() => {
      setLeyendo(false)
      despachar({ tipo: 'entregar', artefacto: 'perro', resumen: r.resumen })
      if (r.resumen.pasa) {
        despachar({ tipo: 'llegar', destino: 'perro' })
        setListo(true)
      } else {
        setResultado(r)
      }
    }, PESO)
  }

  const ubicados = INTERESADOS.filter((p) => col[p.va]?.includes(p.id)).length

  return (
    <article className="perro">
      <div className="perro-titulo">
        <a className="volver" href="#mapa">← Al mapa</a>
        <h1>El perro</h1>
        <span className="titulo-concepto">
          {ACERCA.matriz.titulo}
          <Explica titulo={ACERCA.matriz.titulo} fuente={ACERCA.matriz.fuente}>{ACERCA.matriz.explicacion}</Explica>
        </span>
        {!listo && <ComoSeJuega pasos={PASOS.perro} />}
      </div>

      {listo ? (
        <section className="salida" role="status">
          <h2>El perro ya sabe a quién cuidar</h2>
          <p>Cada interesado está en su lugar, y la lluvia, donde va: con los riesgos. El perro se sacude y se va con el burro.</p>
          <a className="como-boton primario" href="#mapa">Al camino →</a>
        </section>
      ) : (
        <Mesa onColocar={alColocar} nombrePieza={(id) => personaje(id)?.texto ?? id}
          nombreRanura={(r) => NOMBRE[r] ?? 'la mesa'} className="campo-perro">
          <Ranura id={MESA} etiqueta="A quién huele el perro" className="mesa-perro">
            {enMesa(PERSONAJES.map((p) => p.id), col).map((id) => <Pieza key={id} id={id}>{personaje(id).texto}</Pieza>)}
          </Ranura>

          <section className="matriz-y-perro" aria-label="La matriz de poder e interés">
            <div className="matriz">
              <span className="eje eje-poder" aria-hidden="true">Poder →</span>
              <span className="eje eje-interes" aria-hidden="true">Interés →</span>
              {CUADRANTES.map((c) => (
                <Ranura key={c.id} id={c.id} etiqueta={c.nombre} className={`cuadrante ${c.id}`}>
                  <Explica titulo={c.nombre} fuente={ACERCA.estrategia}>{c.explicacion}</Explica>
                  <span className="ejes-cuadrante">Poder {c.poder} · interés {c.interes}</span>
                  {(col[c.id] ?? []).map((id, i) => (
                    <Pieza key={id} id={id} en={c.id} indice={i}>{personaje(id)?.texto ?? id}</Pieza>
                  ))}
                </Ranura>
              ))}
            </div>
            <div className="perro-olfato">
              <svg className={`perro-dibujo${olfateo ? ' olfatea' : ''}`} key={olfateo} viewBox="0 0 60 50" aria-hidden="true">
                <Ilustracion clave="animal-perro" x={30} y={45} ancho={60}><DibujoPerro /></Ilustracion>
              </svg>
              <p>{ubicados === INTERESADOS.length ? 'El perro ya no huele a nadie más.' : 'El perro sigue husmeando.'}</p>
            </div>
          </section>

          <NotaFlotante nota={nota} onCerrar={() => setNota(null)} />

          <div className="pie-perro">
            <button type="button" className="primario" onClick={seguir} disabled={leyendo}>
              {leyendo ? 'El perro revisa el rastro…' : 'Seguir con el perro'}
            </button>
            <Hallazgos key={estado.artefactos.perro?.intentos ?? 0} resultado={resultado} />
          </div>
        </Mesa>
      )}
    </article>
  )
}
