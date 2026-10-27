/**
 * Geometría del mapa. Horizontal, en 16:9: el camino va de izquierda a derecha
 * como se lee el cuento. En teléfono el mapa no se encoge: se desliza de lado.
 */
export const LIENZO = { ancho: 1600, alto: 900 }

/** Dónde queda cada destino, en el orden del catálogo. Sube y baja como un sendero. */
export const PUNTOS = {
  molino: [200, 600],
  perro: [420, 360],
  gato: [640, 590],
  gallo: [860, 350],
  bosque: [1075, 590],
  casa: [1300, 380],
  final: [1460, 620],
}

/** Desde aquí hacia la derecha hay nubes hasta que la casa se abre. */
export const NIEBLA = 1180

/**
 * Tramo curvo entre dos puntos, con tangentes de Catmull-Rom para que el
 * camino no haga picos en cada destino.
 */
export function tramo(puntos, i) {
  const p = (k) => puntos[Math.max(0, Math.min(puntos.length - 1, k))]
  const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)]
  const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
  const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
  const r = (n) => Math.round(n * 10) / 10
  return `M${p1.map(r).join(' ')} C${c1.map(r).join(' ')} ${c2.map(r).join(' ')} ${p2.map(r).join(' ')}`
}
