import { describe, expect, it } from 'vitest'
import { evaluar } from '../motor.js'
import { COMPARTIMENTOS, TARJETAS } from './molino.js'
import { MESA, colocar } from '../../arrastre/colocacion.js'

const MEDIDAS = ['Llegar en 12 días', 'Pasar 1 audición']
const resuelto = () => TARJETAS.filter((t) => t.va !== MESA)
  .reduce((col, t) => colocar(col, t.id, t.va), {})

describe('molino', () => {
  it('cada tarjeta tiene un lugar que existe, una nota y su fuente', () => {
    const lugares = new Set([MESA, ...COMPARTIMENTOS.map((c) => c.id)])
    for (const t of TARJETAS) {
      expect(lugares.has(t.va)).toBe(true)
      expect(t.nota.length).toBeGreaterThan(20)
      expect(t.fuente.obra).toBe('PMBOK')
    }
  })

  // Si un compartimento no tiene tarjetas, nunca se podría completar.
  it('cada compartimento tiene al menos una tarjeta que le toca', () => {
    for (const c of COMPARTIMENTOS) expect(TARJETAS.some((t) => t.va === c.id)).toBe(true)
  })

  it('hay tarjetas que se quedan en la mesa: no todo lo que se sabe va en el acta', () => {
    expect(TARJETAS.filter((t) => t.va === MESA).length).toBeGreaterThan(0)
  })

  it('un hatillo resuelto con dos medidas con cifra pasa', () => {
    const r = evaluar('molino', { colocaciones: resuelto(), medidas: MEDIDAS })
    expect(r.resumen.pasa).toBe(true)
    expect(r.hallazgos).toEqual([])
  })

  it('una tarjeta en el lugar equivocado se señala con su nota y su fuente', () => {
    const col = colocar(resuelto(), 'lobos', 'dentro')
    const h = evaluar('molino', { colocaciones: col, medidas: MEDIDAS }).hallazgos
      .find((x) => x.campo === 'lobos')
    expect(h.gravedad).toBe('error')
    expect(h.mensaje).toMatch(/riesgo/)
    expect(h.fuente.apartado).toMatch(/riesgos/)
  })

  it('una tarjeta de la mesa metida al hatillo también se señala', () => {
    const col = colocar(resuelto(), 'edad', 'interesados')
    const r = evaluar('molino', { colocaciones: col, medidas: MEDIDAS })
    expect(r.hallazgos.some((h) => h.campo === 'edad')).toBe(true)
  })

  it('dice qué compartimento está incompleto sin revelar qué tarjeta falta', () => {
    const col = colocar(resuelto(), 'goteras', MESA)
    const h = evaluar('molino', { colocaciones: col, medidas: MEDIDAS }).hallazgos
      .find((x) => x.regla === 'molino.completo')
    expect(h.campo).toBe('fuera')
    expect(h.mensaje).not.toMatch(/goteras/i)
  })

  it('pide dos medidas de éxito, y sin cifra solo avisa', () => {
    const una = evaluar('molino', { colocaciones: resuelto(), medidas: ['Llegar en 12 días'] })
    expect(una.resumen.pasa).toBe(false)
    const sinCifra = evaluar('molino', { colocaciones: resuelto(), medidas: ['Llegar pronto', 'Tocar bien'] })
    expect(sinCifra.resumen.pasa).toBe(true)
    expect(sinCifra.hallazgos.every((h) => h.gravedad === 'aviso')).toBe(true)
  })

  it('no se cae con lo guardado en cualquier forma', () => {
    for (const malo of [undefined, null, {}, { colocaciones: 'x', medidas: 7 }, { colocaciones: [], medidas: null }]) {
      expect(() => evaluar('molino', malo)).not.toThrow()
    }
  })
})
