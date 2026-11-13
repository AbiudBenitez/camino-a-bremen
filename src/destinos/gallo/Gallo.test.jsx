import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Gallo from './Gallo.jsx'
import { ACTIVIDADES, resolver } from '../../motor/reglas/gallo.js'
import { vacio } from '../../estado/esquema.js'
import { reducir } from '../../estado/taller.js'

const con = (campo, valor) => reducir(vacio(), { tipo: 'escribir', artefacto: 'gallo', campo, valor })
const pinta = (e) => renderToStaticMarkup(<Gallo estado={e} despachar={() => {}} />)

describe('Gallo', () => {
  // La app verifica, no calcula: al llegar no se ve ningún tiempo.
  it('al llegar, la tabla está vacía y la red no muestra ningún tiempo calculado', () => {
    const html = pinta(vacio())
    for (const a of ACTIVIDADES) expect(html).toContain(`id="gallo-${a.id}-it"`)
    expect(html).not.toMatch(/value="\d/)
    expect(html).not.toContain('class="nodo bien')
  })

  it('una caja se enciende cuando su renglón cuadra', () => {
    const r = resolver()
    const html = pinta(con('tiempos', { B: Object.fromEntries(Object.entries(r.B).map(([k, v]) => [k, String(v)])) }))
    expect(html.match(/class="nodo bien/g)?.length).toBe(1)
  })

  it('no se cae con lo guardado en cualquier forma', () => {
    for (const v of ['x', [1], { A: 'y' }, { A: { it: 7 } }, null]) expect(() => pinta(con('tiempos', v))).not.toThrow()
    expect(() => pinta(con('criticas', 'A'))).not.toThrow()
  })
})
