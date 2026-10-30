import { describe, expect, it } from 'vitest'
import { DESTINOS, abierto, actual, banda, deNoche } from './catalogo.js'
import { VERSION, migrar, vacio } from '../estado/esquema.js'
import { reducir } from '../estado/taller.js'

const llegar = (estado, ...ids) => ids.reduce((e, destino) => reducir(e, { tipo: 'llegar', destino }), estado)

describe('destinos', () => {
  it('siguen el orden del cuento', () => {
    expect(DESTINOS.map((d) => d.id)).toEqual(['molino', 'perro', 'gato', 'gallo', 'bosque', 'casa', 'final'])
  })

  it('cada destino se abre cuando el anterior quedó recorrido', () => {
    const e = vacio()
    expect(abierto(e, 'molino')).toBe(true)
    expect(abierto(e, 'perro')).toBe(false)
    expect(abierto(llegar(e, 'molino'), 'perro')).toBe(true)
    expect(actual(llegar(e, 'molino', 'perro')).id).toBe('gato')
  })

  it('la banda empieza con el burro y crece con cada animal', () => {
    expect(banda(vacio())).toEqual(['burro'])
    expect(banda(llegar(vacio(), 'molino', 'perro', 'gato'))).toEqual(['burro', 'perro', 'gato'])
  })

  it('cae la noche al llegar al bosque, no antes', () => {
    expect(deNoche(llegar(vacio(), 'molino', 'perro', 'gato'))).toBe(false)
    expect(deNoche(llegar(vacio(), 'molino', 'perro', 'gato', 'gallo'))).toBe(true)
  })

  it('llegar dos veces no cambia la fecha de la primera', () => {
    const una = llegar(vacio(), 'molino')
    expect(reducir(una, { tipo: 'llegar', destino: 'molino' })).toBe(una)
  })

  it('no se cae con un recorrido guardado de otra forma', () => {
    for (const r of [null, 'x', 42, []]) {
      expect(() => actual({ recorrido: r })).not.toThrow()
      expect(banda({ recorrido: r })).toEqual(['burro'])
    }
  })

  it('un expediente de la versión 2 migra sin perder lo escrito y sin música decidida', () => {
    const v2 = { version: 2, artefactos: { acta: { borrador: { vision: 'Ir a Bremen.' } } },
      preferencias: { sonido: false }, bitacora: [] }
    const m = migrar(v2)
    expect(m.version).toBe(VERSION)
    expect(m.artefactos.acta.borrador.vision).toBe('Ir a Bremen.')
    expect(m.recorrido).toEqual({})
    expect(m.preferencias.sonido).toBeNull()
  })
})
