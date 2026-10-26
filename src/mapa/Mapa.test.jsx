import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Mapa from './Mapa.jsx'
import Banda from './Banda.jsx'
import Escena from '../destinos/Escena.jsx'
import { DESTINOS } from '../destinos/catalogo.js'
import { vacio } from '../estado/esquema.js'
import { reducir } from '../estado/taller.js'

const hasta = (n) => DESTINOS.slice(0, n).reduce(
  (e, d) => reducir(e, { tipo: 'llegar', destino: d.id }), vacio())

describe('Mapa', () => {
  it('se pinta en cada punto del camino sin lanzar', () => {
    for (let n = 0; n <= DESTINOS.length; n++) {
      expect(() => renderToStaticMarkup(<Mapa estado={hasta(n)} />)).not.toThrow()
    }
  })

  // El giro no se anuncia: la casa no existe en el DOM, ni para un lector de pantalla.
  it('la casa y el final no están en el mapa hasta que se recorre el bosque', () => {
    const antes = renderToStaticMarkup(<Mapa estado={hasta(4)} />)
    expect(antes).not.toContain('#destino-casa')
    expect(antes).not.toContain('La casa')
    expect(antes).not.toContain('El acto final')
    expect(renderToStaticMarkup(<Mapa estado={hasta(5)} />)).toContain('#destino-casa')
  })

  it('solo el destino abierto es enlace', () => {
    const html = renderToStaticMarkup(<Mapa estado={vacio()} />)
    expect(html).toContain('#destino-molino')
    expect(html).not.toContain('#destino-perro')
  })
})

describe('Banda', () => {
  it('cuenta en prosa quién va, sin huecos por llenar', () => {
    expect(renderToStaticMarkup(<Banda estado={vacio()} />)).toContain('Va el burro, solo.')
    expect(renderToStaticMarkup(<Banda estado={hasta(4)} />))
      .toContain('Van el burro, el perro, el gato y el gallo.')
  })
})

describe('Escena', () => {
  it('cada destino que no es el molino tiene una escena que se pinta', () => {
    for (const d of DESTINOS.filter((x) => x.id !== 'molino')) {
      expect(() => renderToStaticMarkup(<Escena id={d.id} despachar={() => {}} />)).not.toThrow()
    }
  })
})
