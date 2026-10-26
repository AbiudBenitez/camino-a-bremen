import { DESTINOS, abierto, actual, recorrido } from '../destinos/catalogo.js'
import { DIBUJO } from './indice.js'
import { LIENZO, NIEBLA, PUNTOS, tramo } from './trazo.js'

const PUNTOS_EN_ORDEN = DESTINOS.map((d) => PUNTOS[d.id])

/**
 * El mapa del camino. El progreso es el cuento: el tramo recorrido se pinta de
 * tierra firme y el siguiente destino respira. No hay otro indicador.
 *
 * La casa y el acto final no existen en el DOM mientras siga la niebla: el giro
 * no se anuncia, ni siquiera a un lector de pantalla.
 */
export default function Mapa({ estado }) {
  const siguiente = actual(estado).id
  const despejado = abierto(estado, 'casa')
  const visibles = DESTINOS.filter((d) => despejado || PUNTOS[d.id][1] < NIEBLA)

  return (
    <svg className="mapa" viewBox={`0 0 ${LIENZO.ancho} ${LIENZO.alto}`} role="group"
      aria-label="Mapa del camino. Cada destino abierto es un enlace.">
      <defs>
        <linearGradient id="niebla" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--niebla)" stopOpacity="0" />
          <stop offset="0.35" stopColor="var(--niebla)" stopOpacity="0.96" />
        </linearGradient>
      </defs>

      <rect width={LIENZO.ancho} height={LIENZO.alto} fill="var(--pasto)" />
      <g fill="var(--pasto-2)" aria-hidden="true">
        <ellipse cx="60" cy="120" rx="120" ry="60" />
        <ellipse cx="380" cy="250" rx="110" ry="70" />
        <ellipse cx="40" cy="470" rx="100" ry="80" />
        <ellipse cx="370" cy="660" rx="120" ry="90" />
      </g>

      <g aria-hidden="true">
        {PUNTOS_EN_ORDEN.slice(0, -1).map((_, i) => {
          const hecho = recorrido(estado, DESTINOS[i].id)
          const oculto = !despejado && PUNTOS_EN_ORDEN[i + 1][1] >= NIEBLA
          if (oculto) return null
          return (
            <g key={i}>
              <path d={tramo(PUNTOS_EN_ORDEN, i)} className="camino-borde" />
              <path d={tramo(PUNTOS_EN_ORDEN, i)} className={`camino-tramo${hecho ? ' hecho' : ''}`} />
            </g>
          )
        })}
      </g>

      {!despejado && (
        <rect x="0" y={NIEBLA - 70} width={LIENZO.ancho} height={LIENZO.alto - NIEBLA + 70}
          fill="url(#niebla)" aria-hidden="true" />
      )}

      {visibles.map((d) => {
        const [x, y] = PUNTOS[d.id]
        const Dibujo = DIBUJO[d.id]
        const puede = abierto(estado, d.id)
        const hecho = recorrido(estado, d.id)
        const aqui = d.id === siguiente && !hecho
        const clase = `destino${puede ? ' abierto' : ' cerrado'}${hecho ? ' hecho' : ''}${aqui ? ' aqui' : ''}`
        const contenido = (
          <>
            {aqui && <circle r="42" className="halo" />}
            <circle r="38" className="parcela" />
            <Dibujo girando={aqui} />
            <text y="58" textAnchor="middle" className="rotulo">{d.nombre}</text>
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
    </svg>
  )
}
