import { useCallback, useState } from 'react'
import { MESA, colocar, enMesa, normalizar } from '../../arrastre/colocacion.js'
import { Mesa, Pieza, Ranura } from '../../arrastre/Mesa.jsx'
import { evaluar } from '../../motor/motor.js'
import { cita } from '../../motor/contrato.js'
import { COMPARTIMENTOS, DECIDIDO, TARJETAS, tarjeta } from '../../motor/reglas/molino.js'
import { borrador } from '../../estado/taller.js'
import Campo from '../../componentes/Campo.jsx'
import Hallazgos from '../../componentes/Hallazgos.jsx'
import { Burro } from '../../mapa/dibujos.jsx'
import Ilustracion from '../../ilustraciones/Ilustracion.jsx'
import './molino.css'

// Espera deliberada antes del veredicto: un resultado instantáneo se siente a
// que nadie leyó el trabajo.
const PESO = 320
const CUPO = Object.fromEntries(COMPARTIMENTOS.map((c) => [c.id, c.cupo]))
const NOMBRE = Object.fromEntries(COMPARTIMENTOS.map((c) => [c.id, c.nombre]))
const CARGA = TARJETAS.filter((t) => t.va !== MESA)
// Las tarjetas salen como un mazo: seis a la vista, en el orden de autoría.
const A_LA_VISTA = 6
const MEDIDAS = {
  campo: 'medidas', etiqueta: 'Medidas de éxito', tipo: 'lista',
  ayuda: 'Esto lo escribes tú: ¿cómo va a saber el burro que lo logró? Al menos dos, cada una con una cifra.',
  ejemplo: 'Llegar en menos de 15 días',
}

/**
 * El molino: antes de salir, el burro arma su hatillo. Cada hecho va a su
 * compartimento o se queda en la mesa. Una tarjeta mal puesta no se queda: el
 * burro se ladea, la tarjeta regresa y aparece la nota al margen con su cita.
 * No hay tache ni cuenta de errores, y no se puede perder.
 */
export default function Molino({ estado, despachar }) {
  const datos = borrador(estado, 'molino')
  const col = normalizar(datos.colocaciones)
  const [nota, setNota] = useState(null)
  const [tambaleo, setTambaleo] = useState(0)
  const [resultado, setResultado] = useState(null)
  const [leyendo, setLeyendo] = useState(false)
  const [listo, setListo] = useState(false)

  const escribir = useCallback((campo, valor) => {
    despachar({ tipo: 'escribir', artefacto: 'molino', campo, valor })
  }, [despachar])

  const alColocar = useCallback((pieza, ranura, indice) => {
    const nuevas = colocar(col, pieza, ranura, { indice, cupo: CUPO[ranura] })
    // La misma regla del motor decide al momento: la interfaz no sabe dónde va nada.
    const error = evaluar('molino', { ...datos, colocaciones: nuevas }).hallazgos
      .find((h) => h.regla === 'molino.en-su-lugar' && h.campo === pieza)
    if (error) {
      setNota({ pieza, mensaje: error.mensaje, fuente: error.fuente })
      setTambaleo((n) => n + 1)
      return
    }
    setNota(null)
    setResultado(null)
    escribir('colocaciones', nuevas)
  }, [col, datos, escribir])

  const salir = () => {
    setLeyendo(true)
    setResultado(null)
    const r = evaluar('molino', datos)
    setTimeout(() => {
      setLeyendo(false)
      despachar({ tipo: 'entregar', artefacto: 'molino', resumen: r.resumen })
      if (r.resumen.pasa) {
        despachar({ tipo: 'llegar', destino: 'molino' })
        setListo(true)
      } else {
        setResultado(r)
      }
    }, PESO)
  }

  const bien = CARGA.filter((t) => col[t.va]?.includes(t.id)).length
  // Llevar la carga bien repartida pesa menos: el burro se endereza.
  const inclinacion = Math.round(16 * (1 - bien / CARGA.length))
  // El hatillo en el lomo crece con cada tarjeta bien puesta. Lleno, ya se puede salir;
  // no se dice cuáles se quedan en la mesa, porque eso regalaría la respuesta.
  const carga = bien / CARGA.length
  const lleno = bien === CARGA.length

  const enLaMesa = enMesa(TARJETAS.map((t) => t.id), col)
  const aLaVista = enLaMesa.slice(0, A_LA_VISTA)

  return (
    <article className="molino">
      <div className="molino-titulo">
        <a className="volver" href="#mapa">← Al mapa</a>
        <h1>El molino</h1>
        <p className="entrada">
          El burro ya no puede con los costales y su amo piensa deshacerse de él. Antes de irse a
          Bremen arma su hatillo: cada cosa que sabe va en su lugar, o se queda en el molino.
        </p>
      </div>

      {listo ? (
        <section className="salida" role="status">
          <h2>La puerta del molino está abierta</h2>
          <p>El hatillo va bien repartido y el burro sale al camino. Lo que dejó fuera del alcance va con él.</p>
          <a className="como-boton primario" href="#mapa">Al camino →</a>
        </section>
      ) : (
        <Mesa onColocar={alColocar} nombrePieza={(p) => tarjeta(p)?.texto ?? p}
          nombreRanura={(r) => NOMBRE[r] ?? 'la mesa'} className="piso-molino">
          <Ranura id={MESA} etiqueta="Lo que sabe el burro" className="mazo">
            {aLaVista.map((id) => <Pieza key={id} id={id}>{tarjeta(id).texto}</Pieza>)}
            {enLaMesa.length > A_LA_VISTA && (
              <p className="quedan">Y {enLaMesa.length - A_LA_VISTA} más en el costal.</p>
            )}
          </Ranura>

          <div className="centro-molino">
            <svg className={`burro-carga${tambaleo ? ' tambalea' : ''}`} key={tambaleo}
              viewBox="0 0 70 56" aria-hidden="true">
              {/* La paja separa al burro del piso: es el indicador de avance y tiene que verse. */}
              <ellipse cx="35" cy="50" rx="33" ry="7" className="paja" />
              <g transform={`translate(5 2) rotate(${inclinacion} 30 44)`}>
                <Ilustracion clave="animal-burro" x={30} y={45} ancho={60}><Burro /></Ilustracion>
                <g transform={`translate(27 21) scale(${0.45 + 0.55 * carga})`} className="hatillo-lomo">
                  <path d="M-10 0 Q-12 -11 0 -13 Q12 -11 10 0 Z" />
                  <path d="M-3 -13 L0 -17 L3 -13" fill="none" />
                </g>
              </g>
            </svg>

            <div className="nota-margen" role="status">
              {nota && (
                <>
                  <p className="nota-tarjeta">«{tarjeta(nota.pieza)?.texto}» regresó a la mesa.</p>
                  <p>{nota.mensaje}</p>
                  <p className="fuente">{cita(nota.fuente)}</p>
                </>
              )}
            </div>

            <details className="decidido">
              <summary>Ya está decidido</summary>
              <p><strong>Enfoque.</strong> {DECIDIDO.enfoque}</p>
              <p><strong>Hitos.</strong> {DECIDIDO.hitos.join(' · ')}</p>
            </details>

          </div>

          <section className="hatillo" aria-label="El hatillo">
            {COMPARTIMENTOS.map((c) => (
              <Ranura key={c.id} id={c.id} etiqueta={c.nombre} className={`compartimento ${c.id}`}>
                {(col[c.id] ?? []).map((id, i) => (
                  <Pieza key={id} id={id} en={c.id} indice={i}>{tarjeta(id)?.texto ?? id}</Pieza>
                ))}
              </Ranura>
            ))}
            {/* Las medidas son parte del acta: van en el hatillo, no en medio del escenario. */}
            <section className="compartimento medidas">
              <Campo spec={MEDIDAS} valor={datos.medidas} onCambio={escribir} />
            </section>
          </section>

          <div className="pie-molino">
            <p>{lleno ? 'El hatillo va lleno.' : 'Cuando el hatillo vaya lleno y tenga sus medidas, el burro puede salir.'}</p>
            <button type="button" className={`primario salir${lleno ? ' listo' : ''}`} onClick={salir} disabled={leyendo}>
              {leyendo ? 'El burro revisa su hatillo…' : 'Salir del molino'}
            </button>
            <Hallazgos key={estado.artefactos.molino?.intentos ?? 0} resultado={resultado} />
          </div>
        </Mesa>
      )}
    </article>
  )
}
