import { CAMPOS } from './campos.js'

/** El acta completa antes de leérsela al burro. Capturar de uno en uno es
 *  cómodo, pero el acta es un documento y hay que poder verlo entero. */
export default function Revision({ datos, onEditar }) {
  const valor = (c) => {
    const v = datos[c.campo]
    if (c.tipo === 'lista') return (v ?? []).filter((x) => String(x).trim())
    return String(v ?? '').trim()
  }

  return (
    <div className="revision">
      <p className="intro-revision">
        Así quedó tu acta. Puedes tocar cualquier parte para corregirla antes de leérsela.
      </p>
      <dl>
        {CAMPOS.map((c, i) => {
          const v = valor(c)
          const vacio = Array.isArray(v) ? v.length === 0 : v === ''
          return (
            <div key={c.campo} className={`renglon${vacio ? ' vacio' : ''}`}>
              <dt>
                <button type="button" onClick={() => onEditar(i)}>
                  {c.etiqueta}
                  <span className="editar" aria-hidden="true">editar</span>
                </button>
              </dt>
              <dd>
                {vacio && <span className="sin-llenar">Sin llenar</span>}
                {!vacio && Array.isArray(v) && (
                  <ul>{v.map((x, j) => <li key={j}>{x}</li>)}</ul>
                )}
                {!vacio && !Array.isArray(v) && v}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
