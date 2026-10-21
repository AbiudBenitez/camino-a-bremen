/**
 * Contrato único del motor de reglas.
 *
 * Toda regla, sea del PMBOK o de la Guía de Scrum, cumple esta misma forma. Es
 * lo que permite agregar un artefacto nuevo sin tocar la interfaz: la pantalla
 * sabe pintar hallazgos, no sabe de actas ni de EDT.
 *
 * @typedef {Object} Fuente
 * @property {'PMBOK'|'Guía de Scrum'|'Material del curso'} obra
 * @property {string} apartado  Dónde buscarlo dentro de la obra.
 *
 * @typedef {Object} Hallazgo
 * @property {string} regla      Id de la regla que lo produjo.
 * @property {'error'|'aviso'} gravedad
 * @property {string} mensaje    Qué falta y por qué importa, en segunda persona.
 * @property {Fuente} fuente     Regla de diseño 4: ninguna observación sin fuente.
 * @property {string} [campo]    Campo del artefacto al que apunta, si aplica.
 *
 * @typedef {Object} Regla
 * @property {string} id
 * @property {string} descripcion
 * @property {Fuente} fuente
 * @property {(artefacto: any) => Hallazgo[]} evaluar
 */

export const ERROR = 'error'
export const AVISO = 'aviso'

/** Construye una fuente. Existe para que nadie escriba el objeto a mano y se le olvide el apartado. */
export function fuente(obra, apartado) {
  if (!obra || !apartado) throw new Error('Una fuente necesita obra y apartado')
  return { obra, apartado }
}

/** Construye un hallazgo ya validado contra el contrato. */
export function hallazgo({ regla, gravedad = ERROR, mensaje, fuente: f, campo }) {
  if (!regla) throw new Error('Un hallazgo necesita el id de su regla')
  if (!mensaje) throw new Error(`La regla ${regla} produjo un hallazgo sin mensaje`)
  if (gravedad !== ERROR && gravedad !== AVISO) {
    throw new Error(`Gravedad desconocida en ${regla}: ${gravedad}`)
  }
  if (!f || !f.obra || !f.apartado) {
    throw new Error(`La regla ${regla} produjo un hallazgo sin fuente`)
  }
  return { regla, gravedad, mensaje, fuente: f, ...(campo ? { campo } : {}) }
}

/** Valida la forma de una regla. Se corre al cargar el catálogo, no en caliente. */
export function validarRegla(r) {
  for (const campo of ['id', 'descripcion', 'fuente', 'evaluar']) {
    if (!r?.[campo]) throw new Error(`Regla sin ${campo}: ${JSON.stringify(r?.id ?? r)}`)
  }
  if (typeof r.evaluar !== 'function') throw new Error(`La regla ${r.id} no trae función evaluar`)
  if (!r.fuente.obra || !r.fuente.apartado) throw new Error(`La regla ${r.id} tiene fuente incompleta`)
  return r
}

/** Texto de la cita, tal como se muestra al estudiante. */
export function cita(f) {
  return `${f.obra} · ${f.apartado}`
}
