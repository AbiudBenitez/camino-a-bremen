import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { PASOS } from './instrucciones.js'
import { DESTINOS } from './catalogo.js'
import { vacio } from '../estado/esquema.js'
import Molino from './molino/Molino.jsx'
import Perro from './perro/Perro.jsx'
import Gato from './gato/Gato.jsx'
import Gallo from './gallo/Gallo.jsx'
import Final from './final/Final.jsx'

const JUEGOS = DESTINOS.filter((d) => d.tipo === 'juego').map((d) => d.id)

describe('Cómo se juega', () => {
  it('cada minijuego tiene de tres a cinco pasos', () => {
    for (const id of JUEGOS) {
      expect(PASOS[id]?.length, id).toBeGreaterThanOrEqual(3)
      expect(PASOS[id].length, id).toBeLessThanOrEqual(5)
    }
  })

  it('los pasos antes de la casa no adelantan el giro', () => {
    for (const id of ['molino', 'perro', 'gato', 'gallo']) {
      expect(PASOS[id].join(' ').toLowerCase(), id).not.toMatch(/ladr|casa/)
    }
  })

  it('cada juego muestra sus pasos al llegar', () => {
    for (const [id, Juego] of Object.entries({ molino: Molino, perro: Perro, gato: Gato, gallo: Gallo, final: Final })) {
      const html = renderToStaticMarkup(<Juego estado={vacio()} despachar={() => {}} />)
      expect(html, id).toContain('Cómo se juega')
      expect(html, id).toContain(PASOS[id][0].slice(0, 30))
    }
  })
})
