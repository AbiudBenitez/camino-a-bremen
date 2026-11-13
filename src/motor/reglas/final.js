/**
 * Reglas del acto final: un sprint de una noche y su retrospectiva.
 *
 * Es el final de los Grimm. La banda ya tiene la casa, pero los ladrones mandan
 * a uno de vuelta a revisar. El estudiante planea la noche como un sprint:
 * elige un objetivo, reparte el trabajo sin pasarse de la capacidad de cada
 * animal y deja fuera lo que no sirve al objetivo. Después de la noche, la
 * retrospectiva termina en un compromiso.
 *
 * Todo lo que se exige aquí lo dice la Guía de Scrum: el objetivo único del
 * sprint, el backlog del sprint como el plan para lograrlo, la capacidad al
 * planear y la retrospectiva que busca mejoras. Nada de esto se le atribuye al
 * PMBOK, porque desde la casa el taller va con Scrum.
 *
 * Borrador del objetivo del sprint y de la Definición de Terminado: Abiud.
 * Pendiente de la revisión de Ángel (tarea de H-11).
 */
import { MESA, donde, normalizar } from '../../arrastre/colocacion.js'
import { AVISO, ERROR, fuente, hallazgo } from '../contrato.js'

const OBJETIVO = fuente('Guía de Scrum', 'Compromiso: Objetivo del Sprint')
const BACKLOG = fuente('Guía de Scrum', 'Artefactos: Sprint Backlog')
const PLANEACION = fuente('Guía de Scrum', 'Eventos: Sprint Planning, tema dos: qué se puede hacer')
const RETRO = fuente('Guía de Scrum', 'Eventos: Sprint Retrospective')
const DOD = fuente('Guía de Scrum', 'Compromiso: Definición de Terminado')

export const OBJETIVOS = [
  { id: 'casa', texto: 'Que la casa siga siendo nuestra al amanecer.', bien: true },
  { id: 'todo', texto: 'Hacer todo lo que quedó en el backlog de la casa.',
    nota: 'Eso es una lista, no un objetivo. El objetivo del sprint es uno solo y le da sentido a todo lo que se hace esa noche.' },
  { id: 'bremen', texto: 'Llegar a Bremen y entrar como músicos de la ciudad.',
    nota: 'Es el objetivo del plan viejo, y no se logra en una noche. El objetivo del sprint se tiene que poder cumplir dentro del sprint.' },
]

export const TERMINADO = 'Terminado es: amanece, la banda sigue adentro y cada puesto tuvo a alguien despierto toda la noche.'

/** Los animales y cuántas horas de la noche aguanta cada uno despierto. */
export const ANIMALES = [
  { id: 'burro', nombre: 'El burro', capacidad: 4, hace: 'le suelta una coz que lo avienta lejos' },
  { id: 'perro', nombre: 'El perro', capacidad: 3, hace: 'le muerde la pierna' },
  { id: 'gato', nombre: 'El gato', capacidad: 3, hace: 'le salta a la cara, bufando y arañando' },
  { id: 'gallo', nombre: 'El gallo', capacidad: 2, hace: 'despierta con el ruido y canta «¡quiquiriquí!» desde lo alto' },
]

// `sirve`: aporta al objetivo. Las que no, se quedan en la mesa.
export const TAREAS = [
  { id: 'patio', texto: 'Cuidar el patio, junto al montón de paja', horas: 4, sirve: true, lugar: 'En el patio' },
  { id: 'puerta', texto: 'Cuidar detrás de la puerta', horas: 3, sirve: true, lugar: 'Detrás de la puerta' },
  { id: 'fogon', texto: 'Cuidar el fogón, donde aún hay brasas', horas: 3, sirve: true, lugar: 'Junto al fogón' },
  { id: 'viga', texto: 'Dar la alarma desde la viga del techo', horas: 2, sirve: true, lugar: 'Desde la viga' },
  { id: 'ensayar', texto: 'Ensayar la canción para Bremen', horas: 2, sirve: false,
    nota: 'Puede servir algún día, pero no ayuda a que la casa siga siendo suya al amanecer. Lo que no sirve al objetivo no entra al sprint.' },
  { id: 'botin', texto: 'Contar el botín que dejaron los ladrones', horas: 2, sirve: false,
    nota: 'No aporta al objetivo de esta noche: el backlog del sprint es el plan para lograr el objetivo, no una lista de pendientes.' },
]

const TAREA = Object.fromEntries(TAREAS.map((t) => [t.id, t]))
const ANIMAL = Object.fromEntries(ANIMALES.map((a) => [a.id, a]))
export const tarea = (id) => TAREA[id] ?? null
export const animal = (id) => ANIMAL[id] ?? null

/** Horas que ya carga un animal. */
export function carga(col, id) {
  return (normalizar(col)[id] ?? []).reduce((s, t) => s + (TAREA[t]?.horas ?? 0), 0)
}

const texto = (v) => String(v ?? '').trim()
const retroDe = (final) => (final?.retro && typeof final.retro === 'object' ? final.retro : {})

/** Regla 1: un objetivo, y uno que se cumple en la noche. */
const objetivo = {
  id: 'final.objetivo',
  descripcion: 'El sprint tiene un solo objetivo, alcanzable dentro del sprint.',
  fuente: OBJETIVO,
  evaluar(final) {
    const o = OBJETIVOS.find((x) => x.id === final?.objetivo)
    if (!o) return [hallazgo({ regla: 'final.objetivo', gravedad: ERROR, campo: 'objetivo', fuente: OBJETIVO,
      mensaje: 'Falta elegir el objetivo de la noche. Sin objetivo, cada quien cuida lo que se le ocurre.' })]
    if (o.bien) return []
    return [hallazgo({ regla: 'final.objetivo', gravedad: ERROR, campo: 'objetivo', fuente: OBJETIVO, mensaje: o.nota })]
  },
}

/** Regla 2: en el sprint solo entra lo que sirve al objetivo. */
const sirve = {
  id: 'final.sirve',
  descripcion: 'El backlog del sprint solo tiene trabajo que sirve al objetivo.',
  fuente: BACKLOG,
  evaluar(final) {
    return TAREAS.filter((t) => !t.sirve && donde(final?.colocaciones, t.id) !== MESA)
      .map((t) => hallazgo({ regla: 'final.sirve', gravedad: ERROR, campo: t.id, fuente: BACKLOG, mensaje: t.nota }))
  },
}

/** Regla 3: nadie carga más horas de las que aguanta despierto. */
const capacidad = {
  id: 'final.capacidad',
  descripcion: 'Ningún animal carga más trabajo que su capacidad para la noche.',
  fuente: PLANEACION,
  evaluar(final) {
    return ANIMALES.filter((a) => carga(final?.colocaciones, a.id) > a.capacidad)
      .map((a) => hallazgo({ regla: 'final.capacidad', gravedad: ERROR, campo: a.id, fuente: PLANEACION,
        mensaje: `${a.nombre} aguanta ${a.capacidad} horas despierto y ya le tocarían ${carga(final?.colocaciones, a.id)}. `
          + 'Lo que se compromete se decide con la capacidad real, no con la que quisiéramos.' }))
  },
}

/** Regla 4: todos los puestos tienen a alguien. Dice cuántos faltan, no cuáles. */
const completo = {
  id: 'final.completo',
  descripcion: 'Todo el trabajo que el objetivo necesita tiene a alguien que lo haga.',
  fuente: BACKLOG,
  evaluar(final) {
    const faltan = TAREAS.filter((t) => t.sirve && donde(final?.colocaciones, t.id) === MESA).length
    if (!faltan) return []
    return [hallazgo({ regla: 'final.completo', gravedad: ERROR, campo: 'plan', fuente: DOD,
      mensaje: `${faltan === 1 ? 'Queda un puesto' : `Quedan ${faltan} puestos`} sin nadie. Con un puesto vacío no se cumple lo que acordaron como terminado.` })]
  },
}

/** Regla 5: la retrospectiva mira lo que funcionó, lo que no, y termina en un compromiso. */
const retrospectiva = {
  id: 'final.retrospectiva',
  descripcion: 'La retrospectiva dice qué funcionó, qué mejorar y a qué se compromete la banda.',
  fuente: RETRO,
  evaluar(final) {
    const r = retroDe(final)
    const faltan = [['bien', 'qué funcionó'], ['mejorar', 'qué mejorar'], ['compromiso', 'el compromiso']]
      .filter(([k]) => !texto(r[k])).map(([, n]) => n)
    if (faltan.length) {
      return [hallazgo({ regla: 'final.retrospectiva', gravedad: ERROR, campo: 'retro', fuente: RETRO,
        mensaje: `A la retrospectiva le falta ${faltan.join(' y ')}. Una retrospectiva que no termina en algo que cambiar es solo una plática.` })]
    }
    // Heurística, así que aviso y no error: contar palabras no sabe si algo se puede cumplir.
    if (texto(r.compromiso).split(/\s+/).length < 4) {
      return [hallazgo({ regla: 'final.retrospectiva', gravedad: AVISO, campo: 'compromiso', fuente: RETRO,
        mensaje: 'Tu compromiso es muy corto. Uno que se pueda revisar en el siguiente sprint dice quién hace qué.' })]
    }
    return []
  },
}

export const reglasFinal = [objetivo, sirve, capacidad, completo, retrospectiva]
/** Las reglas que se revisan al cerrar la planeación, antes de la noche. */
export const DE_PLANEACION = ['final.objetivo', 'final.sirve', 'final.capacidad', 'final.completo']

export const ACERCA = {
  sprint: {
    titulo: 'Sprint y retrospectiva',
    fuente: fuente('Guía de Scrum', 'Eventos: El Sprint'),
    explicacion: 'Un sprint es un ciclo corto con un solo objetivo. Se planea con la capacidad real del equipo, '
      + 'se trabaja, y la retrospectiva lo cierra decidiendo qué mejorar en el siguiente.',
  },
  objetivo: { titulo: 'Objetivo del sprint', fuente: OBJETIVO,
    explicacion: 'Es el único propósito del sprint. Le da coherencia al trabajo y deja margen para decidir cómo '
      + 'lograrlo. Se fija al planear y no cambia durante el sprint.' },
  terminado: { titulo: 'Definición de Terminado', fuente: DOD,
    explicacion: 'Lo que todo el equipo acuerda que tiene que cumplirse para decir que algo está terminado. Si no '
      + 'la cumple, no está terminado, por mucho que se haya trabajado.' },
  capacidad: { titulo: 'Capacidad', fuente: PLANEACION,
    explicacion: 'Cuánto trabajo cabe en el sprint según quién está disponible y cuánto rinde. Comprometer más de '
      + 'lo que cabe no acelera nada: solo deja trabajo a medias.' },
  retro: { titulo: 'Retrospectiva', fuente: RETRO,
    explicacion: 'El equipo revisa cómo trabajó: personas, interacciones, herramientas y su Definición de '
      + 'Terminado. Identifica las mejoras más útiles y se compromete con ellas para el siguiente sprint.' },
}
