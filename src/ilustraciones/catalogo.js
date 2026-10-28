/**
 * Las ilustraciones hechas a mano por el equipo. Mientras una no llega, el
 * taller usa su dibujo provisional en SVG; cuando llega, se copia el archivo a
 * `public/ilustraciones/` y se escribe su nombre aquí. Nada más cambia.
 *
 * Cada lienzo tiene un tamaño fijo y un punto de apoyo: el lugar del dibujo
 * que toca el suelo. El taller coloca la ilustración por ese punto, así que un
 * dibujo nuevo cae justo donde estaba el provisional. Las medidas son las de
 * la guía de ilustración (docs/ilustracion/GUIA.md).
 */
export const LIENZOS = {
  animal: { ancho: 1200, alto: 1000, apoyo: [600, 900] },
  destino: { ancho: 1000, alto: 800, apoyo: [500, 700] },
  mapa: { ancho: 3200, alto: 1800, apoyo: [0, 0] },
}

export const ILUSTRACIONES = {
  'animal-burro': { lienzo: 'animal', archivo: null },
  'animal-perro': { lienzo: 'animal', archivo: null },
  'animal-gato': { lienzo: 'animal', archivo: null },
  'animal-gallo': { lienzo: 'animal', archivo: null },
  'destino-molino': { lienzo: 'destino', archivo: null },
  'destino-perro': { lienzo: 'destino', archivo: null },
  'destino-gato': { lienzo: 'destino', archivo: null },
  'destino-gallo': { lienzo: 'destino', archivo: null },
  'destino-bosque': { lienzo: 'destino', archivo: null },
  'destino-casa': { lienzo: 'destino', archivo: null },
  'destino-final': { lienzo: 'destino', archivo: null },
  'mapa-fondo': { lienzo: 'mapa', archivo: null },
  'mapa-bruma': { lienzo: 'mapa', archivo: null },
}

/** Ruta pública del archivo, o null si todavía no hay ilustración. */
export function ruta(clave) {
  const archivo = ILUSTRACIONES[clave]?.archivo
  return archivo ? `${import.meta.env.BASE_URL}ilustraciones/${archivo}` : null
}

/**
 * Dónde va la imagen para que su punto de apoyo caiga en (x, y) con un ancho
 * dado en el lienzo del mapa o de la escena.
 */
export function colocar(clave, x, y, ancho) {
  const l = LIENZOS[ILUSTRACIONES[clave].lienzo]
  const k = ancho / l.ancho
  return { x: x - l.apoyo[0] * k, y: y - l.apoyo[1] * k, width: ancho, height: l.alto * k }
}
