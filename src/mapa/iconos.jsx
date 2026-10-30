/** Íconos de los botones redondos. Siempre acompañados de nombre accesible y `title`. */
const BASE = { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor',
  strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export function IconoMusica({ callada }) {
  return (
    <svg {...BASE}>
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
      {callada && <path d="M3 3l18 18" />}
    </svg>
  )
}

/** Un timbal: el instrumento del perro, y la banda entera. */
export function IconoBanda() {
  return (
    <svg {...BASE}>
      <ellipse cx="12" cy="9" rx="8" ry="3" />
      <path d="M4 9v6c0 1.7 3.6 3 8 3s8-1.3 8-3V9" />
      <path d="M15 2l-3 6M9 2l3 6" />
    </svg>
  )
}

export function IconoExpediente() {
  return (
    <svg {...BASE}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M12 11v5M9.5 13.5L12 16l2.5-2.5" />
    </svg>
  )
}
