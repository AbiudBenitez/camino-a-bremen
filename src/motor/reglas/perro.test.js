import { describe, expect, it } from 'vitest'
import { evaluar } from '../motor.js'
import { ACERCA, CUADRANTES, INTERESADOS, PERSONAJES } from './perro.js'
import { MESA, colocar } from '../../arrastre/colocacion.js'

const resuelto = () => INTERESADOS.reduce((c, p) => colocar(c, p.id, p.va), {})

describe('perro', () => {
  it('cada cuadrante tiene al menos un interesado y hay algo que no es interesado', () => {
    for (const c of CUADRANTES) expect(INTERESADOS.some((p) => p.va === c.id)).toBe(true)
    expect(PERSONAJES.some((p) => p.va === MESA)).toBe(true)
  })

  it('la matriz completa pasa', () => {
    const r = evaluar('perro', { colocaciones: resuelto() })
    expect(r.hallazgos).toEqual([])
    expect(r.resumen.pasa).toBe(true)
  })

  it('un interesado mal puesto señala solo el eje que falló', () => {
    // El concejo tiene poder alto e interés bajo: en «informado» fallan los dos ejes; en «cerca», solo el interés.
    const enCerca = evaluar('perro', { colocaciones: colocar(resuelto(), 'concejo', 'cerca') }).hallazgos
      .find((h) => h.campo === 'concejo')
    expect(enCerca.mensaje).toMatch(/interés/)
    expect(enCerca.mensaje).not.toMatch(/¿Su poder/)
    expect(enCerca.fuente.apartado).toMatch(/13\.1\.2\.4/)
    const enInformado = evaluar('perro', { colocaciones: colocar(resuelto(), 'concejo', 'informado') }).hallazgos
      .find((h) => h.campo === 'concejo')
    expect(enInformado.mensaje).toMatch(/¿Su poder/)
    expect(enInformado.mensaje).toMatch(/¿Su interés/)
  })

  it('la lluvia no es interesado: es un riesgo', () => {
    const h = evaluar('perro', { colocaciones: colocar(resuelto(), 'lluvia', 'cerca') }).hallazgos
      .find((x) => x.campo === 'lluvia')
    expect(h.mensaje).toMatch(/riesgo/)
    expect(h.fuente.apartado).toMatch(/^13\.1 /)
  })

  it('dice cuántos interesados faltan sin decir cuáles', () => {
    const h = evaluar('perro', { colocaciones: colocar(resuelto(), 'guardia', MESA) }).hallazgos
      .find((x) => x.regla === 'perro.todos-identificados')
    expect(h.mensaje).toMatch(/Queda un interesado/)
    expect(h.mensaje).not.toMatch(/guardia/)
  })

  // El PMBOK 6.ª ed. no nombra las estrategias de cada cuadrante: no se le atribuyen.
  it('las estrategias se citan a Mendelow, no al PMBOK', () => {
    expect(ACERCA.estrategia.obra).toBe('Práctica complementaria')
    expect(ACERCA.estrategia.apartado).toMatch(/Mendelow/)
  })

  it('cada cuadrante trae su explicación', () => {
    for (const c of CUADRANTES) expect(c.explicacion.length).toBeGreaterThan(60)
  })

  it('no se cae con lo guardado en cualquier forma', () => {
    for (const malo of [undefined, null, {}, { colocaciones: 'x' }, { colocaciones: { cerca: 'y' } }]) {
      expect(() => evaluar('perro', malo)).not.toThrow()
    }
  })
})
