import { describe, expect, it } from 'vitest'
import { evaluar } from '../motor.js'
import { HISTORIAS, LO_QUE_IMPORTA, PILA } from './casa.js'

const ordenadas = HISTORIAS.filter((h) => h.valor !== null).sort((a, b) => a.valor - b.valor).map((h) => h.id)
const PROPIA = { como: 'banda', quiero: 'arreglar el techo de la casa', para: 'no mojarnos cuando llueva' }
const casa = (pila, propia = PROPIA) => ({ colocaciones: { [PILA]: pila }, propia })

describe('casa de los ladrones', () => {
  it('hay una historia por cada cosa que dice el burro, y distractores', () => {
    expect(ordenadas).toHaveLength(LO_QUE_IMPORTA.length)
    expect(HISTORIAS.filter((h) => h.valor === null).length).toBeGreaterThan(0)
  })

  it('cada distractor explica por qué no va, con su fuente', () => {
    for (const h of HISTORIAS.filter((x) => x.valor === null)) {
      expect(h.nota.length).toBeGreaterThan(30)
      expect(h.fuente.obra).toBeTruthy()
    }
  })

  // Lo que no dice la Guía de Scrum no se le atribuye.
  it('la forma de las historias se cita a Cohn, no a la Guía de Scrum', () => {
    const forma = evaluar('casa', casa(ordenadas, {})).hallazgos.find((h) => h.regla === 'casa.historia-propia')
    expect(forma.fuente.obra).toBe('Práctica complementaria')
  })

  it('la pila ordenada por valor con una historia propia completa pasa', () => {
    const r = evaluar('casa', casa(ordenadas))
    expect(r.hallazgos).toEqual([])
    expect(r.resumen.pasa).toBe(true)
  })

  it('un distractor en la pila se señala con su nota', () => {
    const h = evaluar('casa', casa([...ordenadas.slice(0, 3), 'logotipo'])).hallazgos
    expect(h.some((x) => x.campo === 'logotipo')).toBe(true)
  })

  it('dice cuántas faltan, no cuáles', () => {
    const h = evaluar('casa', casa(ordenadas.slice(0, 2))).hallazgos.find((x) => x.regla === 'casa.completa')
    expect(h.mensaje).toMatch(/2 historias/)
    expect(h.mensaje).not.toMatch(/dormir|vigile/)
  })

  it('señala solo el primer par fuera de orden', () => {
    const r = evaluar('casa', casa(['comer', 'espantar', 'vigilar', 'dormir']))
    const orden = r.hallazgos.filter((x) => x.regla === 'casa.ordenada')
    expect(orden).toHaveLength(1)
    expect(orden[0].campo).toBe('espantar')
  })

  it('la historia propia necesita sus tres partes y no puede ser para los ladrones', () => {
    expect(evaluar('casa', casa(ordenadas, { como: 'banda', quiero: '', para: '' })).resumen.pasa).toBe(false)
    expect(evaluar('casa', casa(ordenadas, { ...PROPIA, como: 'ladrón' })).resumen.pasa).toBe(false)
  })

  it('no se cae con lo guardado en cualquier forma', () => {
    for (const malo of [undefined, null, {}, { colocaciones: 'x', propia: 7 }, { colocaciones: { pila: [1, null] } }]) {
      expect(() => evaluar('casa', malo)).not.toThrow()
    }
  })
})
