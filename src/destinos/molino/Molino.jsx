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
import './molino.css'

// Espera deliberada antes del veredicto: un resultado instantáneo se siente a
// que nadie leyó el trabajo.
const PESO = 320
const CUPO = Object.fromEntries(COMPARTIMENTOS.map((c) => [c.id, c.cupo]))
const NOMBRE = Object.fromEntries(COMPARTIMENTOS.map((c) => [c.id, c.nombre]))
const CARGA = TARJETAS.filter((t) => t.va !== MESA)
const MEDIDAS = {
  campo: 'medidas', etiqueta: 'Medidas de éxito', tipo: 'lista',
  ayuda: 'Esto lo escribes tú: ¿cómo va a saber el burro que lo logró? Al menos dos, cada una con una cifra.',
  ejemplo: 'Llegar a Bremen en menos de 15 días',
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

  return (
    <article className="molino">
      <a className="volver" href="#mapa">← Al mapa</a>
      <header className="molino-cabecera">
        <svg className={`burro-carga${tambaleo ? ' tambalea' : ''}`} key={tambaleo}
          viewBox="0 0 60 50" aria-hidden="true">
          <g transform={`rotate(${inclinacion} 30 44)`}><Burro /></g>
        </svg>
        <div>
          <h1>El molino</h1>
          <p className="entrada">
            El burro ya no puede con los costales y su amo piensa deshacerse de él. Antes de irse a
            Bremen arma su hatillo: cada cosa que sabe va en su lugar, o se queda en el molino.
          </p>
        </div>
      </header>

      {listo ? (
        <section className="salida" role="status">
          <h2>La puerta del molino está abierta</h2>
          <p>El hatillo va bien repartido y el burro sale al camino. Lo que dejó fuera del alcance va con él.</p>
          <a className="como-boton primario" href="#mapa">Al camino →</a>
        </section>
      ) : (
        <>
          <Mesa onColocar={alColocar} nombrePieza={(p) => tarjeta(p)?.texto ?? p}
            nombreRanura={(r) => NOMBRE[r] ?? 'la mesa'} className="mesa-molino">
            <Ranura id={MESA} etiqueta="Lo que sabe el burro" className="sobre-la-mesa">
              {enMesa(TARJETAS.map((t) => t.id), col).map((id) => (
                <Pieza key={id} id={id}>{tarjeta(id).texto}</Pieza>
              ))}
            </Ranura>

            <section className="hatillo" aria-label="El hatillo">
              {COMPARTIMENTOS.map((c) => (
                <Ranura key={c.id} id={c.id} etiqueta={c.nombre} className={`compartimento ${c.id}`}>
                  {(col[c.id] ?? []).map((id, i) => (
                    <Pieza key={id} id={id} en={c.id} indice={i}>{tarjeta(id)?.texto ?? id}</Pieza>
                  ))}
                </Ranura>
              ))}
              <div className="decidido">
                <p className="ranura-etiqueta">Ya está decidido</p>
                <p><strong>Enfoque.</strong> {DECIDIDO.enfoque}</p>
                <p><strong>Hitos.</strong> {DECIDIDO.hitos.join(' · ')}</p>
              </div>
            </section>
          </Mesa>

          <div className="nota-margen" role="status">
            {nota && (
              <>
                <p className="nota-tarjeta">«{tarjeta(nota.pieza)?.texto}» regresó a la mesa.</p>
                <p>{nota.mensaje}</p>
                <p className="fuente">{cita(nota.fuente)}</p>
              </>
            )}
          </div>

          <section className="escribir-medidas">
            <Campo spec={MEDIDAS} valor={datos.medidas} onCambio={escribir} />
          </section>

          <div className="acciones-molino">
            <button type="button" className="primario" onClick={salir} disabled={leyendo}>
              {leyendo ? 'El burro revisa su hatillo…' : 'Salir del molino'}
            </button>
          </div>

          <Hallazgos key={estado.artefactos.molino?.intentos ?? 0} resultado={resultado} />
        </>
      )}
    </article>
  )
}
