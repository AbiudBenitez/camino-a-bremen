import { describe, expect, it } from 'vitest'
import { sensor } from './sensores.js'
import { evaluar } from '../../motor/motor.js'
import { CAMPOS, POR_CAMPO } from './campos.js'

describe('sensores', () => {
  it('cuenta las medidas cuando vienen como lista', () => {
    expect(sensor('medidas', ['Cuatro reunidos', 'Llegar en 30 días']).texto)
      .toBe('2 medidas · 1 con cifra')
  })

  // Regresión: un expediente guardado con una versión anterior del formulario
  // puede traer un texto donde ahora va una lista. Eso tumbaba la pantalla
  // entera en cuanto el estudiante tecleaba una letra.
  it('no revienta si lo guardado es texto donde se espera una lista', () => {
    expect(() => sensor('medidas', 'quedó escrito como texto')).not.toThrow()
    expect(sensor('medidas', 'quedó escrito como texto').texto).toBe('1 medida · 0 con cifra')
  })

  it('tolera nulo y vacío', () => {
    expect(sensor('medidas', null).texto).toBe('0 medidas · 0 con cifra')
    expect(sensor('vision', '')).toBeNull()
  })

  it('el aliento del burro se llena con la longitud de la visión', () => {
    expect(sensor('vision', 'Llegar a Bremen.').tension).toBeLessThan(0.2)
    expect(sensor('vision', 'palabra '.repeat(30)).nota).toMatch(/aliento/)
  })
})

describe('el motor no se cae con un artefacto malformado', () => {
  it('medidas como texto no tumba la evaluación', () => {
    expect(() => evaluar('acta', { medidas: 'texto suelto' })).not.toThrow()
  })

  it('un artefacto vacío o basura se evalúa sin lanzar', () => {
    for (const malo of [{}, { medidas: 42 }, { vision: null, medidas: undefined }]) {
      expect(() => evaluar('acta', malo)).not.toThrow()
    }
  })
})

describe('especificación de campos', () => {
  // Esta prueba existe porque el tipo de 'medidas' se perdió en una
  // reescritura y el formulario lo pintó como textarea.
  it('medidas es una lista, no un texto', () => {
    expect(POR_CAMPO.medidas.tipo).toBe('lista')
  })

  it('todo campo declara uno de los cuatro tipos permitidos', () => {
    for (const c of CAMPOS) {
      expect(['corto', 'largo', 'lista', 'fecha']).toContain(c.tipo)
    }
  })

  it('todo campo tiene etiqueta', () => {
    for (const c of CAMPOS) expect(c.etiqueta).toBeTruthy()
  })
})
