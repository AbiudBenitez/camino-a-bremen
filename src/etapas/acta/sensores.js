/**
 * Señales que se muestran MIENTRAS el estudiante escribe.
 *
 * Miden, no califican. Nunca dicen que algo está mal: eso se reserva para
 * cuando el estudiante pida el veredicto. Subrayar en rojo mientras alguien
 * redacta enseña a tenerle miedo al campo.
 */
const ALIENTO = 25   // palabras que el burro dice poder recordar

const palabras = (t) => String(t ?? '').trim().split(/\s+/).filter(Boolean).length

// Lo guardado puede no tener la forma que espera esta pantalla: un expediente
// escrito con una version anterior del formulario, o un campo que cambio de
// tipo. Nada de esto debe tumbar la interfaz.
const comoLista = (v) => (Array.isArray(v) ? v : v == null || v === '' ? [] : [v])

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
    const lista = comoLista(valor)
    const n = lista.filter((m) => String(m).trim()).length
    const conCifra = lista.filter((m) => /\d/.test(String(m))).length
    return { texto: `${n} medida${n === 1 ? '' : 's'} · ${conCifra} con cifra`, tension: 0, nota: null }
  }
  const n = palabras(valor)
  return n ? { texto: `${n} palabra${n === 1 ? '' : 's'}`, tension: 0, nota: null } : null
}
