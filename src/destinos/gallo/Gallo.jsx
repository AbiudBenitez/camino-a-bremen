import { useCallback, useState } from 'react'
import { evaluar } from '../../motor/motor.js'
import { ACERCA, ACTIVIDADES, TIEMPOS, criticasDe, numero, renglonBien } from '../../motor/reglas/gallo.js'
import { borrador } from '../../estado/taller.js'
import Hallazgos from '../../componentes/Hallazgos.jsx'
import Explica from '../../componentes/Explica.jsx'
import ComoSeJuega from '../../componentes/ComoSeJuega.jsx'
import { PASOS } from '../instrucciones.js'
import { Gallo as DibujoGallo } from '../../mapa/dibujos.jsx'
import Ilustracion from '../../ilustraciones/Ilustracion.jsx'
import './gallo.css'

const PESO = 320

// Dónde va cada caja en el corral: el orden de izquierda a derecha es el de la red.
const LUGAR = { A: [20, 20], B: [20, 168], C: [225, 20], D: [330, 168], E: [435, 20], F: [630, 94] }
const CAJA = { ancho: 118, alto: 78 }
const FLECHAS = ACTIVIDADES.flatMap((a) => a.antes.map((p) => [p, a.id]))

/**
 * El gallo: el cronograma del viaje. La red está dibujada en el corral; el
 * estudiante escribe los cuatro tiempos y la holgura de cada actividad y marca
 * la ruta crítica. La app no calcula nada que se vea: verifica. Cada caja de la
 * red se enciende cuando su renglón ya cuadra.
 */
export default function Gallo({ estado, despachar }) {
  const datos = borrador(estado, 'gallo')
  const tiempos = datos.tiempos && typeof datos.tiempos === 'object' ? datos.tiempos : {}
  const criticas = criticasDe(datos)
  const [resultado, setResultado] = useState(null)
  const [leyendo, setLeyendo] = useState(false)
  const [listo, setListo] = useState(false)

  const escribir = useCallback((campo, valor) => {
    setResultado(null)
    despachar({ tipo: 'escribir', artefacto: 'gallo', campo, valor })
  }, [despachar])

  const anotar = (id, t, valor) => {
    const fila = tiempos[id] && typeof tiempos[id] === 'object' ? tiempos[id] : {}
    escribir('tiempos', { ...tiempos, [id]: { ...fila, [t]: valor.replace(/\D/g, '').slice(0, 3) } })
  }

  const marcar = (id, si) => escribir('criticas', si ? [...criticas, id] : criticas.filter((c) => c !== id))

  const cantar = () => {
    setLeyendo(true)
    setResultado(null)
    const r = evaluar('gallo', datos)
    setTimeout(() => {
      setLeyendo(false)
      despachar({ tipo: 'entregar', artefacto: 'gallo', resumen: r.resumen })
      if (r.resumen.pasa) {
        despachar({ tipo: 'llegar', destino: 'gallo' })
        setListo(true)
      } else {
        setResultado(r)
      }
    }, PESO)
  }

  const valor = (id, t) => {
    const v = tiempos[id]?.[t]
    return typeof v === 'string' || typeof v === 'number' ? String(v) : ''
  }
  const bien = Object.fromEntries(ACTIVIDADES.map((a) => [a.id, renglonBien(datos, a.id)]))
  const roja = (id) => bien[id] && criticas.includes(id)
  const todas = ACTIVIDADES.every((a) => bien[a.id])

  return (
    <article className="gallo">
      <div className="gallo-titulo">
        <a className="volver" href="#mapa">← Al mapa</a>
        <h1>El gallo</h1>
        <span className="titulo-concepto">
          {ACERCA.cronograma.titulo}
          <Explica titulo={ACERCA.cronograma.titulo} fuente={ACERCA.cronograma.fuente}>{ACERCA.cronograma.explicacion}</Explica>
        </span>
        {!listo && <ComoSeJuega pasos={PASOS.gallo} />}
      </div>

      {listo ? (
        <section className="salida" role="status">
          <h2>¡Quiquiriquí!</h2>
          <p>
            El viaje dura {Math.max(...ACTIVIDADES.map((a) => numero(tiempos[a.id]?.tt) ?? 0))} días y el gallo sabe
            qué no se puede atrasar. Sube al lomo del burro, encima del gato, y se van.
          </p>
          <a className="como-boton primario" href="#mapa">Al camino →</a>
        </section>
      ) : (
        <div className="corral">
          <section className="red-viaje" aria-labelledby="red-titulo">
            <div className="red-cabeza">
              <h2 id="red-titulo">La red del viaje</h2>
              <Explica titulo={ACERCA.red.titulo} fuente={ACERCA.red.fuente}>{ACERCA.red.explicacion}</Explica>
            </div>
            <div className="red-lienzo">
              <svg viewBox="0 0 770 262" className="red-dibujo" role="img"
                aria-label={`Red de precedencias: ${ACTIVIDADES.map((a) => a.antes.length ? `${a.id} después de ${a.antes.join(' y ')}` : `${a.id} al inicio`).join('; ')}.`}>
                <defs>
                  <marker id="punta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0 0 L10 5 L0 10 Z" className="punta" />
                  </marker>
                  <marker id="punta-roja" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0 0 L10 5 L0 10 Z" className="punta roja" />
                  </marker>
                </defs>
                {FLECHAS.map(([de, a]) => {
                  const [x1, y1] = LUGAR[de]
                  const [x2, y2] = LUGAR[a]
                  const r = roja(de) && roja(a)
                  return (
                    <line key={de + a} x1={x1 + CAJA.ancho} y1={y1 + CAJA.alto / 2} x2={x2 - 2} y2={y2 + CAJA.alto / 2}
                      className={`flecha${r ? ' roja' : ''}`} markerEnd={`url(#${r ? 'punta-roja' : 'punta'})`} />
                  )
                })}
                {ACTIVIDADES.map((a) => {
                  const [x, y] = LUGAR[a.id]
                  const v = (t) => valor(a.id, t) || '·'
                  return (
                    <g key={a.id} transform={`translate(${x} ${y})`}
                      className={`nodo${bien[a.id] ? ' bien' : ''}${roja(a.id) ? ' critico' : ''}`}>
                      <rect width={CAJA.ancho} height={CAJA.alto} rx="8" />
                      <line x1="0" y1="22" x2={CAJA.ancho} y2="22" />
                      <line x1="0" y1="56" x2={CAJA.ancho} y2="56" />
                      <text x="8" y="16" className="t">{v('it')}</text>
                      <text x={CAJA.ancho / 2} y="16" className="t medio">{a.duracion} d</text>
                      <text x={CAJA.ancho - 8} y="16" className="t fin">{v('tt')}</text>
                      <text x={CAJA.ancho / 2} y="36" className="nombre medio">{a.id}</text>
                      <text x={CAJA.ancho / 2} y="50" className="sub medio">{a.nombre}</text>
                      <text x="8" y="71" className="t">{v('il')}</text>
                      <text x={CAJA.ancho / 2} y="71" className="t medio">H {v('h')}</text>
                      <text x={CAJA.ancho - 8} y="71" className="t fin">{v('tl')}</text>
                    </g>
                  )
                })}
              </svg>
            </div>
            <p className="leyenda">
              Arriba: inicio temprano · duración · finalización temprana. Abajo: inicio tardío · holgura ·
              finalización tardía. La caja se enciende cuando su renglón cuadra.
            </p>
          </section>

          <section className="tabla-viaje" aria-labelledby="tabla-titulo">
            <div className="red-cabeza">
              <h2 id="tabla-titulo">Tus cálculos</h2>
              <Explica titulo="Hacia adelante y hacia atrás" fuente={ACERCA.tiempos.fuente}>
                {ACERCA.tiempos.ida} {ACERCA.tiempos.vuelta} {ACERCA.tiempos.holgura}
              </Explica>
            </div>
            <div className="tabla-rueda">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Actividad</th>
                    <th scope="col"><abbr title="Duración en días">Días</abbr></th>
                    <th scope="col">Después de</th>
                    {TIEMPOS.map((t) => <th key={t.id} scope="col"><abbr title={t.nombre}>{t.corto}</abbr></th>)}
                    <th scope="col">¿Crítica?</th>
                  </tr>
                </thead>
                <tbody>
                  {ACTIVIDADES.map((a) => (
                    <tr key={a.id} className={bien[a.id] ? 'bien' : ''}>
                      <th scope="row"><span className="letra">{a.id}</span> {a.nombre}</th>
                      <td>{a.duracion}</td>
                      <td>{a.antes.length ? a.antes.join(', ') : '—'}</td>
                      {TIEMPOS.map((t) => (
                        <td key={t.id}>
                          <input type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" className="numero"
                            id={`gallo-${a.id}-${t.id}`} aria-label={`${t.nombre} de ${a.nombre}`}
                            value={valor(a.id, t.id)} onChange={(e) => anotar(a.id, t.id, e.target.value)} />
                        </td>
                      ))}
                      <td>
                        <input type="checkbox" className="critica" checked={criticas.includes(a.id)}
                          aria-label={`${a.nombre} es parte de la ruta crítica`}
                          onChange={(e) => marcar(a.id, e.target.checked)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="pie-gallo">
            <svg className={`gallo-dibujo${todas ? ' listo' : ''}`} viewBox="0 0 60 50" aria-hidden="true">
              <Ilustracion clave="animal-gallo" x={30} y={45} ancho={60}><DibujoGallo /></Ilustracion>
            </svg>
            <p>{todas ? 'El gallo ya está inflando el pecho.' : 'El gallo espera en el portón.'}</p>
            <button type="button" className="primario" onClick={cantar} disabled={leyendo}>
              {leyendo ? 'El gallo repasa las cuentas…' : 'Que cante el gallo'}
            </button>
            <Hallazgos key={estado.artefactos.gallo?.intentos ?? 0} resultado={resultado} />
          </div>
        </div>
      )}
    </article>
  )
}
