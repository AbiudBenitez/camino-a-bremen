/**
 * Los siete destinos, en el orden del cuento de los Grimm. El orden es también
 * la puerta: un destino se abre cuando el anterior quedó recorrido.
 *
 *   juego  -> minijuego con reglas citables. Produce un artefacto.
 *   escena -> tramo de cuento. En el sprint 2 el perro, el gallo y el bosque son
 *             escenas; sus minijuegos llegan en el sprint 3.
 *
 * `animal` es quien se suma a la banda al recorrer el destino, y con él su capa
 * de la música.
 */
export const DESTINOS = [
  { id: 'molino', nombre: 'El molino', tipo: 'juego', animal: 'burro', metodo: 'PMI' },
  { id: 'perro', nombre: 'El perro', tipo: 'escena', animal: 'perro', metodo: 'PMI' },
  { id: 'gato', nombre: 'El gato', tipo: 'juego', animal: 'gato', metodo: 'PMI', construido: false },
  { id: 'gallo', nombre: 'El gallo', tipo: 'escena', animal: 'gallo', metodo: 'PMI' },
  { id: 'bosque', nombre: 'El bosque', tipo: 'escena', metodo: 'PMI' },
  { id: 'casa', nombre: 'La casa', tipo: 'juego', metodo: 'Scrum', construido: false },
  { id: 'final', nombre: 'El acto final', tipo: 'juego', metodo: 'Scrum', construido: false },
]

export const ANIMALES = ['burro', 'perro', 'gato', 'gallo']

/** Desde aquí es de noche: la paleta y la música cambian sin anunciarlo. */
export const ANOCHECE = 'bosque'

export const destino = (id) => DESTINOS.find((d) => d.id === id) ?? null

const recorridos = (estado) => {
  const r = estado?.recorrido
  return r && typeof r === 'object' ? r : {}
}

export const recorrido = (estado, id) => Boolean(recorridos(estado)[id])

/** El primer destino sin recorrer. Si ya se recorrieron todos, el último. */
export function actual(estado) {
  return DESTINOS.find((d) => !recorrido(estado, d.id)) ?? DESTINOS.at(-1)
}

export function abierto(estado, id) {
  const i = DESTINOS.findIndex((d) => d.id === id)
  return i === 0 || (i > 0 && recorrido(estado, DESTINOS[i - 1].id))
}

/**
 * La banda que va en el camino. El burro está desde el principio: es quien
 * escapa, y su capa de música suena desde el primer momento.
 */
export function banda(estado) {
  return ANIMALES.filter((a) => a === 'burro'
    || DESTINOS.some((d) => d.animal === a && recorrido(estado, d.id)))
}

/** Cae la noche al llegar al bosque, no al terminarlo. */
export const deNoche = (estado) => abierto(estado, ANOCHECE)
