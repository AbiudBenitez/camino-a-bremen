/**
 * Dibujos provisionales de los destinos en el mapa, con el origen en el punto
 * de apoyo (el centro de su base). Se sustituyen por las ilustraciones hechas a
 * mano cuando lleguen. Usan los símbolos `#pino` y `#roble` del mapa.
 */

const ASPA = (giro) => (
  <g transform={`rotate(${giro})`}>
    <rect x="-4" y="-92" width="8" height="86" fill="#f3ead6" stroke="#6b5a45" strokeWidth="1.2" />
    <path d="M-4 -30 h8 M-4 -50 h8 M-4 -70 h8 M0 -92 v86" stroke="#6b5a45" strokeWidth="0.8" />
  </g>
)

export function MolinoMapa({ girando }) {
  return (
    <g>
      <ellipse cx="6" cy="3" rx="64" ry="12" fill="#000" opacity="0.16" />
      <ellipse rx="56" ry="11" fill="#c9a46c" />
      <path d="M-30 0 L-20 -110 L20 -110 L30 0 Z" fill="#e8dfca" stroke="#6b5a45" strokeWidth="1.5" />
      <path d="M4 0 L4 -110 L20 -110 L30 0 Z" fill="#000" opacity="0.08" />
      <path d="M-24 -30 h12 M-6 -54 h14 M-20 -78 h10 M8 -20 h12 M2 -90 h12" stroke="#b9ab90" strokeWidth="1.5" />
      <path d="M-26 -108 Q0 -152 26 -108 Z" fill="#7a4a32" stroke="#4a2e20" strokeWidth="1.5" />
      <path d="M-8 0 V-20 a8 8 0 0 1 16 0 V0 Z" fill="#5b3a26" />
      <rect x="-5" y="-72" width="10" height="13" rx="1" fill="#3d4b57" className="ventana" />
      <ellipse cx="38" cy="-6" rx="10" ry="7" fill="#d8c08a" stroke="#a88d55" />
      <ellipse cx="50" cy="-4" rx="8" ry="6" fill="#e0c995" stroke="#a88d55" />
      <g transform="translate(0 -112)">
        <g className={girando ? 'aspas girando' : 'aspas'}>
          {[18, 108, 198, 288].map((a) => <g key={a}>{ASPA(a)}</g>)}
        </g>
        <circle r="6" fill="#4a2e20" />
      </g>
    </g>
  )
}

export function CasetaMapa() {
  return (
    <g>
      <ellipse cx="4" cy="3" rx="64" ry="11" fill="#000" opacity="0.16" />
      <path d="M-62 -2 V-26 M-46 -2 V-26 M-30 -2 V-26 M-66 -20 H-26 M-66 -10 H-26" stroke="#7a5a3a" strokeWidth="3" strokeLinecap="round" />
      <rect x="-20" y="-34" width="40" height="34" fill="#9a5b34" stroke="#5b3a26" strokeWidth="1.5" />
      <path d="M-20 -24 h40 M-20 -14 h40" stroke="#7d4a2a" strokeWidth="1" />
      <path d="M-26 -32 L0 -56 L26 -32 Z" fill="#b5432f" stroke="#7a2c20" strokeWidth="1.5" />
      <path d="M-8 0 V-14 a8 8 0 0 1 16 0 V0 Z" fill="#2b2620" />
      <ellipse cx="40" cy="-8" rx="19" ry="8" fill="#b07a46" stroke="#5b3a26" strokeWidth="1.2" />
      <circle cx="57" cy="-15" r="7.5" fill="#b07a46" stroke="#5b3a26" strokeWidth="1.2" />
      <ellipse cx="54" cy="-12" rx="3" ry="6" fill="#7d4f2a" />
      <ellipse cx="64" cy="-13" rx="3" ry="2" fill="#2b2620" />
      <ellipse cx="26" cy="-2" rx="7" ry="3" fill="#6b7d8a" />
    </g>
  )
}

export function CasaGatoMapa() {
  return (
    <g>
      <ellipse cx="4" cy="3" rx="60" ry="11" fill="#000" opacity="0.16" />
      <rect x="-40" y="-50" width="80" height="50" fill="#efe2c4" stroke="#6b5a45" strokeWidth="1.5" />
      <path d="M-40 -25 H40 M-14 -50 V0 M14 -50 V0" stroke="#7d5a3a" strokeWidth="2" />
      <path d="M-48 -48 L0 -90 L48 -48 Z" fill="#b5432f" stroke="#7a2c20" strokeWidth="1.5" />
      <path d="M-36 -58 H36 M-24 -69 H24 M-12 -80 H12" stroke="#93352a" strokeWidth="1.2" />
      <rect x="18" y="-86" width="10" height="24" fill="#8c5a40" stroke="#5b3a26" />
      <circle cx="26" cy="-96" r="6" fill="#e9eef1" opacity="0.8" />
      <circle cx="32" cy="-108" r="8" fill="#e9eef1" opacity="0.6" />
      <rect x="-6" y="-22" width="12" height="22" fill="#5b3a26" />
      <rect x="-32" y="-44" width="12" height="12" fill="#9fc3d6" stroke="#5b3a26" className="ventana" />
      <rect x="20" y="-44" width="12" height="12" fill="#9fc3d6" stroke="#5b3a26" className="ventana" />
      <ellipse cx="-14" cy="-82" rx="8" ry="5" fill="#3f3f48" />
      <circle cx="-6" cy="-87" r="4.5" fill="#3f3f48" />
      <path d="M-9 -90 L-8 -96 L-5 -91 M-3 -91 L-1 -96 L0 -90" fill="#3f3f48" stroke="#3f3f48" />
      <path d="M-21 -82 q-8 -2 -6 -12" fill="none" stroke="#3f3f48" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  )
}

export function GallineroMapa() {
  return (
    <g>
      <ellipse cy="3" rx="62" ry="11" fill="#000" opacity="0.16" />
      <path d="M-56 -2 V-24 M-40 -2 V-24 M-24 -2 V-24 M40 -2 V-24 M56 -2 V-24 M-60 -18 H-20 M36 -18 H60 M-60 -9 H-20 M36 -9 H60" stroke="#7a5a3a" strokeWidth="3" strokeLinecap="round" />
      <rect x="-16" y="-36" width="40" height="36" fill="#8a5a3b" stroke="#5b3a26" strokeWidth="1.5" />
      <path d="M-22 -34 L4 -56 L30 -34 Z" fill="#b5432f" stroke="#7a2c20" strokeWidth="1.5" />
      <path d="M-10 0 L-26 -14" stroke="#c9a46c" strokeWidth="3" />
      <rect x="-6" y="-24" width="10" height="12" fill="#2b2620" />
      <ellipse cx="44" cy="-8" rx="12" ry="8" fill="#e3c873" stroke="#a88d55" />
      <g transform="translate(-56 -30)">
        <path d="M-4 0 q-10 -10 -2 -18 q0 8 6 10" fill="#2f6b3f" />
        <circle cx="2" cy="-2" r="7" fill="#c8452e" />
        <circle cx="7" cy="-10" r="4.5" fill="#c8452e" />
        <path d="M4 -15 q1 -4 3 -1 q1 -4 3 -1" fill="#d23a2a" />
        <path d="M11 -11 L15 -9 L11 -7 Z" fill="#f2c14e" />
      </g>
    </g>
  )
}

// Las filas del bosque, de atrás hacia adelante: [x, y, ancho, alto, especie].
const FILAS = [
  [-124, -118, 24, 44, 'pino'], [-100, -124, 26, 48, 'pino'], [-74, -128, 26, 48, 'pino'],
  [-48, -132, 28, 50, 'pino'], [-20, -130, 26, 48, 'pino'], [6, -134, 28, 50, 'pino'],
  [34, -130, 26, 48, 'pino'], [60, -126, 26, 46, 'pino'], [86, -120, 24, 44, 'pino'], [110, -112, 22, 40, 'pino'],
  [-136, -98, 46, 56, 'roble'], [-98, -104, 50, 60, 'roble'], [-56, -100, 30, 56, 'pino'],
  [-30, -108, 54, 64, 'roble'], [18, -102, 30, 56, 'pino'], [44, -104, 50, 60, 'roble'],
  [92, -96, 28, 52, 'pino'], [110, -90, 40, 50, 'roble'],
  [-146, -68, 32, 60, 'pino'], [-118, -72, 56, 68, 'roble'], [-66, -66, 34, 62, 'pino'],
  [-38, -76, 64, 76, 'roble'], [22, -66, 34, 62, 'pino'], [50, -72, 58, 70, 'roble'], [104, -62, 30, 56, 'pino'],
  [-104, -50, 50, 60, 'roble'], [-20, -50, 32, 56, 'pino'], [72, -46, 48, 56, 'roble'],
]

/** Un bosque con volumen: muchas filas de árboles sobre una masa oscura. */
export function BosqueMapa() {
  return (
    <g>
      <path d="M-144 0 C-146 -40 -116 -78 -66 -90 C-16 -102 44 -98 94 -90 C136 -82 154 -50 144 0 Z" fill="#2c4a2a" />
      {FILAS.map(([x, y, w, h, e], i) => <use key={i} href={`#${e}`} x={x} y={y} width={w} height={h} />)}
    </g>
  )
}

/** La casa de los ladrones, con la ventana encendida: la luz que vio el gallo. */
export function CasaLadronesMapa() {
  return (
    <g>
      <ellipse cx="4" cy="3" rx="70" ry="12" fill="#000" opacity="0.18" />
      <circle cx="-14" cy="-34" r="30" fill="#ffcf6b" opacity="0.25" />
      <rect x="-50" y="-60" width="100" height="60" fill="#d9c9a6" stroke="#5b4a36" strokeWidth="1.5" />
      <path d="M-50 -30 H50 M-20 -60 V0 M20 -60 V0" stroke="#6b4a2e" strokeWidth="2" />
      <path d="M-58 -58 L0 -102 L58 -58 Z" fill="#5c3a2a" stroke="#3a2418" strokeWidth="1.5" />
      <rect x="-36" y="-50" width="16" height="14" fill="#ffcf6b" stroke="#3a2418" />
      <rect x="22" y="-26" width="14" height="26" fill="#3a2418" />
    </g>
  )
}

/** El acto final: la pirámide de la banda frente a la ventana. */
export function FinalMapa() {
  return (
    <g>
      <ellipse cx="2" cy="3" rx="40" ry="8" fill="#000" opacity="0.18" />
      <ellipse cy="-10" rx="22" ry="11" fill="#8f8a86" stroke="#2b2620" />
      <ellipse cy="-28" rx="15" ry="8" fill="#b07a46" stroke="#2b2620" />
      <ellipse cy="-42" rx="10" ry="6" fill="#4a4a52" stroke="#2b2620" />
      <circle cy="-54" r="7" fill="#c8452e" stroke="#2b2620" />
      <circle cx="30" cy="-74" r="10" fill="#ffcf6b" />
    </g>
  )
}
