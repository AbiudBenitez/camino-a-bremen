/**
 * Dibujos del mapa y de la banda. Cada uno es su propio componente y todos sus
 * colores son variables de CSS: la noche los recolorea sola, y una ilustración
 * humana puede sustituir cualquiera sin tocar el juego.
 *
 * Los de destino están centrados en el origen y caben en ±36.
 */

const c = (token) => `var(--${token})`
const TRAZO = { stroke: c('contorno'), strokeWidth: 1.4, strokeLinejoin: 'round' }

export function Molino({ girando }) {
  return (
    <g>
      <path d="M-15 30 L-10 -12 L10 -12 L15 30 Z" fill={c('muro')} {...TRAZO} />
      <path d="M-13 -12 L0 -25 L13 -12 Z" fill={c('techo')} {...TRAZO} />
      <path d="M-4 30 V18 a4 4 0 0 1 8 0 V30" fill={c('madera')} {...TRAZO} />
      <g transform="translate(0 -15)">
        <g className={girando ? 'aspas girando' : 'aspas'}>
          {[0, 90, 180, 270].map((a) => (
            <rect key={a} x="-3" y="-30" width="6" height="28" rx="1.5" transform={`rotate(${a})`}
              fill={c('hoja')} {...TRAZO} />
          ))}
        </g>
        <circle r="3" fill={c('madera')} {...TRAZO} />
      </g>
    </g>
  )
}

export function Caseta() {
  return (
    <g>
      <rect x="-18" y="-2" width="30" height="26" fill={c('madera')} {...TRAZO} />
      <path d="M-22 -2 L-3 -20 L16 -2 Z" fill={c('techo')} {...TRAZO} />
      <path d="M-9 24 V12 a6 6 0 0 1 12 0 V24" fill={c('tinta')} />
      <ellipse cx="24" cy="20" rx="10" ry="5" fill={c('pelaje-perro')} {...TRAZO} />
      <circle cx="31" cy="15" r="4.5" fill={c('pelaje-perro')} {...TRAZO} />
    </g>
  )
}

export function Tejado() {
  return (
    <g>
      <rect x="-20" y="2" width="40" height="24" fill={c('muro')} {...TRAZO} />
      <path d="M-25 2 L0 -16 L25 2 Z" fill={c('techo')} {...TRAZO} />
      <rect x="10" y="-16" width="6" height="10" fill={c('madera')} {...TRAZO} />
      <rect x="-6" y="10" width="10" height="9" fill={c('cielo')} {...TRAZO} />
      <ellipse cx="-8" cy="-8" rx="6" ry="4" fill={c('pelaje-gato')} />
      <circle cx="-2" cy="-12" r="3.6" fill={c('pelaje-gato')} />
      <path d="M-5 -14 L-4 -19 L-2 -15 M0 -15 L1.5 -19 L2 -14" fill={c('pelaje-gato')} stroke={c('pelaje-gato')} />
      <path d="M-14 -8 q-6 -2 -5 -9" fill="none" stroke={c('pelaje-gato')} strokeWidth="2" strokeLinecap="round" />
    </g>
  )
}

export function Corral() {
  return (
    <g>
      <rect x="-6" y="-6" width="26" height="22" fill={c('madera')} {...TRAZO} />
      <path d="M-9 -6 L7 -18 L23 -6 Z" fill={c('techo')} {...TRAZO} />
      {[-26, -19, -12].map((x) => <rect key={x} x={x} y="2" width="3" height="20" fill={c('muro')} {...TRAZO} />)}
      <path d="M-28 8 H-8 M-28 15 H-8" stroke={c('madera')} strokeWidth="2.5" />
      <circle cx="-17" cy="-6" r="6" fill={c('pluma-gallo')} {...TRAZO} />
      <path d="M-20 -12 q2 -4 3 0 q2 -4 3 0" fill={c('lapiz')} />
    </g>
  )
}

export function Bosque() {
  const pino = (x, y, s, tono) => (
    <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2" y="10" width="4" height="8" fill={c('madera')} />
      <path d="M0 -22 L-12 0 L-7 0 L-15 12 L15 12 L7 0 L12 0 Z" fill={c(tono)} {...TRAZO} />
    </g>
  )
  return <g>{[pino(-16, 4, 1, 'bosque-2'), pino(16, 6, 1.05, 'bosque'), pino(0, -6, 1.2, 'bosque')]}</g>
}

export function Casa() {
  return (
    <g>
      <circle cx="-6" cy="6" r="18" fill={c('luz')} opacity="0.25" />
      <rect x="-24" y="-4" width="48" height="30" fill={c('muro')} {...TRAZO} />
      <path d="M-29 -4 L0 -26 L29 -4 Z" fill={c('techo')} {...TRAZO} />
      <rect x="-13" y="2" width="12" height="10" fill={c('luz')} {...TRAZO} />
      <path d="M8 26 V12 h9 V26" fill={c('madera')} {...TRAZO} />
    </g>
  )
}

/** La pirámide de la banda frente a la ventana: el final del cuento. */
export function Final() {
  return (
    <g>
      <circle cx="22" cy="-22" r="9" fill={c('luz')} />
      <circle cx="26" cy="-25" r="8" fill={c('cielo')} />
      <ellipse cx="0" cy="20" rx="16" ry="8" fill={c('pelaje-burro')} {...TRAZO} />
      <ellipse cx="0" cy="6" rx="11" ry="6" fill={c('pelaje-perro')} {...TRAZO} />
      <ellipse cx="0" cy="-5" rx="7" ry="5" fill={c('pelaje-gato')} {...TRAZO} />
      <circle cx="0" cy="-14" r="5" fill={c('pluma-gallo')} {...TRAZO} />
    </g>
  )
}


/* ------------------------------------------------------------ la banda */

const OJO = (x, y) => <circle cx={x} cy={y} r="1.3" fill={c('contorno')} />

export function Burro() {
  return (
    <g>
      <path d="M12 28 q-6 2 -8 8" fill="none" stroke={c('tinta')} strokeWidth="1.5" />
      {[16, 22, 34, 40].map((x) => <rect key={x} x={x} y="32" width="3.5" height="13" fill={c('pelaje-burro')} {...TRAZO} />)}
      <ellipse cx="28" cy="29" rx="17" ry="9" fill={c('pelaje-burro')} {...TRAZO} />
      <ellipse cx="47" cy="18" rx="6" ry="8" transform="rotate(30 47 18)" fill={c('pelaje-burro')} {...TRAZO} />
      <ellipse cx="44" cy="6" rx="2" ry="7" transform="rotate(-10 44 6)" fill={c('pelaje-burro')} {...TRAZO} />
      <ellipse cx="49" cy="6" rx="2" ry="7" transform="rotate(15 49 6)" fill={c('pelaje-burro')} {...TRAZO} />
      {OJO(48, 16)}
    </g>
  )
}

export function Perro() {
  return (
    <g>
      <path d="M12 28 q-6 -6 -4 -12" fill="none" stroke={c('pelaje-perro')} strokeWidth="3" strokeLinecap="round" />
      {[17, 23, 33, 39].map((x) => <rect key={x} x={x} y="32" width="3.5" height="12" fill={c('pelaje-perro')} {...TRAZO} />)}
      <ellipse cx="28" cy="30" rx="15" ry="8" fill={c('pelaje-perro')} {...TRAZO} />
      <circle cx="44" cy="21" r="7" fill={c('pelaje-perro')} {...TRAZO} />
      <ellipse cx="41" cy="23" rx="3" ry="6" fill={c('madera')} />
      <ellipse cx="51" cy="23" rx="3" ry="2" fill={c('tinta')} />
      {OJO(46, 19)}
    </g>
  )
}

export function Gato() {
  return (
    <g>
      <path d="M38 42 q14 -2 10 -16" fill="none" stroke={c('pelaje-gato')} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="30" cy="34" rx="11" ry="12" fill={c('pelaje-gato')} {...TRAZO} />
      <circle cx="30" cy="17" r="8" fill={c('pelaje-gato')} {...TRAZO} />
      <path d="M23 13 L24 4 L28 10 Z M32 10 L36 4 L37 13 Z" fill={c('pelaje-gato')} {...TRAZO} />
      <circle cx="27" cy="16" r="1.4" fill={c('luz')} />
      <circle cx="33" cy="16" r="1.4" fill={c('luz')} />
    </g>
  )
}

export function Gallo() {
  return (
    <g>
      <path d="M18 30 q-10 -14 2 -22 q-2 8 4 12" fill={c('bosque')} {...TRAZO} />
      <path d="M28 40 v6 M34 40 v6" stroke={c('luz')} strokeWidth="2" />
      <ellipse cx="30" cy="30" rx="12" ry="11" fill={c('pluma-gallo')} {...TRAZO} />
      <circle cx="38" cy="16" r="6" fill={c('pluma-gallo')} {...TRAZO} />
      <path d="M34 10 q1 -5 3 -1 q1 -5 3 -1 q2 -4 3 1" fill={c('lapiz')} {...TRAZO} />
      <path d="M44 15 L49 17 L44 19 Z" fill={c('luz')} {...TRAZO} />
      {OJO(39, 15)}
    </g>
  )
}
