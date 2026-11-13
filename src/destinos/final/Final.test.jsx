import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Final from './Final.jsx'
import { ANIMALES, OBJETIVOS, TAREAS } from '../../motor/reglas/final.js'
import { MESA, colocar } from '../../arrastre/colocacion.js'
import { vacio } from '../../estado/esquema.js'
import { reducir } from '../../estado/taller.js'

const con = (campo, valor, e = vacio()) => reducir(e, { tipo: 'escribir', artefacto: 'final', campo, valor })
const pinta = (e) => renderToStaticMarkup(<Final estado={e} despachar={() => {}} />)

describe('Final', () => {
  it('al llegar se planea: objetivos, trabajo en la mesa y un puesto por animal', () => {
    const html = pinta(vacio())
    for (const o of OBJETIVOS) expect(html).toContain(`value="${o.id}"`)
    for (const t of TAREAS) expect(html).toContain(`data-pieza="${t.id}" data-en="${MESA}"`)
    for (const a of ANIMALES) expect(html).toContain(`data-ranura="${a.id}"`)
  })

  it('cada puesto muestra cuántas horas lleva de su capacidad', () => {
    expect(pinta(con('colocaciones', colocar({}, 'puerta', 'perro')))).toContain('3 / 3 h')
  })

  it('quien ya terminó el taller vuelve al final con su compromiso', () => {
    let e = con('retro', { bien: 'a', mejorar: 'b', compromiso: 'El gallo duerme una siesta.' })
    e = reducir(e, { tipo: 'entregar', artefacto: 'final', resumen: {} })
    e = reducir(e, { tipo: 'llegar', destino: 'final' })
    expect(pinta(e)).toContain('El gallo duerme una siesta.')
  })

  it('no se cae con lo guardado en cualquier forma', () => {
    for (const v of ['x', [1], { burro: 'y' }, null]) expect(() => pinta(con('colocaciones', v))).not.toThrow()
    expect(() => pinta(con('retro', 'x'))).not.toThrow()
  })
})
