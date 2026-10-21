import { useState } from 'react'
import { cita } from '../motor/contrato.js'
import { APROBADO, PERSONAJES, vestirTodos } from '../voz/catalogo.js'

/**
 * Pinta hallazgos. Sabe del contrato, no del artefacto: no distingue un acta de
 * una EDT y por eso una etapa nueva no obliga a tocar esto.
 *
 * Los hallazgos salen de uno en uno, escalonados. Volcar siete de golpe es
 * regañar, y el mismo contenido en cola se lee como conversación.
 */
const TANDA = 3

export default function Hallazgos({ resultado, id }) {
  // El contador vuelve a TANDA solo porque quien la usa la monta con key nueva
  // en cada lectura. Reiniciarlo desde un efecto dispararia un render de mas.
  const [visibles, setVisibles] = useState(TANDA)
  if (!resultado) return null
  const { hallazgos, resumen } = resultado
  const vestidos = vestirTodos(
    [...hallazgos].sort((a, b) => (a.gravedad === b.gravedad ? 0 : a.gravedad === 'error' ? -1 : 1)),
  )

  return (
    <section className="hallazgos" id={id} tabIndex={-1} aria-live="polite">
      {resumen.pasa ? (
        <p className="veredicto bien">
          <span className="quien">{PERSONAJES[APROBADO.personaje].nombre}</span>
          {APROBADO.linea}
        </p>
      ) : (
        <p className="veredicto mal">
          {resumen.errores > 0
            ? `Faltan ${resumen.errores} cosa${resumen.errores === 1 ? '' : 's'} por resolver.`
            : 'No falta nada, pero hay algo que conviene mirar.'}
          {resumen.avisos > 0 && ` Y ${resumen.avisos} aviso${resumen.avisos === 1 ? '' : 's'}.`}
        </p>
      )}

      <ol className="anotaciones">
        {vestidos.slice(0, visibles).map((h, i) => (
          <li key={`${h.regla}-${i}`} className={h.gravedad} style={{ '--i': Math.min(i, 6) }}>
            {h.personaje && (
              <p className="dice">
                <span className="quien">{h.personaje.nombre}</span>
                {h.entrada}
              </p>
            )}
            <p className="mensaje">{h.mensaje}</p>
            <p className="fuente">{cita(h.fuente)}</p>
          </li>
        ))}
      </ol>

      {vestidos.length > visibles && (
        <button type="button" className="mas" onClick={() => setVisibles((v) => v + TANDA)}>
          Ver {Math.min(TANDA, vestidos.length - visibles)} más
          <span className="restantes"> · quedan {vestidos.length - visibles}</span>
        </button>
      )}

      <p className="pie-hallazgos">
        {resumen.reglas} reglas revisadas, todas en tu navegador. Puedes corregir y volver a
        intentarlo las veces que quieras.
      </p>
    </section>
  )
}
