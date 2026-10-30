import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Gato from './Gato.jsx'
import { PIEZAS, RAMAS } from '../../motor/reglas/gato.js'
import { MESA, colocar } from '../../arrastre/colocacion.js'
import { vacio } from '../../estado/esquema.js'
import { reducir } from '../../estado/taller.js'

const con = (valor) => reducir(vacio(), { tipo: 'escribir', artefacto: 'gato', campo: 'colocaciones', valor })
const pinta = (e) => renderToStaticMarkup(<Gato estado={e} despachar={() => {}} />)

describe('Gato', () => {
  it('al llegar, todas las piezas están en la mesa y cada rama espera las suyas', () => {
    const html = pinta(vacio())
    for (const p of PIEZAS) expect(html).toContain(`data-pieza="${p.id}" data-en="${MESA}"`)
    for (const r of RAMAS) expect(html).toContain(`data-ranura="${r.id}"`)
  })

  it('cada pieza muestra sus horas: la regla 8/80 se juega con ellas', () => {
    expect(pinta(vacio())).toContain('· 120 h')
  })

  it('el móvil se inclina hacia el lado con más peso', () => {
    expect(pinta(con(colocar({}, 'ruta', 'viaje')))).toContain('rotate(4deg)')
    expect(pinta(con(colocar({}, 'perro', 'banda')))).toContain('rotate(-4deg)')
  })

  it('no se cae con lo guardado en cualquier forma', () => {
    for (const v of ['x', [1], { banda: 'y' }, null]) expect(() => pinta(con(v))).not.toThrow()
  })
})
