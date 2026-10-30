import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Casa from './Casa.jsx'
import { DESTINOS } from '../catalogo.js'
import { HISTORIAS, PILA } from '../../motor/reglas/casa.js'
import { colocar } from '../../arrastre/colocacion.js'
import { vacio } from '../../estado/esquema.js'
import { reducir } from '../../estado/taller.js'

const hasta = (n) => DESTINOS.slice(0, n).reduce((e, d) => reducir(e, { tipo: 'llegar', destino: d.id }), vacio())
const pinta = (estado) => renderToStaticMarkup(<Casa estado={estado} despachar={() => {}} />)

describe('Casa', () => {
  it('al llegar por primera vez empieza por el giro', () => {
    const html = pinta(hasta(5))
    expect(html).toContain('No cabe en ningún lado.')
    expect(html).toContain('se planifica el camino completo')
  })

  // El giro cita lo que el estudiante dejó en su hatillo, no una lista inventada.
  it('el giro muestra el hatillo que el estudiante entregó en el molino', () => {
    let e = reducir(hasta(5), { tipo: 'escribir', artefacto: 'molino', campo: 'colocaciones', valor: { fuera: ['goteras'] } })
    e = reducir(e, { tipo: 'entregar', artefacto: 'molino', resumen: { pasa: true } })
    const html = pinta(e)
    expect(html).toContain('Tu hatillo, tal como salió del molino')
    expect(html).toContain('Arreglar las goteras del molino')
  })

  it('sin hatillo entregado usa el del burro y lo dice', () => {
    expect(pinta(hasta(5))).toContain('El hatillo del burro')
  })

  it('ya recorrida, va directo al backlog con todas las historias en la mesa', () => {
    const html = pinta(hasta(6))
    expect(html).toContain('Cantar frente a la ventana')
    for (const h of HISTORIAS) expect(html).toContain(`data-pieza="${h.id}"`)
  })

  it('no se cae con lo guardado en cualquier forma', () => {
    for (const valor of ['x', [1], { [PILA]: 'no' }, colocar({}, 'espantar', PILA)]) {
      const e = reducir(hasta(6), { tipo: 'escribir', artefacto: 'casa', campo: 'colocaciones', valor })
      expect(() => pinta(reducir(e, { tipo: 'escribir', artefacto: 'casa', campo: 'propia', valor: 7 }))).not.toThrow()
    }
  })
})
