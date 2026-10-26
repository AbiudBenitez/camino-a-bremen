/**
 * Dónde está cada pieza. Funciones puras: los minijuegos guardan esto en el
 * borrador de su artefacto y el motor lo evalúa como cualquier otro artefacto.
 *
 * Forma: { [ranura]: [pieza, pieza, …] }. Cada ranura es una lista ordenada,
 * porque en la casa el orden de la pila es el orden del backlog. Una pieza que
 * no aparece en ninguna ranura está en la mesa.
 */

/** La mesa también es una ranura: soltar ahí es devolver la pieza. */
export const MESA = '__mesa'

/** Lo guardado no se asume con forma: puede venir de otra versión o a mano. */
export function normalizar(col) {
  if (!col || typeof col !== 'object' || Array.isArray(col)) return {}
  const vistas = new Set()
  const out = {}
  for (const [ranura, lista] of Object.entries(col)) {
    if (ranura === MESA || !Array.isArray(lista)) continue
    out[ranura] = lista.filter((p) => {
      if (typeof p !== 'string' || vistas.has(p)) return false
      vistas.add(p)
      return true
    })
  }
  return out
}

export function donde(col, pieza) {
  for (const [ranura, lista] of Object.entries(normalizar(col))) {
    if (lista.includes(pieza)) return ranura
  }
  return MESA
}

export function quitar(col, pieza) {
  const base = normalizar(col)
  return Object.fromEntries(Object.entries(base).map(([r, l]) => [r, l.filter((p) => p !== pieza)]))
}

/**
 * Coloca una pieza. Con `indice` entra antes de la pieza que estaba en esa
 * posición; sin él, al final. Con `cupo`, si la ranura se llena, la pieza que
 * ya estaba regresa a la mesa: sustituir es más natural que rechazar.
 */
export function colocar(col, pieza, ranura, { indice, cupo } = {}) {
  const antes = normalizar(col)
  const base = quitar(antes, pieza)
  if (ranura === MESA) return base

  const lista = [...(base[ranura] ?? [])]
  const previa = (antes[ranura] ?? []).indexOf(pieza)
  let i = lista.length
  if (Number.isInteger(indice)) {
    // El índice viene de la lista original: si la pieza estaba arriba, quitarla recorrió las demás.
    i = previa !== -1 && previa < indice ? indice - 1 : indice
  }
  lista.splice(Math.max(0, Math.min(lista.length, i)), 0, pieza)

  while (cupo && lista.length > cupo) lista.splice(lista.findIndex((p) => p !== pieza), 1)
  return { ...base, [ranura]: lista }
}

/** Las piezas que siguen en la mesa, en el orden de autoría. */
export const enMesa = (piezas, col) => piezas.filter((p) => donde(col, p) === MESA)
