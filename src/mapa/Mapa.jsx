import { abierto, actual, recorrido } from '../destinos/catalogo.js'
import Ilustracion from '../ilustraciones/Ilustracion.jsx'
import { ruta } from '../ilustraciones/catalogo.js'
import { DESTINO_MAPA } from './indice.js'
import { CAMINO, ESCALA, LIENZO, PUNTOS, VEREDAS, visibles } from './trazo.js'

const { ancho: W, alto: H } = LIENZO
const LOSA = { g: 'losas-g', m: 'losas-m', c: 'losas-c', x: 'losas-x' }

// Cerca de madera a los lados del tramo cercano: travesaño alto, bajo y postes [x, y, alto].
const CERCAS = [
  { alto: 'M296 862 L340 810 L392 776 L440 758', bajo: 'M296 842 L340 794 L392 763 L440 747', grosor: 6,
    postes: [[296, 886, 56], [340, 830, 46], [391, 792, 36], [440, 770, 30]] },
  { alto: 'M404 862 L452 826 L500 804 L548 798', bajo: 'M404 842 L452 810 L500 791 L548 787', grosor: 6,
    postes: [[404, 882, 54], [452, 840, 42], [499, 814, 34], [548, 806, 30]] },
  { alto: 'M600 731 L680 724 L760 720 L840 711 L900 688', bajo: 'M600 722 L680 716 L760 713 L840 704 L900 682', grosor: 4,
    postes: [[600, 740, 26], [680, 732, 24], [759, 728, 22], [839, 718, 20], [899, 694, 18]] },
  { alto: 'M620 790 L700 784 L780 780 L860 766', bajo: 'M620 780 L700 775 L780 771 L860 758', grosor: 5,
    postes: [[620, 800, 28], [700, 792, 26], [780, 788, 24], [859, 774, 22]] },
]

// Detalle de la tierra del frente: [símbolo, x, y, ancho, alto].
const FRENTE = [
  ['arbusto', -60, 760, 260, 140], ['arbusto', 120, 820, 200, 110], ['arbusto', 1360, 740, 280, 150],
  ['arbusto', 1240, 820, 200, 110], ['arbusto', 1300, 620, 120, 64],
  ['espiga', 150, 720, 40, 124], ['espiga', 176, 730, 36, 112], ['espiga', 560, 812, 36, 110], ['espiga', 1450, 700, 40, 124],
  ['roca', 190, 840, 110, 50], ['roca', 660, 846, 90, 42], ['roca', 1180, 790, 100, 46],
]

/**
 * El mapa: un valle con montañas al fondo y la tierra al frente. El progreso es
 * el cuento: el camino andado tiene luz, el siguiente destino brilla y lo
 * cerrado se ve apagado. No hay otro indicador.
 *
 * La casa y el acto final no existen en el DOM mientras siga la bruma: el giro
 * no se anuncia, ni siquiera a un lector de pantalla.
 *
 * Si ya llegó el fondo dibujado a mano, sustituye al terreno provisional. El
 * camino y los destinos siguen encima, porque cambian con el avance.
 */
export default function Mapa({ estado }) {
  const siguiente = actual(estado).id
  const despejado = abierto(estado, 'casa')
  const fondo = ruta('mapa-fondo')
  const bruma = ruta('mapa-bruma')

  return (
    <svg className="mapa" viewBox={`0 0 ${W} ${H}`} role="group"
      aria-label="Mapa del camino. Cada destino abierto es un enlace.">
      <Definiciones />

      <g className="cielo" aria-hidden="true">
        <rect width={W} height="380" fill="url(#cielo)" />
        <circle cx="1230" cy="150" r="210" className="sol-halo" opacity="0.16" />
        <circle cx="1230" cy="150" r="96" className="sol-halo" opacity="0.35" />
        <circle cx="1230" cy="150" r="38" className="sol" />
        {[[-80, 30, 420, 180], [280, 0, 320, 140], [560, 60, 360, 155], [180, 150, 240, 100], [860, 10, 260, 110]]
          .map(([x, y, w, h]) => <use key={x} href="#nube" x={x} y={y} width={w} height={h} />)}
      </g>

      <g className="escenario" aria-hidden="true">
        {fondo
          ? <image href={fondo} x="0" y="0" width={W} height={H} preserveAspectRatio="xMidYMid slice" />
          : <Terreno />}

        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {CAMINO.map((t, i) => (
            <g key={i}>
              {t.ancho >= 40 && <path d={t.d} className="orilla" strokeWidth={t.ancho + 18} />}
              <path d={t.d} className="junta" strokeWidth={t.ancho + 6} />
              <path d={t.d} stroke={`url(#${LOSA[t.losa]})`} strokeWidth={t.ancho} />
              <path d={t.d} className={t.tras === null || recorrido(estado, t.tras) ? 'andado' : 'por-andar'}
                strokeWidth={t.ancho} />
            </g>
          ))}
          {Object.entries(VEREDAS).map(([id, v]) => (
            <g key={id}>
              <path d={v.d} className="junta" strokeWidth={v.ancho + 4} />
              <path d={v.d} stroke={`url(#${LOSA[v.losa]})`} strokeWidth={v.ancho} />
            </g>
          ))}
        </g>

        {CERCAS.map((c, i) => (
          <g key={i} className="cerca">
            <path d={c.alto} strokeWidth={c.grosor} />
            <path d={c.bajo} strokeWidth={c.grosor - 1} />
            {c.postes.map(([x, y, h]) => (
              <rect key={x} x={x - h * 0.08} y={y - h} width={Math.max(5, h * 0.16)} height={h} rx="2" />
            ))}
          </g>
        ))}

        {!fondo && FRENTE.map(([s, x, y, w, h], i) => <use key={i} href={`#${s}`} x={x} y={y} width={w} height={h} />)}
      </g>

      {visibles(estado).map((d) => {
        const [x, y] = PUNTOS[d.id]
        const k = ESCALA[d.id]
        const Dibujo = DESTINO_MAPA[d.id]
        const puede = abierto(estado, d.id)
        const hecho = recorrido(estado, d.id)
        const aqui = d.id === siguiente && !hecho
        const contenido = (
          <>
            {aqui && <ellipse cx={x} cy={y + 4} rx={100 * k} ry={24 * k} className="halo" />}
            <Ilustracion clave={`destino-${d.id}`} x={x} y={y} ancho={200 * k}>
              <g transform={`translate(${x} ${y}) scale(${k})`}><Dibujo girando={aqui} /></g>
            </Ilustracion>
          </>
        )
        return (
          <g key={d.id} className={`destino${puede ? ' abierto' : ' cerrado'}${hecho ? ' hecho' : ''}${aqui ? ' aqui' : ''}`}>
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
        <g className="bruma" aria-hidden="true">
          {bruma
            ? <image href={bruma} x="0" y="0" width={W} height={H} preserveAspectRatio="xMidYMid slice" />
            : [[1420, 380, 300, 78], [1330, 420, 230, 52], [1500, 330, 200, 56], [1260, 372, 120, 34], [1480, 450, 200, 40]]
                .map(([cx, cy, rx, ry]) => <ellipse key={cx + cy} cx={cx} cy={cy} rx={rx} ry={ry} />)}
        </g>
      )}
    </svg>
  )
}

/** El terreno provisional: montañas, valle y tierra. Lo sustituye el fondo dibujado a mano. */
function Terreno() {
  return (
    <g>
      <path d="M0 300 L80 282 L150 292 L240 262 L330 286 L420 270 L520 290 L620 258 L720 284 L820 268 L930 288 L1040 262 L1150 286 L1260 270 L1380 290 L1480 266 L1600 284 L1600 352 L0 352 Z" className="montana-1" />
      <path d="M0 322 C80 305 160 312 240 300 C330 288 400 316 500 306 C600 296 680 318 780 300 C880 284 960 312 1060 302 C1160 292 1240 318 1340 304 C1440 292 1520 310 1600 302 L1600 354 L0 354 Z" className="montana-2" />
      <path d="M0 340 C120 326 240 334 360 328 C520 320 640 340 800 332 C960 324 1100 342 1260 334 C1400 328 1500 338 1600 334 L1600 358 L0 358 Z" className="montana-3" />
      <rect x="0" y="250" width={W} height="110" fill="url(#bruma-horizonte)" />
      <path d="M0 350 L1600 350 L1600 560 C1300 548 1100 590 900 575 C650 556 400 585 0 570 Z" fill="url(#valle)" />
      <rect x="0" y="352" width={W} height="70" fill="url(#matorral-lejos)" opacity="0.8" />
      <path d="M0 420 L1600 420 L1600 560 C1300 548 1100 590 900 575 C650 556 400 585 0 570 Z" fill="url(#matorral)" opacity="0.85" />
      <path d="M120 380 L270 374 L290 400 L130 408 Z" className="parcela" />
      <path d="M1260 470 L1440 462 L1470 500 L1270 510 Z" className="parcela" />
      <path d="M60 452 C180 440 260 470 330 500 C400 528 470 540 520 552" fill="none" stroke="url(#agua)" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="300" cy="356" rx="300" ry="14" className="neblina" />
      <ellipse cx="820" cy="360" rx="260" ry="12" className="neblina" />
      <use href="#pino" x="1000" y="440" width="22" height="40" />
      <use href="#roble" x="1180" y="420" width="34" height="42" />
      <path d="M0 570 C400 585 650 556 900 575 C1100 590 1300 548 1600 560 L1600 900 L0 900 Z" fill="url(#suelo)" />
      <path d="M0 570 C400 585 650 556 900 575 C1100 590 1300 548 1600 560 L1600 900 L0 900 Z" fill="url(#pedregal)" />
      <path d="M0 570 C400 585 650 556 900 575 C1100 590 1300 548 1600 560" fill="none" stroke="#8f6a3e" strokeWidth="8" opacity="0.35" />
    </g>
  )
}

/** Degradados, texturas y símbolos que comparte todo el mapa. */
function Definiciones() {
  return (
    <defs>
      {/* Filtros SVG y no CSS: Safari no aplica filter: brightness() a partes de un SVG. */}
      <filter id="oscurecer"><feColorMatrix type="matrix"
        values="0.42 0.06 0 0 0  0.04 0.45 0.04 0 0  0.04 0.08 0.56 0 0  0 0 0 1 0" /></filter>
      <filter id="apagado"><feColorMatrix type="saturate" values="0.45" /></filter>
      <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="var(--cielo-alto)" />
        <stop offset="0.45" stopColor="var(--cielo-medio)" />
        <stop offset="0.8" stopColor="var(--cielo-bajo)" />
        <stop offset="1" stopColor="var(--horizonte)" />
      </linearGradient>
      <linearGradient id="bruma-horizonte" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="1" stopColor="#f6efe0" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="valle" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a9a96a" />
        <stop offset="1" stopColor="#8f9a52" />
      </linearGradient>
      <linearGradient id="suelo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#cfa165" />
        <stop offset="0.6" stopColor="#bb8a52" />
        <stop offset="1" stopColor="#9c6c40" />
      </linearGradient>
      <linearGradient id="nube-luz" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="var(--nube)" />
        <stop offset="1" stopColor="var(--nube-sombra)" />
      </linearGradient>
      <linearGradient id="agua" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#b6e1f2" />
        <stop offset="1" stopColor="#5aa4cc" />
      </linearGradient>
      <linearGradient id="madera" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#b9643a" />
        <stop offset="1" stopColor="#7f3c22" />
      </linearGradient>
      {/* Las losas: piedras irregulares con juntas oscuras; cuatro tamaños para la distancia. */}
      <g id="losas">
        <rect width="64" height="44" fill="#4b4e4a" />
        <path d="M2 2 L27 3 L25 18 L3 19 Z" fill="#9a9d97" />
        <path d="M30 2 L62 4 L59 15 L29 20 Z" fill="#878a84" />
        <path d="M3 22 L21 21 L23 42 L2 41 Z" fill="#a9aca5" />
        <path d="M25 22 L45 19 L44 41 L26 42 Z" fill="#8f928c" />
        <path d="M48 18 L62 18 L62 42 L47 42 Z" fill="#9c9f99" />
        <path d="M3 3 L26 4 M31 3 L60 5 M4 23 L20 22 M26 23 L44 20 M49 19 L61 19" stroke="#c8cbc4" strokeWidth="1.2" opacity="0.7" />
      </g>
      {[['losas-g', 1], ['losas-m', 0.72], ['losas-c', 0.5], ['losas-x', 0.32]].map(([id, k]) => (
        <pattern key={id} id={id} width="64" height="44" patternUnits="userSpaceOnUse" patternTransform={`scale(${k})`}>
          <use href="#losas" />
        </pattern>
      ))}
      <pattern id="matorral-lejos" width="18" height="9" patternUnits="userSpaceOnUse">
        <circle cx="4" cy="4" r="2.1" fill="#5f6b3a" />
        <circle cx="13" cy="7" r="1.6" fill="#6a7642" />
      </pattern>
      <pattern id="matorral" width="48" height="26" patternUnits="userSpaceOnUse">
        <circle cx="8" cy="10" r="5" fill="#5a6b34" />
        <circle cx="6" cy="8" r="2.2" fill="#7f8f4c" />
        <circle cx="32" cy="20" r="4" fill="#5d6e36" />
        <circle cx="30" cy="18" r="1.8" fill="#82924f" />
      </pattern>
      <pattern id="pedregal" width="70" height="44" patternUnits="userSpaceOnUse">
        <ellipse cx="10" cy="12" rx="3.5" ry="2" fill="#8e6440" opacity="0.55" />
        <ellipse cx="44" cy="30" rx="2.5" ry="1.5" fill="#f1d9ae" opacity="0.55" />
        <ellipse cx="58" cy="8" rx="2" ry="1.2" fill="#8e6440" opacity="0.5" />
        <path d="M24 38 l-3 -8 M26 38 l0 -9 M28 38 l3 -7" stroke="#8d8c45" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M62 26 l-2 -6 M64 26 l1 -7" stroke="#8d8c45" strokeWidth="1.2" strokeLinecap="round" />
      </pattern>
      <symbol id="nube" viewBox="-130 -70 260 110" overflow="visible">
        <ellipse cy="18" rx="120" ry="26" fill="url(#nube-luz)" />
        <circle cx="-62" cy="4" r="34" fill="url(#nube-luz)" />
        <circle cx="-20" cy="-18" r="46" fill="url(#nube-luz)" />
        <circle cx="30" cy="-26" r="52" fill="url(#nube-luz)" />
        <circle cx="78" cy="-2" r="36" fill="url(#nube-luz)" />
      </symbol>
      <symbol id="pino" viewBox="-22 -70 44 80" overflow="visible">
        <ellipse cy="6" rx="16" ry="4" fill="#000" opacity="0.18" />
        <rect x="-3" y="-8" width="6" height="14" fill="#6b4a2e" />
        <path d="M0 -66 L-14 -36 L-8 -36 L-18 -14 L-10 -14 L-20 4 L20 4 L10 -14 L18 -14 L8 -36 L14 -36 Z" fill="#3f6b3c" />
        <path d="M0 -66 L14 -36 L8 -36 L18 -14 L10 -14 L20 4 L0 4 Z" fill="#2f5530" />
      </symbol>
      <symbol id="roble" viewBox="-34 -74 68 84" overflow="visible">
        <ellipse cy="6" rx="26" ry="6" fill="#000" opacity="0.18" />
        <path d="M-4 6 L-3 -22 L-10 -32 M3 -22 L10 -34 M-3 -22 L4 -22 L4 6 Z" fill="#6b4a2e" stroke="#6b4a2e" strokeWidth="3" />
        <circle cx="-16" cy="-38" r="18" fill="#5c8a45" />
        <circle cx="14" cy="-40" r="20" fill="#4f7d3d" />
        <circle cx="-2" cy="-56" r="20" fill="#6b9a4f" />
        <circle cx="-6" cy="-60" r="9" fill="#82b064" opacity="0.8" />
      </symbol>
      <symbol id="arbusto" viewBox="-60 -50 120 60" overflow="visible">
        <ellipse cy="6" rx="52" ry="8" fill="#000" opacity="0.18" />
        <circle cx="-30" cy="-12" r="20" fill="#5b6a33" />
        <circle cy="-24" r="26" fill="#66773a" />
        <circle cx="30" cy="-10" r="20" fill="#56662f" />
        <circle cx="-8" cy="-34" r="10" fill="#8b9a55" opacity="0.8" />
        <circle cx="22" cy="-20" r="7" fill="#8b9a55" opacity="0.7" />
      </symbol>
      <symbol id="roca" viewBox="-40 -30 80 36" overflow="visible">
        <ellipse cx="2" cy="4" rx="36" ry="6" fill="#000" opacity="0.2" />
        <path d="M-34 4 L-26 -16 L-6 -26 L18 -22 L34 -6 L30 4 Z" fill="#9b8a76" />
        <path d="M-26 -16 L-6 -26 L18 -22 L6 -12 L-18 -10 Z" fill="#c6b6a0" />
        <path d="M6 -12 L18 -22 L34 -6 L30 4 L8 4 Z" fill="#7f6f5d" />
      </symbol>
      <symbol id="espiga" viewBox="-10 -60 20 62" overflow="visible">
        <path d="M0 0 C-1 -20 -2 -36 -4 -50" stroke="#a7954f" strokeWidth="1.6" fill="none" />
        <path d="M-4 -50 C-8 -54 -7 -60 -3 -60 C0 -56 -1 -52 -4 -50 Z" fill="#e8dcb0" />
        <path d="M2 0 C3 -16 5 -30 8 -42" stroke="#a7954f" strokeWidth="1.4" fill="none" />
        <path d="M8 -42 C5 -47 7 -52 10 -52 C12 -48 11 -44 8 -42 Z" fill="#efe4bd" />
      </symbol>
    </defs>
  )
}

