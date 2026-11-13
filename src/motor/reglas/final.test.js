import { describe, expect, it } from 'vitest'
import { evaluar } from '../motor.js'
import { ANIMALES, DE_PLANEACION, TAREAS, carga } from './final.js'
import { MESA, colocar } from '../../arrastre/colocacion.js'

// Cada puesto con el animal que lo cuida en el cuento de los Grimm.
const plan = () => colocar(colocar(colocar(colocar({}, 'patio', 'burro'), 'puerta', 'perro'), 'fogon', 'gato'), 'viga', 'gallo')
const retro = { bien: 'Cada quien supo su puesto.', mejorar: 'El gallo casi se duerme.', compromiso: 'El gallo duerme antes de la guardia.' }
const todo = (cambios = {}) => ({ objetivo: 'casa', colocaciones: plan(), retro, ...cambios })
const de = (final, regla) => evaluar('final', final).hallazgos.filter((h) => h.regla === regla)

describe('final', () => {
  it('lo que sirve al objetivo cabe justo en la capacidad de la banda', () => {
    const horas = TAREAS.filter((t) => t.sirve).reduce((s, t) => s + t.horas, 0)
    expect(horas).toBe(ANIMALES.reduce((s, a) => s + a.capacidad, 0))
  })

  it('el sprint completo pasa', () => {
    const r = evaluar('final', todo())
    expect(r.hallazgos).toEqual([])
    expect(r.resumen.pasa).toBe(true)
  })

  it('cualquier reparto que respete la capacidad sirve, no solo el del cuento', () => {
    const otro = colocar(colocar(colocar(colocar({}, 'patio', 'burro'), 'puerta', 'gato'), 'fogon', 'perro'), 'viga', 'gallo')
    expect(evaluar('final', todo({ colocaciones: otro })).resumen.pasa).toBe(true)
  })

  it('un objetivo que es lista o que no cabe en la noche se señala con su razón', () => {
    expect(de(todo({ objetivo: 'todo' }), 'final.objetivo')[0].mensaje).toMatch(/uno solo/)
    expect(de(todo({ objetivo: 'bremen' }), 'final.objetivo')[0].mensaje).toMatch(/dentro del sprint/)
  })

  it('pasarse de la capacidad de un animal se señala con sus horas', () => {
    const h = de(todo({ colocaciones: colocar(plan(), 'puerta', 'gallo') }), 'final.capacidad')[0]
    expect(h.campo).toBe('gallo')
    expect(h.mensaje).toMatch(/2 horas.*5/)
    expect(carga(colocar(plan(), 'puerta', 'gallo'), 'gallo')).toBe(5)
  })

  it('lo que no sirve al objetivo no entra al sprint', () => {
    expect(de(todo({ colocaciones: colocar(plan(), 'ensayar', 'burro') }), 'final.sirve')[0].campo).toBe('ensayar')
  })

  it('dice cuántos puestos faltan sin decir cuáles', () => {
    const h = de(todo({ colocaciones: colocar(plan(), 'viga', MESA) }), 'final.completo')[0]
    expect(h.mensaje).toMatch(/Queda un puesto/)
    expect(h.mensaje).not.toMatch(/viga/)
  })

  it('la retrospectiva vacía es error; un compromiso muy corto es solo aviso', () => {
    expect(de(todo({ retro: {} }), 'final.retrospectiva')[0].gravedad).toBe('error')
    const corto = evaluar('final', todo({ retro: { ...retro, compromiso: 'Dormir más' } }))
    expect(corto.hallazgos[0].gravedad).toBe('aviso')
    expect(corto.resumen.pasa).toBe(true)
  })

  it('la planeación se revisa sin la retrospectiva', () => {
    const hs = evaluar('final', { objetivo: 'casa', colocaciones: plan() }).hallazgos
      .filter((h) => DE_PLANEACION.includes(h.regla))
    expect(hs).toEqual([])
  })

  it('todo se cita a la Guía de Scrum', () => {
    for (const h of evaluar('final', {}).hallazgos) expect(h.fuente.obra).toBe('Guía de Scrum')
  })

  it('no se cae con lo guardado en cualquier forma', () => {
    for (const malo of [undefined, null, {}, { colocaciones: 'x', retro: 'y' }, { colocaciones: { burro: 'y' }, objetivo: 7 }]) {
      expect(() => evaluar('final', malo)).not.toThrow()
    }
  })
})
