import { describe, expect, it } from 'vitest'
import { evaluar, artefactos } from './motor.js'
import { ERROR, cita, fuente, hallazgo } from './contrato.js'

const FUENTE = fuente('PMBOK', 'apartado de prueba')

const catalogoFalso = {
  prueba: {
    nombre: 'Artefacto de prueba',
    etapa: 0,
    reglas: [
      {
        id: 'prueba.siempre-falla',
        descripcion: 'Siempre devuelve un error.',
        fuente: FUENTE,
        evaluar: () => [hallazgo({ regla: 'prueba.siempre-falla', mensaje: 'falla', fuente: FUENTE })],
      },
      {
        id: 'prueba.nunca-falla',
        descripcion: 'Nunca devuelve nada.',
        fuente: FUENTE,
        evaluar: () => [],
      },
    ],
  },
}

describe('motor', () => {
  it('junta los hallazgos de todas las reglas del artefacto', () => {
    const r = evaluar('prueba', {}, catalogoFalso)
    expect(r.resumen).toMatchObject({ reglas: 2, total: 1, errores: 1, avisos: 0, pasa: false })
    expect(r.hallazgos[0].fuente).toEqual(FUENTE)
  })

  it('falla con un artefacto que no está en el catálogo', () => {
    expect(() => evaluar('inexistente', {}, catalogoFalso)).toThrow(/inexistente/)
  })

  it('rechaza una regla que no devuelve un arreglo', () => {
    const malo = { prueba: { nombre: 'x', etapa: 0, reglas: [
      { id: 'mala', descripcion: 'd', fuente: FUENTE, evaluar: () => 'no soy arreglo' },
    ] } }
    expect(() => evaluar('prueba', {}, malo)).toThrow(/arreglo/)
  })

  it('rechaza una regla sin fuente, porque ninguna observación va sin cita', () => {
    const malo = { prueba: { nombre: 'x', etapa: 0, reglas: [
      { id: 'mala', descripcion: 'd', evaluar: () => [] },
    ] } }
    expect(() => evaluar('prueba', {}, malo)).toThrow(/fuente/)
  })

  it('lista los artefactos del catálogo real', () => {
    expect(artefactos().map((a) => a.id)).toContain('acta')
  })

  it('no permite construir un hallazgo con gravedad desconocida', () => {
    expect(() => hallazgo({ regla: 'r', gravedad: 'grave', mensaje: 'm', fuente: FUENTE }))
      .toThrow(/Gravedad/)
  })

  it('acepta la gravedad error', () => {
    expect(hallazgo({ regla: 'r', gravedad: ERROR, mensaje: 'm', fuente: FUENTE }).gravedad).toBe('error')
  })

  // Lo que no dice el PMBOK ni la Guía de Scrum no se les atribuye.
  it('rechaza una obra que no está en la lista de citables', () => {
    expect(() => fuente('Wikipedia', 'Historia de usuario')).toThrow(/Obra desconocida/)
    const malo = { prueba: { nombre: 'x', etapa: 0, reglas: [
      { id: 'mala', descripcion: 'd', fuente: { obra: 'Blog', apartado: 'a' }, evaluar: () => [] },
    ] } }
    expect(() => evaluar('prueba', {}, malo)).toThrow(/obra desconocida/)
  })

  it('cita la práctica complementaria con su autor', () => {
    const f = fuente('Práctica complementaria', 'Cohn, User Stories Applied (2004)')
    expect(cita(f)).toBe('Práctica complementaria · Cohn, User Stories Applied (2004)')
  })

  it('cita el PMBOK con su edición', () => {
    expect(cita(fuente('PMBOK', '4.1 Desarrollar el Acta'))).toBe('PMBOK 6.ª ed. · 4.1 Desarrollar el Acta')
  })
})
