import { cita } from '../motor/contrato.js'

/** Pinta hallazgos. No sabe de actas ni de EDT: solo del contrato (regla de diseño 8). */
export default function Hallazgos({ resultado }) {
  if (!resultado) return null
  const { hallazgos, resumen } = resultado

  return (
    <div className="hallazgos">
      <p className={resumen.pasa ? 'veredicto bien' : 'veredicto mal'}>
        {resumen.pasa
          ? `Sin incumplimientos. ${resumen.reglas} reglas revisadas.`
          : `${resumen.errores} incumplimiento(s) y ${resumen.avisos} aviso(s) en ${resumen.reglas} reglas.`}
      </p>
      <ul>
        {hallazgos.map((h, i) => (
          <li key={`${h.regla}-${i}`} className={h.gravedad}>
            <span className="etiqueta">{h.gravedad === 'error' ? 'Falta' : 'Aviso'}</span>
            <span className="mensaje">{h.mensaje}</span>
            <span className="fuente">{cita(h.fuente)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
