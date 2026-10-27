import { fuente } from '../motor/contrato.js'

/**
 * Los siete destinos, en el orden del cuento de los Grimm. El orden es también
 * la puerta: un destino se abre cuando el anterior quedó recorrido.
 *
 *   juego  -> minijuego con reglas citables. Produce un artefacto.
 *   escena -> tramo de cuento. En el sprint 2 el perro, el gallo y el bosque son
 *             escenas; sus minijuegos llegan en el sprint 3.
 *
 * `animal` es quien se suma a la banda al recorrer el destino, y con él su capa
 * de la música.
 */
export const DESTINOS = [
  { id: 'molino', nombre: 'El molino', tipo: 'juego', animal: 'burro', metodo: 'PMI' },
  { id: 'perro', nombre: 'El perro', tipo: 'escena', animal: 'perro', metodo: 'PMI' },
  { id: 'gato', nombre: 'El gato', tipo: 'juego', animal: 'gato', metodo: 'PMI', construido: false },
  { id: 'gallo', nombre: 'El gallo', tipo: 'escena', animal: 'gallo', metodo: 'PMI' },
  { id: 'bosque', nombre: 'El bosque', tipo: 'escena', metodo: 'PMI' },
  { id: 'casa', nombre: 'La casa', tipo: 'juego', metodo: 'Scrum', construido: false },
  { id: 'final', nombre: 'El acto final', tipo: 'juego', metodo: 'Scrum', construido: false },
]

export const ANIMALES = ['burro', 'perro', 'gato', 'gallo']

/**
 * Lo que se aprende en cada destino, dicho en pocas palabras. Se ve en el mapa
 * debajo del nombre y se explica con el botón «!»: el taller es para aprender,
 * y el cuento no debe tapar el concepto. Cada explicación cita su fuente.
 */
export const CONCEPTOS = {
  molino: {
    concepto: 'Acta de constitución',
    explicacion: 'El documento que autoriza formalmente el proyecto: qué se busca, qué entra y qué no, '
      + 'los riesgos y quién está involucrado. Sin acta, el proyecto todavía no existe.',
    fuente: fuente('PMBOK', '4.1 Desarrollar el Acta de Constitución del Proyecto'),
  },
  perro: {
    concepto: 'Interesados',
    explicacion: 'Las personas a las que el proyecto afecta o que pueden afectarlo, a favor o en contra. '
      + 'Se identifican desde el inicio para saber a quién hay que tomar en cuenta.',
    fuente: fuente('PMBOK', '13.1 Identificar a los Interesados'),
  },
  gato: {
    concepto: 'Estructura de desglose del trabajo',
    explicacion: 'Divide todo el trabajo del proyecto en entregables más pequeños y manejables. '
      + 'La suma de las partes tiene que ser exactamente el todo: ni falta ni sobra.',
    fuente: fuente('PMBOK', '5.4 Crear la EDT/WBS'),
  },
  gallo: {
    concepto: 'Cronograma y ruta crítica',
    explicacion: 'Ordena las actividades y calcula cuánto dura el proyecto. La ruta crítica es la '
      + 'secuencia sin holgura: si una de sus actividades se atrasa, se atrasa todo.',
    fuente: fuente('PMBOK', '6.5 Desarrollar el Cronograma'),
  },
  bosque: {
    concepto: 'Riesgos',
    explicacion: 'Lo incierto que, si pasa, afecta al proyecto. Se identifica, se evalúa por '
      + 'probabilidad e impacto y se planea qué hacer si ocurre.',
    fuente: fuente('PMBOK', '11.2 Identificar los Riesgos'),
  },
  casa: {
    concepto: 'Product backlog',
    explicacion: 'La lista ordenada de todo lo que podría necesitar el producto. En Scrum el plan no '
      + 'se fija al inicio: se reordena cuando aparece algo que nadie previó.',
    fuente: fuente('Guía de Scrum', 'Product Backlog'),
  },
  final: {
    concepto: 'Sprint y retrospectiva',
    explicacion: 'Un sprint es un ciclo corto con un solo objetivo. La retrospectiva lo cierra y '
      + 'decide qué mejorar en el siguiente.',
    fuente: fuente('Guía de Scrum', 'El Sprint y la Retrospectiva del Sprint'),
  },
}

/** Desde aquí es de noche: la paleta y la música cambian sin anunciarlo. */
export const ANOCHECE = 'bosque'

export const destino = (id) => DESTINOS.find((d) => d.id === id) ?? null

const recorridos = (estado) => {
  const r = estado?.recorrido
  return r && typeof r === 'object' ? r : {}
}

export const recorrido = (estado, id) => Boolean(recorridos(estado)[id])

/** El primer destino sin recorrer. Si ya se recorrieron todos, el último. */
export function actual(estado) {
  return DESTINOS.find((d) => !recorrido(estado, d.id)) ?? DESTINOS.at(-1)
}

export function abierto(estado, id) {
  const i = DESTINOS.findIndex((d) => d.id === id)
  return i === 0 || (i > 0 && recorrido(estado, DESTINOS[i - 1].id))
}

/**
 * La banda que va en el camino. El burro está desde el principio: es quien
 * escapa, y su capa de música suena desde el primer momento.
 */
export function banda(estado) {
  return ANIMALES.filter((a) => a === 'burro'
    || DESTINOS.some((d) => d.animal === a && recorrido(estado, d.id)))
}

/** Cae la noche al llegar al bosque, no al terminarlo. */
export const deNoche = (estado) => abierto(estado, ANOCHECE)
