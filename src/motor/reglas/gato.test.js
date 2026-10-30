import { describe, expect, it } from 'vitest'
import { evaluar } from '../motor.js'
import { PIEZAS, RAMAS } from './gato.js'
import { MESA, colocar } from '../../arrastre/colocacion.js'

const resuelto = () => PIEZAS.filter((p) => p.va !== MESA).reduce((c, p) => colocar(c, p.id, p.va), {})

describe('gato', () => {
  it('cada rama tiene sus paquetes y hay distractores que se quedan en la mesa', () => {
    for (const r of RAMAS) expect(PIEZAS.some((p) => p.va === r.id)).toBe(true)
    expect(PIEZAS.filter((p) => p.va === MESA).length).toBeGreaterThan(0)
  })

  it('los paquetes de trabajo están entre 8 y 80 horas; los distractores de tamaño, fuera', () => {
    for (const p of PIEZAS.filter((x) => x.va !== MESA)) {
      expect(p.horas).toBeGreaterThanOrEqual(8)
      expect(p.horas).toBeLessThanOrEqual(80)
    }
  })

  // El PMBOK no dice la regla del 100 % ni la 8/80: no se le atribuyen.
  it('la regla del 100 % y la 8/80 se citan como práctica complementaria', () => {
    const fuentes = PIEZAS.filter((p) => p.va === MESA).map((p) => p.fuente)
    expect(fuentes.filter((f) => f.obra === 'Práctica complementaria').length).toBeGreaterThanOrEqual(2)
    const cien = evaluar('gato', { colocaciones: {} }).hallazgos.find((h) => h.regla === 'gato.cien-por-ciento')
    expect(cien.fuente.obra).toBe('Práctica complementaria')
  })

  it('el móvil completo pasa', () => {
    const r = evaluar('gato', { colocaciones: resuelto() })
    expect(r.hallazgos).toEqual([])
    expect(r.resumen.pasa).toBe(true)
  })

  it('una actividad colgada se señala por ser actividad', () => {
    const h = evaluar('gato', { colocaciones: colocar(resuelto(), 'viajar', 'viaje') }).hallazgos
      .find((x) => x.campo === 'viajar')
    expect(h.mensaje).toMatch(/actividad/)
    expect(h.fuente.obra).toBe('PMBOK')
  })

  it('un paquete en la rama equivocada dice cuál es la suya', () => {
    const h = evaluar('gato', { colocaciones: colocar(resuelto(), 'perro', 'viaje') }).hallazgos
      .find((x) => x.campo === 'perro')
    expect(h.mensaje).toMatch(/Banda reunida/)
  })

  it('dice qué rama no suma el 100 % sin decir qué le falta', () => {
    const h = evaluar('gato', { colocaciones: colocar(resuelto(), 'ruta', MESA) }).hallazgos
      .find((x) => x.regla === 'gato.cien-por-ciento')
    expect(h.campo).toBe('viaje')
    expect(h.mensaje).not.toMatch(/Ruta/)
  })

  it('no se cae con lo guardado en cualquier forma', () => {
    for (const malo of [undefined, null, {}, { colocaciones: 'x' }, { colocaciones: { banda: 'y' } }]) {
      expect(() => evaluar('gato', malo)).not.toThrow()
    }
  })
})
