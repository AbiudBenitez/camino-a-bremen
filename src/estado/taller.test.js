import { describe, expect, it } from 'vitest'
import { VERSION, migrar, vacio } from './esquema.js'
import { borrador, entregado, estadoEtapa, expediente, puedeEntrar, reducir } from './taller.js'

const escribir = (e, campo, valor) =>
  reducir(e, { tipo: 'escribir', artefacto: 'acta', campo, valor })

describe('expediente', () => {
  it('escribir toca el borrador y no lo entregado', () => {
    let e = escribir(vacio(), 'vision', 'Llegar a Bremen.')
    expect(borrador(e, 'acta').vision).toBe('Llegar a Bremen.')
    expect(entregado(e, 'acta')).toBeNull()
  })

  it('entregar congela una copia', () => {
    let e = escribir(vacio(), 'vision', 'Llegar a Bremen.')
    e = reducir(e, { tipo: 'entregar', artefacto: 'acta', resumen: { pasa: true } })
    e = escribir(e, 'vision', 'Ya no quiero ir a Bremen.')
    expect(borrador(e, 'acta').vision).toBe('Ya no quiero ir a Bremen.')
    expect(entregado(e, 'acta').vision).toBe('Llegar a Bremen.')
  })

  it('editar después de entregar marca la etapa como reabierta', () => {
    let e = escribir(vacio(), 'vision', 'A.')
    e = reducir(e, { tipo: 'entregar', artefacto: 'acta', resumen: { pasa: true } })
    expect(e.artefactos.acta.reabierto).toBe(false)
    e = escribir(e, 'vision', 'B.')
    expect(e.artefactos.acta.reabierto).toBe(true)
  })

  it('el expediente solo expone lo entregado', () => {
    let e = escribir(vacio(), 'vision', 'Borrador sin entregar.')
    expect(expediente(e)).toEqual({})
    e = reducir(e, { tipo: 'entregar', artefacto: 'acta', resumen: { pasa: true } })
    expect(expediente(e).acta.vision).toBe('Borrador sin entregar.')
  })

  it('la etapa 2 está cerrada hasta entregar el acta', () => {
    let e = vacio()
    expect(puedeEntrar(1, e)).toBe(true)
    expect(puedeEntrar(2, e)).toBe(false)
    e = reducir(e, { tipo: 'entregar', artefacto: 'acta', resumen: { pasa: true } })
    expect(puedeEntrar(2, e)).toBe(true)
  })

  it('la etapa se sella solo si la entrega pasó', () => {
    let e = vacio()
    expect(estadoEtapa(1, e, 'acta')).toBe('abierta')
    e = reducir(e, { tipo: 'entregar', artefacto: 'acta', resumen: { pasa: false } })
    expect(estadoEtapa(1, e, 'acta')).toBe('entregada')
    e = reducir(e, { tipo: 'entregar', artefacto: 'acta', resumen: { pasa: true } })
    expect(estadoEtapa(1, e, 'acta')).toBe('sellada')
  })

  it('la bitácora registra cada entrega', () => {
    let e = reducir(vacio(), { tipo: 'entregar', artefacto: 'acta', resumen: { pasa: false, errores: 3 } })
    expect(e.bitacora).toHaveLength(1)
    expect(e.bitacora[0].tipo).toBe('entrega')
  })
})

describe('migraciones', () => {
  it('un expediente de la versión 1 conserva lo escrito', () => {
    const v1 = { version: 1, artefactos: { acta: { vision: 'Lo de antes.' } } }
    const m = migrar(v1)
    expect(m.version).toBe(VERSION)
    expect(m.artefactos.acta.borrador.vision).toBe('Lo de antes.')
    expect(m.artefactos.acta.entregado).toBeNull()
  })

  it('la versión vigente pasa sin tocarse', () => {
    const e = vacio()
    expect(migrar(e)).toBe(e)
  })

  it('basura devuelve null en vez de romper', () => {
    expect(migrar(null)).toBeNull()
    expect(migrar({ version: 99 })).toBeNull()
  })
})
