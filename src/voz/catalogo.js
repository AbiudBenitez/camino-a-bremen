/**
 * La voz del taller, separada del motor a proposito.
 *
 * El motor produce hallazgos deterministas con su cita; este archivo decide
 * QUIEN los dice y COMO. Asi quien escribe el cuento no toca codigo de reglas,
 * y las reglas siguen siendo funciones puras que se pueden probar.
 *
 * Reparto: cada animal se queda con una familia de reglas, que son las cuatro
 * tensiones de cualquier proyecto.
 *   burro  -> proposito y alcance. Siempre pregunta para que.
 *   perro  -> esfuerzo y recursos. Se queja del peso.
 *   gato   -> completitud y letra chica. Seco, nunca cruel.
 *   gallo  -> riesgo, tiempo y cambio. Ve lo que viene.
 */
export const PERSONAJES = {
  burro: { nombre: 'El burro', rasgo: 'terco y práctico' },
  perro: { nombre: 'El perro', rasgo: 'fiel y cansado' },
  gato: { nombre: 'El gato', rasgo: 'escéptico y preciso' },
  gallo: { nombre: 'El gallo', rasgo: 'impaciente, ve lo que viene' },
}

// Quien habla por cada regla. Una regla sin entrada aqui se muestra sin voz:
// el taller no se rompe, solo suena mas seco.
const DE_REGLA = {
  'acta.elementos-presentes': 'gato',
  'acta.vision-una-oracion': 'burro',
  'acta.medidas-de-exito': 'gato',
  'acta.fechas-coherentes': 'gallo',
}

// Linea de entrada del personaje, antes del mensaje de la regla. Varia por
// campo donde tiene sentido, para que no suene a plantilla.
const ENTRADAS = {
  'acta.elementos-presentes': [
    'Repasé tu acta de arriba abajo.',
    'Leí lo que escribiste. Falta algo.',
    'Me puse a revisar y hay un hueco.',
  ],
  'acta.vision-una-oracion': [
    'A ver, otra vez desde el principio.',
    'Me la vas a tener que repetir en el camino, así que:',
  ],
  'acta.medidas-de-exito': [
    'Pregunta incómoda:',
    'Si llegamos a Bremen, ¿cómo sabemos que salió bien?',
  ],
  'acta.fechas-coherentes': [
    'Yo me despierto temprano, así que esto me importa.',
    'Del tiempo me encargo yo.',
  ],
}

/** Felicitaciones diegeticas: nada de "¡Correcto!". */
export const APROBADO = {
  personaje: 'burro',
  linea: 'Me lo puedo acordar y sé para qué vamos. Por mí, nos vamos.',
}

/** Reparte una linea estable por hallazgo: el mismo hallazgo dice siempre lo
 *  mismo dentro de una sesion, para que no parezca que el taller titubea. */
function entrada(regla, semilla) {
  const opciones = ENTRADAS[regla]
  if (!opciones) return null
  return opciones[semilla % opciones.length]
}

export function vestir(hallazgo, indice = 0) {
  const clave = DE_REGLA[hallazgo.regla]
  if (!clave) return { ...hallazgo, personaje: null, entrada: null }
  return {
    ...hallazgo,
    personaje: { clave, ...PERSONAJES[clave] },
    entrada: entrada(hallazgo.regla, indice),
  }
}

export function vestirTodos(hallazgos) {
  return hallazgos.map((h, i) => vestir(h, i))
}
