import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Campo from './Campo.jsx'
import { CAMPOS, POR_CAMPO } from '../etapas/acta/campos.js'

const pinta = (spec, valor) =>
  renderToStaticMarkup(<Campo spec={spec} valor={valor} onCambio={() => {}} />)

describe('Campo', () => {
  // El fallo que tumbó la pantalla al teclear en «medidas»: el campo se pintó
  // como textarea y el sensor recibió un texto donde esperaba una lista.
  it('pinta todos los campos del acta vacíos sin lanzar', () => {
    for (const c of CAMPOS) expect(() => pinta(c, undefined)).not.toThrow()
  })

  it('pinta todos los campos con el valor que de verdad les toca', () => {
    const porTipo = { corto: 'texto', largo: 'texto largo', lista: ['a', 'b'], fecha: '2026-10-20' }
    for (const c of CAMPOS) expect(() => pinta(c, porTipo[c.tipo])).not.toThrow()
  })

  it('no se cae si lo guardado tiene el tipo equivocado', () => {
    const cruzados = ['texto', ['a'], '', null, 42]
    for (const c of CAMPOS) {
      for (const v of cruzados) expect(() => pinta(c, v)).not.toThrow()
    }
  })

  it('medidas se pinta como lista de entradas, no como textarea', () => {
    const html = pinta(POR_CAMPO.medidas, ['Cuatro reunidos'])
    expect(html).toContain('lista-textos')
    expect(html).not.toContain('<textarea')
    expect(html).toContain('Agregar otra medida')
  })

  it('un campo de fecha se pinta como input de fecha', () => {
    expect(pinta(POR_CAMPO.fechaInicio, '2026-10-20')).toContain('type="date"')
  })
})
