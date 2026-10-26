/**
 * Geometría del mapa. Vertical a propósito: en teléfono el camino se recorre
 * bajando, que es el gesto natural, y en escritorio cabe en una columna.
 */
export const LIENZO = { ancho: 400, alto: 780 }

/** Dónde queda cada destino, en el orden del catálogo. */
export const PUNTOS = {
  molino: [290, 95],
  perro: [110, 200],
  gato: [285, 310],
  gallo: [115, 420],
  bosque: [285, 530],
  casa: [120, 640],
  final: [285, 720],
}

/** Desde aquí hacia abajo hay niebla hasta que la casa se abre. */
export const NIEBLA = 585

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
