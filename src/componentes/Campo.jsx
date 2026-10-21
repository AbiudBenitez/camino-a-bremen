import { sensor } from '../etapas/acta/sensores.js'

/** Cuatro tipos y ninguno más: corto, largo, lista y fecha. */
export default function Campo({ spec, valor, onCambio, onSalir, avisos = [] }) {
  const { campo, etiqueta, tipo, ayuda } = spec
  const id = `campo-${campo}`
  const idAyuda = `${id}-ayuda`
  const s = sensor(campo, valor)

  const comunes = {
    id,
    name: campo,
    'aria-describedby': ayuda ? idAyuda : undefined,
    onBlur: () => onSalir?.(campo),
  }

  return (
    <div className={`campo${avisos.length ? ' con-aviso' : ''}`}>
      <label htmlFor={id}>{etiqueta}</label>
      {ayuda && <p className="ayuda" id={idAyuda}>{ayuda}</p>}

      {tipo === 'largo' && (
        <textarea {...comunes} rows={3} value={valor ?? ''}
          onChange={(e) => onCambio(campo, e.target.value)} />
      )}
      {tipo === 'corto' && (
        <input {...comunes} type="text" value={valor ?? ''}
          onChange={(e) => onCambio(campo, e.target.value)} />
      )}
      {tipo === 'fecha' && (
        <input {...comunes} type="date" value={valor ?? ''}
          onChange={(e) => onCambio(campo, e.target.value)} />
      )}
      {tipo === 'lista' && (
        <ListaDeTextos id={id} comunes={comunes} valor={valor ?? ['']}
          onCambio={(v) => onCambio(campo, v)} />
      )}

      <div className="pie-campo">
        {s && (
          <span className="sensor">
            {s.texto}
            {s.nota && <span className="sensor-nota"> · {s.nota}</span>}
            {s.tension > 0 && (
              <span className="aliento" aria-hidden="true">
                <span style={{ transform: `scaleX(${s.tension})` }} />
              </span>
            )}
          </span>
        )}
        {avisos.map((a, i) => (
          <span className="aviso-campo" key={i}>{a.mensaje}</span>
        ))}
      </div>
    </div>
  )
}

function ListaDeTextos({ id, comunes, valor, onCambio }) {
  const filas = valor.length ? valor : ['']
  const set = (i, v) => onCambio(filas.map((x, j) => (j === i ? v : x)))
  const quitar = (i) => onCambio(filas.filter((_, j) => j !== i))

  return (
    <div className="lista-textos">
      {filas.map((v, i) => (
        <div className="fila-lista" key={i}>
          <input {...comunes} id={i === 0 ? id : `${id}-${i}`} type="text" value={v}
            placeholder={i === 0 ? 'Cuatro integrantes reunidos' : ''}
            onChange={(e) => set(i, e.target.value)} />
          {filas.length > 1 && (
            <button type="button" className="quitar" onClick={() => quitar(i)}
              aria-label={`Quitar la medida ${i + 1}`}>×</button>
          )}
        </div>
      ))}
      <button type="button" className="agregar" onClick={() => onCambio([...filas, ''])}>
        Agregar otra medida
      </button>
    </div>
  )
}
