import { cita, fuente } from '../motor/contrato.js'
import { barras } from './cronograma.js'

const DIA = 24 * 60 * 60 * 1000
const FUENTE = fuente('PMBOK', '6.6 Controlar el Cronograma')
const conHora = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
const soloDia = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' })
const soloHora = new Intl.DateTimeFormat('es-MX', { hour: 'numeric', minute: '2-digit' })

/** Tres marcas en el eje: en horas si todo cabe en un día, en fechas si no. */
function marcas(min, max) {
  const fmt = max - min < DIA ? soloHora : soloDia
  return [0, 0.5, 1].map((p) => ({ p, texto: fmt.format(min + (max - min) * p) }))
}

/** El viaje como diagrama de Gantt: una barra por parada, con las horas reales. */
export default function Gantt({ estado, ahora }) {
  const { filas, min, max } = barras(estado, ahora)
  const pos = (t) => `${((t - min) / (max - min)) * 100}%`
  return (
    <figure className="gantt">
      <figcaption className="gantt-titulo">Tu cronograma</figcaption>
      <ol className="gantt-filas">
        {filas.map((f) => (
          <li key={f.id} className={`gantt-fila ${f.estado}`}>
            <span className="gantt-nombre">{f.corto}</span>
            <span className="gantt-pista" aria-hidden="true">
              {f.inicio !== null && (
                <span className={`gantt-barra${f.enCurso ? ' en-curso' : ''}`}
                  style={{ left: pos(f.inicio), width: `max(6px, calc(${pos(f.fin)} - ${pos(f.inicio)}))` }} />
              )}
            </span>
            <span className="gantt-cuando">
              {f.estado === 'hecha' ? conHora.format(f.fin) : f.estado === 'actual' ? 'en curso' : 'cerrada'}
            </span>
          </li>
        ))}
      </ol>
      <div className="gantt-eje" aria-hidden="true">
        {marcas(min, max).map((m) => <span key={m.p} style={{ left: `${m.p * 100}%` }}>{m.texto}</span>)}
      </div>
      <p className="gantt-fuente">{cita(FUENTE)}</p>
    </figure>
  )
}
