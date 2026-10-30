import { describe, expect, it } from 'vitest'
import { ILUSTRACIONES, LIENZOS, colocar, ruta } from './catalogo.js'

describe('ilustraciones', () => {
  it('cada ilustración tiene un lienzo conocido', () => {
    for (const i of Object.values(ILUSTRACIONES)) expect(LIENZOS[i.lienzo]).toBeDefined()
  })

  it('sin archivo no hay ruta: se queda el dibujo provisional', () => {
    expect(ruta('animal-burro')).toBeNull()
    expect(ruta('no-existe')).toBeNull()
  })

  // El punto de apoyo del dibujo cae justo donde estaba el provisional.
  it('coloca la imagen por su punto de apoyo', () => {
    const r = colocar('animal-burro', 300, 500, 120)
    expect(r.width).toBe(120)
    expect(r.x + (600 / 1200) * 120).toBeCloseTo(300)
    expect(r.y + (900 / 1000) * r.height).toBeCloseTo(500)
  })
})
