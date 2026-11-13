/**
 * Reglas del perro: identificar a los interesados y ubicarlos en la matriz de
 * poder e interés.
 *
 * El perro de caza tiene buen olfato: antes de seguir, husmea a quién le
 * importa el viaje y quién puede detenerlo. Cada personaje va al cuadrante que
 * le toca por su poder y su interés; lo que no es interesado se queda fuera.
 *
 * Fuentes: qué es un interesado y que se identifican desde el inicio es del
 * PMBOK (13.1); la matriz de poder e interés como herramienta de
 * representación, también (13.1.2.4). Los nombres de la estrategia de cada
 * cuadrante no vienen del PMBOK 6.ª ed. sino de Mendelow, y se citan así.
 */
import { MESA, donde, normalizar } from '../../arrastre/colocacion.js'
import { ERROR, fuente, hallazgo } from '../contrato.js'

const IDENTIFICAR = fuente('PMBOK', '13.1 Identificar a los Interesados')
const MATRIZ = fuente('PMBOK', '13.1.2.4 Representación de datos: matriz de poder e interés')
const ESTRATEGIA = fuente('Práctica complementaria', 'Mendelow (1991): estrategia para cada cuadrante de poder e interés')

/** Arriba el poder alto, a la derecha el interés alto, como se dibuja la matriz. */
export const CUADRANTES = [
  { id: 'satisfecho', nombre: 'Mantener satisfecho', poder: 'alto', interes: 'bajo',
    explicacion: 'Mucho poder y poco interés. Pueden detener el proyecto aunque no lo sigan de cerca: se les '
      + 'atiende lo suficiente para que no tengan motivo de intervenir, sin saturarlos.' },
  { id: 'cerca', nombre: 'Gestionar de cerca', poder: 'alto', interes: 'alto',
    explicacion: 'Mucho poder y mucho interés. Deciden y les importa: se les involucra en las decisiones y '
      + 'se habla con ellos seguido.' },
  { id: 'monitorear', nombre: 'Monitorear', poder: 'bajo', interes: 'bajo',
    explicacion: 'Poco poder y poco interés. Basta con observar si algo cambia, sin invertir de más en ellos.' },
  { id: 'informado', nombre: 'Mantener informado', poder: 'bajo', interes: 'alto',
    explicacion: 'Poco poder y mucho interés. No deciden, pero les importa: se les cuenta cómo va para que '
      + 'no se sientan fuera y para escuchar lo que ven.' },
]

// `pistaPoder` y `pistaInteres` salen del texto de la tarjeta: el error apunta al
// eje que falló y repite lo que ya se leía, sin regalar el cuadrante.
export const PERSONAJES = [
  { id: 'banda', texto: 'La banda: decide cada paso del viaje y le va la vida en llegar.', va: 'cerca',
    pistaPoder: 'La banda decide cada paso del viaje.', pistaInteres: 'A la banda le va la vida en llegar.' },
  { id: 'concejo', texto: 'El concejo de Bremen: decide quién toca en la ciudad, aunque ni sabe que vamos.', va: 'satisfecho',
    pistaPoder: 'El concejo decide quién toca en la ciudad.', pistaInteres: 'El concejo ni sabe que vamos.' },
  { id: 'musicos', texto: 'Los músicos de Bremen: les importa mucho quién llega a tocar, pero no deciden nada.', va: 'informado',
    pistaPoder: 'Los músicos de Bremen no deciden nada.', pistaInteres: 'A los músicos les importa mucho quién llega.' },
  { id: 'molinero', texto: 'El molinero: ya se deshizo del burro; no puede impedir el viaje y le da igual.', va: 'monitorear',
    pistaPoder: 'El molinero no puede impedir el viaje.', pistaInteres: 'Al molinero le da igual.' },
  { id: 'maestro', texto: 'El maestro de capilla de Bremen: elige a los músicos de la ciudad y anda buscando voces nuevas.', va: 'cerca',
    pistaPoder: 'El maestro de capilla elige a los músicos.', pistaInteres: 'El maestro anda buscando voces nuevas.' },
  { id: 'publico', texto: 'El público de la plaza: se muere por oír música nueva, pero no decide quién toca.', va: 'informado',
    pistaPoder: 'El público no decide quién toca.', pistaInteres: 'El público se muere por oír música nueva.' },
  { id: 'guardia', texto: 'El guardia de la puerta de Bremen: abre o cierra la ciudad, y le da lo mismo quién entre.', va: 'satisfecho',
    pistaPoder: 'El guardia abre o cierra la ciudad.', pistaInteres: 'Al guardia le da lo mismo quién entre.' },
  { id: 'vecinos', texto: 'Los vecinos del molino: a veces oían rebuznar al burro; ni deciden ni les quita el sueño.', va: 'monitorear',
    pistaPoder: 'Los vecinos no deciden nada del viaje.', pistaInteres: 'A los vecinos el viaje no les quita el sueño.' },
  { id: 'lluvia', texto: 'Las nubes de lluvia del camino: si se sueltan, el viaje se atrasa.', va: MESA,
    nota: 'La lluvia puede afectar el viaje, pero es un riesgo, no un interesado: los interesados son personas, '
      + 'grupos u organizaciones.' },
]

const POR_ID = Object.fromEntries(PERSONAJES.map((p) => [p.id, p]))
export const personaje = (id) => POR_ID[id] ?? null
const CUADRANTE = Object.fromEntries(CUADRANTES.map((c) => [c.id, c]))
export const INTERESADOS = PERSONAJES.filter((p) => p.va !== MESA)

/** Por qué no va ahí: el eje que falló, con la pista que ya decía la tarjeta. */
function porQue(p, aqui) {
  if (p.va === MESA) return p.nota
  const c = CUADRANTE[aqui]
  const bien = CUADRANTE[p.va]
  const ejes = []
  if (c.poder !== bien.poder) ejes.push(`${p.pistaPoder} ¿Su poder es ${c.poder}?`)
  if (c.interes !== bien.interes) ejes.push(`${p.pistaInteres} ¿Su interés es ${c.interes}?`)
  return `«${c.nombre}» es para poder ${c.poder} e interés ${c.interes}. ${ejes.join(' ')}`
}

/** Regla 1: cada interesado en su cuadrante; lo que no es interesado, en la mesa. */
const enSuCuadrante = {
  id: 'perro.en-su-cuadrante',
  descripcion: 'Cada interesado va en el cuadrante de su poder y su interés; lo que no es interesado se queda fuera.',
  fuente: MATRIZ,
  evaluar(perro) {
    return PERSONAJES.flatMap((p) => {
      const aqui = donde(perro?.colocaciones, p.id)
      if (!CUADRANTE[aqui] || aqui === p.va) return []
      return [hallazgo({ regla: 'perro.en-su-cuadrante', gravedad: ERROR, campo: p.id,
        fuente: p.va === MESA ? IDENTIFICAR : MATRIZ, mensaje: porQue(p, aqui) })]
    })
  },
}

/** Regla 2: no falta ningún interesado. Dice cuántos, no cuáles. */
const todos = {
  id: 'perro.todos-identificados',
  descripcion: 'Todos los interesados quedan identificados en la matriz.',
  fuente: IDENTIFICAR,
  evaluar(perro) {
    const col = normalizar(perro?.colocaciones)
    const faltan = INTERESADOS.filter((p) => !CUADRANTE[donde(col, p.id)]).length
    if (!faltan) return []
    return [hallazgo({ regla: 'perro.todos-identificados', gravedad: ERROR, campo: 'matriz', fuente: IDENTIFICAR,
      mensaje: `${faltan === 1 ? 'Queda un interesado' : `Quedan ${faltan} interesados`} sin ubicar. Al que se `
        + 'olvida al inicio, el proyecto se lo encuentra después, y casi siempre en contra.' })]
  },
}

export const reglasPerro = [enSuCuadrante, todos]

/** Para los «!» de la pantalla: cada cuadrante con su estrategia y su fuente. */
export const ACERCA = {
  matriz: {
    titulo: 'Matriz de poder e interés',
    fuente: MATRIZ,
    explicacion: 'Ubica a cada interesado según cuánto puede influir en el proyecto (poder) y cuánto le importa '
      + 'lo que pase (interés). El cuadrante sugiere cómo tratarlo; no es una etiqueta fija, porque el poder y '
      + 'el interés cambian a lo largo del proyecto.',
  },
  estrategia: ESTRATEGIA,
}
