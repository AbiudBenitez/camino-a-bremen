import { CAMPOS } from '../etapas/acta/campos.js'

/**
 * El acta que se va armando, en el riel derecho.
 *
 * Hace cuatro cosas a la vez: llena el vacio de la pantalla, convierte el
 * avance en documento que crece en vez de cuenta regresiva, deja los nueve
 * nombres del PMBOK a la vista en todas las pantallas en lugar de una sola, y
 * reencuadra la tarea: no estas contestando, estas redactando un acta a la que
 * le faltan renglones.
 */
export default function ActaHastaAhora({ datos, onIr, pasoDe }) {
  const lleno = (c) => {
    const v = datos[c.campo]
    return Array.isArray(v) ? v.some((x) => String(x).trim()) : String(v ?? '').trim() !== ''
  }
  const hechos = CAMPOS.filter(lleno).length

  return (
    <aside className="acta-hasta-ahora" aria-label="El acta hasta ahora">
      <h3>El acta, hasta ahora</h3>
      <p className="cuantas">{hechos} de {CAMPOS.length} líneas escritas</p>
      <ol>
        {CAMPOS.map((c) => (
          <li key={c.campo} className={lleno(c) ? 'escrito' : 'pendiente'}>
            <button type="button" onClick={() => onIr(pasoDe(c.campo))}>
              <span className="nombre">{c.etiqueta}</span>
              <span className="resumen">
                {lleno(c)
                  ? (Array.isArray(datos[c.campo])
                      ? datos[c.campo].filter(Boolean).join(' · ')
                      : datos[c.campo])
                  : '—'}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </aside>
  )
}
