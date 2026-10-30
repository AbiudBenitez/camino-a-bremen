/**
 * Registro de artefactos y sus reglas. Agregar una etapa nueva es agregar un
 * archivo en reglas/ y un renglón aquí. La interfaz no se toca (regla de
 * diseño 8).
 */
import { reglasActa } from './reglas/acta.js'
import { reglasMolino } from './reglas/molino.js'
import { reglasCasa } from './reglas/casa.js'
import { reglasGato } from './reglas/gato.js'

export const CATALOGO = {
  acta: {
    nombre: 'Acta de constitución del proyecto',
    etapa: 1,
    reglas: reglasActa,
  },
  molino: {
    nombre: 'El hatillo del burro: acta de constitución',
    etapa: 1,
    reglas: reglasMolino,
  },
  gato: {
    nombre: 'El móvil del gato: estructura de desglose del trabajo',
    etapa: 3,
    reglas: reglasGato,
  },
  casa: {
    nombre: 'La casa de los ladrones: el product backlog de esa noche',
    etapa: 6,
    reglas: reglasCasa,
  },
  // etapa 2 · EDT        -> historia H-04
  // etapa 3 · ruta crítica -> historia H-06
  // etapa 4 · backlog    -> historia H-08
  // etapa 5 · sprint     -> historia H-11
}
