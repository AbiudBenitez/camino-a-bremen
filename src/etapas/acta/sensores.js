/**
 * Señales que se muestran MIENTRAS el estudiante escribe.
 *
 * Miden, no califican. Nunca dicen que algo está mal: eso se reserva para
 * cuando el estudiante pida el veredicto. Subrayar en rojo mientras alguien
 * redacta enseña a tenerle miedo al campo.
 */
const ALIENTO = 25   // palabras que el burro dice poder recordar

const palabras = (t) => String(t ?? '').trim().split(/\s+/).filter(Boolean).length

export function sensor(campo, valor) {
  if (campo === 'vision') {
    const n = palabras(valor)
    if (!n) return null
    return {
      texto: `${n} palabra${n === 1 ? '' : 's'}`,
      // El burro se queda sin aliento; no es penalización, es un límite legible.
      tension: Math.min(1, n / ALIENTO),
      nota: n > ALIENTO ? 'al burro se le acaba el aliento' : null,
    }
  }
  if (campo === 'medidas') {
    const n = (valor ?? []).filter((m) => String(m).trim()).length
    const conCifra = (valor ?? []).filter((m) => /\d/.test(m)).length
    return { texto: `${n} medida${n === 1 ? '' : 's'} · ${conCifra} con cifra`, tension: 0, nota: null }
  }
  const n = palabras(valor)
  return n ? { texto: `${n} palabra${n === 1 ? '' : 's'}`, tension: 0, nota: null } : null
}
