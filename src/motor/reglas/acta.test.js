import { describe, expect, it } from 'vitest'
import { evaluar } from '../motor.js'
import { NUEVE_ELEMENTOS } from './acta.js'

const completa = {
  vision: 'Llevar a los cuatro músicos a Bremen antes del invierno.',
  objetivos: 'Reunir al grupo, llegar a Bremen y conseguir un puesto de músicos.',
  alcance: 'El viaje y la presentación. No incluye construir la casa.',
  entregables: 'Grupo reunido, ruta recorrida, presentación hecha.',
  interesados: 'Los cuatro animales y el ayuntamiento de Bremen.',
  roles: 'El burro propone, los demás ejecutan.',
  enfoque: 'Por etapas, sumando un integrante en cada tramo.',
  hitos: 'Salida de la granja, encuentro de los cuatro, llegada.',
  riesgos: 'Hambre, frío y una casa de ladrones no prevista.',
  medidas: ['Cuatro integrantes reunidos', 'Llegar en 30 días o menos'],
  fechaInicio: '2026-10-01',
  fechaFin: '2026-10-31',
}

const reglas = (r) => r.hallazgos.map((h) => h.regla)

describe('reglas del acta', () => {
  it('un acta completa pasa sin errores', () => {
    const r = evaluar('acta', completa)
    expect(r.resumen.errores).toBe(0)
    expect(r.resumen.pasa).toBe(true)
  })

  it('un acta vacía reclama los nueve elementos', () => {
    const r = evaluar('acta', {})
    const faltantes = r.hallazgos.filter((h) => h.regla === 'acta.elementos-presentes')
    expect(faltantes).toHaveLength(NUEVE_ELEMENTOS.length)
  })

  it('cada hallazgo trae su cita', () => {
    const r = evaluar('acta', {})
    for (const h of r.hallazgos) {
      expect(h.fuente.obra).toBeTruthy()
      expect(h.fuente.apartado).toBeTruthy()
    }
  })

  it('marca la visión de varias oraciones', () => {
    const r = evaluar('acta', { ...completa, vision: 'Llegar a Bremen. Y ser músicos.' })
    expect(reglas(r)).toContain('acta.vision-una-oracion')
  })

  it('exige al menos dos medidas de éxito', () => {
    const r = evaluar('acta', { ...completa, medidas: ['Llegar a Bremen'] })
    expect(reglas(r)).toContain('acta.medidas-de-exito')
    expect(r.resumen.errores).toBeGreaterThan(0)
  })

  it('avisa de una medida sin cifra, pero no la cuenta como error', () => {
    const r = evaluar('acta', { ...completa, medidas: ['Que el público aplauda', 'Llegar en 30 días'] })
    expect(r.resumen.avisos).toBe(1)
    expect(r.resumen.errores).toBe(0)
  })

  it('detecta el fin anterior al inicio', () => {
    const r = evaluar('acta', { ...completa, fechaFin: '2026-09-01' })
    expect(reglas(r)).toContain('acta.fechas-coherentes')
  })

  it('reclama las fechas faltantes', () => {
    const r = evaluar('acta', { ...completa, fechaInicio: '', fechaFin: '' })
    const f = r.hallazgos.filter((h) => h.regla === 'acta.fechas-coherentes')
    expect(f).toHaveLength(2)
  })
})
