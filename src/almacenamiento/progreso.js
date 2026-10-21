/**
 * Avance del estudiante. Vive solo en el navegador: ningún dato personal sale
 * de aquí (regla de diseño 5). Base de la historia H-05.
 */
const CLAVE = 'camino-a-bremen/progreso'
const VERSION = 1

const vacio = () => ({ version: VERSION, etapaActual: 1, artefactos: {} })

/** Lee el avance guardado. Si no hay, está corrupto o es de otra versión, arranca de cero. */
export function leer() {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return vacio()
    const datos = JSON.parse(crudo)
    if (datos?.version !== VERSION) return vacio()
    return { ...vacio(), ...datos }
  } catch {
    return vacio()
  }
}

/** Guarda el avance. Devuelve false si el navegador no deja escribir, sin romper la app. */
export function guardar(progreso) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ ...progreso, version: VERSION }))
    return true
  } catch {
    return false
  }
}

/** Guarda lo que el estudiante escribió en un artefacto. */
export function guardarArtefacto(id, contenido) {
  const p = leer()
  p.artefactos[id] = contenido
  return guardar(p)
}

export function leerArtefacto(id) {
  return leer().artefactos[id] ?? null
}

/** Borra todo. Lo pide el botón de reinicio de H-05. */
export function reiniciar() {
  try {
    localStorage.removeItem(CLAVE)
    return true
  } catch {
    return false
  }
}
