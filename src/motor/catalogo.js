/**
 * Registro de artefactos y sus reglas. Agregar una etapa nueva es agregar un
 * archivo en reglas/ y un renglón aquí. La interfaz no se toca (regla de
 * diseño 8).
 */
import { reglasActa } from './reglas/acta.js'
import { reglasMolino } from './reglas/molino.js'
import { reglasCasa } from './reglas/casa.js'
import { reglasGato } from './reglas/gato.js'
import { reglasPerro } from './reglas/perro.js'
import { reglasGallo } from './reglas/gallo.js'
import { reglasFinal } from './reglas/final.js'

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
  perro: {
    nombre: 'El olfato del perro: matriz de poder e interés',
    etapa: 1,
    reglas: reglasPerro,
  },
  gato: {
    nombre: 'El móvil del gato: estructura de desglose del trabajo',
    etapa: 3,
    reglas: reglasGato,
  },
  gallo: {
    nombre: 'El corral del gallo: cronograma y ruta crítica',
    etapa: 3,
    reglas: reglasGallo,
  },
  casa: {
    nombre: 'La casa de los ladrones: el product backlog de esa noche',
    etapa: 6,
    reglas: reglasCasa,
  },
  final: {
    nombre: 'El acto final: un sprint de una noche y su retrospectiva',
    etapa: 6,
    reglas: reglasFinal,
  },
  // etapa 2 · EDT        -> historia H-04
  // etapa 4 · backlog    -> historia H-08
}
