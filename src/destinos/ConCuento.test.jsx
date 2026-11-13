import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import ConCuento from './ConCuento.jsx'
import { CUENTOS } from './escenas.js'
import { DESTINOS } from './catalogo.js'

const JUEGOS = DESTINOS.filter((d) => d.tipo === 'juego').map((d) => d.id)
const ANTES_DEL_GIRO = ['molino', 'perro', 'gato', 'gallo']

describe('ConCuento', () => {
  it('cada minijuego tiene su página de cuento', () => {
    for (const id of JUEGOS) {
      expect(CUENTOS[id]?.titulo, id).toBeTruthy()
      expect(CUENTOS[id].parrafos.length, id).toBeGreaterThan(0)
    }
  })

  it('al entrar se ve la página de libro y no el juego', () => {
    const html = renderToStaticMarkup(<ConCuento id="molino"><p>el juego</p></ConCuento>)
    expect(html).toContain(CUENTOS.molino.titulo)
    expect(html).toContain('Empezar →')
    expect(html).not.toContain('el juego')
  })

  it('ninguna página antes de la casa adelanta el giro', () => {
    for (const id of ANTES_DEL_GIRO) {
      const texto = [CUENTOS[id].titulo, ...CUENTOS[id].parrafos].join(' ').toLowerCase()
      expect(texto, id).not.toMatch(/ladr|casa|plan/)
    }
  })
})
