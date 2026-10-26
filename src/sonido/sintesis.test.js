import { describe, expect, it } from 'vitest'
import { DURACION, sintetizar } from './sintesis.js'

describe('tonos de prueba', () => {
  const sr = 8000
  const pistas = sintetizar(sr)

  it('hay una pista por animal y todas miden lo mismo', () => {
    expect(Object.keys(pistas)).toEqual(['burro', 'perro', 'gato', 'gallo'])
    for (const p of Object.values(pistas)) expect(p.length).toBe(Math.round(DURACION * sr))
  })

  it('las cuatro juntas no saturan', () => {
    let pico = 0
    for (let i = 0; i < pistas.burro.length; i++) {
      const suma = pistas.burro[i] + pistas.perro[i] + pistas.gato[i] + pistas.gallo[i]
      if (Number.isNaN(suma)) throw new Error(`NaN en la muestra ${i}`)
      pico = Math.max(pico, Math.abs(suma))
    }
    expect(pico).toBeLessThan(1)
  })

  it('cada pista suena: ninguna es silencio', () => {
    for (const p of Object.values(pistas)) expect(p.some((x) => Math.abs(x) > 0.01)).toBe(true)
  })

  // Si la última muestra no cae cerca de cero, el bucle chasquea al reiniciar.
  it('el bucle cierra sin chasquido', () => {
    for (const p of Object.values(pistas)) expect(Math.abs(p.at(-1))).toBeLessThan(0.02)
  })

  it('es determinista', () => {
    expect(sintetizar(sr).perro).toEqual(pistas.perro)
  })
})
