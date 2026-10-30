/**
 * Reglas del molino: el acta de constitución armada como el hatillo del burro.
 *
 * Cada hecho del caso es una tarjeta con un solo lugar correcto: un
 * compartimento del hatillo o la mesa, porque no todo lo que se sabe va en el
 * acta. Cada tarjeta trae la nota que se le muestra si va a otro lado, con la
 * fuente que la respalda.
 *
 * Las tarjetas salen siempre en este orden: barajarlas sería azar, y en clase
 * todos tienen que ver lo mismo en el proyector.
 */
import { MESA, donde } from '../../arrastre/colocacion.js'
import { ERROR, fuente, hallazgo } from '../contrato.js'
import { medidasDeExito } from './acta.js'

const ACTA = fuente('PMBOK', '4.1.3.1 Acta de Constitución del Proyecto')
const OBJETIVOS = fuente('PMBOK', '4.1.3.1 Acta de Constitución: objetivos medibles y criterios de éxito')
const LIMITES = fuente('PMBOK', '4.1.3.1 Acta de Constitución: descripción de alto nivel y límites')
const EXCLUSIONES = fuente('PMBOK', '5.3.3.1 Enunciado del Alcance del Proyecto: exclusiones')
const RIESGOS = fuente('PMBOK', '4.1.3.1 Acta de Constitución: riesgos generales del proyecto')
const INTERESADOS = fuente('PMBOK', '13.1 Identificar a los Interesados')

export const COMPARTIMENTOS = [
  { id: 'objetivo', nombre: 'Objetivo', cupo: 1, fuente: OBJETIVOS },
  { id: 'dentro', nombre: 'Dentro del alcance', fuente: LIMITES },
  { id: 'fuera', nombre: 'Fuera del alcance', fuente: EXCLUSIONES },
  { id: 'riesgos', nombre: 'Riesgos', fuente: RIESGOS },
  { id: 'interesados', nombre: 'Interesados', fuente: INTERESADOS },
]

export const TARJETAS = [
  { id: 'lobos', texto: 'Lobos en el bosque', va: 'riesgos', fuente: RIESGOS,
    nota: 'No es trabajo por hacer: es algo incierto que podría descarrilar el viaje. Va en riesgos.' },
  { id: 'audicion', texto: 'Llegar a Bremen y entrar como músico de la ciudad', va: 'objetivo', fuente: OBJETIVOS,
    nota: 'Es el resultado que se busca, y se puede comprobar: va en el objetivo.' },
  { id: 'goteras', texto: 'Arreglar las goteras del molino', va: 'fuera', fuente: EXCLUSIONES,
    nota: 'Nadie se lo pidió y no acerca al burro a Bremen. Declararlo fuera del alcance evita que alguien lo reclame después.' },
  { id: 'amo', texto: 'El amo del molino', va: 'interesados', fuente: INTERESADOS,
    nota: 'Es un interesado aunque esté en contra: le afecta que el burro se vaya y puede estorbar. Los interesados adversos también se identifican.' },
  { id: 'recorrer', texto: 'Recorrer el camino hasta Bremen', va: 'dentro', fuente: LIMITES,
    nota: 'Es trabajo que el proyecto sí va a hacer: va dentro del alcance.' },
  { id: 'edad', texto: 'El burro tiene catorce años', va: MESA, fuente: ACTA,
    nota: 'Es un dato del caso, pero no cambia nada del proyecto. No todo lo que se sabe va en el acta.' },
  { id: 'sin-plaza', texto: 'Que en Bremen ya no busquen músicos', va: 'riesgos', fuente: RIESGOS,
    nota: 'Todavía no pasa y quizá no pase: es un riesgo, no un hecho ni un objetivo.' },
  { id: 'escapar', texto: 'Escapar del molino antes de que el amo se deshaga de él', va: MESA, fuente: OBJETIVOS,
    nota: 'Es el motivo para empezar, no un resultado. Un objetivo dice a dónde se llega, no de qué se huye: este se queda en la mesa.' },
  { id: 'ciudad', texto: 'La ciudad de Bremen, que contrata músicos', va: 'interesados', fuente: INTERESADOS,
    nota: 'Es quien decide si el burro entra: va en interesados.' },
  { id: 'grupo', texto: 'Reunir un grupo de músicos por el camino', va: 'dentro', fuente: LIMITES,
    nota: 'Es trabajo que el proyecto sí va a hacer: va dentro del alcance.' },
  { id: 'quedarse', texto: 'Quedarse a vivir en el camino', va: 'fuera', fuente: EXCLUSIONES,
    nota: 'Es justo lo que este proyecto no busca. Decirlo fuera del alcance lo deja claro para todos.' },
]

/** Lo que ya viene decidido en el acta. El enfoque es la predicción que la casa va a romper. */
export const DECIDIDO = {
  enfoque: 'El objetivo está claro y no va a cambiar, así que se planifica el camino completo '
    + 'desde el principio y se sigue el plan.',
  hitos: ['Salir del molino', 'Llegar a Bremen', 'Pasar la audición'],
}

const POR_ID = Object.fromEntries(TARJETAS.map((t) => [t.id, t]))
export const tarjeta = (id) => POR_ID[id] ?? null

/** Regla 1: ninguna tarjeta en un lugar que no le toca. */
const enSuLugar = {
  id: 'molino.en-su-lugar',
  descripcion: 'Cada hecho del caso está en el compartimento que le corresponde, o en la mesa.',
  fuente: ACTA,
  evaluar(molino) {
    const col = molino?.colocaciones
    return TARJETAS.filter((t) => {
      const aqui = donde(col, t.id)
      return aqui !== MESA && aqui !== t.va
    }).map((t) => hallazgo({
      regla: 'molino.en-su-lugar', gravedad: ERROR, campo: t.id, mensaje: t.nota, fuente: t.fuente,
    }))
  },
}

/** Regla 2: a ningún compartimento le falta lo que le toca. Dice dónde falta, no qué. */
const completo = {
  id: 'molino.completo',
  descripcion: 'Cada compartimento del hatillo tiene todo lo que le corresponde.',
  fuente: ACTA,
  evaluar(molino) {
    const col = molino?.colocaciones
    return COMPARTIMENTOS.filter((c) => TARJETAS.some((t) => t.va === c.id && donde(col, t.id) !== c.id))
      .map((c) => hallazgo({
        regla: 'molino.completo', gravedad: ERROR, campo: c.id,
        mensaje: `A «${c.nombre}» todavía le falta algo de lo que sabe el burro.`, fuente: c.fuente,
      }))
  },
}

/** Regla 3: las medidas de éxito, que el estudiante escribe. La misma regla del acta. */
const medidas = {
  ...medidasDeExito,
  id: 'molino.medidas',
  evaluar: (molino) => medidasDeExito.evaluar(molino).map((h) => ({ ...h, regla: 'molino.medidas' })),
}

export const reglasMolino = [enSuLugar, completo, medidas]
