import { useState } from 'react'
import { MESA, colocar, enMesa, normalizar } from '../../arrastre/colocacion.js'
import { Mesa, Pieza, Ranura } from '../../arrastre/Mesa.jsx'
import { evaluar } from '../../motor/motor.js'
import { cita } from '../../motor/contrato.js'
import { CUPO_RAMA, PIEZAS, PROYECTO, RAMAS, pieza } from '../../motor/reglas/gato.js'
import { borrador } from '../../estado/taller.js'
import Hallazgos from '../../componentes/Hallazgos.jsx'
import './gato.css'

const PESO = 320
const NOMBRE = Object.fromEntries(RAMAS.map((r) => [r.id, r.nombre]))

const Etiqueta = ({ id }) => {
  const p = pieza(id)
  return <>{p?.texto ?? id}<span className="horas"> · {p?.horas} h</span></>
}

/**
 * El gato: la EDT como un móvil colgante. Arriba el proyecto, de él tres
 * entregables y de cada uno sus paquetes de trabajo. El móvil se inclina hacia
 * el lado con más peso y queda horizontal cuando no falta ni sobra nada. Una
 * pieza que no va ahí regresa a la mesa con su nota y su fuente.
 */
export default function Gato({ estado, despachar }) {
  const datos = borrador(estado, 'gato')
  const col = normalizar(datos.colocaciones)
  const [nota, setNota] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [leyendo, setLeyendo] = useState(false)
  const [listo, setListo] = useState(false)

  const alColocar = (id, ranura, indice) => {
    const nuevas = colocar(col, id, ranura, { indice, cupo: ranura === MESA ? undefined : CUPO_RAMA })
    const error = evaluar('gato', { ...datos, colocaciones: nuevas }).hallazgos
      .find((h) => h.regla === 'gato.en-su-rama' && h.campo === id)
    if (error) { setNota({ id, mensaje: error.mensaje, fuente: error.fuente }); return }
    setNota(null)
    setResultado(null)
    despachar({ tipo: 'escribir', artefacto: 'gato', campo: 'colocaciones', valor: nuevas })
  }

  const colgar = () => {
    setLeyendo(true)
    setResultado(null)
    const r = evaluar('gato', datos)
    setTimeout(() => {
      setLeyendo(false)
      despachar({ tipo: 'entregar', artefacto: 'gato', resumen: r.resumen })
      if (r.resumen.pasa) {
        despachar({ tipo: 'llegar', destino: 'gato' })
        setListo(true)
      } else {
        setResultado(r)
      }
    }, PESO)
  }

  // El peso de cada lado inclina el móvil; con las tres ramas completas queda horizontal.
  const peso = RAMAS.reduce((s, r) => s + r.lado * (col[r.id]?.length ?? 0), 0)
  const inclinacion = Math.max(-9, Math.min(9, peso * 4))

  return (
    <article className="gato">
      <div className="gato-titulo">
        <a className="volver" href="#mapa">← Al mapa</a>
        <h1>El gato</h1>
        <p className="entrada">
          El gato, que sabe de música de noche, tiene un móvil colgado del tejado. Hay que colgar en él
          todo lo que la banda va a entregar para llegar a Bremen: que no falte nada y que no sobre nada.
        </p>
      </div>

      {listo ? (
        <section className="salida" role="status">
          <h2>El móvil queda en equilibrio</h2>
          <p>Cada entregable suma todo su trabajo y nada sobra. El gato se sube al lomo del burro y se va con ellos.</p>
          <a className="como-boton primario" href="#mapa">Al camino →</a>
        </section>
      ) : (
        <Mesa onColocar={alColocar} nombrePieza={(id) => pieza(id)?.texto ?? id}
          nombreRanura={(r) => NOMBRE[r] ?? 'la mesa'} className="tejado">
          <Ranura id={MESA} etiqueta="En la mesa" className="mesa-gato">
            {enMesa(PIEZAS.map((p) => p.id), col).map((id) => <Pieza key={id} id={id}><Etiqueta id={id} /></Pieza>)}
          </Ranura>

          <section className="movil" aria-label="El móvil: la estructura de desglose del trabajo">
            <p className="proyecto"><span>Proyecto</span>{PROYECTO}</p>
            <div className="varilla" style={{ transform: `rotate(${inclinacion}deg)` }}>
              {RAMAS.map((r) => (
                <div key={r.id} className="colgante">
                  <span className="hilo" aria-hidden="true" />
                  <Ranura id={r.id} etiqueta={r.nombre} className="rama">
                    {(col[r.id] ?? []).map((id, i) => (
                      <Pieza key={id} id={id} en={r.id} indice={i}><Etiqueta id={id} /></Pieza>
                    ))}
                  </Ranura>
                </div>
              ))}
            </div>
          </section>

          <div className="nota-margen" role="status">
            {nota && (
              <>
                <p className="nota-tarjeta">«{pieza(nota.id)?.texto}» regresó a la mesa.</p>
                <p>{nota.mensaje}</p>
                <p className="fuente">{cita(nota.fuente)}</p>
              </>
            )}
          </div>

          <div className="pie-gato">
            <button type="button" className="primario" onClick={colgar} disabled={leyendo}>
              {leyendo ? 'El gato revisa el móvil…' : 'Colgar el móvil'}
            </button>
            <Hallazgos key={estado.artefactos.gato?.intentos ?? 0} resultado={resultado} />
          </div>
        </Mesa>
      )}
    </article>
  )
}
