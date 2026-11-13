/**
 * Reglas del gallo: el cronograma del viaje por el método de la ruta crítica.
 *
 * El estudiante escribe los cuatro tiempos y la holgura de cada actividad y
 * marca la ruta crítica. La app los VERIFICA, no los calcula: si los calculara,
 * el destino perdería el ejercicio (decisión de producto, ver CLAUDE.md).
 *
 * Cada regla compara una actividad con los números que el propio estudiante
 * escribió en sus vecinas, no con la respuesta. Así el error se queda donde
 * está: si se equivocó en A, C no sale mal por arrastre. Y si todas las
 * relaciones locales cuadran desde el día 0, el cronograma entero es correcto.
 *
 * Convención: el viaje empieza el día 0 y una actividad que termina el día 2
 * deja empezar a la siguiente el día 2.
 *
 * Borrador de las actividades y duraciones del viaje: Abiud. Pendiente de la
 * revisión de Ángel (tarea de H-06).
 */
import { ERROR, fuente, hallazgo } from '../contrato.js'

const RUTA = fuente('PMBOK', '6.5.2.2 Método de la ruta crítica')
const SECUENCIA = fuente('PMBOK', '6.3 Secuenciar las Actividades: método de diagramación por precedencia')

export const ACTIVIDADES = [
  { id: 'A', nombre: 'Juntar provisiones', duracion: 2, antes: [] },
  { id: 'B', nombre: 'Trazar la ruta', duracion: 1, antes: [] },
  { id: 'C', nombre: 'Ensayar la canción', duracion: 4, antes: ['A'] },
  { id: 'D', nombre: 'Caminar hasta el río', duracion: 6, antes: ['A', 'B'] },
  { id: 'E', nombre: 'Arreglo a cuatro voces', duracion: 3, antes: ['C'] },
  { id: 'F', nombre: 'Tocar en Bremen', duracion: 3, antes: ['D', 'E'] },
]

/** Los cinco números de cada renglón, con el nombre que se ve en la tabla. */
export const TIEMPOS = [
  { id: 'it', nombre: 'Inicio temprano', corto: 'IT' },
  { id: 'tt', nombre: 'Finalización temprana', corto: 'FT' },
  { id: 'il', nombre: 'Inicio tardío', corto: 'IL' },
  { id: 'tl', nombre: 'Finalización tardía', corto: 'FL' },
  { id: 'h', nombre: 'Holgura total', corto: 'H' },
]

const POR_ID = Object.fromEntries(ACTIVIDADES.map((a) => [a.id, a]))
export const actividad = (id) => POR_ID[id] ?? null
export const despues = (id) => ACTIVIDADES.filter((a) => a.antes.includes(id))
const lista = (ids) => ids.join(' y ')

/** Lo escrito no se asume con forma: un número entero o nada. */
export function numero(v) {
  if (typeof v === 'number') return Number.isInteger(v) ? v : null
  const s = String(v ?? '').trim()
  return /^\d+$/.test(s) ? Number(s) : null
}

function tiemposDe(gallo) {
  const t = gallo?.tiempos && typeof gallo.tiempos === 'object' ? gallo.tiempos : {}
  return Object.fromEntries(ACTIVIDADES.map((a) => {
    const fila = t[a.id] && typeof t[a.id] === 'object' ? t[a.id] : {}
    return [a.id, Object.fromEntries(TIEMPOS.map((x) => [x.id, numero(fila[x.id])]))]
  }))
}

export function criticasDe(gallo) {
  const c = Array.isArray(gallo?.criticas) ? gallo.criticas : []
  return ACTIVIDADES.map((a) => a.id).filter((id) => c.includes(id))
}

/**
 * La respuesta, solo para encender la red cuando un renglón ya cuadra. Nunca
 * se muestra: el estudiante no ve un número que no haya escrito.
 */
export function resolver() {
  const r = {}
  for (const a of ACTIVIDADES) {
    const it = Math.max(0, ...a.antes.map((p) => r[p].tt))
    r[a.id] = { it, tt: it + a.duracion }
  }
  const fin = Math.max(...ACTIVIDADES.map((a) => r[a.id].tt))
  for (const a of [...ACTIVIDADES].reverse()) {
    const tl = Math.min(fin, ...despues(a.id).map((s) => r[s.id].il))
    Object.assign(r[a.id], { tl, il: tl - a.duracion })
    r[a.id].h = r[a.id].il - r[a.id].it
  }
  return r
}

/** Un renglón cuadra cuando sus cinco números son los del cronograma. */
export function renglonBien(gallo, id) {
  const r = resolver()[id]
  const t = tiemposDe(gallo)[id]
  return TIEMPOS.every((x) => t?.[x.id] === r[x.id])
}

const err = (regla, campo, mensaje) => hallazgo({ regla: `gallo.${regla}`, gravedad: ERROR, campo, mensaje, fuente: RUTA })

/** Regla 1: la tabla está llena. Dice cuántos números faltan, no cuáles. */
const completa = {
  id: 'gallo.completa',
  descripcion: 'Cada actividad tiene sus cuatro tiempos y su holgura escritos.',
  fuente: RUTA,
  evaluar(gallo) {
    const t = tiemposDe(gallo)
    const faltan = ACTIVIDADES.reduce((n, a) => n + TIEMPOS.filter((x) => t[a.id][x.id] === null).length, 0)
    if (!faltan) return []
    return [hallazgo({ regla: 'gallo.completa', gravedad: ERROR, campo: 'tabla', fuente: RUTA,
      mensaje: `${faltan === 1 ? 'Falta un número' : `Faltan ${faltan} números`} en la tabla. El gallo no canta sobre un cronograma a medias.` })]
  },
}

/** Regla 2, el paso hacia adelante: inicio y finalización tempranos. */
const ida = {
  id: 'gallo.ida',
  descripcion: 'Paso hacia adelante: cada actividad empieza cuando termina la última de sus predecesoras.',
  fuente: RUTA,
  evaluar(gallo) {
    const t = tiemposDe(gallo)
    const out = []
    for (const a of ACTIVIDADES) {
      const { it, tt } = t[a.id]
      const previos = a.antes.map((p) => t[p].tt)
      if (it !== null && previos.every((v) => v !== null)) {
        const debe = Math.max(0, ...previos)
        if (it !== debe) {
          out.push(err('ida', a.id, a.antes.length === 0
            ? `«${a.nombre}» no espera a nadie: su inicio temprano es el día en que empieza el viaje, el 0.`
            : `«${a.nombre}» empieza en cuanto termina ${a.antes.length > 1 ? `la última de sus predecesoras (${lista(a.antes)})` : `su predecesora (${a.antes[0]})`}: `
              + 'revisa su inicio temprano contra la finalización temprana de ' + (a.antes.length > 1 ? 'ellas.' : 'ella.')))
          continue
        }
      }
      if (it !== null && tt !== null && tt !== it + a.duracion) {
        out.push(err('ida', a.id, `«${a.nombre}»: la finalización temprana es su inicio temprano más su duración (${a.duracion} días).`))
      }
    }
    return out
  },
}

/** Regla 3, el paso hacia atrás: finalización e inicio tardíos. */
const vuelta = {
  id: 'gallo.vuelta',
  descripcion: 'Paso hacia atrás: cada actividad puede terminar tan tarde como lo permita la primera de sus sucesoras.',
  fuente: RUTA,
  evaluar(gallo) {
    const t = tiemposDe(gallo)
    const finales = ACTIVIDADES.map((a) => t[a.id].tt)
    const fin = finales.every((v) => v !== null) ? Math.max(...finales) : null
    const out = []
    for (const a of ACTIVIDADES) {
      const { il, tl } = t[a.id]
      const sig = despues(a.id)
      const tardes = sig.map((s) => t[s.id].il)
      if (tl !== null && (sig.length ? tardes.every((v) => v !== null) : fin !== null)) {
        const debe = sig.length ? Math.min(...tardes) : fin
        if (tl !== debe) {
          out.push(err('vuelta', a.id, sig.length === 0
            ? `«${a.nombre}» es la última: su finalización tardía es el día en que termina el proyecto, la finalización temprana más grande de la tabla.`
            : `«${a.nombre}» puede terminar tan tarde como lo deje ${sig.length > 1 ? `la primera de sus sucesoras (${lista(sig.map((s) => s.id))})` : `su sucesora (${sig[0].id})`}: `
              + 'revisa su finalización tardía contra el inicio tardío de ' + (sig.length > 1 ? 'ellas.' : 'ella.')))
          continue
        }
      }
      if (il !== null && tl !== null && il !== tl - a.duracion) {
        out.push(err('vuelta', a.id, `«${a.nombre}»: el inicio tardío es su finalización tardía menos su duración (${a.duracion} días).`))
      }
    }
    return out
  },
}

/** Regla 4: la holgura es lo que se puede atrasar sin atrasar el proyecto. */
const holgura = {
  id: 'gallo.holgura',
  descripcion: 'La holgura total es el inicio tardío menos el inicio temprano.',
  fuente: RUTA,
  evaluar(gallo) {
    const t = tiemposDe(gallo)
    return ACTIVIDADES.filter((a) => {
      const { it, il, h } = t[a.id]
      return it !== null && il !== null && h !== null && h !== il - it
    }).map((a) => err('holgura', a.id, `«${a.nombre}»: la holgura es cuánto puede atrasarse sin atrasar el viaje, su inicio tardío menos su inicio temprano.`))
  },
}

/** Regla 5: la ruta crítica son las actividades sin holgura, ni una más ni una menos. */
const critica = {
  id: 'gallo.critica',
  descripcion: 'La ruta crítica son exactamente las actividades con holgura cero.',
  fuente: RUTA,
  evaluar(gallo) {
    const t = tiemposDe(gallo)
    const marcadas = criticasDe(gallo)
    const out = []
    for (const a of ACTIVIDADES) {
      const h = t[a.id].h
      if (h === null) continue
      const marcada = marcadas.includes(a.id)
      if (marcada && h !== 0) out.push(err('critica', a.id, `Marcaste «${a.nombre}» como crítica, pero según tu tabla tiene holgura: puede atrasarse sin atrasar el viaje.`))
      if (!marcada && h === 0) out.push(err('critica', a.id, `«${a.nombre}» no tiene holgura según tu tabla: si se atrasa un día, el viaje se atrasa un día. Es parte de la ruta crítica.`))
    }
    return out
  },
}

export const reglasGallo = [completa, ida, vuelta, holgura, critica]

export const ACERCA = {
  cronograma: {
    titulo: 'Ruta crítica',
    fuente: RUTA,
    explicacion: 'Se calcula en dos pasadas. Hacia adelante salen los inicios y finalizaciones tempranos; hacia '
      + 'atrás, los tardíos. La diferencia es la holgura: cuánto puede atrasarse una actividad sin atrasar el '
      + 'proyecto. Las actividades sin holgura forman la ruta crítica.',
  },
  red: {
    titulo: 'Red del viaje',
    fuente: SECUENCIA,
    explicacion: 'Cada caja es una actividad y cada flecha dice qué tiene que terminar antes de que otra empiece. '
      + 'Es el diagrama de precedencias: el orden sale de aquí, no de la lista.',
  },
  tiempos: {
    ida: 'Hacia adelante: el inicio temprano es la finalización temprana más grande de sus predecesoras (0 si no tiene). Finalización temprana = inicio temprano + duración.',
    vuelta: 'Hacia atrás: la finalización tardía es el inicio tardío más chico de sus sucesoras (el fin del proyecto si no tiene). Inicio tardío = finalización tardía − duración.',
    holgura: 'Holgura = inicio tardío − inicio temprano. Con holgura 0, la actividad es crítica.',
    fuente: RUTA,
  },
}
