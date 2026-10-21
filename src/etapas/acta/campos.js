/**
 * Especificacion de los campos del acta. Cuatro tipos y ningun otro: texto
 * corto, texto largo, lista de textos y fecha. Si un artefacto necesita un
 * quinto tipo, esa pantalla se escribe a mano en vez de volver generico esto.
 */
import { NUEVE_ELEMENTOS } from '../../motor/reglas/acta.js'

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
    tipo: LARGOS.has(e.campo) ? 'largo' : 'corto',
    ayuda: AYUDA[e.campo] ?? e.porque,
  })),
  {
    campo: 'medidas',
    etiqueta: 'Medidas de éxito',
    tipo: 'lista',
    ayuda: 'Al menos dos, y cada una con una cifra: al cierre alguien tiene que poder decir si se cumplió.',
  },
  { campo: 'fechaInicio', etiqueta: 'Fecha de inicio', tipo: 'fecha', ayuda: '' },
  { campo: 'fechaFin', etiqueta: 'Fecha de fin', tipo: 'fecha', ayuda: '' },
]

export const POR_CAMPO = Object.fromEntries(CAMPOS.map((c) => [c.campo, c]))
