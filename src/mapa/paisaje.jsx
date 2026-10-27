/**
 * Piezas sueltas del paisaje del mapa. Como el resto de los dibujos, sus
 * colores son variables de CSS para que la noche los recoloree.
 */

export function Nube({ x, y, escala = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`} fill="var(--nube)">
      <ellipse cx="0" cy="10" rx="70" ry="24" />
      <circle cx="-28" cy="0" r="26" />
      <circle cx="10" cy="-10" r="34" />
      <circle cx="42" cy="4" r="22" />
    </g>
  )
}

export function Arbol({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-4" y="6" width="8" height="16" fill="var(--madera)" />
      <path d="M0 -34 L-20 4 L-12 4 L-24 20 L24 20 L12 4 L20 4 Z" fill="var(--bosque)"
        stroke="var(--bosque-2)" strokeWidth="2" strokeLinejoin="round" />
    </g>
  )
}

/** Un destino cerrado es una puerta de fase, no un castigo: candado chico, sin drama. */
export function Candado({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`} className="candado">
      <circle r="20" />
      <path d="M-6 -2 V-7 a6 6 0 0 1 12 0 V-2" fill="none" strokeWidth="3" />
      <rect x="-9" y="-2" width="18" height="13" rx="2.5" />
    </g>
  )
}
