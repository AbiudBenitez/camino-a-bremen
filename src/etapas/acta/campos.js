/**
 * Especificacion de los campos del acta. Cuatro tipos y ningun otro: texto
 * corto, texto largo, lista de textos y fecha. Si un artefacto necesita un
 * quinto tipo, esa pantalla se escribe a mano en vez de volver generico esto.
 */
import { NUEVE_ELEMENTOS } from '../../motor/reglas/acta.js'

// La pregunta es lo que ve el estudiante a pantalla completa; la etiqueta es
// el nombre formal del elemento, que es el que tiene que aprenderse.
const PREGUNTA = {
  vision: '¿A qué van?',
  objetivos: '¿Qué tiene que lograr este proyecto?',
  alcance: '¿Qué entra, y qué no?',
  entregables: '¿Qué van a entregar?',
  interesados: '¿A quién le importa esto?',
  roles: '¿Quién hace qué?',
  enfoque: '¿Cómo lo van a hacer?',
  hitos: '¿En qué momentos hay que parar a revisar?',
  riesgos: '¿Qué puede salir mal?',
  medidas: '¿Cómo van a saber que salió bien?',
  fechaInicio: '¿Cuándo empieza?',
  fechaFin: '¿Cuándo termina?',
}

const AYUDA = {
  vision: 'Una sola oración. Si no cabe en una, todavía no está decidida.',
  objetivos: 'De tres a cinco, cada uno específico y medible.',
  alcance: 'Qué entra y, sobre todo, qué no entra.',
  entregables: 'Productos concretos, en sustantivo. No actividades.',
  interesados: 'Quién tiene parte activa y pasiva, y quién aprueba.',
  roles: 'Quién hace qué. Un entregable sin responsable no lo hace nadie.',
  enfoque: 'Cómo se va a acometer el proyecto, a grandes rasgos.',
  hitos: 'Los puntos donde el patrocinador puede revisar y decidir.',
  riesgos: 'Lo que puede descarrilar esto, y lo que estás dando por hecho.',
}

const LARGOS = new Set(['objetivos', 'alcance', 'entregables', 'interesados', 'roles',
                        'enfoque', 'hitos', 'riesgos'])

export const CAMPOS = [
  ...NUEVE_ELEMENTOS.map((e) => ({
    campo: e.campo,
    etiqueta: e.nombre,
    pregunta: PREGUNTA[e.campo],
    tipo: LARGOS.has(e.campo) ? 'largo' : 'corto',
    ayuda: AYUDA[e.campo] ?? e.porque,
  })),
  {
    campo: 'medidas',
    etiqueta: 'Medidas de éxito',
    pregunta: PREGUNTA.medidas,
    tipo: 'lista',
    ayuda: 'Al menos dos, y cada una con una cifra: al cierre alguien tiene que poder decir si se cumplió.',
  },
  { campo: 'fechaInicio', etiqueta: 'Fecha de inicio', pregunta: PREGUNTA.fechaInicio,
    tipo: 'fecha', ayuda: 'La fecha en la que el burro sale de la granja.' },
  { campo: 'fechaFin', etiqueta: 'Fecha de fin', pregunta: PREGUNTA.fechaFin,
    tipo: 'fecha', ayuda: 'Cuándo se da por terminado. No puede ser antes del inicio.' },
]

export const POR_CAMPO = Object.fromEntries(CAMPOS.map((c) => [c.campo, c]))
