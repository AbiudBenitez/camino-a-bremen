import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Perro from './Perro.jsx'
import { CUADRANTES, PERSONAJES } from '../../motor/reglas/perro.js'
import { MESA, colocar } from '../../arrastre/colocacion.js'
import { vacio } from '../../estado/esquema.js'
import { reducir } from '../../estado/taller.js'

const con = (valor) => reducir(vacio(), { tipo: 'escribir', artefacto: 'perro', campo: 'colocaciones', valor })
const pinta = (e) => renderToStaticMarkup(<Perro estado={e} despachar={() => {}} />)

describe('Perro', () => {
  it('al llegar, todos los personajes están en la mesa y cada cuadrante espera los suyos', () => {
    const html = pinta(vacio())
    for (const p of PERSONAJES) expect(html).toContain(`data-pieza="${p.id}" data-en="${MESA}"`)
    for (const c of CUADRANTES) expect(html).toContain(`data-ranura="${c.id}"`)
  })

  it('cada cuadrante dice su poder y su interés y trae su «!»', () => {
    const html = pinta(vacio())
    expect(html).toContain('Poder alto · interés bajo')
    expect(html.match(/class="explica-boton"/g).length).toBe(CUADRANTES.length + 1)
  })

  it('un interesado colocado aparece en su cuadrante', () => {
    expect(pinta(con(colocar({}, 'banda', 'cerca')))).toContain('data-pieza="banda" data-en="cerca"')
  })

  it('no se cae con lo guardado en cualquier forma', () => {
    for (const v of ['x', [1], { cerca: 'y' }, null]) expect(() => pinta(con(v))).not.toThrow()
  })
})
