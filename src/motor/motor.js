/**
 * Motor de reglas. Corre entero en el navegador y no toca la red (regla de
 * diseño 1). Recibe el id de un artefacto y lo que el estudiante escribió, y
 * devuelve los hallazgos de todas las reglas registradas para ese artefacto.
 */
import { validarRegla } from './contrato.js'
import { CATALOGO } from './catalogo.js'

/**
 * @param {string} idArtefacto  Clave del catálogo, por ejemplo 'acta'.
 * @param {any} artefacto       Lo que el estudiante escribió.
 * @param {Record<string, {nombre: string, etapa: number, reglas: any[]}>} [catalogo]
 */
export function evaluar(idArtefacto, artefacto, catalogo = CATALOGO) {
  const entrada = catalogo[idArtefacto]
  if (!entrada) {
    throw new Error(`No hay reglas registradas para el artefacto "${idArtefacto}"`)
  }

  const hallazgos = []
  for (const regla of entrada.reglas) {
    validarRegla(regla)
    const salida = regla.evaluar(artefacto) ?? []
    if (!Array.isArray(salida)) {
      throw new Error(`La regla ${regla.id} debe devolver un arreglo de hallazgos`)
    }
    hallazgos.push(...salida)
  }

  const errores = hallazgos.filter((h) => h.gravedad === 'error')
  return {
    artefacto: idArtefacto,
    nombre: entrada.nombre,
    etapa: entrada.etapa,
    hallazgos,
    resumen: {
      reglas: entrada.reglas.length,
      total: hallazgos.length,
      errores: errores.length,
      avisos: hallazgos.length - errores.length,
      pasa: errores.length === 0,
    },
  }
}

/** Artefactos que el motor sabe evaluar. La interfaz se arma con esto. */
export function artefactos(catalogo = CATALOGO) {
  return Object.entries(catalogo).map(([id, v]) => ({ id, nombre: v.nombre, etapa: v.etapa }))
}
