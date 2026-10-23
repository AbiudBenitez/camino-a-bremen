/**
 * Forma del expediente del estudiante y sus migraciones.
 *
 * Regla que no se rompe: al entregar un artefacto se CONGELA una copia. El
 * borrador se puede seguir editando, pero lo entregado no cambia. De eso
 * depende la etapa 4, donde el taller le cita al estudiante lo que él mismo
 * escribió: si leyera el borrador, bastaría con volver a la etapa 1 y editar el
 * acta para desactivar el giro.
 */
export const VERSION = 2

export function vacio() {
  return {
    version: VERSION,
    creado: new Date().toISOString(),
    actualizado: new Date().toISOString(),
    artefactos: {},
    preferencias: { sonido: false },
    bitacora: [],
  }
}

export function artefactoVacio() {
  return { borrador: {}, entregado: null, entregadoEn: null, intentos: 0, reabierto: false, resumen: null }
}

// Migraciones por version de origen. Nunca se descarta el avance del
// estudiante: un esquema nuevo migra, no borra. Si una migracion falla, el
// respaldo crudo sigue en la otra clave del almacen.
const MIGRACIONES = {
  1: (viejo) => ({
    ...vacio(),
    creado: viejo.creado ?? new Date().toISOString(),
    artefactos: Object.fromEntries(
      Object.entries(viejo.artefactos ?? {}).map(([id, contenido]) => [
        id, { ...artefactoVacio(), borrador: contenido ?? {} },
      ]),
    ),
  }),
}

/** Lleva cualquier version conocida a la vigente. Devuelve null si no se puede. */
export function migrar(datos) {
  if (!datos || typeof datos !== 'object') return null
  let actual = datos
  let vueltas = 0
  while (actual.version !== VERSION) {
    const paso = MIGRACIONES[actual.version]
    if (!paso || vueltas++ > 10) return null
    actual = paso(actual)
  }
  return actual
}

export const BITACORA_MAX = 200
