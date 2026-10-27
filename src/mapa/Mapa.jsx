import { DESTINOS, abierto, actual, recorrido } from '../destinos/catalogo.js'
import { DIBUJO } from './indice.js'
import { Arbol, Candado, Nube } from './paisaje.jsx'
import { LIENZO, NIEBLA, PUNTOS, tramo } from './trazo.js'

const PUNTOS_EN_ORDEN = DESTINOS.map((d) => PUNTOS[d.id])

const ISLA = 'M120 330 C160 200 420 170 640 200 C860 160 1100 180 1300 210 C1480 230 1560 330 1540 470 '
  + 'C1560 640 1500 780 1300 800 C1050 830 800 790 560 810 C330 830 120 790 90 650 C60 540 80 420 120 330 Z'
const RIO = 'M1175 205 C1140 330 1230 420 1180 520 C1130 620 1220 700 1185 805'

const ARBOLES = [
  [130, 450], [165, 485], [300, 250], [250, 290], [560, 260], [520, 740], [760, 735], [800, 250],
  [990, 250], [935, 770], [1000, 788], [1060, 780], [1120, 792], [1400, 250], [1480, 470], [330, 760],
]
const NUBES = [[80, 90, 1.3], [520, 60, 1], [1000, 80, 1.2], [1500, 110, 1], [60, 860, 1.1], [1560, 860, 1.2]]

/**
 * El mapa del camino. El progreso es el cuento: el tramo recorrido es tierra
 * firme, el siguiente destino respira y lo cerrado lleva candado. No hay otro
 * indicador.
 *
 * La casa y el acto final no existen en el DOM mientras sigan las nubes: el
 * giro no se anuncia, ni siquiera a un lector de pantalla.
 */
export default function Mapa({ estado }) {
  const siguiente = actual(estado).id
  const despejado = abierto(estado, 'casa')
  const visible = (id) => despejado || PUNTOS[id][0] < NIEBLA

  return (
    <svg className="mapa" viewBox={`0 0 ${LIENZO.ancho} ${LIENZO.alto}`} role="group"
      aria-label="Mapa del camino. Cada destino abierto es un enlace.">
      <g aria-hidden="true">
        <rect width={LIENZO.ancho} height={LIENZO.alto} fill="var(--cielo)" />
        {NUBES.map(([x, y, s]) => <Nube key={`${x}-${y}`} x={x} y={y} escala={s} />)}
        <path d={ISLA} transform="translate(0 30)" fill="var(--tierra-2)" />
        <path d={ISLA} fill="var(--pasto)" stroke="var(--pasto-2)" strokeWidth="6" />
        <path d={RIO} className="rio" />
        <path d={RIO} className="rio-brillo" />
        {ARBOLES.filter(([x]) => despejado || x < NIEBLA - 10).map(([x, y]) => <Arbol key={`${x}-${y}`} x={x} y={y} />)}
      </g>

      <g aria-hidden="true">
        {PUNTOS_EN_ORDEN.slice(0, -1).map((_, i) => {
          if (!visible(DESTINOS[i + 1].id)) return null
          const hecho = recorrido(estado, DESTINOS[i].id)
          return (
            <g key={i}>
              <path d={tramo(PUNTOS_EN_ORDEN, i)} className="sendero-orilla" />
              <path d={tramo(PUNTOS_EN_ORDEN, i)} className={`sendero${hecho ? ' hecho' : ''}`} />
            </g>
          )
        })}
        {despejado && (
          <g transform="translate(1186 486) rotate(-40)" className="puente">
            <rect x="-34" y="-17" width="68" height="34" rx="4" />
            {[-22, -8, 6, 20].map((x) => <line key={x} x1={x} y1="-17" x2={x} y2="17" />)}
          </g>
        )}
      </g>

      {DESTINOS.filter((d) => visible(d.id)).map((d) => {
        const [x, y] = PUNTOS[d.id]
        const Dibujo = DIBUJO[d.id]
        const puede = abierto(estado, d.id)
        const hecho = recorrido(estado, d.id)
        const aqui = d.id === siguiente && !hecho
        const clase = `destino${puede ? ' abierto' : ' cerrado'}${hecho ? ' hecho' : ''}${aqui ? ' aqui' : ''}`
        const contenido = (
          <>
            <ellipse cy="42" rx="86" ry="40" className="plataforma-borde" />
            <ellipse cy="30" rx="86" ry="40" className="plataforma" />
            {aqui && <ellipse cy="30" rx="100" ry="50" className="halo" />}
            <g transform="translate(0 -6) scale(1.7)"><Dibujo girando={aqui} /></g>
            <g transform="translate(0 100)" className="rotulo">
              <rect x={-d.nombre.length * 6.5 - 16} y="-20" width={d.nombre.length * 13 + 32} height="36" rx="18" />
              <text y="5" textAnchor="middle">{d.nombre}</text>
            </g>
            {!puede && <Candado x={58} y={-48} />}
          </>
        )
        return (
          <g key={d.id} transform={`translate(${x} ${y})`} className={clase}>
            {puede ? (
              <a href={`#destino-${d.id}`}
                aria-label={`${d.nombre}${hecho ? ', recorrido' : ''}${aqui ? ', siguiente parada' : ''}`}>
                {contenido}
              </a>
            ) : <g aria-hidden="true">{contenido}</g>}
          </g>
        )
      })}

      {!despejado && (
        <g aria-hidden="true" className="nubes-cerradas">
          <rect x={NIEBLA + 60} y="0" width={LIENZO.ancho - NIEBLA} height={LIENZO.alto} />
          {[60, 170, 290, 400, 520, 640, 760, 870].map((y, i) => (
            <circle key={y} cx={NIEBLA + (i % 2 ? 90 : 70)} cy={y} r={i % 2 ? 70 : 85} />
          ))}
        </g>
      )}
    </svg>
  )
}
