import { DESTINOS, actual, recorrido } from '../destinos/catalogo.js'
import { visibles } from './trazo.js'

/**
 * El cronograma del viaje: lo que ya se recorrió, dónde se está y lo que sigue.
 * Solo las paradas visibles: lo que sigue bajo la bruma no existe aquí tampoco.
 * No califica ni compara: son las horas reales en que se terminó cada parada.
 */

const CORTO = { molino: 'Molino', perro: 'Perro', gato: 'Gato', gallo: 'Gallo', bosque: 'Bosque', casa: 'Casa', final: 'Final' }

const fecha = (iso) => {
  const t = Date.parse(iso)
  return Number.isFinite(t) ? t : null
}

/** Las paradas visibles con su estado, y si queda algo bajo la bruma. */
export function etapas(estado) {
  const aqui = actual(estado).id
  const lista = visibles(estado).map((d) => ({
    id: d.id,
    nombre: d.nombre,
    corto: CORTO[d.id] ?? d.nombre,
    metodo: d.metodo,
    estado: recorrido(estado, d.id) ? 'hecha' : d.id === aqui ? 'actual' : 'cerrada',
  }))
  return { lista, bruma: lista.length < DESTINOS.length }
}

/** Las etapas agrupadas por enfoque, en orden: [{ metodo, etapas }]. */
export function porMetodo(lista) {
  const grupos = []
  for (const e of lista) {
    const ultimo = grupos.at(-1)
    if (ultimo?.metodo === e.metodo) ultimo.etapas.push(e)
    else grupos.push({ metodo: e.metodo, etapas: [e] })
  }
  return grupos
}

/**
 * Las barras del Gantt. Cada parada recorrida va desde que terminó la anterior
 * (o desde que empezó el taller) hasta que terminó ella. La actual va abierta
 * hasta `ahora`. Las cerradas no tienen barra.
 */
export function barras(estado, ahora = Date.now()) {
  const { lista } = etapas(estado)
  const r = estado?.recorrido && typeof estado.recorrido === 'object' ? estado.recorrido : {}
  const primera = lista.map((e) => fecha(r[e.id])).find((t) => t !== null)
  let desde = fecha(estado?.creado) ?? primera ?? ahora
  const filas = []
  for (const e of lista) {
    if (e.estado === 'hecha') {
      const fin = fecha(r[e.id]) ?? desde
      filas.push({ ...e, inicio: Math.min(desde, fin), fin, enCurso: false })
      desde = fin
    } else if (e.estado === 'actual') {
      filas.push({ ...e, inicio: desde, fin: Math.max(desde, ahora), enCurso: true })
    } else {
      filas.push({ ...e, inicio: null, fin: null, enCurso: false })
    }
  }
  const conBarra = filas.filter((f) => f.inicio !== null)
  const min = conBarra.length ? Math.min(...conBarra.map((f) => f.inicio)) : ahora
  let max = conBarra.length ? Math.max(...conBarra.map((f) => f.fin)) : ahora
  if (max - min < 60_000) max = min + 60_000
  return { filas, min, max }
}
