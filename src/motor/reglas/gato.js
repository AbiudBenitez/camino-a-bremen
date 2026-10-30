/**
 * Reglas del gato: la EDT como un móvil colgante.
 *
 * Arriba cuelga el proyecto; de él, tres entregables principales; de cada uno,
 * sus paquetes de trabajo. El estudiante cuelga cada pieza en su rama o la deja
 * en la mesa. El móvil se equilibra cuando no falta ni sobra nada.
 *
 * Fuentes: que la EDT descompone entregables, y no actividades, es del PMBOK
 * (5.4). La regla del 100 % no es del PMBOK sino del Practice Standard for Work
 * Breakdown Structures, y la 8/80 es una heurística de la industria: ambas van
 * como práctica complementaria. El PMBOK admite fases como primer nivel, así
 * que ninguna fase se usa como distractor.
 */
import { MESA, donde } from '../../arrastre/colocacion.js'
import { ERROR, fuente, hallazgo } from '../contrato.js'

const EDT = fuente('PMBOK', '5.4 Crear la EDT/WBS: descomposición en entregables')
const CIEN = fuente('Práctica complementaria', 'Practice Standard for Work Breakdown Structures: regla del 100 %')
const OCHENTA = fuente('Práctica complementaria', 'Heurística 8/80 para el tamaño de los paquetes de trabajo')

export const PROYECTO = 'Llegar a Bremen como banda'

export const RAMAS = [
  { id: 'banda', nombre: 'Banda reunida', lado: -1 },
  { id: 'repertorio', nombre: 'Repertorio', lado: 0 },
  { id: 'viaje', nombre: 'Viaje', lado: 1 },
]
export const CUPO_RAMA = 2

export const PIEZAS = [
  { id: 'viajar', texto: 'Viajar a Bremen', horas: 60, va: MESA, fuente: EDT,
    nota: 'Es una actividad, no un entregable: lleva verbo. La EDT descompone lo que se entrega, no lo que se hace.' },
  { id: 'cancion', texto: 'Canción de la banda', horas: 40, va: 'repertorio' },
  { id: 'perro', texto: 'Perro reclutado', horas: 16, va: 'banda' },
  { id: 'repertorio-completo', texto: 'Repertorio completo', horas: 120, va: MESA, fuente: OCHENTA,
    nota: 'Pasa de 80 horas: es demasiado grande para un paquete de trabajo. Hay que partirlo en piezas más chicas.' },
  { id: 'ruta', texto: 'Ruta trazada hasta Bremen', horas: 8, va: 'viaje' },
  { id: 'goteras', texto: 'Goteras del molino arregladas', horas: 8, va: MESA, fuente: CIEN,
    nota: 'Quedó fuera del alcance en el molino. La EDT tiene todo el trabajo del proyecto y nada más: esto sobra.' },
  { id: 'arreglo', texto: 'Arreglo a cuatro voces', horas: 24, va: 'repertorio' },
  { id: 'cuerda', texto: 'Una cuerda afinada', horas: 2, va: MESA, fuente: OCHENTA,
    nota: 'Menos de 8 horas: es tan chico que vigilarlo cuesta más que hacerlo. Se junta con otra pieza.' },
  { id: 'gato-gallo', texto: 'Gato y gallo reclutados', horas: 24, va: 'banda' },
  { id: 'provisiones', texto: 'Provisiones para doce días', horas: 16, va: 'viaje' },
]

const POR_ID = Object.fromEntries(PIEZAS.map((p) => [p.id, p]))
export const pieza = (id) => POR_ID[id] ?? null
const RAMA = Object.fromEntries(RAMAS.map((r) => [r.id, r]))

/** Regla 1: cada pieza en su rama; lo que no es paquete de trabajo, en la mesa. */
const enSuRama = {
  id: 'gato.en-su-rama',
  descripcion: 'Cada paquete de trabajo cuelga de su entregable, y lo que no es paquete se queda fuera.',
  fuente: EDT,
  evaluar(gato) {
    return PIEZAS.filter((p) => {
      const aqui = donde(gato?.colocaciones, p.id)
      return aqui !== MESA && aqui !== p.va
    }).map((p) => hallazgo({
      regla: 'gato.en-su-rama', gravedad: ERROR, campo: p.id, fuente: p.fuente ?? EDT,
      mensaje: p.nota ?? `«${p.texto}» es parte de «${RAMA[p.va].nombre}», no de esa rama.`,
    }))
  },
}

/** Regla 2, la del 100 %: a ninguna rama le falta trabajo. Dice a cuál, no qué. */
const cienPorCiento = {
  id: 'gato.cien-por-ciento',
  descripcion: 'Cada entregable suma el 100 % de su trabajo: no le falta ningún paquete.',
  fuente: CIEN,
  evaluar(gato) {
    return RAMAS.filter((r) => PIEZAS.some((p) => p.va === r.id && donde(gato?.colocaciones, p.id) !== r.id))
      .map((r) => hallazgo({
        regla: 'gato.cien-por-ciento', gravedad: ERROR, campo: r.id, fuente: CIEN,
        mensaje: `«${r.nombre}» todavía no suma el 100 %: le falta trabajo para quedar completo.`,
      }))
  },
}

export const reglasGato = [enSuRama, cienPorCiento]
