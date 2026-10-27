import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Molino from './Molino.jsx'
import { TARJETAS } from '../../motor/reglas/molino.js'
import { MESA, colocar } from '../../arrastre/colocacion.js'
import { vacio } from '../../estado/esquema.js'
import { reducir } from '../../estado/taller.js'

const con = (valores) => Object.entries(valores).reduce(
  (e, [campo, valor]) => reducir(e, { tipo: 'escribir', artefacto: 'molino', campo, valor }), vacio())
const pinta = (estado) => renderToStaticMarkup(<Molino estado={estado} despachar={() => {}} />)

describe('Molino', () => {
  it('al llegar, las tarjetas salen como mazo: seis a la vista y en el orden de autoría', () => {
    const html = pinta(vacio())
    const posiciones = TARJETAS.slice(0, 6).map((t) => html.indexOf(`data-pieza="${t.id}" data-en="${MESA}"`))
    expect(posiciones.every((p) => p > -1)).toBe(true)
    expect([...posiciones].sort((a, b) => a - b)).toEqual(posiciones)
    expect(html).not.toContain(`data-pieza="${TARJETAS[6].id}"`)
    expect(html).toContain(`Y ${TARJETAS.length - 6} más en el costal.`)
  })

  it('al colocar una, sale la siguiente del mazo', () => {
    const html = pinta(con({ colocaciones: colocar({}, TARJETAS[0].id, TARJETAS[0].va) }))
    expect(html).toContain(`data-pieza="${TARJETAS[6].id}" data-en="${MESA}"`)
  })

  it('una tarjeta colocada aparece en su compartimento y no en la mesa', () => {
    const html = pinta(con({ colocaciones: colocar({}, 'lobos', 'riesgos') }))
    expect(html).toContain('data-pieza="lobos" data-en="riesgos"')
    expect(html).not.toContain(`data-pieza="lobos" data-en="${MESA}"`)
  })

  it('el enfoque predictivo ya viene puesto: es lo que la casa va a romper', () => {
    expect(pinta(vacio())).toContain('se planifica el camino completo')
  })

  it('no se cae con lo guardado en cualquier forma', () => {
    for (const valores of [{ colocaciones: 'x' }, { colocaciones: [1, 2] }, { medidas: 42 }, { medidas: null }]) {
      expect(() => pinta(con(valores))).not.toThrow()
    }
  })
})
