import { describe, expect, it } from 'vitest'
import { evaluar } from '../motor.js'
import { ACTIVIDADES, renglonBien, resolver } from './gallo.js'

const R = resolver()
const tabla = () => structuredClone(R)
const criticas = ACTIVIDADES.filter((a) => R[a.id].h === 0).map((a) => a.id)
const con = (cambios = {}, c = criticas) => {
  const t = tabla()
  for (const [id, fila] of Object.entries(cambios)) Object.assign(t[id], fila)
  return { tiempos: t, criticas: c }
}
const de = (gallo, regla) => evaluar('gallo', gallo).hallazgos.filter((h) => h.regla === regla)

describe('gallo', () => {
  // El viaje dura doce días, como las provisiones del gato.
  it('el viaje dura doce días y su ruta crítica es A, C, E y F', () => {
    expect(Math.max(...ACTIVIDADES.map((a) => R[a.id].tt))).toBe(12)
    expect(criticas).toEqual(['A', 'C', 'E', 'F'])
  })

  it('hay al menos una actividad con holgura y una con dos predecesoras', () => {
    expect(ACTIVIDADES.some((a) => R[a.id].h > 0)).toBe(true)
    expect(ACTIVIDADES.some((a) => a.antes.length > 1)).toBe(true)
  })

  it('el cronograma bien calculado pasa', () => {
    const r = evaluar('gallo', con())
    expect(r.hallazgos).toEqual([])
    expect(r.resumen.pasa).toBe(true)
  })

  it('los números escritos como texto también cuentan', () => {
    const t = Object.fromEntries(Object.entries(tabla()).map(([id, f]) =>
      [id, Object.fromEntries(Object.entries(f).map(([k, v]) => [k, String(v)]))]))
    expect(evaluar('gallo', { tiempos: t, criticas }).hallazgos).toEqual([])
  })

  it('dice cuántos números faltan sin decir cuáles', () => {
    const h = de({ tiempos: {}, criticas: [] }, 'gallo.completa')[0]
    expect(h.mensaje).toMatch(/Faltan 30 números/)
  })

  it('un inicio temprano que no espera a su predecesora más tardía se señala ahí, sin arrastrar a las demás', () => {
    // D espera a A (termina el 2) y a B (termina el 1): empezar el 1 es esperar solo a B.
    const hs = de(con({ D: { it: 1, tt: 7 } }), 'gallo.ida')
    expect(hs.map((h) => h.campo)).toEqual(['D'])
    expect(hs[0].mensaje).toMatch(/A y B/)
    expect(hs[0].mensaje).not.toMatch(/\b2\b/)
  })

  it('el paso hacia atrás se revisa contra la sucesora que empieza más temprano', () => {
    const hs = de(con({ A: { tl: 3, il: 1, h: 1 } }, ['C', 'E', 'F']), 'gallo.vuelta')
    expect(hs.map((h) => h.campo)).toEqual(['A'])
    expect(hs[0].mensaje).toMatch(/C y D/)
  })

  it('la holgura mal restada se señala', () => {
    expect(de(con({ B: { h: 1 } }), 'gallo.holgura').map((h) => h.campo)).toEqual(['B'])
  })

  it('la ruta crítica se revisa contra la holgura que escribió el estudiante', () => {
    expect(de(con({}, ['A', 'C', 'D', 'E', 'F']), 'gallo.critica').map((h) => h.campo)).toEqual(['D'])
    expect(de(con({}, ['A', 'C', 'F']), 'gallo.critica').map((h) => h.campo)).toEqual(['E'])
  })

  it('cada regla cita el método de la ruta crítica del PMBOK', () => {
    for (const h of evaluar('gallo', con({ D: { it: 1 } }, [])).hallazgos) {
      expect(h.fuente.obra).toBe('PMBOK')
      expect(h.fuente.apartado).toMatch(/6\.5\.2\.2/)
    }
  })

  it('un renglón se enciende solo cuando sus cinco números cuadran', () => {
    expect(renglonBien(con(), 'D')).toBe(true)
    expect(renglonBien(con({ D: { h: 0 } }), 'D')).toBe(false)
  })

  it('no se cae con lo guardado en cualquier forma', () => {
    for (const malo of [undefined, null, {}, { tiempos: 'x' }, { tiempos: { A: 'y' }, criticas: 'z' }, { tiempos: { A: { it: -1.5 } } }]) {
      expect(() => evaluar('gallo', malo)).not.toThrow()
    }
  })
})
